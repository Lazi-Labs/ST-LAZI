#!/usr/bin/env tsx

/**
 * Scheduled Sync Service
 * 
 * Runs continuous sync jobs on configurable schedules
 * Uses cron-like intervals for different endpoint priorities
 * 
 * Usage:
 *   npm run sync:scheduled    # Start the scheduler
 */

import { config as dotenvConfig } from 'dotenv';
dotenvConfig();

import { Pool } from 'pg';
import { config } from '../../config/index.js';
import { AVAILABLE_ENDPOINTS, getWorker } from './worker-registry.js';
import { ST_ENDPOINTS } from '../../../discovery/endpoints.js';
import { createLogger } from '../../utils/logger.js';
import { SyncResult } from './base-sync-worker.js';
import { CustomerContactsSync } from './sub-resources/customer-contacts-sync.js';
import { JobNotesSync } from './sub-resources/job-notes-sync.js';

const logger = createLogger({ module: 'scheduled-sync' });

/**
 * Sync schedule configuration
 * Intervals in milliseconds
 */
const SYNC_SCHEDULES = {
  // Priority 1: Critical data - every 5 minutes
  priority1: {
    intervalMs: 5 * 60 * 1000,
    endpoints: ST_ENDPOINTS
      .filter(e => e.priority === 1 && AVAILABLE_ENDPOINTS.includes(e.name))
      .map(e => e.name),
  },
  // Priority 2: Important data - every 15 minutes
  priority2: {
    intervalMs: 15 * 60 * 1000,
    endpoints: ST_ENDPOINTS
      .filter(e => e.priority === 2 && AVAILABLE_ENDPOINTS.includes(e.name))
      .map(e => e.name),
  },
  // Priority 3: Secondary data - every hour
  priority3: {
    intervalMs: 60 * 60 * 1000,
    endpoints: ST_ENDPOINTS
      .filter(e => e.priority === 3 && AVAILABLE_ENDPOINTS.includes(e.name))
      .map(e => e.name),
  },
  // Priority 4: Reference data - every 6 hours
  priority4: {
    intervalMs: 6 * 60 * 60 * 1000,
    endpoints: ST_ENDPOINTS
      .filter(e => e.priority === 4 && AVAILABLE_ENDPOINTS.includes(e.name))
      .map(e => e.name),
  },
};

interface SyncJob {
  priority: string;
  endpoints: string[];
  intervalMs: number;
  lastRun: Date | null;
  nextRun: Date;
  isRunning: boolean;
  stats: {
    totalRuns: number;
    successfulSyncs: number;
    failedSyncs: number;
    totalRecords: number;
  };
}

class ScheduledSyncService {
  private db: Pool;
  private jobs: Map<string, SyncJob> = new Map();
  private isShuttingDown = false;
  private timers: NodeJS.Timeout[] = [];

  constructor() {
    this.db = new Pool({ connectionString: config.database.url });
    this.initializeJobs();
  }

  private initializeJobs() {
    for (const [priority, schedule] of Object.entries(SYNC_SCHEDULES)) {
      if (schedule.endpoints.length === 0) continue;

      this.jobs.set(priority, {
        priority,
        endpoints: schedule.endpoints,
        intervalMs: schedule.intervalMs,
        lastRun: null,
        nextRun: new Date(Date.now() + this.getInitialDelay(priority)),
        isRunning: false,
        stats: {
          totalRuns: 0,
          successfulSyncs: 0,
          failedSyncs: 0,
          totalRecords: 0,
        },
      });
    }
  }

  private getInitialDelay(priority: string): number {
    // Stagger initial runs to avoid thundering herd
    const delays: Record<string, number> = {
      priority1: 0,
      priority2: 30 * 1000,      // 30 seconds
      priority3: 60 * 1000,      // 1 minute
      priority4: 120 * 1000,     // 2 minutes
    };
    return delays[priority] || 0;
  }

  async start() {
    logger.info('Starting scheduled sync service');
    this.printStatus();

    // Set up graceful shutdown
    process.on('SIGINT', () => this.shutdown());
    process.on('SIGTERM', () => this.shutdown());

    // Start job timers
    for (const [priority, job] of this.jobs) {
      this.scheduleJob(priority, job);
    }

    // Keep process running
    await new Promise(() => {});
  }

  private scheduleJob(priority: string, job: SyncJob) {
    const delay = job.nextRun.getTime() - Date.now();
    
    const timer = setTimeout(async () => {
      if (this.isShuttingDown) return;
      
      await this.runJob(priority, job);
      
      // Schedule next run
      job.nextRun = new Date(Date.now() + job.intervalMs);
      this.scheduleJob(priority, job);
    }, Math.max(0, delay));

    this.timers.push(timer);
  }

  private async runJob(priority: string, job: SyncJob) {
    if (job.isRunning) {
      logger.warn({ priority }, 'Job already running, skipping');
      return;
    }

    job.isRunning = true;
    job.lastRun = new Date();
    job.stats.totalRuns++;

    logger.info({ priority, endpoints: job.endpoints.length }, 'Starting scheduled sync');

    let customersWereSynced = false;

    for (const endpoint of job.endpoints) {
      if (this.isShuttingDown) break;

      try {
        const worker = getWorker(endpoint, this.db);
        const result = await worker.sync({ fullSync: false });

        if (result.success) {
          job.stats.successfulSyncs++;
          job.stats.totalRecords += result.recordsFetched;
          logger.info({ endpoint, records: result.recordsFetched }, 'Sync completed');
          
          // Track if customers were synced
          if (endpoint === 'customers' && result.recordsFetched > 0) {
            customersWereSynced = true;
          }
        } else {
          job.stats.failedSyncs++;
          logger.error({ endpoint, errors: result.errors }, 'Sync failed');
        }
      } catch (error: any) {
        job.stats.failedSyncs++;
        logger.error({ endpoint, error: error.message }, 'Sync error');
      }

      // Small delay between endpoints
      await this.sleep(1000);
    }

    // Run contacts sync immediately after customers are synced (any priority)
    if (customersWereSynced && !this.isShuttingDown) {
      logger.info('Customers synced - triggering immediate contacts sync');
      await this.syncCustomerContactsForRecentCustomers();
      // Refresh CRM 360 view with new customer/contact data
      try {
        await this.db.query('SELECT crm.refresh_views()');
        logger.info('CRM 360 view refreshed after customer sync');
      } catch (error: any) {
        logger.error({ error: error.message }, 'CRM 360 refresh failed after customer sync');
      }
    }

    // Run full sub-resource syncs for priority3 (hourly)
    if (priority === 'priority3' && !this.isShuttingDown) {
      await this.runSubResourceSyncs();
    }

    job.isRunning = false;
    logger.info({ priority, stats: job.stats }, 'Scheduled sync completed');
  }

  /**
   * Sync contacts for recently synced customers (event-driven)
   */
  private async syncCustomerContactsForRecentCustomers() {
    try {
      const contactsSync = new CustomerContactsSync(this.db);
      const result = await contactsSync.sync(false);
      logger.info({ fetched: result.fetched, processed: result.processed, errors: result.errors }, 'Immediate contacts sync completed');
    } catch (error: any) {
      logger.error({ error: error.message }, 'Immediate contacts sync failed');
    }
  }

  private async runSubResourceSyncs() {
    logger.info('Starting sub-resource syncs');

    try {
      const contactsSync = new CustomerContactsSync(this.db);
      const contactsResult = await contactsSync.sync(false);
      logger.info({ fetched: contactsResult.fetched, processed: contactsResult.processed, errors: contactsResult.errors }, 'Customer contacts sync completed');
    } catch (error: any) {
      logger.error({ error: error.message }, 'Customer contacts sync failed');
    }

    try {
      const notesSync = new JobNotesSync();
      const notesResult = await notesSync.sync(false);
      logger.info({ fetched: notesResult.fetched, processed: notesResult.processed }, 'Job notes sync completed');
      await notesSync.close();
    } catch (error: any) {
      logger.error({ error: error.message }, 'Job notes sync failed');
    }

    // Refresh CRM 360 materialized view
    try {
      await this.db.query('SELECT crm.refresh_views()');
      logger.info('CRM 360 view refreshed');
    } catch (error: any) {
      logger.error({ error: error.message }, 'CRM 360 view refresh failed');
    }

    logger.info('Sub-resource syncs completed');
  }

  private printStatus() {
    console.log('\n' + '═'.repeat(60));
    console.log('📅 SCHEDULED SYNC SERVICE');
    console.log('═'.repeat(60));
    console.log(`Tenant: ${config.serviceTitan.tenantId}`);
    console.log('');

    for (const [priority, job] of this.jobs) {
      const intervalMin = job.intervalMs / 60000;
      console.log(`${priority.toUpperCase()}:`);
      console.log(`  Endpoints: ${job.endpoints.length}`);
      console.log(`  Interval: ${intervalMin} minutes`);
      console.log(`  Next run: ${job.nextRun.toISOString()}`);
      console.log('');
    }

    console.log('═'.repeat(60));
    console.log('Press Ctrl+C to stop\n');
  }

  private async shutdown() {
    if (this.isShuttingDown) return;
    
    this.isShuttingDown = true;
    logger.info('Shutting down scheduled sync service');

    // Clear all timers
    for (const timer of this.timers) {
      clearTimeout(timer);
    }

    // Wait for running jobs to complete
    const runningJobs = Array.from(this.jobs.values()).filter(j => j.isRunning);
    if (runningJobs.length > 0) {
      logger.info({ count: runningJobs.length }, 'Waiting for running jobs to complete');
      while (runningJobs.some(j => j.isRunning)) {
        await this.sleep(1000);
      }
    }

    await this.db.end();
    logger.info('Scheduled sync service stopped');
    process.exit(0);
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

async function main() {
  const service = new ScheduledSyncService();
  await service.start();
}

main().catch(error => {
  console.error('Failed to start scheduled sync:', error);
  process.exit(1);
});

#!/usr/bin/env tsx

/**
 * Bulk Sync Orchestrator
 * 
 * Syncs multiple endpoints in priority order with concurrency control
 * 
 * Usage:
 *   npm run sync:bulk                    # Sync all priority 1-2 endpoints
 *   npm run sync:bulk -- --priority 3    # Include priority 3
 *   npm run sync:bulk -- --full          # Full sync all
 *   npm run sync:bulk -- --concurrency 3 # Run 3 syncs in parallel
 */

import { config as dotenvConfig } from 'dotenv';
dotenvConfig();

import { Pool } from 'pg';
import { config } from '../../config/index.js';
import { SYNC_WORKERS, AVAILABLE_ENDPOINTS, getWorker } from './worker-registry.js';
import { SyncResult } from './base-sync-worker.js';
import { ST_ENDPOINTS } from '../../../discovery/endpoints.js';
import { createLogger } from '../../utils/logger.js';

const logger = createLogger({ module: 'bulk-sync' });

interface BulkSyncOptions {
  maxPriority: number;
  fullSync: boolean;
  concurrency: number;
  endpoints?: string[];
}

interface BulkSyncResult {
  totalEndpoints: number;
  successful: number;
  failed: number;
  skipped: number;
  totalRecords: number;
  totalDurationMs: number;
  results: SyncResult[];
}

/**
 * Get endpoints to sync based on priority and availability
 */
function getEndpointsToSync(maxPriority: number, specificEndpoints?: string[]): string[] {
  if (specificEndpoints && specificEndpoints.length > 0) {
    return specificEndpoints.filter(e => AVAILABLE_ENDPOINTS.includes(e));
  }

  // Get endpoints by priority that have workers
  return ST_ENDPOINTS
    .filter(e => e.priority <= maxPriority && AVAILABLE_ENDPOINTS.includes(e.name))
    .sort((a, b) => a.priority - b.priority)
    .map(e => e.name);
}

/**
 * Run sync for a single endpoint with error handling
 */
async function syncEndpoint(
  endpoint: string,
  db: Pool,
  fullSync: boolean
): Promise<SyncResult> {
  try {
    const worker = getWorker(endpoint, db);
    return await worker.sync({ fullSync });
  } catch (error: any) {
    return {
      endpoint,
      success: false,
      recordsFetched: 0,
      recordsInserted: 0,
      recordsUpdated: 0,
      errors: [error.message],
      durationMs: 0,
      batchId: '',
    };
  }
}

/**
 * Run bulk sync with concurrency control
 */
async function runBulkSync(options: BulkSyncOptions): Promise<BulkSyncResult> {
  const startTime = Date.now();
  const endpoints = getEndpointsToSync(options.maxPriority, options.endpoints);
  
  const results: SyncResult[] = [];
  let successful = 0;
  let failed = 0;
  let skipped = 0;
  let totalRecords = 0;

  console.log(`\n📦 Bulk Sync Starting`);
  console.log(`   Endpoints: ${endpoints.length}`);
  console.log(`   Priority: 1-${options.maxPriority}`);
  console.log(`   Mode: ${options.fullSync ? 'FULL' : 'INCREMENTAL'}`);
  console.log(`   Concurrency: ${options.concurrency}`);
  console.log(`   Tenant: ${config.serviceTitan.tenantId}\n`);

  // Single pool for all workers
  const db = new Pool({ connectionString: config.database.url });

  // Simple sequential processing (concurrency=1 is most reliable for ST API)
  for (let i = 0; i < endpoints.length; i++) {
    const endpoint = endpoints[i];
    const idx = i + 1;
    
    console.log(`[${idx}/${endpoints.length}] Syncing: ${endpoint}...`);
    
    const result = await syncEndpoint(endpoint, db, options.fullSync);
    results.push(result);

    if (result.success) {
      successful++;
      totalRecords += result.recordsFetched;
      console.log(`[${idx}/${endpoints.length}] ✅ ${endpoint}: ${result.recordsFetched} records (${result.durationMs}ms)`);
    } else {
      failed++;
      console.log(`[${idx}/${endpoints.length}] ❌ ${endpoint}: ${result.errors.join(', ')}`);
    }
  }

  await db.end();

  return {
    totalEndpoints: endpoints.length,
    successful,
    failed,
    skipped,
    totalRecords,
    totalDurationMs: Date.now() - startTime,
    results,
  };
}

async function main() {
  const args = process.argv.slice(2);

  // Parse arguments
  let maxPriority = 2;
  let concurrency = 1;
  const fullSync = args.includes('--full');
  const specificEndpoints: string[] = [];

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--priority' && args[i + 1]) {
      maxPriority = parseInt(args[i + 1], 10);
      i++;
    } else if (args[i] === '--concurrency' && args[i + 1]) {
      concurrency = parseInt(args[i + 1], 10);
      i++;
    } else if (args[i] === '--endpoint' && args[i + 1]) {
      specificEndpoints.push(args[i + 1]);
      i++;
    } else if (!args[i].startsWith('--') && args[i - 1] !== '--priority' && args[i - 1] !== '--concurrency') {
      specificEndpoints.push(args[i]);
    }
  }

  try {
    const result = await runBulkSync({
      maxPriority,
      fullSync,
      concurrency,
      endpoints: specificEndpoints.length > 0 ? specificEndpoints : undefined,
    });

    console.log('\n' + '═'.repeat(60));
    console.log('📊 BULK SYNC SUMMARY');
    console.log('═'.repeat(60));
    console.log(`   Total Endpoints: ${result.totalEndpoints}`);
    console.log(`   Successful: ${result.successful}`);
    console.log(`   Failed: ${result.failed}`);
    console.log(`   Total Records: ${result.totalRecords.toLocaleString()}`);
    console.log(`   Duration: ${(result.totalDurationMs / 1000).toFixed(1)}s`);
    console.log('═'.repeat(60) + '\n');

    if (result.failed > 0) {
      console.log('Failed endpoints:');
      result.results
        .filter(r => !r.success)
        .forEach(r => console.log(`  - ${r.endpoint}: ${r.errors.join(', ')}`));
      console.log('');
      process.exit(1);
    }

  } catch (error: any) {
    console.error('❌ Bulk sync failed:', error.message);
    process.exit(1);
  }
}

main();

/**
 * Base class for all sync workers
 * Handles: batch tracking, error handling, rate limiting, raw→master transform
 */

import { Pool } from 'pg';
import { getSTClient, ServiceTitanClient } from '../../servicetitan/client.js';
import { createLogger } from '../../utils/logger.js';
import { setAuditContext } from '../../utils/audit-context.js';
import { Logger } from 'pino';

export interface SyncResult {
  endpoint: string;
  success: boolean;
  recordsFetched: number;
  recordsInserted: number;
  recordsUpdated: number;
  errors: string[];
  durationMs: number;
  batchId: string;
}

export interface SyncOptions {
  fullSync?: boolean;
  modifiedSince?: Date;
}

export abstract class BaseSyncWorker {
  protected logger: Logger;
  protected stClient: ServiceTitanClient;
  protected db: Pool;

  // Subclasses must define these
  abstract readonly endpointName: string;      // e.g., 'pricebook_services'
  abstract readonly stEndpointPath: string;    // e.g., full URL to ST API
  abstract readonly rawTable: string;          // e.g., 'raw.st_pricebook_services'
  abstract readonly masterTable: string;       // e.g., 'master.pricebook_services'
  abstract readonly stIdField: string;         // e.g., 'id' - field in ST response that is the unique ID

  constructor(db: Pool) {
    this.db = db;
    this.stClient = getSTClient();
    this.logger = createLogger({ module: `sync:${this.constructor.name}` });
  }

  /**
   * Main sync method
   */
  async sync(options: SyncOptions = {}): Promise<SyncResult> {
    const startTime = Date.now();
    const batchId = await this.createBatch();
    const errors: string[] = [];

    let recordsFetched = 0;
    let recordsInserted = 0;
    let recordsUpdated = 0;

    try {
      this.logger.info({ batchId, options }, 'Starting sync');

      // Set audit context for this sync
      await setAuditContext(this.db, {
        actorType: 'sync_worker',
        actorId: this.endpointName,
        syncBatchId: batchId,
      });

      // 1. Fetch from ST API
      const records = await this.fetchFromST(options);
      recordsFetched = records.length;
      this.logger.info({ count: recordsFetched }, 'Fetched records from ST');

      // Detect schema changes (sample first record)
      if (records.length > 0) {
        try {
          await this.db.query(
            'SELECT system.detect_schema_change($1, $2)',
            [this.endpointName, JSON.stringify(records[0])]
          );
        } catch (e) {
          this.logger.warn({ error: e }, 'Schema detection failed');
        }
      }

      if (recordsFetched === 0) {
        this.logger.info('No records to sync');
        await this.completeBatch(batchId, 0, 0, 0, 0);
        return {
          endpoint: this.endpointName,
          success: true,
          recordsFetched: 0,
          recordsInserted: 0,
          recordsUpdated: 0,
          errors: [],
          durationMs: Date.now() - startTime,
          batchId,
        };
      }

      // 2. Upsert to raw table
      const rawResult = await this.upsertToRaw(records, batchId);
      this.logger.info({ inserted: rawResult.inserted, updated: rawResult.updated }, 'Upserted to raw table');

      // 3. Transform to master table
      const masterResult = await this.transformToMaster(batchId);
      recordsInserted = masterResult.inserted;
      recordsUpdated = masterResult.updated;
      this.logger.info({ inserted: recordsInserted, updated: recordsUpdated }, 'Transformed to master table');

      // 4. Complete batch
      await this.completeBatch(batchId, recordsFetched, recordsInserted, recordsUpdated, 0);

      return {
        endpoint: this.endpointName,
        success: true,
        recordsFetched,
        recordsInserted,
        recordsUpdated,
        errors,
        durationMs: Date.now() - startTime,
        batchId,
      };
    } catch (error: any) {
      this.logger.error({ error: error.message, batchId }, 'Sync failed');
      errors.push(error.message);
      await this.failBatch(batchId, error.message);

      return {
        endpoint: this.endpointName,
        success: false,
        recordsFetched,
        recordsInserted,
        recordsUpdated,
        errors,
        durationMs: Date.now() - startTime,
        batchId,
      };
    }
  }

  /**
   * Fetch all records from ServiceTitan
   */
  protected async fetchFromST(options: SyncOptions): Promise<any[]> {
    const params: Record<string, any> = {};

    if (options.modifiedSince && !options.fullSync) {
      params.modifiedOnOrAfter = options.modifiedSince.toISOString();
    }

    return this.stClient.fetchAllPages(this.stEndpointPath, { params });
  }

  /**
   * Insert records to raw table (append-only design)
   * Raw tables are immutable - we always insert new records for each sync batch
   * This preserves history and allows for point-in-time recovery
   */
  protected async upsertToRaw(records: any[], batchId: string): Promise<{ inserted: number; updated: number }> {
    if (records.length === 0) return { inserted: 0, updated: 0 };

    let inserted = 0;

    // Process in batches of 100
    for (let i = 0; i < records.length; i += 100) {
      const batch = records.slice(i, i + 100);

      // Build bulk insert values
      const values: any[] = [];
      const placeholders: string[] = [];
      
      batch.forEach((record, idx) => {
        const offset = idx * 2;
        placeholders.push(`($${offset + 1}, $${offset + 2}, NOW())`);
        values.push(JSON.stringify(record), batchId);
      });

      await this.db.query(`
        INSERT INTO ${this.rawTable} (payload, sync_batch_id, synced_at)
        VALUES ${placeholders.join(', ')}
      `, values);

      inserted += batch.length;

      // Log progress for large syncs
      if (records.length > 500 && (i + 100) % 500 === 0) {
        this.logger.info({ processed: i + 100, total: records.length }, 'Raw insert progress');
      }
    }

    return { inserted, updated: 0 };
  }

  /**
   * Transform from raw to master - OVERRIDE in subclass for custom logic
   */
  protected abstract transformToMaster(batchId: string): Promise<{ inserted: number; updated: number }>;

  /**
   * Create a sync batch record
   */
  protected async createBatch(): Promise<string> {
    const result = await this.db.query(
      `SELECT system.create_sync_batch($1) as batch_id`,
      [this.endpointName]
    );
    return result.rows[0].batch_id;
  }

  /**
   * Mark batch as complete
   */
  protected async completeBatch(
    batchId: string,
    fetched: number,
    inserted: number,
    updated: number,
    unchanged: number
  ): Promise<void> {
    await this.db.query(
      `SELECT system.complete_sync_batch($1, $2, $3, $4, $5)`,
      [batchId, fetched, inserted, updated, unchanged]
    );
  }

  /**
   * Mark batch as failed
   */
  protected async failBatch(batchId: string, error: string): Promise<void> {
    await this.db.query(
      `SELECT system.fail_sync_batch($1, $2)`,
      [batchId, error]
    );
  }

  /**
   * Helper to generate payload hash for change detection
   */
  protected generatePayloadHash(payload: any): string {
    const crypto = require('crypto');
    return crypto.createHash('md5').update(JSON.stringify(payload)).digest('hex');
  }
}

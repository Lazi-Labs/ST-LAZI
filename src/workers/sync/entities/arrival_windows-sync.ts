/**
 * Sync worker for Arrival window definitions
 * Auto-generated from discovery analysis
 */

import { Pool } from 'pg';
import { BaseSyncWorker } from '../base-sync-worker.js';
import { config } from '../../../config/index.js';

export class ArrivalWindowsSyncWorker extends BaseSyncWorker {
  readonly endpointName = 'arrival_windows';
  readonly stEndpointPath = 'https://api.servicetitan.io/dispatch/v2/tenant/3222348440/arrival-windows';
  readonly rawTable = 'raw.st_arrival_windows';
  readonly masterTable = 'master.arrival_windows';
  readonly stIdField = 'id';

  protected async transformToMaster(batchId: string): Promise<{ inserted: number; updated: number }> {
    const result = await this.db.query(`
      INSERT INTO ${this.masterTable} (
        st_id,
        active,
        business_unit_ids,
        duration,
        "start",
        synced_at,
        sync_batch_id,
        payload_hash
      )
      SELECT 
        (payload->>'id')::bigint as st_id,
        (payload->>'active')::boolean as active,
        payload->'businessUnitIds' as business_unit_ids,
        payload->>'duration' as duration,
        payload->>'start' as "start",
        NOW() as synced_at,
        $1::uuid as sync_batch_id,
        md5(payload::text) as payload_hash
      FROM ${this.rawTable}
      WHERE sync_batch_id = $1
      ON CONFLICT (st_id) DO UPDATE SET
        active = EXCLUDED.active,
        business_unit_ids = EXCLUDED.business_unit_ids,
        duration = EXCLUDED.duration,
        "start" = EXCLUDED."start",
        synced_at = NOW(),
        sync_batch_id = EXCLUDED.sync_batch_id,
        payload_hash = EXCLUDED.payload_hash
      RETURNING (xmax = 0) as is_insert
    `, [batchId]);

    const inserted = result.rows.filter(r => r.is_insert).length;
    const updated = result.rows.filter(r => !r.is_insert).length;

    return { inserted, updated };
  }
}

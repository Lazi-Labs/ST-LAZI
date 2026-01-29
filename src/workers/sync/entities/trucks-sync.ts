/**
 * Sync worker for Truck inventory locations
 * Auto-generated from discovery analysis
 */

import { Pool } from 'pg';
import { BaseSyncWorker } from '../base-sync-worker.js';
import { config } from '../../../config/index.js';

export class TrucksSyncWorker extends BaseSyncWorker {
  readonly endpointName = 'trucks';
  readonly stEndpointPath = 'https://api.servicetitan.io/inventory/v2/tenant/3222348440/trucks';
  readonly rawTable = 'raw.st_trucks';
  readonly masterTable = 'master.trucks';
  readonly stIdField = 'id';

  protected async transformToMaster(batchId: string): Promise<{ inserted: number; updated: number }> {
    const result = await this.db.query(`
      INSERT INTO ${this.masterTable} (
        st_id,
        active,
        created_on,
        external_data,
        memo,
        modified_on,
        name,
        technician_ids,
        warehouse_id,
        synced_at,
        sync_batch_id,
        payload_hash
      )
      SELECT 
        (payload->>'id')::bigint as st_id,
        (payload->>'active')::boolean as active,
        (payload->>'createdOn')::timestamptz as created_on,
        payload->>'externalData' as external_data,
        payload->>'memo' as memo,
        (payload->>'modifiedOn')::timestamptz as modified_on,
        payload->>'name' as name,
        payload->'technicianIds' as technician_ids,
        (payload->>'warehouseId')::bigint as warehouse_id,
        NOW() as synced_at,
        $1::uuid as sync_batch_id,
        md5(payload::text) as payload_hash
      FROM ${this.rawTable}
      WHERE sync_batch_id = $1
      ON CONFLICT (st_id) DO UPDATE SET
        active = EXCLUDED.active,
        created_on = EXCLUDED.created_on,
        external_data = EXCLUDED.external_data,
        memo = EXCLUDED.memo,
        modified_on = EXCLUDED.modified_on,
        name = EXCLUDED.name,
        technician_ids = EXCLUDED.technician_ids,
        warehouse_id = EXCLUDED.warehouse_id,
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

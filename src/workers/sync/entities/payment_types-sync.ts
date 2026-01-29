/**
 * Sync worker for Payment type definitions
 * Auto-generated from discovery analysis
 */

import { Pool } from 'pg';
import { BaseSyncWorker } from '../base-sync-worker.js';
import { config } from '../../../config/index.js';

export class PaymentTypesSyncWorker extends BaseSyncWorker {
  readonly endpointName = 'payment_types';
  readonly stEndpointPath = 'https://api.servicetitan.io/accounting/v2/tenant/3222348440/payment-types';
  readonly rawTable = 'raw.st_payment_types';
  readonly masterTable = 'master.payment_types';
  readonly stIdField = 'id';

  protected async transformToMaster(batchId: string): Promise<{ inserted: number; updated: number }> {
    const result = await this.db.query(`
      INSERT INTO ${this.masterTable} (
        st_id,
        created_on,
        modified_on,
        name,
        synced_at,
        sync_batch_id,
        payload_hash
      )
      SELECT 
        (payload->>'id')::bigint as st_id,
        (payload->>'createdOn')::timestamptz as created_on,
        (payload->>'modifiedOn')::timestamptz as modified_on,
        payload->>'name' as name,
        NOW() as synced_at,
        $1::uuid as sync_batch_id,
        md5(payload::text) as payload_hash
      FROM ${this.rawTable}
      WHERE sync_batch_id = $1
      ON CONFLICT (st_id) DO UPDATE SET
        created_on = EXCLUDED.created_on,
        modified_on = EXCLUDED.modified_on,
        name = EXCLUDED.name,
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

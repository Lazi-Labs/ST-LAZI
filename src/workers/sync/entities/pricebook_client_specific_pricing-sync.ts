/**
 * Sync worker for Client-specific pricing rules
 * Auto-generated from discovery analysis
 */

import { Pool } from 'pg';
import { BaseSyncWorker } from '../base-sync-worker.js';
import { config } from '../../../config/index.js';

export class PricebookClientSpecificPricingSyncWorker extends BaseSyncWorker {
  readonly endpointName = 'pricebook_client_specific_pricing';
  readonly stEndpointPath = 'https://api.servicetitan.io/pricebook/v2/tenant/3222348440/clientspecificpricing';
  readonly rawTable = 'raw.st_pricebook_client_specific_pricing';
  readonly masterTable = 'master.pricebook_client_specific_pricing';
  readonly stIdField = 'id';

  protected async transformToMaster(batchId: string): Promise<{ inserted: number; updated: number }> {
    const result = await this.db.query(`
      INSERT INTO ${this.masterTable} (
        st_id,
        exceptions,
        synced_at,
        sync_batch_id,
        payload_hash
      )
      SELECT 
        (payload->>'id')::bigint as st_id,
        payload->'exceptions' as exceptions,
        NOW() as synced_at,
        $1::uuid as sync_batch_id,
        md5(payload::text) as payload_hash
      FROM ${this.rawTable}
      WHERE sync_batch_id = $1
      ON CONFLICT (st_id) DO UPDATE SET
        exceptions = EXCLUDED.exceptions,
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

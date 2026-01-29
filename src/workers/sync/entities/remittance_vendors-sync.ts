/**
 * Sync worker for Remittance vendor definitions
 * Auto-generated from discovery analysis
 */

import { Pool } from 'pg';
import { BaseSyncWorker } from '../base-sync-worker.js';
import { config } from '../../../config/index.js';

export class RemittanceVendorsSyncWorker extends BaseSyncWorker {
  readonly endpointName = 'remittance_vendors';
  readonly stEndpointPath = 'https://api.servicetitan.io/accounting/v2/tenant/3222348440/remittance-vendors';
  readonly rawTable = 'raw.st_remittance_vendors';
  readonly masterTable = 'master.remittance_vendors';
  readonly stIdField = 'id';

  protected async transformToMaster(batchId: string): Promise<{ inserted: number; updated: number }> {
    const result = await this.db.query(`
      INSERT INTO ${this.masterTable} (
        st_id,
        active,
        address,
        contact_info,
        created_on,
        customer_id,
        is_approved,
        is_verified,
        modified_on,
        name,
        synced_at,
        sync_batch_id,
        payload_hash
      )
      SELECT 
        (payload->>'id')::bigint as st_id,
        (payload->>'active')::boolean as active,
        payload->'address' as address,
        payload->'contactInfo' as contact_info,
        (payload->>'createdOn')::timestamptz as created_on,
        payload->>'customerId' as customer_id,
        (payload->>'isApproved')::boolean as is_approved,
        (payload->>'isVerified')::boolean as is_verified,
        (payload->>'modifiedOn')::timestamptz as modified_on,
        payload->>'name' as name,
        NOW() as synced_at,
        $1::uuid as sync_batch_id,
        md5(payload::text) as payload_hash
      FROM ${this.rawTable}
      WHERE sync_batch_id = $1
      ON CONFLICT (st_id) DO UPDATE SET
        active = EXCLUDED.active,
        address = EXCLUDED.address,
        contact_info = EXCLUDED.contact_info,
        created_on = EXCLUDED.created_on,
        customer_id = EXCLUDED.customer_id,
        is_approved = EXCLUDED.is_approved,
        is_verified = EXCLUDED.is_verified,
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

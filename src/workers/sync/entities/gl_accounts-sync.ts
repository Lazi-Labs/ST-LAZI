/**
 * Sync worker for General ledger accounts
 * Auto-generated from discovery analysis
 */

import { Pool } from 'pg';
import { BaseSyncWorker } from '../base-sync-worker.js';
import { config } from '../../../config/index.js';

export class GlAccountsSyncWorker extends BaseSyncWorker {
  readonly endpointName = 'gl_accounts';
  readonly stEndpointPath = 'https://api.servicetitan.io/accounting/v2/tenant/3222348440/gl-accounts';
  readonly rawTable = 'raw.st_gl_accounts';
  readonly masterTable = 'master.gl_accounts';
  readonly stIdField = 'id';

  protected async transformToMaster(batchId: string): Promise<{ inserted: number; updated: number }> {
    const result = await this.db.query(`
      INSERT INTO ${this.masterTable} (
        st_id,
        active,
        created_on,
        default_account_type,
        description,
        is_intacct_bank_account,
        is_intacct_group,
        modified_on,
        name,
        number,
        source,
        subtype,
        type,
        synced_at,
        sync_batch_id,
        payload_hash
      )
      SELECT 
        (payload->>'id')::bigint as st_id,
        (payload->>'active')::boolean as active,
        (payload->>'createdOn')::timestamptz as created_on,
        payload->>'defaultAccountType' as default_account_type,
        payload->>'description' as description,
        (payload->>'isIntacctBankAccount')::boolean as is_intacct_bank_account,
        (payload->>'isIntacctGroup')::boolean as is_intacct_group,
        (payload->>'modifiedOn')::timestamptz as modified_on,
        payload->>'name' as name,
        payload->>'number' as number,
        payload->>'source' as source,
        payload->>'subtype' as subtype,
        payload->>'type' as type,
        NOW() as synced_at,
        $1::uuid as sync_batch_id,
        md5(payload::text) as payload_hash
      FROM ${this.rawTable}
      WHERE sync_batch_id = $1
      ON CONFLICT (st_id) DO UPDATE SET
        active = EXCLUDED.active,
        created_on = EXCLUDED.created_on,
        default_account_type = EXCLUDED.default_account_type,
        description = EXCLUDED.description,
        is_intacct_bank_account = EXCLUDED.is_intacct_bank_account,
        is_intacct_group = EXCLUDED.is_intacct_group,
        modified_on = EXCLUDED.modified_on,
        name = EXCLUDED.name,
        number = EXCLUDED.number,
        source = EXCLUDED.source,
        subtype = EXCLUDED.subtype,
        type = EXCLUDED.type,
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

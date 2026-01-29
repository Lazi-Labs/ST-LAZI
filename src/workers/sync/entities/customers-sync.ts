/**
 * Sync worker for Customer records
 * Auto-generated from discovery analysis
 */

import { Pool } from 'pg';
import { BaseSyncWorker } from '../base-sync-worker.js';
import { config } from '../../../config/index.js';

export class CustomersSyncWorker extends BaseSyncWorker {
  readonly endpointName = 'customers';
  readonly stEndpointPath = 'https://api.servicetitan.io/crm/v2/tenant/3222348440/customers';
  readonly rawTable = 'raw.st_customers';
  readonly masterTable = 'master.customers';
  readonly stIdField = 'id';

  protected async transformToMaster(batchId: string): Promise<{ inserted: number; updated: number }> {
    const result = await this.db.query(`
      INSERT INTO ${this.masterTable} (
        st_id,
        active,
        address,
        balance,
        created_by_id,
        created_on,
        credit_limit,
        credit_limit_balance,
        custom_fields,
        do_not_mail,
        do_not_service,
        external_data,
        merged_to_id,
        modified_on,
        name,
        national_account,
        payment_term_id,
        tag_type_ids,
        tax_exempt,
        type,
        synced_at,
        sync_batch_id,
        payload_hash
      )
      SELECT 
        (payload->>'id')::bigint as st_id,
        (payload->>'active')::boolean as active,
        payload->'address' as address,
        (payload->>'balance')::numeric as balance,
        (payload->>'createdById')::bigint as created_by_id,
        (payload->>'createdOn')::timestamptz as created_on,
        payload->>'creditLimit' as credit_limit,
        payload->>'creditLimitBalance' as credit_limit_balance,
        payload->'customFields' as custom_fields,
        (payload->>'doNotMail')::boolean as do_not_mail,
        (payload->>'doNotService')::boolean as do_not_service,
        payload->>'externalData' as external_data,
        payload->>'mergedToId' as merged_to_id,
        (payload->>'modifiedOn')::timestamptz as modified_on,
        payload->>'name' as name,
        (payload->>'nationalAccount')::boolean as national_account,
        (payload->>'paymentTermId')::bigint as payment_term_id,
        payload->'tagTypeIds' as tag_type_ids,
        (payload->>'taxExempt')::boolean as tax_exempt,
        payload->>'type' as type,
        NOW() as synced_at,
        $1::uuid as sync_batch_id,
        md5(payload::text) as payload_hash
      FROM ${this.rawTable}
      WHERE sync_batch_id = $1
      ON CONFLICT (st_id) DO UPDATE SET
        active = EXCLUDED.active,
        address = EXCLUDED.address,
        balance = EXCLUDED.balance,
        created_by_id = EXCLUDED.created_by_id,
        created_on = EXCLUDED.created_on,
        credit_limit = EXCLUDED.credit_limit,
        credit_limit_balance = EXCLUDED.credit_limit_balance,
        custom_fields = EXCLUDED.custom_fields,
        do_not_mail = EXCLUDED.do_not_mail,
        do_not_service = EXCLUDED.do_not_service,
        external_data = EXCLUDED.external_data,
        merged_to_id = EXCLUDED.merged_to_id,
        modified_on = EXCLUDED.modified_on,
        name = EXCLUDED.name,
        national_account = EXCLUDED.national_account,
        payment_term_id = EXCLUDED.payment_term_id,
        tag_type_ids = EXCLUDED.tag_type_ids,
        tax_exempt = EXCLUDED.tax_exempt,
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

/**
 * Sync worker for Payment term definitions
 * Auto-generated from discovery analysis
 */

import { Pool } from 'pg';
import { BaseSyncWorker } from '../base-sync-worker.js';
import { config } from '../../../config/index.js';

export class PaymentTermsSyncWorker extends BaseSyncWorker {
  readonly endpointName = 'payment_terms';
  readonly stEndpointPath = 'https://api.servicetitan.io/accounting/v2/tenant/3222348440/payment-terms';
  readonly rawTable = 'raw.st_payment_terms';
  readonly masterTable = 'master.payment_terms';
  readonly stIdField = 'id';

  protected async transformToMaster(batchId: string): Promise<{ inserted: number; updated: number }> {
    const result = await this.db.query(`
      INSERT INTO ${this.masterTable} (
        st_id,
        active,
        created_on,
        due_day,
        due_day_type,
        interest_settings,
        in_use,
        is_customer_default,
        is_vendor_default,
        modified_on,
        name,
        payment_term_discount_model,
        synced_at,
        sync_batch_id,
        payload_hash
      )
      SELECT 
        (payload->>'id')::bigint as st_id,
        (payload->>'active')::boolean as active,
        (payload->>'createdOn')::timestamptz as created_on,
        (payload->>'dueDay')::numeric as due_day,
        payload->>'dueDayType' as due_day_type,
        payload->>'interestSettings' as interest_settings,
        (payload->>'inUse')::boolean as in_use,
        (payload->>'isCustomerDefault')::boolean as is_customer_default,
        (payload->>'isVendorDefault')::boolean as is_vendor_default,
        (payload->>'modifiedOn')::timestamptz as modified_on,
        payload->>'name' as name,
        payload->>'paymentTermDiscountModel' as payment_term_discount_model,
        NOW() as synced_at,
        $1::uuid as sync_batch_id,
        md5(payload::text) as payload_hash
      FROM ${this.rawTable}
      WHERE sync_batch_id = $1
      ON CONFLICT (st_id) DO UPDATE SET
        active = EXCLUDED.active,
        created_on = EXCLUDED.created_on,
        due_day = EXCLUDED.due_day,
        due_day_type = EXCLUDED.due_day_type,
        interest_settings = EXCLUDED.interest_settings,
        in_use = EXCLUDED.in_use,
        is_customer_default = EXCLUDED.is_customer_default,
        is_vendor_default = EXCLUDED.is_vendor_default,
        modified_on = EXCLUDED.modified_on,
        name = EXCLUDED.name,
        payment_term_discount_model = EXCLUDED.payment_term_discount_model,
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

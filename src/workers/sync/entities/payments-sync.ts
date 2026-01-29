/**
 * Sync worker for Payment records
 * Auto-generated from discovery analysis
 */

import { Pool } from 'pg';
import { BaseSyncWorker } from '../base-sync-worker.js';
import { config } from '../../../config/index.js';

export class PaymentsSyncWorker extends BaseSyncWorker {
  readonly endpointName = 'payments';
  readonly stEndpointPath = 'https://api.servicetitan.io/accounting/v2/tenant/3222348440/payments';
  readonly rawTable = 'raw.st_payments';
  readonly masterTable = 'master.payments';
  readonly stIdField = 'id';

  protected async transformToMaster(batchId: string): Promise<{ inserted: number; updated: number }> {
    const result = await this.db.query(`
      INSERT INTO ${this.masterTable} (
        st_id,
        active,
        applied_to,
        auth_code,
        batch,
        business_unit,
        check_number,
        created_by,
        created_on,
        customer,
        custom_fields,
        date,
        deposit,
        general_ledger_account,
        memo,
        modified_on,
        reference_number,
        refunded_payment_id,
        sync_status,
        total,
        type,
        type_id,
        unapplied_amount,
        synced_at,
        sync_batch_id,
        payload_hash
      )
      SELECT 
        (payload->>'id')::bigint as st_id,
        (payload->>'active')::boolean as active,
        payload->'appliedTo' as applied_to,
        payload->>'authCode' as auth_code,
        payload->'batch' as batch,
        payload->'businessUnit' as business_unit,
        payload->>'checkNumber' as check_number,
        payload->>'createdBy' as created_by,
        (payload->>'createdOn')::timestamptz as created_on,
        payload->'customer' as customer,
        payload->>'customFields' as custom_fields,
        (payload->>'date')::timestamptz as date,
        payload->'deposit' as deposit,
        payload->'generalLedgerAccount' as general_ledger_account,
        payload->>'memo' as memo,
        (payload->>'modifiedOn')::timestamptz as modified_on,
        payload->>'referenceNumber' as reference_number,
        payload->>'refundedPaymentId' as refunded_payment_id,
        payload->>'syncStatus' as sync_status,
        payload->>'total' as total,
        payload->>'type' as type,
        payload->>'typeId' as type_id,
        payload->>'unappliedAmount' as unapplied_amount,
        NOW() as synced_at,
        $1::uuid as sync_batch_id,
        md5(payload::text) as payload_hash
      FROM ${this.rawTable}
      WHERE sync_batch_id = $1
      ON CONFLICT (st_id) DO UPDATE SET
        active = EXCLUDED.active,
        applied_to = EXCLUDED.applied_to,
        auth_code = EXCLUDED.auth_code,
        batch = EXCLUDED.batch,
        business_unit = EXCLUDED.business_unit,
        check_number = EXCLUDED.check_number,
        created_by = EXCLUDED.created_by,
        created_on = EXCLUDED.created_on,
        customer = EXCLUDED.customer,
        custom_fields = EXCLUDED.custom_fields,
        date = EXCLUDED.date,
        deposit = EXCLUDED.deposit,
        general_ledger_account = EXCLUDED.general_ledger_account,
        memo = EXCLUDED.memo,
        modified_on = EXCLUDED.modified_on,
        reference_number = EXCLUDED.reference_number,
        refunded_payment_id = EXCLUDED.refunded_payment_id,
        sync_status = EXCLUDED.sync_status,
        total = EXCLUDED.total,
        type = EXCLUDED.type,
        type_id = EXCLUDED.type_id,
        unapplied_amount = EXCLUDED.unapplied_amount,
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

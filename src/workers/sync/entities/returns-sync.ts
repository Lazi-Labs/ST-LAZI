/**
 * Sync worker for Inventory returns
 * Auto-generated from discovery analysis
 */

import { Pool } from 'pg';
import { BaseSyncWorker } from '../base-sync-worker.js';
import { config } from '../../../config/index.js';

export class ReturnsSyncWorker extends BaseSyncWorker {
  readonly endpointName = 'returns';
  readonly stEndpointPath = 'https://api.servicetitan.io/inventory/v2/tenant/3222348440/returns';
  readonly rawTable = 'raw.st_returns';
  readonly masterTable = 'master.returns';
  readonly stIdField = 'id';

  protected async transformToMaster(batchId: string): Promise<{ inserted: number; updated: number }> {
    const result = await this.db.query(`
      INSERT INTO ${this.masterTable} (
        st_id,
        active,
        batch,
        batch_id,
        budget_code_id,
        business_unit_id,
        canceled_by_id,
        canceled_reason,
        created_by_id,
        created_on,
        credit_received_on,
        custom_fields,
        date_canceled,
        external_data,
        inventory_location_id,
        items,
        job_id,
        memo,
        modified_on,
        number,
        project_id,
        purchase_order_id,
        reference_number,
        return_amount,
        return_date,
        returned_on,
        shipping_amount,
        status,
        sync_status,
        tax_amount,
        vendor_id,
        synced_at,
        sync_batch_id,
        payload_hash
      )
      SELECT 
        (payload->>'id')::bigint as st_id,
        (payload->>'active')::boolean as active,
        payload->'batch' as batch,
        (payload->>'batchId')::bigint as batch_id,
        payload->>'budgetCodeId' as budget_code_id,
        (payload->>'businessUnitId')::bigint as business_unit_id,
        payload->>'canceledById' as canceled_by_id,
        payload->>'canceledReason' as canceled_reason,
        (payload->>'createdById')::bigint as created_by_id,
        (payload->>'createdOn')::timestamptz as created_on,
        (payload->>'creditReceivedOn')::timestamptz as credit_received_on,
        payload->>'customFields' as custom_fields,
        payload->>'dateCanceled' as date_canceled,
        payload->>'externalData' as external_data,
        (payload->>'inventoryLocationId')::bigint as inventory_location_id,
        payload->'items' as items,
        (payload->>'jobId')::bigint as job_id,
        payload->>'memo' as memo,
        (payload->>'modifiedOn')::timestamptz as modified_on,
        payload->>'number' as number,
        (payload->>'projectId')::bigint as project_id,
        (payload->>'purchaseOrderId')::bigint as purchase_order_id,
        payload->>'referenceNumber' as reference_number,
        (payload->>'returnAmount')::numeric as return_amount,
        (payload->>'returnDate')::timestamptz as return_date,
        (payload->>'returnedOn')::timestamptz as returned_on,
        (payload->>'shippingAmount')::numeric as shipping_amount,
        payload->>'status' as status,
        payload->>'syncStatus' as sync_status,
        (payload->>'taxAmount')::numeric as tax_amount,
        (payload->>'vendorId')::bigint as vendor_id,
        NOW() as synced_at,
        $1::uuid as sync_batch_id,
        md5(payload::text) as payload_hash
      FROM ${this.rawTable}
      WHERE sync_batch_id = $1
      ON CONFLICT (st_id) DO UPDATE SET
        active = EXCLUDED.active,
        batch = EXCLUDED.batch,
        batch_id = EXCLUDED.batch_id,
        budget_code_id = EXCLUDED.budget_code_id,
        business_unit_id = EXCLUDED.business_unit_id,
        canceled_by_id = EXCLUDED.canceled_by_id,
        canceled_reason = EXCLUDED.canceled_reason,
        created_by_id = EXCLUDED.created_by_id,
        created_on = EXCLUDED.created_on,
        credit_received_on = EXCLUDED.credit_received_on,
        custom_fields = EXCLUDED.custom_fields,
        date_canceled = EXCLUDED.date_canceled,
        external_data = EXCLUDED.external_data,
        inventory_location_id = EXCLUDED.inventory_location_id,
        items = EXCLUDED.items,
        job_id = EXCLUDED.job_id,
        memo = EXCLUDED.memo,
        modified_on = EXCLUDED.modified_on,
        number = EXCLUDED.number,
        project_id = EXCLUDED.project_id,
        purchase_order_id = EXCLUDED.purchase_order_id,
        reference_number = EXCLUDED.reference_number,
        return_amount = EXCLUDED.return_amount,
        return_date = EXCLUDED.return_date,
        returned_on = EXCLUDED.returned_on,
        shipping_amount = EXCLUDED.shipping_amount,
        status = EXCLUDED.status,
        sync_status = EXCLUDED.sync_status,
        tax_amount = EXCLUDED.tax_amount,
        vendor_id = EXCLUDED.vendor_id,
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

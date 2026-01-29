/**
 * Sync worker for Inventory receipts
 * Auto-generated from discovery analysis
 */

import { Pool } from 'pg';
import { BaseSyncWorker } from '../base-sync-worker.js';
import { config } from '../../../config/index.js';

export class ReceiptsSyncWorker extends BaseSyncWorker {
  readonly endpointName = 'receipts';
  readonly stEndpointPath = 'https://api.servicetitan.io/inventory/v2/tenant/3222348440/receipts';
  readonly rawTable = 'raw.st_receipts';
  readonly masterTable = 'master.receipts';
  readonly stIdField = 'id';

  protected async transformToMaster(batchId: string): Promise<{ inserted: number; updated: number }> {
    const result = await this.db.query(`
      INSERT INTO ${this.masterTable} (
        st_id,
        active,
        batch_id,
        bill_id,
        budget_code_id,
        business_unit_id,
        created_by_id,
        created_on,
        custom_fields,
        inventory_location_id,
        items,
        job_id,
        memo,
        modified_on,
        number,
        purchase_order_id,
        receipt_amount,
        received_on,
        shipping_amount,
        ship_to,
        ship_to_description,
        sync_status,
        tax_amount,
        technician_id,
        vendor_id,
        vendor_invoice_number,
        synced_at,
        sync_batch_id,
        payload_hash
      )
      SELECT 
        (payload->>'id')::bigint as st_id,
        (payload->>'active')::boolean as active,
        payload->>'batchId' as batch_id,
        (payload->>'billId')::bigint as bill_id,
        payload->>'budgetCodeId' as budget_code_id,
        (payload->>'businessUnitId')::bigint as business_unit_id,
        (payload->>'createdById')::bigint as created_by_id,
        (payload->>'createdOn')::timestamptz as created_on,
        payload->>'customFields' as custom_fields,
        (payload->>'inventoryLocationId')::bigint as inventory_location_id,
        payload->'items' as items,
        (payload->>'jobId')::bigint as job_id,
        payload->>'memo' as memo,
        (payload->>'modifiedOn')::timestamptz as modified_on,
        payload->>'number' as number,
        (payload->>'purchaseOrderId')::bigint as purchase_order_id,
        (payload->>'receiptAmount')::numeric as receipt_amount,
        (payload->>'receivedOn')::timestamptz as received_on,
        (payload->>'shippingAmount')::numeric as shipping_amount,
        payload->'shipTo' as ship_to,
        payload->>'shipToDescription' as ship_to_description,
        payload->>'syncStatus' as sync_status,
        (payload->>'taxAmount')::numeric as tax_amount,
        (payload->>'technicianId')::bigint as technician_id,
        (payload->>'vendorId')::bigint as vendor_id,
        payload->>'vendorInvoiceNumber' as vendor_invoice_number,
        NOW() as synced_at,
        $1::uuid as sync_batch_id,
        md5(payload::text) as payload_hash
      FROM ${this.rawTable}
      WHERE sync_batch_id = $1
      ON CONFLICT (st_id) DO UPDATE SET
        active = EXCLUDED.active,
        batch_id = EXCLUDED.batch_id,
        bill_id = EXCLUDED.bill_id,
        budget_code_id = EXCLUDED.budget_code_id,
        business_unit_id = EXCLUDED.business_unit_id,
        created_by_id = EXCLUDED.created_by_id,
        created_on = EXCLUDED.created_on,
        custom_fields = EXCLUDED.custom_fields,
        inventory_location_id = EXCLUDED.inventory_location_id,
        items = EXCLUDED.items,
        job_id = EXCLUDED.job_id,
        memo = EXCLUDED.memo,
        modified_on = EXCLUDED.modified_on,
        number = EXCLUDED.number,
        purchase_order_id = EXCLUDED.purchase_order_id,
        receipt_amount = EXCLUDED.receipt_amount,
        received_on = EXCLUDED.received_on,
        shipping_amount = EXCLUDED.shipping_amount,
        ship_to = EXCLUDED.ship_to,
        ship_to_description = EXCLUDED.ship_to_description,
        sync_status = EXCLUDED.sync_status,
        tax_amount = EXCLUDED.tax_amount,
        technician_id = EXCLUDED.technician_id,
        vendor_id = EXCLUDED.vendor_id,
        vendor_invoice_number = EXCLUDED.vendor_invoice_number,
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

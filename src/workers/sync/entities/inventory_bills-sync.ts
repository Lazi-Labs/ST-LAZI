/**
 * Sync worker for Inventory bills
 * Auto-generated from discovery analysis
 */

import { Pool } from 'pg';
import { BaseSyncWorker } from '../base-sync-worker.js';
import { config } from '../../../config/index.js';

export class InventoryBillsSyncWorker extends BaseSyncWorker {
  readonly endpointName = 'inventory_bills';
  readonly stEndpointPath = 'https://api.servicetitan.io/accounting/v2/tenant/3222348440/inventory-bills';
  readonly rawTable = 'raw.st_inventory_bills';
  readonly masterTable = 'master.inventory_bills';
  readonly stIdField = 'id';

  protected async transformToMaster(batchId: string): Promise<{ inserted: number; updated: number }> {
    const result = await this.db.query(`
      INSERT INTO ${this.masterTable} (
        st_id,
        batch,
        bill_amount,
        bill_date,
        budget_code_id,
        business_unit,
        created_by,
        created_on,
        custom_fields,
        due_date,
        items,
        job_id,
        job_number,
        modified_on,
        post_date,
        purchase_order_id,
        reference_number,
        shipping_amount,
        ship_to,
        ship_to_description,
        summary,
        sync_status,
        tax_amount,
        tax_zone,
        term_name,
        vendor,
        vendor_number,
        synced_at,
        sync_batch_id,
        payload_hash
      )
      SELECT 
        (payload->>'id')::bigint as st_id,
        payload->'batch' as batch,
        payload->>'billAmount' as bill_amount,
        (payload->>'billDate')::timestamptz as bill_date,
        payload->>'budgetCodeId' as budget_code_id,
        payload->'businessUnit' as business_unit,
        payload->>'createdBy' as created_by,
        (payload->>'createdOn')::timestamptz as created_on,
        payload->>'customFields' as custom_fields,
        (payload->>'dueDate')::timestamptz as due_date,
        payload->'items' as items,
        (payload->>'jobId')::bigint as job_id,
        payload->>'jobNumber' as job_number,
        (payload->>'modifiedOn')::timestamptz as modified_on,
        (payload->>'postDate')::timestamptz as post_date,
        (payload->>'purchaseOrderId')::bigint as purchase_order_id,
        payload->>'referenceNumber' as reference_number,
        payload->>'shippingAmount' as shipping_amount,
        payload->'shipTo' as ship_to,
        payload->>'shipToDescription' as ship_to_description,
        payload->>'summary' as summary,
        payload->>'syncStatus' as sync_status,
        payload->>'taxAmount' as tax_amount,
        payload->>'taxZone' as tax_zone,
        payload->>'termName' as term_name,
        payload->'vendor' as vendor,
        payload->>'vendorNumber' as vendor_number,
        NOW() as synced_at,
        $1::uuid as sync_batch_id,
        md5(payload::text) as payload_hash
      FROM ${this.rawTable}
      WHERE sync_batch_id = $1
      ON CONFLICT (st_id) DO UPDATE SET
        batch = EXCLUDED.batch,
        bill_amount = EXCLUDED.bill_amount,
        bill_date = EXCLUDED.bill_date,
        budget_code_id = EXCLUDED.budget_code_id,
        business_unit = EXCLUDED.business_unit,
        created_by = EXCLUDED.created_by,
        created_on = EXCLUDED.created_on,
        custom_fields = EXCLUDED.custom_fields,
        due_date = EXCLUDED.due_date,
        items = EXCLUDED.items,
        job_id = EXCLUDED.job_id,
        job_number = EXCLUDED.job_number,
        modified_on = EXCLUDED.modified_on,
        post_date = EXCLUDED.post_date,
        purchase_order_id = EXCLUDED.purchase_order_id,
        reference_number = EXCLUDED.reference_number,
        shipping_amount = EXCLUDED.shipping_amount,
        ship_to = EXCLUDED.ship_to,
        ship_to_description = EXCLUDED.ship_to_description,
        summary = EXCLUDED.summary,
        sync_status = EXCLUDED.sync_status,
        tax_amount = EXCLUDED.tax_amount,
        tax_zone = EXCLUDED.tax_zone,
        term_name = EXCLUDED.term_name,
        vendor = EXCLUDED.vendor,
        vendor_number = EXCLUDED.vendor_number,
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

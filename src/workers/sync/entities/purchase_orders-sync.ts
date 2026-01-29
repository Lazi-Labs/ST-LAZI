/**
 * Sync worker for Purchase orders
 * Auto-generated from discovery analysis
 */

import { Pool } from 'pg';
import { BaseSyncWorker } from '../base-sync-worker.js';
import { config } from '../../../config/index.js';

export class PurchaseOrdersSyncWorker extends BaseSyncWorker {
  readonly endpointName = 'purchase_orders';
  readonly stEndpointPath = 'https://api.servicetitan.io/inventory/v2/tenant/3222348440/purchase-orders';
  readonly rawTable = 'raw.st_purchase_orders';
  readonly masterTable = 'master.purchase_orders';
  readonly stIdField = 'id';

  protected async transformToMaster(batchId: string): Promise<{ inserted: number; updated: number }> {
    const result = await this.db.query(`
      INSERT INTO ${this.masterTable} (
        st_id,
        batch_id,
        budget_code_id,
        business_unit_id,
        created_on,
        custom_fields,
        date,
        inventory_location_id,
        invoice_id,
        items,
        job_id,
        modified_on,
        number,
        project_id,
        received_on,
        required_on,
        sent_on,
        shipping,
        ship_to,
        status,
        summary,
        tax,
        technician_id,
        total,
        type_id,
        vendor_document_number,
        vendor_id,
        synced_at,
        sync_batch_id,
        payload_hash
      )
      SELECT 
        (payload->>'id')::bigint as st_id,
        payload->>'batchId' as batch_id,
        payload->>'budgetCodeId' as budget_code_id,
        (payload->>'businessUnitId')::bigint as business_unit_id,
        (payload->>'createdOn')::timestamptz as created_on,
        payload->>'customFields' as custom_fields,
        (payload->>'date')::timestamptz as date,
        (payload->>'inventoryLocationId')::bigint as inventory_location_id,
        (payload->>'invoiceId')::bigint as invoice_id,
        payload->'items' as items,
        (payload->>'jobId')::bigint as job_id,
        (payload->>'modifiedOn')::timestamptz as modified_on,
        payload->>'number' as number,
        (payload->>'projectId')::bigint as project_id,
        (payload->>'receivedOn')::timestamptz as received_on,
        (payload->>'requiredOn')::timestamptz as required_on,
        (payload->>'sentOn')::timestamptz as sent_on,
        (payload->>'shipping')::numeric as shipping,
        payload->'shipTo' as ship_to,
        payload->>'status' as status,
        payload->>'summary' as summary,
        (payload->>'tax')::numeric as tax,
        (payload->>'technicianId')::bigint as technician_id,
        (payload->>'total')::numeric as total,
        (payload->>'typeId')::bigint as type_id,
        payload->>'vendorDocumentNumber' as vendor_document_number,
        (payload->>'vendorId')::bigint as vendor_id,
        NOW() as synced_at,
        $1::uuid as sync_batch_id,
        md5(payload::text) as payload_hash
      FROM ${this.rawTable}
      WHERE sync_batch_id = $1
      ON CONFLICT (st_id) DO UPDATE SET
        batch_id = EXCLUDED.batch_id,
        budget_code_id = EXCLUDED.budget_code_id,
        business_unit_id = EXCLUDED.business_unit_id,
        created_on = EXCLUDED.created_on,
        custom_fields = EXCLUDED.custom_fields,
        date = EXCLUDED.date,
        inventory_location_id = EXCLUDED.inventory_location_id,
        invoice_id = EXCLUDED.invoice_id,
        items = EXCLUDED.items,
        job_id = EXCLUDED.job_id,
        modified_on = EXCLUDED.modified_on,
        number = EXCLUDED.number,
        project_id = EXCLUDED.project_id,
        received_on = EXCLUDED.received_on,
        required_on = EXCLUDED.required_on,
        sent_on = EXCLUDED.sent_on,
        shipping = EXCLUDED.shipping,
        ship_to = EXCLUDED.ship_to,
        status = EXCLUDED.status,
        summary = EXCLUDED.summary,
        tax = EXCLUDED.tax,
        technician_id = EXCLUDED.technician_id,
        total = EXCLUDED.total,
        type_id = EXCLUDED.type_id,
        vendor_document_number = EXCLUDED.vendor_document_number,
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

/**
 * Sync worker for Invoice records
 * Auto-generated from discovery analysis
 */

import { Pool } from 'pg';
import { BaseSyncWorker } from '../base-sync-worker.js';
import { config } from '../../../config/index.js';

export class InvoicesSyncWorker extends BaseSyncWorker {
  readonly endpointName = 'invoices';
  readonly stEndpointPath = 'https://api.servicetitan.io/accounting/v2/tenant/3222348440/invoices';
  readonly rawTable = 'raw.st_invoices';
  readonly masterTable = 'master.invoices';
  readonly stIdField = 'id';

  protected async transformToMaster(batchId: string): Promise<{ inserted: number; updated: number }> {
    const result = await this.db.query(`
      INSERT INTO ${this.masterTable} (
        st_id,
        active,
        adjustment_to_id,
        assigned_to,
        balance,
        batch,
        budget_code_id,
        business_unit,
        commission_eligibility_date,
        created_by,
        created_on,
        customer,
        customer_address,
        custom_fields,
        deposited_on,
        discount_total,
        due_date,
        employee_info,
        export_id,
        import_id,
        invoice_configuration,
        invoice_date,
        invoice_type,
        items,
        job,
        location,
        location_address,
        material_sku_id,
        membership_id,
        modified_on,
        paid_on,
        project_id,
        reference_number,
        review_status,
        royalty,
        sales_tax,
        sales_tax_code,
        sent_status,
        sub_total,
        summary,
        sync_status,
        tax_zone_id,
        term_name,
        total,
        synced_at,
        sync_batch_id,
        payload_hash
      )
      SELECT 
        (payload->>'id')::bigint as st_id,
        (payload->>'active')::boolean as active,
        payload->>'adjustmentToId' as adjustment_to_id,
        payload->'assignedTo' as assigned_to,
        payload->>'balance' as balance,
        payload->>'batch' as batch,
        payload->>'budgetCodeId' as budget_code_id,
        payload->'businessUnit' as business_unit,
        payload->>'commissionEligibilityDate' as commission_eligibility_date,
        payload->>'createdBy' as created_by,
        (payload->>'createdOn')::timestamptz as created_on,
        payload->'customer' as customer,
        payload->'customerAddress' as customer_address,
        payload->>'customFields' as custom_fields,
        payload->>'depositedOn' as deposited_on,
        payload->>'discountTotal' as discount_total,
        (payload->>'dueDate')::timestamptz as due_date,
        payload->'employeeInfo' as employee_info,
        payload->>'exportId' as export_id,
        payload->>'importId' as import_id,
        payload->>'invoiceConfiguration' as invoice_configuration,
        (payload->>'invoiceDate')::timestamptz as invoice_date,
        payload->>'invoiceType' as invoice_type,
        payload->'items' as items,
        payload->'job' as job,
        payload->'location' as location,
        payload->'locationAddress' as location_address,
        (payload->>'materialSkuId')::bigint as material_sku_id,
        payload->>'membershipId' as membership_id,
        (payload->>'modifiedOn')::timestamptz as modified_on,
        (payload->>'paidOn')::timestamptz as paid_on,
        (payload->>'projectId')::bigint as project_id,
        payload->>'referenceNumber' as reference_number,
        payload->>'reviewStatus' as review_status,
        payload->'royalty' as royalty,
        payload->>'salesTax' as sales_tax,
        payload->>'salesTaxCode' as sales_tax_code,
        payload->>'sentStatus' as sent_status,
        payload->>'subTotal' as sub_total,
        payload->>'summary' as summary,
        payload->>'syncStatus' as sync_status,
        payload->>'taxZoneId' as tax_zone_id,
        payload->>'termName' as term_name,
        payload->>'total' as total,
        NOW() as synced_at,
        $1::uuid as sync_batch_id,
        md5(payload::text) as payload_hash
      FROM ${this.rawTable}
      WHERE sync_batch_id = $1
      ON CONFLICT (st_id) DO UPDATE SET
        active = EXCLUDED.active,
        adjustment_to_id = EXCLUDED.adjustment_to_id,
        assigned_to = EXCLUDED.assigned_to,
        balance = EXCLUDED.balance,
        batch = EXCLUDED.batch,
        budget_code_id = EXCLUDED.budget_code_id,
        business_unit = EXCLUDED.business_unit,
        commission_eligibility_date = EXCLUDED.commission_eligibility_date,
        created_by = EXCLUDED.created_by,
        created_on = EXCLUDED.created_on,
        customer = EXCLUDED.customer,
        customer_address = EXCLUDED.customer_address,
        custom_fields = EXCLUDED.custom_fields,
        deposited_on = EXCLUDED.deposited_on,
        discount_total = EXCLUDED.discount_total,
        due_date = EXCLUDED.due_date,
        employee_info = EXCLUDED.employee_info,
        export_id = EXCLUDED.export_id,
        import_id = EXCLUDED.import_id,
        invoice_configuration = EXCLUDED.invoice_configuration,
        invoice_date = EXCLUDED.invoice_date,
        invoice_type = EXCLUDED.invoice_type,
        items = EXCLUDED.items,
        job = EXCLUDED.job,
        location = EXCLUDED.location,
        location_address = EXCLUDED.location_address,
        material_sku_id = EXCLUDED.material_sku_id,
        membership_id = EXCLUDED.membership_id,
        modified_on = EXCLUDED.modified_on,
        paid_on = EXCLUDED.paid_on,
        project_id = EXCLUDED.project_id,
        reference_number = EXCLUDED.reference_number,
        review_status = EXCLUDED.review_status,
        royalty = EXCLUDED.royalty,
        sales_tax = EXCLUDED.sales_tax,
        sales_tax_code = EXCLUDED.sales_tax_code,
        sent_status = EXCLUDED.sent_status,
        sub_total = EXCLUDED.sub_total,
        summary = EXCLUDED.summary,
        sync_status = EXCLUDED.sync_status,
        tax_zone_id = EXCLUDED.tax_zone_id,
        term_name = EXCLUDED.term_name,
        total = EXCLUDED.total,
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

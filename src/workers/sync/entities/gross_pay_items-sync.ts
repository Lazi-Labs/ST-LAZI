/**
 * Sync worker for Gross pay items
 * Auto-generated from discovery analysis
 */

import { Pool } from 'pg';
import { BaseSyncWorker } from '../base-sync-worker.js';
import { config } from '../../../config/index.js';

export class GrossPayItemsSyncWorker extends BaseSyncWorker {
  readonly endpointName = 'gross_pay_items';
  readonly stEndpointPath = 'https://api.servicetitan.io/payroll/v2/tenant/3222348440/gross-pay-items';
  readonly rawTable = 'raw.st_gross_pay_items';
  readonly masterTable = 'master.gross_pay_items';
  readonly stIdField = 'id';

  protected async transformToMaster(batchId: string): Promise<{ inserted: number; updated: number }> {
    const result = await this.db.query(`
      INSERT INTO ${this.masterTable} (
        st_id,
        activity,
        activity_code,
        activity_code_id,
        amount,
        amount_adjustment,
        budget_code_id,
        business_unit_name,
        created_on,
        customer_id,
        customer_name,
        date,
        employee_id,
        employee_payroll_id,
        employee_type,
        ended_on,
        gross_pay_item_type,
        invoice_id,
        invoice_item_id,
        invoice_number,
        is_prevailing_wage_job,
        job_id,
        job_number,
        job_type_name,
        labor_type_code,
        labor_type_id,
        location_address,
        location_id,
        location_name,
        location_zip,
        memo,
        modified_on,
        paid_duration_hours,
        paid_time_type,
        payout_business_unit_name,
        payroll_id,
        project_id,
        project_number,
        source_entity_id,
        started_on,
        tax_zone_name,
        zone_name,
        synced_at,
        sync_batch_id,
        payload_hash
      )
      SELECT 
        (payload->>'id')::bigint as st_id,
        payload->>'activity' as activity,
        payload->>'activityCode' as activity_code,
        (payload->>'activityCodeId')::bigint as activity_code_id,
        (payload->>'amount')::numeric as amount,
        (payload->>'amountAdjustment')::numeric as amount_adjustment,
        payload->>'budgetCodeId' as budget_code_id,
        payload->>'businessUnitName' as business_unit_name,
        (payload->>'createdOn')::timestamptz as created_on,
        (payload->>'customerId')::bigint as customer_id,
        payload->>'customerName' as customer_name,
        (payload->>'date')::timestamptz as date,
        (payload->>'employeeId')::bigint as employee_id,
        payload->>'employeePayrollId' as employee_payroll_id,
        payload->>'employeeType' as employee_type,
        (payload->>'endedOn')::timestamptz as ended_on,
        payload->>'grossPayItemType' as gross_pay_item_type,
        (payload->>'invoiceId')::bigint as invoice_id,
        payload->>'invoiceItemId' as invoice_item_id,
        payload->>'invoiceNumber' as invoice_number,
        (payload->>'isPrevailingWageJob')::boolean as is_prevailing_wage_job,
        (payload->>'jobId')::bigint as job_id,
        payload->>'jobNumber' as job_number,
        payload->>'jobTypeName' as job_type_name,
        payload->>'laborTypeCode' as labor_type_code,
        (payload->>'laborTypeId')::bigint as labor_type_id,
        payload->>'locationAddress' as location_address,
        (payload->>'locationId')::bigint as location_id,
        payload->>'locationName' as location_name,
        payload->>'locationZip' as location_zip,
        payload->>'memo' as memo,
        (payload->>'modifiedOn')::timestamptz as modified_on,
        (payload->>'paidDurationHours')::numeric as paid_duration_hours,
        payload->>'paidTimeType' as paid_time_type,
        payload->>'payoutBusinessUnitName' as payout_business_unit_name,
        (payload->>'payrollId')::bigint as payroll_id,
        (payload->>'projectId')::bigint as project_id,
        payload->>'projectNumber' as project_number,
        (payload->>'sourceEntityId')::bigint as source_entity_id,
        (payload->>'startedOn')::timestamptz as started_on,
        payload->>'taxZoneName' as tax_zone_name,
        payload->>'zoneName' as zone_name,
        NOW() as synced_at,
        $1::uuid as sync_batch_id,
        md5(payload::text) as payload_hash
      FROM ${this.rawTable}
      WHERE sync_batch_id = $1
      ON CONFLICT (st_id) DO UPDATE SET
        activity = EXCLUDED.activity,
        activity_code = EXCLUDED.activity_code,
        activity_code_id = EXCLUDED.activity_code_id,
        amount = EXCLUDED.amount,
        amount_adjustment = EXCLUDED.amount_adjustment,
        budget_code_id = EXCLUDED.budget_code_id,
        business_unit_name = EXCLUDED.business_unit_name,
        created_on = EXCLUDED.created_on,
        customer_id = EXCLUDED.customer_id,
        customer_name = EXCLUDED.customer_name,
        date = EXCLUDED.date,
        employee_id = EXCLUDED.employee_id,
        employee_payroll_id = EXCLUDED.employee_payroll_id,
        employee_type = EXCLUDED.employee_type,
        ended_on = EXCLUDED.ended_on,
        gross_pay_item_type = EXCLUDED.gross_pay_item_type,
        invoice_id = EXCLUDED.invoice_id,
        invoice_item_id = EXCLUDED.invoice_item_id,
        invoice_number = EXCLUDED.invoice_number,
        is_prevailing_wage_job = EXCLUDED.is_prevailing_wage_job,
        job_id = EXCLUDED.job_id,
        job_number = EXCLUDED.job_number,
        job_type_name = EXCLUDED.job_type_name,
        labor_type_code = EXCLUDED.labor_type_code,
        labor_type_id = EXCLUDED.labor_type_id,
        location_address = EXCLUDED.location_address,
        location_id = EXCLUDED.location_id,
        location_name = EXCLUDED.location_name,
        location_zip = EXCLUDED.location_zip,
        memo = EXCLUDED.memo,
        modified_on = EXCLUDED.modified_on,
        paid_duration_hours = EXCLUDED.paid_duration_hours,
        paid_time_type = EXCLUDED.paid_time_type,
        payout_business_unit_name = EXCLUDED.payout_business_unit_name,
        payroll_id = EXCLUDED.payroll_id,
        project_id = EXCLUDED.project_id,
        project_number = EXCLUDED.project_number,
        source_entity_id = EXCLUDED.source_entity_id,
        started_on = EXCLUDED.started_on,
        tax_zone_name = EXCLUDED.tax_zone_name,
        zone_name = EXCLUDED.zone_name,
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

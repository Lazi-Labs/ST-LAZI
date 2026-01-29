/**
 * Sync worker for Job records
 * Auto-generated from discovery analysis
 */

import { Pool } from 'pg';
import { BaseSyncWorker } from '../base-sync-worker.js';
import { config } from '../../../config/index.js';

export class JobsSyncWorker extends BaseSyncWorker {
  readonly endpointName = 'jobs';
  readonly stEndpointPath = 'https://api.servicetitan.io/jpm/v2/tenant/3222348440/jobs';
  readonly rawTable = 'raw.st_jobs';
  readonly masterTable = 'master.jobs';
  readonly stIdField = 'id';

  protected async transformToMaster(batchId: string): Promise<{ inserted: number; updated: number }> {
    const result = await this.db.query(`
      INSERT INTO ${this.masterTable} (
        st_id,
        appointment_count,
        booking_id,
        business_unit_id,
        campaign_id,
        completed_on,
        created_by_id,
        created_from_estimate_id,
        created_on,
        customer_id,
        customer_po,
        custom_fields,
        estimate_ids,
        external_data,
        first_appointment_id,
        invoice_id,
        job_generated_lead_source,
        job_number,
        job_status,
        job_type_id,
        last_appointment_id,
        lead_call_id,
        location_id,
        membership_id,
        modified_on,
        no_charge,
        notifications_enabled,
        partner_lead_call_id,
        priority,
        project_id,
        recall_for_id,
        sold_by_id,
        summary,
        tag_type_ids,
        total,
        warranty_id,
        synced_at,
        sync_batch_id,
        payload_hash
      )
      SELECT 
        (payload->>'id')::bigint as st_id,
        (payload->>'appointmentCount')::numeric as appointment_count,
        payload->>'bookingId' as booking_id,
        (payload->>'businessUnitId')::bigint as business_unit_id,
        (payload->>'campaignId')::bigint as campaign_id,
        (payload->>'completedOn')::timestamptz as completed_on,
        (payload->>'createdById')::bigint as created_by_id,
        payload->>'createdFromEstimateId' as created_from_estimate_id,
        (payload->>'createdOn')::timestamptz as created_on,
        (payload->>'customerId')::bigint as customer_id,
        payload->>'customerPo' as customer_po,
        payload->'customFields' as custom_fields,
        payload->'estimateIds' as estimate_ids,
        payload->>'externalData' as external_data,
        (payload->>'firstAppointmentId')::bigint as first_appointment_id,
        (payload->>'invoiceId')::bigint as invoice_id,
        payload->'jobGeneratedLeadSource' as job_generated_lead_source,
        payload->>'jobNumber' as job_number,
        payload->>'jobStatus' as job_status,
        (payload->>'jobTypeId')::bigint as job_type_id,
        (payload->>'lastAppointmentId')::bigint as last_appointment_id,
        payload->>'leadCallId' as lead_call_id,
        (payload->>'locationId')::bigint as location_id,
        payload->>'membershipId' as membership_id,
        (payload->>'modifiedOn')::timestamptz as modified_on,
        (payload->>'noCharge')::boolean as no_charge,
        (payload->>'notificationsEnabled')::boolean as notifications_enabled,
        payload->>'partnerLeadCallId' as partner_lead_call_id,
        payload->>'priority' as priority,
        (payload->>'projectId')::bigint as project_id,
        payload->>'recallForId' as recall_for_id,
        payload->>'soldById' as sold_by_id,
        payload->>'summary' as summary,
        payload->'tagTypeIds' as tag_type_ids,
        (payload->>'total')::numeric as total,
        payload->>'warrantyId' as warranty_id,
        NOW() as synced_at,
        $1::uuid as sync_batch_id,
        md5(payload::text) as payload_hash
      FROM ${this.rawTable}
      WHERE sync_batch_id = $1
      ON CONFLICT (st_id) DO UPDATE SET
        appointment_count = EXCLUDED.appointment_count,
        booking_id = EXCLUDED.booking_id,
        business_unit_id = EXCLUDED.business_unit_id,
        campaign_id = EXCLUDED.campaign_id,
        completed_on = EXCLUDED.completed_on,
        created_by_id = EXCLUDED.created_by_id,
        created_from_estimate_id = EXCLUDED.created_from_estimate_id,
        created_on = EXCLUDED.created_on,
        customer_id = EXCLUDED.customer_id,
        customer_po = EXCLUDED.customer_po,
        custom_fields = EXCLUDED.custom_fields,
        estimate_ids = EXCLUDED.estimate_ids,
        external_data = EXCLUDED.external_data,
        first_appointment_id = EXCLUDED.first_appointment_id,
        invoice_id = EXCLUDED.invoice_id,
        job_generated_lead_source = EXCLUDED.job_generated_lead_source,
        job_number = EXCLUDED.job_number,
        job_status = EXCLUDED.job_status,
        job_type_id = EXCLUDED.job_type_id,
        last_appointment_id = EXCLUDED.last_appointment_id,
        lead_call_id = EXCLUDED.lead_call_id,
        location_id = EXCLUDED.location_id,
        membership_id = EXCLUDED.membership_id,
        modified_on = EXCLUDED.modified_on,
        no_charge = EXCLUDED.no_charge,
        notifications_enabled = EXCLUDED.notifications_enabled,
        partner_lead_call_id = EXCLUDED.partner_lead_call_id,
        priority = EXCLUDED.priority,
        project_id = EXCLUDED.project_id,
        recall_for_id = EXCLUDED.recall_for_id,
        sold_by_id = EXCLUDED.sold_by_id,
        summary = EXCLUDED.summary,
        tag_type_ids = EXCLUDED.tag_type_ids,
        total = EXCLUDED.total,
        warranty_id = EXCLUDED.warranty_id,
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

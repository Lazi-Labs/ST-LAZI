/**
 * Sync worker for Job type definitions
 * Auto-generated from discovery analysis
 */

import { Pool } from 'pg';
import { BaseSyncWorker } from '../base-sync-worker.js';
import { config } from '../../../config/index.js';

export class JobTypesSyncWorker extends BaseSyncWorker {
  readonly endpointName = 'job_types';
  readonly stEndpointPath = 'https://api.servicetitan.io/jpm/v2/tenant/3222348440/job-types';
  readonly rawTable = 'raw.st_job_types';
  readonly masterTable = 'master.job_types';
  readonly stIdField = 'id';

  protected async transformToMaster(batchId: string): Promise<{ inserted: number; updated: number }> {
    const result = await this.db.query(`
      INSERT INTO ${this.masterTable} (
        st_id,
        active,
        business_unit_ids,
        class,
        created_on,
        duration,
        enforce_recurring_service_event_selection,
        external_data,
        invoice_signatures_required,
        is_smart_dispatched,
        modified_on,
        name,
        no_charge,
        priority,
        skills,
        sold_threshold,
        summary,
        tag_type_ids,
        synced_at,
        sync_batch_id,
        payload_hash
      )
      SELECT 
        (payload->>'id')::bigint as st_id,
        (payload->>'active')::boolean as active,
        payload->'businessUnitIds' as business_unit_ids,
        payload->>'class' as class,
        (payload->>'createdOn')::timestamptz as created_on,
        (payload->>'duration')::numeric as duration,
        payload->>'enforceRecurringServiceEventSelection' as enforce_recurring_service_event_selection,
        payload->>'externalData' as external_data,
        (payload->>'invoiceSignaturesRequired')::boolean as invoice_signatures_required,
        (payload->>'isSmartDispatched')::boolean as is_smart_dispatched,
        (payload->>'modifiedOn')::timestamptz as modified_on,
        payload->>'name' as name,
        (payload->>'noCharge')::boolean as no_charge,
        payload->>'priority' as priority,
        payload->'skills' as skills,
        (payload->>'soldThreshold')::numeric as sold_threshold,
        payload->>'summary' as summary,
        payload->'tagTypeIds' as tag_type_ids,
        NOW() as synced_at,
        $1::uuid as sync_batch_id,
        md5(payload::text) as payload_hash
      FROM ${this.rawTable}
      WHERE sync_batch_id = $1
      ON CONFLICT (st_id) DO UPDATE SET
        active = EXCLUDED.active,
        business_unit_ids = EXCLUDED.business_unit_ids,
        class = EXCLUDED.class,
        created_on = EXCLUDED.created_on,
        duration = EXCLUDED.duration,
        enforce_recurring_service_event_selection = EXCLUDED.enforce_recurring_service_event_selection,
        external_data = EXCLUDED.external_data,
        invoice_signatures_required = EXCLUDED.invoice_signatures_required,
        is_smart_dispatched = EXCLUDED.is_smart_dispatched,
        modified_on = EXCLUDED.modified_on,
        name = EXCLUDED.name,
        no_charge = EXCLUDED.no_charge,
        priority = EXCLUDED.priority,
        skills = EXCLUDED.skills,
        sold_threshold = EXCLUDED.sold_threshold,
        summary = EXCLUDED.summary,
        tag_type_ids = EXCLUDED.tag_type_ids,
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

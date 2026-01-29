/**
 * Sync worker for Project records
 * Auto-generated from discovery analysis
 */

import { Pool } from 'pg';
import { BaseSyncWorker } from '../base-sync-worker.js';
import { config } from '../../../config/index.js';

export class ProjectsSyncWorker extends BaseSyncWorker {
  readonly endpointName = 'projects';
  readonly stEndpointPath = 'https://api.servicetitan.io/jpm/v2/tenant/3222348440/projects';
  readonly rawTable = 'raw.st_projects';
  readonly masterTable = 'master.projects';
  readonly stIdField = 'id';

  protected async transformToMaster(batchId: string): Promise<{ inserted: number; updated: number }> {
    const result = await this.db.query(`
      INSERT INTO ${this.masterTable} (
        st_id,
        actual_completion_date,
        business_unit_ids,
        created_on,
        customer_id,
        custom_fields,
        external_data,
        job_ids,
        location_id,
        modified_on,
        name,
        number,
        project_manager_ids,
        project_type_id,
        start_date,
        status,
        status_id,
        sub_status,
        sub_status_id,
        summary,
        target_completion_date,
        synced_at,
        sync_batch_id,
        payload_hash
      )
      SELECT 
        (payload->>'id')::bigint as st_id,
        payload->>'actualCompletionDate' as actual_completion_date,
        payload->'businessUnitIds' as business_unit_ids,
        (payload->>'createdOn')::timestamptz as created_on,
        (payload->>'customerId')::bigint as customer_id,
        payload->'customFields' as custom_fields,
        payload->>'externalData' as external_data,
        payload->'jobIds' as job_ids,
        (payload->>'locationId')::bigint as location_id,
        (payload->>'modifiedOn')::timestamptz as modified_on,
        payload->>'name' as name,
        payload->>'number' as number,
        payload->'projectManagerIds' as project_manager_ids,
        (payload->>'projectTypeId')::bigint as project_type_id,
        (payload->>'startDate')::timestamptz as start_date,
        payload->>'status' as status,
        (payload->>'statusId')::bigint as status_id,
        payload->>'subStatus' as sub_status,
        (payload->>'subStatusId')::bigint as sub_status_id,
        payload->>'summary' as summary,
        (payload->>'targetCompletionDate')::timestamptz as target_completion_date,
        NOW() as synced_at,
        $1::uuid as sync_batch_id,
        md5(payload::text) as payload_hash
      FROM ${this.rawTable}
      WHERE sync_batch_id = $1
      ON CONFLICT (st_id) DO UPDATE SET
        actual_completion_date = EXCLUDED.actual_completion_date,
        business_unit_ids = EXCLUDED.business_unit_ids,
        created_on = EXCLUDED.created_on,
        customer_id = EXCLUDED.customer_id,
        custom_fields = EXCLUDED.custom_fields,
        external_data = EXCLUDED.external_data,
        job_ids = EXCLUDED.job_ids,
        location_id = EXCLUDED.location_id,
        modified_on = EXCLUDED.modified_on,
        name = EXCLUDED.name,
        number = EXCLUDED.number,
        project_manager_ids = EXCLUDED.project_manager_ids,
        project_type_id = EXCLUDED.project_type_id,
        start_date = EXCLUDED.start_date,
        status = EXCLUDED.status,
        status_id = EXCLUDED.status_id,
        sub_status = EXCLUDED.sub_status,
        sub_status_id = EXCLUDED.sub_status_id,
        summary = EXCLUDED.summary,
        target_completion_date = EXCLUDED.target_completion_date,
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

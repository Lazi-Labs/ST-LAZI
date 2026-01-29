/**
 * Sync worker for Timesheet activities
 * Auto-generated from discovery analysis
 */

import { Pool } from 'pg';
import { BaseSyncWorker } from '../base-sync-worker.js';
import { config } from '../../../config/index.js';

export class TimesheetActivitiesSyncWorker extends BaseSyncWorker {
  readonly endpointName = 'timesheet_activities';
  readonly stEndpointPath = 'https://api.servicetitan.io/timesheets/v2/tenant/3222348440/activities';
  readonly rawTable = 'raw.st_timesheet_activities';
  readonly masterTable = 'master.timesheet_activities';
  readonly stIdField = 'id';

  protected async transformToMaster(batchId: string): Promise<{ inserted: number; updated: number }> {
    const result = await this.db.query(`
      INSERT INTO ${this.masterTable} (
        st_id,
        active,
        activity_type_id,
        appointment_id,
        budget_code_id,
        created_on,
        employee_id,
        employee_type,
        end_coordinate,
        end_time,
        job_id,
        labor_type_id,
        memo,
        modified_by_id,
        modified_on,
        project_id,
        project_label,
        start_coordinate,
        start_time,
        tag_types,
        synced_at,
        sync_batch_id,
        payload_hash
      )
      SELECT 
        (payload->>'id')::bigint as st_id,
        (payload->>'active')::boolean as active,
        (payload->>'activityTypeId')::bigint as activity_type_id,
        (payload->>'appointmentId')::bigint as appointment_id,
        payload->>'budgetCodeId' as budget_code_id,
        (payload->>'createdOn')::timestamptz as created_on,
        (payload->>'employeeId')::bigint as employee_id,
        payload->>'employeeType' as employee_type,
        payload->'endCoordinate' as end_coordinate,
        (payload->>'endTime')::timestamptz as end_time,
        (payload->>'jobId')::bigint as job_id,
        (payload->>'laborTypeId')::bigint as labor_type_id,
        payload->>'memo' as memo,
        (payload->>'modifiedById')::bigint as modified_by_id,
        (payload->>'modifiedOn')::timestamptz as modified_on,
        (payload->>'projectId')::bigint as project_id,
        payload->>'projectLabel' as project_label,
        payload->'startCoordinate' as start_coordinate,
        (payload->>'startTime')::timestamptz as start_time,
        payload->'tagTypes' as tag_types,
        NOW() as synced_at,
        $1::uuid as sync_batch_id,
        md5(payload::text) as payload_hash
      FROM ${this.rawTable}
      WHERE sync_batch_id = $1
      ON CONFLICT (st_id) DO UPDATE SET
        active = EXCLUDED.active,
        activity_type_id = EXCLUDED.activity_type_id,
        appointment_id = EXCLUDED.appointment_id,
        budget_code_id = EXCLUDED.budget_code_id,
        created_on = EXCLUDED.created_on,
        employee_id = EXCLUDED.employee_id,
        employee_type = EXCLUDED.employee_type,
        end_coordinate = EXCLUDED.end_coordinate,
        end_time = EXCLUDED.end_time,
        job_id = EXCLUDED.job_id,
        labor_type_id = EXCLUDED.labor_type_id,
        memo = EXCLUDED.memo,
        modified_by_id = EXCLUDED.modified_by_id,
        modified_on = EXCLUDED.modified_on,
        project_id = EXCLUDED.project_id,
        project_label = EXCLUDED.project_label,
        start_coordinate = EXCLUDED.start_coordinate,
        start_time = EXCLUDED.start_time,
        tag_types = EXCLUDED.tag_types,
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

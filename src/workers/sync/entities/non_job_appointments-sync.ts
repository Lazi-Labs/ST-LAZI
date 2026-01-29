/**
 * Sync worker for Non-job appointments (meetings, etc)
 * Auto-generated from discovery analysis
 */

import { Pool } from 'pg';
import { BaseSyncWorker } from '../base-sync-worker.js';
import { config } from '../../../config/index.js';

export class NonJobAppointmentsSyncWorker extends BaseSyncWorker {
  readonly endpointName = 'non_job_appointments';
  readonly stEndpointPath = 'https://api.servicetitan.io/dispatch/v2/tenant/3222348440/non-job-appointments';
  readonly rawTable = 'raw.st_non_job_appointments';
  readonly masterTable = 'master.non_job_appointments';
  readonly stIdField = 'id';

  protected async transformToMaster(batchId: string): Promise<{ inserted: number; updated: number }> {
    const result = await this.db.query(`
      INSERT INTO ${this.masterTable} (
        st_id,
        active,
        all_day,
        clear_dispatch_board,
        clear_technician_view,
        created_by_id,
        created_on,
        duration,
        modified_on,
        name,
        remove_technician_from_capacity_planning,
        show_on_technician_schedule,
        "start",
        summary,
        technician_id,
        timesheet_code_id,
        synced_at,
        sync_batch_id,
        payload_hash
      )
      SELECT 
        (payload->>'id')::bigint as st_id,
        (payload->>'active')::boolean as active,
        (payload->>'allDay')::boolean as all_day,
        (payload->>'clearDispatchBoard')::boolean as clear_dispatch_board,
        (payload->>'clearTechnicianView')::boolean as clear_technician_view,
        (payload->>'createdById')::bigint as created_by_id,
        (payload->>'createdOn')::timestamptz as created_on,
        payload->>'duration' as duration,
        (payload->>'modifiedOn')::timestamptz as modified_on,
        payload->>'name' as name,
        (payload->>'removeTechnicianFromCapacityPlanning')::boolean as remove_technician_from_capacity_planning,
        (payload->>'showOnTechnicianSchedule')::boolean as show_on_technician_schedule,
        (payload->>'start')::timestamptz as "start",
        payload->>'summary' as summary,
        (payload->>'technicianId')::bigint as technician_id,
        (payload->>'timesheetCodeId')::bigint as timesheet_code_id,
        NOW() as synced_at,
        $1::uuid as sync_batch_id,
        md5(payload::text) as payload_hash
      FROM ${this.rawTable}
      WHERE sync_batch_id = $1
      ON CONFLICT (st_id) DO UPDATE SET
        active = EXCLUDED.active,
        all_day = EXCLUDED.all_day,
        clear_dispatch_board = EXCLUDED.clear_dispatch_board,
        clear_technician_view = EXCLUDED.clear_technician_view,
        created_by_id = EXCLUDED.created_by_id,
        created_on = EXCLUDED.created_on,
        duration = EXCLUDED.duration,
        modified_on = EXCLUDED.modified_on,
        name = EXCLUDED.name,
        remove_technician_from_capacity_planning = EXCLUDED.remove_technician_from_capacity_planning,
        show_on_technician_schedule = EXCLUDED.show_on_technician_schedule,
        "start" = EXCLUDED."start",
        summary = EXCLUDED.summary,
        technician_id = EXCLUDED.technician_id,
        timesheet_code_id = EXCLUDED.timesheet_code_id,
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

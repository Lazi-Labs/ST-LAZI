/**
 * Sync worker for Appointment-technician assignments
 * Auto-generated from discovery analysis
 */

import { Pool } from 'pg';
import { BaseSyncWorker } from '../base-sync-worker.js';
import { config } from '../../../config/index.js';

export class AppointmentAssignmentsSyncWorker extends BaseSyncWorker {
  readonly endpointName = 'appointment_assignments';
  readonly stEndpointPath = 'https://api.servicetitan.io/dispatch/v2/tenant/3222348440/appointment-assignments';
  readonly rawTable = 'raw.st_appointment_assignments';
  readonly masterTable = 'master.appointment_assignments';
  readonly stIdField = 'id';

  protected async transformToMaster(batchId: string): Promise<{ inserted: number; updated: number }> {
    const result = await this.db.query(`
      INSERT INTO ${this.masterTable} (
        st_id,
        active,
        appointment_id,
        assigned_by_id,
        assigned_on,
        created_on,
        is_paused,
        job_id,
        modified_on,
        status,
        technician_id,
        technician_name,
        synced_at,
        sync_batch_id,
        payload_hash
      )
      SELECT 
        (payload->>'id')::bigint as st_id,
        (payload->>'active')::boolean as active,
        (payload->>'appointmentId')::bigint as appointment_id,
        (payload->>'assignedById')::bigint as assigned_by_id,
        (payload->>'assignedOn')::timestamptz as assigned_on,
        (payload->>'createdOn')::timestamptz as created_on,
        (payload->>'isPaused')::boolean as is_paused,
        (payload->>'jobId')::bigint as job_id,
        (payload->>'modifiedOn')::timestamptz as modified_on,
        payload->>'status' as status,
        (payload->>'technicianId')::bigint as technician_id,
        payload->>'technicianName' as technician_name,
        NOW() as synced_at,
        $1::uuid as sync_batch_id,
        md5(payload::text) as payload_hash
      FROM ${this.rawTable}
      WHERE sync_batch_id = $1
      ON CONFLICT (st_id) DO UPDATE SET
        active = EXCLUDED.active,
        appointment_id = EXCLUDED.appointment_id,
        assigned_by_id = EXCLUDED.assigned_by_id,
        assigned_on = EXCLUDED.assigned_on,
        created_on = EXCLUDED.created_on,
        is_paused = EXCLUDED.is_paused,
        job_id = EXCLUDED.job_id,
        modified_on = EXCLUDED.modified_on,
        status = EXCLUDED.status,
        technician_id = EXCLUDED.technician_id,
        technician_name = EXCLUDED.technician_name,
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

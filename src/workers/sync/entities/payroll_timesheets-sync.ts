/**
 * Sync worker for Payroll timesheets
 * Auto-generated from discovery analysis
 */

import { Pool } from 'pg';
import { BaseSyncWorker } from '../base-sync-worker.js';
import { config } from '../../../config/index.js';

export class PayrollTimesheetsSyncWorker extends BaseSyncWorker {
  readonly endpointName = 'payroll_timesheets';
  readonly stEndpointPath = 'https://api.servicetitan.io/payroll/v2/tenant/3222348440/jobs/timesheets';
  readonly rawTable = 'raw.st_payroll_timesheets';
  readonly masterTable = 'master.payroll_timesheets';
  readonly stIdField = 'id';

  protected async transformToMaster(batchId: string): Promise<{ inserted: number; updated: number }> {
    const result = await this.db.query(`
      INSERT INTO ${this.masterTable} (
        st_id,
        active,
        appointment_id,
        arrived_on,
        canceled_on,
        created_on,
        dispatched_on,
        done_on,
        job_id,
        modified_on,
        technician_id,
        synced_at,
        sync_batch_id,
        payload_hash
      )
      SELECT 
        (payload->>'id')::bigint as st_id,
        (payload->>'active')::boolean as active,
        (payload->>'appointmentId')::bigint as appointment_id,
        (payload->>'arrivedOn')::timestamptz as arrived_on,
        (payload->>'canceledOn')::timestamptz as canceled_on,
        (payload->>'createdOn')::timestamptz as created_on,
        (payload->>'dispatchedOn')::timestamptz as dispatched_on,
        (payload->>'doneOn')::timestamptz as done_on,
        (payload->>'jobId')::bigint as job_id,
        (payload->>'modifiedOn')::timestamptz as modified_on,
        (payload->>'technicianId')::bigint as technician_id,
        NOW() as synced_at,
        $1::uuid as sync_batch_id,
        md5(payload::text) as payload_hash
      FROM ${this.rawTable}
      WHERE sync_batch_id = $1
      ON CONFLICT (st_id) DO UPDATE SET
        active = EXCLUDED.active,
        appointment_id = EXCLUDED.appointment_id,
        arrived_on = EXCLUDED.arrived_on,
        canceled_on = EXCLUDED.canceled_on,
        created_on = EXCLUDED.created_on,
        dispatched_on = EXCLUDED.dispatched_on,
        done_on = EXCLUDED.done_on,
        job_id = EXCLUDED.job_id,
        modified_on = EXCLUDED.modified_on,
        technician_id = EXCLUDED.technician_id,
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

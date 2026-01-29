/**
 * Sync worker for Job appointments
 * Auto-generated from discovery analysis
 */

import { Pool } from 'pg';
import { BaseSyncWorker } from '../base-sync-worker.js';
import { config } from '../../../config/index.js';

export class AppointmentsSyncWorker extends BaseSyncWorker {
  readonly endpointName = 'appointments';
  readonly stEndpointPath = 'https://api.servicetitan.io/jpm/v2/tenant/3222348440/appointments';
  readonly rawTable = 'raw.st_appointments';
  readonly masterTable = 'master.appointments';
  readonly stIdField = 'id';

  protected async transformToMaster(batchId: string): Promise<{ inserted: number; updated: number }> {
    const result = await this.db.query(`
      INSERT INTO ${this.masterTable} (
        st_id,
        active,
        appointment_number,
        arrival_window_end,
        arrival_window_start,
        created_by_id,
        created_on,
        customer_id,
        "end",
        is_confirmed,
        job_id,
        modified_on,
        special_instructions,
        "start",
        status,
        unused,
        synced_at,
        sync_batch_id,
        payload_hash
      )
      SELECT 
        (payload->>'id')::bigint as st_id,
        (payload->>'active')::boolean as active,
        payload->>'appointmentNumber' as appointment_number,
        (payload->>'arrivalWindowEnd')::timestamptz as arrival_window_end,
        (payload->>'arrivalWindowStart')::timestamptz as arrival_window_start,
        (payload->>'createdById')::bigint as created_by_id,
        (payload->>'createdOn')::timestamptz as created_on,
        (payload->>'customerId')::bigint as customer_id,
        (payload->>'end')::timestamptz as "end",
        (payload->>'isConfirmed')::boolean as is_confirmed,
        (payload->>'jobId')::bigint as job_id,
        (payload->>'modifiedOn')::timestamptz as modified_on,
        payload->>'specialInstructions' as special_instructions,
        (payload->>'start')::timestamptz as "start",
        payload->>'status' as status,
        (payload->>'unused')::boolean as unused,
        NOW() as synced_at,
        $1::uuid as sync_batch_id,
        md5(payload::text) as payload_hash
      FROM ${this.rawTable}
      WHERE sync_batch_id = $1
      ON CONFLICT (st_id) DO UPDATE SET
        active = EXCLUDED.active,
        appointment_number = EXCLUDED.appointment_number,
        arrival_window_end = EXCLUDED.arrival_window_end,
        arrival_window_start = EXCLUDED.arrival_window_start,
        created_by_id = EXCLUDED.created_by_id,
        created_on = EXCLUDED.created_on,
        customer_id = EXCLUDED.customer_id,
        "end" = EXCLUDED."end",
        is_confirmed = EXCLUDED.is_confirmed,
        job_id = EXCLUDED.job_id,
        modified_on = EXCLUDED.modified_on,
        special_instructions = EXCLUDED.special_instructions,
        "start" = EXCLUDED."start",
        status = EXCLUDED.status,
        unused = EXCLUDED.unused,
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

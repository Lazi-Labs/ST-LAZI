/**
 * Sync worker for Technician shift schedules
 * Auto-generated from discovery analysis
 */

import { Pool } from 'pg';
import { BaseSyncWorker } from '../base-sync-worker.js';
import { config } from '../../../config/index.js';

export class TechnicianShiftsSyncWorker extends BaseSyncWorker {
  readonly endpointName = 'technician_shifts';
  readonly stEndpointPath = 'https://api.servicetitan.io/dispatch/v2/tenant/3222348440/technician-shifts';
  readonly rawTable = 'raw.st_technician_shifts';
  readonly masterTable = 'master.technician_shifts';
  readonly stIdField = 'id';

  protected async transformToMaster(batchId: string): Promise<{ inserted: number; updated: number }> {
    const result = await this.db.query(`
      INSERT INTO ${this.masterTable} (
        st_id,
        active,
        created_on,
        "end",
        modified_on,
        note,
        shift_type,
        "start",
        technician_id,
        timesheet_code_id,
        title,
        synced_at,
        sync_batch_id,
        payload_hash
      )
      SELECT 
        (payload->>'id')::bigint as st_id,
        (payload->>'active')::boolean as active,
        (payload->>'createdOn')::timestamptz as created_on,
        (payload->>'end')::timestamptz as "end",
        (payload->>'modifiedOn')::timestamptz as modified_on,
        payload->>'note' as note,
        payload->>'shiftType' as shift_type,
        (payload->>'start')::timestamptz as "start",
        (payload->>'technicianId')::bigint as technician_id,
        payload->>'timesheetCodeId' as timesheet_code_id,
        payload->>'title' as title,
        NOW() as synced_at,
        $1::uuid as sync_batch_id,
        md5(payload::text) as payload_hash
      FROM ${this.rawTable}
      WHERE sync_batch_id = $1
      ON CONFLICT (st_id) DO UPDATE SET
        active = EXCLUDED.active,
        created_on = EXCLUDED.created_on,
        "end" = EXCLUDED."end",
        modified_on = EXCLUDED.modified_on,
        note = EXCLUDED.note,
        shift_type = EXCLUDED.shift_type,
        "start" = EXCLUDED."start",
        technician_id = EXCLUDED.technician_id,
        timesheet_code_id = EXCLUDED.timesheet_code_id,
        title = EXCLUDED.title,
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

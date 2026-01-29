/**
 * Sync worker for Timesheet code definitions
 * Auto-generated from discovery analysis
 */

import { Pool } from 'pg';
import { BaseSyncWorker } from '../base-sync-worker.js';
import { config } from '../../../config/index.js';

export class TimesheetCodesSyncWorker extends BaseSyncWorker {
  readonly endpointName = 'timesheet_codes';
  readonly stEndpointPath = 'https://api.servicetitan.io/payroll/v2/tenant/3222348440/timesheet-codes';
  readonly rawTable = 'raw.st_timesheet_codes';
  readonly masterTable = 'master.timesheet_codes';
  readonly stIdField = 'id';

  protected async transformToMaster(batchId: string): Promise<{ inserted: number; updated: number }> {
    const result = await this.db.query(`
      INSERT INTO ${this.masterTable} (
        st_id,
        active,
        applicable_employee_type,
        code,
        created_on,
        description,
        modified_on,
        rate_info,
        type,
        synced_at,
        sync_batch_id,
        payload_hash
      )
      SELECT 
        (payload->>'id')::bigint as st_id,
        (payload->>'active')::boolean as active,
        payload->>'applicableEmployeeType' as applicable_employee_type,
        payload->>'code' as code,
        (payload->>'createdOn')::timestamptz as created_on,
        payload->>'description' as description,
        (payload->>'modifiedOn')::timestamptz as modified_on,
        payload->'rateInfo' as rate_info,
        payload->>'type' as type,
        NOW() as synced_at,
        $1::uuid as sync_batch_id,
        md5(payload::text) as payload_hash
      FROM ${this.rawTable}
      WHERE sync_batch_id = $1
      ON CONFLICT (st_id) DO UPDATE SET
        active = EXCLUDED.active,
        applicable_employee_type = EXCLUDED.applicable_employee_type,
        code = EXCLUDED.code,
        created_on = EXCLUDED.created_on,
        description = EXCLUDED.description,
        modified_on = EXCLUDED.modified_on,
        rate_info = EXCLUDED.rate_info,
        type = EXCLUDED.type,
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

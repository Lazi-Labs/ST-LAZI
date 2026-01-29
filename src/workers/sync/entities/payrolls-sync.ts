/**
 * Sync worker for Payroll records
 * Auto-generated from discovery analysis
 */

import { Pool } from 'pg';
import { BaseSyncWorker } from '../base-sync-worker.js';
import { config } from '../../../config/index.js';

export class PayrollsSyncWorker extends BaseSyncWorker {
  readonly endpointName = 'payrolls';
  readonly stEndpointPath = 'https://api.servicetitan.io/payroll/v2/tenant/3222348440/payrolls';
  readonly rawTable = 'raw.st_payrolls';
  readonly masterTable = 'master.payrolls';
  readonly stIdField = 'id';

  protected async transformToMaster(batchId: string): Promise<{ inserted: number; updated: number }> {
    const result = await this.db.query(`
      INSERT INTO ${this.masterTable} (
        st_id,
        active,
        burden_rate,
        created_on,
        employee_id,
        employee_type,
        ended_on,
        manager_approved_on,
        modified_on,
        started_on,
        status,
        synced_at,
        sync_batch_id,
        payload_hash
      )
      SELECT 
        (payload->>'id')::bigint as st_id,
        (payload->>'active')::boolean as active,
        (payload->>'burdenRate')::numeric as burden_rate,
        (payload->>'createdOn')::timestamptz as created_on,
        (payload->>'employeeId')::bigint as employee_id,
        payload->>'employeeType' as employee_type,
        (payload->>'endedOn')::timestamptz as ended_on,
        (payload->>'managerApprovedOn')::timestamptz as manager_approved_on,
        (payload->>'modifiedOn')::timestamptz as modified_on,
        (payload->>'startedOn')::timestamptz as started_on,
        payload->>'status' as status,
        NOW() as synced_at,
        $1::uuid as sync_batch_id,
        md5(payload::text) as payload_hash
      FROM ${this.rawTable}
      WHERE sync_batch_id = $1
      ON CONFLICT (st_id) DO UPDATE SET
        active = EXCLUDED.active,
        burden_rate = EXCLUDED.burden_rate,
        created_on = EXCLUDED.created_on,
        employee_id = EXCLUDED.employee_id,
        employee_type = EXCLUDED.employee_type,
        ended_on = EXCLUDED.ended_on,
        manager_approved_on = EXCLUDED.manager_approved_on,
        modified_on = EXCLUDED.modified_on,
        started_on = EXCLUDED.started_on,
        status = EXCLUDED.status,
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

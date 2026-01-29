/**
 * Sync worker for Job payment splits
 * Auto-generated from discovery analysis
 */

import { Pool } from 'pg';
import { BaseSyncWorker } from '../base-sync-worker.js';
import { config } from '../../../config/index.js';

export class JobSplitsSyncWorker extends BaseSyncWorker {
  readonly endpointName = 'job_splits';
  readonly stEndpointPath = 'https://api.servicetitan.io/payroll/v2/tenant/3222348440/jobs/splits';
  readonly rawTable = 'raw.st_job_splits';
  readonly masterTable = 'master.job_splits';
  readonly stIdField = 'id';

  protected async transformToMaster(batchId: string): Promise<{ inserted: number; updated: number }> {
    const result = await this.db.query(`
      INSERT INTO ${this.masterTable} (
        st_id,
        created_on,
        job_id,
        modified_on,
        split,
        technician_id,
        synced_at,
        sync_batch_id,
        payload_hash
      )
      SELECT 
        (payload->>'id')::bigint as st_id,
        (payload->>'createdOn')::timestamptz as created_on,
        (payload->>'jobId')::bigint as job_id,
        (payload->>'modifiedOn')::timestamptz as modified_on,
        (payload->>'split')::numeric as split,
        (payload->>'technicianId')::bigint as technician_id,
        NOW() as synced_at,
        $1::uuid as sync_batch_id,
        md5(payload::text) as payload_hash
      FROM ${this.rawTable}
      WHERE sync_batch_id = $1
      ON CONFLICT (st_id) DO UPDATE SET
        created_on = EXCLUDED.created_on,
        job_id = EXCLUDED.job_id,
        modified_on = EXCLUDED.modified_on,
        split = EXCLUDED.split,
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

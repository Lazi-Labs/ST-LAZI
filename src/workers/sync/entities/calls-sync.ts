/**
 * Sync worker for Phone call records
 * Auto-generated from discovery analysis
 */

import { Pool } from 'pg';
import { BaseSyncWorker } from '../base-sync-worker.js';
import { config } from '../../../config/index.js';

export class CallsSyncWorker extends BaseSyncWorker {
  readonly endpointName = 'calls';
  readonly stEndpointPath = 'https://api.servicetitan.io/telecom/v3/tenant/3222348440/calls';
  readonly rawTable = 'raw.st_calls';
  readonly masterTable = 'master.calls';
  readonly stIdField = 'id';

  protected async transformToMaster(batchId: string): Promise<{ inserted: number; updated: number }> {
    const result = await this.db.query(`
      INSERT INTO ${this.masterTable} (
        st_id,
        business_unit,
        job_number,
        lead_call,
        project_id,
        type,
        synced_at,
        sync_batch_id,
        payload_hash
      )
      SELECT 
        (payload->>'id')::bigint as st_id,
        payload->'businessUnit' as business_unit,
        payload->>'jobNumber' as job_number,
        payload->'leadCall' as lead_call,
        (payload->>'projectId')::bigint as project_id,
        payload->'type' as type,
        NOW() as synced_at,
        $1::uuid as sync_batch_id,
        md5(payload::text) as payload_hash
      FROM ${this.rawTable}
      WHERE sync_batch_id = $1
      ON CONFLICT (st_id) DO UPDATE SET
        business_unit = EXCLUDED.business_unit,
        job_number = EXCLUDED.job_number,
        lead_call = EXCLUDED.lead_call,
        project_id = EXCLUDED.project_id,
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

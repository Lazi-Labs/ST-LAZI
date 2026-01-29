/**
 * Sync worker for Project type definitions
 * Auto-generated from discovery analysis
 */

import { Pool } from 'pg';
import { BaseSyncWorker } from '../base-sync-worker.js';
import { config } from '../../../config/index.js';

export class ProjectTypesSyncWorker extends BaseSyncWorker {
  readonly endpointName = 'project_types';
  readonly stEndpointPath = 'https://api.servicetitan.io/jpm/v2/tenant/3222348440/project-types';
  readonly rawTable = 'raw.st_project_types';
  readonly masterTable = 'master.project_types';
  readonly stIdField = 'id';

  protected async transformToMaster(batchId: string): Promise<{ inserted: number; updated: number }> {
    const result = await this.db.query(`
      INSERT INTO ${this.masterTable} (
        st_id,
        created_by_id,
        description,
        name,
        synced_at,
        sync_batch_id,
        payload_hash
      )
      SELECT 
        (payload->>'id')::bigint as st_id,
        (payload->>'createdById')::bigint as created_by_id,
        payload->>'description' as description,
        payload->>'name' as name,
        NOW() as synced_at,
        $1::uuid as sync_batch_id,
        md5(payload::text) as payload_hash
      FROM ${this.rawTable}
      WHERE sync_batch_id = $1
      ON CONFLICT (st_id) DO UPDATE SET
        created_by_id = EXCLUDED.created_by_id,
        description = EXCLUDED.description,
        name = EXCLUDED.name,
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

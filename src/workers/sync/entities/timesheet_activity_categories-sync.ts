/**
 * Sync worker for Activity category definitions
 * Auto-generated from discovery analysis
 */

import { Pool } from 'pg';
import { BaseSyncWorker } from '../base-sync-worker.js';
import { config } from '../../../config/index.js';

export class TimesheetActivityCategoriesSyncWorker extends BaseSyncWorker {
  readonly endpointName = 'timesheet_activity_categories';
  readonly stEndpointPath = 'https://api.servicetitan.io/timesheets/v2/tenant/3222348440/activity-categories';
  readonly rawTable = 'raw.st_timesheet_activity_categories';
  readonly masterTable = 'master.timesheet_activity_categories';
  readonly stIdField = 'id';

  protected async transformToMaster(batchId: string): Promise<{ inserted: number; updated: number }> {
    const result = await this.db.query(`
      INSERT INTO ${this.masterTable} (
        st_id,
        active,
        allow_edit,
        created_on,
        is_default,
        modified_on,
        name,
        type,
        synced_at,
        sync_batch_id,
        payload_hash
      )
      SELECT 
        (payload->>'id')::bigint as st_id,
        (payload->>'active')::boolean as active,
        (payload->>'allowEdit')::boolean as allow_edit,
        (payload->>'createdOn')::timestamptz as created_on,
        (payload->>'isDefault')::boolean as is_default,
        (payload->>'modifiedOn')::timestamptz as modified_on,
        payload->>'name' as name,
        payload->>'type' as type,
        NOW() as synced_at,
        $1::uuid as sync_batch_id,
        md5(payload::text) as payload_hash
      FROM ${this.rawTable}
      WHERE sync_batch_id = $1
      ON CONFLICT (st_id) DO UPDATE SET
        active = EXCLUDED.active,
        allow_edit = EXCLUDED.allow_edit,
        created_on = EXCLUDED.created_on,
        is_default = EXCLUDED.is_default,
        modified_on = EXCLUDED.modified_on,
        name = EXCLUDED.name,
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

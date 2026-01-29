/**
 * Sync worker for Tag type definitions
 * Auto-generated from discovery analysis
 */

import { Pool } from 'pg';
import { BaseSyncWorker } from '../base-sync-worker.js';
import { config } from '../../../config/index.js';

export class TagTypesSyncWorker extends BaseSyncWorker {
  readonly endpointName = 'tag_types';
  readonly stEndpointPath = 'https://api.servicetitan.io/settings/v2/tenant/3222348440/tag-types';
  readonly rawTable = 'raw.st_tag_types';
  readonly masterTable = 'master.tag_types';
  readonly stIdField = 'id';

  protected async transformToMaster(batchId: string): Promise<{ inserted: number; updated: number }> {
    const result = await this.db.query(`
      INSERT INTO ${this.masterTable} (
        st_id,
        active,
        allow_to_use_on_timesheet_activity,
        code,
        color,
        created_on,
        importance,
        is_conversion_opportunity,
        is_visible_on_dispatch_board,
        modified_on,
        name,
        synced_at,
        sync_batch_id,
        payload_hash
      )
      SELECT 
        (payload->>'id')::bigint as st_id,
        (payload->>'active')::boolean as active,
        (payload->>'allowToUseOnTimesheetActivity')::boolean as allow_to_use_on_timesheet_activity,
        payload->>'code' as code,
        payload->>'color' as color,
        (payload->>'createdOn')::timestamptz as created_on,
        payload->>'importance' as importance,
        (payload->>'isConversionOpportunity')::boolean as is_conversion_opportunity,
        (payload->>'isVisibleOnDispatchBoard')::boolean as is_visible_on_dispatch_board,
        (payload->>'modifiedOn')::timestamptz as modified_on,
        payload->>'name' as name,
        NOW() as synced_at,
        $1::uuid as sync_batch_id,
        md5(payload::text) as payload_hash
      FROM ${this.rawTable}
      WHERE sync_batch_id = $1
      ON CONFLICT (st_id) DO UPDATE SET
        active = EXCLUDED.active,
        allow_to_use_on_timesheet_activity = EXCLUDED.allow_to_use_on_timesheet_activity,
        code = EXCLUDED.code,
        color = EXCLUDED.color,
        created_on = EXCLUDED.created_on,
        importance = EXCLUDED.importance,
        is_conversion_opportunity = EXCLUDED.is_conversion_opportunity,
        is_visible_on_dispatch_board = EXCLUDED.is_visible_on_dispatch_board,
        modified_on = EXCLUDED.modified_on,
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

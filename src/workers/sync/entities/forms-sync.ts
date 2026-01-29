/**
 * Sync worker for Form definitions
 * Auto-generated from discovery analysis
 */

import { Pool } from 'pg';
import { BaseSyncWorker } from '../base-sync-worker.js';
import { config } from '../../../config/index.js';

export class FormsSyncWorker extends BaseSyncWorker {
  readonly endpointName = 'forms';
  readonly stEndpointPath = 'https://api.servicetitan.io/forms/v2/tenant/3222348440/forms';
  readonly rawTable = 'raw.st_forms';
  readonly masterTable = 'master.forms';
  readonly stIdField = 'id';

  protected async transformToMaster(batchId: string): Promise<{ inserted: number; updated: number }> {
    const result = await this.db.query(`
      INSERT INTO ${this.masterTable} (
        st_id,
        active,
        created_by_id,
        created_on,
        has_conditional_logic,
        has_triggers,
        modified_on,
        name,
        published,
        synced_at,
        sync_batch_id,
        payload_hash
      )
      SELECT 
        (payload->>'id')::bigint as st_id,
        (payload->>'active')::boolean as active,
        (payload->>'createdById')::bigint as created_by_id,
        (payload->>'createdOn')::timestamptz as created_on,
        (payload->>'hasConditionalLogic')::boolean as has_conditional_logic,
        (payload->>'hasTriggers')::boolean as has_triggers,
        (payload->>'modifiedOn')::timestamptz as modified_on,
        payload->>'name' as name,
        (payload->>'published')::boolean as published,
        NOW() as synced_at,
        $1::uuid as sync_batch_id,
        md5(payload::text) as payload_hash
      FROM ${this.rawTable}
      WHERE sync_batch_id = $1
      ON CONFLICT (st_id) DO UPDATE SET
        active = EXCLUDED.active,
        created_by_id = EXCLUDED.created_by_id,
        created_on = EXCLUDED.created_on,
        has_conditional_logic = EXCLUDED.has_conditional_logic,
        has_triggers = EXCLUDED.has_triggers,
        modified_on = EXCLUDED.modified_on,
        name = EXCLUDED.name,
        published = EXCLUDED.published,
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

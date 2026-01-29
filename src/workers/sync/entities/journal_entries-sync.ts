/**
 * Sync worker for Journal entries
 * Auto-generated from discovery analysis
 */

import { Pool } from 'pg';
import { BaseSyncWorker } from '../base-sync-worker.js';
import { config } from '../../../config/index.js';

export class JournalEntriesSyncWorker extends BaseSyncWorker {
  readonly endpointName = 'journal_entries';
  readonly stEndpointPath = 'https://api.servicetitan.io/accounting/v2/tenant/3222348440/journal-entries';
  readonly rawTable = 'raw.st_journal_entries';
  readonly masterTable = 'master.journal_entries';
  readonly stIdField = 'id';

  protected async transformToMaster(batchId: string): Promise<{ inserted: number; updated: number }> {
    const result = await this.db.query(`
      INSERT INTO ${this.masterTable} (
        st_id,
        created_on,
        custom_fields,
        exported_by,
        exported_on,
        is_empty,
        last_sync_version_id,
        message,
        modified_on,
        name,
        number,
        post_date,
        status,
        sync_status,
        url,
        version_id,
        synced_at,
        sync_batch_id,
        payload_hash
      )
      SELECT 
        (payload->>'id')::bigint as st_id,
        (payload->>'createdOn')::timestamptz as created_on,
        payload->'customFields' as custom_fields,
        payload->>'exportedBy' as exported_by,
        (payload->>'exportedOn')::timestamptz as exported_on,
        (payload->>'isEmpty')::boolean as is_empty,
        (payload->>'lastSyncVersionId')::bigint as last_sync_version_id,
        payload->>'message' as message,
        (payload->>'modifiedOn')::timestamptz as modified_on,
        payload->>'name' as name,
        (payload->>'number')::numeric as number,
        (payload->>'postDate')::timestamptz as post_date,
        payload->>'status' as status,
        payload->>'syncStatus' as sync_status,
        payload->>'url' as url,
        (payload->>'versionId')::bigint as version_id,
        NOW() as synced_at,
        $1::uuid as sync_batch_id,
        md5(payload::text) as payload_hash
      FROM ${this.rawTable}
      WHERE sync_batch_id = $1
      ON CONFLICT (st_id) DO UPDATE SET
        created_on = EXCLUDED.created_on,
        custom_fields = EXCLUDED.custom_fields,
        exported_by = EXCLUDED.exported_by,
        exported_on = EXCLUDED.exported_on,
        is_empty = EXCLUDED.is_empty,
        last_sync_version_id = EXCLUDED.last_sync_version_id,
        message = EXCLUDED.message,
        modified_on = EXCLUDED.modified_on,
        name = EXCLUDED.name,
        number = EXCLUDED.number,
        post_date = EXCLUDED.post_date,
        status = EXCLUDED.status,
        sync_status = EXCLUDED.sync_status,
        url = EXCLUDED.url,
        version_id = EXCLUDED.version_id,
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

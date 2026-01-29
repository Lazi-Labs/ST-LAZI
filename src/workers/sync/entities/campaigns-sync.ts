/**
 * Sync worker for Marketing campaigns
 * Auto-generated from discovery analysis
 */

import { Pool } from 'pg';
import { BaseSyncWorker } from '../base-sync-worker.js';
import { config } from '../../../config/index.js';

export class CampaignsSyncWorker extends BaseSyncWorker {
  readonly endpointName = 'campaigns';
  readonly stEndpointPath = 'https://api.servicetitan.io/marketing/v2/tenant/3222348440/campaigns';
  readonly rawTable = 'raw.st_campaigns';
  readonly masterTable = 'master.campaigns';
  readonly stIdField = 'id';

  protected async transformToMaster(batchId: string): Promise<{ inserted: number; updated: number }> {
    const result = await this.db.query(`
      INSERT INTO ${this.masterTable} (
        st_id,
        active,
        business_unit,
        campaign_phone_numbers,
        category,
        created_on,
        is_default_campaign,
        medium,
        modified_on,
        name,
        other_medium,
        other_source,
        source,
        synced_at,
        sync_batch_id,
        payload_hash
      )
      SELECT 
        (payload->>'id')::bigint as st_id,
        (payload->>'active')::boolean as active,
        payload->>'businessUnit' as business_unit,
        payload->'campaignPhoneNumbers' as campaign_phone_numbers,
        payload->'category' as category,
        (payload->>'createdOn')::timestamptz as created_on,
        (payload->>'isDefaultCampaign')::boolean as is_default_campaign,
        payload->>'medium' as medium,
        (payload->>'modifiedOn')::timestamptz as modified_on,
        payload->>'name' as name,
        payload->>'otherMedium' as other_medium,
        payload->>'otherSource' as other_source,
        payload->>'source' as source,
        NOW() as synced_at,
        $1::uuid as sync_batch_id,
        md5(payload::text) as payload_hash
      FROM ${this.rawTable}
      WHERE sync_batch_id = $1
      ON CONFLICT (st_id) DO UPDATE SET
        active = EXCLUDED.active,
        business_unit = EXCLUDED.business_unit,
        campaign_phone_numbers = EXCLUDED.campaign_phone_numbers,
        category = EXCLUDED.category,
        created_on = EXCLUDED.created_on,
        is_default_campaign = EXCLUDED.is_default_campaign,
        medium = EXCLUDED.medium,
        modified_on = EXCLUDED.modified_on,
        name = EXCLUDED.name,
        other_medium = EXCLUDED.other_medium,
        other_source = EXCLUDED.other_source,
        source = EXCLUDED.source,
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

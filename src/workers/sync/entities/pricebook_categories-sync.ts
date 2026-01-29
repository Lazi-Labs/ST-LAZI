/**
 * Sync worker for Pricebook categories
 * Auto-generated from discovery analysis
 */

import { Pool } from 'pg';
import { BaseSyncWorker } from '../base-sync-worker.js';
import { config } from '../../../config/index.js';

export class PricebookCategoriesSyncWorker extends BaseSyncWorker {
  readonly endpointName = 'pricebook_categories';
  readonly stEndpointPath = 'https://api.servicetitan.io/pricebook/v2/tenant/3222348440/categories';
  readonly rawTable = 'raw.st_pricebook_categories';
  readonly masterTable = 'master.pricebook_categories';
  readonly stIdField = 'id';

  protected async transformToMaster(batchId: string): Promise<{ inserted: number; updated: number }> {
    const result = await this.db.query(`
      INSERT INTO ${this.masterTable} (
        st_id,
        active,
        business_unit_ids,
        category_type,
        description,
        external_id,
        hide_in_mobile,
        image,
        name,
        parent_id,
        position,
        sku_images,
        sku_videos,
        source,
        subcategories,
        synced_at,
        sync_batch_id,
        payload_hash
      )
      SELECT 
        (payload->>'id')::bigint as st_id,
        (payload->>'active')::boolean as active,
        payload->'businessUnitIds' as business_unit_ids,
        payload->>'categoryType' as category_type,
        payload->>'description' as description,
        payload->>'externalId' as external_id,
        (payload->>'hideInMobile')::boolean as hide_in_mobile,
        payload->>'image' as image,
        payload->>'name' as name,
        payload->>'parentId' as parent_id,
        (payload->>'position')::numeric as position,
        payload->'skuImages' as sku_images,
        payload->'skuVideos' as sku_videos,
        payload->>'source' as source,
        payload->'subcategories' as subcategories,
        NOW() as synced_at,
        $1::uuid as sync_batch_id,
        md5(payload::text) as payload_hash
      FROM ${this.rawTable}
      WHERE sync_batch_id = $1
      ON CONFLICT (st_id) DO UPDATE SET
        active = EXCLUDED.active,
        business_unit_ids = EXCLUDED.business_unit_ids,
        category_type = EXCLUDED.category_type,
        description = EXCLUDED.description,
        external_id = EXCLUDED.external_id,
        hide_in_mobile = EXCLUDED.hide_in_mobile,
        image = EXCLUDED.image,
        name = EXCLUDED.name,
        parent_id = EXCLUDED.parent_id,
        position = EXCLUDED.position,
        sku_images = EXCLUDED.sku_images,
        sku_videos = EXCLUDED.sku_videos,
        source = EXCLUDED.source,
        subcategories = EXCLUDED.subcategories,
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

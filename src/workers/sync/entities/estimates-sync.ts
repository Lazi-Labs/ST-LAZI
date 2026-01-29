/**
 * Sync worker for Estimate records
 * Auto-generated from discovery analysis
 */

import { Pool } from 'pg';
import { BaseSyncWorker } from '../base-sync-worker.js';
import { config } from '../../../config/index.js';

export class EstimatesSyncWorker extends BaseSyncWorker {
  readonly endpointName = 'estimates';
  readonly stEndpointPath = 'https://api.servicetitan.io/sales/v2/tenant/3222348440/estimates';
  readonly rawTable = 'raw.st_estimates';
  readonly masterTable = 'master.estimates';
  readonly stIdField = 'id';

  protected async transformToMaster(batchId: string): Promise<{ inserted: number; updated: number }> {
    const result = await this.db.query(`
      INSERT INTO ${this.masterTable} (
        st_id,
        active,
        budget_code_id,
        business_unit_id,
        business_unit_name,
        created_on,
        customer_id,
        external_links,
        is_change_order,
        is_recommended,
        items,
        job_id,
        job_number,
        location_id,
        modified_on,
        name,
        project_id,
        proposal_tag_name,
        review_status,
        sold_by,
        sold_on,
        status,
        subtotal,
        summary,
        tax,
        synced_at,
        sync_batch_id,
        payload_hash
      )
      SELECT 
        (payload->>'id')::bigint as st_id,
        (payload->>'active')::boolean as active,
        payload->>'budgetCodeId' as budget_code_id,
        (payload->>'businessUnitId')::bigint as business_unit_id,
        payload->>'businessUnitName' as business_unit_name,
        (payload->>'createdOn')::timestamptz as created_on,
        (payload->>'customerId')::bigint as customer_id,
        payload->'externalLinks' as external_links,
        (payload->>'isChangeOrder')::boolean as is_change_order,
        (payload->>'isRecommended')::boolean as is_recommended,
        payload->'items' as items,
        (payload->>'jobId')::bigint as job_id,
        payload->>'jobNumber' as job_number,
        (payload->>'locationId')::bigint as location_id,
        (payload->>'modifiedOn')::timestamptz as modified_on,
        payload->>'name' as name,
        (payload->>'projectId')::bigint as project_id,
        payload->>'proposalTagName' as proposal_tag_name,
        payload->>'reviewStatus' as review_status,
        (payload->>'soldBy')::numeric as sold_by,
        (payload->>'soldOn')::timestamptz as sold_on,
        payload->'status' as status,
        (payload->>'subtotal')::numeric as subtotal,
        payload->>'summary' as summary,
        (payload->>'tax')::numeric as tax,
        NOW() as synced_at,
        $1::uuid as sync_batch_id,
        md5(payload::text) as payload_hash
      FROM ${this.rawTable}
      WHERE sync_batch_id = $1
      ON CONFLICT (st_id) DO UPDATE SET
        active = EXCLUDED.active,
        budget_code_id = EXCLUDED.budget_code_id,
        business_unit_id = EXCLUDED.business_unit_id,
        business_unit_name = EXCLUDED.business_unit_name,
        created_on = EXCLUDED.created_on,
        customer_id = EXCLUDED.customer_id,
        external_links = EXCLUDED.external_links,
        is_change_order = EXCLUDED.is_change_order,
        is_recommended = EXCLUDED.is_recommended,
        items = EXCLUDED.items,
        job_id = EXCLUDED.job_id,
        job_number = EXCLUDED.job_number,
        location_id = EXCLUDED.location_id,
        modified_on = EXCLUDED.modified_on,
        name = EXCLUDED.name,
        project_id = EXCLUDED.project_id,
        proposal_tag_name = EXCLUDED.proposal_tag_name,
        review_status = EXCLUDED.review_status,
        sold_by = EXCLUDED.sold_by,
        sold_on = EXCLUDED.sold_on,
        status = EXCLUDED.status,
        subtotal = EXCLUDED.subtotal,
        summary = EXCLUDED.summary,
        tax = EXCLUDED.tax,
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

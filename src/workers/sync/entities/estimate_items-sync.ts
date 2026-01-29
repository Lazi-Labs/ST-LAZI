/**
 * Sync worker for Estimate line items
 * Auto-generated from discovery analysis
 */

import { Pool } from 'pg';
import { BaseSyncWorker } from '../base-sync-worker.js';
import { config } from '../../../config/index.js';

export class EstimateItemsSyncWorker extends BaseSyncWorker {
  readonly endpointName = 'estimate_items';
  readonly stEndpointPath = 'https://api.servicetitan.io/sales/v2/tenant/3222348440/estimates/items';
  readonly rawTable = 'raw.st_estimate_items';
  readonly masterTable = 'master.estimate_items';
  readonly stIdField = 'id';

  protected async transformToMaster(batchId: string): Promise<{ inserted: number; updated: number }> {
    const result = await this.db.query(`
      INSERT INTO ${this.masterTable} (
        st_id,
        budget_code_id,
        chargeable,
        created_on,
        description,
        invoice_item_id,
        item_group_name,
        item_group_root_id,
        membership_type_id,
        modified_on,
        qty,
        sku,
        sku_account,
        total,
        total_cost,
        unit_cost,
        unit_rate,
        synced_at,
        sync_batch_id,
        payload_hash
      )
      SELECT 
        (payload->>'id')::bigint as st_id,
        payload->>'budgetCodeId' as budget_code_id,
        (payload->>'chargeable')::boolean as chargeable,
        (payload->>'createdOn')::timestamptz as created_on,
        payload->>'description' as description,
        payload->>'invoiceItemId' as invoice_item_id,
        payload->>'itemGroupName' as item_group_name,
        payload->>'itemGroupRootId' as item_group_root_id,
        payload->>'membershipTypeId' as membership_type_id,
        (payload->>'modifiedOn')::timestamptz as modified_on,
        (payload->>'qty')::numeric as qty,
        payload->'sku' as sku,
        payload->>'skuAccount' as sku_account,
        (payload->>'total')::numeric as total,
        (payload->>'totalCost')::numeric as total_cost,
        (payload->>'unitCost')::numeric as unit_cost,
        (payload->>'unitRate')::numeric as unit_rate,
        NOW() as synced_at,
        $1::uuid as sync_batch_id,
        md5(payload::text) as payload_hash
      FROM ${this.rawTable}
      WHERE sync_batch_id = $1
      ON CONFLICT (st_id) DO UPDATE SET
        budget_code_id = EXCLUDED.budget_code_id,
        chargeable = EXCLUDED.chargeable,
        created_on = EXCLUDED.created_on,
        description = EXCLUDED.description,
        invoice_item_id = EXCLUDED.invoice_item_id,
        item_group_name = EXCLUDED.item_group_name,
        item_group_root_id = EXCLUDED.item_group_root_id,
        membership_type_id = EXCLUDED.membership_type_id,
        modified_on = EXCLUDED.modified_on,
        qty = EXCLUDED.qty,
        sku = EXCLUDED.sku,
        sku_account = EXCLUDED.sku_account,
        total = EXCLUDED.total,
        total_cost = EXCLUDED.total_cost,
        unit_cost = EXCLUDED.unit_cost,
        unit_rate = EXCLUDED.unit_rate,
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

/**
 * Sync worker for Discounts and fees
 * Auto-generated from discovery analysis
 */

import { Pool } from 'pg';
import { BaseSyncWorker } from '../base-sync-worker.js';
import { config } from '../../../config/index.js';

export class PricebookDiscountsAndFeesSyncWorker extends BaseSyncWorker {
  readonly endpointName = 'pricebook_discounts_and_fees';
  readonly stEndpointPath = 'https://api.servicetitan.io/pricebook/v2/tenant/3222348440/discounts-and-fees';
  readonly rawTable = 'raw.st_pricebook_discounts_and_fees';
  readonly masterTable = 'master.pricebook_discounts_and_fees';
  readonly stIdField = 'id';

  protected async transformToMaster(batchId: string): Promise<{ inserted: number; updated: number }> {
    const result = await this.db.query(`
      INSERT INTO ${this.masterTable} (
        st_id,
        account,
        active,
        amount,
        amount_type,
        assets,
        bonus,
        budget_cost_code,
        budget_cost_type,
        categories,
        code,
        commission_bonus,
        cross_sale_group,
        description,
        display_name,
        exclude_from_payroll,
        external_data,
        hours,
        "limit",
        pays_commission,
        taxable,
        type,
        synced_at,
        sync_batch_id,
        payload_hash
      )
      SELECT 
        (payload->>'id')::bigint as st_id,
        payload->>'account' as account,
        (payload->>'active')::boolean as active,
        (payload->>'amount')::numeric as amount,
        payload->>'amountType' as amount_type,
        payload->'assets' as assets,
        (payload->>'bonus')::numeric as bonus,
        payload->>'budgetCostCode' as budget_cost_code,
        payload->>'budgetCostType' as budget_cost_type,
        payload->'categories' as categories,
        payload->>'code' as code,
        (payload->>'commissionBonus')::numeric as commission_bonus,
        payload->>'crossSaleGroup' as cross_sale_group,
        payload->>'description' as description,
        payload->>'displayName' as display_name,
        (payload->>'excludeFromPayroll')::boolean as exclude_from_payroll,
        payload->'externalData' as external_data,
        (payload->>'hours')::numeric as hours,
        (payload->>'limit')::numeric as "limit",
        (payload->>'paysCommission')::boolean as pays_commission,
        (payload->>'taxable')::boolean as taxable,
        payload->>'type' as type,
        NOW() as synced_at,
        $1::uuid as sync_batch_id,
        md5(payload::text) as payload_hash
      FROM ${this.rawTable}
      WHERE sync_batch_id = $1
      ON CONFLICT (st_id) DO UPDATE SET
        account = EXCLUDED.account,
        active = EXCLUDED.active,
        amount = EXCLUDED.amount,
        amount_type = EXCLUDED.amount_type,
        assets = EXCLUDED.assets,
        bonus = EXCLUDED.bonus,
        budget_cost_code = EXCLUDED.budget_cost_code,
        budget_cost_type = EXCLUDED.budget_cost_type,
        categories = EXCLUDED.categories,
        code = EXCLUDED.code,
        commission_bonus = EXCLUDED.commission_bonus,
        cross_sale_group = EXCLUDED.cross_sale_group,
        description = EXCLUDED.description,
        display_name = EXCLUDED.display_name,
        exclude_from_payroll = EXCLUDED.exclude_from_payroll,
        external_data = EXCLUDED.external_data,
        hours = EXCLUDED.hours,
        "limit" = EXCLUDED."limit",
        pays_commission = EXCLUDED.pays_commission,
        taxable = EXCLUDED.taxable,
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

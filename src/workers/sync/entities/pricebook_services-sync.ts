/**
 * Sync worker for Pricebook service items
 * Auto-generated from discovery analysis
 */

import { Pool } from 'pg';
import { BaseSyncWorker } from '../base-sync-worker.js';
import { config } from '../../../config/index.js';

export class PricebookServicesSyncWorker extends BaseSyncWorker {
  readonly endpointName = 'pricebook_services';
  readonly stEndpointPath = 'https://api.servicetitan.io/pricebook/v2/tenant/3222348440/services';
  readonly rawTable = 'raw.st_pricebook_services';
  readonly masterTable = 'master.pricebook_services';
  readonly stIdField = 'id';

  protected async transformToMaster(batchId: string): Promise<{ inserted: number; updated: number }> {
    const result = await this.db.query(`
      INSERT INTO ${this.masterTable} (
        st_id,
        account,
        active,
        add_on_member_price,
        add_on_price,
        assets,
        bonus,
        budget_cost_code,
        budget_cost_type,
        business_unit_id,
        calculated_price,
        categories,
        code,
        commission_bonus,
        cost,
        created_on,
        cross_sale_group,
        default_asset_url,
        description,
        display_name,
        external_data,
        external_id,
        hours,
        is_labor,
        member_price,
        modified_on,
        pays_commission,
        price,
        recommendations,
        service_equipment,
        service_materials,
        sold_by_commission,
        source,
        taxable,
        upgrades,
        use_static_prices,
        warranty,
        synced_at,
        sync_batch_id,
        payload_hash
      )
      SELECT 
        (payload->>'id')::bigint as st_id,
        payload->>'account' as account,
        (payload->>'active')::boolean as active,
        (payload->>'addOnMemberPrice')::numeric as add_on_member_price,
        (payload->>'addOnPrice')::numeric as add_on_price,
        payload->'assets' as assets,
        (payload->>'bonus')::numeric as bonus,
        payload->>'budgetCostCode' as budget_cost_code,
        payload->>'budgetCostType' as budget_cost_type,
        (payload->>'businessUnitId')::bigint as business_unit_id,
        payload->>'calculatedPrice' as calculated_price,
        payload->'categories' as categories,
        payload->>'code' as code,
        (payload->>'commissionBonus')::numeric as commission_bonus,
        (payload->>'cost')::numeric as cost,
        (payload->>'createdOn')::timestamptz as created_on,
        payload->>'crossSaleGroup' as cross_sale_group,
        payload->>'defaultAssetUrl' as default_asset_url,
        payload->>'description' as description,
        payload->>'displayName' as display_name,
        payload->'externalData' as external_data,
        payload->>'externalId' as external_id,
        (payload->>'hours')::numeric as hours,
        (payload->>'isLabor')::boolean as is_labor,
        (payload->>'memberPrice')::numeric as member_price,
        (payload->>'modifiedOn')::timestamptz as modified_on,
        (payload->>'paysCommission')::boolean as pays_commission,
        (payload->>'price')::numeric as price,
        payload->'recommendations' as recommendations,
        payload->'serviceEquipment' as service_equipment,
        payload->'serviceMaterials' as service_materials,
        (payload->>'soldByCommission')::numeric as sold_by_commission,
        payload->>'source' as source,
        (payload->>'taxable')::boolean as taxable,
        payload->'upgrades' as upgrades,
        payload->>'useStaticPrices' as use_static_prices,
        payload->'warranty' as warranty,
        NOW() as synced_at,
        $1::uuid as sync_batch_id,
        md5(payload::text) as payload_hash
      FROM ${this.rawTable}
      WHERE sync_batch_id = $1
      ON CONFLICT (st_id) DO UPDATE SET
        account = EXCLUDED.account,
        active = EXCLUDED.active,
        add_on_member_price = EXCLUDED.add_on_member_price,
        add_on_price = EXCLUDED.add_on_price,
        assets = EXCLUDED.assets,
        bonus = EXCLUDED.bonus,
        budget_cost_code = EXCLUDED.budget_cost_code,
        budget_cost_type = EXCLUDED.budget_cost_type,
        business_unit_id = EXCLUDED.business_unit_id,
        calculated_price = EXCLUDED.calculated_price,
        categories = EXCLUDED.categories,
        code = EXCLUDED.code,
        commission_bonus = EXCLUDED.commission_bonus,
        cost = EXCLUDED.cost,
        created_on = EXCLUDED.created_on,
        cross_sale_group = EXCLUDED.cross_sale_group,
        default_asset_url = EXCLUDED.default_asset_url,
        description = EXCLUDED.description,
        display_name = EXCLUDED.display_name,
        external_data = EXCLUDED.external_data,
        external_id = EXCLUDED.external_id,
        hours = EXCLUDED.hours,
        is_labor = EXCLUDED.is_labor,
        member_price = EXCLUDED.member_price,
        modified_on = EXCLUDED.modified_on,
        pays_commission = EXCLUDED.pays_commission,
        price = EXCLUDED.price,
        recommendations = EXCLUDED.recommendations,
        service_equipment = EXCLUDED.service_equipment,
        service_materials = EXCLUDED.service_materials,
        sold_by_commission = EXCLUDED.sold_by_commission,
        source = EXCLUDED.source,
        taxable = EXCLUDED.taxable,
        upgrades = EXCLUDED.upgrades,
        use_static_prices = EXCLUDED.use_static_prices,
        warranty = EXCLUDED.warranty,
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

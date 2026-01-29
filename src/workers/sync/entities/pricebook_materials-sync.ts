/**
 * Sync worker for Pricebook material items
 * Auto-generated from discovery analysis
 */

import { Pool } from 'pg';
import { BaseSyncWorker } from '../base-sync-worker.js';
import { config } from '../../../config/index.js';

export class PricebookMaterialsSyncWorker extends BaseSyncWorker {
  readonly endpointName = 'pricebook_materials';
  readonly stEndpointPath = 'https://api.servicetitan.io/pricebook/v2/tenant/3222348440/materials';
  readonly rawTable = 'raw.st_pricebook_materials';
  readonly masterTable = 'master.pricebook_materials';
  readonly stIdField = 'id';

  protected async transformToMaster(batchId: string): Promise<{ inserted: number; updated: number }> {
    const result = await this.db.query(`
      INSERT INTO ${this.masterTable} (
        st_id,
        account,
        active,
        add_on_member_price,
        add_on_price,
        asset_account,
        assets,
        bonus,
        budget_cost_code,
        budget_cost_type,
        business_unit_id,
        categories,
        chargeable_by_default,
        code,
        commission_bonus,
        cost,
        cost_of_sale_account,
        cost_type_id,
        created_by_id,
        created_on,
        deduct_as_job_cost,
        default_asset_url,
        description,
        display_in_amount,
        display_name,
        external_data,
        external_id,
        general_ledger_account_id,
        hours,
        is_configurable_material,
        is_inventory,
        is_other_direct_cost,
        member_price,
        modified_on,
        other_vendors,
        pays_commission,
        price,
        primary_vendor,
        source,
        taxable,
        unit_of_measure,
        variations_or_configurable_materials,
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
        payload->>'assetAccount' as asset_account,
        payload->'assets' as assets,
        (payload->>'bonus')::numeric as bonus,
        payload->>'budgetCostCode' as budget_cost_code,
        payload->>'budgetCostType' as budget_cost_type,
        payload->>'businessUnitId' as business_unit_id,
        payload->'categories' as categories,
        (payload->>'chargeableByDefault')::boolean as chargeable_by_default,
        payload->>'code' as code,
        (payload->>'commissionBonus')::numeric as commission_bonus,
        (payload->>'cost')::numeric as cost,
        payload->>'costOfSaleAccount' as cost_of_sale_account,
        payload->>'costTypeId' as cost_type_id,
        (payload->>'createdById')::bigint as created_by_id,
        (payload->>'createdOn')::timestamptz as created_on,
        (payload->>'deductAsJobCost')::boolean as deduct_as_job_cost,
        payload->>'defaultAssetUrl' as default_asset_url,
        payload->>'description' as description,
        (payload->>'displayInAmount')::boolean as display_in_amount,
        payload->>'displayName' as display_name,
        payload->'externalData' as external_data,
        payload->>'externalId' as external_id,
        (payload->>'generalLedgerAccountId')::bigint as general_ledger_account_id,
        (payload->>'hours')::numeric as hours,
        (payload->>'isConfigurableMaterial')::boolean as is_configurable_material,
        (payload->>'isInventory')::boolean as is_inventory,
        (payload->>'isOtherDirectCost')::boolean as is_other_direct_cost,
        (payload->>'memberPrice')::numeric as member_price,
        (payload->>'modifiedOn')::timestamptz as modified_on,
        payload->'otherVendors' as other_vendors,
        (payload->>'paysCommission')::boolean as pays_commission,
        (payload->>'price')::numeric as price,
        payload->'primaryVendor' as primary_vendor,
        payload->>'source' as source,
        (payload->>'taxable')::boolean as taxable,
        payload->>'unitOfMeasure' as unit_of_measure,
        payload->'variationsOrConfigurableMaterials' as variations_or_configurable_materials,
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
        asset_account = EXCLUDED.asset_account,
        assets = EXCLUDED.assets,
        bonus = EXCLUDED.bonus,
        budget_cost_code = EXCLUDED.budget_cost_code,
        budget_cost_type = EXCLUDED.budget_cost_type,
        business_unit_id = EXCLUDED.business_unit_id,
        categories = EXCLUDED.categories,
        chargeable_by_default = EXCLUDED.chargeable_by_default,
        code = EXCLUDED.code,
        commission_bonus = EXCLUDED.commission_bonus,
        cost = EXCLUDED.cost,
        cost_of_sale_account = EXCLUDED.cost_of_sale_account,
        cost_type_id = EXCLUDED.cost_type_id,
        created_by_id = EXCLUDED.created_by_id,
        created_on = EXCLUDED.created_on,
        deduct_as_job_cost = EXCLUDED.deduct_as_job_cost,
        default_asset_url = EXCLUDED.default_asset_url,
        description = EXCLUDED.description,
        display_in_amount = EXCLUDED.display_in_amount,
        display_name = EXCLUDED.display_name,
        external_data = EXCLUDED.external_data,
        external_id = EXCLUDED.external_id,
        general_ledger_account_id = EXCLUDED.general_ledger_account_id,
        hours = EXCLUDED.hours,
        is_configurable_material = EXCLUDED.is_configurable_material,
        is_inventory = EXCLUDED.is_inventory,
        is_other_direct_cost = EXCLUDED.is_other_direct_cost,
        member_price = EXCLUDED.member_price,
        modified_on = EXCLUDED.modified_on,
        other_vendors = EXCLUDED.other_vendors,
        pays_commission = EXCLUDED.pays_commission,
        price = EXCLUDED.price,
        primary_vendor = EXCLUDED.primary_vendor,
        source = EXCLUDED.source,
        taxable = EXCLUDED.taxable,
        unit_of_measure = EXCLUDED.unit_of_measure,
        variations_or_configurable_materials = EXCLUDED.variations_or_configurable_materials,
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

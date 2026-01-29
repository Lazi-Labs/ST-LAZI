/**
 * Sync worker for Pricebook equipment items
 * Auto-generated from discovery analysis
 */

import { Pool } from 'pg';
import { BaseSyncWorker } from '../base-sync-worker.js';
import { config } from '../../../config/index.js';

export class PricebookEquipmentSyncWorker extends BaseSyncWorker {
  readonly endpointName = 'pricebook_equipment';
  readonly stEndpointPath = 'https://api.servicetitan.io/pricebook/v2/tenant/3222348440/equipment';
  readonly rawTable = 'raw.st_pricebook_equipment';
  readonly masterTable = 'master.pricebook_equipment';
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
        categories,
        code,
        commission_bonus,
        cost,
        cost_of_sale_account,
        created_on,
        cross_sale_group,
        default_asset_url,
        description,
        dimensions,
        display_in_amount,
        display_name,
        equipment_materials,
        external_data,
        external_id,
        general_ledger_account_id,
        hours,
        is_configurable_equipment,
        is_inventory,
        manufacturer,
        manufacturer_warranty,
        member_price,
        model,
        modified_on,
        other_vendors,
        pays_commission,
        price,
        primary_vendor,
        recommendations,
        service_provider_warranty,
        source,
        taxable,
        type_id,
        unit_of_measure,
        upgrades,
        variations_or_configurable_equipment,
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
        payload->'categories' as categories,
        payload->>'code' as code,
        (payload->>'commissionBonus')::numeric as commission_bonus,
        (payload->>'cost')::numeric as cost,
        payload->>'costOfSaleAccount' as cost_of_sale_account,
        (payload->>'createdOn')::timestamptz as created_on,
        payload->>'crossSaleGroup' as cross_sale_group,
        payload->>'defaultAssetUrl' as default_asset_url,
        payload->>'description' as description,
        payload->'dimensions' as dimensions,
        (payload->>'displayInAmount')::boolean as display_in_amount,
        payload->>'displayName' as display_name,
        payload->'equipmentMaterials' as equipment_materials,
        payload->'externalData' as external_data,
        payload->>'externalId' as external_id,
        (payload->>'generalLedgerAccountId')::bigint as general_ledger_account_id,
        (payload->>'hours')::numeric as hours,
        (payload->>'isConfigurableEquipment')::boolean as is_configurable_equipment,
        (payload->>'isInventory')::boolean as is_inventory,
        payload->>'manufacturer' as manufacturer,
        payload->'manufacturerWarranty' as manufacturer_warranty,
        (payload->>'memberPrice')::numeric as member_price,
        payload->>'model' as model,
        (payload->>'modifiedOn')::timestamptz as modified_on,
        payload->'otherVendors' as other_vendors,
        (payload->>'paysCommission')::boolean as pays_commission,
        (payload->>'price')::numeric as price,
        payload->'primaryVendor' as primary_vendor,
        payload->'recommendations' as recommendations,
        payload->'serviceProviderWarranty' as service_provider_warranty,
        payload->>'source' as source,
        (payload->>'taxable')::boolean as taxable,
        (payload->>'typeId')::bigint as type_id,
        payload->>'unitOfMeasure' as unit_of_measure,
        payload->'upgrades' as upgrades,
        payload->'variationsOrConfigurableEquipment' as variations_or_configurable_equipment,
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
        categories = EXCLUDED.categories,
        code = EXCLUDED.code,
        commission_bonus = EXCLUDED.commission_bonus,
        cost = EXCLUDED.cost,
        cost_of_sale_account = EXCLUDED.cost_of_sale_account,
        created_on = EXCLUDED.created_on,
        cross_sale_group = EXCLUDED.cross_sale_group,
        default_asset_url = EXCLUDED.default_asset_url,
        description = EXCLUDED.description,
        dimensions = EXCLUDED.dimensions,
        display_in_amount = EXCLUDED.display_in_amount,
        display_name = EXCLUDED.display_name,
        equipment_materials = EXCLUDED.equipment_materials,
        external_data = EXCLUDED.external_data,
        external_id = EXCLUDED.external_id,
        general_ledger_account_id = EXCLUDED.general_ledger_account_id,
        hours = EXCLUDED.hours,
        is_configurable_equipment = EXCLUDED.is_configurable_equipment,
        is_inventory = EXCLUDED.is_inventory,
        manufacturer = EXCLUDED.manufacturer,
        manufacturer_warranty = EXCLUDED.manufacturer_warranty,
        member_price = EXCLUDED.member_price,
        model = EXCLUDED.model,
        modified_on = EXCLUDED.modified_on,
        other_vendors = EXCLUDED.other_vendors,
        pays_commission = EXCLUDED.pays_commission,
        price = EXCLUDED.price,
        primary_vendor = EXCLUDED.primary_vendor,
        recommendations = EXCLUDED.recommendations,
        service_provider_warranty = EXCLUDED.service_provider_warranty,
        source = EXCLUDED.source,
        taxable = EXCLUDED.taxable,
        type_id = EXCLUDED.type_id,
        unit_of_measure = EXCLUDED.unit_of_measure,
        upgrades = EXCLUDED.upgrades,
        variations_or_configurable_equipment = EXCLUDED.variations_or_configurable_equipment,
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

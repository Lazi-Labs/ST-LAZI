/**
 * Sync worker for ServiceTitan Pricebook Services
 */

import { Pool } from 'pg';
import { BaseSyncWorker } from './base-sync-worker.js';
import { config } from '../../config/index.js';

export class PricebookServicesSyncWorker extends BaseSyncWorker {
  readonly endpointName = 'pricebook_services';
  readonly stEndpointPath = `${config.serviceTitan.apiBaseUrl}/pricebook/v2/tenant/${config.serviceTitan.tenantId}/services`;
  readonly rawTable = 'raw.st_pricebook_services';
  readonly masterTable = 'master.pricebook_services';
  readonly stIdField = 'id';

  protected async transformToMaster(batchId: string): Promise<{ inserted: number; updated: number }> {
    // Transform from raw JSONB to typed master columns
    // Columns match the auto-generated schema from discovery
    const result = await this.db.query(`
      INSERT INTO ${this.masterTable} (
        st_id,
        code,
        display_name,
        description,
        active,
        price,
        cost,
        member_price,
        add_on_price,
        add_on_member_price,
        hours,
        bonus,
        commission_bonus,
        sold_by_commission,
        pays_commission,
        taxable,
        is_labor,
        account,
        source,
        external_id,
        categories,
        assets,
        service_materials,
        service_equipment,
        recommendations,
        upgrades,
        warranty,
        external_data,
        cross_sale_group,
        business_unit_id,
        created_on,
        modified_on,
        synced_at,
        sync_batch_id,
        payload_hash
      )
      SELECT 
        (payload->>'id')::bigint as st_id,
        payload->>'code' as code,
        payload->>'displayName' as display_name,
        payload->>'description' as description,
        (payload->>'active')::boolean as active,
        ROUND((payload->>'price')::numeric)::int as price,
        ROUND((payload->>'cost')::numeric)::int as cost,
        ROUND((payload->>'memberPrice')::numeric)::int as member_price,
        ROUND((payload->>'addOnPrice')::numeric)::int as add_on_price,
        ROUND((payload->>'addOnMemberPrice')::numeric)::int as add_on_member_price,
        (payload->>'hours')::numeric(12,2) as hours,
        (payload->>'bonus')::numeric(12,2) as bonus,
        (payload->>'commissionBonus')::int as commission_bonus,
        (payload->>'soldByCommission')::int as sold_by_commission,
        (payload->>'paysCommission')::boolean as pays_commission,
        (payload->>'taxable')::boolean as taxable,
        (payload->>'isLabor')::boolean as is_labor,
        payload->>'account' as account,
        payload->>'source' as source,
        payload->>'externalId' as external_id,
        payload->'categories' as categories,
        payload->'assets' as assets,
        payload->'serviceMaterials' as service_materials,
        payload->'serviceEquipment' as service_equipment,
        payload->'recommendations' as recommendations,
        payload->'upgrades' as upgrades,
        payload->'warranty' as warranty,
        payload->'externalData' as external_data,
        payload->>'crossSaleGroup' as cross_sale_group,
        (payload->'businessUnitIds'->0)::int as business_unit_id,
        (payload->>'createdOn')::timestamptz as created_on,
        (payload->>'modifiedOn')::timestamptz as modified_on,
        NOW() as synced_at,
        $1::uuid as sync_batch_id,
        md5(payload::text) as payload_hash
      FROM ${this.rawTable}
      WHERE sync_batch_id = $1
      ON CONFLICT (st_id) DO UPDATE SET
        code = EXCLUDED.code,
        display_name = EXCLUDED.display_name,
        description = EXCLUDED.description,
        active = EXCLUDED.active,
        price = EXCLUDED.price,
        cost = EXCLUDED.cost,
        member_price = EXCLUDED.member_price,
        add_on_price = EXCLUDED.add_on_price,
        add_on_member_price = EXCLUDED.add_on_member_price,
        hours = EXCLUDED.hours,
        bonus = EXCLUDED.bonus,
        commission_bonus = EXCLUDED.commission_bonus,
        sold_by_commission = EXCLUDED.sold_by_commission,
        pays_commission = EXCLUDED.pays_commission,
        taxable = EXCLUDED.taxable,
        is_labor = EXCLUDED.is_labor,
        account = EXCLUDED.account,
        source = EXCLUDED.source,
        external_id = EXCLUDED.external_id,
        categories = EXCLUDED.categories,
        assets = EXCLUDED.assets,
        service_materials = EXCLUDED.service_materials,
        service_equipment = EXCLUDED.service_equipment,
        recommendations = EXCLUDED.recommendations,
        upgrades = EXCLUDED.upgrades,
        warranty = EXCLUDED.warranty,
        external_data = EXCLUDED.external_data,
        cross_sale_group = EXCLUDED.cross_sale_group,
        business_unit_id = EXCLUDED.business_unit_id,
        modified_on = EXCLUDED.modified_on,
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

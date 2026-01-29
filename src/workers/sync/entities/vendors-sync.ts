/**
 * Sync worker for Vendor records
 * Auto-generated from discovery analysis
 */

import { Pool } from 'pg';
import { BaseSyncWorker } from '../base-sync-worker.js';
import { config } from '../../../config/index.js';

export class VendorsSyncWorker extends BaseSyncWorker {
  readonly endpointName = 'vendors';
  readonly stEndpointPath = 'https://api.servicetitan.io/inventory/v2/tenant/3222348440/vendors';
  readonly rawTable = 'raw.st_vendors';
  readonly masterTable = 'master.vendors';
  readonly stIdField = 'id';

  protected async transformToMaster(batchId: string): Promise<{ inserted: number; updated: number }> {
    const result = await this.db.query(`
      INSERT INTO ${this.masterTable} (
        st_id,
        active,
        address,
        contact_info,
        created_on,
        default_tax_rate,
        delivery_option,
        external_data,
        is_mobile_creation_restricted,
        is_truck_replenishment,
        memo,
        modified_on,
        name,
        synced_at,
        sync_batch_id,
        payload_hash
      )
      SELECT 
        (payload->>'id')::bigint as st_id,
        (payload->>'active')::boolean as active,
        payload->'address' as address,
        payload->'contactInfo' as contact_info,
        (payload->>'createdOn')::timestamptz as created_on,
        (payload->>'defaultTaxRate')::numeric as default_tax_rate,
        payload->>'deliveryOption' as delivery_option,
        payload->>'externalData' as external_data,
        (payload->>'isMobileCreationRestricted')::boolean as is_mobile_creation_restricted,
        (payload->>'isTruckReplenishment')::boolean as is_truck_replenishment,
        payload->>'memo' as memo,
        (payload->>'modifiedOn')::timestamptz as modified_on,
        payload->>'name' as name,
        NOW() as synced_at,
        $1::uuid as sync_batch_id,
        md5(payload::text) as payload_hash
      FROM ${this.rawTable}
      WHERE sync_batch_id = $1
      ON CONFLICT (st_id) DO UPDATE SET
        active = EXCLUDED.active,
        address = EXCLUDED.address,
        contact_info = EXCLUDED.contact_info,
        created_on = EXCLUDED.created_on,
        default_tax_rate = EXCLUDED.default_tax_rate,
        delivery_option = EXCLUDED.delivery_option,
        external_data = EXCLUDED.external_data,
        is_mobile_creation_restricted = EXCLUDED.is_mobile_creation_restricted,
        is_truck_replenishment = EXCLUDED.is_truck_replenishment,
        memo = EXCLUDED.memo,
        modified_on = EXCLUDED.modified_on,
        name = EXCLUDED.name,
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

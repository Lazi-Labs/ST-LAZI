/**
 * Sync worker for Installed equipment at locations
 * Auto-generated from discovery analysis
 */

import { Pool } from 'pg';
import { BaseSyncWorker } from '../base-sync-worker.js';
import { config } from '../../../config/index.js';

export class InstalledEquipmentSyncWorker extends BaseSyncWorker {
  readonly endpointName = 'installed_equipment';
  readonly stEndpointPath = 'https://api.servicetitan.io/equipmentsystems/v2/tenant/3222348440/installed-equipment';
  readonly rawTable = 'raw.st_installed_equipment';
  readonly masterTable = 'master.installed_equipment';
  readonly stIdField = 'id';

  protected async transformToMaster(batchId: string): Promise<{ inserted: number; updated: number }> {
    const result = await this.db.query(`
      INSERT INTO ${this.masterTable} (
        st_id,
        active,
        actual_replacement_date,
        barcode_id,
        cost,
        created_on,
        customer_id,
        equipment_id,
        installed_on,
        invoice_item_id,
        location_id,
        manufacturer,
        manufacturer_warranty_end,
        manufacturer_warranty_start,
        memo,
        model,
        modified_on,
        name,
        predicted_replacement_date,
        predicted_replacement_months,
        serial_number,
        service_provider_warranty_end,
        service_provider_warranty_start,
        status,
        tags,
        type,
        synced_at,
        sync_batch_id,
        payload_hash
      )
      SELECT 
        (payload->>'id')::bigint as st_id,
        (payload->>'active')::boolean as active,
        payload->>'actualReplacementDate' as actual_replacement_date,
        payload->>'barcodeId' as barcode_id,
        (payload->>'cost')::numeric as cost,
        (payload->>'createdOn')::timestamptz as created_on,
        (payload->>'customerId')::bigint as customer_id,
        (payload->>'equipmentId')::bigint as equipment_id,
        (payload->>'installedOn')::timestamptz as installed_on,
        (payload->>'invoiceItemId')::bigint as invoice_item_id,
        (payload->>'locationId')::bigint as location_id,
        payload->>'manufacturer' as manufacturer,
        (payload->>'manufacturerWarrantyEnd')::timestamptz as manufacturer_warranty_end,
        (payload->>'manufacturerWarrantyStart')::timestamptz as manufacturer_warranty_start,
        payload->>'memo' as memo,
        payload->>'model' as model,
        (payload->>'modifiedOn')::timestamptz as modified_on,
        payload->>'name' as name,
        (payload->>'predictedReplacementDate')::timestamptz as predicted_replacement_date,
        (payload->>'predictedReplacementMonths')::numeric as predicted_replacement_months,
        payload->>'serialNumber' as serial_number,
        (payload->>'serviceProviderWarrantyEnd')::timestamptz as service_provider_warranty_end,
        (payload->>'serviceProviderWarrantyStart')::timestamptz as service_provider_warranty_start,
        (payload->>'status')::numeric as status,
        payload->'tags' as tags,
        payload->'type' as type,
        NOW() as synced_at,
        $1::uuid as sync_batch_id,
        md5(payload::text) as payload_hash
      FROM ${this.rawTable}
      WHERE sync_batch_id = $1
      ON CONFLICT (st_id) DO UPDATE SET
        active = EXCLUDED.active,
        actual_replacement_date = EXCLUDED.actual_replacement_date,
        barcode_id = EXCLUDED.barcode_id,
        cost = EXCLUDED.cost,
        created_on = EXCLUDED.created_on,
        customer_id = EXCLUDED.customer_id,
        equipment_id = EXCLUDED.equipment_id,
        installed_on = EXCLUDED.installed_on,
        invoice_item_id = EXCLUDED.invoice_item_id,
        location_id = EXCLUDED.location_id,
        manufacturer = EXCLUDED.manufacturer,
        manufacturer_warranty_end = EXCLUDED.manufacturer_warranty_end,
        manufacturer_warranty_start = EXCLUDED.manufacturer_warranty_start,
        memo = EXCLUDED.memo,
        model = EXCLUDED.model,
        modified_on = EXCLUDED.modified_on,
        name = EXCLUDED.name,
        predicted_replacement_date = EXCLUDED.predicted_replacement_date,
        predicted_replacement_months = EXCLUDED.predicted_replacement_months,
        serial_number = EXCLUDED.serial_number,
        service_provider_warranty_end = EXCLUDED.service_provider_warranty_end,
        service_provider_warranty_start = EXCLUDED.service_provider_warranty_start,
        status = EXCLUDED.status,
        tags = EXCLUDED.tags,
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

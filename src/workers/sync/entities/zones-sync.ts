/**
 * Sync worker for Dispatch zones
 * Auto-generated from discovery analysis
 */

import { Pool } from 'pg';
import { BaseSyncWorker } from '../base-sync-worker.js';
import { config } from '../../../config/index.js';

export class ZonesSyncWorker extends BaseSyncWorker {
  readonly endpointName = 'zones';
  readonly stEndpointPath = 'https://api.servicetitan.io/dispatch/v2/tenant/3222348440/zones';
  readonly rawTable = 'raw.st_zones';
  readonly masterTable = 'master.zones';
  readonly stIdField = 'id';

  protected async transformToMaster(batchId: string): Promise<{ inserted: number; updated: number }> {
    const result = await this.db.query(`
      INSERT INTO ${this.masterTable} (
        st_id,
        active,
        business_units,
        cities,
        created_by,
        created_on,
        locn_numbers,
        modified_on,
        name,
        service_days,
        service_days_enabled,
        technicians,
        territory_numbers,
        zips,
        synced_at,
        sync_batch_id,
        payload_hash
      )
      SELECT 
        (payload->>'id')::bigint as st_id,
        (payload->>'active')::boolean as active,
        payload->'businessUnits' as business_units,
        payload->'cities' as cities,
        (payload->>'createdBy')::numeric as created_by,
        (payload->>'createdOn')::timestamptz as created_on,
        payload->'locnNumbers' as locn_numbers,
        (payload->>'modifiedOn')::timestamptz as modified_on,
        payload->>'name' as name,
        payload->'serviceDays' as service_days,
        (payload->>'serviceDaysEnabled')::boolean as service_days_enabled,
        payload->'technicians' as technicians,
        payload->'territoryNumbers' as territory_numbers,
        payload->'zips' as zips,
        NOW() as synced_at,
        $1::uuid as sync_batch_id,
        md5(payload::text) as payload_hash
      FROM ${this.rawTable}
      WHERE sync_batch_id = $1
      ON CONFLICT (st_id) DO UPDATE SET
        active = EXCLUDED.active,
        business_units = EXCLUDED.business_units,
        cities = EXCLUDED.cities,
        created_by = EXCLUDED.created_by,
        created_on = EXCLUDED.created_on,
        locn_numbers = EXCLUDED.locn_numbers,
        modified_on = EXCLUDED.modified_on,
        name = EXCLUDED.name,
        service_days = EXCLUDED.service_days,
        service_days_enabled = EXCLUDED.service_days_enabled,
        technicians = EXCLUDED.technicians,
        territory_numbers = EXCLUDED.territory_numbers,
        zips = EXCLUDED.zips,
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

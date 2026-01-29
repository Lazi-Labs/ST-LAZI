/**
 * Sync worker for Technician records
 * Auto-generated from discovery analysis
 */

import { Pool } from 'pg';
import { BaseSyncWorker } from '../base-sync-worker.js';
import { config } from '../../../config/index.js';

export class TechniciansSyncWorker extends BaseSyncWorker {
  readonly endpointName = 'technicians';
  readonly stEndpointPath = 'https://api.servicetitan.io/settings/v2/tenant/3222348440/technicians';
  readonly rawTable = 'raw.st_technicians';
  readonly masterTable = 'master.technicians';
  readonly stIdField = 'id';

  protected async transformToMaster(batchId: string): Promise<{ inserted: number; updated: number }> {
    const result = await this.db.query(`
      INSERT INTO ${this.masterTable} (
        st_id,
        aad_user_id,
        account_locked,
        active,
        burden_rate,
        business_unit_id,
        created_on,
        custom_fields,
        daily_goal,
        email,
        home,
        is_managed_tech,
        job_filter,
        login_name,
        main_zone_id,
        modified_on,
        name,
        permissions,
        phone_number,
        role_ids,
        team,
        user_id,
        zone_ids,
        synced_at,
        sync_batch_id,
        payload_hash
      )
      SELECT 
        (payload->>'id')::bigint as st_id,
        payload->>'aadUserId' as aad_user_id,
        (payload->>'accountLocked')::boolean as account_locked,
        (payload->>'active')::boolean as active,
        (payload->>'burdenRate')::numeric as burden_rate,
        (payload->>'businessUnitId')::bigint as business_unit_id,
        (payload->>'createdOn')::timestamptz as created_on,
        payload->'customFields' as custom_fields,
        (payload->>'dailyGoal')::numeric as daily_goal,
        payload->>'email' as email,
        payload->'home' as home,
        (payload->>'isManagedTech')::boolean as is_managed_tech,
        payload->>'jobFilter' as job_filter,
        payload->>'loginName' as login_name,
        (payload->>'mainZoneId')::bigint as main_zone_id,
        (payload->>'modifiedOn')::timestamptz as modified_on,
        payload->>'name' as name,
        payload->'permissions' as permissions,
        payload->>'phoneNumber' as phone_number,
        payload->'roleIds' as role_ids,
        payload->>'team' as team,
        (payload->>'userId')::bigint as user_id,
        payload->'zoneIds' as zone_ids,
        NOW() as synced_at,
        $1::uuid as sync_batch_id,
        md5(payload::text) as payload_hash
      FROM ${this.rawTable}
      WHERE sync_batch_id = $1
      ON CONFLICT (st_id) DO UPDATE SET
        aad_user_id = EXCLUDED.aad_user_id,
        account_locked = EXCLUDED.account_locked,
        active = EXCLUDED.active,
        burden_rate = EXCLUDED.burden_rate,
        business_unit_id = EXCLUDED.business_unit_id,
        created_on = EXCLUDED.created_on,
        custom_fields = EXCLUDED.custom_fields,
        daily_goal = EXCLUDED.daily_goal,
        email = EXCLUDED.email,
        home = EXCLUDED.home,
        is_managed_tech = EXCLUDED.is_managed_tech,
        job_filter = EXCLUDED.job_filter,
        login_name = EXCLUDED.login_name,
        main_zone_id = EXCLUDED.main_zone_id,
        modified_on = EXCLUDED.modified_on,
        name = EXCLUDED.name,
        permissions = EXCLUDED.permissions,
        phone_number = EXCLUDED.phone_number,
        role_ids = EXCLUDED.role_ids,
        team = EXCLUDED.team,
        user_id = EXCLUDED.user_id,
        zone_ids = EXCLUDED.zone_ids,
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

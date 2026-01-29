/**
 * Sync worker for Employee records
 * Auto-generated from discovery analysis
 */

import { Pool } from 'pg';
import { BaseSyncWorker } from '../base-sync-worker.js';
import { config } from '../../../config/index.js';

export class EmployeesSyncWorker extends BaseSyncWorker {
  readonly endpointName = 'employees';
  readonly stEndpointPath = 'https://api.servicetitan.io/settings/v2/tenant/3222348440/employees';
  readonly rawTable = 'raw.st_employees';
  readonly masterTable = 'master.employees';
  readonly stIdField = 'id';

  protected async transformToMaster(batchId: string): Promise<{ inserted: number; updated: number }> {
    const result = await this.db.query(`
      INSERT INTO ${this.masterTable} (
        st_id,
        aad_user_id,
        account_locked,
        active,
        business_unit_id,
        created_on,
        custom_fields,
        email,
        login_name,
        modified_on,
        name,
        permissions,
        phone_number,
        role,
        role_ids,
        user_id,
        synced_at,
        sync_batch_id,
        payload_hash
      )
      SELECT 
        (payload->>'id')::bigint as st_id,
        payload->>'aadUserId' as aad_user_id,
        (payload->>'accountLocked')::boolean as account_locked,
        (payload->>'active')::boolean as active,
        payload->>'businessUnitId' as business_unit_id,
        (payload->>'createdOn')::timestamptz as created_on,
        payload->'customFields' as custom_fields,
        payload->>'email' as email,
        payload->>'loginName' as login_name,
        (payload->>'modifiedOn')::timestamptz as modified_on,
        payload->>'name' as name,
        payload->'permissions' as permissions,
        payload->>'phoneNumber' as phone_number,
        payload->>'role' as role,
        payload->'roleIds' as role_ids,
        (payload->>'userId')::bigint as user_id,
        NOW() as synced_at,
        $1::uuid as sync_batch_id,
        md5(payload::text) as payload_hash
      FROM ${this.rawTable}
      WHERE sync_batch_id = $1
      ON CONFLICT (st_id) DO UPDATE SET
        aad_user_id = EXCLUDED.aad_user_id,
        account_locked = EXCLUDED.account_locked,
        active = EXCLUDED.active,
        business_unit_id = EXCLUDED.business_unit_id,
        created_on = EXCLUDED.created_on,
        custom_fields = EXCLUDED.custom_fields,
        email = EXCLUDED.email,
        login_name = EXCLUDED.login_name,
        modified_on = EXCLUDED.modified_on,
        name = EXCLUDED.name,
        permissions = EXCLUDED.permissions,
        phone_number = EXCLUDED.phone_number,
        role = EXCLUDED.role,
        role_ids = EXCLUDED.role_ids,
        user_id = EXCLUDED.user_id,
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

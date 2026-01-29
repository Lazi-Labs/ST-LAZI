/**
 * Sync worker for Activity type definitions
 * Auto-generated from discovery analysis
 */

import { Pool } from 'pg';
import { BaseSyncWorker } from '../base-sync-worker.js';
import { config } from '../../../config/index.js';

export class TimesheetActivityTypesSyncWorker extends BaseSyncWorker {
  readonly endpointName = 'timesheet_activity_types';
  readonly stEndpointPath = 'https://api.servicetitan.io/timesheets/v2/tenant/3222348440/activity-types';
  readonly rawTable = 'raw.st_timesheet_activity_types';
  readonly masterTable = 'master.timesheet_activity_types';
  readonly stIdField = 'id';

  protected async transformToMaster(batchId: string): Promise<{ inserted: number; updated: number }> {
    const result = await this.db.query(`
      INSERT INTO ${this.masterTable} (
        st_id,
        active,
        budget_code_association,
        business_unit_id,
        category_id,
        code,
        created_on,
        default_memo,
        default_tag_type_ids,
        description,
        dont_allow_to_change_memo,
        dont_allow_to_change_tag,
        icon,
        is_archived,
        is_default,
        is_draft,
        is_in_use,
        is_technician_profile_labor_type,
        is_users_home_business_unit,
        job_association,
        labor_type_association,
        labor_type_id,
        memo_association,
        modified_on,
        project_association,
        project_label_association,
        tag_association,
        visible_to_roles,
        synced_at,
        sync_batch_id,
        payload_hash
      )
      SELECT 
        (payload->>'id')::bigint as st_id,
        (payload->>'active')::boolean as active,
        payload->>'budgetCodeAssociation' as budget_code_association,
        payload->>'businessUnitId' as business_unit_id,
        (payload->>'categoryId')::bigint as category_id,
        payload->>'code' as code,
        (payload->>'createdOn')::timestamptz as created_on,
        payload->>'defaultMemo' as default_memo,
        payload->'defaultTagTypeIds' as default_tag_type_ids,
        payload->>'description' as description,
        (payload->>'dontAllowToChangeMemo')::boolean as dont_allow_to_change_memo,
        (payload->>'dontAllowToChangeTag')::boolean as dont_allow_to_change_tag,
        payload->>'icon' as icon,
        (payload->>'isArchived')::boolean as is_archived,
        (payload->>'isDefault')::boolean as is_default,
        (payload->>'isDraft')::boolean as is_draft,
        (payload->>'isInUse')::boolean as is_in_use,
        (payload->>'isTechnicianProfileLaborType')::boolean as is_technician_profile_labor_type,
        (payload->>'isUsersHomeBusinessUnit')::boolean as is_users_home_business_unit,
        payload->>'jobAssociation' as job_association,
        payload->>'laborTypeAssociation' as labor_type_association,
        payload->>'laborTypeId' as labor_type_id,
        payload->>'memoAssociation' as memo_association,
        (payload->>'modifiedOn')::timestamptz as modified_on,
        payload->>'projectAssociation' as project_association,
        payload->>'projectLabelAssociation' as project_label_association,
        payload->>'tagAssociation' as tag_association,
        payload->'visibleToRoles' as visible_to_roles,
        NOW() as synced_at,
        $1::uuid as sync_batch_id,
        md5(payload::text) as payload_hash
      FROM ${this.rawTable}
      WHERE sync_batch_id = $1
      ON CONFLICT (st_id) DO UPDATE SET
        active = EXCLUDED.active,
        budget_code_association = EXCLUDED.budget_code_association,
        business_unit_id = EXCLUDED.business_unit_id,
        category_id = EXCLUDED.category_id,
        code = EXCLUDED.code,
        created_on = EXCLUDED.created_on,
        default_memo = EXCLUDED.default_memo,
        default_tag_type_ids = EXCLUDED.default_tag_type_ids,
        description = EXCLUDED.description,
        dont_allow_to_change_memo = EXCLUDED.dont_allow_to_change_memo,
        dont_allow_to_change_tag = EXCLUDED.dont_allow_to_change_tag,
        icon = EXCLUDED.icon,
        is_archived = EXCLUDED.is_archived,
        is_default = EXCLUDED.is_default,
        is_draft = EXCLUDED.is_draft,
        is_in_use = EXCLUDED.is_in_use,
        is_technician_profile_labor_type = EXCLUDED.is_technician_profile_labor_type,
        is_users_home_business_unit = EXCLUDED.is_users_home_business_unit,
        job_association = EXCLUDED.job_association,
        labor_type_association = EXCLUDED.labor_type_association,
        labor_type_id = EXCLUDED.labor_type_id,
        memo_association = EXCLUDED.memo_association,
        modified_on = EXCLUDED.modified_on,
        project_association = EXCLUDED.project_association,
        project_label_association = EXCLUDED.project_label_association,
        tag_association = EXCLUDED.tag_association,
        visible_to_roles = EXCLUDED.visible_to_roles,
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

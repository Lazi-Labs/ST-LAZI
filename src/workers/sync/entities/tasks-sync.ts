/**
 * Sync worker for Task records
 * Auto-generated from discovery analysis
 */

import { Pool } from 'pg';
import { BaseSyncWorker } from '../base-sync-worker.js';
import { config } from '../../../config/index.js';

export class TasksSyncWorker extends BaseSyncWorker {
  readonly endpointName = 'tasks';
  readonly stEndpointPath = 'https://api.servicetitan.io/taskmanagement/v2/tenant/3222348440/tasks';
  readonly rawTable = 'raw.st_tasks';
  readonly masterTable = 'master.tasks';
  readonly stIdField = 'id';

  protected async transformToMaster(batchId: string): Promise<{ inserted: number; updated: number }> {
    const result = await this.db.query(`
      INSERT INTO ${this.masterTable} (
        st_id,
        active,
        assigned_to_id,
        attachments,
        business_unit_id,
        closed_on,
        comments,
        complete_by,
        created_on,
        customer_id,
        customer_name,
        description,
        description_modified_by_id,
        description_modified_on,
        employee_task_resolution_id,
        employee_task_source_id,
        employee_task_type_id,
        involved_employee_id_list,
        is_closed,
        job_id,
        job_number,
        modified_on,
        name,
        priority,
        project_id,
        refund_issued,
        reported_by_id,
        reported_on,
        status,
        sub_tasks_data,
        task_number,
        synced_at,
        sync_batch_id,
        payload_hash
      )
      SELECT 
        (payload->>'id')::bigint as st_id,
        (payload->>'active')::boolean as active,
        (payload->>'assignedToId')::bigint as assigned_to_id,
        payload->'attachments' as attachments,
        (payload->>'businessUnitId')::bigint as business_unit_id,
        (payload->>'closedOn')::timestamptz as closed_on,
        payload->'comments' as comments,
        payload->>'completeBy' as complete_by,
        (payload->>'createdOn')::timestamptz as created_on,
        (payload->>'customerId')::bigint as customer_id,
        payload->>'customerName' as customer_name,
        payload->>'description' as description,
        (payload->>'descriptionModifiedById')::bigint as description_modified_by_id,
        (payload->>'descriptionModifiedOn')::timestamptz as description_modified_on,
        (payload->>'employeeTaskResolutionId')::bigint as employee_task_resolution_id,
        (payload->>'employeeTaskSourceId')::bigint as employee_task_source_id,
        (payload->>'employeeTaskTypeId')::bigint as employee_task_type_id,
        payload->'involvedEmployeeIdList' as involved_employee_id_list,
        (payload->>'isClosed')::boolean as is_closed,
        (payload->>'jobId')::bigint as job_id,
        payload->>'jobNumber' as job_number,
        (payload->>'modifiedOn')::timestamptz as modified_on,
        payload->>'name' as name,
        payload->>'priority' as priority,
        (payload->>'projectId')::bigint as project_id,
        payload->>'refundIssued' as refund_issued,
        (payload->>'reportedById')::bigint as reported_by_id,
        (payload->>'reportedOn')::timestamptz as reported_on,
        payload->>'status' as status,
        payload->'subTasksData' as sub_tasks_data,
        (payload->>'taskNumber')::numeric as task_number,
        NOW() as synced_at,
        $1::uuid as sync_batch_id,
        md5(payload::text) as payload_hash
      FROM ${this.rawTable}
      WHERE sync_batch_id = $1
      ON CONFLICT (st_id) DO UPDATE SET
        active = EXCLUDED.active,
        assigned_to_id = EXCLUDED.assigned_to_id,
        attachments = EXCLUDED.attachments,
        business_unit_id = EXCLUDED.business_unit_id,
        closed_on = EXCLUDED.closed_on,
        comments = EXCLUDED.comments,
        complete_by = EXCLUDED.complete_by,
        created_on = EXCLUDED.created_on,
        customer_id = EXCLUDED.customer_id,
        customer_name = EXCLUDED.customer_name,
        description = EXCLUDED.description,
        description_modified_by_id = EXCLUDED.description_modified_by_id,
        description_modified_on = EXCLUDED.description_modified_on,
        employee_task_resolution_id = EXCLUDED.employee_task_resolution_id,
        employee_task_source_id = EXCLUDED.employee_task_source_id,
        employee_task_type_id = EXCLUDED.employee_task_type_id,
        involved_employee_id_list = EXCLUDED.involved_employee_id_list,
        is_closed = EXCLUDED.is_closed,
        job_id = EXCLUDED.job_id,
        job_number = EXCLUDED.job_number,
        modified_on = EXCLUDED.modified_on,
        name = EXCLUDED.name,
        priority = EXCLUDED.priority,
        project_id = EXCLUDED.project_id,
        refund_issued = EXCLUDED.refund_issued,
        reported_by_id = EXCLUDED.reported_by_id,
        reported_on = EXCLUDED.reported_on,
        status = EXCLUDED.status,
        sub_tasks_data = EXCLUDED.sub_tasks_data,
        task_number = EXCLUDED.task_number,
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

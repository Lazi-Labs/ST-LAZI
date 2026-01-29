/**
 * Sync worker for Purchase order type definitions
 * Auto-generated from discovery analysis
 */

import { Pool } from 'pg';
import { BaseSyncWorker } from '../base-sync-worker.js';
import { config } from '../../../config/index.js';

export class PurchaseOrderTypesSyncWorker extends BaseSyncWorker {
  readonly endpointName = 'purchase_order_types';
  readonly stEndpointPath = 'https://api.servicetitan.io/inventory/v2/tenant/3222348440/purchase-order-types';
  readonly rawTable = 'raw.st_purchase_order_types';
  readonly masterTable = 'master.purchase_order_types';
  readonly stIdField = 'id';

  protected async transformToMaster(batchId: string): Promise<{ inserted: number; updated: number }> {
    const result = await this.db.query(`
      INSERT INTO ${this.masterTable} (
        st_id,
        active,
        allow_technicians_to_send_po,
        automatically_receive,
        created_on,
        default_required_date_days_offset,
        display_to_technician,
        exclude_tax_from_job_costing,
        impact_to_technician_payroll,
        modified_on,
        name,
        skip_weekends,
        synced_at,
        sync_batch_id,
        payload_hash
      )
      SELECT 
        (payload->>'id')::bigint as st_id,
        (payload->>'active')::boolean as active,
        (payload->>'allowTechniciansToSendPo')::boolean as allow_technicians_to_send_po,
        (payload->>'automaticallyReceive')::boolean as automatically_receive,
        (payload->>'createdOn')::timestamptz as created_on,
        (payload->>'defaultRequiredDateDaysOffset')::numeric as default_required_date_days_offset,
        (payload->>'displayToTechnician')::boolean as display_to_technician,
        (payload->>'excludeTaxFromJobCosting')::boolean as exclude_tax_from_job_costing,
        (payload->>'impactToTechnicianPayroll')::boolean as impact_to_technician_payroll,
        (payload->>'modifiedOn')::timestamptz as modified_on,
        payload->>'name' as name,
        (payload->>'skipWeekends')::boolean as skip_weekends,
        NOW() as synced_at,
        $1::uuid as sync_batch_id,
        md5(payload::text) as payload_hash
      FROM ${this.rawTable}
      WHERE sync_batch_id = $1
      ON CONFLICT (st_id) DO UPDATE SET
        active = EXCLUDED.active,
        allow_technicians_to_send_po = EXCLUDED.allow_technicians_to_send_po,
        automatically_receive = EXCLUDED.automatically_receive,
        created_on = EXCLUDED.created_on,
        default_required_date_days_offset = EXCLUDED.default_required_date_days_offset,
        display_to_technician = EXCLUDED.display_to_technician,
        exclude_tax_from_job_costing = EXCLUDED.exclude_tax_from_job_costing,
        impact_to_technician_payroll = EXCLUDED.impact_to_technician_payroll,
        modified_on = EXCLUDED.modified_on,
        name = EXCLUDED.name,
        skip_weekends = EXCLUDED.skip_weekends,
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

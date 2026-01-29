/**
 * Sync Worker Registry
 * Auto-generated - maps endpoint names to worker classes
 */

import { Pool } from 'pg';
import { BaseSyncWorker } from './base-sync-worker.js';

import { PricebookServicesSyncWorker } from './entities/pricebook_services-sync.js';
import { PricebookMaterialsSyncWorker } from './entities/pricebook_materials-sync.js';
import { PricebookEquipmentSyncWorker } from './entities/pricebook_equipment-sync.js';
import { PricebookCategoriesSyncWorker } from './entities/pricebook_categories-sync.js';
import { PricebookDiscountsAndFeesSyncWorker } from './entities/pricebook_discounts_and_fees-sync.js';
import { PricebookClientSpecificPricingSyncWorker } from './entities/pricebook_client_specific_pricing-sync.js';
import { CustomersSyncWorker } from './entities/customers-sync.js';
import { JobsSyncWorker } from './entities/jobs-sync.js';
import { AppointmentsSyncWorker } from './entities/appointments-sync.js';
import { ProjectsSyncWorker } from './entities/projects-sync.js';
import { JobTypesSyncWorker } from './entities/job_types-sync.js';
import { JobCancelReasonsSyncWorker } from './entities/job_cancel_reasons-sync.js';
import { JobHoldReasonsSyncWorker } from './entities/job_hold_reasons-sync.js';
import { ProjectStatusesSyncWorker } from './entities/project_statuses-sync.js';
import { ProjectTypesSyncWorker } from './entities/project_types-sync.js';
import { EstimatesSyncWorker } from './entities/estimates-sync.js';
import { EstimateItemsSyncWorker } from './entities/estimate_items-sync.js';
import { InvoicesSyncWorker } from './entities/invoices-sync.js';
import { PaymentsSyncWorker } from './entities/payments-sync.js';
import { ApBillsSyncWorker } from './entities/ap_bills-sync.js';
import { GlAccountsSyncWorker } from './entities/gl_accounts-sync.js';
import { InventoryBillsSyncWorker } from './entities/inventory_bills-sync.js';
import { JournalEntriesSyncWorker } from './entities/journal_entries-sync.js';
import { PaymentTermsSyncWorker } from './entities/payment_terms-sync.js';
import { PaymentTypesSyncWorker } from './entities/payment_types-sync.js';
import { RemittanceVendorsSyncWorker } from './entities/remittance_vendors-sync.js';
import { EmployeesSyncWorker } from './entities/employees-sync.js';
import { TechniciansSyncWorker } from './entities/technicians-sync.js';
import { BusinessUnitsSyncWorker } from './entities/business_units-sync.js';
import { TagTypesSyncWorker } from './entities/tag_types-sync.js';
import { UserRolesSyncWorker } from './entities/user_roles-sync.js';
import { TeamsSyncWorker } from './entities/teams-sync.js';
import { AppointmentAssignmentsSyncWorker } from './entities/appointment_assignments-sync.js';
import { ZonesSyncWorker } from './entities/zones-sync.js';
import { TechnicianShiftsSyncWorker } from './entities/technician_shifts-sync.js';
import { NonJobAppointmentsSyncWorker } from './entities/non_job_appointments-sync.js';
import { ArrivalWindowsSyncWorker } from './entities/arrival_windows-sync.js';
import { BusinessHoursSyncWorker } from './entities/business_hours-sync.js';
import { WarehousesSyncWorker } from './entities/warehouses-sync.js';
import { VendorsSyncWorker } from './entities/vendors-sync.js';
import { TrucksSyncWorker } from './entities/trucks-sync.js';
import { PurchaseOrdersSyncWorker } from './entities/purchase_orders-sync.js';
import { ReceiptsSyncWorker } from './entities/receipts-sync.js';
import { ReturnsSyncWorker } from './entities/returns-sync.js';
import { PurchaseOrderTypesSyncWorker } from './entities/purchase_order_types-sync.js';
import { CampaignsSyncWorker } from './entities/campaigns-sync.js';
import { CampaignCategoriesSyncWorker } from './entities/campaign_categories-sync.js';
import { PayrollsSyncWorker } from './entities/payrolls-sync.js';
import { GrossPayItemsSyncWorker } from './entities/gross_pay_items-sync.js';
import { JobSplitsSyncWorker } from './entities/job_splits-sync.js';
import { PayrollTimesheetsSyncWorker } from './entities/payroll_timesheets-sync.js';
import { TimesheetCodesSyncWorker } from './entities/timesheet_codes-sync.js';
import { ActivityCodesSyncWorker } from './entities/activity_codes-sync.js';
import { InstalledEquipmentSyncWorker } from './entities/installed_equipment-sync.js';
import { FormsSyncWorker } from './entities/forms-sync.js';
import { CallsSyncWorker } from './entities/calls-sync.js';
import { TimesheetActivitiesSyncWorker } from './entities/timesheet_activities-sync.js';
import { TimesheetActivityCategoriesSyncWorker } from './entities/timesheet_activity_categories-sync.js';
import { TimesheetActivityTypesSyncWorker } from './entities/timesheet_activity_types-sync.js';
import { TasksSyncWorker } from './entities/tasks-sync.js';
import { ReportCategoriesSyncWorker } from './entities/report_categories-sync.js';
import { CallReasonsSyncWorker } from './entities/call_reasons-sync.js';

export const SYNC_WORKERS: Record<string, new (db: Pool) => BaseSyncWorker> = {
  'pricebook_services': PricebookServicesSyncWorker,
  'pricebook_materials': PricebookMaterialsSyncWorker,
  'pricebook_equipment': PricebookEquipmentSyncWorker,
  'pricebook_categories': PricebookCategoriesSyncWorker,
  'pricebook_discounts_and_fees': PricebookDiscountsAndFeesSyncWorker,
  'pricebook_client_specific_pricing': PricebookClientSpecificPricingSyncWorker,
  'customers': CustomersSyncWorker,
  'jobs': JobsSyncWorker,
  'appointments': AppointmentsSyncWorker,
  'projects': ProjectsSyncWorker,
  'job_types': JobTypesSyncWorker,
  'job_cancel_reasons': JobCancelReasonsSyncWorker,
  'job_hold_reasons': JobHoldReasonsSyncWorker,
  'project_statuses': ProjectStatusesSyncWorker,
  'project_types': ProjectTypesSyncWorker,
  'estimates': EstimatesSyncWorker,
  'estimate_items': EstimateItemsSyncWorker,
  'invoices': InvoicesSyncWorker,
  'payments': PaymentsSyncWorker,
  'ap_bills': ApBillsSyncWorker,
  'gl_accounts': GlAccountsSyncWorker,
  'inventory_bills': InventoryBillsSyncWorker,
  'journal_entries': JournalEntriesSyncWorker,
  'payment_terms': PaymentTermsSyncWorker,
  'payment_types': PaymentTypesSyncWorker,
  'remittance_vendors': RemittanceVendorsSyncWorker,
  'employees': EmployeesSyncWorker,
  'technicians': TechniciansSyncWorker,
  'business_units': BusinessUnitsSyncWorker,
  'tag_types': TagTypesSyncWorker,
  'user_roles': UserRolesSyncWorker,
  'teams': TeamsSyncWorker,
  'appointment_assignments': AppointmentAssignmentsSyncWorker,
  'zones': ZonesSyncWorker,
  'technician_shifts': TechnicianShiftsSyncWorker,
  'non_job_appointments': NonJobAppointmentsSyncWorker,
  'arrival_windows': ArrivalWindowsSyncWorker,
  'business_hours': BusinessHoursSyncWorker,
  'warehouses': WarehousesSyncWorker,
  'vendors': VendorsSyncWorker,
  'trucks': TrucksSyncWorker,
  'purchase_orders': PurchaseOrdersSyncWorker,
  'receipts': ReceiptsSyncWorker,
  'returns': ReturnsSyncWorker,
  'purchase_order_types': PurchaseOrderTypesSyncWorker,
  'campaigns': CampaignsSyncWorker,
  'campaign_categories': CampaignCategoriesSyncWorker,
  'payrolls': PayrollsSyncWorker,
  'gross_pay_items': GrossPayItemsSyncWorker,
  'job_splits': JobSplitsSyncWorker,
  'payroll_timesheets': PayrollTimesheetsSyncWorker,
  'timesheet_codes': TimesheetCodesSyncWorker,
  'activity_codes': ActivityCodesSyncWorker,
  'installed_equipment': InstalledEquipmentSyncWorker,
  'forms': FormsSyncWorker,
  'calls': CallsSyncWorker,
  'timesheet_activities': TimesheetActivitiesSyncWorker,
  'timesheet_activity_categories': TimesheetActivityCategoriesSyncWorker,
  'timesheet_activity_types': TimesheetActivityTypesSyncWorker,
  'tasks': TasksSyncWorker,
  'report_categories': ReportCategoriesSyncWorker,
  'call_reasons': CallReasonsSyncWorker,
};

export const AVAILABLE_ENDPOINTS = Object.keys(SYNC_WORKERS);

export function getWorker(endpoint: string, db: Pool): BaseSyncWorker {
  const WorkerClass = SYNC_WORKERS[endpoint];
  if (!WorkerClass) {
    throw new Error(`Unknown endpoint: ${endpoint}. Available: ${AVAILABLE_ENDPOINTS.join(', ')}`);
  }
  return new WorkerClass(db);
}

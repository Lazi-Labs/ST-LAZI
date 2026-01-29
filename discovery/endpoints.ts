/**
 * ServiceTitan API Endpoints for Schema Discovery
 * 
 * COMPREHENSIVE list based on existing stEndpoints.js from LAZI platform
 * Total: 90+ list endpoints across 18 modules
 * 
 * Priority Levels:
 *   1 = Critical (sync first - pricebook, customers, jobs)
 *   2 = Important (invoices, appointments, employees, estimates)
 *   3 = Secondary (marketing, inventory, forms, payroll)
 *   4 = Reference (lookup tables, settings, rare use)
 */

import { config } from '../src/config/index.js';

const { apiBaseUrl, tenantId } = config.serviceTitan;

/**
 * Base URL builders for each ST API module
 * Matches the structure from existing stEndpoints.js
 */
export const baseUrls = {
  // Core modules
  accounting: `${apiBaseUrl}/accounting/v2/tenant/${tenantId}`,
  crm: `${apiBaseUrl}/crm/v2/tenant/${tenantId}`,
  dispatch: `${apiBaseUrl}/dispatch/v2/tenant/${tenantId}`,
  equipmentsystems: `${apiBaseUrl}/equipmentsystems/v2/tenant/${tenantId}`,
  forms: `${apiBaseUrl}/forms/v2/tenant/${tenantId}`,
  inventory: `${apiBaseUrl}/inventory/v2/tenant/${tenantId}`,
  jbce: `${apiBaseUrl}/jbce/v2/tenant/${tenantId}`,
  jpm: `${apiBaseUrl}/jpm/v2/tenant/${tenantId}`,
  marketing: `${apiBaseUrl}/marketing/v2/tenant/${tenantId}`,
  marketingads: `${apiBaseUrl}/marketingads/v2/tenant/${tenantId}`,
  payroll: `${apiBaseUrl}/payroll/v2/tenant/${tenantId}`,
  pricebook: `${apiBaseUrl}/pricebook/v2/tenant/${tenantId}`,
  reporting: `${apiBaseUrl}/reporting/v2/tenant/${tenantId}`,
  sales: `${apiBaseUrl}/sales/v2/tenant/${tenantId}`,
  salestech: `${apiBaseUrl}/salestech/v2/tenant/${tenantId}`,
  settings: `${apiBaseUrl}/settings/v2/tenant/${tenantId}`,
  taskmanagement: `${apiBaseUrl}/taskmanagement/v2/tenant/${tenantId}`,
  telecom: `${apiBaseUrl}/telecom/v3/tenant/${tenantId}`,
  timesheets: `${apiBaseUrl}/timesheets/v2/tenant/${tenantId}`,
} as const;

export type ModuleName = keyof typeof baseUrls;

/**
 * Endpoint definition for discovery
 */
export interface EndpointDefinition {
  name: string;                    // Unique identifier (becomes table name)
  module: ModuleName;              // ST API module
  path: string;                    // Full URL path
  description: string;             // Human-readable description
  priority: 1 | 2 | 3 | 4;        // Discovery priority
  supportsExport?: boolean;        // Has bulk export endpoint
  hasCRUD?: boolean;               // Supports create/update/delete
}

/**
 * ALL ServiceTitan endpoints for discovery
 * Organized by module, comprehensive list matching stEndpoints.js
 */
export const ST_ENDPOINTS: EndpointDefinition[] = [
  // ═══════════════════════════════════════════════════════════════
  // PRICEBOOK MODULE (8 entities) - Priority 1
  // Your core use case
  // ═══════════════════════════════════════════════════════════════
  {
    name: 'pricebook_services',
    module: 'pricebook',
    path: `${baseUrls.pricebook}/services`,
    description: 'Pricebook service items',
    priority: 1,
    supportsExport: true,
    hasCRUD: true,
  },
  {
    name: 'pricebook_materials',
    module: 'pricebook',
    path: `${baseUrls.pricebook}/materials`,
    description: 'Pricebook material items',
    priority: 1,
    supportsExport: true,
    hasCRUD: true,
  },
  {
    name: 'pricebook_equipment',
    module: 'pricebook',
    path: `${baseUrls.pricebook}/equipment`,
    description: 'Pricebook equipment items',
    priority: 1,
    hasCRUD: true,
  },
  {
    name: 'pricebook_categories',
    module: 'pricebook',
    path: `${baseUrls.pricebook}/categories`,
    description: 'Pricebook categories',
    priority: 1,
    hasCRUD: true,
  },
  {
    name: 'pricebook_discounts_and_fees',
    module: 'pricebook',
    path: `${baseUrls.pricebook}/discounts-and-fees`,
    description: 'Discounts and fees',
    priority: 2,
    hasCRUD: true,
  },
  {
    name: 'pricebook_materials_markup',
    module: 'pricebook',
    path: `${baseUrls.pricebook}/materials-markup`,
    description: 'Materials markup rules',
    priority: 3,
    hasCRUD: true,
  },
  {
    name: 'pricebook_client_specific_pricing',
    module: 'pricebook',
    path: `${baseUrls.pricebook}/clientspecificpricing`,
    description: 'Client-specific pricing rules',
    priority: 3,
  },

  // ═══════════════════════════════════════════════════════════════
  // CRM MODULE (2 entities) - Priority 1
  // ═══════════════════════════════════════════════════════════════
  {
    name: 'customers',
    module: 'crm',
    path: `${baseUrls.crm}/customers`,
    description: 'Customer records',
    priority: 1,
    hasCRUD: true,
  },
  {
    name: 'contacts',
    module: 'crm',
    path: `${baseUrls.crm}/customers/contacts`,
    description: 'Customer contacts',
    priority: 2,
  },

  // ═══════════════════════════════════════════════════════════════
  // JPM MODULE - Jobs & Projects (10 entities) - Priority 1-4
  // ═══════════════════════════════════════════════════════════════
  {
    name: 'jobs',
    module: 'jpm',
    path: `${baseUrls.jpm}/jobs`,
    description: 'Job records',
    priority: 1,
  },
  {
    name: 'appointments',
    module: 'jpm',
    path: `${baseUrls.jpm}/appointments`,
    description: 'Job appointments',
    priority: 1,
    hasCRUD: true,
  },
  {
    name: 'projects',
    module: 'jpm',
    path: `${baseUrls.jpm}/projects`,
    description: 'Project records',
    priority: 2,
    hasCRUD: true,
  },
  {
    name: 'job_types',
    module: 'jpm',
    path: `${baseUrls.jpm}/job-types`,
    description: 'Job type definitions',
    priority: 3,
  },
  {
    name: 'job_cancel_reasons',
    module: 'jpm',
    path: `${baseUrls.jpm}/job-cancel-reasons`,
    description: 'Job cancellation reasons',
    priority: 4,
  },
  {
    name: 'job_hold_reasons',
    module: 'jpm',
    path: `${baseUrls.jpm}/job-hold-reasons`,
    description: 'Job hold reasons',
    priority: 4,
  },
  {
    name: 'project_statuses',
    module: 'jpm',
    path: `${baseUrls.jpm}/project-statuses`,
    description: 'Project status definitions',
    priority: 4,
  },
  {
    name: 'project_sub_statuses',
    module: 'jpm',
    path: `${baseUrls.jpm}/project-sub-statuses`,
    description: 'Project sub-status definitions',
    priority: 4,
  },
  {
    name: 'project_types',
    module: 'jpm',
    path: `${baseUrls.jpm}/project-types`,
    description: 'Project type definitions',
    priority: 4,
  },
  {
    name: 'budget_codes',
    module: 'jpm',
    path: `${baseUrls.jpm}/budget-codes`,
    description: 'Budget code definitions',
    priority: 4,
  },

  // ═══════════════════════════════════════════════════════════════
  // SALES MODULE (3 entities) - Priority 2
  // ═══════════════════════════════════════════════════════════════
  {
    name: 'estimates',
    module: 'sales',
    path: `${baseUrls.sales}/estimates`,
    description: 'Estimate records',
    priority: 2,
    hasCRUD: true,
  },
  {
    name: 'estimate_items',
    module: 'sales',
    path: `${baseUrls.sales}/estimates/items`,
    description: 'Estimate line items',
    priority: 2,
  },

  // ═══════════════════════════════════════════════════════════════
  // SALESTECH MODULE (1 entity) - Priority 3
  // ═══════════════════════════════════════════════════════════════
  {
    name: 'opportunities',
    module: 'salestech',
    path: `${baseUrls.salestech}/opportunities`,
    description: 'Sales opportunities',
    priority: 3,
  },

  // ═══════════════════════════════════════════════════════════════
  // ACCOUNTING MODULE (14 entities) - Priority 2-4
  // ═══════════════════════════════════════════════════════════════
  {
    name: 'invoices',
    module: 'accounting',
    path: `${baseUrls.accounting}/invoices`,
    description: 'Invoice records',
    priority: 2,
    supportsExport: true,
  },
  {
    name: 'payments',
    module: 'accounting',
    path: `${baseUrls.accounting}/payments`,
    description: 'Payment records',
    priority: 2,
    supportsExport: true,
  },
  {
    name: 'ap_bills',
    module: 'accounting',
    path: `${baseUrls.accounting}/ap-bills`,
    description: 'Accounts payable bills',
    priority: 3,
    supportsExport: true,
    hasCRUD: true,
  },
  {
    name: 'ap_credits',
    module: 'accounting',
    path: `${baseUrls.accounting}/ap-credits`,
    description: 'Accounts payable credits',
    priority: 3,
    supportsExport: true,
  },
  {
    name: 'ap_payments',
    module: 'accounting',
    path: `${baseUrls.accounting}/ap-payments`,
    description: 'Accounts payable payments',
    priority: 3,
    supportsExport: true,
  },
  {
    name: 'credit_memos',
    module: 'accounting',
    path: `${baseUrls.accounting}/credit-memos`,
    description: 'Credit memo records',
    priority: 3,
  },
  {
    name: 'deposits',
    module: 'accounting',
    path: `${baseUrls.accounting}/deposits`,
    description: 'Deposit records',
    priority: 3,
  },
  {
    name: 'gl_accounts',
    module: 'accounting',
    path: `${baseUrls.accounting}/gl-accounts`,
    description: 'General ledger accounts',
    priority: 3,
  },
  {
    name: 'inventory_bills',
    module: 'accounting',
    path: `${baseUrls.accounting}/inventory-bills`,
    description: 'Inventory bills',
    priority: 3,
    supportsExport: true,
  },
  {
    name: 'journal_entries',
    module: 'accounting',
    path: `${baseUrls.accounting}/journal-entries`,
    description: 'Journal entries',
    priority: 3,
    supportsExport: true,
    hasCRUD: true,
  },
  {
    name: 'payment_terms',
    module: 'accounting',
    path: `${baseUrls.accounting}/payment-terms`,
    description: 'Payment term definitions',
    priority: 4,
  },
  {
    name: 'payment_types',
    module: 'accounting',
    path: `${baseUrls.accounting}/payment-types`,
    description: 'Payment type definitions',
    priority: 4,
  },
  {
    name: 'remittance_vendors',
    module: 'accounting',
    path: `${baseUrls.accounting}/remittance-vendors`,
    description: 'Remittance vendor definitions',
    priority: 4,
  },
  {
    name: 'tax_zones',
    module: 'accounting',
    path: `${baseUrls.accounting}/tax-zones`,
    description: 'Tax zone definitions',
    priority: 4,
  },

  // ═══════════════════════════════════════════════════════════════
  // SETTINGS MODULE (5 entities) - Priority 2-4
  // ═══════════════════════════════════════════════════════════════
  {
    name: 'employees',
    module: 'settings',
    path: `${baseUrls.settings}/employees`,
    description: 'Employee records',
    priority: 2,
    supportsExport: true,
    hasCRUD: true,
  },
  {
    name: 'technicians',
    module: 'settings',
    path: `${baseUrls.settings}/technicians`,
    description: 'Technician records',
    priority: 2,
    supportsExport: true,
    hasCRUD: true,
  },
  {
    name: 'business_units',
    module: 'settings',
    path: `${baseUrls.settings}/business-units`,
    description: 'Business unit definitions',
    priority: 2,
    hasCRUD: true,
  },
  {
    name: 'tag_types',
    module: 'settings',
    path: `${baseUrls.settings}/tag-types`,
    description: 'Tag type definitions',
    priority: 3,
    hasCRUD: true,
  },
  {
    name: 'user_roles',
    module: 'settings',
    path: `${baseUrls.settings}/user-roles`,
    description: 'User role definitions',
    priority: 4,
  },

  // ═══════════════════════════════════════════════════════════════
  // DISPATCH MODULE (9 entities) - Priority 2-4
  // ═══════════════════════════════════════════════════════════════
  {
    name: 'teams',
    module: 'dispatch',
    path: `${baseUrls.dispatch}/teams`,
    description: 'Dispatch teams',
    priority: 2,
  },
  {
    name: 'appointment_assignments',
    module: 'dispatch',
    path: `${baseUrls.dispatch}/appointment-assignments`,
    description: 'Appointment-technician assignments',
    priority: 3,
  },
  {
    name: 'zones',
    module: 'dispatch',
    path: `${baseUrls.dispatch}/zones`,
    description: 'Dispatch zones',
    priority: 3,
  },
  {
    name: 'technician_shifts',
    module: 'dispatch',
    path: `${baseUrls.dispatch}/technician-shifts`,
    description: 'Technician shift schedules',
    priority: 3,
    supportsExport: true,
    hasCRUD: true,
  },
  {
    name: 'technician_tracking',
    module: 'dispatch',
    path: `${baseUrls.dispatch}/technician-tracking`,
    description: 'Technician GPS tracking',
    priority: 3,
  },
  {
    name: 'non_job_appointments',
    module: 'dispatch',
    path: `${baseUrls.dispatch}/non-job-appointments`,
    description: 'Non-job appointments (meetings, etc)',
    priority: 3,
    hasCRUD: true,
  },
  {
    name: 'capacity',
    module: 'dispatch',
    path: `${baseUrls.dispatch}/capacity`,
    description: 'Dispatch capacity',
    priority: 4,
  },
  {
    name: 'arrival_windows',
    module: 'dispatch',
    path: `${baseUrls.dispatch}/arrival-windows`,
    description: 'Arrival window definitions',
    priority: 4,
  },
  {
    name: 'business_hours',
    module: 'dispatch',
    path: `${baseUrls.dispatch}/business-hours`,
    description: 'Business hours settings',
    priority: 4,
  },

  // ═══════════════════════════════════════════════════════════════
  // INVENTORY MODULE (11 entities) - Priority 3-4
  // ═══════════════════════════════════════════════════════════════
  {
    name: 'warehouses',
    module: 'inventory',
    path: `${baseUrls.inventory}/warehouses`,
    description: 'Warehouse locations',
    priority: 3,
  },
  {
    name: 'vendors',
    module: 'inventory',
    path: `${baseUrls.inventory}/vendors`,
    description: 'Vendor records',
    priority: 3,
    supportsExport: true,
    hasCRUD: true,
  },
  {
    name: 'trucks',
    module: 'inventory',
    path: `${baseUrls.inventory}/trucks`,
    description: 'Truck inventory locations',
    priority: 3,
  },
  {
    name: 'purchase_orders',
    module: 'inventory',
    path: `${baseUrls.inventory}/purchase-orders`,
    description: 'Purchase orders',
    priority: 3,
    supportsExport: true,
    hasCRUD: true,
  },
  {
    name: 'adjustments',
    module: 'inventory',
    path: `${baseUrls.inventory}/adjustments`,
    description: 'Inventory adjustments',
    priority: 3,
    supportsExport: true,
    hasCRUD: true,
  },
  {
    name: 'receipts',
    module: 'inventory',
    path: `${baseUrls.inventory}/receipts`,
    description: 'Inventory receipts',
    priority: 3,
    supportsExport: true,
    hasCRUD: true,
  },
  {
    name: 'returns',
    module: 'inventory',
    path: `${baseUrls.inventory}/returns`,
    description: 'Inventory returns',
    priority: 3,
    supportsExport: true,
    hasCRUD: true,
  },
  {
    name: 'transfers',
    module: 'inventory',
    path: `${baseUrls.inventory}/transfers`,
    description: 'Inventory transfers',
    priority: 3,
    supportsExport: true,
    hasCRUD: true,
  },
  {
    name: 'purchase_orders_markup',
    module: 'inventory',
    path: `${baseUrls.inventory}/purchase-orders-markup`,
    description: 'Purchase order markup rules',
    priority: 4,
  },
  {
    name: 'purchase_order_types',
    module: 'inventory',
    path: `${baseUrls.inventory}/purchase-order-types`,
    description: 'Purchase order type definitions',
    priority: 4,
  },
  {
    name: 'return_types',
    module: 'inventory',
    path: `${baseUrls.inventory}/return-types`,
    description: 'Return type definitions',
    priority: 4,
  },

  // ═══════════════════════════════════════════════════════════════
  // MARKETING MODULE (6 entities) - Priority 3-4
  // ═══════════════════════════════════════════════════════════════
  {
    name: 'campaigns',
    module: 'marketing',
    path: `${baseUrls.marketing}/campaigns`,
    description: 'Marketing campaigns',
    priority: 3,
    hasCRUD: true,
  },
  {
    name: 'campaign_costs',
    module: 'marketing',
    path: `${baseUrls.marketing}/campaign-costs`,
    description: 'Campaign cost records',
    priority: 3,
    hasCRUD: true,
  },
  {
    name: 'campaign_categories',
    module: 'marketing',
    path: `${baseUrls.marketing}/categories`,
    description: 'Campaign categories',
    priority: 4,
  },
  {
    name: 'campaign_cost_summary',
    module: 'marketing',
    path: `${baseUrls.marketing}/campaign-cost-summary`,
    description: 'Campaign cost summaries',
    priority: 4,
  },
  {
    name: 'email_channel_cost',
    module: 'marketing',
    path: `${baseUrls.marketing}/email-channel-cost`,
    description: 'Email channel costs',
    priority: 4,
  },
  {
    name: 'suppressions',
    module: 'marketing',
    path: `${baseUrls.marketing}/suppressions`,
    description: 'Marketing suppressions',
    priority: 4,
    hasCRUD: true,
  },

  // ═══════════════════════════════════════════════════════════════
  // MARKETING ADS MODULE (6 entities) - Priority 4
  // ═══════════════════════════════════════════════════════════════
  {
    name: 'attributed_leads',
    module: 'marketingads',
    path: `${baseUrls.marketingads}/attributed-leads`,
    description: 'Attributed leads',
    priority: 4,
  },
  {
    name: 'capacity_awareness_warning',
    module: 'marketingads',
    path: `${baseUrls.marketingads}/capacity-awareness-warning`,
    description: 'Capacity awareness warnings',
    priority: 4,
  },
  {
    name: 'marketing_performance',
    module: 'marketingads',
    path: `${baseUrls.marketingads}/performance`,
    description: 'Marketing performance metrics',
    priority: 4,
  },
  {
    name: 'scheduled_job_attributions',
    module: 'marketingads',
    path: `${baseUrls.marketingads}/scheduled-job-attributions`,
    description: 'Scheduled job attributions',
    priority: 4,
  },
  {
    name: 'web_booking_attributions',
    module: 'marketingads',
    path: `${baseUrls.marketingads}/web-booking-attributions`,
    description: 'Web booking attributions',
    priority: 4,
  },
  {
    name: 'web_lead_form_attributions',
    module: 'marketingads',
    path: `${baseUrls.marketingads}/web-lead-form-attributions`,
    description: 'Web lead form attributions',
    priority: 4,
  },

  // ═══════════════════════════════════════════════════════════════
  // PAYROLL MODULE (9 entities) - Priority 4
  // ═══════════════════════════════════════════════════════════════
  {
    name: 'payrolls',
    module: 'payroll',
    path: `${baseUrls.payroll}/payrolls`,
    description: 'Payroll records',
    priority: 4,
    supportsExport: true,
  },
  {
    name: 'gross_pay_items',
    module: 'payroll',
    path: `${baseUrls.payroll}/gross-pay-items`,
    description: 'Gross pay items',
    priority: 4,
    supportsExport: true,
    hasCRUD: true,
  },
  {
    name: 'job_splits',
    module: 'payroll',
    path: `${baseUrls.payroll}/jobs/splits`,
    description: 'Job payment splits',
    priority: 4,
    supportsExport: true,
  },
  {
    name: 'payroll_adjustments',
    module: 'payroll',
    path: `${baseUrls.payroll}/payroll-adjustments`,
    description: 'Payroll adjustments',
    priority: 4,
    supportsExport: true,
    hasCRUD: true,
  },
  {
    name: 'payroll_timesheets',
    module: 'payroll',
    path: `${baseUrls.payroll}/jobs/timesheets`,
    description: 'Payroll timesheets',
    priority: 4,
    supportsExport: true,
  },
  {
    name: 'timesheet_codes',
    module: 'payroll',
    path: `${baseUrls.payroll}/timesheet-codes`,
    description: 'Timesheet code definitions',
    priority: 4,
    supportsExport: true,
  },
  {
    name: 'activity_codes',
    module: 'payroll',
    path: `${baseUrls.payroll}/activity-codes`,
    description: 'Activity code definitions',
    priority: 4,
    supportsExport: true,
  },
  {
    name: 'location_labor_types',
    module: 'payroll',
    path: `${baseUrls.payroll}/location-labor-types`,
    description: 'Location labor type definitions',
    priority: 4,
  },

  // ═══════════════════════════════════════════════════════════════
  // EQUIPMENT SYSTEMS MODULE (1 entity) - Priority 3
  // ═══════════════════════════════════════════════════════════════
  {
    name: 'installed_equipment',
    module: 'equipmentsystems',
    path: `${baseUrls.equipmentsystems}/installed-equipment`,
    description: 'Installed equipment at locations',
    priority: 3,
    supportsExport: true,
    hasCRUD: true,
  },

  // ═══════════════════════════════════════════════════════════════
  // FORMS MODULE (2 entities) - Priority 3
  // ═══════════════════════════════════════════════════════════════
  {
    name: 'forms',
    module: 'forms',
    path: `${baseUrls.forms}/forms`,
    description: 'Form definitions',
    priority: 3,
  },
  {
    name: 'form_submissions',
    module: 'forms',
    path: `${baseUrls.forms}/form-submissions`,
    description: 'Form submission records',
    priority: 3,
  },

  // ═══════════════════════════════════════════════════════════════
  // TELECOM MODULE (2 entities) - Priority 3-4
  // ═══════════════════════════════════════════════════════════════
  {
    name: 'calls',
    module: 'telecom',
    path: `${baseUrls.telecom}/calls`,
    description: 'Phone call records',
    priority: 3,
    supportsExport: true,
  },
  {
    name: 'opt_in_out',
    module: 'telecom',
    path: `${baseUrls.telecom}/opt-in-out`,
    description: 'Opt-in/opt-out records',
    priority: 4,
    hasCRUD: true,
  },

  // ═══════════════════════════════════════════════════════════════
  // TIMESHEETS MODULE (3 entities) - Priority 4
  // ═══════════════════════════════════════════════════════════════
  {
    name: 'timesheet_activities',
    module: 'timesheets',
    path: `${baseUrls.timesheets}/activities`,
    description: 'Timesheet activities',
    priority: 4,
    supportsExport: true,
    hasCRUD: true,
  },
  {
    name: 'timesheet_activity_categories',
    module: 'timesheets',
    path: `${baseUrls.timesheets}/activity-categories`,
    description: 'Activity category definitions',
    priority: 4,
  },
  {
    name: 'timesheet_activity_types',
    module: 'timesheets',
    path: `${baseUrls.timesheets}/activity-types`,
    description: 'Activity type definitions',
    priority: 4,
  },

  // ═══════════════════════════════════════════════════════════════
  // TASK MANAGEMENT MODULE (1 entity) - Priority 4
  // ═══════════════════════════════════════════════════════════════
  {
    name: 'tasks',
    module: 'taskmanagement',
    path: `${baseUrls.taskmanagement}/tasks`,
    description: 'Task records',
    priority: 4,
    hasCRUD: true,
  },

  // ═══════════════════════════════════════════════════════════════
  // REPORTING MODULE (1 entity) - Priority 4
  // ═══════════════════════════════════════════════════════════════
  {
    name: 'report_categories',
    module: 'reporting',
    path: `${baseUrls.reporting}/report-categories`,
    description: 'Report category definitions',
    priority: 4,
  },

  // ═══════════════════════════════════════════════════════════════
  // JBCE MODULE (1 entity) - Priority 4
  // ═══════════════════════════════════════════════════════════════
  {
    name: 'call_reasons',
    module: 'jbce',
    path: `${baseUrls.jbce}/call-reasons`,
    description: 'Call reason definitions',
    priority: 4,
  },
];

/**
 * Get endpoints by priority
 */
export function getEndpointsByPriority(maxPriority: number): EndpointDefinition[] {
  return ST_ENDPOINTS.filter(e => e.priority <= maxPriority);
}

/**
 * Get endpoints by module
 */
export function getEndpointsByModule(module: ModuleName): EndpointDefinition[] {
  return ST_ENDPOINTS.filter(e => e.module === module);
}

/**
 * Get priority 1 endpoints only (critical)
 */
export function getCriticalEndpoints(): EndpointDefinition[] {
  return ST_ENDPOINTS.filter(e => e.priority === 1);
}

/**
 * Get endpoints that support export
 */
export function getExportableEndpoints(): EndpointDefinition[] {
  return ST_ENDPOINTS.filter(e => e.supportsExport);
}

/**
 * Get endpoints that have CRUD operations
 */
export function getCRUDEndpoints(): EndpointDefinition[] {
  return ST_ENDPOINTS.filter(e => e.hasCRUD);
}

/**
 * Total endpoint count
 */
export const TOTAL_ENDPOINTS = ST_ENDPOINTS.length;

/**
 * Endpoints by priority count
 */
export const ENDPOINTS_BY_PRIORITY = {
  priority1: ST_ENDPOINTS.filter(e => e.priority === 1).length,
  priority2: ST_ENDPOINTS.filter(e => e.priority === 2).length,
  priority3: ST_ENDPOINTS.filter(e => e.priority === 3).length,
  priority4: ST_ENDPOINTS.filter(e => e.priority === 4).length,
};

/**
 * Endpoints by module count
 */
export const ENDPOINTS_BY_MODULE = Object.keys(baseUrls).reduce((acc, module) => {
  acc[module as ModuleName] = ST_ENDPOINTS.filter(e => e.module === module).length;
  return acc;
}, {} as Record<ModuleName, number>);

// ===========================================
// ServiceTitan API Response Types
// Auto-generated: 2026-01-21T14:16:43.062Z
// ===========================================

// DO NOT EDIT MANUALLY - regenerate from discovery
// These types represent the raw API responses from ServiceTitan

// ===========================================
// RAW RESPONSE TYPES (as returned by ST API)
// ===========================================

/**
 * activity_codes - Raw ServiceTitan response
 * Sample size: 9 records
 */
export interface STActivityCodes {
  active: boolean;
  code: string;
  createdOn: string;
  earningCategory: string;
  id: number;
  modifiedOn: string;
  name: string;
}

/**
 * adjustments - Raw ServiceTitan response
 * Sample size: 0 records
 */
export interface STAdjustments {
}

/**
 * ap_bills - Raw ServiceTitan response
 * Sample size: 100 records
 */
export interface STApBills {
  batch?: Record<string, unknown>;
  billAmount: string;
  billDate: string;
  billType: string;
  budgetCodeId?: unknown;
  businessUnit: Record<string, unknown>;
  canceledBy?: unknown;
  createdBy: string;
  createdOn: string;
  customFields?: unknown;
  dateCanceled?: unknown;
  doNotPay: boolean;
  dueDate: string;
  earlyDiscountDate?: unknown;
  expenseItems: unknown[];
  id: number;
  items: unknown[];
  jobId?: number;
  jobNumber?: string;
  modifiedOn: string;
  postDate: string;
  purchaseOrderId: number;
  referenceNumber?: unknown;
  remittanceVendorInfo: Record<string, unknown>;
  shippingAmount: string;
  shipTo: Record<string, unknown>;
  shipToDescription: string;
  source: string;
  status: string;
  summary?: unknown;
  syncStatus: string;
  taxAmount: string;
  taxZone?: unknown;
  termName: string;
  vendor: Record<string, unknown>;
  vendorInvoiceTotal?: unknown;
  vendorNumber: string;
}

/**
 * ap_credits - Raw ServiceTitan response
 * Sample size: 0 records
 */
export interface STApCredits {
}

/**
 * ap_payments - Raw ServiceTitan response
 * Sample size: 0 records
 */
export interface STApPayments {
}

/**
 * appointment_assignments - Raw ServiceTitan response
 * Sample size: 100 records
 */
export interface STAppointmentAssignments {
  active: boolean;
  appointmentId: number;
  assignedById: number;
  assignedOn: string;
  createdOn: string;
  id: number;
  isPaused: boolean;
  jobId: number;
  modifiedOn: string;
  status: string;
  technicianId: number;
  technicianName: string;
}

/**
 * appointments - Raw ServiceTitan response
 * Sample size: 100 records
 */
export interface STAppointments {
  active: boolean;
  appointmentNumber: string;
  arrivalWindowEnd: string;
  arrivalWindowStart: string;
  createdById: number;
  createdOn: string;
  customerId: number;
  end: string;
  id: number;
  isConfirmed: boolean;
  jobId: number;
  modifiedOn: string;
  specialInstructions: string;
  start: string;
  status: string;
  unused: boolean;
}

/**
 * arrival_windows - Raw ServiceTitan response
 * Sample size: 5 records
 */
export interface STArrivalWindows {
  active: boolean;
  businessUnitIds: unknown[];
  duration: string;
  id: number;
  start: string;
}

/**
 * business_hours - Raw ServiceTitan response
 * Sample size: 1 records
 */
export interface STBusinessHours {
  saturday: unknown[];
  sunday: unknown[];
  weekdays: unknown[];
}

/**
 * business_units - Raw ServiceTitan response
 * Sample size: 4 records
 */
export interface STBusinessUnits {
  accountCode?: unknown;
  acknowledgementParagraph: string;
  active: boolean;
  address: Record<string, unknown>;
  authorizationParagraph: string;
  conceptCode: string;
  corporateContractNumber?: unknown;
  createdOn: string;
  currency: string;
  defaultTaxRate: number;
  division: Record<string, unknown>;
  email: string;
  externalData?: unknown;
  franchiseId?: unknown;
  id: number;
  invoiceHeader: string;
  invoiceMessage: string;
  materialSku?: unknown;
  modifiedOn: string;
  name: string;
  officialName: string;
  phoneNumber: string;
  quickbooksClass: string;
  tagTypeIds: unknown[];
  tenant: Record<string, unknown>;
  trade: Record<string, unknown>;
}

/**
 * call_reasons - Raw ServiceTitan response
 * Sample size: 18 records
 */
export interface STCallReasons {
  active: boolean;
  createdOn: string;
  id: number;
  isLead: boolean;
  modifiedOn: string;
  name: string;
}

/**
 * calls - Raw ServiceTitan response
 * Sample size: 100 records
 */
export interface STCalls {
  businessUnit?: Record<string, unknown>;
  id: number;
  jobNumber?: string;
  leadCall: Record<string, unknown>;
  projectId: number;
  type?: Record<string, unknown>;
}

/**
 * campaign_categories - Raw ServiceTitan response
 * Sample size: 4 records
 */
export interface STCampaignCategories {
  active: boolean;
  createdOn: string;
  id: number;
  modifiedOn: string;
  name: string;
  type: string;
}

/**
 * campaigns - Raw ServiceTitan response
 * Sample size: 12 records
 */
export interface STCampaigns {
  active: boolean;
  businessUnit?: unknown;
  campaignPhoneNumbers: unknown[];
  category: Record<string, unknown>;
  createdOn: string;
  id: number;
  isDefaultCampaign?: boolean;
  medium?: string;
  modifiedOn: string;
  name: string;
  otherMedium?: unknown;
  otherSource?: unknown;
  source?: string;
}

/**
 * customers - Raw ServiceTitan response
 * Sample size: 100 records
 */
export interface STCustomers {
  active: boolean;
  address: Record<string, unknown>;
  balance: number;
  createdById: number;
  createdOn: string;
  creditLimit?: unknown;
  creditLimitBalance?: unknown;
  customFields: unknown[];
  doNotMail: boolean;
  doNotService: boolean;
  externalData?: unknown;
  id: number;
  mergedToId?: unknown;
  modifiedOn: string;
  name: string;
  nationalAccount: boolean;
  paymentTermId: number;
  tagTypeIds: unknown[];
  taxExempt: boolean;
  type: string;
}

/**
 * employees - Raw ServiceTitan response
 * Sample size: 4 records
 */
export interface STEmployees {
  aadUserId?: unknown;
  accountLocked: boolean;
  active: boolean;
  businessUnitId?: unknown;
  createdOn: string;
  customFields: unknown[];
  email?: string;
  id: number;
  loginName: string;
  modifiedOn: string;
  name: string;
  permissions: unknown[];
  phoneNumber?: string;
  role: string;
  roleIds: unknown[];
  userId: number;
}

/**
 * estimate_items - Raw ServiceTitan response
 * Sample size: 100 records
 */
export interface STEstimateItems {
  budgetCodeId?: unknown;
  chargeable?: boolean;
  createdOn: string;
  description: string;
  id: number;
  invoiceItemId?: unknown;
  itemGroupName?: unknown;
  itemGroupRootId?: unknown;
  membershipTypeId?: unknown;
  modifiedOn: string;
  qty: number;
  sku: Record<string, unknown>;
  skuAccount: string;
  total: number;
  totalCost: number;
  unitCost: number;
  unitRate: number;
}

/**
 * estimates - Raw ServiceTitan response
 * Sample size: 100 records
 */
export interface STEstimates {
  active: boolean;
  budgetCodeId?: unknown;
  businessUnitId: number;
  businessUnitName: string;
  createdOn: string;
  customerId: number;
  externalLinks: unknown[];
  id: number;
  isChangeOrder: boolean;
  isRecommended: boolean;
  items: unknown[];
  jobId?: number;
  jobNumber: string;
  locationId: number;
  modifiedOn: string;
  name: string;
  projectId: number;
  proposalTagName?: string;
  reviewStatus: string;
  soldBy?: number;
  soldOn?: string;
  status: Record<string, unknown>;
  subtotal: number;
  summary: string;
  tax: number;
}

/**
 * forms - Raw ServiceTitan response
 * Sample size: 1 records
 */
export interface STForms {
  active: boolean;
  createdById: number;
  createdOn: string;
  hasConditionalLogic: boolean;
  hasTriggers: boolean;
  id: number;
  modifiedOn: string;
  name: string;
  published: boolean;
}

/**
 * gl_accounts - Raw ServiceTitan response
 * Sample size: 38 records
 */
export interface STGlAccounts {
  active: boolean;
  createdOn: string;
  defaultAccountType?: string;
  description?: string;
  id: number;
  isIntacctBankAccount: boolean;
  isIntacctGroup: boolean;
  modifiedOn: string;
  name: string;
  number: string;
  source: string;
  subtype: string;
  type: string;
}

/**
 * gross_pay_items - Raw ServiceTitan response
 * Sample size: 100 records
 */
export interface STGrossPayItems {
  activity: string;
  activityCode?: string;
  activityCodeId?: number;
  amount: number;
  amountAdjustment: number;
  budgetCodeId?: unknown;
  businessUnitName?: string;
  createdOn: string;
  customerId?: number;
  customerName?: string;
  date: string;
  employeeId: number;
  employeePayrollId: string;
  employeeType: string;
  endedOn: string;
  grossPayItemType: string;
  id?: unknown;
  invoiceId?: number;
  invoiceItemId?: unknown;
  invoiceNumber?: string;
  isPrevailingWageJob: boolean;
  jobId: number;
  jobNumber?: string;
  jobTypeName?: string;
  laborTypeCode?: string;
  laborTypeId?: number;
  locationAddress?: string;
  locationId?: number;
  locationName?: string;
  locationZip?: string;
  memo?: string;
  modifiedOn: string;
  paidDurationHours: number;
  paidTimeType: string;
  payoutBusinessUnitName?: string;
  payrollId: number;
  projectId?: number;
  projectNumber?: string;
  sourceEntityId?: number;
  startedOn: string;
  taxZoneName?: unknown;
  zoneName?: string;
}

/**
 * installed_equipment - Raw ServiceTitan response
 * Sample size: 100 records
 */
export interface STInstalledEquipment {
  active: boolean;
  actualReplacementDate?: unknown;
  barcodeId?: unknown;
  cost: number;
  createdOn: string;
  customerId: number;
  equipmentId?: number;
  id: number;
  installedOn?: string;
  invoiceItemId?: number;
  locationId: number;
  manufacturer?: string;
  manufacturerWarrantyEnd?: string;
  manufacturerWarrantyStart?: string;
  memo?: string;
  model?: string;
  modifiedOn: string;
  name?: string;
  predictedReplacementDate?: string;
  predictedReplacementMonths?: number;
  serialNumber?: string;
  serviceProviderWarrantyEnd?: string;
  serviceProviderWarrantyStart?: string;
  status: number;
  tags: unknown[];
  type?: Record<string, unknown>;
}

/**
 * inventory_bills - Raw ServiceTitan response
 * Sample size: 100 records
 */
export interface STInventoryBills {
  batch?: Record<string, unknown>;
  billAmount: string;
  billDate: string;
  budgetCodeId?: unknown;
  businessUnit: Record<string, unknown>;
  createdBy: string;
  createdOn: string;
  customFields?: unknown;
  dueDate: string;
  id: number;
  items: unknown[];
  jobId?: number;
  jobNumber?: string;
  modifiedOn: string;
  postDate: string;
  purchaseOrderId: number;
  referenceNumber: string;
  shippingAmount: string;
  shipTo: Record<string, unknown>;
  shipToDescription: string;
  summary?: unknown;
  syncStatus: string;
  taxAmount: string;
  taxZone?: unknown;
  termName: string;
  vendor: Record<string, unknown>;
  vendorNumber: string;
}

/**
 * invoices - Raw ServiceTitan response
 * Sample size: 100 records
 */
export interface STInvoices {
  active: boolean;
  adjustmentToId?: unknown;
  assignedTo?: Record<string, unknown>;
  balance: string;
  batch?: unknown;
  budgetCodeId?: unknown;
  businessUnit: Record<string, unknown>;
  commissionEligibilityDate?: unknown;
  createdBy?: string;
  createdOn: string;
  customer: Record<string, unknown>;
  customerAddress: Record<string, unknown>;
  customFields?: unknown;
  depositedOn?: unknown;
  discountTotal: string;
  dueDate?: string;
  employeeInfo?: Record<string, unknown>;
  exportId?: unknown;
  id: number;
  importId?: string;
  invoiceConfiguration: string;
  invoiceDate?: string;
  invoiceType?: unknown;
  items?: unknown[];
  job: Record<string, unknown>;
  location: Record<string, unknown>;
  locationAddress: Record<string, unknown>;
  materialSkuId: number;
  membershipId?: unknown;
  modifiedOn: string;
  paidOn?: string;
  projectId?: number;
  referenceNumber: string;
  reviewStatus: string;
  royalty: Record<string, unknown>;
  salesTax: string;
  salesTaxCode?: unknown;
  sentStatus: string;
  subTotal: string;
  summary?: string;
  syncStatus: string;
  taxZoneId?: unknown;
  termName: string;
  total: string;
}

/**
 * job_cancel_reasons - Raw ServiceTitan response
 * Sample size: 24 records
 */
export interface STJobCancelReasons {
  active: boolean;
  createdOn: string;
  id: number;
  modifiedOn: string;
  name: string;
}

/**
 * job_hold_reasons - Raw ServiceTitan response
 * Sample size: 18 records
 */
export interface STJobHoldReasons {
  active: boolean;
  createdOn: string;
  id: number;
  modifiedOn: string;
  name: string;
}

/**
 * job_splits - Raw ServiceTitan response
 * Sample size: 100 records
 */
export interface STJobSplits {
  createdOn: string;
  id: number;
  jobId: number;
  modifiedOn: string;
  split: number;
  technicianId: number;
}

/**
 * job_types - Raw ServiceTitan response
 * Sample size: 38 records
 */
export interface STJobTypes {
  active: boolean;
  businessUnitIds: unknown[];
  class?: string;
  createdOn: string;
  duration: number;
  enforceRecurringServiceEventSelection?: unknown;
  externalData?: unknown;
  id: number;
  invoiceSignaturesRequired: boolean;
  isSmartDispatched: boolean;
  modifiedOn: string;
  name: string;
  noCharge: boolean;
  priority: string;
  skills: unknown[];
  soldThreshold: number;
  summary: string;
  tagTypeIds: unknown[];
}

/**
 * jobs - Raw ServiceTitan response
 * Sample size: 100 records
 */
export interface STJobs {
  appointmentCount: number;
  bookingId?: unknown;
  businessUnitId: number;
  campaignId: number;
  completedOn: string;
  createdById: number;
  createdFromEstimateId?: unknown;
  createdOn: string;
  customerId: number;
  customerPo?: unknown;
  customFields: unknown[];
  estimateIds: unknown[];
  externalData?: unknown;
  firstAppointmentId: number;
  id: number;
  invoiceId: number;
  jobGeneratedLeadSource: Record<string, unknown>;
  jobNumber: string;
  jobStatus: string;
  jobTypeId: number;
  lastAppointmentId: number;
  leadCallId?: unknown;
  locationId: number;
  membershipId?: unknown;
  modifiedOn: string;
  noCharge: boolean;
  notificationsEnabled: boolean;
  partnerLeadCallId?: unknown;
  priority: string;
  projectId?: number;
  recallForId?: unknown;
  soldById?: unknown;
  summary: string;
  tagTypeIds: unknown[];
  total: number;
  warrantyId?: unknown;
}

/**
 * journal_entries - Raw ServiceTitan response
 * Sample size: 100 records
 */
export interface STJournalEntries {
  createdOn: string;
  customFields: unknown[];
  exportedBy?: unknown;
  exportedOn?: string;
  id: string;
  isEmpty: boolean;
  lastSyncVersionId?: number;
  message?: string;
  modifiedOn: string;
  name: string;
  number: number;
  postDate: string;
  status: string;
  syncStatus: string;
  url: string;
  versionId: number;
}

/**
 * non_job_appointments - Raw ServiceTitan response
 * Sample size: 100 records
 */
export interface STNonJobAppointments {
  active: boolean;
  allDay: boolean;
  clearDispatchBoard: boolean;
  clearTechnicianView: boolean;
  createdById: number;
  createdOn: string;
  duration: string;
  id: number;
  modifiedOn: string;
  name: string;
  removeTechnicianFromCapacityPlanning: boolean;
  showOnTechnicianSchedule: boolean;
  start: string;
  summary?: string;
  technicianId: number;
  timesheetCodeId: number;
}

/**
 * payment_terms - Raw ServiceTitan response
 * Sample size: 5 records
 */
export interface STPaymentTerms {
  active: boolean;
  createdOn: string;
  dueDay: number;
  dueDayType: string;
  id: number;
  interestSettings?: unknown;
  inUse: boolean;
  isCustomerDefault: boolean;
  isVendorDefault: boolean;
  modifiedOn: string;
  name: string;
  paymentTermDiscountModel?: unknown;
}

/**
 * payment_types - Raw ServiceTitan response
 * Sample size: 16 records
 */
export interface STPaymentTypes {
  createdOn: string;
  id: number;
  modifiedOn: string;
  name: string;
}

/**
 * payments - Raw ServiceTitan response
 * Sample size: 100 records
 */
export interface STPayments {
  active: boolean;
  appliedTo: unknown[];
  authCode?: string;
  batch?: Record<string, unknown>;
  businessUnit: Record<string, unknown>;
  checkNumber?: unknown;
  createdBy?: string;
  createdOn: string;
  customer: Record<string, unknown>;
  customFields?: unknown;
  date: string;
  deposit?: Record<string, unknown>;
  generalLedgerAccount?: Record<string, unknown>;
  id: number;
  memo: string;
  modifiedOn: string;
  referenceNumber?: unknown;
  refundedPaymentId?: unknown;
  syncStatus: string;
  total: string;
  type: string;
  typeId: string;
  unappliedAmount: string;
}

/**
 * payroll_adjustments - Raw ServiceTitan response
 * Sample size: 0 records
 */
export interface STPayrollAdjustments {
}

/**
 * payroll_timesheets - Raw ServiceTitan response
 * Sample size: 100 records
 */
export interface STPayrollTimesheets {
  active: boolean;
  appointmentId: number;
  arrivedOn: string;
  canceledOn?: string;
  createdOn: string;
  dispatchedOn: string;
  doneOn?: string;
  id: number;
  jobId: number;
  modifiedOn: string;
  technicianId: number;
}

/**
 * payrolls - Raw ServiceTitan response
 * Sample size: 100 records
 */
export interface STPayrolls {
  active: boolean;
  burdenRate: number;
  createdOn: string;
  employeeId: number;
  employeeType: string;
  endedOn: string;
  id: number;
  managerApprovedOn?: string;
  modifiedOn: string;
  startedOn: string;
  status: string;
}

/**
 * pricebook_categories - Raw ServiceTitan response
 * Sample size: 10 records
 */
export interface STPricebookCategories {
  active: boolean;
  businessUnitIds: unknown[];
  categoryType: string;
  description?: string;
  externalId?: unknown;
  hideInMobile: boolean;
  id: number;
  image?: string;
  name: string;
  parentId?: unknown;
  position: number;
  skuImages: unknown[];
  skuVideos: unknown[];
  source?: unknown;
  subcategories: unknown[];
}

/**
 * pricebook_client_specific_pricing - Raw ServiceTitan response
 * Sample size: 7 records
 */
export interface STPricebookClientSpecificPricing {
  exceptions: unknown[];
  id: number;
}

/**
 * pricebook_discounts_and_fees - Raw ServiceTitan response
 * Sample size: 7 records
 */
export interface STPricebookDiscountsAndFees {
  account: string;
  active: boolean;
  amount: number;
  amountType: string;
  assets: unknown[];
  bonus: number;
  budgetCostCode?: unknown;
  budgetCostType?: unknown;
  categories: unknown[];
  code: string;
  commissionBonus: number;
  crossSaleGroup?: unknown;
  description: string;
  displayName: string;
  excludeFromPayroll: boolean;
  externalData: unknown[];
  hours: number;
  id: number;
  limit: number;
  paysCommission: boolean;
  taxable: boolean;
  type: string;
}

/**
 * pricebook_equipment - Raw ServiceTitan response
 * Sample size: 100 records
 */
export interface STPricebookEquipment {
  account: string;
  active: boolean;
  addOnMemberPrice: number;
  addOnPrice: number;
  assetAccount?: unknown;
  assets: unknown[];
  bonus: number;
  budgetCostCode?: unknown;
  budgetCostType?: unknown;
  categories: unknown[];
  code: string;
  commissionBonus: number;
  cost: number;
  costOfSaleAccount: string;
  createdOn: string;
  crossSaleGroup?: unknown;
  defaultAssetUrl?: string;
  description: string;
  dimensions: Record<string, unknown>;
  displayInAmount: boolean;
  displayName: string;
  equipmentMaterials: unknown[];
  externalData: unknown[];
  externalId?: unknown;
  generalLedgerAccountId: number;
  hours: number;
  id: number;
  isConfigurableEquipment: boolean;
  isInventory: boolean;
  manufacturer?: string;
  manufacturerWarranty: Record<string, unknown>;
  memberPrice: number;
  model?: string;
  modifiedOn: string;
  otherVendors: unknown[];
  paysCommission: boolean;
  price: number;
  primaryVendor: Record<string, unknown>;
  recommendations: unknown[];
  serviceProviderWarranty: Record<string, unknown>;
  source?: unknown;
  taxable: boolean;
  typeId?: number;
  unitOfMeasure?: string;
  upgrades: unknown[];
  variationsOrConfigurableEquipment: unknown[];
}

/**
 * pricebook_materials - Raw ServiceTitan response
 * Sample size: 100 records
 */
export interface STPricebookMaterials {
  account: string;
  active: boolean;
  addOnMemberPrice: number;
  addOnPrice: number;
  assetAccount?: unknown;
  assets: unknown[];
  bonus: number;
  budgetCostCode?: unknown;
  budgetCostType?: unknown;
  businessUnitId?: unknown;
  categories: unknown[];
  chargeableByDefault: boolean;
  code: string;
  commissionBonus: number;
  cost: number;
  costOfSaleAccount: string;
  costTypeId?: unknown;
  createdById: number;
  createdOn: string;
  deductAsJobCost: boolean;
  defaultAssetUrl?: string;
  description: string;
  displayInAmount: boolean;
  displayName: string;
  externalData: unknown[];
  externalId?: unknown;
  generalLedgerAccountId: number;
  hours: number;
  id: number;
  isConfigurableMaterial: boolean;
  isInventory: boolean;
  isOtherDirectCost: boolean;
  memberPrice: number;
  modifiedOn: string;
  otherVendors: unknown[];
  paysCommission: boolean;
  price: number;
  primaryVendor: Record<string, unknown>;
  source?: unknown;
  taxable: boolean;
  unitOfMeasure: string;
  variationsOrConfigurableMaterials: unknown[];
}

/**
 * pricebook_services - Raw ServiceTitan response
 * Sample size: 100 records
 */
export interface STPricebookServices {
  account: string;
  active: boolean;
  addOnMemberPrice: number;
  addOnPrice: number;
  assets: unknown[];
  bonus: number;
  budgetCostCode?: unknown;
  budgetCostType?: unknown;
  businessUnitId?: number;
  calculatedPrice?: unknown;
  categories: unknown[];
  code: string;
  commissionBonus: number;
  cost: number;
  createdOn: string;
  crossSaleGroup?: unknown;
  defaultAssetUrl?: string;
  description: string;
  displayName: string;
  externalData: unknown[];
  externalId?: unknown;
  hours: number;
  id: number;
  isLabor: boolean;
  memberPrice: number;
  modifiedOn: string;
  paysCommission: boolean;
  price: number;
  recommendations: unknown[];
  serviceEquipment: unknown[];
  serviceMaterials: unknown[];
  soldByCommission: number;
  source?: unknown;
  taxable: boolean;
  upgrades: unknown[];
  useStaticPrices?: unknown;
  warranty: Record<string, unknown>;
}

/**
 * project_statuses - Raw ServiceTitan response
 * Sample size: 7 records
 */
export interface STProjectStatuses {
  id: number;
  modifiedOn: string;
  name: string;
  order: number;
}

/**
 * project_types - Raw ServiceTitan response
 * Sample size: 6 records
 */
export interface STProjectTypes {
  createdById?: number;
  description: string;
  id: number;
  name: string;
}

/**
 * projects - Raw ServiceTitan response
 * Sample size: 100 records
 */
export interface STProjects {
  actualCompletionDate?: unknown;
  businessUnitIds: unknown[];
  createdOn: string;
  customerId: number;
  customFields: unknown[];
  externalData?: unknown;
  id: number;
  jobIds: unknown[];
  locationId: number;
  modifiedOn: string;
  name?: string;
  number: string;
  projectManagerIds: unknown[];
  projectTypeId?: number;
  startDate?: string;
  status?: string;
  statusId?: number;
  subStatus?: string;
  subStatusId?: number;
  summary?: string;
  targetCompletionDate?: string;
}

/**
 * purchase_order_types - Raw ServiceTitan response
 * Sample size: 10 records
 */
export interface STPurchaseOrderTypes {
  active: boolean;
  allowTechniciansToSendPo: boolean;
  automaticallyReceive: boolean;
  createdOn: string;
  defaultRequiredDateDaysOffset: number;
  displayToTechnician: boolean;
  excludeTaxFromJobCosting: boolean;
  id: number;
  impactToTechnicianPayroll: boolean;
  modifiedOn: string;
  name: string;
  skipWeekends: boolean;
}

/**
 * purchase_orders - Raw ServiceTitan response
 * Sample size: 100 records
 */
export interface STPurchaseOrders {
  batchId?: unknown;
  budgetCodeId?: unknown;
  businessUnitId: number;
  createdOn: string;
  customFields?: unknown;
  date: string;
  id: number;
  inventoryLocationId: number;
  invoiceId?: number;
  items: unknown[];
  jobId?: number;
  modifiedOn: string;
  number: string;
  projectId?: number;
  receivedOn?: string;
  requiredOn: string;
  sentOn?: string;
  shipping: number;
  shipTo: Record<string, unknown>;
  status: string;
  summary?: string;
  tax: number;
  technicianId?: number;
  total: number;
  typeId: number;
  vendorDocumentNumber?: unknown;
  vendorId: number;
}

/**
 * receipts - Raw ServiceTitan response
 * Sample size: 100 records
 */
export interface STReceipts {
  active: boolean;
  batchId?: unknown;
  billId: number;
  budgetCodeId?: unknown;
  businessUnitId: number;
  createdById: number;
  createdOn: string;
  customFields?: unknown;
  id: number;
  inventoryLocationId: number;
  items: unknown[];
  jobId?: number;
  memo?: string;
  modifiedOn: string;
  number: string;
  purchaseOrderId: number;
  receiptAmount: number;
  receivedOn: string;
  shippingAmount: number;
  shipTo: Record<string, unknown>;
  shipToDescription: string;
  syncStatus: string;
  taxAmount: number;
  technicianId?: number;
  vendorId: number;
  vendorInvoiceNumber?: string;
}

/**
 * remittance_vendors - Raw ServiceTitan response
 * Sample size: 40 records
 */
export interface STRemittanceVendors {
  active: boolean;
  address: Record<string, unknown>;
  contactInfo: Record<string, unknown>;
  createdOn: string;
  customerId?: unknown;
  id: number;
  isApproved: boolean;
  isVerified: boolean;
  modifiedOn: string;
  name: string;
}

/**
 * report_categories - Raw ServiceTitan response
 * Sample size: 12 records
 */
export interface STReportCategories {
  id: string;
  name: string;
}

/**
 * returns - Raw ServiceTitan response
 * Sample size: 42 records
 */
export interface STReturns {
  active: boolean;
  batch: Record<string, unknown>;
  batchId: number;
  budgetCodeId?: unknown;
  businessUnitId: number;
  canceledById?: unknown;
  canceledReason?: unknown;
  createdById: number;
  createdOn: string;
  creditReceivedOn: string;
  customFields?: unknown;
  dateCanceled?: unknown;
  externalData?: unknown;
  id: number;
  inventoryLocationId?: number;
  items: unknown[];
  jobId?: number;
  memo?: string;
  modifiedOn: string;
  number: string;
  projectId?: number;
  purchaseOrderId?: number;
  referenceNumber: string;
  returnAmount: number;
  returnDate: string;
  returnedOn: string;
  shippingAmount: number;
  status: string;
  syncStatus: string;
  taxAmount: number;
  vendorId: number;
}

/**
 * tag_types - Raw ServiceTitan response
 * Sample size: 95 records
 */
export interface STTagTypes {
  active: boolean;
  allowToUseOnTimesheetActivity: boolean;
  code?: string;
  color: string;
  createdOn: string;
  id: number;
  importance?: string;
  isConversionOpportunity: boolean;
  isVisibleOnDispatchBoard: boolean;
  modifiedOn: string;
  name: string;
}

/**
 * tasks - Raw ServiceTitan response
 * Sample size: 100 records
 */
export interface STTasks {
  active: boolean;
  assignedToId: number;
  attachments: unknown[];
  businessUnitId: number;
  closedOn: string;
  comments: unknown[];
  completeBy?: string;
  createdOn: string;
  customerId?: number;
  customerName?: string;
  description?: string;
  descriptionModifiedById?: number;
  descriptionModifiedOn?: string;
  employeeTaskResolutionId: number;
  employeeTaskSourceId: number;
  employeeTaskTypeId: number;
  id: number;
  involvedEmployeeIdList: unknown[];
  isClosed: boolean;
  jobId?: number;
  jobNumber?: string;
  modifiedOn: string;
  name: string;
  priority: string;
  projectId?: number;
  refundIssued?: unknown;
  reportedById: number;
  reportedOn: string;
  status: string;
  subTasksData: Record<string, unknown>;
  taskNumber: number;
}

/**
 * tax_zones - Raw ServiceTitan response
 * Sample size: 0 records
 */
export interface STTaxZones {
}

/**
 * teams - Raw ServiceTitan response
 * Sample size: 6 records
 */
export interface STTeams {
  active: boolean;
  createdBy: number;
  createdOn: string;
  id: number;
  modifiedOn: string;
  name: string;
}

/**
 * technician_shifts - Raw ServiceTitan response
 * Sample size: 100 records
 */
export interface STTechnicianShifts {
  active: boolean;
  createdOn: string;
  end: string;
  id: number;
  modifiedOn: string;
  note?: unknown;
  shiftType: string;
  start: string;
  technicianId: number;
  timesheetCodeId?: unknown;
  title: string;
}

/**
 * technicians - Raw ServiceTitan response
 * Sample size: 9 records
 */
export interface STTechnicians {
  aadUserId?: unknown;
  accountLocked: boolean;
  active: boolean;
  burdenRate: number;
  businessUnitId?: number;
  createdOn: string;
  customFields: unknown[];
  dailyGoal: number;
  email?: string;
  home: Record<string, unknown>;
  id: number;
  isManagedTech: boolean;
  jobFilter: string;
  loginName: string;
  mainZoneId?: number;
  modifiedOn: string;
  name: string;
  permissions: unknown[];
  phoneNumber?: string;
  roleIds: unknown[];
  team: string;
  userId: number;
  zoneIds: unknown[];
}

/**
 * timesheet_activities - Raw ServiceTitan response
 * Sample size: 100 records
 */
export interface STTimesheetActivities {
  active: boolean;
  activityTypeId: number;
  appointmentId?: number;
  budgetCodeId?: unknown;
  createdOn: string;
  employeeId: number;
  employeeType: string;
  endCoordinate: Record<string, unknown>;
  endTime: string;
  id: number;
  jobId?: number;
  laborTypeId?: number;
  memo?: string;
  modifiedById?: number;
  modifiedOn: string;
  projectId?: number;
  projectLabel?: unknown;
  startCoordinate: Record<string, unknown>;
  startTime: string;
  tagTypes: unknown[];
}

/**
 * timesheet_activity_categories - Raw ServiceTitan response
 * Sample size: 8 records
 */
export interface STTimesheetActivityCategories {
  active: boolean;
  allowEdit: boolean;
  createdOn: string;
  id: number;
  isDefault: boolean;
  modifiedOn: string;
  name: string;
  type: string;
}

/**
 * timesheet_activity_types - Raw ServiceTitan response
 * Sample size: 27 records
 */
export interface STTimesheetActivityTypes {
  active: boolean;
  budgetCodeAssociation: string;
  businessUnitId?: unknown;
  categoryId: number;
  code: string;
  createdOn: string;
  defaultMemo?: string;
  defaultTagTypeIds: unknown[];
  description?: string;
  dontAllowToChangeMemo: boolean;
  dontAllowToChangeTag: boolean;
  icon: string;
  id: number;
  isArchived: boolean;
  isDefault: boolean;
  isDraft: boolean;
  isInUse: boolean;
  isTechnicianProfileLaborType: boolean;
  isUsersHomeBusinessUnit: boolean;
  jobAssociation: string;
  laborTypeAssociation: string;
  laborTypeId?: unknown;
  memoAssociation: string;
  modifiedOn: string;
  projectAssociation: string;
  projectLabelAssociation: string;
  tagAssociation: string;
  visibleToRoles: unknown[];
}

/**
 * timesheet_codes - Raw ServiceTitan response
 * Sample size: 14 records
 */
export interface STTimesheetCodes {
  active: boolean;
  applicableEmployeeType: string;
  code: string;
  createdOn: string;
  description?: string;
  id: number;
  modifiedOn: string;
  rateInfo: Record<string, unknown>;
  type: string;
}

/**
 * transfers - Raw ServiceTitan response
 * Sample size: 0 records
 */
export interface STTransfers {
}

/**
 * trucks - Raw ServiceTitan response
 * Sample size: 12 records
 */
export interface STTrucks {
  active: boolean;
  createdOn: string;
  externalData?: unknown;
  id: number;
  memo?: string;
  modifiedOn: string;
  name: string;
  technicianIds: unknown[];
  warehouseId: number;
}

/**
 * user_roles - Raw ServiceTitan response
 * Sample size: 20 records
 */
export interface STUserRoles {
  active: boolean;
  createdOn: string;
  employeeType: string;
  id: number;
  name: string;
}

/**
 * vendors - Raw ServiceTitan response
 * Sample size: 43 records
 */
export interface STVendors {
  active: boolean;
  address: Record<string, unknown>;
  contactInfo: Record<string, unknown>;
  createdOn: string;
  defaultTaxRate: number;
  deliveryOption: string;
  externalData?: unknown;
  id: number;
  isMobileCreationRestricted: boolean;
  isTruckReplenishment: boolean;
  memo?: string;
  modifiedOn: string;
  name: string;
}

/**
 * warehouses - Raw ServiceTitan response
 * Sample size: 1 records
 */
export interface STWarehouses {
  active: boolean;
  address: Record<string, unknown>;
  createdOn: string;
  externalData?: unknown;
  id: number;
  modifiedOn: string;
  name: string;
}

/**
 * zones - Raw ServiceTitan response
 * Sample size: 12 records
 */
export interface STZones {
  active: boolean;
  businessUnits: unknown[];
  cities: unknown[];
  createdBy: number;
  createdOn: string;
  id: number;
  locnNumbers: unknown[];
  modifiedOn: string;
  name: string;
  serviceDays: unknown[];
  serviceDaysEnabled: boolean;
  technicians: unknown[];
  territoryNumbers: unknown[];
  zips: unknown[];
}

// ===========================================
// MASTER TABLE TYPES (cleaned/typed)
// ===========================================

/**
 * activity_codes - Master table type
 */
export interface MasterActivityCodes {
  id: number;
  stId: number;
  active: boolean;
  code: string;
  createdon: Date;
  earningcategory: string;
  modifiedon: Date;
  name: string;
  syncedAt: Date;
  syncBatchId: string;
}

/**
 * adjustments - Master table type
 */
export interface MasterAdjustments {
  id: number;
  syncedAt: Date;
  syncBatchId: string;
}

/**
 * ap_bills - Master table type
 */
export interface MasterApBills {
  id: number;
  stId: number;
  batch?: Record<string, unknown>;
  billamount: string;
  billdate: Date;
  billtype: string;
  budgetcodeid?: unknown;
  businessunit: Record<string, unknown>;
  canceledby?: unknown;
  createdby: string;
  createdon: Date;
  customfields?: unknown;
  datecanceled?: unknown;
  donotpay: boolean;
  duedate: Date;
  earlydiscountdate?: unknown;
  expenseitems: unknown[];
  items: unknown[];
  jobid?: number;
  jobnumber?: string;
  modifiedon: Date;
  postdate: Date;
  purchaseorderid: number;
  referencenumber?: unknown;
  remittancevendorinfo: Record<string, unknown>;
  shippingamount: string;
  shipto: Record<string, unknown>;
  shiptodescription: string;
  source: string;
  status: string;
  summary?: unknown;
  syncstatus: string;
  taxamount: string;
  taxzone?: unknown;
  termname: string;
  vendor: Record<string, unknown>;
  vendorinvoicetotal?: unknown;
  vendornumber: string;
  syncedAt: Date;
  syncBatchId: string;
}

/**
 * ap_credits - Master table type
 */
export interface MasterApCredits {
  id: number;
  syncedAt: Date;
  syncBatchId: string;
}

/**
 * ap_payments - Master table type
 */
export interface MasterApPayments {
  id: number;
  syncedAt: Date;
  syncBatchId: string;
}

/**
 * appointment_assignments - Master table type
 */
export interface MasterAppointmentAssignments {
  id: number;
  stId: number;
  active: boolean;
  appointmentid: number;
  assignedbyid: number;
  assignedon: Date;
  createdon: Date;
  ispaused: boolean;
  jobid: number;
  modifiedon: Date;
  status: string;
  technicianid: number;
  technicianname: string;
  syncedAt: Date;
  syncBatchId: string;
}

/**
 * appointments - Master table type
 */
export interface MasterAppointments {
  id: number;
  stId: number;
  active: boolean;
  appointmentnumber: string;
  arrivalwindowend: Date;
  arrivalwindowstart: Date;
  createdbyid: number;
  createdon: Date;
  customerid: number;
  end: Date;
  isconfirmed: boolean;
  jobid: number;
  modifiedon: Date;
  specialinstructions: string;
  start: Date;
  status: string;
  unused: boolean;
  syncedAt: Date;
  syncBatchId: string;
}

/**
 * arrival_windows - Master table type
 */
export interface MasterArrivalWindows {
  id: number;
  stId: number;
  active: boolean;
  businessunitids: unknown[];
  duration: string;
  start: string;
  syncedAt: Date;
  syncBatchId: string;
}

/**
 * business_hours - Master table type
 */
export interface MasterBusinessHours {
  id: number;
  saturday: unknown[];
  sunday: unknown[];
  weekdays: unknown[];
  syncedAt: Date;
  syncBatchId: string;
}

/**
 * business_units - Master table type
 */
export interface MasterBusinessUnits {
  id: number;
  stId: number;
  accountcode?: unknown;
  acknowledgementparagraph: string;
  active: boolean;
  address: Record<string, unknown>;
  authorizationparagraph: string;
  conceptcode: string;
  corporatecontractnumber?: unknown;
  createdon: Date;
  currency: string;
  defaulttaxrate: number;
  division: Record<string, unknown>;
  email: string;
  externaldata?: unknown;
  franchiseid?: unknown;
  invoiceheader: string;
  invoicemessage: string;
  materialsku?: unknown;
  modifiedon: Date;
  name: string;
  officialname: string;
  phonenumber: string;
  quickbooksclass: string;
  tagtypeids: unknown[];
  tenant: Record<string, unknown>;
  trade: Record<string, unknown>;
  syncedAt: Date;
  syncBatchId: string;
}

/**
 * call_reasons - Master table type
 */
export interface MasterCallReasons {
  id: number;
  stId: number;
  active: boolean;
  createdon: Date;
  islead: boolean;
  modifiedon: Date;
  name: string;
  syncedAt: Date;
  syncBatchId: string;
}

/**
 * calls - Master table type
 */
export interface MasterCalls {
  id: number;
  stId: number;
  businessunit?: Record<string, unknown>;
  jobnumber?: string;
  leadcall: Record<string, unknown>;
  projectid: number;
  type?: Record<string, unknown>;
  syncedAt: Date;
  syncBatchId: string;
}

/**
 * campaign_categories - Master table type
 */
export interface MasterCampaignCategories {
  id: number;
  stId: number;
  active: boolean;
  createdon: Date;
  modifiedon: Date;
  name: string;
  type: string;
  syncedAt: Date;
  syncBatchId: string;
}

/**
 * campaigns - Master table type
 */
export interface MasterCampaigns {
  id: number;
  stId: number;
  active: boolean;
  businessunit?: unknown;
  campaignphonenumbers: unknown[];
  category: Record<string, unknown>;
  createdon: Date;
  isdefaultcampaign?: boolean;
  medium?: string;
  modifiedon: Date;
  name: string;
  othermedium?: unknown;
  othersource?: unknown;
  source?: string;
  syncedAt: Date;
  syncBatchId: string;
}

/**
 * customers - Master table type
 */
export interface MasterCustomers {
  id: number;
  stId: number;
  active: boolean;
  address: Record<string, unknown>;
  balance: number;
  createdbyid: number;
  createdon: Date;
  creditlimit?: unknown;
  creditlimitbalance?: unknown;
  customfields: unknown[];
  donotmail: boolean;
  donotservice: boolean;
  externaldata?: unknown;
  mergedtoid?: unknown;
  modifiedon: Date;
  name: string;
  nationalaccount: boolean;
  paymenttermid: number;
  tagtypeids: unknown[];
  taxexempt: boolean;
  type: string;
  syncedAt: Date;
  syncBatchId: string;
}

/**
 * employees - Master table type
 */
export interface MasterEmployees {
  id: number;
  stId: number;
  aaduserid?: unknown;
  accountlocked: boolean;
  active: boolean;
  businessunitid?: unknown;
  createdon: Date;
  customfields: unknown[];
  email?: string;
  loginname: string;
  modifiedon: Date;
  name: string;
  permissions: unknown[];
  phonenumber?: string;
  role: string;
  roleids: unknown[];
  userid: number;
  syncedAt: Date;
  syncBatchId: string;
}

/**
 * estimate_items - Master table type
 */
export interface MasterEstimateItems {
  id: number;
  stId: number;
  budgetcodeid?: unknown;
  chargeable?: boolean;
  createdon: Date;
  description: string;
  invoiceitemid?: unknown;
  itemgroupname?: unknown;
  itemgrouprootid?: unknown;
  membershiptypeid?: unknown;
  modifiedon: Date;
  qty: number;
  sku: Record<string, unknown>;
  skuaccount: string;
  total: number;
  totalcost: number;
  unitcost: number;
  unitrate: number;
  syncedAt: Date;
  syncBatchId: string;
}

/**
 * estimates - Master table type
 */
export interface MasterEstimates {
  id: number;
  stId: number;
  active: boolean;
  budgetcodeid?: unknown;
  businessunitid: number;
  businessunitname: string;
  createdon: Date;
  customerid: number;
  externallinks: unknown[];
  ischangeorder: boolean;
  isrecommended: boolean;
  items: unknown[];
  jobid?: number;
  jobnumber: string;
  locationid: number;
  modifiedon: Date;
  name: string;
  projectid: number;
  proposaltagname?: string;
  reviewstatus: string;
  soldby?: number;
  soldon?: Date;
  status: Record<string, unknown>;
  subtotal: number;
  summary: string;
  tax: number;
  syncedAt: Date;
  syncBatchId: string;
}

/**
 * forms - Master table type
 */
export interface MasterForms {
  id: number;
  stId: number;
  active: boolean;
  createdbyid: number;
  createdon: Date;
  hasconditionallogic: boolean;
  hastriggers: boolean;
  modifiedon: Date;
  name: string;
  published: boolean;
  syncedAt: Date;
  syncBatchId: string;
}

/**
 * gl_accounts - Master table type
 */
export interface MasterGlAccounts {
  id: number;
  stId: number;
  active: boolean;
  createdon: Date;
  defaultaccounttype?: string;
  description?: string;
  isintacctbankaccount: boolean;
  isintacctgroup: boolean;
  modifiedon: Date;
  name: string;
  number: string;
  source: string;
  subtype: string;
  type: string;
  syncedAt: Date;
  syncBatchId: string;
}

/**
 * gross_pay_items - Master table type
 */
export interface MasterGrossPayItems {
  id: number;
  stId: number;
  activity: string;
  activitycode?: string;
  activitycodeid?: number;
  amount: number;
  amountadjustment: number;
  budgetcodeid?: unknown;
  businessunitname?: string;
  createdon: Date;
  customerid?: number;
  customername?: string;
  date: Date;
  employeeid: number;
  employeepayrollid: string;
  employeetype: string;
  endedon: Date;
  grosspayitemtype: string;
  invoiceid?: number;
  invoiceitemid?: unknown;
  invoicenumber?: string;
  isprevailingwagejob: boolean;
  jobid: number;
  jobnumber?: string;
  jobtypename?: string;
  labortypecode?: string;
  labortypeid?: number;
  locationaddress?: string;
  locationid?: number;
  locationname?: string;
  locationzip?: string;
  memo?: string;
  modifiedon: Date;
  paiddurationhours: number;
  paidtimetype: string;
  payoutbusinessunitname?: string;
  payrollid: number;
  projectid?: number;
  projectnumber?: string;
  sourceentityid?: number;
  startedon: Date;
  taxzonename?: unknown;
  zonename?: string;
  syncedAt: Date;
  syncBatchId: string;
}

/**
 * installed_equipment - Master table type
 */
export interface MasterInstalledEquipment {
  id: number;
  stId: number;
  active: boolean;
  actualreplacementdate?: unknown;
  barcodeid?: unknown;
  cost: number;
  createdon: Date;
  customerid: number;
  equipmentid?: number;
  installedon?: Date;
  invoiceitemid?: number;
  locationid: number;
  manufacturer?: string;
  manufacturerwarrantyend?: Date;
  manufacturerwarrantystart?: Date;
  memo?: string;
  model?: string;
  modifiedon: Date;
  name?: string;
  predictedreplacementdate?: Date;
  predictedreplacementmonths?: number;
  serialnumber?: string;
  serviceproviderwarrantyend?: Date;
  serviceproviderwarrantystart?: Date;
  status: number;
  tags: unknown[];
  type?: Record<string, unknown>;
  syncedAt: Date;
  syncBatchId: string;
}

/**
 * inventory_bills - Master table type
 */
export interface MasterInventoryBills {
  id: number;
  stId: number;
  batch?: Record<string, unknown>;
  billamount: string;
  billdate: Date;
  budgetcodeid?: unknown;
  businessunit: Record<string, unknown>;
  createdby: string;
  createdon: Date;
  customfields?: unknown;
  duedate: Date;
  items: unknown[];
  jobid?: number;
  jobnumber?: string;
  modifiedon: Date;
  postdate: Date;
  purchaseorderid: number;
  referencenumber: string;
  shippingamount: string;
  shipto: Record<string, unknown>;
  shiptodescription: string;
  summary?: unknown;
  syncstatus: string;
  taxamount: string;
  taxzone?: unknown;
  termname: string;
  vendor: Record<string, unknown>;
  vendornumber: string;
  syncedAt: Date;
  syncBatchId: string;
}

/**
 * invoices - Master table type
 */
export interface MasterInvoices {
  id: number;
  stId: number;
  active: boolean;
  adjustmenttoid?: unknown;
  assignedto?: Record<string, unknown>;
  balance: string;
  batch?: unknown;
  budgetcodeid?: unknown;
  businessunit: Record<string, unknown>;
  commissioneligibilitydate?: unknown;
  createdby?: string;
  createdon: Date;
  customer: Record<string, unknown>;
  customeraddress: Record<string, unknown>;
  customfields?: unknown;
  depositedon?: unknown;
  discounttotal: string;
  duedate?: Date;
  employeeinfo?: Record<string, unknown>;
  exportid?: unknown;
  importid?: string;
  invoiceconfiguration: string;
  invoicedate?: Date;
  invoicetype?: unknown;
  items?: unknown[];
  job: Record<string, unknown>;
  location: Record<string, unknown>;
  locationaddress: Record<string, unknown>;
  materialskuid: number;
  membershipid?: unknown;
  modifiedon: Date;
  paidon?: Date;
  projectid?: number;
  referencenumber: string;
  reviewstatus: string;
  royalty: Record<string, unknown>;
  salestax: string;
  salestaxcode?: unknown;
  sentstatus: string;
  subtotal: string;
  summary?: string;
  syncstatus: string;
  taxzoneid?: unknown;
  termname: string;
  total: string;
  syncedAt: Date;
  syncBatchId: string;
}

/**
 * job_cancel_reasons - Master table type
 */
export interface MasterJobCancelReasons {
  id: number;
  stId: number;
  active: boolean;
  createdon: Date;
  modifiedon: Date;
  name: string;
  syncedAt: Date;
  syncBatchId: string;
}

/**
 * job_hold_reasons - Master table type
 */
export interface MasterJobHoldReasons {
  id: number;
  stId: number;
  active: boolean;
  createdon: Date;
  modifiedon: Date;
  name: string;
  syncedAt: Date;
  syncBatchId: string;
}

/**
 * job_splits - Master table type
 */
export interface MasterJobSplits {
  id: number;
  stId: number;
  createdon: Date;
  jobid: number;
  modifiedon: Date;
  split: number;
  technicianid: number;
  syncedAt: Date;
  syncBatchId: string;
}

/**
 * job_types - Master table type
 */
export interface MasterJobTypes {
  id: number;
  stId: number;
  active: boolean;
  businessunitids: unknown[];
  class?: string;
  createdon: Date;
  duration: number;
  enforcerecurringserviceeventselection?: unknown;
  externaldata?: unknown;
  invoicesignaturesrequired: boolean;
  issmartdispatched: boolean;
  modifiedon: Date;
  name: string;
  nocharge: boolean;
  priority: string;
  skills: unknown[];
  soldthreshold: number;
  summary: string;
  tagtypeids: unknown[];
  syncedAt: Date;
  syncBatchId: string;
}

/**
 * jobs - Master table type
 */
export interface MasterJobs {
  id: number;
  stId: number;
  appointmentcount: number;
  bookingid?: unknown;
  businessunitid: number;
  campaignid: number;
  completedon: Date;
  createdbyid: number;
  createdfromestimateid?: unknown;
  createdon: Date;
  customerid: number;
  customerpo?: unknown;
  customfields: unknown[];
  estimateids: unknown[];
  externaldata?: unknown;
  firstappointmentid: number;
  invoiceid: number;
  jobgeneratedleadsource: Record<string, unknown>;
  jobnumber: string;
  jobstatus: string;
  jobtypeid: number;
  lastappointmentid: number;
  leadcallid?: unknown;
  locationid: number;
  membershipid?: unknown;
  modifiedon: Date;
  nocharge: boolean;
  notificationsenabled: boolean;
  partnerleadcallid?: unknown;
  priority: string;
  projectid?: number;
  recallforid?: unknown;
  soldbyid?: unknown;
  summary: string;
  tagtypeids: unknown[];
  total: number;
  warrantyid?: unknown;
  syncedAt: Date;
  syncBatchId: string;
}

/**
 * journal_entries - Master table type
 */
export interface MasterJournalEntries {
  id: number;
  stId: number;
  createdon: Date;
  customfields: unknown[];
  exportedby?: unknown;
  exportedon?: Date;
  isempty: boolean;
  lastsyncversionid?: number;
  message?: string;
  modifiedon: Date;
  name: string;
  number: number;
  postdate: Date;
  status: string;
  syncstatus: string;
  url: string;
  versionid: number;
  syncedAt: Date;
  syncBatchId: string;
}

/**
 * non_job_appointments - Master table type
 */
export interface MasterNonJobAppointments {
  id: number;
  stId: number;
  active: boolean;
  allday: boolean;
  cleardispatchboard: boolean;
  cleartechnicianview: boolean;
  createdbyid: number;
  createdon: Date;
  duration: string;
  modifiedon: Date;
  name: string;
  removetechnicianfromcapacityplanning: boolean;
  showontechnicianschedule: boolean;
  start: Date;
  summary?: string;
  technicianid: number;
  timesheetcodeid: number;
  syncedAt: Date;
  syncBatchId: string;
}

/**
 * payment_terms - Master table type
 */
export interface MasterPaymentTerms {
  id: number;
  stId: number;
  active: boolean;
  createdon: Date;
  dueday: number;
  duedaytype: string;
  interestsettings?: unknown;
  inuse: boolean;
  iscustomerdefault: boolean;
  isvendordefault: boolean;
  modifiedon: Date;
  name: string;
  paymenttermdiscountmodel?: unknown;
  syncedAt: Date;
  syncBatchId: string;
}

/**
 * payment_types - Master table type
 */
export interface MasterPaymentTypes {
  id: number;
  stId: number;
  createdon: Date;
  modifiedon: Date;
  name: string;
  syncedAt: Date;
  syncBatchId: string;
}

/**
 * payments - Master table type
 */
export interface MasterPayments {
  id: number;
  stId: number;
  active: boolean;
  appliedto: unknown[];
  authcode?: string;
  batch?: Record<string, unknown>;
  businessunit: Record<string, unknown>;
  checknumber?: unknown;
  createdby?: string;
  createdon: Date;
  customer: Record<string, unknown>;
  customfields?: unknown;
  date: Date;
  deposit?: Record<string, unknown>;
  generalledgeraccount?: Record<string, unknown>;
  memo: string;
  modifiedon: Date;
  referencenumber?: unknown;
  refundedpaymentid?: unknown;
  syncstatus: string;
  total: string;
  type: string;
  typeid: string;
  unappliedamount: string;
  syncedAt: Date;
  syncBatchId: string;
}

/**
 * payroll_adjustments - Master table type
 */
export interface MasterPayrollAdjustments {
  id: number;
  syncedAt: Date;
  syncBatchId: string;
}

/**
 * payroll_timesheets - Master table type
 */
export interface MasterPayrollTimesheets {
  id: number;
  stId: number;
  active: boolean;
  appointmentid: number;
  arrivedon: Date;
  canceledon?: Date;
  createdon: Date;
  dispatchedon: Date;
  doneon?: Date;
  jobid: number;
  modifiedon: Date;
  technicianid: number;
  syncedAt: Date;
  syncBatchId: string;
}

/**
 * payrolls - Master table type
 */
export interface MasterPayrolls {
  id: number;
  stId: number;
  active: boolean;
  burdenrate: number;
  createdon: Date;
  employeeid: number;
  employeetype: string;
  endedon: Date;
  managerapprovedon?: Date;
  modifiedon: Date;
  startedon: Date;
  status: string;
  syncedAt: Date;
  syncBatchId: string;
}

/**
 * pricebook_categories - Master table type
 */
export interface MasterPricebookCategories {
  id: number;
  stId: number;
  active: boolean;
  businessunitids: unknown[];
  categorytype: string;
  description?: string;
  externalid?: unknown;
  hideinmobile: boolean;
  image?: string;
  name: string;
  parentid?: unknown;
  position: number;
  skuimages: unknown[];
  skuvideos: unknown[];
  source?: unknown;
  subcategories: unknown[];
  syncedAt: Date;
  syncBatchId: string;
}

/**
 * pricebook_client_specific_pricing - Master table type
 */
export interface MasterPricebookClientSpecificPricing {
  id: number;
  stId: number;
  exceptions: unknown[];
  syncedAt: Date;
  syncBatchId: string;
}

/**
 * pricebook_discounts_and_fees - Master table type
 */
export interface MasterPricebookDiscountsAndFees {
  id: number;
  stId: number;
  account: string;
  active: boolean;
  amount: number;
  amounttype: string;
  assets: unknown[];
  bonus: number;
  budgetcostcode?: unknown;
  budgetcosttype?: unknown;
  categories: unknown[];
  code: string;
  commissionbonus: number;
  crosssalegroup?: unknown;
  description: string;
  displayname: string;
  excludefrompayroll: boolean;
  externaldata: unknown[];
  hours: number;
  limit: number;
  payscommission: boolean;
  taxable: boolean;
  type: string;
  syncedAt: Date;
  syncBatchId: string;
}

/**
 * pricebook_equipment - Master table type
 */
export interface MasterPricebookEquipment {
  id: number;
  stId: number;
  account: string;
  active: boolean;
  addonmemberprice: number;
  addonprice: number;
  assetaccount?: unknown;
  assets: unknown[];
  bonus: number;
  budgetcostcode?: unknown;
  budgetcosttype?: unknown;
  categories: unknown[];
  code: string;
  commissionbonus: number;
  cost: number;
  costofsaleaccount: string;
  createdon: Date;
  crosssalegroup?: unknown;
  defaultasseturl?: string;
  description: string;
  dimensions: Record<string, unknown>;
  displayinamount: boolean;
  displayname: string;
  equipmentmaterials: unknown[];
  externaldata: unknown[];
  externalid?: unknown;
  generalledgeraccountid: number;
  hours: number;
  isconfigurableequipment: boolean;
  isinventory: boolean;
  manufacturer?: string;
  manufacturerwarranty: Record<string, unknown>;
  memberprice: number;
  model?: string;
  modifiedon: Date;
  othervendors: unknown[];
  payscommission: boolean;
  price: number;
  primaryvendor: Record<string, unknown>;
  recommendations: unknown[];
  serviceproviderwarranty: Record<string, unknown>;
  source?: unknown;
  taxable: boolean;
  typeid?: number;
  unitofmeasure?: string;
  upgrades: unknown[];
  variationsorconfigurableequipment: unknown[];
  syncedAt: Date;
  syncBatchId: string;
}

/**
 * pricebook_materials - Master table type
 */
export interface MasterPricebookMaterials {
  id: number;
  stId: number;
  account: string;
  active: boolean;
  addonmemberprice: number;
  addonprice: number;
  assetaccount?: unknown;
  assets: unknown[];
  bonus: number;
  budgetcostcode?: unknown;
  budgetcosttype?: unknown;
  businessunitid?: unknown;
  categories: unknown[];
  chargeablebydefault: boolean;
  code: string;
  commissionbonus: number;
  cost: number;
  costofsaleaccount: string;
  costtypeid?: unknown;
  createdbyid: number;
  createdon: Date;
  deductasjobcost: boolean;
  defaultasseturl?: string;
  description: string;
  displayinamount: boolean;
  displayname: string;
  externaldata: unknown[];
  externalid?: unknown;
  generalledgeraccountid: number;
  hours: number;
  isconfigurablematerial: boolean;
  isinventory: boolean;
  isotherdirectcost: boolean;
  memberprice: number;
  modifiedon: Date;
  othervendors: unknown[];
  payscommission: boolean;
  price: number;
  primaryvendor: Record<string, unknown>;
  source?: unknown;
  taxable: boolean;
  unitofmeasure: string;
  variationsorconfigurablematerials: unknown[];
  syncedAt: Date;
  syncBatchId: string;
}

/**
 * pricebook_services - Master table type
 */
export interface MasterPricebookServices {
  id: number;
  stId: number;
  account: string;
  active: boolean;
  addonmemberprice: number;
  addonprice: number;
  assets: unknown[];
  bonus: number;
  budgetcostcode?: unknown;
  budgetcosttype?: unknown;
  businessunitid?: number;
  calculatedprice?: unknown;
  categories: unknown[];
  code: string;
  commissionbonus: number;
  cost: number;
  createdon: Date;
  crosssalegroup?: unknown;
  defaultasseturl?: string;
  description: string;
  displayname: string;
  externaldata: unknown[];
  externalid?: unknown;
  hours: number;
  islabor: boolean;
  memberprice: number;
  modifiedon: Date;
  payscommission: boolean;
  price: number;
  recommendations: unknown[];
  serviceequipment: unknown[];
  servicematerials: unknown[];
  soldbycommission: number;
  source?: unknown;
  taxable: boolean;
  upgrades: unknown[];
  usestaticprices?: unknown;
  warranty: Record<string, unknown>;
  syncedAt: Date;
  syncBatchId: string;
}

/**
 * project_statuses - Master table type
 */
export interface MasterProjectStatuses {
  id: number;
  stId: number;
  modifiedon: Date;
  name: string;
  order: number;
  syncedAt: Date;
  syncBatchId: string;
}

/**
 * project_types - Master table type
 */
export interface MasterProjectTypes {
  id: number;
  stId: number;
  createdbyid?: number;
  description: string;
  name: string;
  syncedAt: Date;
  syncBatchId: string;
}

/**
 * projects - Master table type
 */
export interface MasterProjects {
  id: number;
  stId: number;
  actualcompletiondate?: unknown;
  businessunitids: unknown[];
  createdon: Date;
  customerid: number;
  customfields: unknown[];
  externaldata?: unknown;
  jobids: unknown[];
  locationid: number;
  modifiedon: Date;
  name?: string;
  number: string;
  projectmanagerids: unknown[];
  projecttypeid?: number;
  startdate?: Date;
  status?: string;
  statusid?: number;
  substatus?: string;
  substatusid?: number;
  summary?: string;
  targetcompletiondate?: Date;
  syncedAt: Date;
  syncBatchId: string;
}

/**
 * purchase_order_types - Master table type
 */
export interface MasterPurchaseOrderTypes {
  id: number;
  stId: number;
  active: boolean;
  allowtechnicianstosendpo: boolean;
  automaticallyreceive: boolean;
  createdon: Date;
  defaultrequireddatedaysoffset: number;
  displaytotechnician: boolean;
  excludetaxfromjobcosting: boolean;
  impacttotechnicianpayroll: boolean;
  modifiedon: Date;
  name: string;
  skipweekends: boolean;
  syncedAt: Date;
  syncBatchId: string;
}

/**
 * purchase_orders - Master table type
 */
export interface MasterPurchaseOrders {
  id: number;
  stId: number;
  batchid?: unknown;
  budgetcodeid?: unknown;
  businessunitid: number;
  createdon: Date;
  customfields?: unknown;
  date: Date;
  inventorylocationid: number;
  invoiceid?: number;
  items: unknown[];
  jobid?: number;
  modifiedon: Date;
  number: string;
  projectid?: number;
  receivedon?: Date;
  requiredon: Date;
  senton?: Date;
  shipping: number;
  shipto: Record<string, unknown>;
  status: string;
  summary?: string;
  tax: number;
  technicianid?: number;
  total: number;
  typeid: number;
  vendordocumentnumber?: unknown;
  vendorid: number;
  syncedAt: Date;
  syncBatchId: string;
}

/**
 * receipts - Master table type
 */
export interface MasterReceipts {
  id: number;
  stId: number;
  active: boolean;
  batchid?: unknown;
  billid: number;
  budgetcodeid?: unknown;
  businessunitid: number;
  createdbyid: number;
  createdon: Date;
  customfields?: unknown;
  inventorylocationid: number;
  items: unknown[];
  jobid?: number;
  memo?: string;
  modifiedon: Date;
  number: string;
  purchaseorderid: number;
  receiptamount: number;
  receivedon: Date;
  shippingamount: number;
  shipto: Record<string, unknown>;
  shiptodescription: string;
  syncstatus: string;
  taxamount: number;
  technicianid?: number;
  vendorid: number;
  vendorinvoicenumber?: string;
  syncedAt: Date;
  syncBatchId: string;
}

/**
 * remittance_vendors - Master table type
 */
export interface MasterRemittanceVendors {
  id: number;
  stId: number;
  active: boolean;
  address: Record<string, unknown>;
  contactinfo: Record<string, unknown>;
  createdon: Date;
  customerid?: unknown;
  isapproved: boolean;
  isverified: boolean;
  modifiedon: Date;
  name: string;
  syncedAt: Date;
  syncBatchId: string;
}

/**
 * report_categories - Master table type
 */
export interface MasterReportCategories {
  id: number;
  stId: number;
  name: string;
  syncedAt: Date;
  syncBatchId: string;
}

/**
 * returns - Master table type
 */
export interface MasterReturns {
  id: number;
  stId: number;
  active: boolean;
  batch: Record<string, unknown>;
  batchid: number;
  budgetcodeid?: unknown;
  businessunitid: number;
  canceledbyid?: unknown;
  canceledreason?: unknown;
  createdbyid: number;
  createdon: Date;
  creditreceivedon: Date;
  customfields?: unknown;
  datecanceled?: unknown;
  externaldata?: unknown;
  inventorylocationid?: number;
  items: unknown[];
  jobid?: number;
  memo?: string;
  modifiedon: Date;
  number: string;
  projectid?: number;
  purchaseorderid?: number;
  referencenumber: string;
  returnamount: number;
  returndate: Date;
  returnedon: Date;
  shippingamount: number;
  status: string;
  syncstatus: string;
  taxamount: number;
  vendorid: number;
  syncedAt: Date;
  syncBatchId: string;
}

/**
 * tag_types - Master table type
 */
export interface MasterTagTypes {
  id: number;
  stId: number;
  active: boolean;
  allowtouseontimesheetactivity: boolean;
  code?: string;
  color: string;
  createdon: Date;
  importance?: string;
  isconversionopportunity: boolean;
  isvisibleondispatchboard: boolean;
  modifiedon: Date;
  name: string;
  syncedAt: Date;
  syncBatchId: string;
}

/**
 * tasks - Master table type
 */
export interface MasterTasks {
  id: number;
  stId: number;
  active: boolean;
  assignedtoid: number;
  attachments: unknown[];
  businessunitid: number;
  closedon: Date;
  comments: unknown[];
  completeby?: Date;
  createdon: Date;
  customerid?: number;
  customername?: string;
  description?: string;
  descriptionmodifiedbyid?: number;
  descriptionmodifiedon?: Date;
  employeetaskresolutionid: number;
  employeetasksourceid: number;
  employeetasktypeid: number;
  involvedemployeeidlist: unknown[];
  isclosed: boolean;
  jobid?: number;
  jobnumber?: string;
  modifiedon: Date;
  name: string;
  priority: string;
  projectid?: number;
  refundissued?: unknown;
  reportedbyid: number;
  reportedon: Date;
  status: string;
  subtasksdata: Record<string, unknown>;
  tasknumber: number;
  syncedAt: Date;
  syncBatchId: string;
}

/**
 * tax_zones - Master table type
 */
export interface MasterTaxZones {
  id: number;
  syncedAt: Date;
  syncBatchId: string;
}

/**
 * teams - Master table type
 */
export interface MasterTeams {
  id: number;
  stId: number;
  active: boolean;
  createdby: number;
  createdon: Date;
  modifiedon: Date;
  name: string;
  syncedAt: Date;
  syncBatchId: string;
}

/**
 * technician_shifts - Master table type
 */
export interface MasterTechnicianShifts {
  id: number;
  stId: number;
  active: boolean;
  createdon: Date;
  end: Date;
  modifiedon: Date;
  note?: unknown;
  shifttype: string;
  start: Date;
  technicianid: number;
  timesheetcodeid?: unknown;
  title: string;
  syncedAt: Date;
  syncBatchId: string;
}

/**
 * technicians - Master table type
 */
export interface MasterTechnicians {
  id: number;
  stId: number;
  aaduserid?: unknown;
  accountlocked: boolean;
  active: boolean;
  burdenrate: number;
  businessunitid?: number;
  createdon: Date;
  customfields: unknown[];
  dailygoal: number;
  email?: string;
  home: Record<string, unknown>;
  ismanagedtech: boolean;
  jobfilter: string;
  loginname: string;
  mainzoneid?: number;
  modifiedon: Date;
  name: string;
  permissions: unknown[];
  phonenumber?: string;
  roleids: unknown[];
  team: string;
  userid: number;
  zoneids: unknown[];
  syncedAt: Date;
  syncBatchId: string;
}

/**
 * timesheet_activities - Master table type
 */
export interface MasterTimesheetActivities {
  id: number;
  stId: number;
  active: boolean;
  activitytypeid: number;
  appointmentid?: number;
  budgetcodeid?: unknown;
  createdon: Date;
  employeeid: number;
  employeetype: string;
  endcoordinate: Record<string, unknown>;
  endtime: Date;
  jobid?: number;
  labortypeid?: number;
  memo?: string;
  modifiedbyid?: number;
  modifiedon: Date;
  projectid?: number;
  projectlabel?: unknown;
  startcoordinate: Record<string, unknown>;
  starttime: Date;
  tagtypes: unknown[];
  syncedAt: Date;
  syncBatchId: string;
}

/**
 * timesheet_activity_categories - Master table type
 */
export interface MasterTimesheetActivityCategories {
  id: number;
  stId: number;
  active: boolean;
  allowedit: boolean;
  createdon: Date;
  isdefault: boolean;
  modifiedon: Date;
  name: string;
  type: string;
  syncedAt: Date;
  syncBatchId: string;
}

/**
 * timesheet_activity_types - Master table type
 */
export interface MasterTimesheetActivityTypes {
  id: number;
  stId: number;
  active: boolean;
  budgetcodeassociation: string;
  businessunitid?: unknown;
  categoryid: number;
  code: string;
  createdon: Date;
  defaultmemo?: string;
  defaulttagtypeids: unknown[];
  description?: string;
  dontallowtochangememo: boolean;
  dontallowtochangetag: boolean;
  icon: string;
  isarchived: boolean;
  isdefault: boolean;
  isdraft: boolean;
  isinuse: boolean;
  istechnicianprofilelabortype: boolean;
  isusershomebusinessunit: boolean;
  jobassociation: string;
  labortypeassociation: string;
  labortypeid?: unknown;
  memoassociation: string;
  modifiedon: Date;
  projectassociation: string;
  projectlabelassociation: string;
  tagassociation: string;
  visibletoroles: unknown[];
  syncedAt: Date;
  syncBatchId: string;
}

/**
 * timesheet_codes - Master table type
 */
export interface MasterTimesheetCodes {
  id: number;
  stId: number;
  active: boolean;
  applicableemployeetype: string;
  code: string;
  createdon: Date;
  description?: string;
  modifiedon: Date;
  rateinfo: Record<string, unknown>;
  type: string;
  syncedAt: Date;
  syncBatchId: string;
}

/**
 * transfers - Master table type
 */
export interface MasterTransfers {
  id: number;
  syncedAt: Date;
  syncBatchId: string;
}

/**
 * trucks - Master table type
 */
export interface MasterTrucks {
  id: number;
  stId: number;
  active: boolean;
  createdon: Date;
  externaldata?: unknown;
  memo?: string;
  modifiedon: Date;
  name: string;
  technicianids: unknown[];
  warehouseid: number;
  syncedAt: Date;
  syncBatchId: string;
}

/**
 * user_roles - Master table type
 */
export interface MasterUserRoles {
  id: number;
  stId: number;
  active: boolean;
  createdon: Date;
  employeetype: string;
  name: string;
  syncedAt: Date;
  syncBatchId: string;
}

/**
 * vendors - Master table type
 */
export interface MasterVendors {
  id: number;
  stId: number;
  active: boolean;
  address: Record<string, unknown>;
  contactinfo: Record<string, unknown>;
  createdon: Date;
  defaulttaxrate: number;
  deliveryoption: string;
  externaldata?: unknown;
  ismobilecreationrestricted: boolean;
  istruckreplenishment: boolean;
  memo?: string;
  modifiedon: Date;
  name: string;
  syncedAt: Date;
  syncBatchId: string;
}

/**
 * warehouses - Master table type
 */
export interface MasterWarehouses {
  id: number;
  stId: number;
  active: boolean;
  address: Record<string, unknown>;
  createdon: Date;
  externaldata?: unknown;
  modifiedon: Date;
  name: string;
  syncedAt: Date;
  syncBatchId: string;
}

/**
 * zones - Master table type
 */
export interface MasterZones {
  id: number;
  stId: number;
  active: boolean;
  businessunits: unknown[];
  cities: unknown[];
  createdby: number;
  createdon: Date;
  locnnumbers: unknown[];
  modifiedon: Date;
  name: string;
  servicedays: unknown[];
  servicedaysenabled: boolean;
  technicians: unknown[];
  territorynumbers: unknown[];
  zips: unknown[];
  syncedAt: Date;
  syncBatchId: string;
}

// ===========================================
// COMMON TYPES
// ===========================================

/**
 * Paginated response wrapper (common ST pattern)
 */
export interface STPaginatedResponse<T> {
  data: T[];
  page?: number;
  pageSize?: number;
  totalCount?: number;
  hasMore?: boolean;
}

/**
 * All endpoint names
 */
export type STEndpointName =
  | 'activity_codes'
  | 'adjustments'
  | 'ap_bills'
  | 'ap_credits'
  | 'ap_payments'
  | 'appointment_assignments'
  | 'appointments'
  | 'arrival_windows'
  | 'business_hours'
  | 'business_units'
  | 'call_reasons'
  | 'calls'
  | 'campaign_categories'
  | 'campaigns'
  | 'customers'
  | 'employees'
  | 'estimate_items'
  | 'estimates'
  | 'forms'
  | 'gl_accounts'
  | 'gross_pay_items'
  | 'installed_equipment'
  | 'inventory_bills'
  | 'invoices'
  | 'job_cancel_reasons'
  | 'job_hold_reasons'
  | 'job_splits'
  | 'job_types'
  | 'jobs'
  | 'journal_entries'
  | 'non_job_appointments'
  | 'payment_terms'
  | 'payment_types'
  | 'payments'
  | 'payroll_adjustments'
  | 'payroll_timesheets'
  | 'payrolls'
  | 'pricebook_categories'
  | 'pricebook_client_specific_pricing'
  | 'pricebook_discounts_and_fees'
  | 'pricebook_equipment'
  | 'pricebook_materials'
  | 'pricebook_services'
  | 'project_statuses'
  | 'project_types'
  | 'projects'
  | 'purchase_order_types'
  | 'purchase_orders'
  | 'receipts'
  | 'remittance_vendors'
  | 'report_categories'
  | 'returns'
  | 'tag_types'
  | 'tasks'
  | 'tax_zones'
  | 'teams'
  | 'technician_shifts'
  | 'technicians'
  | 'timesheet_activities'
  | 'timesheet_activity_categories'
  | 'timesheet_activity_types'
  | 'timesheet_codes'
  | 'transfers'
  | 'trucks'
  | 'user_roles'
  | 'vendors'
  | 'warehouses'
  | 'zones';

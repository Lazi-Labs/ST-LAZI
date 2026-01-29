-- ===========================================
-- RAW TABLES (Auto-generated from ST API discovery)
-- Generated: 2026-01-21T14:16:43.056Z
-- ===========================================

-- These tables store the EXACT response from ServiceTitan
-- DO NOT modify this schema manually - regenerate from discovery
-- Raw tables are APPEND-ONLY - no updates or deletes allowed

-- ===========================================
-- ACTIVITY
-- ===========================================

-- activity_codes
-- Sample: 9 records, 7 total fields
-- ID field: id
-- Timestamps: createdOn, modifiedOn
-- Relationships: none
CREATE TABLE IF NOT EXISTS raw.st_activity_codes (
    id BIGSERIAL PRIMARY KEY,
    st_id BIGINT GENERATED ALWAYS AS ((payload->>'id')::bigint) STORED,
    payload JSONB NOT NULL,
    synced_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    sync_batch_id UUID NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_raw_activity_codes_st_id
    ON raw.st_activity_codes (st_id);
CREATE INDEX IF NOT EXISTS idx_raw_activity_codes_synced
    ON raw.st_activity_codes (synced_at DESC);
CREATE INDEX IF NOT EXISTS idx_raw_activity_codes_batch
    ON raw.st_activity_codes (sync_batch_id);

-- ===========================================
-- ADJUSTMENTS
-- ===========================================

-- adjustments
-- Sample: 0 records, 0 total fields
-- ID field: none detected
-- Timestamps: none
-- Relationships: none
CREATE TABLE IF NOT EXISTS raw.st_adjustments (
    id BIGSERIAL PRIMARY KEY,
    payload JSONB NOT NULL,
    synced_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    sync_batch_id UUID NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_raw_adjustments_synced
    ON raw.st_adjustments (synced_at DESC);
CREATE INDEX IF NOT EXISTS idx_raw_adjustments_batch
    ON raw.st_adjustments (sync_batch_id);

-- ===========================================
-- AP
-- ===========================================

-- ap_bills
-- Sample: 100 records, 87 total fields
-- ID field: id
-- Timestamps: billDate, createdBy, createdOn, dateCanceled, dueDate, earlyDiscountDate, modifiedOn, postDate
-- Relationships: budgetCodeId, jobId, purchaseOrderId
CREATE TABLE IF NOT EXISTS raw.st_ap_bills (
    id BIGSERIAL PRIMARY KEY,
    st_id BIGINT GENERATED ALWAYS AS ((payload->>'id')::bigint) STORED,
    payload JSONB NOT NULL,
    synced_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    sync_batch_id UUID NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_raw_ap_bills_st_id
    ON raw.st_ap_bills (st_id);
CREATE INDEX IF NOT EXISTS idx_raw_ap_bills_synced
    ON raw.st_ap_bills (synced_at DESC);
CREATE INDEX IF NOT EXISTS idx_raw_ap_bills_batch
    ON raw.st_ap_bills (sync_batch_id);

-- ap_credits
-- Sample: 0 records, 0 total fields
-- ID field: none detected
-- Timestamps: none
-- Relationships: none
CREATE TABLE IF NOT EXISTS raw.st_ap_credits (
    id BIGSERIAL PRIMARY KEY,
    payload JSONB NOT NULL,
    synced_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    sync_batch_id UUID NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_raw_ap_credits_synced
    ON raw.st_ap_credits (synced_at DESC);
CREATE INDEX IF NOT EXISTS idx_raw_ap_credits_batch
    ON raw.st_ap_credits (sync_batch_id);

-- ap_payments
-- Sample: 0 records, 0 total fields
-- ID field: none detected
-- Timestamps: none
-- Relationships: none
CREATE TABLE IF NOT EXISTS raw.st_ap_payments (
    id BIGSERIAL PRIMARY KEY,
    payload JSONB NOT NULL,
    synced_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    sync_batch_id UUID NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_raw_ap_payments_synced
    ON raw.st_ap_payments (synced_at DESC);
CREATE INDEX IF NOT EXISTS idx_raw_ap_payments_batch
    ON raw.st_ap_payments (sync_batch_id);

-- ===========================================
-- APPOINTMENT
-- ===========================================

-- appointment_assignments
-- Sample: 100 records, 12 total fields
-- ID field: id
-- Timestamps: assignedOn, createdOn, modifiedOn
-- Relationships: appointmentId, assignedById, jobId, technicianId
CREATE TABLE IF NOT EXISTS raw.st_appointment_assignments (
    id BIGSERIAL PRIMARY KEY,
    st_id BIGINT GENERATED ALWAYS AS ((payload->>'id')::bigint) STORED,
    payload JSONB NOT NULL,
    synced_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    sync_batch_id UUID NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_raw_appointment_assignments_st_id
    ON raw.st_appointment_assignments (st_id);
CREATE INDEX IF NOT EXISTS idx_raw_appointment_assignments_synced
    ON raw.st_appointment_assignments (synced_at DESC);
CREATE INDEX IF NOT EXISTS idx_raw_appointment_assignments_batch
    ON raw.st_appointment_assignments (sync_batch_id);

-- ===========================================
-- APPOINTMENTS
-- ===========================================

-- appointments
-- Sample: 100 records, 16 total fields
-- ID field: id
-- Timestamps: arrivalWindowEnd, arrivalWindowStart, createdById, createdOn, end, modifiedOn, start
-- Relationships: createdById, customerId, jobId
CREATE TABLE IF NOT EXISTS raw.st_appointments (
    id BIGSERIAL PRIMARY KEY,
    st_id BIGINT GENERATED ALWAYS AS ((payload->>'id')::bigint) STORED,
    payload JSONB NOT NULL,
    synced_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    sync_batch_id UUID NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_raw_appointments_st_id
    ON raw.st_appointments (st_id);
CREATE INDEX IF NOT EXISTS idx_raw_appointments_synced
    ON raw.st_appointments (synced_at DESC);
CREATE INDEX IF NOT EXISTS idx_raw_appointments_batch
    ON raw.st_appointments (sync_batch_id);

-- ===========================================
-- ARRIVAL
-- ===========================================

-- arrival_windows
-- Sample: 5 records, 5 total fields
-- ID field: id
-- Timestamps: none
-- Relationships: none
CREATE TABLE IF NOT EXISTS raw.st_arrival_windows (
    id BIGSERIAL PRIMARY KEY,
    st_id BIGINT GENERATED ALWAYS AS ((payload->>'id')::bigint) STORED,
    payload JSONB NOT NULL,
    synced_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    sync_batch_id UUID NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_raw_arrival_windows_st_id
    ON raw.st_arrival_windows (st_id);
CREATE INDEX IF NOT EXISTS idx_raw_arrival_windows_synced
    ON raw.st_arrival_windows (synced_at DESC);
CREATE INDEX IF NOT EXISTS idx_raw_arrival_windows_batch
    ON raw.st_arrival_windows (sync_batch_id);

-- ===========================================
-- BUSINESS
-- ===========================================

-- business_hours
-- Sample: 1 records, 7 total fields
-- ID field: none detected
-- Timestamps: none
-- Relationships: none
CREATE TABLE IF NOT EXISTS raw.st_business_hours (
    id BIGSERIAL PRIMARY KEY,
    payload JSONB NOT NULL,
    synced_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    sync_batch_id UUID NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_raw_business_hours_synced
    ON raw.st_business_hours (synced_at DESC);
CREATE INDEX IF NOT EXISTS idx_raw_business_hours_batch
    ON raw.st_business_hours (sync_batch_id);

-- business_units
-- Sample: 4 records, 46 total fields
-- ID field: id
-- Timestamps: createdOn, modifiedOn
-- Relationships: franchiseId
CREATE TABLE IF NOT EXISTS raw.st_business_units (
    id BIGSERIAL PRIMARY KEY,
    st_id BIGINT GENERATED ALWAYS AS ((payload->>'id')::bigint) STORED,
    payload JSONB NOT NULL,
    synced_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    sync_batch_id UUID NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_raw_business_units_st_id
    ON raw.st_business_units (st_id);
CREATE INDEX IF NOT EXISTS idx_raw_business_units_synced
    ON raw.st_business_units (synced_at DESC);
CREATE INDEX IF NOT EXISTS idx_raw_business_units_batch
    ON raw.st_business_units (sync_batch_id);

-- ===========================================
-- CALL
-- ===========================================

-- call_reasons
-- Sample: 18 records, 6 total fields
-- ID field: id
-- Timestamps: createdOn, modifiedOn
-- Relationships: none
CREATE TABLE IF NOT EXISTS raw.st_call_reasons (
    id BIGSERIAL PRIMARY KEY,
    st_id BIGINT GENERATED ALWAYS AS ((payload->>'id')::bigint) STORED,
    payload JSONB NOT NULL,
    synced_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    sync_batch_id UUID NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_raw_call_reasons_st_id
    ON raw.st_call_reasons (st_id);
CREATE INDEX IF NOT EXISTS idx_raw_call_reasons_synced
    ON raw.st_call_reasons (synced_at DESC);
CREATE INDEX IF NOT EXISTS idx_raw_call_reasons_batch
    ON raw.st_call_reasons (sync_batch_id);

-- ===========================================
-- CALLS
-- ===========================================

-- calls
-- Sample: 100 records, 43 total fields
-- ID field: id
-- Timestamps: none
-- Relationships: projectId
CREATE TABLE IF NOT EXISTS raw.st_calls (
    id BIGSERIAL PRIMARY KEY,
    st_id BIGINT GENERATED ALWAYS AS ((payload->>'id')::bigint) STORED,
    payload JSONB NOT NULL,
    synced_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    sync_batch_id UUID NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_raw_calls_st_id
    ON raw.st_calls (st_id);
CREATE INDEX IF NOT EXISTS idx_raw_calls_synced
    ON raw.st_calls (synced_at DESC);
CREATE INDEX IF NOT EXISTS idx_raw_calls_batch
    ON raw.st_calls (sync_batch_id);

-- ===========================================
-- CAMPAIGN
-- ===========================================

-- campaign_categories
-- Sample: 4 records, 6 total fields
-- ID field: id
-- Timestamps: createdOn, modifiedOn
-- Relationships: none
CREATE TABLE IF NOT EXISTS raw.st_campaign_categories (
    id BIGSERIAL PRIMARY KEY,
    st_id BIGINT GENERATED ALWAYS AS ((payload->>'id')::bigint) STORED,
    payload JSONB NOT NULL,
    synced_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    sync_batch_id UUID NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_raw_campaign_categories_st_id
    ON raw.st_campaign_categories (st_id);
CREATE INDEX IF NOT EXISTS idx_raw_campaign_categories_synced
    ON raw.st_campaign_categories (synced_at DESC);
CREATE INDEX IF NOT EXISTS idx_raw_campaign_categories_batch
    ON raw.st_campaign_categories (sync_batch_id);

-- ===========================================
-- CAMPAIGNS
-- ===========================================

-- campaigns
-- Sample: 12 records, 16 total fields
-- ID field: id
-- Timestamps: createdOn, modifiedOn
-- Relationships: none
CREATE TABLE IF NOT EXISTS raw.st_campaigns (
    id BIGSERIAL PRIMARY KEY,
    st_id BIGINT GENERATED ALWAYS AS ((payload->>'id')::bigint) STORED,
    payload JSONB NOT NULL,
    synced_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    sync_batch_id UUID NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_raw_campaigns_st_id
    ON raw.st_campaigns (st_id);
CREATE INDEX IF NOT EXISTS idx_raw_campaigns_synced
    ON raw.st_campaigns (synced_at DESC);
CREATE INDEX IF NOT EXISTS idx_raw_campaigns_batch
    ON raw.st_campaigns (sync_batch_id);

-- ===========================================
-- CUSTOMERS
-- ===========================================

-- customers
-- Sample: 100 records, 28 total fields
-- ID field: id
-- Timestamps: createdById, createdOn, modifiedOn
-- Relationships: createdById, mergedToId, paymentTermId
CREATE TABLE IF NOT EXISTS raw.st_customers (
    id BIGSERIAL PRIMARY KEY,
    st_id BIGINT GENERATED ALWAYS AS ((payload->>'id')::bigint) STORED,
    payload JSONB NOT NULL,
    synced_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    sync_batch_id UUID NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_raw_customers_st_id
    ON raw.st_customers (st_id);
CREATE INDEX IF NOT EXISTS idx_raw_customers_synced
    ON raw.st_customers (synced_at DESC);
CREATE INDEX IF NOT EXISTS idx_raw_customers_batch
    ON raw.st_customers (sync_batch_id);

-- ===========================================
-- EMPLOYEES
-- ===========================================

-- employees
-- Sample: 4 records, 18 total fields
-- ID field: id
-- Timestamps: createdOn, modifiedOn
-- Relationships: aadUserId, businessUnitId, userId
CREATE TABLE IF NOT EXISTS raw.st_employees (
    id BIGSERIAL PRIMARY KEY,
    st_id BIGINT GENERATED ALWAYS AS ((payload->>'id')::bigint) STORED,
    payload JSONB NOT NULL,
    synced_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    sync_batch_id UUID NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_raw_employees_st_id
    ON raw.st_employees (st_id);
CREATE INDEX IF NOT EXISTS idx_raw_employees_synced
    ON raw.st_employees (synced_at DESC);
CREATE INDEX IF NOT EXISTS idx_raw_employees_batch
    ON raw.st_employees (sync_batch_id);

-- ===========================================
-- ESTIMATE
-- ===========================================

-- estimate_items
-- Sample: 100 records, 25 total fields
-- ID field: id
-- Timestamps: createdOn, modifiedOn
-- Relationships: budgetCodeId, invoiceItemId, itemGroupRootId, membershipTypeId
CREATE TABLE IF NOT EXISTS raw.st_estimate_items (
    id BIGSERIAL PRIMARY KEY,
    st_id BIGINT GENERATED ALWAYS AS ((payload->>'id')::bigint) STORED,
    payload JSONB NOT NULL,
    synced_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    sync_batch_id UUID NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_raw_estimate_items_st_id
    ON raw.st_estimate_items (st_id);
CREATE INDEX IF NOT EXISTS idx_raw_estimate_items_synced
    ON raw.st_estimate_items (synced_at DESC);
CREATE INDEX IF NOT EXISTS idx_raw_estimate_items_batch
    ON raw.st_estimate_items (sync_batch_id);

-- ===========================================
-- ESTIMATES
-- ===========================================

-- estimates
-- Sample: 100 records, 52 total fields
-- ID field: id
-- Timestamps: createdOn, modifiedOn, soldOn
-- Relationships: budgetCodeId, businessUnitId, customerId, jobId, locationId, projectId
CREATE TABLE IF NOT EXISTS raw.st_estimates (
    id BIGSERIAL PRIMARY KEY,
    st_id BIGINT GENERATED ALWAYS AS ((payload->>'id')::bigint) STORED,
    payload JSONB NOT NULL,
    synced_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    sync_batch_id UUID NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_raw_estimates_st_id
    ON raw.st_estimates (st_id);
CREATE INDEX IF NOT EXISTS idx_raw_estimates_synced
    ON raw.st_estimates (synced_at DESC);
CREATE INDEX IF NOT EXISTS idx_raw_estimates_batch
    ON raw.st_estimates (sync_batch_id);

-- ===========================================
-- FORMS
-- ===========================================

-- forms
-- Sample: 1 records, 9 total fields
-- ID field: id
-- Timestamps: createdById, createdOn, modifiedOn
-- Relationships: createdById
CREATE TABLE IF NOT EXISTS raw.st_forms (
    id BIGSERIAL PRIMARY KEY,
    st_id BIGINT GENERATED ALWAYS AS ((payload->>'id')::bigint) STORED,
    payload JSONB NOT NULL,
    synced_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    sync_batch_id UUID NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_raw_forms_st_id
    ON raw.st_forms (st_id);
CREATE INDEX IF NOT EXISTS idx_raw_forms_synced
    ON raw.st_forms (synced_at DESC);
CREATE INDEX IF NOT EXISTS idx_raw_forms_batch
    ON raw.st_forms (sync_batch_id);

-- ===========================================
-- GL
-- ===========================================

-- gl_accounts
-- Sample: 38 records, 13 total fields
-- ID field: id
-- Timestamps: createdOn, modifiedOn
-- Relationships: none
CREATE TABLE IF NOT EXISTS raw.st_gl_accounts (
    id BIGSERIAL PRIMARY KEY,
    st_id BIGINT GENERATED ALWAYS AS ((payload->>'id')::bigint) STORED,
    payload JSONB NOT NULL,
    synced_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    sync_batch_id UUID NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_raw_gl_accounts_st_id
    ON raw.st_gl_accounts (st_id);
CREATE INDEX IF NOT EXISTS idx_raw_gl_accounts_synced
    ON raw.st_gl_accounts (synced_at DESC);
CREATE INDEX IF NOT EXISTS idx_raw_gl_accounts_batch
    ON raw.st_gl_accounts (sync_batch_id);

-- ===========================================
-- GROSS
-- ===========================================

-- gross_pay_items
-- Sample: 100 records, 42 total fields
-- ID field: id
-- Timestamps: createdOn, date, endedOn, modifiedOn, paidTimeType, startedOn
-- Relationships: activityCodeId, budgetCodeId, customerId, employeeId, employeePayrollId, invoiceId, invoiceItemId, jobId, laborTypeId, locationId, payrollId, projectId, sourceEntityId
CREATE TABLE IF NOT EXISTS raw.st_gross_pay_items (
    id BIGSERIAL PRIMARY KEY,
    st_id BIGINT GENERATED ALWAYS AS ((payload->>'id')::bigint) STORED,
    payload JSONB NOT NULL,
    synced_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    sync_batch_id UUID NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_raw_gross_pay_items_st_id
    ON raw.st_gross_pay_items (st_id);
CREATE INDEX IF NOT EXISTS idx_raw_gross_pay_items_synced
    ON raw.st_gross_pay_items (synced_at DESC);
CREATE INDEX IF NOT EXISTS idx_raw_gross_pay_items_batch
    ON raw.st_gross_pay_items (sync_batch_id);

-- ===========================================
-- INSTALLED
-- ===========================================

-- installed_equipment
-- Sample: 100 records, 36 total fields
-- ID field: id
-- Timestamps: actualReplacementDate, createdOn, installedOn, manufacturerWarrantyEnd, manufacturerWarrantyStart, modifiedOn, predictedReplacementDate, serviceProviderWarrantyEnd, serviceProviderWarrantyStart
-- Relationships: barcodeId, customerId, equipmentId, invoiceItemId, locationId
CREATE TABLE IF NOT EXISTS raw.st_installed_equipment (
    id BIGSERIAL PRIMARY KEY,
    st_id BIGINT GENERATED ALWAYS AS ((payload->>'id')::bigint) STORED,
    payload JSONB NOT NULL,
    synced_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    sync_batch_id UUID NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_raw_installed_equipment_st_id
    ON raw.st_installed_equipment (st_id);
CREATE INDEX IF NOT EXISTS idx_raw_installed_equipment_synced
    ON raw.st_installed_equipment (synced_at DESC);
CREATE INDEX IF NOT EXISTS idx_raw_installed_equipment_batch
    ON raw.st_installed_equipment (sync_batch_id);

-- ===========================================
-- INVENTORY
-- ===========================================

-- inventory_bills
-- Sample: 100 records, 71 total fields
-- ID field: id
-- Timestamps: billDate, createdBy, createdOn, dueDate, modifiedOn, postDate
-- Relationships: budgetCodeId, jobId, purchaseOrderId
CREATE TABLE IF NOT EXISTS raw.st_inventory_bills (
    id BIGSERIAL PRIMARY KEY,
    st_id BIGINT GENERATED ALWAYS AS ((payload->>'id')::bigint) STORED,
    payload JSONB NOT NULL,
    synced_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    sync_batch_id UUID NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_raw_inventory_bills_st_id
    ON raw.st_inventory_bills (st_id);
CREATE INDEX IF NOT EXISTS idx_raw_inventory_bills_synced
    ON raw.st_inventory_bills (synced_at DESC);
CREATE INDEX IF NOT EXISTS idx_raw_inventory_bills_batch
    ON raw.st_inventory_bills (sync_batch_id);

-- ===========================================
-- INVOICES
-- ===========================================

-- invoices
-- Sample: 100 records, 118 total fields
-- ID field: id
-- Timestamps: commissionEligibilityDate, createdBy, createdOn, dueDate, invoiceDate, modifiedOn, paidOn
-- Relationships: adjustmentToId, budgetCodeId, exportId, importId, materialSkuId, membershipId, projectId, taxZoneId
CREATE TABLE IF NOT EXISTS raw.st_invoices (
    id BIGSERIAL PRIMARY KEY,
    st_id BIGINT GENERATED ALWAYS AS ((payload->>'id')::bigint) STORED,
    payload JSONB NOT NULL,
    synced_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    sync_batch_id UUID NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_raw_invoices_st_id
    ON raw.st_invoices (st_id);
CREATE INDEX IF NOT EXISTS idx_raw_invoices_synced
    ON raw.st_invoices (synced_at DESC);
CREATE INDEX IF NOT EXISTS idx_raw_invoices_batch
    ON raw.st_invoices (sync_batch_id);

-- ===========================================
-- JOB
-- ===========================================

-- job_cancel_reasons
-- Sample: 24 records, 5 total fields
-- ID field: id
-- Timestamps: createdOn, modifiedOn
-- Relationships: none
CREATE TABLE IF NOT EXISTS raw.st_job_cancel_reasons (
    id BIGSERIAL PRIMARY KEY,
    st_id BIGINT GENERATED ALWAYS AS ((payload->>'id')::bigint) STORED,
    payload JSONB NOT NULL,
    synced_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    sync_batch_id UUID NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_raw_job_cancel_reasons_st_id
    ON raw.st_job_cancel_reasons (st_id);
CREATE INDEX IF NOT EXISTS idx_raw_job_cancel_reasons_synced
    ON raw.st_job_cancel_reasons (synced_at DESC);
CREATE INDEX IF NOT EXISTS idx_raw_job_cancel_reasons_batch
    ON raw.st_job_cancel_reasons (sync_batch_id);

-- job_hold_reasons
-- Sample: 18 records, 5 total fields
-- ID field: id
-- Timestamps: createdOn, modifiedOn
-- Relationships: none
CREATE TABLE IF NOT EXISTS raw.st_job_hold_reasons (
    id BIGSERIAL PRIMARY KEY,
    st_id BIGINT GENERATED ALWAYS AS ((payload->>'id')::bigint) STORED,
    payload JSONB NOT NULL,
    synced_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    sync_batch_id UUID NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_raw_job_hold_reasons_st_id
    ON raw.st_job_hold_reasons (st_id);
CREATE INDEX IF NOT EXISTS idx_raw_job_hold_reasons_synced
    ON raw.st_job_hold_reasons (synced_at DESC);
CREATE INDEX IF NOT EXISTS idx_raw_job_hold_reasons_batch
    ON raw.st_job_hold_reasons (sync_batch_id);

-- job_splits
-- Sample: 100 records, 6 total fields
-- ID field: id
-- Timestamps: createdOn, modifiedOn
-- Relationships: jobId, technicianId
CREATE TABLE IF NOT EXISTS raw.st_job_splits (
    id BIGSERIAL PRIMARY KEY,
    st_id BIGINT GENERATED ALWAYS AS ((payload->>'id')::bigint) STORED,
    payload JSONB NOT NULL,
    synced_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    sync_batch_id UUID NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_raw_job_splits_st_id
    ON raw.st_job_splits (st_id);
CREATE INDEX IF NOT EXISTS idx_raw_job_splits_synced
    ON raw.st_job_splits (synced_at DESC);
CREATE INDEX IF NOT EXISTS idx_raw_job_splits_batch
    ON raw.st_job_splits (sync_batch_id);

-- job_types
-- Sample: 38 records, 18 total fields
-- ID field: id
-- Timestamps: createdOn, modifiedOn
-- Relationships: none
CREATE TABLE IF NOT EXISTS raw.st_job_types (
    id BIGSERIAL PRIMARY KEY,
    st_id BIGINT GENERATED ALWAYS AS ((payload->>'id')::bigint) STORED,
    payload JSONB NOT NULL,
    synced_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    sync_batch_id UUID NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_raw_job_types_st_id
    ON raw.st_job_types (st_id);
CREATE INDEX IF NOT EXISTS idx_raw_job_types_synced
    ON raw.st_job_types (synced_at DESC);
CREATE INDEX IF NOT EXISTS idx_raw_job_types_batch
    ON raw.st_job_types (sync_batch_id);

-- ===========================================
-- JOBS
-- ===========================================

-- jobs
-- Sample: 100 records, 38 total fields
-- ID field: id
-- Timestamps: completedOn, createdById, createdFromEstimateId, createdOn, modifiedOn
-- Relationships: bookingId, businessUnitId, campaignId, createdById, createdFromEstimateId, customerId, firstAppointmentId, invoiceId, jobTypeId, lastAppointmentId, leadCallId, locationId, membershipId, partnerLeadCallId, projectId, recallForId, soldById, warrantyId
CREATE TABLE IF NOT EXISTS raw.st_jobs (
    id BIGSERIAL PRIMARY KEY,
    st_id BIGINT GENERATED ALWAYS AS ((payload->>'id')::bigint) STORED,
    payload JSONB NOT NULL,
    synced_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    sync_batch_id UUID NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_raw_jobs_st_id
    ON raw.st_jobs (st_id);
CREATE INDEX IF NOT EXISTS idx_raw_jobs_synced
    ON raw.st_jobs (synced_at DESC);
CREATE INDEX IF NOT EXISTS idx_raw_jobs_batch
    ON raw.st_jobs (sync_batch_id);

-- ===========================================
-- JOURNAL
-- ===========================================

-- journal_entries
-- Sample: 100 records, 16 total fields
-- ID field: id
-- Timestamps: createdOn, exportedOn, modifiedOn, postDate
-- Relationships: lastSyncVersionId, versionId
CREATE TABLE IF NOT EXISTS raw.st_journal_entries (
    id BIGSERIAL PRIMARY KEY,
    st_id BIGINT GENERATED ALWAYS AS ((payload->>'id')::bigint) STORED,
    payload JSONB NOT NULL,
    synced_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    sync_batch_id UUID NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_raw_journal_entries_st_id
    ON raw.st_journal_entries (st_id);
CREATE INDEX IF NOT EXISTS idx_raw_journal_entries_synced
    ON raw.st_journal_entries (synced_at DESC);
CREATE INDEX IF NOT EXISTS idx_raw_journal_entries_batch
    ON raw.st_journal_entries (sync_batch_id);

-- ===========================================
-- NON
-- ===========================================

-- non_job_appointments
-- Sample: 100 records, 16 total fields
-- ID field: id
-- Timestamps: createdById, createdOn, modifiedOn, start, timesheetCodeId
-- Relationships: createdById, technicianId, timesheetCodeId
CREATE TABLE IF NOT EXISTS raw.st_non_job_appointments (
    id BIGSERIAL PRIMARY KEY,
    st_id BIGINT GENERATED ALWAYS AS ((payload->>'id')::bigint) STORED,
    payload JSONB NOT NULL,
    synced_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    sync_batch_id UUID NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_raw_non_job_appointments_st_id
    ON raw.st_non_job_appointments (st_id);
CREATE INDEX IF NOT EXISTS idx_raw_non_job_appointments_synced
    ON raw.st_non_job_appointments (synced_at DESC);
CREATE INDEX IF NOT EXISTS idx_raw_non_job_appointments_batch
    ON raw.st_non_job_appointments (sync_batch_id);

-- ===========================================
-- PAYMENT
-- ===========================================

-- payment_terms
-- Sample: 5 records, 12 total fields
-- ID field: id
-- Timestamps: createdOn, modifiedOn
-- Relationships: none
CREATE TABLE IF NOT EXISTS raw.st_payment_terms (
    id BIGSERIAL PRIMARY KEY,
    st_id BIGINT GENERATED ALWAYS AS ((payload->>'id')::bigint) STORED,
    payload JSONB NOT NULL,
    synced_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    sync_batch_id UUID NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_raw_payment_terms_st_id
    ON raw.st_payment_terms (st_id);
CREATE INDEX IF NOT EXISTS idx_raw_payment_terms_synced
    ON raw.st_payment_terms (synced_at DESC);
CREATE INDEX IF NOT EXISTS idx_raw_payment_terms_batch
    ON raw.st_payment_terms (sync_batch_id);

-- payment_types
-- Sample: 16 records, 4 total fields
-- ID field: id
-- Timestamps: createdOn, modifiedOn
-- Relationships: none
CREATE TABLE IF NOT EXISTS raw.st_payment_types (
    id BIGSERIAL PRIMARY KEY,
    st_id BIGINT GENERATED ALWAYS AS ((payload->>'id')::bigint) STORED,
    payload JSONB NOT NULL,
    synced_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    sync_batch_id UUID NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_raw_payment_types_st_id
    ON raw.st_payment_types (st_id);
CREATE INDEX IF NOT EXISTS idx_raw_payment_types_synced
    ON raw.st_payment_types (synced_at DESC);
CREATE INDEX IF NOT EXISTS idx_raw_payment_types_batch
    ON raw.st_payment_types (sync_batch_id);

-- ===========================================
-- PAYMENTS
-- ===========================================

-- payments
-- Sample: 100 records, 43 total fields
-- ID field: id
-- Timestamps: createdBy, createdOn, date, modifiedOn
-- Relationships: refundedPaymentId, typeId
CREATE TABLE IF NOT EXISTS raw.st_payments (
    id BIGSERIAL PRIMARY KEY,
    st_id BIGINT GENERATED ALWAYS AS ((payload->>'id')::bigint) STORED,
    payload JSONB NOT NULL,
    synced_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    sync_batch_id UUID NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_raw_payments_st_id
    ON raw.st_payments (st_id);
CREATE INDEX IF NOT EXISTS idx_raw_payments_synced
    ON raw.st_payments (synced_at DESC);
CREATE INDEX IF NOT EXISTS idx_raw_payments_batch
    ON raw.st_payments (sync_batch_id);

-- ===========================================
-- PAYROLL
-- ===========================================

-- payroll_adjustments
-- Sample: 0 records, 0 total fields
-- ID field: none detected
-- Timestamps: none
-- Relationships: none
CREATE TABLE IF NOT EXISTS raw.st_payroll_adjustments (
    id BIGSERIAL PRIMARY KEY,
    payload JSONB NOT NULL,
    synced_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    sync_batch_id UUID NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_raw_payroll_adjustments_synced
    ON raw.st_payroll_adjustments (synced_at DESC);
CREATE INDEX IF NOT EXISTS idx_raw_payroll_adjustments_batch
    ON raw.st_payroll_adjustments (sync_batch_id);

-- payroll_timesheets
-- Sample: 100 records, 11 total fields
-- ID field: id
-- Timestamps: arrivedOn, canceledOn, createdOn, dispatchedOn, doneOn, modifiedOn
-- Relationships: appointmentId, jobId, technicianId
CREATE TABLE IF NOT EXISTS raw.st_payroll_timesheets (
    id BIGSERIAL PRIMARY KEY,
    st_id BIGINT GENERATED ALWAYS AS ((payload->>'id')::bigint) STORED,
    payload JSONB NOT NULL,
    synced_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    sync_batch_id UUID NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_raw_payroll_timesheets_st_id
    ON raw.st_payroll_timesheets (st_id);
CREATE INDEX IF NOT EXISTS idx_raw_payroll_timesheets_synced
    ON raw.st_payroll_timesheets (synced_at DESC);
CREATE INDEX IF NOT EXISTS idx_raw_payroll_timesheets_batch
    ON raw.st_payroll_timesheets (sync_batch_id);

-- ===========================================
-- PAYROLLS
-- ===========================================

-- payrolls
-- Sample: 100 records, 11 total fields
-- ID field: id
-- Timestamps: createdOn, endedOn, managerApprovedOn, modifiedOn, startedOn
-- Relationships: employeeId
CREATE TABLE IF NOT EXISTS raw.st_payrolls (
    id BIGSERIAL PRIMARY KEY,
    st_id BIGINT GENERATED ALWAYS AS ((payload->>'id')::bigint) STORED,
    payload JSONB NOT NULL,
    synced_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    sync_batch_id UUID NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_raw_payrolls_st_id
    ON raw.st_payrolls (st_id);
CREATE INDEX IF NOT EXISTS idx_raw_payrolls_synced
    ON raw.st_payrolls (synced_at DESC);
CREATE INDEX IF NOT EXISTS idx_raw_payrolls_batch
    ON raw.st_payrolls (sync_batch_id);

-- ===========================================
-- PRICEBOOK
-- ===========================================

-- pricebook_categories
-- Sample: 10 records, 90 total fields
-- ID field: id
-- Timestamps: none
-- Relationships: externalId, parentId
CREATE TABLE IF NOT EXISTS raw.st_pricebook_categories (
    id BIGSERIAL PRIMARY KEY,
    st_id BIGINT GENERATED ALWAYS AS ((payload->>'id')::bigint) STORED,
    payload JSONB NOT NULL,
    synced_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    sync_batch_id UUID NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_raw_pricebook_categories_st_id
    ON raw.st_pricebook_categories (st_id);
CREATE INDEX IF NOT EXISTS idx_raw_pricebook_categories_synced
    ON raw.st_pricebook_categories (synced_at DESC);
CREATE INDEX IF NOT EXISTS idx_raw_pricebook_categories_batch
    ON raw.st_pricebook_categories (sync_batch_id);

-- pricebook_client_specific_pricing
-- Sample: 7 records, 2 total fields
-- ID field: id
-- Timestamps: none
-- Relationships: none
CREATE TABLE IF NOT EXISTS raw.st_pricebook_client_specific_pricing (
    id BIGSERIAL PRIMARY KEY,
    st_id BIGINT GENERATED ALWAYS AS ((payload->>'id')::bigint) STORED,
    payload JSONB NOT NULL,
    synced_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    sync_batch_id UUID NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_raw_pricebook_client_specific_pricing_st_id
    ON raw.st_pricebook_client_specific_pricing (st_id);
CREATE INDEX IF NOT EXISTS idx_raw_pricebook_client_specific_pricing_synced
    ON raw.st_pricebook_client_specific_pricing (synced_at DESC);
CREATE INDEX IF NOT EXISTS idx_raw_pricebook_client_specific_pricing_batch
    ON raw.st_pricebook_client_specific_pricing (sync_batch_id);

-- pricebook_discounts_and_fees
-- Sample: 7 records, 27 total fields
-- ID field: id
-- Timestamps: none
-- Relationships: none
CREATE TABLE IF NOT EXISTS raw.st_pricebook_discounts_and_fees (
    id BIGSERIAL PRIMARY KEY,
    st_id BIGINT GENERATED ALWAYS AS ((payload->>'id')::bigint) STORED,
    payload JSONB NOT NULL,
    synced_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    sync_batch_id UUID NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_raw_pricebook_discounts_and_fees_st_id
    ON raw.st_pricebook_discounts_and_fees (st_id);
CREATE INDEX IF NOT EXISTS idx_raw_pricebook_discounts_and_fees_synced
    ON raw.st_pricebook_discounts_and_fees (synced_at DESC);
CREATE INDEX IF NOT EXISTS idx_raw_pricebook_discounts_and_fees_batch
    ON raw.st_pricebook_discounts_and_fees (sync_batch_id);

-- pricebook_equipment
-- Sample: 100 records, 78 total fields
-- ID field: id
-- Timestamps: createdOn, modifiedOn
-- Relationships: externalId, generalLedgerAccountId, typeId
CREATE TABLE IF NOT EXISTS raw.st_pricebook_equipment (
    id BIGSERIAL PRIMARY KEY,
    st_id BIGINT GENERATED ALWAYS AS ((payload->>'id')::bigint) STORED,
    payload JSONB NOT NULL,
    synced_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    sync_batch_id UUID NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_raw_pricebook_equipment_st_id
    ON raw.st_pricebook_equipment (st_id);
CREATE INDEX IF NOT EXISTS idx_raw_pricebook_equipment_synced
    ON raw.st_pricebook_equipment (synced_at DESC);
CREATE INDEX IF NOT EXISTS idx_raw_pricebook_equipment_batch
    ON raw.st_pricebook_equipment (sync_batch_id);

-- pricebook_materials
-- Sample: 100 records, 65 total fields
-- ID field: id
-- Timestamps: createdById, createdOn, modifiedOn
-- Relationships: businessUnitId, costTypeId, createdById, externalId, generalLedgerAccountId
CREATE TABLE IF NOT EXISTS raw.st_pricebook_materials (
    id BIGSERIAL PRIMARY KEY,
    st_id BIGINT GENERATED ALWAYS AS ((payload->>'id')::bigint) STORED,
    payload JSONB NOT NULL,
    synced_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    sync_batch_id UUID NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_raw_pricebook_materials_st_id
    ON raw.st_pricebook_materials (st_id);
CREATE INDEX IF NOT EXISTS idx_raw_pricebook_materials_synced
    ON raw.st_pricebook_materials (synced_at DESC);
CREATE INDEX IF NOT EXISTS idx_raw_pricebook_materials_batch
    ON raw.st_pricebook_materials (sync_batch_id);

-- pricebook_services
-- Sample: 100 records, 49 total fields
-- ID field: id
-- Timestamps: createdOn, modifiedOn
-- Relationships: businessUnitId, externalId
CREATE TABLE IF NOT EXISTS raw.st_pricebook_services (
    id BIGSERIAL PRIMARY KEY,
    st_id BIGINT GENERATED ALWAYS AS ((payload->>'id')::bigint) STORED,
    payload JSONB NOT NULL,
    synced_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    sync_batch_id UUID NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_raw_pricebook_services_st_id
    ON raw.st_pricebook_services (st_id);
CREATE INDEX IF NOT EXISTS idx_raw_pricebook_services_synced
    ON raw.st_pricebook_services (synced_at DESC);
CREATE INDEX IF NOT EXISTS idx_raw_pricebook_services_batch
    ON raw.st_pricebook_services (sync_batch_id);

-- ===========================================
-- PROJECT
-- ===========================================

-- project_statuses
-- Sample: 7 records, 4 total fields
-- ID field: id
-- Timestamps: modifiedOn
-- Relationships: none
CREATE TABLE IF NOT EXISTS raw.st_project_statuses (
    id BIGSERIAL PRIMARY KEY,
    st_id BIGINT GENERATED ALWAYS AS ((payload->>'id')::bigint) STORED,
    payload JSONB NOT NULL,
    synced_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    sync_batch_id UUID NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_raw_project_statuses_st_id
    ON raw.st_project_statuses (st_id);
CREATE INDEX IF NOT EXISTS idx_raw_project_statuses_synced
    ON raw.st_project_statuses (synced_at DESC);
CREATE INDEX IF NOT EXISTS idx_raw_project_statuses_batch
    ON raw.st_project_statuses (sync_batch_id);

-- project_types
-- Sample: 6 records, 4 total fields
-- ID field: id
-- Timestamps: createdById
-- Relationships: createdById
CREATE TABLE IF NOT EXISTS raw.st_project_types (
    id BIGSERIAL PRIMARY KEY,
    st_id BIGINT GENERATED ALWAYS AS ((payload->>'id')::bigint) STORED,
    payload JSONB NOT NULL,
    synced_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    sync_batch_id UUID NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_raw_project_types_st_id
    ON raw.st_project_types (st_id);
CREATE INDEX IF NOT EXISTS idx_raw_project_types_synced
    ON raw.st_project_types (synced_at DESC);
CREATE INDEX IF NOT EXISTS idx_raw_project_types_batch
    ON raw.st_project_types (sync_batch_id);

-- ===========================================
-- PROJECTS
-- ===========================================

-- projects
-- Sample: 100 records, 21 total fields
-- ID field: id
-- Timestamps: actualCompletionDate, createdOn, modifiedOn, startDate, targetCompletionDate
-- Relationships: customerId, locationId, projectTypeId, statusId, subStatusId
CREATE TABLE IF NOT EXISTS raw.st_projects (
    id BIGSERIAL PRIMARY KEY,
    st_id BIGINT GENERATED ALWAYS AS ((payload->>'id')::bigint) STORED,
    payload JSONB NOT NULL,
    synced_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    sync_batch_id UUID NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_raw_projects_st_id
    ON raw.st_projects (st_id);
CREATE INDEX IF NOT EXISTS idx_raw_projects_synced
    ON raw.st_projects (synced_at DESC);
CREATE INDEX IF NOT EXISTS idx_raw_projects_batch
    ON raw.st_projects (sync_batch_id);

-- ===========================================
-- PURCHASE
-- ===========================================

-- purchase_order_types
-- Sample: 10 records, 12 total fields
-- ID field: id
-- Timestamps: createdOn, defaultRequiredDateDaysOffset, modifiedOn
-- Relationships: none
CREATE TABLE IF NOT EXISTS raw.st_purchase_order_types (
    id BIGSERIAL PRIMARY KEY,
    st_id BIGINT GENERATED ALWAYS AS ((payload->>'id')::bigint) STORED,
    payload JSONB NOT NULL,
    synced_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    sync_batch_id UUID NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_raw_purchase_order_types_st_id
    ON raw.st_purchase_order_types (st_id);
CREATE INDEX IF NOT EXISTS idx_raw_purchase_order_types_synced
    ON raw.st_purchase_order_types (synced_at DESC);
CREATE INDEX IF NOT EXISTS idx_raw_purchase_order_types_batch
    ON raw.st_purchase_order_types (sync_batch_id);

-- purchase_orders
-- Sample: 100 records, 50 total fields
-- ID field: id
-- Timestamps: createdOn, date, modifiedOn, receivedOn, requiredOn, sentOn
-- Relationships: batchId, budgetCodeId, businessUnitId, inventoryLocationId, invoiceId, jobId, projectId, technicianId, typeId, vendorId
CREATE TABLE IF NOT EXISTS raw.st_purchase_orders (
    id BIGSERIAL PRIMARY KEY,
    st_id BIGINT GENERATED ALWAYS AS ((payload->>'id')::bigint) STORED,
    payload JSONB NOT NULL,
    synced_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    sync_batch_id UUID NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_raw_purchase_orders_st_id
    ON raw.st_purchase_orders (st_id);
CREATE INDEX IF NOT EXISTS idx_raw_purchase_orders_synced
    ON raw.st_purchase_orders (synced_at DESC);
CREATE INDEX IF NOT EXISTS idx_raw_purchase_orders_batch
    ON raw.st_purchase_orders (sync_batch_id);

-- ===========================================
-- RECEIPTS
-- ===========================================

-- receipts
-- Sample: 100 records, 56 total fields
-- ID field: id
-- Timestamps: createdById, createdOn, modifiedOn, receivedOn
-- Relationships: batchId, billId, budgetCodeId, businessUnitId, createdById, inventoryLocationId, jobId, purchaseOrderId, technicianId, vendorId
CREATE TABLE IF NOT EXISTS raw.st_receipts (
    id BIGSERIAL PRIMARY KEY,
    st_id BIGINT GENERATED ALWAYS AS ((payload->>'id')::bigint) STORED,
    payload JSONB NOT NULL,
    synced_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    sync_batch_id UUID NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_raw_receipts_st_id
    ON raw.st_receipts (st_id);
CREATE INDEX IF NOT EXISTS idx_raw_receipts_synced
    ON raw.st_receipts (synced_at DESC);
CREATE INDEX IF NOT EXISTS idx_raw_receipts_batch
    ON raw.st_receipts (sync_batch_id);

-- ===========================================
-- REMITTANCE
-- ===========================================

-- remittance_vendors
-- Sample: 40 records, 21 total fields
-- ID field: id
-- Timestamps: createdOn, modifiedOn
-- Relationships: customerId
CREATE TABLE IF NOT EXISTS raw.st_remittance_vendors (
    id BIGSERIAL PRIMARY KEY,
    st_id BIGINT GENERATED ALWAYS AS ((payload->>'id')::bigint) STORED,
    payload JSONB NOT NULL,
    synced_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    sync_batch_id UUID NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_raw_remittance_vendors_st_id
    ON raw.st_remittance_vendors (st_id);
CREATE INDEX IF NOT EXISTS idx_raw_remittance_vendors_synced
    ON raw.st_remittance_vendors (synced_at DESC);
CREATE INDEX IF NOT EXISTS idx_raw_remittance_vendors_batch
    ON raw.st_remittance_vendors (sync_batch_id);

-- ===========================================
-- REPORT
-- ===========================================

-- report_categories
-- Sample: 12 records, 2 total fields
-- ID field: id
-- Timestamps: none
-- Relationships: none
CREATE TABLE IF NOT EXISTS raw.st_report_categories (
    id BIGSERIAL PRIMARY KEY,
    st_id BIGINT GENERATED ALWAYS AS ((payload->>'id')::bigint) STORED,
    payload JSONB NOT NULL,
    synced_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    sync_batch_id UUID NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_raw_report_categories_st_id
    ON raw.st_report_categories (st_id);
CREATE INDEX IF NOT EXISTS idx_raw_report_categories_synced
    ON raw.st_report_categories (synced_at DESC);
CREATE INDEX IF NOT EXISTS idx_raw_report_categories_batch
    ON raw.st_report_categories (sync_batch_id);

-- ===========================================
-- RETURNS
-- ===========================================

-- returns
-- Sample: 42 records, 63 total fields
-- ID field: id
-- Timestamps: createdById, createdOn, creditReceivedOn, dateCanceled, modifiedOn, returnDate, returnedOn
-- Relationships: batchId, budgetCodeId, businessUnitId, canceledById, createdById, inventoryLocationId, jobId, projectId, purchaseOrderId, vendorId
CREATE TABLE IF NOT EXISTS raw.st_returns (
    id BIGSERIAL PRIMARY KEY,
    st_id BIGINT GENERATED ALWAYS AS ((payload->>'id')::bigint) STORED,
    payload JSONB NOT NULL,
    synced_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    sync_batch_id UUID NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_raw_returns_st_id
    ON raw.st_returns (st_id);
CREATE INDEX IF NOT EXISTS idx_raw_returns_synced
    ON raw.st_returns (synced_at DESC);
CREATE INDEX IF NOT EXISTS idx_raw_returns_batch
    ON raw.st_returns (sync_batch_id);

-- ===========================================
-- TAG
-- ===========================================

-- tag_types
-- Sample: 95 records, 11 total fields
-- ID field: id
-- Timestamps: allowToUseOnTimesheetActivity, createdOn, modifiedOn
-- Relationships: none
CREATE TABLE IF NOT EXISTS raw.st_tag_types (
    id BIGSERIAL PRIMARY KEY,
    st_id BIGINT GENERATED ALWAYS AS ((payload->>'id')::bigint) STORED,
    payload JSONB NOT NULL,
    synced_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    sync_batch_id UUID NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_raw_tag_types_st_id
    ON raw.st_tag_types (st_id);
CREATE INDEX IF NOT EXISTS idx_raw_tag_types_synced
    ON raw.st_tag_types (synced_at DESC);
CREATE INDEX IF NOT EXISTS idx_raw_tag_types_batch
    ON raw.st_tag_types (sync_batch_id);

-- ===========================================
-- TASKS
-- ===========================================

-- tasks
-- Sample: 100 records, 42 total fields
-- ID field: id
-- Timestamps: closedOn, completeBy, createdOn, descriptionModifiedById, descriptionModifiedOn, modifiedOn, reportedOn
-- Relationships: assignedToId, businessUnitId, customerId, descriptionModifiedById, employeeTaskResolutionId, employeeTaskSourceId, employeeTaskTypeId, jobId, projectId, reportedById
CREATE TABLE IF NOT EXISTS raw.st_tasks (
    id BIGSERIAL PRIMARY KEY,
    st_id BIGINT GENERATED ALWAYS AS ((payload->>'id')::bigint) STORED,
    payload JSONB NOT NULL,
    synced_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    sync_batch_id UUID NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_raw_tasks_st_id
    ON raw.st_tasks (st_id);
CREATE INDEX IF NOT EXISTS idx_raw_tasks_synced
    ON raw.st_tasks (synced_at DESC);
CREATE INDEX IF NOT EXISTS idx_raw_tasks_batch
    ON raw.st_tasks (sync_batch_id);

-- ===========================================
-- TAX
-- ===========================================

-- tax_zones
-- Sample: 0 records, 0 total fields
-- ID field: none detected
-- Timestamps: none
-- Relationships: none
CREATE TABLE IF NOT EXISTS raw.st_tax_zones (
    id BIGSERIAL PRIMARY KEY,
    payload JSONB NOT NULL,
    synced_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    sync_batch_id UUID NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_raw_tax_zones_synced
    ON raw.st_tax_zones (synced_at DESC);
CREATE INDEX IF NOT EXISTS idx_raw_tax_zones_batch
    ON raw.st_tax_zones (sync_batch_id);

-- ===========================================
-- TEAMS
-- ===========================================

-- teams
-- Sample: 6 records, 6 total fields
-- ID field: id
-- Timestamps: createdBy, createdOn, modifiedOn
-- Relationships: none
CREATE TABLE IF NOT EXISTS raw.st_teams (
    id BIGSERIAL PRIMARY KEY,
    st_id BIGINT GENERATED ALWAYS AS ((payload->>'id')::bigint) STORED,
    payload JSONB NOT NULL,
    synced_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    sync_batch_id UUID NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_raw_teams_st_id
    ON raw.st_teams (st_id);
CREATE INDEX IF NOT EXISTS idx_raw_teams_synced
    ON raw.st_teams (synced_at DESC);
CREATE INDEX IF NOT EXISTS idx_raw_teams_batch
    ON raw.st_teams (sync_batch_id);

-- ===========================================
-- TECHNICIAN
-- ===========================================

-- technician_shifts
-- Sample: 100 records, 11 total fields
-- ID field: id
-- Timestamps: createdOn, end, modifiedOn, start, timesheetCodeId
-- Relationships: technicianId, timesheetCodeId
CREATE TABLE IF NOT EXISTS raw.st_technician_shifts (
    id BIGSERIAL PRIMARY KEY,
    st_id BIGINT GENERATED ALWAYS AS ((payload->>'id')::bigint) STORED,
    payload JSONB NOT NULL,
    synced_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    sync_batch_id UUID NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_raw_technician_shifts_st_id
    ON raw.st_technician_shifts (st_id);
CREATE INDEX IF NOT EXISTS idx_raw_technician_shifts_synced
    ON raw.st_technician_shifts (synced_at DESC);
CREATE INDEX IF NOT EXISTS idx_raw_technician_shifts_batch
    ON raw.st_technician_shifts (sync_batch_id);

-- ===========================================
-- TECHNICIANS
-- ===========================================

-- technicians
-- Sample: 9 records, 34 total fields
-- ID field: id
-- Timestamps: createdOn, modifiedOn
-- Relationships: aadUserId, businessUnitId, mainZoneId, userId
CREATE TABLE IF NOT EXISTS raw.st_technicians (
    id BIGSERIAL PRIMARY KEY,
    st_id BIGINT GENERATED ALWAYS AS ((payload->>'id')::bigint) STORED,
    payload JSONB NOT NULL,
    synced_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    sync_batch_id UUID NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_raw_technicians_st_id
    ON raw.st_technicians (st_id);
CREATE INDEX IF NOT EXISTS idx_raw_technicians_synced
    ON raw.st_technicians (synced_at DESC);
CREATE INDEX IF NOT EXISTS idx_raw_technicians_batch
    ON raw.st_technicians (sync_batch_id);

-- ===========================================
-- TIMESHEET
-- ===========================================

-- timesheet_activities
-- Sample: 100 records, 24 total fields
-- ID field: id
-- Timestamps: createdOn, endTime, modifiedById, modifiedOn, startTime
-- Relationships: activityTypeId, appointmentId, budgetCodeId, employeeId, jobId, laborTypeId, modifiedById, projectId
CREATE TABLE IF NOT EXISTS raw.st_timesheet_activities (
    id BIGSERIAL PRIMARY KEY,
    st_id BIGINT GENERATED ALWAYS AS ((payload->>'id')::bigint) STORED,
    payload JSONB NOT NULL,
    synced_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    sync_batch_id UUID NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_raw_timesheet_activities_st_id
    ON raw.st_timesheet_activities (st_id);
CREATE INDEX IF NOT EXISTS idx_raw_timesheet_activities_synced
    ON raw.st_timesheet_activities (synced_at DESC);
CREATE INDEX IF NOT EXISTS idx_raw_timesheet_activities_batch
    ON raw.st_timesheet_activities (sync_batch_id);

-- timesheet_activity_categories
-- Sample: 8 records, 8 total fields
-- ID field: id
-- Timestamps: createdOn, modifiedOn
-- Relationships: none
CREATE TABLE IF NOT EXISTS raw.st_timesheet_activity_categories (
    id BIGSERIAL PRIMARY KEY,
    st_id BIGINT GENERATED ALWAYS AS ((payload->>'id')::bigint) STORED,
    payload JSONB NOT NULL,
    synced_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    sync_batch_id UUID NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_raw_timesheet_activity_categories_st_id
    ON raw.st_timesheet_activity_categories (st_id);
CREATE INDEX IF NOT EXISTS idx_raw_timesheet_activity_categories_synced
    ON raw.st_timesheet_activity_categories (synced_at DESC);
CREATE INDEX IF NOT EXISTS idx_raw_timesheet_activity_categories_batch
    ON raw.st_timesheet_activity_categories (sync_batch_id);

-- timesheet_activity_types
-- Sample: 27 records, 28 total fields
-- ID field: id
-- Timestamps: createdOn, modifiedOn
-- Relationships: businessUnitId, categoryId, laborTypeId
CREATE TABLE IF NOT EXISTS raw.st_timesheet_activity_types (
    id BIGSERIAL PRIMARY KEY,
    st_id BIGINT GENERATED ALWAYS AS ((payload->>'id')::bigint) STORED,
    payload JSONB NOT NULL,
    synced_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    sync_batch_id UUID NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_raw_timesheet_activity_types_st_id
    ON raw.st_timesheet_activity_types (st_id);
CREATE INDEX IF NOT EXISTS idx_raw_timesheet_activity_types_synced
    ON raw.st_timesheet_activity_types (synced_at DESC);
CREATE INDEX IF NOT EXISTS idx_raw_timesheet_activity_types_batch
    ON raw.st_timesheet_activity_types (sync_batch_id);

-- timesheet_codes
-- Sample: 14 records, 12 total fields
-- ID field: id
-- Timestamps: createdOn, modifiedOn
-- Relationships: none
CREATE TABLE IF NOT EXISTS raw.st_timesheet_codes (
    id BIGSERIAL PRIMARY KEY,
    st_id BIGINT GENERATED ALWAYS AS ((payload->>'id')::bigint) STORED,
    payload JSONB NOT NULL,
    synced_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    sync_batch_id UUID NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_raw_timesheet_codes_st_id
    ON raw.st_timesheet_codes (st_id);
CREATE INDEX IF NOT EXISTS idx_raw_timesheet_codes_synced
    ON raw.st_timesheet_codes (synced_at DESC);
CREATE INDEX IF NOT EXISTS idx_raw_timesheet_codes_batch
    ON raw.st_timesheet_codes (sync_batch_id);

-- ===========================================
-- TRANSFERS
-- ===========================================

-- transfers
-- Sample: 0 records, 0 total fields
-- ID field: none detected
-- Timestamps: none
-- Relationships: none
CREATE TABLE IF NOT EXISTS raw.st_transfers (
    id BIGSERIAL PRIMARY KEY,
    payload JSONB NOT NULL,
    synced_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    sync_batch_id UUID NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_raw_transfers_synced
    ON raw.st_transfers (synced_at DESC);
CREATE INDEX IF NOT EXISTS idx_raw_transfers_batch
    ON raw.st_transfers (sync_batch_id);

-- ===========================================
-- TRUCKS
-- ===========================================

-- trucks
-- Sample: 12 records, 9 total fields
-- ID field: id
-- Timestamps: createdOn, modifiedOn
-- Relationships: warehouseId
CREATE TABLE IF NOT EXISTS raw.st_trucks (
    id BIGSERIAL PRIMARY KEY,
    st_id BIGINT GENERATED ALWAYS AS ((payload->>'id')::bigint) STORED,
    payload JSONB NOT NULL,
    synced_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    sync_batch_id UUID NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_raw_trucks_st_id
    ON raw.st_trucks (st_id);
CREATE INDEX IF NOT EXISTS idx_raw_trucks_synced
    ON raw.st_trucks (synced_at DESC);
CREATE INDEX IF NOT EXISTS idx_raw_trucks_batch
    ON raw.st_trucks (sync_batch_id);

-- ===========================================
-- USER
-- ===========================================

-- user_roles
-- Sample: 20 records, 5 total fields
-- ID field: id
-- Timestamps: createdOn
-- Relationships: none
CREATE TABLE IF NOT EXISTS raw.st_user_roles (
    id BIGSERIAL PRIMARY KEY,
    st_id BIGINT GENERATED ALWAYS AS ((payload->>'id')::bigint) STORED,
    payload JSONB NOT NULL,
    synced_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    sync_batch_id UUID NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_raw_user_roles_st_id
    ON raw.st_user_roles (st_id);
CREATE INDEX IF NOT EXISTS idx_raw_user_roles_synced
    ON raw.st_user_roles (synced_at DESC);
CREATE INDEX IF NOT EXISTS idx_raw_user_roles_batch
    ON raw.st_user_roles (sync_batch_id);

-- ===========================================
-- VENDORS
-- ===========================================

-- vendors
-- Sample: 43 records, 24 total fields
-- ID field: id
-- Timestamps: createdOn, modifiedOn
-- Relationships: none
CREATE TABLE IF NOT EXISTS raw.st_vendors (
    id BIGSERIAL PRIMARY KEY,
    st_id BIGINT GENERATED ALWAYS AS ((payload->>'id')::bigint) STORED,
    payload JSONB NOT NULL,
    synced_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    sync_batch_id UUID NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_raw_vendors_st_id
    ON raw.st_vendors (st_id);
CREATE INDEX IF NOT EXISTS idx_raw_vendors_synced
    ON raw.st_vendors (synced_at DESC);
CREATE INDEX IF NOT EXISTS idx_raw_vendors_batch
    ON raw.st_vendors (sync_batch_id);

-- ===========================================
-- WAREHOUSES
-- ===========================================

-- warehouses
-- Sample: 1 records, 13 total fields
-- ID field: id
-- Timestamps: createdOn, modifiedOn
-- Relationships: none
CREATE TABLE IF NOT EXISTS raw.st_warehouses (
    id BIGSERIAL PRIMARY KEY,
    st_id BIGINT GENERATED ALWAYS AS ((payload->>'id')::bigint) STORED,
    payload JSONB NOT NULL,
    synced_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    sync_batch_id UUID NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_raw_warehouses_st_id
    ON raw.st_warehouses (st_id);
CREATE INDEX IF NOT EXISTS idx_raw_warehouses_synced
    ON raw.st_warehouses (synced_at DESC);
CREATE INDEX IF NOT EXISTS idx_raw_warehouses_batch
    ON raw.st_warehouses (sync_batch_id);

-- ===========================================
-- ZONES
-- ===========================================

-- zones
-- Sample: 12 records, 14 total fields
-- ID field: id
-- Timestamps: createdBy, createdOn, modifiedOn
-- Relationships: none
CREATE TABLE IF NOT EXISTS raw.st_zones (
    id BIGSERIAL PRIMARY KEY,
    st_id BIGINT GENERATED ALWAYS AS ((payload->>'id')::bigint) STORED,
    payload JSONB NOT NULL,
    synced_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    sync_batch_id UUID NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_raw_zones_st_id
    ON raw.st_zones (st_id);
CREATE INDEX IF NOT EXISTS idx_raw_zones_synced
    ON raw.st_zones (synced_at DESC);
CREATE INDEX IF NOT EXISTS idx_raw_zones_batch
    ON raw.st_zones (sync_batch_id);

-- ===========================================
-- PROTECTION TRIGGERS
-- ===========================================

-- Function to prevent modifications
CREATE OR REPLACE FUNCTION raw.prevent_modification()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'Raw tables are immutable. % operations not allowed on %.%',
        TG_OP, TG_TABLE_SCHEMA, TG_TABLE_NAME
    USING HINT = 'Raw tables only accept INSERTs from the sync worker';
END;
$$ LANGUAGE plpgsql;

-- Apply protection to all raw tables
DO $$
DECLARE
    tbl TEXT;
BEGIN
    FOR tbl IN SELECT tablename FROM pg_tables WHERE schemaname = 'raw'
    LOOP
        EXECUTE format('
            DROP TRIGGER IF EXISTS protect_%I ON raw.%I;
            CREATE TRIGGER protect_%I
                BEFORE UPDATE OR DELETE ON raw.%I
                FOR EACH ROW EXECUTE FUNCTION raw.prevent_modification();
        ', tbl, tbl, tbl, tbl);
    END LOOP;
END $$;
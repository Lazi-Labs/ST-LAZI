-- ===========================================
-- MASTER TABLES (Auto-generated from ST API discovery)
-- Generated: 2026-01-21T14:16:43.057Z
-- ===========================================

-- These tables contain typed, cleaned data extracted from raw
-- REVIEW CAREFULLY before running - adjust types as needed
-- This is a starting point, not a final schema

-- ===========================================
-- ACTIVITY_CODES
-- ===========================================
-- Source: 9 sample records
-- Fields: 6 top-level (7 total including nested)

CREATE TABLE IF NOT EXISTS master.activity_codes (
    id BIGSERIAL PRIMARY KEY,
    st_id BIGINT NOT NULL UNIQUE,

    active BOOLEAN,  -- Samples: true
    code TEXT,  -- Samples: "OT-ST", "HR-ST", "BON-ST"
    created_on TIMESTAMPTZ,  -- Samples: "2024-05-25T04:32:55.3766054Z", "2024-06-09T02:16:16.4223851...
    earning_category TEXT,  -- Samples: "Timesheet", "Commission", "Reimbursement"
    modified_on TIMESTAMPTZ,  -- Samples: "2024-06-09T02:17:23.7697481Z", "2024-06-09T02:16:16.4223851...
    name TEXT,  -- Samples: "Overtime", "Hourly Standard", "BONUS"

    -- Sync tracking
    synced_at TIMESTAMPTZ NOT NULL,
    sync_batch_id UUID NOT NULL,
    payload_hash TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_master_activity_codes_st_id
    ON master.activity_codes (st_id);
CREATE INDEX IF NOT EXISTS idx_master_activity_codes_active
    ON master.activity_codes (active);
CREATE INDEX IF NOT EXISTS idx_master_activity_codes_synced
    ON master.activity_codes (synced_at DESC);

-- ===========================================
-- ADJUSTMENTS
-- ===========================================
-- Source: 0 sample records
-- Fields: 0 top-level (0 total including nested)

CREATE TABLE IF NOT EXISTS master.adjustments (
    id BIGSERIAL PRIMARY KEY,


    -- Sync tracking
    synced_at TIMESTAMPTZ NOT NULL,
    sync_batch_id UUID NOT NULL,
    payload_hash TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_master_adjustments_synced
    ON master.adjustments (synced_at DESC);

-- ===========================================
-- AP_BILLS
-- ===========================================
-- Source: 100 sample records
-- Fields: 36 top-level (87 total including nested)

CREATE TABLE IF NOT EXISTS master.ap_bills (
    id BIGSERIAL PRIMARY KEY,
    st_id BIGINT NOT NULL UNIQUE,

    batch JSONB,
    bill_amount TEXT,  -- Samples: "3508.13", "1151.16", "7.04"
    bill_date TIMESTAMPTZ,  -- Samples: "2025-11-03T00:00:00Z", "2025-11-02T00:00:00Z", "2025-10-22T...
    bill_type TEXT,  -- Samples: "Procurement"
    budget_code_id TEXT,
    business_unit JSONB,
    canceled_by TEXT,
    created_by TEXT,  -- Samples: "Yanni Ramos", "Corey Braten"
    created_on TIMESTAMPTZ,  -- Samples: "2025-11-04T01:33:18.076235Z", "2025-11-03T02:53:13.860159Z"...
    custom_fields TEXT,
    date_canceled TEXT,
    do_not_pay BOOLEAN,  -- Samples: false
    due_date TIMESTAMPTZ,  -- Samples: "2025-12-03T00:00:00Z", "2025-12-02T00:00:00Z", "2025-11-21T...
    early_discount_date TEXT,
    expense_items JSONB,
    items JSONB,
    job_id INT,  -- Samples: 61639944, 61075990, 60621958
    job_number TEXT,  -- Samples: "61639944", "61075990", "60621958"
    modified_on TIMESTAMPTZ,  -- Samples: "2025-11-04T01:34:47.0238761Z", "2025-11-03T22:32:31.9637691...
    post_date TIMESTAMPTZ,  -- Samples: "2025-11-03T00:00:00Z", "2025-11-02T00:00:00Z", "2025-10-22T...
    purchase_order_id INT,  -- Samples: 61656863, 61616390, 61161735
    reference_number TEXT,
    remittance_vendor_info JSONB,
    shipping_amount TEXT,  -- Samples: "0.00", "1.67", "99.00"
    ship_to JSONB,
    ship_to_description TEXT,  -- Samples: "Scott Tran ", "Shop", "Vendor Counter Pickup"
    source TEXT,  -- Samples: "Purchasing"
    status TEXT,  -- Samples: "Unreconciled", "Reconciled"
    summary TEXT,
    sync_status TEXT,  -- Samples: "Pending", "Posted", "Exported"
    tax_amount TEXT,  -- Samples: "229.50", "75.31", "0.46"
    tax_zone TEXT,
    term_name TEXT,  -- Samples: "NET30", "Due Upon Receipt", "Delete"
    vendor JSONB,
    vendor_invoice_total TEXT,
    vendor_number TEXT,  -- Samples: "55965069", "55006974", "H6364-446604"

    -- Sync tracking
    synced_at TIMESTAMPTZ NOT NULL,
    sync_batch_id UUID NOT NULL,
    payload_hash TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_master_ap_bills_st_id
    ON master.ap_bills (st_id);
CREATE INDEX IF NOT EXISTS idx_master_ap_bills_budget_code_id
    ON master.ap_bills (budget_code_id);
CREATE INDEX IF NOT EXISTS idx_master_ap_bills_job_id
    ON master.ap_bills (job_id);
CREATE INDEX IF NOT EXISTS idx_master_ap_bills_purchase_order_id
    ON master.ap_bills (purchase_order_id);
CREATE INDEX IF NOT EXISTS idx_master_ap_bills_status
    ON master.ap_bills (status);
CREATE INDEX IF NOT EXISTS idx_master_ap_bills_synced
    ON master.ap_bills (synced_at DESC);

-- ===========================================
-- AP_CREDITS
-- ===========================================
-- Source: 0 sample records
-- Fields: 0 top-level (0 total including nested)

CREATE TABLE IF NOT EXISTS master.ap_credits (
    id BIGSERIAL PRIMARY KEY,


    -- Sync tracking
    synced_at TIMESTAMPTZ NOT NULL,
    sync_batch_id UUID NOT NULL,
    payload_hash TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_master_ap_credits_synced
    ON master.ap_credits (synced_at DESC);

-- ===========================================
-- AP_PAYMENTS
-- ===========================================
-- Source: 0 sample records
-- Fields: 0 top-level (0 total including nested)

CREATE TABLE IF NOT EXISTS master.ap_payments (
    id BIGSERIAL PRIMARY KEY,


    -- Sync tracking
    synced_at TIMESTAMPTZ NOT NULL,
    sync_batch_id UUID NOT NULL,
    payload_hash TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_master_ap_payments_synced
    ON master.ap_payments (synced_at DESC);

-- ===========================================
-- APPOINTMENT_ASSIGNMENTS
-- ===========================================
-- Source: 100 sample records
-- Fields: 11 top-level (12 total including nested)

CREATE TABLE IF NOT EXISTS master.appointment_assignments (
    id BIGSERIAL PRIMARY KEY,
    st_id BIGINT NOT NULL UNIQUE,

    active BOOLEAN,  -- Samples: true
    appointment_id INT,  -- Samples: 70637, 70962, 1462359
    assigned_by_id INT,  -- Samples: 26, 4617, 0
    assigned_on TIMESTAMPTZ,  -- Samples: "2024-07-08T15:13:32.9037569Z", "2024-07-08T18:09:08.1753799...
    created_on TIMESTAMPTZ,  -- Samples: "2024-07-08T15:13:32.9037569Z", "2024-07-08T18:09:08.1753799...
    is_paused BOOLEAN,  -- Samples: false
    job_id INT,  -- Samples: 70636, 70961, 1187722
    modified_on TIMESTAMPTZ,  -- Samples: "2024-07-08T15:13:32.9037569Z", "2024-07-09T21:55:54.4721284...
    status TEXT,  -- Samples: "Scheduled", "Done"
    technician_id INT,  -- Samples: 12417, 1190549, 1190553
    technician_name TEXT,  -- Samples: "Jade Schweiberger", "Marcus Avouris", "Tristan Tasker"

    -- Sync tracking
    synced_at TIMESTAMPTZ NOT NULL,
    sync_batch_id UUID NOT NULL,
    payload_hash TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_master_appointment_assignments_st_id
    ON master.appointment_assignments (st_id);
CREATE INDEX IF NOT EXISTS idx_master_appointment_assignments_appointment_id
    ON master.appointment_assignments (appointment_id);
CREATE INDEX IF NOT EXISTS idx_master_appointment_assignments_assigned_by_id
    ON master.appointment_assignments (assigned_by_id);
CREATE INDEX IF NOT EXISTS idx_master_appointment_assignments_job_id
    ON master.appointment_assignments (job_id);
CREATE INDEX IF NOT EXISTS idx_master_appointment_assignments_technician_id
    ON master.appointment_assignments (technician_id);
CREATE INDEX IF NOT EXISTS idx_master_appointment_assignments_status
    ON master.appointment_assignments (status);
CREATE INDEX IF NOT EXISTS idx_master_appointment_assignments_active
    ON master.appointment_assignments (active);
CREATE INDEX IF NOT EXISTS idx_master_appointment_assignments_synced
    ON master.appointment_assignments (synced_at DESC);

-- ===========================================
-- APPOINTMENTS
-- ===========================================
-- Source: 100 sample records
-- Fields: 15 top-level (16 total including nested)

CREATE TABLE IF NOT EXISTS master.appointments (
    id BIGSERIAL PRIMARY KEY,
    st_id BIGINT NOT NULL UNIQUE,

    active BOOLEAN,  -- Samples: true
    appointment_number TEXT,  -- Samples: "70636-1", "70961-1", "1044667923-1"
    arrival_window_end TIMESTAMPTZ,  -- Samples: "2024-07-09T18:00:00Z", "2024-07-09T14:00:00Z", "2024-06-08T...
    arrival_window_start TIMESTAMPTZ,  -- Samples: "2024-07-09T16:00:00Z", "2024-07-09T12:00:00Z", "2024-06-08T...
    created_by_id INT,  -- Samples: 26, 4617, 0
    created_on TIMESTAMPTZ,  -- Samples: "2024-07-08T15:13:31.9394887Z", "2024-07-08T18:09:07.1301534...
    customer_id INT,  -- Samples: 2023488, 1184649, 1184652
    end TIMESTAMPTZ,  -- Samples: "2024-07-09T18:00:00Z", "2024-07-09T15:00:00Z", "2024-06-08T...
    is_confirmed BOOLEAN,  -- Samples: false, true
    job_id INT,  -- Samples: 70636, 70961, 1187722
    modified_on TIMESTAMPTZ,  -- Samples: "2024-07-08T15:19:49.5914574Z", "2024-07-09T21:55:54.6182179...
    special_instructions TEXT,  -- Samples: ""
    start TIMESTAMPTZ,  -- Samples: "2024-07-09T16:00:00Z", "2024-07-09T13:00:00Z", "2024-06-08T...
    status TEXT,  -- Samples: "Canceled", "Done"
    unused BOOLEAN,  -- Samples: false

    -- Sync tracking
    synced_at TIMESTAMPTZ NOT NULL,
    sync_batch_id UUID NOT NULL,
    payload_hash TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_master_appointments_st_id
    ON master.appointments (st_id);
CREATE INDEX IF NOT EXISTS idx_master_appointments_created_by_id
    ON master.appointments (created_by_id);
CREATE INDEX IF NOT EXISTS idx_master_appointments_customer_id
    ON master.appointments (customer_id);
CREATE INDEX IF NOT EXISTS idx_master_appointments_job_id
    ON master.appointments (job_id);
CREATE INDEX IF NOT EXISTS idx_master_appointments_status
    ON master.appointments (status);
CREATE INDEX IF NOT EXISTS idx_master_appointments_active
    ON master.appointments (active);
CREATE INDEX IF NOT EXISTS idx_master_appointments_synced
    ON master.appointments (synced_at DESC);

-- ===========================================
-- ARRIVAL_WINDOWS
-- ===========================================
-- Source: 5 sample records
-- Fields: 4 top-level (5 total including nested)

CREATE TABLE IF NOT EXISTS master.arrival_windows (
    id BIGSERIAL PRIMARY KEY,
    st_id BIGINT NOT NULL UNIQUE,

    active BOOLEAN,  -- Samples: true
    business_unit_ids JSONB,
    duration TEXT,  -- Samples: "02:00:00"
    start TEXT,  -- Samples: "13:00:00", "08:00:00", "11:00:00"

    -- Sync tracking
    synced_at TIMESTAMPTZ NOT NULL,
    sync_batch_id UUID NOT NULL,
    payload_hash TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_master_arrival_windows_st_id
    ON master.arrival_windows (st_id);
CREATE INDEX IF NOT EXISTS idx_master_arrival_windows_active
    ON master.arrival_windows (active);
CREATE INDEX IF NOT EXISTS idx_master_arrival_windows_synced
    ON master.arrival_windows (synced_at DESC);

-- ===========================================
-- BUSINESS_HOURS
-- ===========================================
-- Source: 1 sample records
-- Fields: 3 top-level (7 total including nested)

CREATE TABLE IF NOT EXISTS master.business_hours (
    id BIGSERIAL PRIMARY KEY,

    saturday JSONB,
    sunday JSONB,
    weekdays JSONB,

    -- Sync tracking
    synced_at TIMESTAMPTZ NOT NULL,
    sync_batch_id UUID NOT NULL,
    payload_hash TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_master_business_hours_synced
    ON master.business_hours (synced_at DESC);

-- ===========================================
-- BUSINESS_UNITS
-- ===========================================
-- Source: 4 sample records
-- Fields: 25 top-level (46 total including nested)

CREATE TABLE IF NOT EXISTS master.business_units (
    id BIGSERIAL PRIMARY KEY,
    st_id BIGINT NOT NULL UNIQUE,

    account_code TEXT,
    acknowledgement_paragraph TEXT,  -- Samples: "Parties to this Agreement\n\nI acknowledge that the work de...
    active BOOLEAN,  -- Samples: true
    address JSONB,
    authorization_paragraph TEXT,  -- Samples: "{CustomerName} you are authorizing  {Total}: and will be in...
    concept_code TEXT,  -- Samples: "NotSet"
    corporate_contract_number TEXT,
    created_on TIMESTAMPTZ,  -- Samples: "2024-05-21T21:05:44.004099Z", "2024-05-22T00:46:06.0778687Z...
    currency TEXT,  -- Samples: "USD"
    default_tax_rate INT,  -- Samples: 0
    division JSONB,
    email TEXT,  -- Samples: "office@callperfectcatch.com"
    external_data TEXT,
    franchise_id TEXT,
    invoice_header TEXT,  -- Samples: "Perfect Catch\n13932 Walsingham Road\nLargo, FL, 33774\n727...
    invoice_message TEXT,  -- Samples: "Thank you for choosing Perfect Catch"
    material_sku TEXT,
    modified_on TIMESTAMPTZ,  -- Samples: "2026-01-21T12:03:58.8267889Z", "2026-01-21T12:03:58.8268215...
    name TEXT,  -- Samples: "Electrical - Install", "Pool - Install", "Pool - Service"
    official_name TEXT,  -- Samples: "Perfect Catch Electric", "Perfect Catch Pools"
    phone_number TEXT,  -- Samples: "7273165206", "(727) 316-5206"
    quickbooks_class TEXT,  -- Samples: "Electrical - Install", "Pool - Install", "Pool - Service"
    tag_type_ids JSONB,
    tenant JSONB,
    trade JSONB,

    -- Sync tracking
    synced_at TIMESTAMPTZ NOT NULL,
    sync_batch_id UUID NOT NULL,
    payload_hash TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_master_business_units_st_id
    ON master.business_units (st_id);
CREATE INDEX IF NOT EXISTS idx_master_business_units_franchise_id
    ON master.business_units (franchise_id);
CREATE INDEX IF NOT EXISTS idx_master_business_units_active
    ON master.business_units (active);
CREATE INDEX IF NOT EXISTS idx_master_business_units_synced
    ON master.business_units (synced_at DESC);

-- ===========================================
-- CALL_REASONS
-- ===========================================
-- Source: 18 sample records
-- Fields: 5 top-level (6 total including nested)

CREATE TABLE IF NOT EXISTS master.call_reasons (
    id BIGSERIAL PRIMARY KEY,
    st_id BIGINT NOT NULL UNIQUE,

    active BOOLEAN,  -- Samples: true
    created_on TIMESTAMPTZ,  -- Samples: "2024-05-21T21:05:27.5419048Z", "2024-05-21T21:05:27.5608972...
    is_lead BOOLEAN,  -- Samples: false, true
    modified_on TIMESTAMPTZ,  -- Samples: "2025-08-14T12:50:53.8891828Z", "2025-08-14T12:55:43.3423236...
    name TEXT,  -- Samples: "Cancel Appt", "ZZZZZZZZPrice over the phone", "ZZZZZZZDidn'...

    -- Sync tracking
    synced_at TIMESTAMPTZ NOT NULL,
    sync_batch_id UUID NOT NULL,
    payload_hash TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_master_call_reasons_st_id
    ON master.call_reasons (st_id);
CREATE INDEX IF NOT EXISTS idx_master_call_reasons_active
    ON master.call_reasons (active);
CREATE INDEX IF NOT EXISTS idx_master_call_reasons_synced
    ON master.call_reasons (synced_at DESC);

-- ===========================================
-- CALLS
-- ===========================================
-- Source: 100 sample records
-- Fields: 5 top-level (43 total including nested)

CREATE TABLE IF NOT EXISTS master.calls (
    id BIGSERIAL PRIMARY KEY,
    st_id BIGINT NOT NULL UNIQUE,

    business_unit JSONB,
    job_number TEXT,  -- Samples: "7873788", "52993287", "53025037"
    lead_call JSONB,
    project_id INT,  -- Samples: 0, 7872290, 53025056
    type JSONB,

    -- Sync tracking
    synced_at TIMESTAMPTZ NOT NULL,
    sync_batch_id UUID NOT NULL,
    payload_hash TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_master_calls_st_id
    ON master.calls (st_id);
CREATE INDEX IF NOT EXISTS idx_master_calls_project_id
    ON master.calls (project_id);
CREATE INDEX IF NOT EXISTS idx_master_calls_type
    ON master.calls (type);
CREATE INDEX IF NOT EXISTS idx_master_calls_synced
    ON master.calls (synced_at DESC);

-- ===========================================
-- CAMPAIGN_CATEGORIES
-- ===========================================
-- Source: 4 sample records
-- Fields: 5 top-level (6 total including nested)

CREATE TABLE IF NOT EXISTS master.campaign_categories (
    id BIGSERIAL PRIMARY KEY,
    st_id BIGINT NOT NULL UNIQUE,

    active BOOLEAN,  -- Samples: true
    created_on TIMESTAMPTZ,  -- Samples: "2025-10-19T02:07:20.4755157Z", "2025-10-19T02:07:40.331208Z...
    modified_on TIMESTAMPTZ,  -- Samples: "2025-10-19T02:07:20.4755157Z", "2025-10-19T02:07:40.331208Z...
    name TEXT,  -- Samples: "Offline & Brand Channels", "Automation & Conversion Sources...
    type TEXT,  -- Samples: "Regular"

    -- Sync tracking
    synced_at TIMESTAMPTZ NOT NULL,
    sync_batch_id UUID NOT NULL,
    payload_hash TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_master_campaign_categories_st_id
    ON master.campaign_categories (st_id);
CREATE INDEX IF NOT EXISTS idx_master_campaign_categories_type
    ON master.campaign_categories (type);
CREATE INDEX IF NOT EXISTS idx_master_campaign_categories_active
    ON master.campaign_categories (active);
CREATE INDEX IF NOT EXISTS idx_master_campaign_categories_synced
    ON master.campaign_categories (synced_at DESC);

-- ===========================================
-- CAMPAIGNS
-- ===========================================
-- Source: 12 sample records
-- Fields: 12 top-level (16 total including nested)

CREATE TABLE IF NOT EXISTS master.campaigns (
    id BIGSERIAL PRIMARY KEY,
    st_id BIGINT NOT NULL UNIQUE,

    active BOOLEAN,  -- Samples: true
    business_unit TEXT,
    campaign_phone_numbers JSONB,
    category JSONB,
    created_on TIMESTAMPTZ,  -- Samples: "2024-05-21T21:05:49.8969244Z", "2024-05-21T21:05:50.8770921...
    is_default_campaign BOOLEAN,  -- Samples: false
    medium TEXT,  -- Samples: "GMB", "CPC"
    modified_on TIMESTAMPTZ,  -- Samples: "2025-10-19T02:12:28.5990741Z", "2025-10-19T02:16:21.3914257...
    name TEXT,  -- Samples: "Google Local Service Adds", "Existing Customer", "PPC "
    other_medium TEXT,
    other_source TEXT,
    source TEXT,  -- Samples: "Google", "Yelp", "Event"

    -- Sync tracking
    synced_at TIMESTAMPTZ NOT NULL,
    sync_batch_id UUID NOT NULL,
    payload_hash TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_master_campaigns_st_id
    ON master.campaigns (st_id);
CREATE INDEX IF NOT EXISTS idx_master_campaigns_active
    ON master.campaigns (active);
CREATE INDEX IF NOT EXISTS idx_master_campaigns_synced
    ON master.campaigns (synced_at DESC);

-- ===========================================
-- CUSTOMERS
-- ===========================================
-- Source: 100 sample records
-- Fields: 19 top-level (28 total including nested)

CREATE TABLE IF NOT EXISTS master.customers (
    id BIGSERIAL PRIMARY KEY,
    st_id BIGINT NOT NULL UNIQUE,

    active BOOLEAN,  -- Samples: true
    address JSONB,
    balance INT,  -- Samples: 0, 2140
    created_by_id INT,  -- Samples: 4617, 0
    created_on TIMESTAMPTZ,  -- Samples: "2024-07-08T17:41:53.3162722Z", "0001-01-01T00:00:00Z"
    credit_limit TEXT,
    credit_limit_balance TEXT,
    custom_fields JSONB,
    do_not_mail BOOLEAN,  -- Samples: false
    do_not_service BOOLEAN,  -- Samples: false
    external_data TEXT,
    merged_to_id TEXT,
    modified_on TIMESTAMPTZ,  -- Samples: "2024-07-08T17:41:53.450599Z", "2024-07-08T14:46:51.03Z", "2...
    name TEXT,  -- Samples: "Maureen Boucher", "Carter improvements", ". Bonnstetter"
    national_account BOOLEAN,  -- Samples: false
    payment_term_id INT,  -- Samples: 55298, 153
    tag_type_ids JSONB,
    tax_exempt BOOLEAN,  -- Samples: false
    type TEXT,  -- Samples: "Residential"

    -- Sync tracking
    synced_at TIMESTAMPTZ NOT NULL,
    sync_batch_id UUID NOT NULL,
    payload_hash TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_master_customers_st_id
    ON master.customers (st_id);
CREATE INDEX IF NOT EXISTS idx_master_customers_created_by_id
    ON master.customers (created_by_id);
CREATE INDEX IF NOT EXISTS idx_master_customers_merged_to_id
    ON master.customers (merged_to_id);
CREATE INDEX IF NOT EXISTS idx_master_customers_payment_term_id
    ON master.customers (payment_term_id);
CREATE INDEX IF NOT EXISTS idx_master_customers_type
    ON master.customers (type);
CREATE INDEX IF NOT EXISTS idx_master_customers_active
    ON master.customers (active);
CREATE INDEX IF NOT EXISTS idx_master_customers_synced
    ON master.customers (synced_at DESC);

-- ===========================================
-- EMPLOYEES
-- ===========================================
-- Source: 4 sample records
-- Fields: 15 top-level (18 total including nested)

CREATE TABLE IF NOT EXISTS master.employees (
    id BIGSERIAL PRIMARY KEY,
    st_id BIGINT NOT NULL UNIQUE,

    aad_user_id TEXT,
    account_locked BOOLEAN,  -- Samples: false
    active BOOLEAN,  -- Samples: true
    business_unit_id TEXT,
    created_on TIMESTAMPTZ,  -- Samples: "2024-05-21T21:05:19.1328242Z", "2024-05-21T21:05:24.8818369...
    custom_fields JSONB,
    email TEXT,  -- Samples: "yanni@callperfectcatch.com", "vendela@callperfectcatch.com"...
    login_name TEXT,  -- Samples: "yrdevelopmentgroup1llc", "yannir2024", "vendelaconley"
    modified_on TIMESTAMPTZ,  -- Samples: "2025-11-12T06:24:22.2731382Z", "2025-11-12T06:24:20.1970255...
    name TEXT,  -- Samples: "yrdevelopmentgroup1llc", "Yanni Ramos", "Vendela Conley"
    permissions JSONB,
    phone_number TEXT,  -- Samples: "7274304710", "7276000107"
    role TEXT,  -- Samples: "Owner", "Admin"
    role_ids JSONB,
    user_id INT,  -- Samples: 23, 26, 4609

    -- Sync tracking
    synced_at TIMESTAMPTZ NOT NULL,
    sync_batch_id UUID NOT NULL,
    payload_hash TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_master_employees_st_id
    ON master.employees (st_id);
CREATE INDEX IF NOT EXISTS idx_master_employees_aad_user_id
    ON master.employees (aad_user_id);
CREATE INDEX IF NOT EXISTS idx_master_employees_business_unit_id
    ON master.employees (business_unit_id);
CREATE INDEX IF NOT EXISTS idx_master_employees_user_id
    ON master.employees (user_id);
CREATE INDEX IF NOT EXISTS idx_master_employees_active
    ON master.employees (active);
CREATE INDEX IF NOT EXISTS idx_master_employees_synced
    ON master.employees (synced_at DESC);

-- ===========================================
-- ESTIMATE_ITEMS
-- ===========================================
-- Source: 100 sample records
-- Fields: 16 top-level (25 total including nested)

CREATE TABLE IF NOT EXISTS master.estimate_items (
    id BIGSERIAL PRIMARY KEY,
    st_id BIGINT NOT NULL UNIQUE,

    budget_code_id TEXT,
    chargeable BOOLEAN,  -- Samples: false
    created_on TIMESTAMPTZ,  -- Samples: "2024-07-08T18:32:41.087Z", "2024-07-08T18:32:41.088Z", "202...
    description TEXT,  -- Samples: "Intermatic Panel - 300W Transformer & Timer Mech<br/><ul><l...
    invoice_item_id TEXT,
    item_group_name TEXT,
    item_group_root_id TEXT,
    membership_type_id TEXT,
    modified_on TIMESTAMPTZ,  -- Samples: "2024-07-08T18:32:41.087Z", "2024-07-08T18:32:41.088Z", "202...
    qty INT,  -- Samples: 1, 7, 10
    sku JSONB,
    sku_account TEXT,  -- Samples: "Services income", "INCOME-Sales"
    total INT,  -- Samples: 825, 600, 175
    total_cost DECIMAL(12,2),  -- Samples: 0, 244, 0.59
    unit_cost DECIMAL(12,2),  -- Samples: 0, 244, 0.59
    unit_rate INT,  -- Samples: 825, 600, 175

    -- Sync tracking
    synced_at TIMESTAMPTZ NOT NULL,
    sync_batch_id UUID NOT NULL,
    payload_hash TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_master_estimate_items_st_id
    ON master.estimate_items (st_id);
CREATE INDEX IF NOT EXISTS idx_master_estimate_items_budget_code_id
    ON master.estimate_items (budget_code_id);
CREATE INDEX IF NOT EXISTS idx_master_estimate_items_invoice_item_id
    ON master.estimate_items (invoice_item_id);
CREATE INDEX IF NOT EXISTS idx_master_estimate_items_item_group_root_id
    ON master.estimate_items (item_group_root_id);
CREATE INDEX IF NOT EXISTS idx_master_estimate_items_membership_type_id
    ON master.estimate_items (membership_type_id);
CREATE INDEX IF NOT EXISTS idx_master_estimate_items_synced
    ON master.estimate_items (synced_at DESC);

-- ===========================================
-- ESTIMATES
-- ===========================================
-- Source: 100 sample records
-- Fields: 24 top-level (52 total including nested)

CREATE TABLE IF NOT EXISTS master.estimates (
    id BIGSERIAL PRIMARY KEY,
    st_id BIGINT NOT NULL UNIQUE,

    active BOOLEAN,  -- Samples: true
    budget_code_id TEXT,
    business_unit_id INT,  -- Samples: 1314, 4622, 1310
    business_unit_name TEXT,  -- Samples: "Electrical - Sales", "Pool - Sales", "Electric-Sales"
    created_on TIMESTAMPTZ,  -- Samples: "2024-07-08T18:39:27.605Z", "2024-07-08T18:51:36.632Z", "202...
    customer_id INT,  -- Samples: 1185115, 5911620, 2024188
    external_links JSONB,
    is_change_order BOOLEAN,  -- Samples: false
    is_recommended BOOLEAN,  -- Samples: false, true
    items JSONB,
    job_id INT,  -- Samples: 2023553, 2028108, 5912465
    job_number TEXT,  -- Samples: "2023553", "", "2028108"
    location_id INT,  -- Samples: 1185965, 5911625, 2024193
    modified_on TIMESTAMPTZ,  -- Samples: "2025-04-29T04:16:29.3684558Z", "2025-04-29T04:16:29.3684579...
    name TEXT,  -- Samples: "Pool equipment\n", "Automation - Gas Heater & Blower", "Hou...
    project_id INT,  -- Samples: 0, 52993834, 52967103
    proposal_tag_name TEXT,  -- Samples: "Pool Electrical", "Generator Power Inlet Box", "Essential"
    review_status TEXT,  -- Samples: "None"
    sold_by INT,  -- Samples: 4482, 12417, 26
    sold_on TIMESTAMPTZ,  -- Samples: "2024-07-08T18:50:06.4647755Z", "2024-07-08T18:55:53.1399525...
    status JSONB,
    subtotal INT,  -- Samples: 95, 0, 1105
    summary TEXT,  -- Samples: "", "Includes removal of existing light niche and re sealing...
    tax INT,  -- Samples: 0

    -- Sync tracking
    synced_at TIMESTAMPTZ NOT NULL,
    sync_batch_id UUID NOT NULL,
    payload_hash TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_master_estimates_st_id
    ON master.estimates (st_id);
CREATE INDEX IF NOT EXISTS idx_master_estimates_budget_code_id
    ON master.estimates (budget_code_id);
CREATE INDEX IF NOT EXISTS idx_master_estimates_business_unit_id
    ON master.estimates (business_unit_id);
CREATE INDEX IF NOT EXISTS idx_master_estimates_customer_id
    ON master.estimates (customer_id);
CREATE INDEX IF NOT EXISTS idx_master_estimates_job_id
    ON master.estimates (job_id);
CREATE INDEX IF NOT EXISTS idx_master_estimates_location_id
    ON master.estimates (location_id);
CREATE INDEX IF NOT EXISTS idx_master_estimates_project_id
    ON master.estimates (project_id);
CREATE INDEX IF NOT EXISTS idx_master_estimates_status
    ON master.estimates (status);
CREATE INDEX IF NOT EXISTS idx_master_estimates_active
    ON master.estimates (active);
CREATE INDEX IF NOT EXISTS idx_master_estimates_synced
    ON master.estimates (synced_at DESC);

-- ===========================================
-- FORMS
-- ===========================================
-- Source: 1 sample records
-- Fields: 8 top-level (9 total including nested)

CREATE TABLE IF NOT EXISTS master.forms (
    id BIGSERIAL PRIMARY KEY,
    st_id BIGINT NOT NULL UNIQUE,

    active BOOLEAN,  -- Samples: true
    created_by_id INT,  -- Samples: 0
    created_on TIMESTAMPTZ,  -- Samples: "2025-12-10T02:33:44.874428Z"
    has_conditional_logic BOOLEAN,  -- Samples: false
    has_triggers BOOLEAN,  -- Samples: false
    modified_on TIMESTAMPTZ,  -- Samples: "2025-12-14T23:08:28.216017Z"
    name TEXT,  -- Samples: "DAILY END-OF-DAY PROCEDURE"
    published BOOLEAN,  -- Samples: true

    -- Sync tracking
    synced_at TIMESTAMPTZ NOT NULL,
    sync_batch_id UUID NOT NULL,
    payload_hash TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_master_forms_st_id
    ON master.forms (st_id);
CREATE INDEX IF NOT EXISTS idx_master_forms_created_by_id
    ON master.forms (created_by_id);
CREATE INDEX IF NOT EXISTS idx_master_forms_active
    ON master.forms (active);
CREATE INDEX IF NOT EXISTS idx_master_forms_synced
    ON master.forms (synced_at DESC);

-- ===========================================
-- GL_ACCOUNTS
-- ===========================================
-- Source: 38 sample records
-- Fields: 12 top-level (13 total including nested)

CREATE TABLE IF NOT EXISTS master.gl_accounts (
    id BIGSERIAL PRIMARY KEY,
    st_id BIGINT NOT NULL UNIQUE,

    active BOOLEAN,  -- Samples: true
    created_on TIMESTAMPTZ,  -- Samples: "2024-05-21T21:05:27.6618041Z", "2024-05-21T21:05:27.7139228...
    default_account_type TEXT,  -- Samples: "CheckingAccount", "UndepositedFunds", "AccountsReceivable"
    description TEXT,  -- Samples: "Will be used as the primary account for all deposits.", "Wi...
    is_intacct_bank_account BOOLEAN,  -- Samples: false
    is_intacct_group BOOLEAN,  -- Samples: false
    modified_on TIMESTAMPTZ,  -- Samples: "2025-11-03T23:03:39.3429205Z", "2025-11-03T23:22:35.2550003...
    name TEXT,  -- Samples: "Operating Checking (9713)", "Undeposited Funds", "Accounts ...
    number TEXT,  -- Samples: "1000", "1200", "1100"
    source TEXT,  -- Samples: "Undefined", "ManuallyCreated"
    subtype TEXT,  -- Samples: "Bank", "Other Current Asset", "Accounts Receivable"
    type TEXT,  -- Samples: "Asset", "Liability", "Expense"

    -- Sync tracking
    synced_at TIMESTAMPTZ NOT NULL,
    sync_batch_id UUID NOT NULL,
    payload_hash TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_master_gl_accounts_st_id
    ON master.gl_accounts (st_id);
CREATE INDEX IF NOT EXISTS idx_master_gl_accounts_type
    ON master.gl_accounts (type);
CREATE INDEX IF NOT EXISTS idx_master_gl_accounts_active
    ON master.gl_accounts (active);
CREATE INDEX IF NOT EXISTS idx_master_gl_accounts_synced
    ON master.gl_accounts (synced_at DESC);

-- ===========================================
-- GROSS_PAY_ITEMS
-- ===========================================
-- Source: 100 sample records
-- Fields: 41 top-level (42 total including nested)

CREATE TABLE IF NOT EXISTS master.gross_pay_items (
    id BIGSERIAL PRIMARY KEY,
    st_id BIGINT NOT NULL UNIQUE,

    activity TEXT,  -- Samples: "Working", "Idle", "Driving"
    activity_code TEXT,  -- Samples: "HR-ST"
    activity_code_id INT,  -- Samples: 32647
    amount DECIMAL(12,2),  -- Samples: 13.53, 2.8, 3.73
    amount_adjustment INT,  -- Samples: 0
    budget_code_id TEXT,
    business_unit_name TEXT,  -- Samples: "Pool - Service", "Pool - Install", "Electrical - Install"
    created_on TIMESTAMPTZ,  -- Samples: "2024-07-08T18:39:45.0432157Z", "2024-07-08T19:11:16.3365671...
    customer_id INT,  -- Samples: 1185115, 1184966, 5911620
    customer_name TEXT,  -- Samples: "Yanni", "Pool Perfection", "La Costa Brava - Bob Morin"
    date TIMESTAMPTZ,  -- Samples: "2024-07-08T00:00:00Z", "2024-07-09T00:00:00Z", "2024-07-10T...
    employee_id INT,  -- Samples: 4482, 55810, 14721
    employee_payroll_id TEXT,  -- Samples: "HUNTER", "KURT", "RYAN"
    employee_type TEXT,  -- Samples: "Technician"
    ended_on TIMESTAMPTZ,  -- Samples: "2024-07-08T19:01:00Z", "2024-07-08T19:07:00Z", "2024-07-09T...
    gross_pay_item_type TEXT,  -- Samples: "TimesheetTime"
    invoice_id INT,  -- Samples: 2023556, 2024176, 2028111
    invoice_item_id TEXT,
    invoice_number TEXT,  -- Samples: "2023553", "2024173", "2028108"
    is_prevailing_wage_job BOOLEAN,  -- Samples: false, true
    job_id INT,  -- Samples: 2023553, 0, 2024173
    job_number TEXT,  -- Samples: "2023553", "2024173", "2028108"
    job_type_name TEXT,  -- Samples: "Estimate - Electrical Service", "Estimate - Pool Electrical...
    labor_type_code TEXT,  -- Samples: "LEAD-ELECTRICAN", "POOL-ELECTRICAN", "HELPER-LABOR"
    labor_type_id INT,  -- Samples: 71025, 2024208, 71024
    location_address TEXT,  -- Samples: "2128 Coronet Dr, Largo, FL 33770-4317 United States", "2385...
    location_id INT,  -- Samples: 1185965, 2023610, 5911625
    location_name TEXT,  -- Samples: "Yanni", "Shawn Markussen", "La Costa Brava - Bob Morin"
    location_zip TEXT,  -- Samples: "33770-4317", "33763", "33706"
    memo TEXT,  -- Samples: "Training"
    modified_on TIMESTAMPTZ,  -- Samples: "2024-07-20T04:29:33.366886Z", "2024-07-27T04:29:59.9849439Z...
    paid_duration_hours DECIMAL(12,2),  -- Samples: 0.483333, 0.1, 0.133333
    paid_time_type TEXT,  -- Samples: "Regular"
    payout_business_unit_name TEXT,  -- Samples: "Electrical - Sales", "Pool - Sales", "Pool - Service"
    payroll_id INT,  -- Samples: 2023360, 2027456, 2023368
    project_id INT,  -- Samples: 52967103, 7865802, 52967225
    project_number TEXT,  -- Samples: "52967103", "7865802", "52967225"
    source_entity_id INT,  -- Samples: 73739, 2028224, 5912116
    started_on TIMESTAMPTZ,  -- Samples: "2024-07-08T18:32:00Z", "2024-07-08T19:01:00Z", "2024-07-09T...
    tax_zone_name TEXT,
    zone_name TEXT,  -- Samples: "Sales zone 1 (Pinellas)", "Sales zone 2 (Pasco & Hills)"

    -- Sync tracking
    synced_at TIMESTAMPTZ NOT NULL,
    sync_batch_id UUID NOT NULL,
    payload_hash TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_master_gross_pay_items_st_id
    ON master.gross_pay_items (st_id);
CREATE INDEX IF NOT EXISTS idx_master_gross_pay_items_activity_code_id
    ON master.gross_pay_items (activity_code_id);
CREATE INDEX IF NOT EXISTS idx_master_gross_pay_items_budget_code_id
    ON master.gross_pay_items (budget_code_id);
CREATE INDEX IF NOT EXISTS idx_master_gross_pay_items_customer_id
    ON master.gross_pay_items (customer_id);
CREATE INDEX IF NOT EXISTS idx_master_gross_pay_items_employee_id
    ON master.gross_pay_items (employee_id);
CREATE INDEX IF NOT EXISTS idx_master_gross_pay_items_employee_payroll_id
    ON master.gross_pay_items (employee_payroll_id);
CREATE INDEX IF NOT EXISTS idx_master_gross_pay_items_invoice_id
    ON master.gross_pay_items (invoice_id);
CREATE INDEX IF NOT EXISTS idx_master_gross_pay_items_invoice_item_id
    ON master.gross_pay_items (invoice_item_id);
CREATE INDEX IF NOT EXISTS idx_master_gross_pay_items_job_id
    ON master.gross_pay_items (job_id);
CREATE INDEX IF NOT EXISTS idx_master_gross_pay_items_labor_type_id
    ON master.gross_pay_items (labor_type_id);
CREATE INDEX IF NOT EXISTS idx_master_gross_pay_items_location_id
    ON master.gross_pay_items (location_id);
CREATE INDEX IF NOT EXISTS idx_master_gross_pay_items_payroll_id
    ON master.gross_pay_items (payroll_id);
CREATE INDEX IF NOT EXISTS idx_master_gross_pay_items_project_id
    ON master.gross_pay_items (project_id);
CREATE INDEX IF NOT EXISTS idx_master_gross_pay_items_source_entity_id
    ON master.gross_pay_items (source_entity_id);
CREATE INDEX IF NOT EXISTS idx_master_gross_pay_items_synced
    ON master.gross_pay_items (synced_at DESC);

-- ===========================================
-- INSTALLED_EQUIPMENT
-- ===========================================
-- Source: 100 sample records
-- Fields: 25 top-level (36 total including nested)

CREATE TABLE IF NOT EXISTS master.installed_equipment (
    id BIGSERIAL PRIMARY KEY,
    st_id BIGINT NOT NULL UNIQUE,

    active BOOLEAN,  -- Samples: true
    actual_replacement_date TEXT,
    barcode_id TEXT,
    cost DECIMAL(12,2),  -- Samples: 0, 795.78, 268.99
    created_on TIMESTAMPTZ,  -- Samples: "2024-08-02T12:45:08.9925216Z", "2024-08-07T16:10:57.3936896...
    customer_id INT,  -- Samples: 53177479, 53207468, 53297974
    equipment_id INT,  -- Samples: 68866, 9474, 53295377
    installed_on TIMESTAMPTZ,  -- Samples: "2024-08-02T00:00:00Z", "2024-08-19T00:00:00Z", "2024-08-16T...
    invoice_item_id INT,  -- Samples: 53191451, 53233573, 53233578
    location_id INT,  -- Samples: 53177483, 53207473, 53297979
    manufacturer TEXT,  -- Samples: "Pentair", "Hayward", "Gulf Stream"
    manufacturer_warranty_end TIMESTAMPTZ,  -- Samples: "2027-08-02T00:00:00Z", "2027-08-19T00:00:00Z", "2027-09-10T...
    manufacturer_warranty_start TIMESTAMPTZ,  -- Samples: "2024-08-02T00:00:00Z", "2024-08-19T00:00:00Z", "2024-09-10T...
    memo TEXT,  -- Samples: "– OCR Data Capture –\n10014868 - 001\nCentury'\n*10014868-0...
    model TEXT,  -- Samples: "342002", "Color Logic", "HE125TA"
    modified_on TIMESTAMPTZ,  -- Samples: "2024-08-03T03:09:56.3505492Z", "2024-08-19T19:42:21.5960474...
    name TEXT,  -- Samples: "PAC-10-2002", "HAY-30-1013", "8\" Spa Light Replacement"
    predicted_replacement_date TIMESTAMPTZ,  -- Samples: "2027-08-02T00:00:00", "2034-08-19T00:00:00", "2027-09-20T00...
    predicted_replacement_months INT,  -- Samples: 36, 120
    serial_number TEXT,  -- Samples: "0332151240410h", "1u24025-108134", "1u24025-108135"
    service_provider_warranty_end TIMESTAMPTZ,  -- Samples: "2025-08-02T00:00:00Z", "2025-09-23T00:00:00Z", "2025-09-27T...
    service_provider_warranty_start TIMESTAMPTZ,  -- Samples: "2024-08-02T00:00:00Z", "2024-09-23T00:00:00Z", "2024-09-27T...
    status INT,  -- Samples: 0
    tags JSONB,
    type JSONB,

    -- Sync tracking
    synced_at TIMESTAMPTZ NOT NULL,
    sync_batch_id UUID NOT NULL,
    payload_hash TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_master_installed_equipment_st_id
    ON master.installed_equipment (st_id);
CREATE INDEX IF NOT EXISTS idx_master_installed_equipment_barcode_id
    ON master.installed_equipment (barcode_id);
CREATE INDEX IF NOT EXISTS idx_master_installed_equipment_customer_id
    ON master.installed_equipment (customer_id);
CREATE INDEX IF NOT EXISTS idx_master_installed_equipment_equipment_id
    ON master.installed_equipment (equipment_id);
CREATE INDEX IF NOT EXISTS idx_master_installed_equipment_invoice_item_id
    ON master.installed_equipment (invoice_item_id);
CREATE INDEX IF NOT EXISTS idx_master_installed_equipment_location_id
    ON master.installed_equipment (location_id);
CREATE INDEX IF NOT EXISTS idx_master_installed_equipment_status
    ON master.installed_equipment (status);
CREATE INDEX IF NOT EXISTS idx_master_installed_equipment_type
    ON master.installed_equipment (type);
CREATE INDEX IF NOT EXISTS idx_master_installed_equipment_active
    ON master.installed_equipment (active);
CREATE INDEX IF NOT EXISTS idx_master_installed_equipment_synced
    ON master.installed_equipment (synced_at DESC);

-- ===========================================
-- INVENTORY_BILLS
-- ===========================================
-- Source: 100 sample records
-- Fields: 26 top-level (71 total including nested)

CREATE TABLE IF NOT EXISTS master.inventory_bills (
    id BIGSERIAL PRIMARY KEY,
    st_id BIGINT NOT NULL UNIQUE,

    batch JSONB,
    bill_amount TEXT,  -- Samples: "3508.13", "1151.16", "7.04"
    bill_date TIMESTAMPTZ,  -- Samples: "2025-11-03T00:00:00Z", "2025-11-02T00:00:00Z", "2025-10-22T...
    budget_code_id TEXT,
    business_unit JSONB,
    created_by TEXT,  -- Samples: "Yanni Ramos", "Corey Braten"
    created_on TIMESTAMPTZ,  -- Samples: "2025-11-04T01:33:18.076235Z", "2025-11-03T02:53:13.860159Z"...
    custom_fields TEXT,
    due_date TIMESTAMPTZ,  -- Samples: "2025-12-03T00:00:00Z", "2025-12-02T00:00:00Z", "2025-11-21T...
    items JSONB,
    job_id INT,  -- Samples: 61639944, 61075990, 60621958
    job_number TEXT,  -- Samples: "61639944", "61075990", "60621958"
    modified_on TIMESTAMPTZ,  -- Samples: "2025-11-04T01:34:47.0238761Z", "2025-11-03T22:32:31.9637691...
    post_date TIMESTAMPTZ,  -- Samples: "2025-11-03T00:00:00Z", "2025-11-02T00:00:00Z", "2025-10-22T...
    purchase_order_id INT,  -- Samples: 61656863, 61616390, 61161735
    reference_number TEXT,  -- Samples: "61639944-001-B1", "61616390-B1", "61075990-001-B1"
    shipping_amount TEXT,  -- Samples: "0.00", "1.67", "99.00"
    ship_to JSONB,
    ship_to_description TEXT,  -- Samples: "Scott Tran ", "Shop", "Vendor Counter Pickup"
    summary TEXT,
    sync_status TEXT,  -- Samples: "Pending", "Posted", "Exported"
    tax_amount TEXT,  -- Samples: "229.50", "75.31", "0.46"
    tax_zone TEXT,
    term_name TEXT,  -- Samples: "NET30", "Due Upon Receipt", "Delete"
    vendor JSONB,
    vendor_number TEXT,  -- Samples: "55965069", "55006974", "H6364-446604"

    -- Sync tracking
    synced_at TIMESTAMPTZ NOT NULL,
    sync_batch_id UUID NOT NULL,
    payload_hash TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_master_inventory_bills_st_id
    ON master.inventory_bills (st_id);
CREATE INDEX IF NOT EXISTS idx_master_inventory_bills_budget_code_id
    ON master.inventory_bills (budget_code_id);
CREATE INDEX IF NOT EXISTS idx_master_inventory_bills_job_id
    ON master.inventory_bills (job_id);
CREATE INDEX IF NOT EXISTS idx_master_inventory_bills_purchase_order_id
    ON master.inventory_bills (purchase_order_id);
CREATE INDEX IF NOT EXISTS idx_master_inventory_bills_synced
    ON master.inventory_bills (synced_at DESC);

-- ===========================================
-- INVOICES
-- ===========================================
-- Source: 100 sample records
-- Fields: 43 top-level (118 total including nested)

CREATE TABLE IF NOT EXISTS master.invoices (
    id BIGSERIAL PRIMARY KEY,
    st_id BIGINT NOT NULL UNIQUE,

    active BOOLEAN,  -- Samples: true
    adjustment_to_id TEXT,
    assigned_to JSONB,
    balance TEXT,  -- Samples: "0.00"
    batch TEXT,
    budget_code_id TEXT,
    business_unit JSONB,
    commission_eligibility_date TEXT,
    created_by TEXT,  -- Samples: "yannir2024", "NathalieYR"
    created_on TIMESTAMPTZ,  -- Samples: "2024-07-08T15:13:32.1092764Z", "2024-07-08T18:09:07.3374457...
    customer JSONB,
    customer_address JSONB,
    custom_fields TEXT,
    deposited_on TEXT,
    discount_total TEXT,  -- Samples: "0.00"
    due_date TIMESTAMPTZ,  -- Samples: "2024-07-16T00:00:00Z", "2024-06-19T00:00:00Z", "2024-04-10T...
    employee_info JSONB,
    export_id TEXT,
    import_id TEXT,  -- Samples: "1044667923", "1040350850", "1041880867"
    invoice_configuration TEXT,  -- Samples: "JobInvoice"
    invoice_date TIMESTAMPTZ,  -- Samples: "2024-07-09T00:00:00Z", "2024-06-12T00:00:00Z", "2024-04-03T...
    invoice_type TEXT,
    items JSONB,
    job JSONB,
    location JSONB,
    location_address JSONB,
    material_sku_id INT,  -- Samples: 0
    membership_id TEXT,
    modified_on TIMESTAMPTZ,  -- Samples: "2024-07-08T15:13:32.2440468Z", "2024-07-28T22:03:02.7266203...
    paid_on TIMESTAMPTZ,  -- Samples: "2024-07-10T00:00:00Z", "2024-04-03T00:00:00Z", "2024-04-29T...
    project_id INT,  -- Samples: 52993834
    reference_number TEXT,  -- Samples: "70636", "70961", "1206"
    review_status TEXT,  -- Samples: "NeedsReview", "Reviewed"
    royalty JSONB,
    sales_tax TEXT,  -- Samples: "0.00"
    sales_tax_code TEXT,
    sent_status TEXT,  -- Samples: "NotSent", "Sent"
    sub_total TEXT,  -- Samples: "0.00", "3095.00", "1948.99"
    summary TEXT,  -- Samples: "David PCS \nResidential Electrical. First thing 8AM.", "Ins...
    sync_status TEXT,  -- Samples: "Pending", "Exported"
    tax_zone_id TEXT,
    term_name TEXT,  -- Samples: "NET 7"
    total TEXT,  -- Samples: "0.00", "3095.00", "1948.99"

    -- Sync tracking
    synced_at TIMESTAMPTZ NOT NULL,
    sync_batch_id UUID NOT NULL,
    payload_hash TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_master_invoices_st_id
    ON master.invoices (st_id);
CREATE INDEX IF NOT EXISTS idx_master_invoices_adjustment_to_id
    ON master.invoices (adjustment_to_id);
CREATE INDEX IF NOT EXISTS idx_master_invoices_budget_code_id
    ON master.invoices (budget_code_id);
CREATE INDEX IF NOT EXISTS idx_master_invoices_export_id
    ON master.invoices (export_id);
CREATE INDEX IF NOT EXISTS idx_master_invoices_import_id
    ON master.invoices (import_id);
CREATE INDEX IF NOT EXISTS idx_master_invoices_material_sku_id
    ON master.invoices (material_sku_id);
CREATE INDEX IF NOT EXISTS idx_master_invoices_membership_id
    ON master.invoices (membership_id);
CREATE INDEX IF NOT EXISTS idx_master_invoices_project_id
    ON master.invoices (project_id);
CREATE INDEX IF NOT EXISTS idx_master_invoices_tax_zone_id
    ON master.invoices (tax_zone_id);
CREATE INDEX IF NOT EXISTS idx_master_invoices_active
    ON master.invoices (active);
CREATE INDEX IF NOT EXISTS idx_master_invoices_synced
    ON master.invoices (synced_at DESC);

-- ===========================================
-- JOB_CANCEL_REASONS
-- ===========================================
-- Source: 24 sample records
-- Fields: 4 top-level (5 total including nested)

CREATE TABLE IF NOT EXISTS master.job_cancel_reasons (
    id BIGSERIAL PRIMARY KEY,
    st_id BIGINT NOT NULL UNIQUE,

    active BOOLEAN,  -- Samples: false, true
    created_on TIMESTAMPTZ,  -- Samples: "2024-05-21T21:05:29.019583Z", "2024-05-21T21:05:29.0570587Z...
    modified_on TIMESTAMPTZ,  -- Samples: "2024-05-21T21:05:39.3142745Z", "2024-05-21T21:05:51.8772878...
    name TEXT,  -- Samples: "Tech was latedeactivated", "Problem fixed itselfdeactivated...

    -- Sync tracking
    synced_at TIMESTAMPTZ NOT NULL,
    sync_batch_id UUID NOT NULL,
    payload_hash TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_master_job_cancel_reasons_st_id
    ON master.job_cancel_reasons (st_id);
CREATE INDEX IF NOT EXISTS idx_master_job_cancel_reasons_active
    ON master.job_cancel_reasons (active);
CREATE INDEX IF NOT EXISTS idx_master_job_cancel_reasons_synced
    ON master.job_cancel_reasons (synced_at DESC);

-- ===========================================
-- JOB_HOLD_REASONS
-- ===========================================
-- Source: 18 sample records
-- Fields: 4 top-level (5 total including nested)

CREATE TABLE IF NOT EXISTS master.job_hold_reasons (
    id BIGSERIAL PRIMARY KEY,
    st_id BIGINT NOT NULL UNIQUE,

    active BOOLEAN,  -- Samples: false, true
    created_on TIMESTAMPTZ,  -- Samples: "2024-05-21T21:05:28.9557145Z", "2024-05-21T21:05:28.9761902...
    modified_on TIMESTAMPTZ,  -- Samples: "2024-05-21T21:05:39.3305251Z", "2025-08-14T13:06:47.6440359...
    name TEXT,  -- Samples: "Waiting for materialsdeactivated", "Waiting for permitdeact...

    -- Sync tracking
    synced_at TIMESTAMPTZ NOT NULL,
    sync_batch_id UUID NOT NULL,
    payload_hash TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_master_job_hold_reasons_st_id
    ON master.job_hold_reasons (st_id);
CREATE INDEX IF NOT EXISTS idx_master_job_hold_reasons_active
    ON master.job_hold_reasons (active);
CREATE INDEX IF NOT EXISTS idx_master_job_hold_reasons_synced
    ON master.job_hold_reasons (synced_at DESC);

-- ===========================================
-- JOB_SPLITS
-- ===========================================
-- Source: 100 sample records
-- Fields: 5 top-level (6 total including nested)

CREATE TABLE IF NOT EXISTS master.job_splits (
    id BIGSERIAL PRIMARY KEY,
    st_id BIGINT NOT NULL UNIQUE,

    created_on TIMESTAMPTZ,  -- Samples: "2024-07-08T15:13:32.879757Z", "2024-07-08T18:09:08.126825Z"...
    job_id INT,  -- Samples: 70636, 70961, 1187722
    modified_on TIMESTAMPTZ,  -- Samples: "2024-07-08T15:13:33.0082226Z", "2024-07-08T18:09:08.2690441...
    split DECIMAL(12,2),  -- Samples: 100, 33.3333, 50
    technician_id INT,  -- Samples: 12417, 1190549, 1190553

    -- Sync tracking
    synced_at TIMESTAMPTZ NOT NULL,
    sync_batch_id UUID NOT NULL,
    payload_hash TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_master_job_splits_st_id
    ON master.job_splits (st_id);
CREATE INDEX IF NOT EXISTS idx_master_job_splits_job_id
    ON master.job_splits (job_id);
CREATE INDEX IF NOT EXISTS idx_master_job_splits_technician_id
    ON master.job_splits (technician_id);
CREATE INDEX IF NOT EXISTS idx_master_job_splits_synced
    ON master.job_splits (synced_at DESC);

-- ===========================================
-- JOB_TYPES
-- ===========================================
-- Source: 38 sample records
-- Fields: 17 top-level (18 total including nested)

CREATE TABLE IF NOT EXISTS master.job_types (
    id BIGSERIAL PRIMARY KEY,
    st_id BIGINT NOT NULL UNIQUE,

    active BOOLEAN,  -- Samples: true
    business_unit_ids JSONB,
    class TEXT,  -- Samples: "Install", "Estimates", "Service"
    created_on TIMESTAMPTZ,  -- Samples: "2024-05-21T21:05:46.9042857Z", "2024-05-21T21:05:46.9278766...
    duration INT,  -- Samples: 7200, 25200, 10800
    enforce_recurring_service_event_selection TEXT,
    external_data TEXT,
    invoice_signatures_required BOOLEAN,  -- Samples: true, false
    is_smart_dispatched BOOLEAN,  -- Samples: false
    modified_on TIMESTAMPTZ,  -- Samples: "2025-10-27T23:22:50.6384288Z", "2025-10-27T23:20:30.149899Z...
    name TEXT,  -- Samples: "Electrical - Service: Breaker/Panel Diagnosis", "Electrical...
    no_charge BOOLEAN,  -- Samples: false, true
    priority TEXT,  -- Samples: "Normal", "Low"
    skills JSONB,
    sold_threshold INT,  -- Samples: 36, 1000, 0
    summary TEXT,  -- Samples: "CSR/PM Checklist:\n- Are breakers tripping randomly or unde...
    tag_type_ids JSONB,

    -- Sync tracking
    synced_at TIMESTAMPTZ NOT NULL,
    sync_batch_id UUID NOT NULL,
    payload_hash TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_master_job_types_st_id
    ON master.job_types (st_id);
CREATE INDEX IF NOT EXISTS idx_master_job_types_active
    ON master.job_types (active);
CREATE INDEX IF NOT EXISTS idx_master_job_types_synced
    ON master.job_types (synced_at DESC);

-- ===========================================
-- JOBS
-- ===========================================
-- Source: 100 sample records
-- Fields: 35 top-level (38 total including nested)

CREATE TABLE IF NOT EXISTS master.jobs (
    id BIGSERIAL PRIMARY KEY,
    st_id BIGINT NOT NULL UNIQUE,

    appointment_count INT,  -- Samples: 1
    booking_id TEXT,
    business_unit_id INT,  -- Samples: 1308, 1314, 1316
    campaign_id INT,  -- Samples: 33800, 1444, 1187720
    completed_on TIMESTAMPTZ,  -- Samples: "2024-07-08T15:19:49.627372Z", "2024-07-09T21:55:52.76Z", "2...
    created_by_id INT,  -- Samples: 26, 4617, 0
    created_from_estimate_id TEXT,
    created_on TIMESTAMPTZ,  -- Samples: "2024-07-08T15:13:31.9393795Z", "2024-07-08T18:09:07.1299931...
    customer_id INT,  -- Samples: 2023488, 1184649, 1184652
    customer_po TEXT,
    custom_fields JSONB,
    estimate_ids JSONB,
    external_data TEXT,
    first_appointment_id INT,  -- Samples: 70637, 70962, 1462359
    invoice_id INT,  -- Samples: 70639, 70964, 1188438
    job_generated_lead_source JSONB,
    job_number TEXT,  -- Samples: "70636", "70961", "1044667923"
    job_status TEXT,  -- Samples: "Canceled", "Completed"
    job_type_id INT,  -- Samples: 70397, 2023505, 1338
    last_appointment_id INT,  -- Samples: 70637, 70962, 1462359
    lead_call_id TEXT,
    location_id INT,  -- Samples: 2023493, 73911, 1185283
    membership_id TEXT,
    modified_on TIMESTAMPTZ,  -- Samples: "2024-07-08T15:19:49.6373995Z", "2024-07-15T19:26:37.9929528...
    no_charge BOOLEAN,  -- Samples: false, true
    notifications_enabled BOOLEAN,  -- Samples: true, false
    partner_lead_call_id TEXT,
    priority TEXT,  -- Samples: "Normal"
    project_id INT,  -- Samples: 52993834, 52968155
    recall_for_id TEXT,
    sold_by_id TEXT,
    summary TEXT,  -- Samples: "Current Problem: Panel Needs to be upgraded to 200AMPs for ...
    tag_type_ids JSONB,
    total DECIMAL(12,2),  -- Samples: 0, 3095, 1948.99
    warranty_id TEXT,

    -- Sync tracking
    synced_at TIMESTAMPTZ NOT NULL,
    sync_batch_id UUID NOT NULL,
    payload_hash TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_master_jobs_st_id
    ON master.jobs (st_id);
CREATE INDEX IF NOT EXISTS idx_master_jobs_booking_id
    ON master.jobs (booking_id);
CREATE INDEX IF NOT EXISTS idx_master_jobs_business_unit_id
    ON master.jobs (business_unit_id);
CREATE INDEX IF NOT EXISTS idx_master_jobs_campaign_id
    ON master.jobs (campaign_id);
CREATE INDEX IF NOT EXISTS idx_master_jobs_created_by_id
    ON master.jobs (created_by_id);
CREATE INDEX IF NOT EXISTS idx_master_jobs_created_from_estimate_id
    ON master.jobs (created_from_estimate_id);
CREATE INDEX IF NOT EXISTS idx_master_jobs_customer_id
    ON master.jobs (customer_id);
CREATE INDEX IF NOT EXISTS idx_master_jobs_first_appointment_id
    ON master.jobs (first_appointment_id);
CREATE INDEX IF NOT EXISTS idx_master_jobs_invoice_id
    ON master.jobs (invoice_id);
CREATE INDEX IF NOT EXISTS idx_master_jobs_job_type_id
    ON master.jobs (job_type_id);
CREATE INDEX IF NOT EXISTS idx_master_jobs_last_appointment_id
    ON master.jobs (last_appointment_id);
CREATE INDEX IF NOT EXISTS idx_master_jobs_lead_call_id
    ON master.jobs (lead_call_id);
CREATE INDEX IF NOT EXISTS idx_master_jobs_location_id
    ON master.jobs (location_id);
CREATE INDEX IF NOT EXISTS idx_master_jobs_membership_id
    ON master.jobs (membership_id);
CREATE INDEX IF NOT EXISTS idx_master_jobs_partner_lead_call_id
    ON master.jobs (partner_lead_call_id);
CREATE INDEX IF NOT EXISTS idx_master_jobs_project_id
    ON master.jobs (project_id);
CREATE INDEX IF NOT EXISTS idx_master_jobs_recall_for_id
    ON master.jobs (recall_for_id);
CREATE INDEX IF NOT EXISTS idx_master_jobs_sold_by_id
    ON master.jobs (sold_by_id);
CREATE INDEX IF NOT EXISTS idx_master_jobs_warranty_id
    ON master.jobs (warranty_id);
CREATE INDEX IF NOT EXISTS idx_master_jobs_synced
    ON master.jobs (synced_at DESC);

-- ===========================================
-- JOURNAL_ENTRIES
-- ===========================================
-- Source: 100 sample records
-- Fields: 15 top-level (16 total including nested)

CREATE TABLE IF NOT EXISTS master.journal_entries (
    id BIGSERIAL PRIMARY KEY,
    st_id BIGINT NOT NULL UNIQUE,

    created_on TIMESTAMPTZ,  -- Samples: "2026-01-21T12:03:48.122912Z", "2026-01-20T21:30:57.186397Z"...
    custom_fields JSONB,
    exported_by TEXT,
    exported_on TIMESTAMPTZ,  -- Samples: "2026-01-21T12:04:01.196046Z", "2026-01-20T21:33:16.122585Z"...
    is_empty BOOLEAN,  -- Samples: false
    last_sync_version_id INT,  -- Samples: 1, 2, 3
    message TEXT,  -- Samples: "QboAccountNotFound:(4001,Services income),QboAccountNotFoun...
    modified_on TIMESTAMPTZ,  -- Samples: "2026-01-21T12:03:48.127942Z", "2026-01-20T21:30:57.196342Z"...
    name TEXT,  -- Samples: "Bank Deposit #62846982 - 01/21/2026", "Payments - Visa - (E...
    number INT,  -- Samples: 2447, 2444, 2442
    post_date TIMESTAMPTZ,  -- Samples: "2026-01-21T00:00:00", "2026-01-20T00:00:00", "2026-01-19T00...
    status TEXT,  -- Samples: "Open"
    sync_status TEXT,  -- Samples: "Synced", "Error"
    url TEXT,  -- Samples: "https://go.servicetitan.com/#/new/accounting/journal-entrie...
    version_id INT,  -- Samples: 1, 22, 2

    -- Sync tracking
    synced_at TIMESTAMPTZ NOT NULL,
    sync_batch_id UUID NOT NULL,
    payload_hash TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_master_journal_entries_st_id
    ON master.journal_entries (st_id);
CREATE INDEX IF NOT EXISTS idx_master_journal_entries_last_sync_version_id
    ON master.journal_entries (last_sync_version_id);
CREATE INDEX IF NOT EXISTS idx_master_journal_entries_version_id
    ON master.journal_entries (version_id);
CREATE INDEX IF NOT EXISTS idx_master_journal_entries_status
    ON master.journal_entries (status);
CREATE INDEX IF NOT EXISTS idx_master_journal_entries_synced
    ON master.journal_entries (synced_at DESC);

-- ===========================================
-- NON_JOB_APPOINTMENTS
-- ===========================================
-- Source: 100 sample records
-- Fields: 15 top-level (16 total including nested)

CREATE TABLE IF NOT EXISTS master.non_job_appointments (
    id BIGSERIAL PRIMARY KEY,
    st_id BIGINT NOT NULL UNIQUE,

    active BOOLEAN,  -- Samples: true, false
    all_day BOOLEAN,  -- Samples: false
    clear_dispatch_board BOOLEAN,  -- Samples: false
    clear_technician_view BOOLEAN,  -- Samples: true, false
    created_by_id INT,  -- Samples: 4482, 55810, 14721
    created_on TIMESTAMPTZ,  -- Samples: "2024-07-08T19:07:06.8707146Z", "2024-07-10T11:55:57.9354382...
    duration TEXT,  -- Samples: "00:00:08.7480000", "00:00:07.0070000", "00:30:46.1610000"
    modified_on TIMESTAMPTZ,  -- Samples: "2024-07-08T19:07:15.0451505Z", "2024-07-10T11:56:04.9196897...
    name TEXT,  -- Samples: "Meal", "Training", "Joe Kelly Check Pick up"
    remove_technician_from_capacity_planning BOOLEAN,  -- Samples: false, true
    show_on_technician_schedule BOOLEAN,  -- Samples: true, false
    start TIMESTAMPTZ,  -- Samples: "2024-07-08T19:07:05.17Z", "2024-07-10T11:55:56.749Z", "2024...
    summary TEXT,  -- Samples: "No Show"
    technician_id INT,  -- Samples: 4482, 55810, 14721
    timesheet_code_id INT,  -- Samples: 254, 255, 0

    -- Sync tracking
    synced_at TIMESTAMPTZ NOT NULL,
    sync_batch_id UUID NOT NULL,
    payload_hash TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_master_non_job_appointments_st_id
    ON master.non_job_appointments (st_id);
CREATE INDEX IF NOT EXISTS idx_master_non_job_appointments_created_by_id
    ON master.non_job_appointments (created_by_id);
CREATE INDEX IF NOT EXISTS idx_master_non_job_appointments_technician_id
    ON master.non_job_appointments (technician_id);
CREATE INDEX IF NOT EXISTS idx_master_non_job_appointments_timesheet_code_id
    ON master.non_job_appointments (timesheet_code_id);
CREATE INDEX IF NOT EXISTS idx_master_non_job_appointments_active
    ON master.non_job_appointments (active);
CREATE INDEX IF NOT EXISTS idx_master_non_job_appointments_synced
    ON master.non_job_appointments (synced_at DESC);

-- ===========================================
-- PAYMENT_TERMS
-- ===========================================
-- Source: 5 sample records
-- Fields: 11 top-level (12 total including nested)

CREATE TABLE IF NOT EXISTS master.payment_terms (
    id BIGSERIAL PRIMARY KEY,
    st_id BIGINT NOT NULL UNIQUE,

    active BOOLEAN,  -- Samples: true
    created_on TIMESTAMPTZ,  -- Samples: "2024-05-21T21:05:29.250741Z", "2024-06-24T17:50:36.7013845Z...
    due_day INT,  -- Samples: 0, 7, 30
    due_day_type TEXT,  -- Samples: "NumberOfDays", "CertainDayOfFollowingMonth"
    interest_settings TEXT,
    in_use BOOLEAN,  -- Samples: true, false
    is_customer_default BOOLEAN,  -- Samples: false, true
    is_vendor_default BOOLEAN,  -- Samples: false, true
    modified_on TIMESTAMPTZ,  -- Samples: "2026-01-20T19:02:55.1160828Z", "2025-09-05T13:41:41.6691925...
    name TEXT,  -- Samples: "Due Upon Receipt", "NET 7", "NET30"
    payment_term_discount_model TEXT,

    -- Sync tracking
    synced_at TIMESTAMPTZ NOT NULL,
    sync_batch_id UUID NOT NULL,
    payload_hash TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_master_payment_terms_st_id
    ON master.payment_terms (st_id);
CREATE INDEX IF NOT EXISTS idx_master_payment_terms_active
    ON master.payment_terms (active);
CREATE INDEX IF NOT EXISTS idx_master_payment_terms_synced
    ON master.payment_terms (synced_at DESC);

-- ===========================================
-- PAYMENT_TYPES
-- ===========================================
-- Source: 16 sample records
-- Fields: 3 top-level (4 total including nested)

CREATE TABLE IF NOT EXISTS master.payment_types (
    id BIGSERIAL PRIMARY KEY,
    st_id BIGINT NOT NULL UNIQUE,

    created_on TIMESTAMPTZ,  -- Samples: "2024-05-21T21:05:47.2131191Z", "2024-05-21T21:05:47.2298645...
    modified_on TIMESTAMPTZ,  -- Samples: "2025-11-03T23:37:01.1206363Z", "2025-11-03T23:37:01.1215781...
    name TEXT,  -- Samples: "Cash", "Check deactivated", "Visa"

    -- Sync tracking
    synced_at TIMESTAMPTZ NOT NULL,
    sync_batch_id UUID NOT NULL,
    payload_hash TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_master_payment_types_st_id
    ON master.payment_types (st_id);
CREATE INDEX IF NOT EXISTS idx_master_payment_types_synced
    ON master.payment_types (synced_at DESC);

-- ===========================================
-- PAYMENTS
-- ===========================================
-- Source: 100 sample records
-- Fields: 22 top-level (43 total including nested)

CREATE TABLE IF NOT EXISTS master.payments (
    id BIGSERIAL PRIMARY KEY,
    st_id BIGINT NOT NULL UNIQUE,

    active BOOLEAN,  -- Samples: true
    applied_to JSONB,
    auth_code TEXT,  -- Samples: "05472G"
    batch JSONB,
    business_unit JSONB,
    check_number TEXT,
    created_by TEXT,  -- Samples: "Hunterf1"
    created_on TIMESTAMPTZ,  -- Samples: "2024-07-09T18:03:46.0645818Z", "2024-07-10T16:39:11.3074061...
    customer JSONB,
    custom_fields TEXT,
    date TIMESTAMPTZ,  -- Samples: "2024-07-09T18:03:46.0329183Z", "2024-04-03T00:00:00Z", "202...
    deposit JSONB,
    general_ledger_account JSONB,
    memo TEXT,  -- Samples: " ", "Invoice_1019", "Invoice_1037"
    modified_on TIMESTAMPTZ,  -- Samples: "2024-07-18T15:16:03.9408832Z", "2024-07-10T16:39:11.8795014...
    reference_number TEXT,
    refunded_payment_id TEXT,
    sync_status TEXT,  -- Samples: "Exported"
    total TEXT,  -- Samples: "95.00", "1948.99", "0.00"
    type TEXT,  -- Samples: "Visa", "Applied Payment for AR"
    type_id TEXT,  -- Samples: "1403", "1409"
    unapplied_amount TEXT,  -- Samples: "0.00"

    -- Sync tracking
    synced_at TIMESTAMPTZ NOT NULL,
    sync_batch_id UUID NOT NULL,
    payload_hash TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_master_payments_st_id
    ON master.payments (st_id);
CREATE INDEX IF NOT EXISTS idx_master_payments_refunded_payment_id
    ON master.payments (refunded_payment_id);
CREATE INDEX IF NOT EXISTS idx_master_payments_type_id
    ON master.payments (type_id);
CREATE INDEX IF NOT EXISTS idx_master_payments_type
    ON master.payments (type);
CREATE INDEX IF NOT EXISTS idx_master_payments_active
    ON master.payments (active);
CREATE INDEX IF NOT EXISTS idx_master_payments_synced
    ON master.payments (synced_at DESC);

-- ===========================================
-- PAYROLL_ADJUSTMENTS
-- ===========================================
-- Source: 0 sample records
-- Fields: 0 top-level (0 total including nested)

CREATE TABLE IF NOT EXISTS master.payroll_adjustments (
    id BIGSERIAL PRIMARY KEY,


    -- Sync tracking
    synced_at TIMESTAMPTZ NOT NULL,
    sync_batch_id UUID NOT NULL,
    payload_hash TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_master_payroll_adjustments_synced
    ON master.payroll_adjustments (synced_at DESC);

-- ===========================================
-- PAYROLL_TIMESHEETS
-- ===========================================
-- Source: 100 sample records
-- Fields: 10 top-level (11 total including nested)

CREATE TABLE IF NOT EXISTS master.payroll_timesheets (
    id BIGSERIAL PRIMARY KEY,
    st_id BIGINT NOT NULL UNIQUE,

    active BOOLEAN,  -- Samples: true
    appointment_id INT,  -- Samples: 2023554, 2024174, 70962
    arrived_on TIMESTAMPTZ,  -- Samples: "2024-07-08T18:32:00Z", "2024-07-09T13:20:00Z", "2024-07-09T...
    canceled_on TIMESTAMPTZ,  -- Samples: "2024-07-11T23:29:00Z", "2024-07-19T12:06:00Z"
    created_on TIMESTAMPTZ,  -- Samples: "2024-07-08T18:32:24.5350687Z", "2024-07-09T12:55:36.4870972...
    dispatched_on TIMESTAMPTZ,  -- Samples: "2024-07-08T18:32:00Z", "2024-07-09T12:55:00Z", "2024-07-09T...
    done_on TIMESTAMPTZ,  -- Samples: "2024-07-08T19:01:00Z", "2024-07-09T13:28:00Z", "2024-07-09T...
    job_id INT,  -- Samples: 2023553, 2024173, 70961
    modified_on TIMESTAMPTZ,  -- Samples: "2024-07-08T19:01:27.4391511Z", "2024-07-09T13:28:24.3481272...
    technician_id INT,  -- Samples: 4482, 12417, 55810

    -- Sync tracking
    synced_at TIMESTAMPTZ NOT NULL,
    sync_batch_id UUID NOT NULL,
    payload_hash TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_master_payroll_timesheets_st_id
    ON master.payroll_timesheets (st_id);
CREATE INDEX IF NOT EXISTS idx_master_payroll_timesheets_appointment_id
    ON master.payroll_timesheets (appointment_id);
CREATE INDEX IF NOT EXISTS idx_master_payroll_timesheets_job_id
    ON master.payroll_timesheets (job_id);
CREATE INDEX IF NOT EXISTS idx_master_payroll_timesheets_technician_id
    ON master.payroll_timesheets (technician_id);
CREATE INDEX IF NOT EXISTS idx_master_payroll_timesheets_active
    ON master.payroll_timesheets (active);
CREATE INDEX IF NOT EXISTS idx_master_payroll_timesheets_synced
    ON master.payroll_timesheets (synced_at DESC);

-- ===========================================
-- PAYROLLS
-- ===========================================
-- Source: 100 sample records
-- Fields: 10 top-level (11 total including nested)

CREATE TABLE IF NOT EXISTS master.payrolls (
    id BIGSERIAL PRIMARY KEY,
    st_id BIGINT NOT NULL UNIQUE,

    active BOOLEAN,  -- Samples: false
    burden_rate DECIMAL(12,2),  -- Samples: 42.75, 45.75, 29.85
    created_on TIMESTAMPTZ,  -- Samples: "0001-01-01T00:00:00Z"
    employee_id INT,  -- Samples: 4482, 12161, 14465
    employee_type TEXT,  -- Samples: "Technician"
    ended_on TIMESTAMPTZ,  -- Samples: "2024-07-13T03:59:59.9969969Z", "2024-07-20T03:59:59.9969969...
    manager_approved_on TIMESTAMPTZ,  -- Samples: "2024-11-14T21:37:48.1992808Z", "2024-11-14T21:37:48.2050651...
    modified_on TIMESTAMPTZ,  -- Samples: "2024-11-14T21:37:48.1992956Z", "2024-11-14T21:37:48.2050714...
    started_on TIMESTAMPTZ,  -- Samples: "2024-07-06T04:00:00Z", "2024-07-13T04:00:00Z", "2024-07-20T...
    status TEXT,  -- Samples: "Paid", "Approved", "Expired"

    -- Sync tracking
    synced_at TIMESTAMPTZ NOT NULL,
    sync_batch_id UUID NOT NULL,
    payload_hash TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_master_payrolls_st_id
    ON master.payrolls (st_id);
CREATE INDEX IF NOT EXISTS idx_master_payrolls_employee_id
    ON master.payrolls (employee_id);
CREATE INDEX IF NOT EXISTS idx_master_payrolls_status
    ON master.payrolls (status);
CREATE INDEX IF NOT EXISTS idx_master_payrolls_active
    ON master.payrolls (active);
CREATE INDEX IF NOT EXISTS idx_master_payrolls_synced
    ON master.payrolls (synced_at DESC);

-- ===========================================
-- PRICEBOOK_CATEGORIES
-- ===========================================
-- Source: 10 sample records
-- Fields: 14 top-level (90 total including nested)

CREATE TABLE IF NOT EXISTS master.pricebook_categories (
    id BIGSERIAL PRIMARY KEY,
    st_id BIGINT NOT NULL UNIQUE,

    active BOOLEAN,  -- Samples: true
    business_unit_ids JSONB,
    category_type TEXT,  -- Samples: "Services", "Materials"
    description TEXT,  -- Samples: "Null"
    external_id TEXT,
    hide_in_mobile BOOLEAN,  -- Samples: false
    image TEXT,  -- Samples: "Images/Category/35b1baa5-1c2b-41fd-8d17-bce84e956680.jpg", ...
    name TEXT,  -- Samples: "Pool Builder", "Admin", "Gas"
    parent_id TEXT,
    position INT,  -- Samples: 5, 11, 2
    sku_images JSONB,
    sku_videos JSONB,
    source TEXT,
    subcategories JSONB,

    -- Sync tracking
    synced_at TIMESTAMPTZ NOT NULL,
    sync_batch_id UUID NOT NULL,
    payload_hash TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_master_pricebook_categories_st_id
    ON master.pricebook_categories (st_id);
CREATE INDEX IF NOT EXISTS idx_master_pricebook_categories_external_id
    ON master.pricebook_categories (external_id);
CREATE INDEX IF NOT EXISTS idx_master_pricebook_categories_parent_id
    ON master.pricebook_categories (parent_id);
CREATE INDEX IF NOT EXISTS idx_master_pricebook_categories_active
    ON master.pricebook_categories (active);
CREATE INDEX IF NOT EXISTS idx_master_pricebook_categories_synced
    ON master.pricebook_categories (synced_at DESC);

-- ===========================================
-- PRICEBOOK_CLIENT_SPECIFIC_PRICING
-- ===========================================
-- Source: 7 sample records
-- Fields: 1 top-level (2 total including nested)

CREATE TABLE IF NOT EXISTS master.pricebook_client_specific_pricing (
    id BIGSERIAL PRIMARY KEY,
    st_id BIGINT NOT NULL UNIQUE,

    exceptions JSONB,

    -- Sync tracking
    synced_at TIMESTAMPTZ NOT NULL,
    sync_batch_id UUID NOT NULL,
    payload_hash TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_master_pricebook_client_specific_pricing_st_id
    ON master.pricebook_client_specific_pricing (st_id);
CREATE INDEX IF NOT EXISTS idx_master_pricebook_client_specific_pricing_synced
    ON master.pricebook_client_specific_pricing (synced_at DESC);

-- ===========================================
-- PRICEBOOK_DISCOUNTS_AND_FEES
-- ===========================================
-- Source: 7 sample records
-- Fields: 21 top-level (27 total including nested)

CREATE TABLE IF NOT EXISTS master.pricebook_discounts_and_fees (
    id BIGSERIAL PRIMARY KEY,
    st_id BIGINT NOT NULL UNIQUE,

    account TEXT,  -- Samples: "Discounts / Refunds Given", "INCOME-Sales"
    active BOOLEAN,  -- Samples: true
    amount DECIMAL(12,2),  -- Samples: 0.05, 0.15, 0.1
    amount_type TEXT,  -- Samples: "Percentage", "Fixed"
    assets JSONB,
    bonus INT,  -- Samples: 0
    budget_cost_code TEXT,
    budget_cost_type TEXT,
    categories JSONB,
    code TEXT,  -- Samples: "DISCOUNT-0010", "DISCOUNT-0030", "DISCOUNT-0020"
    commission_bonus INT,  -- Samples: 0
    cross_sale_group TEXT,
    description TEXT,  -- Samples: "We appreciate your business and want to offer you a discoun...
    display_name TEXT,  -- Samples: "Customer Discount 5% Off", "Customer Discount 15% Off", "Cu...
    exclude_from_payroll BOOLEAN,  -- Samples: false
    external_data JSONB,
    hours INT,  -- Samples: 0
    limit INT,  -- Samples: 0, 250
    pays_commission BOOLEAN,  -- Samples: false
    taxable BOOLEAN,  -- Samples: false
    type TEXT,  -- Samples: "Discount", "Fee"

    -- Sync tracking
    synced_at TIMESTAMPTZ NOT NULL,
    sync_batch_id UUID NOT NULL,
    payload_hash TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_master_pricebook_discounts_and_fees_st_id
    ON master.pricebook_discounts_and_fees (st_id);
CREATE INDEX IF NOT EXISTS idx_master_pricebook_discounts_and_fees_type
    ON master.pricebook_discounts_and_fees (type);
CREATE INDEX IF NOT EXISTS idx_master_pricebook_discounts_and_fees_active
    ON master.pricebook_discounts_and_fees (active);
CREATE INDEX IF NOT EXISTS idx_master_pricebook_discounts_and_fees_synced
    ON master.pricebook_discounts_and_fees (synced_at DESC);

-- ===========================================
-- PRICEBOOK_EQUIPMENT
-- ===========================================
-- Source: 100 sample records
-- Fields: 45 top-level (78 total including nested)

CREATE TABLE IF NOT EXISTS master.pricebook_equipment (
    id BIGSERIAL PRIMARY KEY,
    st_id BIGINT NOT NULL UNIQUE,

    account TEXT,  -- Samples: "INCOME-Sales"
    active BOOLEAN,  -- Samples: true
    add_on_member_price DECIMAL(12,2),  -- Samples: 1292.52, 641.15, 2351.81
    add_on_price DECIMAL(12,2),  -- Samples: 1364.32, 676.77, 2482.46
    asset_account TEXT,
    assets JSONB,
    bonus INT,  -- Samples: 0
    budget_cost_code TEXT,
    budget_cost_type TEXT,
    categories JSONB,
    code TEXT,  -- Samples: "HAY-LGT-LPCUS22100-EQ", "PEN-LGT-620425-EQ", "PEN-AUT-52362...
    commission_bonus INT,  -- Samples: 0
    cost DECIMAL(12,2),  -- Samples: 914.73, 453.75, 1664.41
    cost_of_sale_account TEXT,  -- Samples: "SUPPLIES & MATERIALS – COGS:Installed Equipment (COGS)"
    created_on TIMESTAMPTZ,  -- Samples: "2024-05-24T01:38:44.6901559Z", "2024-05-24T01:31:48.4554278...
    cross_sale_group TEXT,
    default_asset_url TEXT,  -- Samples: "Images/Equipment/c05cb0cf-1ece-4c2e-a9aa-17c613ed9010.jpeg"...
    description TEXT,  -- Samples: "OEM Hayward Universal ColorLogic Multi-Color LED Pool Light...
    dimensions JSONB,
    display_in_amount BOOLEAN,  -- Samples: false
    display_name TEXT,  -- Samples: "Hayward Universal ColorLogic Multi-Color LED Pool Light 12V...
    equipment_materials JSONB,
    external_data JSONB,
    external_id TEXT,
    general_ledger_account_id INT,  -- Samples: 41352
    hours INT,  -- Samples: 0
    is_configurable_equipment BOOLEAN,  -- Samples: false
    is_inventory BOOLEAN,  -- Samples: false
    manufacturer TEXT,  -- Samples: "Hayward", "Pentair", "Gulf Stream"
    manufacturer_warranty JSONB,
    member_price DECIMAL(12,2),  -- Samples: 1292.52, 641.15, 2351.81
    model TEXT,  -- Samples: "LPCUS22100", "620425", "523624"
    modified_on TIMESTAMPTZ,  -- Samples: "2026-01-18T23:03:24.4571379Z", "2026-01-18T23:03:24.4881042...
    other_vendors JSONB,
    pays_commission BOOLEAN,  -- Samples: false
    price DECIMAL(12,2),  -- Samples: 1436.13, 712.39, 2613.12
    primary_vendor JSONB,
    recommendations JSONB,
    service_provider_warranty JSONB,
    source TEXT,
    taxable BOOLEAN,  -- Samples: false
    type_id INT,  -- Samples: 53204378, 13247, 12477
    unit_of_measure TEXT,  -- Samples: "EA"
    upgrades JSONB,
    variations_or_configurable_equipment JSONB,

    -- Sync tracking
    synced_at TIMESTAMPTZ NOT NULL,
    sync_batch_id UUID NOT NULL,
    payload_hash TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_master_pricebook_equipment_st_id
    ON master.pricebook_equipment (st_id);
CREATE INDEX IF NOT EXISTS idx_master_pricebook_equipment_external_id
    ON master.pricebook_equipment (external_id);
CREATE INDEX IF NOT EXISTS idx_master_pricebook_equipment_general_ledger_account_id
    ON master.pricebook_equipment (general_ledger_account_id);
CREATE INDEX IF NOT EXISTS idx_master_pricebook_equipment_type_id
    ON master.pricebook_equipment (type_id);
CREATE INDEX IF NOT EXISTS idx_master_pricebook_equipment_active
    ON master.pricebook_equipment (active);
CREATE INDEX IF NOT EXISTS idx_master_pricebook_equipment_synced
    ON master.pricebook_equipment (synced_at DESC);

-- ===========================================
-- PRICEBOOK_MATERIALS
-- ===========================================
-- Source: 100 sample records
-- Fields: 41 top-level (65 total including nested)

CREATE TABLE IF NOT EXISTS master.pricebook_materials (
    id BIGSERIAL PRIMARY KEY,
    st_id BIGINT NOT NULL UNIQUE,

    account TEXT,  -- Samples: "INCOME-Sales"
    active BOOLEAN,  -- Samples: true
    add_on_member_price DECIMAL(12,2),  -- Samples: 184, 0, 13.8
    add_on_price DECIMAL(12,2),  -- Samples: 184, 0, 13.8
    asset_account TEXT,
    assets JSONB,
    bonus INT,  -- Samples: 0
    budget_cost_code TEXT,
    budget_cost_type TEXT,
    business_unit_id TEXT,
    categories JSONB,
    chargeable_by_default BOOLEAN,  -- Samples: true
    code TEXT,  -- Samples: "TRANS-100", "CH1515", "CH-120"
    commission_bonus INT,  -- Samples: 0
    cost DECIMAL(12,2),  -- Samples: 92, 26.8, 12.75
    cost_of_sale_account TEXT,  -- Samples: "SUPPLIES & MATERIALS – COGS:Materials & Parts (COGS)", "Dea...
    cost_type_id TEXT,
    created_by_id INT,  -- Samples: 0, 4613, 26
    created_on TIMESTAMPTZ,  -- Samples: "2024-05-24T00:59:09.8100781Z", "2024-05-24T19:10:21.7450703...
    deduct_as_job_cost BOOLEAN,  -- Samples: false
    default_asset_url TEXT,  -- Samples: "Images/Material/3633ae51-884b-45ac-9ba7-789d1693b6b4.jpg", ...
    description TEXT,  -- Samples: "100W Transormer", "Eaton CH1P 15A Tandem Breaker", "Eaton C...
    display_in_amount BOOLEAN,  -- Samples: false
    display_name TEXT,  -- Samples: "100W Transformer Intermatic", "1P1515 TANDEM CH", "CH 120"
    external_data JSONB,
    external_id TEXT,
    general_ledger_account_id INT,  -- Samples: 41352
    hours INT,  -- Samples: 0
    is_configurable_material BOOLEAN,  -- Samples: false
    is_inventory BOOLEAN,  -- Samples: false
    is_other_direct_cost BOOLEAN,  -- Samples: false
    member_price DECIMAL(12,2),  -- Samples: 184, 0, 13.8
    modified_on TIMESTAMPTZ,  -- Samples: "2025-11-17T12:18:44.6515081Z", "2026-01-14T03:39:56.3424376...
    other_vendors JSONB,
    pays_commission BOOLEAN,  -- Samples: false
    price DECIMAL(12,2),  -- Samples: 92, 0, 12.75
    primary_vendor JSONB,
    source TEXT,
    taxable BOOLEAN,  -- Samples: false
    unit_of_measure TEXT,  -- Samples: "Null", "EA"
    variations_or_configurable_materials JSONB,

    -- Sync tracking
    synced_at TIMESTAMPTZ NOT NULL,
    sync_batch_id UUID NOT NULL,
    payload_hash TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_master_pricebook_materials_st_id
    ON master.pricebook_materials (st_id);
CREATE INDEX IF NOT EXISTS idx_master_pricebook_materials_business_unit_id
    ON master.pricebook_materials (business_unit_id);
CREATE INDEX IF NOT EXISTS idx_master_pricebook_materials_cost_type_id
    ON master.pricebook_materials (cost_type_id);
CREATE INDEX IF NOT EXISTS idx_master_pricebook_materials_created_by_id
    ON master.pricebook_materials (created_by_id);
CREATE INDEX IF NOT EXISTS idx_master_pricebook_materials_external_id
    ON master.pricebook_materials (external_id);
CREATE INDEX IF NOT EXISTS idx_master_pricebook_materials_general_ledger_account_id
    ON master.pricebook_materials (general_ledger_account_id);
CREATE INDEX IF NOT EXISTS idx_master_pricebook_materials_active
    ON master.pricebook_materials (active);
CREATE INDEX IF NOT EXISTS idx_master_pricebook_materials_synced
    ON master.pricebook_materials (synced_at DESC);

-- ===========================================
-- PRICEBOOK_SERVICES
-- ===========================================
-- Source: 100 sample records
-- Fields: 36 top-level (49 total including nested)

CREATE TABLE IF NOT EXISTS master.pricebook_services (
    id BIGSERIAL PRIMARY KEY,
    st_id BIGINT NOT NULL UNIQUE,

    account TEXT,  -- Samples: "Services income", "INCOME-Sales"
    active BOOLEAN,  -- Samples: true
    add_on_member_price INT,  -- Samples: 200, 0, 825
    add_on_price INT,  -- Samples: 194, 0, 764
    assets JSONB,
    bonus DECIMAL(12,2),  -- Samples: 0, 5.73
    budget_cost_code TEXT,
    budget_cost_type TEXT,
    business_unit_id INT,  -- Samples: 4623, 1308
    calculated_price TEXT,
    categories JSONB,
    code TEXT,  -- Samples: "PB-PUMP-20A-GFCI", "POL-MEMBER", "PB-INTMT-PKG-1PUMP"
    commission_bonus INT,  -- Samples: 0
    cost INT,  -- Samples: 0, 50, 49
    created_on TIMESTAMPTZ,  -- Samples: "2024-05-26T00:47:22.5118392Z", "2024-05-26T19:13:55.9003709...
    cross_sale_group TEXT,
    default_asset_url TEXT,  -- Samples: "Images/Service/26872862-1c77-4a3a-b45e-d05a591b14f4.jpg", "...
    description TEXT,  -- Samples: "Siemens 2POL20 GFCI Breaker", "<ul><li>Testing & Balancing ...
    display_name TEXT,  -- Samples: "PUMP - 20A GFCI Breaker (PB)", "No Vac Weekly Service", "IN...
    external_data JSONB,
    external_id TEXT,
    hours DECIMAL(12,2),  -- Samples: 0.15, 0, 1
    is_labor BOOLEAN,  -- Samples: false
    member_price INT,  -- Samples: 200, 0, 825
    modified_on TIMESTAMPTZ,  -- Samples: "2026-01-14T03:40:08.244719Z", "2025-12-31T03:27:03.0778202Z...
    pays_commission BOOLEAN,  -- Samples: false
    price INT,  -- Samples: 216, 0, 849
    recommendations JSONB,
    service_equipment JSONB,
    service_materials JSONB,
    sold_by_commission INT,  -- Samples: 0
    source TEXT,
    taxable BOOLEAN,  -- Samples: false, true
    upgrades JSONB,
    use_static_prices TEXT,
    warranty JSONB,

    -- Sync tracking
    synced_at TIMESTAMPTZ NOT NULL,
    sync_batch_id UUID NOT NULL,
    payload_hash TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_master_pricebook_services_st_id
    ON master.pricebook_services (st_id);
CREATE INDEX IF NOT EXISTS idx_master_pricebook_services_business_unit_id
    ON master.pricebook_services (business_unit_id);
CREATE INDEX IF NOT EXISTS idx_master_pricebook_services_external_id
    ON master.pricebook_services (external_id);
CREATE INDEX IF NOT EXISTS idx_master_pricebook_services_active
    ON master.pricebook_services (active);
CREATE INDEX IF NOT EXISTS idx_master_pricebook_services_synced
    ON master.pricebook_services (synced_at DESC);

-- ===========================================
-- PROJECT_STATUSES
-- ===========================================
-- Source: 7 sample records
-- Fields: 3 top-level (4 total including nested)

CREATE TABLE IF NOT EXISTS master.project_statuses (
    id BIGSERIAL PRIMARY KEY,
    st_id BIGINT NOT NULL UNIQUE,

    modified_on TIMESTAMPTZ,  -- Samples: "2024-05-21T21:05:31.3905103Z", "2024-05-21T21:05:31.3908565...
    name TEXT,  -- Samples: "Pending Scheduling", "Scheduled", "In Progress"
    order INT,  -- Samples: 0, 1, 2

    -- Sync tracking
    synced_at TIMESTAMPTZ NOT NULL,
    sync_batch_id UUID NOT NULL,
    payload_hash TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_master_project_statuses_st_id
    ON master.project_statuses (st_id);
CREATE INDEX IF NOT EXISTS idx_master_project_statuses_synced
    ON master.project_statuses (synced_at DESC);

-- ===========================================
-- PROJECT_TYPES
-- ===========================================
-- Source: 6 sample records
-- Fields: 3 top-level (4 total including nested)

CREATE TABLE IF NOT EXISTS master.project_types (
    id BIGSERIAL PRIMARY KEY,
    st_id BIGINT NOT NULL UNIQUE,

    created_by_id INT,  -- Samples: 26
    description TEXT,  -- Samples: "For projects that are in bid status", "For service projects...
    name TEXT,  -- Samples: "Sales", "Service", "Install"

    -- Sync tracking
    synced_at TIMESTAMPTZ NOT NULL,
    sync_batch_id UUID NOT NULL,
    payload_hash TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_master_project_types_st_id
    ON master.project_types (st_id);
CREATE INDEX IF NOT EXISTS idx_master_project_types_created_by_id
    ON master.project_types (created_by_id);
CREATE INDEX IF NOT EXISTS idx_master_project_types_synced
    ON master.project_types (synced_at DESC);

-- ===========================================
-- PROJECTS
-- ===========================================
-- Source: 100 sample records
-- Fields: 20 top-level (21 total including nested)

CREATE TABLE IF NOT EXISTS master.projects (
    id BIGSERIAL PRIMARY KEY,
    st_id BIGINT NOT NULL UNIQUE,

    actual_completion_date TEXT,
    business_unit_ids JSONB,
    created_on TIMESTAMPTZ,  -- Samples: "2024-07-10T17:54:19.4471957Z", "2024-07-11T15:09:43.3087568...
    customer_id INT,  -- Samples: 1185017, 1184949, 1184730
    custom_fields JSONB,
    external_data TEXT,
    job_ids JSONB,
    location_id INT,  -- Samples: 7866173, 7872634, 7872250
    modified_on TIMESTAMPTZ,  -- Samples: "2024-08-12T03:37:50.5860964Z", "2024-09-02T02:23:43.8471638...
    name TEXT,  -- Samples: "Olaughlin", "PCS - DJ", "PCS - Daniel"
    number TEXT,  -- Samples: "7865802", "7872290", "7873777"
    project_manager_ids JSONB,
    project_type_id INT,  -- Samples: 61280, 1184, 1185
    start_date TIMESTAMPTZ,  -- Samples: "2024-07-11T00:00:00Z", "2024-07-15T00:00:00Z", "2024-07-12T...
    status TEXT,  -- Samples: "Completed", "Canceled", "Pending Scheduling"
    status_id INT,  -- Samples: 218, 220, 215
    sub_status TEXT,  -- Samples: "Pending Customer Confirmation", "Estimate Won", "Delayed"
    sub_status_id INT,  -- Samples: 53515181, 53289592, 53289596
    summary TEXT,  -- Samples: "Automation - Heat pump and gas heater install", "", "Pool A...
    target_completion_date TIMESTAMPTZ,  -- Samples: "2024-08-07T00:00:00Z", "2024-07-12T00:00:00Z", "2024-07-23T...

    -- Sync tracking
    synced_at TIMESTAMPTZ NOT NULL,
    sync_batch_id UUID NOT NULL,
    payload_hash TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_master_projects_st_id
    ON master.projects (st_id);
CREATE INDEX IF NOT EXISTS idx_master_projects_customer_id
    ON master.projects (customer_id);
CREATE INDEX IF NOT EXISTS idx_master_projects_location_id
    ON master.projects (location_id);
CREATE INDEX IF NOT EXISTS idx_master_projects_project_type_id
    ON master.projects (project_type_id);
CREATE INDEX IF NOT EXISTS idx_master_projects_status_id
    ON master.projects (status_id);
CREATE INDEX IF NOT EXISTS idx_master_projects_sub_status_id
    ON master.projects (sub_status_id);
CREATE INDEX IF NOT EXISTS idx_master_projects_status
    ON master.projects (status);
CREATE INDEX IF NOT EXISTS idx_master_projects_synced
    ON master.projects (synced_at DESC);

-- ===========================================
-- PURCHASE_ORDER_TYPES
-- ===========================================
-- Source: 10 sample records
-- Fields: 11 top-level (12 total including nested)

CREATE TABLE IF NOT EXISTS master.purchase_order_types (
    id BIGSERIAL PRIMARY KEY,
    st_id BIGINT NOT NULL UNIQUE,

    active BOOLEAN,  -- Samples: true
    allow_technicians_to_send_po BOOLEAN,  -- Samples: false, true
    automatically_receive BOOLEAN,  -- Samples: false, true
    created_on TIMESTAMPTZ,  -- Samples: "2024-05-21T21:05:30.9689773Z", "2024-10-20T03:07:01.856674Z...
    default_required_date_days_offset INT,  -- Samples: 0
    display_to_technician BOOLEAN,  -- Samples: true, false
    exclude_tax_from_job_costing BOOLEAN,  -- Samples: false
    impact_to_technician_payroll BOOLEAN,  -- Samples: false
    modified_on TIMESTAMPTZ,  -- Samples: "2024-05-21T21:05:36.2803112Z", "2024-10-20T03:07:01.856674Z...
    name TEXT,  -- Samples: "Supply House Run", "Subcontractor", "Special Order"
    skip_weekends BOOLEAN,  -- Samples: true

    -- Sync tracking
    synced_at TIMESTAMPTZ NOT NULL,
    sync_batch_id UUID NOT NULL,
    payload_hash TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_master_purchase_order_types_st_id
    ON master.purchase_order_types (st_id);
CREATE INDEX IF NOT EXISTS idx_master_purchase_order_types_active
    ON master.purchase_order_types (active);
CREATE INDEX IF NOT EXISTS idx_master_purchase_order_types_synced
    ON master.purchase_order_types (synced_at DESC);

-- ===========================================
-- PURCHASE_ORDERS
-- ===========================================
-- Source: 100 sample records
-- Fields: 26 top-level (50 total including nested)

CREATE TABLE IF NOT EXISTS master.purchase_orders (
    id BIGSERIAL PRIMARY KEY,
    st_id BIGINT NOT NULL UNIQUE,

    batch_id TEXT,
    budget_code_id TEXT,
    business_unit_id INT,  -- Samples: 4622, 4623, 1308
    created_on TIMESTAMPTZ,  -- Samples: "2026-01-19T21:34:47.5731358Z", "2025-12-09T20:54:02.0513935...
    custom_fields TEXT,
    date TIMESTAMPTZ,  -- Samples: "2026-01-19T00:00:00Z", "2025-12-09T00:00:00Z", "2025-12-08T...
    inventory_location_id INT,  -- Samples: 248, 58914438, 5762
    invoice_id INT,  -- Samples: 62222612, 61984016, 61639947
    items JSONB,
    job_id INT,  -- Samples: 62222609, 61984013, 61639944
    modified_on TIMESTAMPTZ,  -- Samples: "2026-01-19T21:35:32.7892819Z", "2025-12-09T20:54:29.7849793...
    number TEXT,  -- Samples: "62818062", "62298758", "62288649"
    project_id INT,  -- Samples: 62821948, 62207406, 62213776
    received_on TIMESTAMPTZ,  -- Samples: "2025-11-03T00:00:00Z", "2025-11-02T00:00:00Z", "2025-10-22T...
    required_on TIMESTAMPTZ,  -- Samples: "2026-01-19T00:00:00Z", "2025-12-09T00:00:00Z", "2025-12-08T...
    sent_on TIMESTAMPTZ,  -- Samples: "2026-01-19T00:00:00Z", "2025-12-09T00:00:00Z", "2025-12-03T...
    shipping DECIMAL(12,2),  -- Samples: 0, 1.67, 99
    ship_to JSONB,
    status TEXT,  -- Samples: "Sent", "Canceled", "Received"
    summary TEXT,  -- Samples: "Please deliver to Perfect Catch Shop on Walsingham", "Pleas...
    tax DECIMAL(12,2),  -- Samples: 218.37, 64.03, 0
    technician_id INT,  -- Samples: 59011, 55810, 60616473
    total DECIMAL(12,2),  -- Samples: 3337.96, 978.76, 10.11
    type_id INT,  -- Samples: 57432326, 170, 53154317
    vendor_document_number TEXT,
    vendor_id INT,  -- Samples: 32139, 9858, 55419938

    -- Sync tracking
    synced_at TIMESTAMPTZ NOT NULL,
    sync_batch_id UUID NOT NULL,
    payload_hash TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_master_purchase_orders_st_id
    ON master.purchase_orders (st_id);
CREATE INDEX IF NOT EXISTS idx_master_purchase_orders_batch_id
    ON master.purchase_orders (batch_id);
CREATE INDEX IF NOT EXISTS idx_master_purchase_orders_budget_code_id
    ON master.purchase_orders (budget_code_id);
CREATE INDEX IF NOT EXISTS idx_master_purchase_orders_business_unit_id
    ON master.purchase_orders (business_unit_id);
CREATE INDEX IF NOT EXISTS idx_master_purchase_orders_inventory_location_id
    ON master.purchase_orders (inventory_location_id);
CREATE INDEX IF NOT EXISTS idx_master_purchase_orders_invoice_id
    ON master.purchase_orders (invoice_id);
CREATE INDEX IF NOT EXISTS idx_master_purchase_orders_job_id
    ON master.purchase_orders (job_id);
CREATE INDEX IF NOT EXISTS idx_master_purchase_orders_project_id
    ON master.purchase_orders (project_id);
CREATE INDEX IF NOT EXISTS idx_master_purchase_orders_technician_id
    ON master.purchase_orders (technician_id);
CREATE INDEX IF NOT EXISTS idx_master_purchase_orders_type_id
    ON master.purchase_orders (type_id);
CREATE INDEX IF NOT EXISTS idx_master_purchase_orders_vendor_id
    ON master.purchase_orders (vendor_id);
CREATE INDEX IF NOT EXISTS idx_master_purchase_orders_status
    ON master.purchase_orders (status);
CREATE INDEX IF NOT EXISTS idx_master_purchase_orders_synced
    ON master.purchase_orders (synced_at DESC);

-- ===========================================
-- RECEIPTS
-- ===========================================
-- Source: 100 sample records
-- Fields: 25 top-level (56 total including nested)

CREATE TABLE IF NOT EXISTS master.receipts (
    id BIGSERIAL PRIMARY KEY,
    st_id BIGINT NOT NULL UNIQUE,

    active BOOLEAN,  -- Samples: true
    batch_id TEXT,
    bill_id INT,  -- Samples: 61683078, 61657094, 61153670
    budget_code_id TEXT,
    business_unit_id INT,  -- Samples: 4623, 26143, 54670601
    created_by_id INT,  -- Samples: 26, 4613
    created_on TIMESTAMPTZ,  -- Samples: "2025-11-04T01:33:11.8431674Z", "2025-11-03T02:53:10.2652009...
    custom_fields TEXT,
    inventory_location_id INT,  -- Samples: 53670278, 248, 59275430
    items JSONB,
    job_id INT,  -- Samples: 61639944, 60621958, 61075990
    memo TEXT,  -- Samples: "Please deliver to Perfect Catch Shop on Walsingham", "Pleas...
    modified_on TIMESTAMPTZ,  -- Samples: "2025-11-04T01:33:11.9239967Z", "2025-11-03T02:53:10.9154484...
    number TEXT,  -- Samples: "61639944-001-R1", "61616390-R1", "60621958-001-R1"
    purchase_order_id INT,  -- Samples: 61656863, 61616390, 61153414
    receipt_amount DECIMAL(12,2),  -- Samples: 3508.13, 1151.16, 63.98
    received_on TIMESTAMPTZ,  -- Samples: "2025-11-03T00:00:00Z", "2025-11-02T00:00:00Z", "2025-10-22T...
    shipping_amount DECIMAL(12,2),  -- Samples: 0, 1.67, 99
    ship_to JSONB,
    ship_to_description TEXT,  -- Samples: "Scott Tran ", "Shop", "Vendor Counter Pickup"
    sync_status TEXT,  -- Samples: "Pending"
    tax_amount DECIMAL(12,2),  -- Samples: 229.5, 75.31, 4.19
    technician_id INT,  -- Samples: 59011, 55810, 60616473
    vendor_id INT,  -- Samples: 9858, 578, 8577
    vendor_invoice_number TEXT,  -- Samples: "55006974", "55963530", "H6364-446604"

    -- Sync tracking
    synced_at TIMESTAMPTZ NOT NULL,
    sync_batch_id UUID NOT NULL,
    payload_hash TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_master_receipts_st_id
    ON master.receipts (st_id);
CREATE INDEX IF NOT EXISTS idx_master_receipts_batch_id
    ON master.receipts (batch_id);
CREATE INDEX IF NOT EXISTS idx_master_receipts_bill_id
    ON master.receipts (bill_id);
CREATE INDEX IF NOT EXISTS idx_master_receipts_budget_code_id
    ON master.receipts (budget_code_id);
CREATE INDEX IF NOT EXISTS idx_master_receipts_business_unit_id
    ON master.receipts (business_unit_id);
CREATE INDEX IF NOT EXISTS idx_master_receipts_created_by_id
    ON master.receipts (created_by_id);
CREATE INDEX IF NOT EXISTS idx_master_receipts_inventory_location_id
    ON master.receipts (inventory_location_id);
CREATE INDEX IF NOT EXISTS idx_master_receipts_job_id
    ON master.receipts (job_id);
CREATE INDEX IF NOT EXISTS idx_master_receipts_purchase_order_id
    ON master.receipts (purchase_order_id);
CREATE INDEX IF NOT EXISTS idx_master_receipts_technician_id
    ON master.receipts (technician_id);
CREATE INDEX IF NOT EXISTS idx_master_receipts_vendor_id
    ON master.receipts (vendor_id);
CREATE INDEX IF NOT EXISTS idx_master_receipts_active
    ON master.receipts (active);
CREATE INDEX IF NOT EXISTS idx_master_receipts_synced
    ON master.receipts (synced_at DESC);

-- ===========================================
-- REMITTANCE_VENDORS
-- ===========================================
-- Source: 40 sample records
-- Fields: 9 top-level (21 total including nested)

CREATE TABLE IF NOT EXISTS master.remittance_vendors (
    id BIGSERIAL PRIMARY KEY,
    st_id BIGINT NOT NULL UNIQUE,

    active BOOLEAN,  -- Samples: true
    address JSONB,
    contact_info JSONB,
    created_on TIMESTAMPTZ,  -- Samples: "2024-09-24T14:01:01.9140232Z", "2024-05-24T01:36:17.2606147...
    customer_id TEXT,
    is_approved BOOLEAN,  -- Samples: false
    is_verified BOOLEAN,  -- Samples: false
    modified_on TIMESTAMPTZ,  -- Samples: "2024-09-24T14:01:01.9140232Z", "2024-05-24T01:36:17.2606147...
    name TEXT,  -- Samples: "ACE HARDWARE ", "Amazon", "AMP"

    -- Sync tracking
    synced_at TIMESTAMPTZ NOT NULL,
    sync_batch_id UUID NOT NULL,
    payload_hash TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_master_remittance_vendors_st_id
    ON master.remittance_vendors (st_id);
CREATE INDEX IF NOT EXISTS idx_master_remittance_vendors_customer_id
    ON master.remittance_vendors (customer_id);
CREATE INDEX IF NOT EXISTS idx_master_remittance_vendors_active
    ON master.remittance_vendors (active);
CREATE INDEX IF NOT EXISTS idx_master_remittance_vendors_synced
    ON master.remittance_vendors (synced_at DESC);

-- ===========================================
-- REPORT_CATEGORIES
-- ===========================================
-- Source: 12 sample records
-- Fields: 1 top-level (2 total including nested)

CREATE TABLE IF NOT EXISTS master.report_categories (
    id BIGSERIAL PRIMARY KEY,
    st_id BIGINT NOT NULL UNIQUE,

    name TEXT,  -- Samples: "Marketing", "Operations", "Accounting"

    -- Sync tracking
    synced_at TIMESTAMPTZ NOT NULL,
    sync_batch_id UUID NOT NULL,
    payload_hash TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_master_report_categories_st_id
    ON master.report_categories (st_id);
CREATE INDEX IF NOT EXISTS idx_master_report_categories_synced
    ON master.report_categories (synced_at DESC);

-- ===========================================
-- RETURNS
-- ===========================================
-- Source: 42 sample records
-- Fields: 30 top-level (63 total including nested)

CREATE TABLE IF NOT EXISTS master.returns (
    id BIGSERIAL PRIMARY KEY,
    st_id BIGINT NOT NULL UNIQUE,

    active BOOLEAN,  -- Samples: true
    batch JSONB,
    batch_id INT,  -- Samples: 61651574, 55114397, 54881345
    budget_code_id TEXT,
    business_unit_id INT,  -- Samples: 4623, 1308, 54670601
    canceled_by_id TEXT,
    canceled_reason TEXT,
    created_by_id INT,  -- Samples: 4613
    created_on TIMESTAMPTZ,  -- Samples: "2025-10-07T13:03:31.4449761Z", "2025-09-25T12:34:22.7737681...
    credit_received_on TIMESTAMPTZ,  -- Samples: "2025-10-07T00:00:00Z", "2025-09-25T00:00:00Z", "2025-08-21T...
    custom_fields TEXT,
    date_canceled TEXT,
    external_data TEXT,
    inventory_location_id INT,  -- Samples: 248, 5762, 57586182
    items JSONB,
    job_id INT,  -- Samples: 60720906, 57873858, 57441143
    memo TEXT,  -- Samples: "CITY CREDIT # WB1/049695", "ORIGINAL PO#53582093 ", "ORIGIN...
    modified_on TIMESTAMPTZ,  -- Samples: "2025-11-02T01:10:53.8590196Z", "2024-12-18T07:26:43.7755849...
    number TEXT,  -- Samples: "44", "43", "41"
    project_id INT,  -- Samples: 60703372, 59332486, 57879611
    purchase_order_id INT,  -- Samples: 60293259, 59384198, 58023559
    reference_number TEXT,  -- Samples: "55961238", "213762", "1104-1099970"
    return_amount DECIMAL(12,2),  -- Samples: 983.84, 337.06, 119.52
    return_date TIMESTAMPTZ,  -- Samples: "2025-10-06T00:00:00Z", "2025-09-25T00:00:00Z", "2025-08-21T...
    returned_on TIMESTAMPTZ,  -- Samples: "2025-10-07T00:00:00Z", "2025-09-25T00:00:00Z", "2025-08-21T...
    shipping_amount INT,  -- Samples: 0
    status TEXT,  -- Samples: "CreditReceived"
    sync_status TEXT,  -- Samples: "Exported"
    tax_amount DECIMAL(12,2),  -- Samples: 64.36, 22.05, 7.82
    vendor_id INT,  -- Samples: 9858, 8577, 8833

    -- Sync tracking
    synced_at TIMESTAMPTZ NOT NULL,
    sync_batch_id UUID NOT NULL,
    payload_hash TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_master_returns_st_id
    ON master.returns (st_id);
CREATE INDEX IF NOT EXISTS idx_master_returns_batch_id
    ON master.returns (batch_id);
CREATE INDEX IF NOT EXISTS idx_master_returns_budget_code_id
    ON master.returns (budget_code_id);
CREATE INDEX IF NOT EXISTS idx_master_returns_business_unit_id
    ON master.returns (business_unit_id);
CREATE INDEX IF NOT EXISTS idx_master_returns_canceled_by_id
    ON master.returns (canceled_by_id);
CREATE INDEX IF NOT EXISTS idx_master_returns_created_by_id
    ON master.returns (created_by_id);
CREATE INDEX IF NOT EXISTS idx_master_returns_inventory_location_id
    ON master.returns (inventory_location_id);
CREATE INDEX IF NOT EXISTS idx_master_returns_job_id
    ON master.returns (job_id);
CREATE INDEX IF NOT EXISTS idx_master_returns_project_id
    ON master.returns (project_id);
CREATE INDEX IF NOT EXISTS idx_master_returns_purchase_order_id
    ON master.returns (purchase_order_id);
CREATE INDEX IF NOT EXISTS idx_master_returns_vendor_id
    ON master.returns (vendor_id);
CREATE INDEX IF NOT EXISTS idx_master_returns_status
    ON master.returns (status);
CREATE INDEX IF NOT EXISTS idx_master_returns_active
    ON master.returns (active);
CREATE INDEX IF NOT EXISTS idx_master_returns_synced
    ON master.returns (synced_at DESC);

-- ===========================================
-- TAG_TYPES
-- ===========================================
-- Source: 95 sample records
-- Fields: 10 top-level (11 total including nested)

CREATE TABLE IF NOT EXISTS master.tag_types (
    id BIGSERIAL PRIMARY KEY,
    st_id BIGINT NOT NULL UNIQUE,

    active BOOLEAN,  -- Samples: true
    allow_to_use_on_timesheet_activity BOOLEAN,  -- Samples: false
    code TEXT,  -- Samples: "DNS", "🔥", "🔎"
    color TEXT,  -- Samples: "#F94D32", "#E73030", "#2270EE"
    created_on TIMESTAMPTZ,  -- Samples: "2024-05-21T21:05:42.3598177Z", "2024-05-21T21:05:42.3983108...
    importance TEXT,  -- Samples: "High", "Medium"
    is_conversion_opportunity BOOLEAN,  -- Samples: false, true
    is_visible_on_dispatch_board BOOLEAN,  -- Samples: true, false
    modified_on TIMESTAMPTZ,  -- Samples: "2024-11-26T18:52:08.0977214Z", "2025-08-15T14:10:45.2111553...
    name TEXT,  -- Samples: "Do Not Service", "High Value Job 🔥", "Inspection 🔎"

    -- Sync tracking
    synced_at TIMESTAMPTZ NOT NULL,
    sync_batch_id UUID NOT NULL,
    payload_hash TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_master_tag_types_st_id
    ON master.tag_types (st_id);
CREATE INDEX IF NOT EXISTS idx_master_tag_types_active
    ON master.tag_types (active);
CREATE INDEX IF NOT EXISTS idx_master_tag_types_synced
    ON master.tag_types (synced_at DESC);

-- ===========================================
-- TASKS
-- ===========================================
-- Source: 100 sample records
-- Fields: 30 top-level (42 total including nested)

CREATE TABLE IF NOT EXISTS master.tasks (
    id BIGSERIAL PRIMARY KEY,
    st_id BIGINT NOT NULL UNIQUE,

    active BOOLEAN,  -- Samples: true
    assigned_to_id INT,  -- Samples: 26, 4609, 4613
    attachments JSONB,
    business_unit_id INT,  -- Samples: 4623, 1308, 26143
    closed_on TIMESTAMPTZ,  -- Samples: "2024-07-28T02:58:31.6145007Z", "2024-07-18T20:03:50.8151791...
    comments JSONB,
    complete_by TIMESTAMPTZ,  -- Samples: "2024-07-12T00:00:00Z", "2024-07-31T00:00:00Z", "2024-08-12T...
    created_on TIMESTAMPTZ,  -- Samples: "2024-07-11T22:57:35.5257129Z", "2024-07-11T23:31:53.8399577...
    customer_id INT,  -- Samples: 1184730, 1184781, 1184773
    customer_name TEXT,  -- Samples: "Gulfstream Pools & Spas- Main", "Joe kelly", "jenkins"
    description TEXT,  -- Samples: "2Pol20 GFCI", "Customer Not Happy need to order parts", "Co...
    description_modified_by_id INT,  -- Samples: 26, 4609, 53592074
    description_modified_on TIMESTAMPTZ,  -- Samples: "2024-07-11T22:57:35.526029Z", "2024-07-11T23:31:53.8402797Z...
    employee_task_resolution_id INT,  -- Samples: 52976303, 510, 52968161
    employee_task_source_id INT,  -- Samples: 506, 505
    employee_task_type_id INT,  -- Samples: 52967140, 507, 52982033
    involved_employee_id_list JSONB,
    is_closed BOOLEAN,  -- Samples: true
    job_id INT,  -- Samples: 7871814, 52967121, 7870944
    job_number TEXT,  -- Samples: "7871814", "52967121", "7870944"
    modified_on TIMESTAMPTZ,  -- Samples: "2024-07-11T22:57:35.526029Z", "2024-07-11T23:31:53.8402797Z...
    name TEXT,  -- Samples: "Need To Order Breaker", "Order Parts", "Order Part for Hunt...
    priority TEXT,  -- Samples: "Normal", "High", "Low"
    project_id INT,  -- Samples: 52967103, 53139107, 53111269
    refund_issued TEXT,
    reported_by_id INT,  -- Samples: 26, 4609, 53592074
    reported_on TIMESTAMPTZ,  -- Samples: "2024-07-11T00:00:00Z", "2024-07-12T00:00:00Z", "2024-07-14T...
    status TEXT,  -- Samples: "Completed"
    sub_tasks_data JSONB,
    task_number INT,  -- Samples: 1, 2, 3

    -- Sync tracking
    synced_at TIMESTAMPTZ NOT NULL,
    sync_batch_id UUID NOT NULL,
    payload_hash TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_master_tasks_st_id
    ON master.tasks (st_id);
CREATE INDEX IF NOT EXISTS idx_master_tasks_assigned_to_id
    ON master.tasks (assigned_to_id);
CREATE INDEX IF NOT EXISTS idx_master_tasks_business_unit_id
    ON master.tasks (business_unit_id);
CREATE INDEX IF NOT EXISTS idx_master_tasks_customer_id
    ON master.tasks (customer_id);
CREATE INDEX IF NOT EXISTS idx_master_tasks_description_modified_by_id
    ON master.tasks (description_modified_by_id);
CREATE INDEX IF NOT EXISTS idx_master_tasks_employee_task_resolution_id
    ON master.tasks (employee_task_resolution_id);
CREATE INDEX IF NOT EXISTS idx_master_tasks_employee_task_source_id
    ON master.tasks (employee_task_source_id);
CREATE INDEX IF NOT EXISTS idx_master_tasks_employee_task_type_id
    ON master.tasks (employee_task_type_id);
CREATE INDEX IF NOT EXISTS idx_master_tasks_job_id
    ON master.tasks (job_id);
CREATE INDEX IF NOT EXISTS idx_master_tasks_project_id
    ON master.tasks (project_id);
CREATE INDEX IF NOT EXISTS idx_master_tasks_reported_by_id
    ON master.tasks (reported_by_id);
CREATE INDEX IF NOT EXISTS idx_master_tasks_status
    ON master.tasks (status);
CREATE INDEX IF NOT EXISTS idx_master_tasks_active
    ON master.tasks (active);
CREATE INDEX IF NOT EXISTS idx_master_tasks_synced
    ON master.tasks (synced_at DESC);

-- ===========================================
-- TAX_ZONES
-- ===========================================
-- Source: 0 sample records
-- Fields: 0 top-level (0 total including nested)

CREATE TABLE IF NOT EXISTS master.tax_zones (
    id BIGSERIAL PRIMARY KEY,


    -- Sync tracking
    synced_at TIMESTAMPTZ NOT NULL,
    sync_batch_id UUID NOT NULL,
    payload_hash TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_master_tax_zones_synced
    ON master.tax_zones (synced_at DESC);

-- ===========================================
-- TEAMS
-- ===========================================
-- Source: 6 sample records
-- Fields: 5 top-level (6 total including nested)

CREATE TABLE IF NOT EXISTS master.teams (
    id BIGSERIAL PRIMARY KEY,
    st_id BIGINT NOT NULL UNIQUE,

    active BOOLEAN,  -- Samples: true
    created_by INT,  -- Samples: 26, 4617, 60030086
    created_on TIMESTAMPTZ,  -- Samples: "2024-07-08T17:11:42.1900849Z", "2024-07-08T18:46:08.3941565...
    modified_on TIMESTAMPTZ,  -- Samples: "2025-09-23T10:59:38.0650897Z", "2025-08-14T16:56:17.0561181...
    name TEXT,  -- Samples: "POOL- INSTALL", "SALES", "ELECTRICAL - SERVICE/ DIAGNOSTIC"

    -- Sync tracking
    synced_at TIMESTAMPTZ NOT NULL,
    sync_batch_id UUID NOT NULL,
    payload_hash TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_master_teams_st_id
    ON master.teams (st_id);
CREATE INDEX IF NOT EXISTS idx_master_teams_active
    ON master.teams (active);
CREATE INDEX IF NOT EXISTS idx_master_teams_synced
    ON master.teams (synced_at DESC);

-- ===========================================
-- TECHNICIAN_SHIFTS
-- ===========================================
-- Source: 100 sample records
-- Fields: 10 top-level (11 total including nested)

CREATE TABLE IF NOT EXISTS master.technician_shifts (
    id BIGSERIAL PRIMARY KEY,
    st_id BIGINT NOT NULL UNIQUE,

    active BOOLEAN,  -- Samples: true
    created_on TIMESTAMPTZ,  -- Samples: "2024-06-02T04:24:48.8347975Z", "2024-06-02T04:24:48.8384578...
    end TIMESTAMPTZ,  -- Samples: "2024-06-03T21:00:00Z", "2024-06-04T21:00:00Z", "2024-06-05T...
    modified_on TIMESTAMPTZ,  -- Samples: "2024-07-08T14:44:59.097104Z", "2024-07-22T04:03:26.4952014Z...
    note TEXT,
    shift_type TEXT,  -- Samples: "OnCall", "Normal"
    start TIMESTAMPTZ,  -- Samples: "2024-06-03T11:30:00Z", "2024-06-04T11:30:00Z", "2024-06-05T...
    technician_id INT,  -- Samples: 4482, 12161, 55810
    timesheet_code_id TEXT,
    title TEXT,  -- Samples: "Electrical Service Techs", "Kurt Working", "Default Shift"

    -- Sync tracking
    synced_at TIMESTAMPTZ NOT NULL,
    sync_batch_id UUID NOT NULL,
    payload_hash TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_master_technician_shifts_st_id
    ON master.technician_shifts (st_id);
CREATE INDEX IF NOT EXISTS idx_master_technician_shifts_technician_id
    ON master.technician_shifts (technician_id);
CREATE INDEX IF NOT EXISTS idx_master_technician_shifts_timesheet_code_id
    ON master.technician_shifts (timesheet_code_id);
CREATE INDEX IF NOT EXISTS idx_master_technician_shifts_active
    ON master.technician_shifts (active);
CREATE INDEX IF NOT EXISTS idx_master_technician_shifts_synced
    ON master.technician_shifts (synced_at DESC);

-- ===========================================
-- TECHNICIANS
-- ===========================================
-- Source: 9 sample records
-- Fields: 22 top-level (34 total including nested)

CREATE TABLE IF NOT EXISTS master.technicians (
    id BIGSERIAL PRIMARY KEY,
    st_id BIGINT NOT NULL UNIQUE,

    aad_user_id TEXT,
    account_locked BOOLEAN,  -- Samples: false
    active BOOLEAN,  -- Samples: true
    burden_rate DECIMAL(12,2),  -- Samples: 28, 5, 0
    business_unit_id INT,  -- Samples: 1310, 1308, 4622
    created_on TIMESTAMPTZ,  -- Samples: "2024-05-25T22:59:14.6758977Z", "2024-06-25T16:51:39.8937673...
    custom_fields JSONB,
    daily_goal INT,  -- Samples: 3500, 1000, 2500
    email TEXT,  -- Samples: "Jade@callperfectcatch.com", "Yanni@livpools.com", "dylanrad...
    home JSONB,
    is_managed_tech BOOLEAN,  -- Samples: true, false
    job_filter TEXT,  -- Samples: "AllScheduledDispatchedWorking", "AllScheduledDispatchedWork...
    login_name TEXT,  -- Samples: "YRJade", "KurtYr", "yrbuild24"
    main_zone_id INT,  -- Samples: 54978696
    modified_on TIMESTAMPTZ,  -- Samples: "2026-01-20T19:48:42.6369301Z", "2026-01-21T13:36:07.2966822...
    name TEXT,  -- Samples: "Jade Schweiberger", "Kurt R", "Yanni Ramos"
    permissions JSONB,
    phone_number TEXT,  -- Samples: "8135416921", "8135579962", "7274304710"
    role_ids JSONB,
    team TEXT,  -- Samples: "SALES", "POOL- INSTALL", "ELECTRICAL - SERVICE/ DIAGNOSTIC"
    user_id INT,  -- Samples: 12417, 55810, 59011
    zone_ids JSONB,

    -- Sync tracking
    synced_at TIMESTAMPTZ NOT NULL,
    sync_batch_id UUID NOT NULL,
    payload_hash TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_master_technicians_st_id
    ON master.technicians (st_id);
CREATE INDEX IF NOT EXISTS idx_master_technicians_aad_user_id
    ON master.technicians (aad_user_id);
CREATE INDEX IF NOT EXISTS idx_master_technicians_business_unit_id
    ON master.technicians (business_unit_id);
CREATE INDEX IF NOT EXISTS idx_master_technicians_main_zone_id
    ON master.technicians (main_zone_id);
CREATE INDEX IF NOT EXISTS idx_master_technicians_user_id
    ON master.technicians (user_id);
CREATE INDEX IF NOT EXISTS idx_master_technicians_active
    ON master.technicians (active);
CREATE INDEX IF NOT EXISTS idx_master_technicians_synced
    ON master.technicians (synced_at DESC);

-- ===========================================
-- TIMESHEET_ACTIVITIES
-- ===========================================
-- Source: 100 sample records
-- Fields: 19 top-level (24 total including nested)

CREATE TABLE IF NOT EXISTS master.timesheet_activities (
    id BIGSERIAL PRIMARY KEY,
    st_id BIGINT NOT NULL UNIQUE,

    active BOOLEAN,  -- Samples: true
    activity_type_id INT,  -- Samples: 54635935, 54635932, 54629815
    appointment_id INT,  -- Samples: 54167082, 54160836, 54167055
    budget_code_id TEXT,
    created_on TIMESTAMPTZ,  -- Samples: "2024-11-04T15:39:38.0029931Z", "2024-11-04T18:34:06.5383584...
    employee_id INT,  -- Samples: 53840526, 14721, 15105
    employee_type TEXT,  -- Samples: "Technician"
    end_coordinate JSONB,
    end_time TIMESTAMPTZ,  -- Samples: "2024-11-04T17:09:00Z", "2024-11-04T22:06:00Z", "2024-11-05T...
    job_id INT,  -- Samples: 54156813, 54160835, 54167054
    labor_type_id INT,  -- Samples: 2024208, 71025, 53042293
    memo TEXT,  -- Samples: ""
    modified_by_id INT,  -- Samples: 53840526, 14721, 55810
    modified_on TIMESTAMPTZ,  -- Samples: "2024-11-04T17:09:48.7533005Z", "2024-11-04T22:06:43.31675Z"...
    project_id INT,  -- Samples: 54055137, 53841106, 54166943
    project_label TEXT,
    start_coordinate JSONB,
    start_time TIMESTAMPTZ,  -- Samples: "2024-11-04T15:39:00Z", "2024-11-04T18:34:00Z", "2024-11-05T...
    tag_types JSONB,

    -- Sync tracking
    synced_at TIMESTAMPTZ NOT NULL,
    sync_batch_id UUID NOT NULL,
    payload_hash TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_master_timesheet_activities_st_id
    ON master.timesheet_activities (st_id);
CREATE INDEX IF NOT EXISTS idx_master_timesheet_activities_activity_type_id
    ON master.timesheet_activities (activity_type_id);
CREATE INDEX IF NOT EXISTS idx_master_timesheet_activities_appointment_id
    ON master.timesheet_activities (appointment_id);
CREATE INDEX IF NOT EXISTS idx_master_timesheet_activities_budget_code_id
    ON master.timesheet_activities (budget_code_id);
CREATE INDEX IF NOT EXISTS idx_master_timesheet_activities_employee_id
    ON master.timesheet_activities (employee_id);
CREATE INDEX IF NOT EXISTS idx_master_timesheet_activities_job_id
    ON master.timesheet_activities (job_id);
CREATE INDEX IF NOT EXISTS idx_master_timesheet_activities_labor_type_id
    ON master.timesheet_activities (labor_type_id);
CREATE INDEX IF NOT EXISTS idx_master_timesheet_activities_modified_by_id
    ON master.timesheet_activities (modified_by_id);
CREATE INDEX IF NOT EXISTS idx_master_timesheet_activities_project_id
    ON master.timesheet_activities (project_id);
CREATE INDEX IF NOT EXISTS idx_master_timesheet_activities_active
    ON master.timesheet_activities (active);
CREATE INDEX IF NOT EXISTS idx_master_timesheet_activities_synced
    ON master.timesheet_activities (synced_at DESC);

-- ===========================================
-- TIMESHEET_ACTIVITY_CATEGORIES
-- ===========================================
-- Source: 8 sample records
-- Fields: 7 top-level (8 total including nested)

CREATE TABLE IF NOT EXISTS master.timesheet_activity_categories (
    id BIGSERIAL PRIMARY KEY,
    st_id BIGINT NOT NULL UNIQUE,

    active BOOLEAN,  -- Samples: true
    allow_edit BOOLEAN,  -- Samples: true, false
    created_on TIMESTAMPTZ,  -- Samples: "2024-11-04T13:35:44.6435011Z", "2024-11-04T13:35:44.6806747...
    is_default BOOLEAN,  -- Samples: true, false
    modified_on TIMESTAMPTZ,  -- Samples: "2024-11-04T13:35:44.6435011Z", "2024-11-04T13:35:44.6806747...
    name TEXT,  -- Samples: "Other", "Idle", "Meal"
    type TEXT,  -- Samples: "Other", "Idle", "Meal"

    -- Sync tracking
    synced_at TIMESTAMPTZ NOT NULL,
    sync_batch_id UUID NOT NULL,
    payload_hash TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_master_timesheet_activity_categories_st_id
    ON master.timesheet_activity_categories (st_id);
CREATE INDEX IF NOT EXISTS idx_master_timesheet_activity_categories_type
    ON master.timesheet_activity_categories (type);
CREATE INDEX IF NOT EXISTS idx_master_timesheet_activity_categories_active
    ON master.timesheet_activity_categories (active);
CREATE INDEX IF NOT EXISTS idx_master_timesheet_activity_categories_synced
    ON master.timesheet_activity_categories (synced_at DESC);

-- ===========================================
-- TIMESHEET_ACTIVITY_TYPES
-- ===========================================
-- Source: 27 sample records
-- Fields: 27 top-level (28 total including nested)

CREATE TABLE IF NOT EXISTS master.timesheet_activity_types (
    id BIGSERIAL PRIMARY KEY,
    st_id BIGINT NOT NULL UNIQUE,

    active BOOLEAN,  -- Samples: true
    budget_code_association TEXT,  -- Samples: "DoNotAllow", "Allow"
    business_unit_id TEXT,
    category_id INT,  -- Samples: 54629799, 54629801, 54629797
    code TEXT,  -- Samples: "Meal", "Onsite", "Meeting"
    created_on TIMESTAMPTZ,  -- Samples: "2024-11-04T13:35:44.7573623Z", "2024-11-04T13:35:44.9232323...
    default_memo TEXT,  -- Samples: ""
    default_tag_type_ids JSONB,
    description TEXT,  -- Samples: "Use this timesheet activity to track meal break.", "Use thi...
    dont_allow_to_change_memo BOOLEAN,  -- Samples: false
    dont_allow_to_change_tag BOOLEAN,  -- Samples: false
    icon TEXT,  -- Samples: "restaurant", "build", "group"
    is_archived BOOLEAN,  -- Samples: false, true
    is_default BOOLEAN,  -- Samples: true, false
    is_draft BOOLEAN,  -- Samples: false
    is_in_use BOOLEAN,  -- Samples: false
    is_technician_profile_labor_type BOOLEAN,  -- Samples: false, true
    is_users_home_business_unit BOOLEAN,  -- Samples: true
    job_association TEXT,  -- Samples: "Allow", "Require", "DoNotAllow"
    labor_type_association TEXT,  -- Samples: "DoNotAllow", "Allow"
    labor_type_id TEXT,
    memo_association TEXT,  -- Samples: "Allow", "DoNotAllow"
    modified_on TIMESTAMPTZ,  -- Samples: "2025-05-05T07:25:55.2846978Z", "2025-05-20T04:11:04.2159871...
    project_association TEXT,  -- Samples: "Allow", "DoNotAllow"
    project_label_association TEXT,  -- Samples: "DoNotAllow", "Allow"
    tag_association TEXT,  -- Samples: "Allow", "DoNotAllow"
    visible_to_roles JSONB,

    -- Sync tracking
    synced_at TIMESTAMPTZ NOT NULL,
    sync_batch_id UUID NOT NULL,
    payload_hash TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_master_timesheet_activity_types_st_id
    ON master.timesheet_activity_types (st_id);
CREATE INDEX IF NOT EXISTS idx_master_timesheet_activity_types_business_unit_id
    ON master.timesheet_activity_types (business_unit_id);
CREATE INDEX IF NOT EXISTS idx_master_timesheet_activity_types_category_id
    ON master.timesheet_activity_types (category_id);
CREATE INDEX IF NOT EXISTS idx_master_timesheet_activity_types_labor_type_id
    ON master.timesheet_activity_types (labor_type_id);
CREATE INDEX IF NOT EXISTS idx_master_timesheet_activity_types_active
    ON master.timesheet_activity_types (active);
CREATE INDEX IF NOT EXISTS idx_master_timesheet_activity_types_synced
    ON master.timesheet_activity_types (synced_at DESC);

-- ===========================================
-- TIMESHEET_CODES
-- ===========================================
-- Source: 14 sample records
-- Fields: 8 top-level (12 total including nested)

CREATE TABLE IF NOT EXISTS master.timesheet_codes (
    id BIGSERIAL PRIMARY KEY,
    st_id BIGINT NOT NULL UNIQUE,

    active BOOLEAN,  -- Samples: true
    applicable_employee_type TEXT,  -- Samples: "All", "Technician", "Employee"
    code TEXT,  -- Samples: "ClockIO", "Meal", "Training"
    created_on TIMESTAMPTZ,  -- Samples: "2024-05-21T21:05:31.7777413Z", "2024-05-21T21:05:31.7822311...
    description TEXT,  -- Samples: "Morning Meeting & Re-Stock Vehicles", "Picking Up or Droppi...
    modified_on TIMESTAMPTZ,  -- Samples: "2024-05-21T21:05:42.6358717Z", "2024-07-21T21:23:39.9125654...
    rate_info JSONB,
    type TEXT,  -- Samples: "ClockInOut", "Unpaid", "Paid"

    -- Sync tracking
    synced_at TIMESTAMPTZ NOT NULL,
    sync_batch_id UUID NOT NULL,
    payload_hash TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_master_timesheet_codes_st_id
    ON master.timesheet_codes (st_id);
CREATE INDEX IF NOT EXISTS idx_master_timesheet_codes_type
    ON master.timesheet_codes (type);
CREATE INDEX IF NOT EXISTS idx_master_timesheet_codes_active
    ON master.timesheet_codes (active);
CREATE INDEX IF NOT EXISTS idx_master_timesheet_codes_synced
    ON master.timesheet_codes (synced_at DESC);

-- ===========================================
-- TRANSFERS
-- ===========================================
-- Source: 0 sample records
-- Fields: 0 top-level (0 total including nested)

CREATE TABLE IF NOT EXISTS master.transfers (
    id BIGSERIAL PRIMARY KEY,


    -- Sync tracking
    synced_at TIMESTAMPTZ NOT NULL,
    sync_batch_id UUID NOT NULL,
    payload_hash TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_master_transfers_synced
    ON master.transfers (synced_at DESC);

-- ===========================================
-- TRUCKS
-- ===========================================
-- Source: 12 sample records
-- Fields: 8 top-level (9 total including nested)

CREATE TABLE IF NOT EXISTS master.trucks (
    id BIGSERIAL PRIMARY KEY,
    st_id BIGINT NOT NULL UNIQUE,

    active BOOLEAN,  -- Samples: true
    created_on TIMESTAMPTZ,  -- Samples: "2025-07-23T15:30:21.4362329Z", "2025-07-23T15:29:47.9958296...
    external_data TEXT,
    memo TEXT,  -- Samples: ""
    modified_on TIMESTAMPTZ,  -- Samples: "2025-09-22T11:48:01.5435614Z", "2025-07-23T15:29:48.1030513...
    name TEXT,  -- Samples: "Transit #08 - Mark", "Transit #07 - Unnassigned", "Transit ...
    technician_ids JSONB,
    warehouse_id INT,  -- Samples: 248, 5762, 57346054

    -- Sync tracking
    synced_at TIMESTAMPTZ NOT NULL,
    sync_batch_id UUID NOT NULL,
    payload_hash TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_master_trucks_st_id
    ON master.trucks (st_id);
CREATE INDEX IF NOT EXISTS idx_master_trucks_warehouse_id
    ON master.trucks (warehouse_id);
CREATE INDEX IF NOT EXISTS idx_master_trucks_active
    ON master.trucks (active);
CREATE INDEX IF NOT EXISTS idx_master_trucks_synced
    ON master.trucks (synced_at DESC);

-- ===========================================
-- USER_ROLES
-- ===========================================
-- Source: 20 sample records
-- Fields: 4 top-level (5 total including nested)

CREATE TABLE IF NOT EXISTS master.user_roles (
    id BIGSERIAL PRIMARY KEY,
    st_id BIGINT NOT NULL UNIQUE,

    active BOOLEAN,  -- Samples: true
    created_on TIMESTAMPTZ,  -- Samples: "2024-05-21T21:05:19.1059294Z", "2024-05-21T21:05:19.1076233...
    employee_type TEXT,  -- Samples: "Technician", "Employee"
    name TEXT,  -- Samples: "Technician", "Dispatch", "Accounting"

    -- Sync tracking
    synced_at TIMESTAMPTZ NOT NULL,
    sync_batch_id UUID NOT NULL,
    payload_hash TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_master_user_roles_st_id
    ON master.user_roles (st_id);
CREATE INDEX IF NOT EXISTS idx_master_user_roles_active
    ON master.user_roles (active);
CREATE INDEX IF NOT EXISTS idx_master_user_roles_synced
    ON master.user_roles (synced_at DESC);

-- ===========================================
-- VENDORS
-- ===========================================
-- Source: 43 sample records
-- Fields: 12 top-level (24 total including nested)

CREATE TABLE IF NOT EXISTS master.vendors (
    id BIGSERIAL PRIMARY KEY,
    st_id BIGINT NOT NULL UNIQUE,

    active BOOLEAN,  -- Samples: true
    address JSONB,
    contact_info JSONB,
    created_on TIMESTAMPTZ,  -- Samples: "2024-09-24T14:01:01.679369Z", "2024-05-24T01:36:17.1932918Z...
    default_tax_rate INT,  -- Samples: 7, 0
    delivery_option TEXT,  -- Samples: "MarkAsSent", "EmailAsPdf", "EmailAsPdfRollupView"
    external_data TEXT,
    is_mobile_creation_restricted BOOLEAN,  -- Samples: false, true
    is_truck_replenishment BOOLEAN,  -- Samples: true, false
    memo TEXT,  -- Samples: "", "Billing Cycle Starts & Ends on 25th of every month then...
    modified_on TIMESTAMPTZ,  -- Samples: "2026-01-20T02:08:57.9787539Z", "2025-01-19T22:50:25.9938627...
    name TEXT,  -- Samples: "ACE HARDWARE ", "Amazon", "AMP"

    -- Sync tracking
    synced_at TIMESTAMPTZ NOT NULL,
    sync_batch_id UUID NOT NULL,
    payload_hash TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_master_vendors_st_id
    ON master.vendors (st_id);
CREATE INDEX IF NOT EXISTS idx_master_vendors_active
    ON master.vendors (active);
CREATE INDEX IF NOT EXISTS idx_master_vendors_synced
    ON master.vendors (synced_at DESC);

-- ===========================================
-- WAREHOUSES
-- ===========================================
-- Source: 1 sample records
-- Fields: 6 top-level (13 total including nested)

CREATE TABLE IF NOT EXISTS master.warehouses (
    id BIGSERIAL PRIMARY KEY,
    st_id BIGINT NOT NULL UNIQUE,

    active BOOLEAN,  -- Samples: true
    address JSONB,
    created_on TIMESTAMPTZ,  -- Samples: "2024-05-21T21:05:31.4773008Z"
    external_data TEXT,
    modified_on TIMESTAMPTZ,  -- Samples: "2025-08-11T11:54:29.9262676Z"
    name TEXT,  -- Samples: "Shop"

    -- Sync tracking
    synced_at TIMESTAMPTZ NOT NULL,
    sync_batch_id UUID NOT NULL,
    payload_hash TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_master_warehouses_st_id
    ON master.warehouses (st_id);
CREATE INDEX IF NOT EXISTS idx_master_warehouses_active
    ON master.warehouses (active);
CREATE INDEX IF NOT EXISTS idx_master_warehouses_synced
    ON master.warehouses (synced_at DESC);

-- ===========================================
-- ZONES
-- ===========================================
-- Source: 12 sample records
-- Fields: 13 top-level (14 total including nested)

CREATE TABLE IF NOT EXISTS master.zones (
    id BIGSERIAL PRIMARY KEY,
    st_id BIGINT NOT NULL UNIQUE,

    active BOOLEAN,  -- Samples: true
    business_units JSONB,
    cities JSONB,
    created_by INT,  -- Samples: 4617, 26, 54809353
    created_on TIMESTAMPTZ,  -- Samples: "2024-07-08T16:49:50.4844766Z", "2024-11-23T14:39:48.3296811...
    locn_numbers JSONB,
    modified_on TIMESTAMPTZ,  -- Samples: "2025-03-16T21:34:45.6675436Z", "2025-03-16T21:36:05.6143007...
    name TEXT,  -- Samples: "South Pinellas - Service Zone", "Pool Install Zone - Pasco ...
    service_days JSONB,
    service_days_enabled BOOLEAN,  -- Samples: false, true
    technicians JSONB,
    territory_numbers JSONB,
    zips JSONB,

    -- Sync tracking
    synced_at TIMESTAMPTZ NOT NULL,
    sync_batch_id UUID NOT NULL,
    payload_hash TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_master_zones_st_id
    ON master.zones (st_id);
CREATE INDEX IF NOT EXISTS idx_master_zones_active
    ON master.zones (active);
CREATE INDEX IF NOT EXISTS idx_master_zones_synced
    ON master.zones (synced_at DESC);

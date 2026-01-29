-- ============================================
-- SUB-RESOURCE TABLES
-- For data that belongs to parent entities
-- ============================================

-- Customer Contacts
CREATE TABLE IF NOT EXISTS raw.st_customer_contacts (
    id BIGSERIAL PRIMARY KEY,
    customer_id BIGINT NOT NULL,
    payload JSONB NOT NULL,
    st_id TEXT GENERATED ALWAYS AS (payload->>'id') STORED,
    batch_id UUID NOT NULL,
    synced_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS master.customer_contacts (
    id BIGINT PRIMARY KEY,
    customer_id BIGINT NOT NULL,
    type TEXT,
    value TEXT,
    memo TEXT,
    active BOOLEAN DEFAULT true,
    synced_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_customer_contacts_customer ON master.customer_contacts(customer_id);

-- Customer Notes
CREATE TABLE IF NOT EXISTS raw.st_customer_notes (
    id BIGSERIAL PRIMARY KEY,
    customer_id BIGINT NOT NULL,
    payload JSONB NOT NULL,
    st_id TEXT GENERATED ALWAYS AS (payload->>'id') STORED,
    batch_id UUID NOT NULL,
    synced_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS master.customer_notes (
    id BIGINT PRIMARY KEY,
    customer_id BIGINT NOT NULL,
    text TEXT,
    created_by_id BIGINT,
    created_on TIMESTAMPTZ,
    pinned BOOLEAN DEFAULT false,
    synced_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_customer_notes_customer ON master.customer_notes(customer_id);

-- Job Notes
CREATE TABLE IF NOT EXISTS raw.st_job_notes (
    id BIGSERIAL PRIMARY KEY,
    job_id BIGINT NOT NULL,
    payload JSONB NOT NULL,
    st_id TEXT GENERATED ALWAYS AS (payload->>'id') STORED,
    batch_id UUID NOT NULL,
    synced_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS master.job_notes (
    id BIGINT PRIMARY KEY,
    job_id BIGINT NOT NULL,
    text TEXT,
    created_by_id BIGINT,
    created_on TIMESTAMPTZ,
    pinned BOOLEAN DEFAULT false,
    synced_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_job_notes_job ON master.job_notes(job_id);

-- Job History
CREATE TABLE IF NOT EXISTS raw.st_job_history (
    id BIGSERIAL PRIMARY KEY,
    job_id BIGINT NOT NULL,
    payload JSONB NOT NULL,
    st_id TEXT GENERATED ALWAYS AS (payload->>'id') STORED,
    batch_id UUID NOT NULL,
    synced_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS master.job_history (
    id BIGINT PRIMARY KEY,
    job_id BIGINT NOT NULL,
    event_type TEXT,
    description TEXT,
    created_by_id BIGINT,
    created_on TIMESTAMPTZ,
    synced_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_job_history_job ON master.job_history(job_id);

-- Location Equipment (Installed Equipment at locations)
CREATE TABLE IF NOT EXISTS raw.st_location_equipment (
    id BIGSERIAL PRIMARY KEY,
    location_id BIGINT NOT NULL,
    payload JSONB NOT NULL,
    st_id TEXT GENERATED ALWAYS AS (payload->>'id') STORED,
    batch_id UUID NOT NULL,
    synced_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS master.location_equipment (
    id BIGINT PRIMARY KEY,
    location_id BIGINT NOT NULL,
    customer_id BIGINT,
    name TEXT,
    equipment_type TEXT,
    manufacturer TEXT,
    model TEXT,
    serial_number TEXT,
    install_date DATE,
    warranty_end DATE,
    active BOOLEAN DEFAULT true,
    synced_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_location_equipment_location ON master.location_equipment(location_id);
CREATE INDEX IF NOT EXISTS idx_location_equipment_customer ON master.location_equipment(customer_id);

-- Add raw table protection triggers
DO $$
DECLARE
    tbl TEXT;
BEGIN
    FOREACH tbl IN ARRAY ARRAY['st_customer_contacts', 'st_customer_notes', 'st_job_notes', 'st_job_history', 'st_location_equipment']
    LOOP
        EXECUTE format('
            DROP TRIGGER IF EXISTS prevent_modify_%I ON raw.%I;
            CREATE TRIGGER prevent_modify_%I
            BEFORE UPDATE OR DELETE ON raw.%I
            FOR EACH ROW EXECUTE FUNCTION raw.prevent_modification()
        ', tbl, tbl, tbl, tbl);
    END LOOP;
END $$;

-- Add audit triggers to new master tables
DO $$
DECLARE
    tbl TEXT;
BEGIN
    FOREACH tbl IN ARRAY ARRAY['customer_contacts', 'customer_notes', 'job_notes', 'job_history', 'location_equipment']
    LOOP
        EXECUTE format('
            DROP TRIGGER IF EXISTS audit_trigger_%I ON master.%I;
            CREATE TRIGGER audit_trigger_%I
            AFTER INSERT OR UPDATE OR DELETE ON master.%I
            FOR EACH ROW EXECUTE FUNCTION audit.log_changes()
        ', tbl, tbl, tbl, tbl);
    END LOOP;
END $$;

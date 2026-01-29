-- ===========================================
-- MIGRATION 002: System Tables
-- ===========================================
-- Core system tables for tracking syncs, health, and configuration

-- Required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ===========================================
-- SYNC BATCH TRACKING
-- ===========================================
CREATE TABLE IF NOT EXISTS system.sync_batches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'running' 
        CHECK (status IN ('running', 'completed', 'failed')),
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    records_fetched INT DEFAULT 0,
    records_inserted INT DEFAULT 0,
    records_updated INT DEFAULT 0,
    records_unchanged INT DEFAULT 0,
    error_message TEXT,
    metadata JSONB DEFAULT '{}'
);

CREATE INDEX IF NOT EXISTS idx_sync_batches_entity_status 
    ON system.sync_batches (entity_type, status);
CREATE INDEX IF NOT EXISTS idx_sync_batches_completed 
    ON system.sync_batches (completed_at DESC);

-- ===========================================
-- SCHEMA VERSION TRACKING
-- ===========================================
-- Detects when ST API response structure changes
CREATE TABLE IF NOT EXISTS system.schema_versions (
    id SERIAL PRIMARY KEY,
    entity_type TEXT NOT NULL,
    version INT NOT NULL,
    schema_definition JSONB NOT NULL,
    detected_at TIMESTAMPTZ DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_schema_versions_active 
    ON system.schema_versions (entity_type) WHERE is_active = true;

-- Log schema changes when detected
CREATE TABLE IF NOT EXISTS system.schema_change_log (
    id SERIAL PRIMARY KEY,
    entity_type TEXT NOT NULL,
    detected_at TIMESTAMPTZ DEFAULT NOW(),
    old_fields JSONB,
    new_fields JSONB,
    added_fields TEXT[],
    removed_fields TEXT[],
    acknowledged BOOLEAN DEFAULT false,
    acknowledged_by TEXT,
    acknowledged_at TIMESTAMPTZ
);

-- ===========================================
-- API CONSUMERS
-- ===========================================
-- Track which services are using the internal API
CREATE TABLE IF NOT EXISTS system.api_consumers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    api_key_hash TEXT NOT NULL,
    permissions JSONB DEFAULT '[]',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_used_at TIMESTAMPTZ,
    request_count BIGINT DEFAULT 0
);

-- ===========================================
-- RETENTION POLICIES
-- ===========================================
CREATE TABLE IF NOT EXISTS system.retention_policies (
    schema_name TEXT NOT NULL,
    table_name TEXT NOT NULL,
    retention_days INT NOT NULL,
    archive_destination TEXT,
    last_cleanup_at TIMESTAMPTZ,
    PRIMARY KEY (schema_name, table_name)
);

-- Default retention policies
INSERT INTO system.retention_policies (schema_name, table_name, retention_days, archive_destination) 
VALUES
    ('raw', 'st_%', 90, NULL),
    ('outbound', 'mutations', 365, NULL),
    ('audit', 'log', 730, NULL)
ON CONFLICT DO NOTHING;

-- ===========================================
-- ROLLBACK POINTS
-- ===========================================
CREATE TABLE IF NOT EXISTS system.rollback_points (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    sync_batch_id UUID,
    description TEXT,
    tables_snapshot JSONB
);

-- ===========================================
-- HELPER FUNCTIONS
-- ===========================================

-- Create a new sync batch
CREATE OR REPLACE FUNCTION system.create_sync_batch(p_entity_type TEXT)
RETURNS UUID AS $$
DECLARE
    batch_id UUID;
BEGIN
    INSERT INTO system.sync_batches (entity_type)
    VALUES (p_entity_type)
    RETURNING id INTO batch_id;
    RETURN batch_id;
END;
$$ LANGUAGE plpgsql;

-- Complete a sync batch successfully
CREATE OR REPLACE FUNCTION system.complete_sync_batch(
    p_batch_id UUID,
    p_records_fetched INT DEFAULT 0,
    p_records_inserted INT DEFAULT 0,
    p_records_updated INT DEFAULT 0,
    p_records_unchanged INT DEFAULT 0
)
RETURNS VOID AS $$
BEGIN
    UPDATE system.sync_batches SET
        status = 'completed',
        completed_at = NOW(),
        records_fetched = p_records_fetched,
        records_inserted = p_records_inserted,
        records_updated = p_records_updated,
        records_unchanged = p_records_unchanged
    WHERE id = p_batch_id;
END;
$$ LANGUAGE plpgsql;

-- Fail a sync batch
CREATE OR REPLACE FUNCTION system.fail_sync_batch(p_batch_id UUID, p_error TEXT)
RETURNS VOID AS $$
BEGIN
    UPDATE system.sync_batches SET
        status = 'failed',
        completed_at = NOW(),
        error_message = p_error
    WHERE id = p_batch_id;
END;
$$ LANGUAGE plpgsql;

-- Generate payload hash for change detection
CREATE OR REPLACE FUNCTION master.generate_payload_hash(p_payload JSONB)
RETURNS TEXT AS $$
BEGIN
    RETURN md5(p_payload::text);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

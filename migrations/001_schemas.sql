-- ===========================================
-- MIGRATION 001: Create Schemas
-- ===========================================
-- Run this first to create the schema structure
-- These schemas organize data by purpose and access level

-- Raw: Immutable mirror of ServiceTitan data
CREATE SCHEMA IF NOT EXISTS raw;
COMMENT ON SCHEMA raw IS 'Immutable mirror of ServiceTitan data - NEVER modify directly';

-- Master: Cleaned, typed, deduplicated data
CREATE SCHEMA IF NOT EXISTS master;
COMMENT ON SCHEMA master IS 'Cleaned, typed data derived from raw - single source of truth';

-- CRM: Business logic and customizations
CREATE SCHEMA IF NOT EXISTS crm;
COMMENT ON SCHEMA crm IS 'Business logic layer - customizations, calculated fields';

-- Outbound: Mutation queue for changes going to ST
CREATE SCHEMA IF NOT EXISTS outbound;
COMMENT ON SCHEMA outbound IS 'Mutation queue for changes pushed to ServiceTitan';

-- Audit: Immutable audit trail
CREATE SCHEMA IF NOT EXISTS audit;
COMMENT ON SCHEMA audit IS 'Immutable audit trail of all changes';

-- System: Configuration and operational data
CREATE SCHEMA IF NOT EXISTS system;
COMMENT ON SCHEMA system IS 'System configuration, health, and operational data';

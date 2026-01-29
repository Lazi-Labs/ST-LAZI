-- Migration: 014_ghl_crm_view.sql
-- Description: Creates GHL (GoHighLevel) CRM integration views
-- Created: 2026-01-22

-- Create GHL schema for integration views
CREATE SCHEMA IF NOT EXISTS ghl;

-- Customer CRM view for GHL integration
-- Provides clean customer data with primary contact info
CREATE OR REPLACE VIEW ghl.customer_crm AS
SELECT
  c.st_id as customer_id,
  c.name,
  -- Get primary phone (prefer MobilePhone, then Phone)
  COALESCE(
    (SELECT cc.value FROM master.customer_contacts cc
     WHERE cc.customer_id = c.st_id AND cc.type = 'MobilePhone' AND cc.active = true
     LIMIT 1),
    (SELECT cc.value FROM master.customer_contacts cc
     WHERE cc.customer_id = c.st_id AND cc.type = 'Phone' AND cc.active = true
     LIMIT 1)
  ) as phone,
  -- Get primary email
  (SELECT cc.value FROM master.customer_contacts cc
   WHERE cc.customer_id = c.st_id AND cc.type = 'Email' AND cc.active = true
   LIMIT 1) as email,
  -- Address fields
  c.address->>'street' as street,
  c.address->>'unit' as unit,
  c.address->>'city' as city,
  c.address->>'state' as state,
  c.address->>'zip' as zip,
  c.active,
  c.synced_at
FROM master.customers c
WHERE c.st_id IS NOT NULL;

-- Grant access
GRANT USAGE ON SCHEMA ghl TO postgres;
GRANT SELECT ON ghl.customer_crm TO postgres;

-- Add comments for documentation
COMMENT ON SCHEMA ghl IS 'GoHighLevel integration schema';
COMMENT ON VIEW ghl.customer_crm IS 'Customer CRM data for GHL sync - includes name, phone, email, and address';

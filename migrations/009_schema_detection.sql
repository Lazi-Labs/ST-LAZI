-- ============================================
-- SCHEMA CHANGE DETECTION
-- Track ST API schema changes over time
-- ============================================

-- Schema versions table (may already exist from 002, so use IF NOT EXISTS)
CREATE TABLE IF NOT EXISTS system.schema_versions (
    id SERIAL PRIMARY KEY,
    entity_type TEXT NOT NULL,
    version INT NOT NULL DEFAULT 1,
    field_names TEXT[] NOT NULL,
    field_types JSONB NOT NULL,
    sample_payload JSONB,
    detected_at TIMESTAMPTZ DEFAULT NOW(),
    is_current BOOLEAN DEFAULT true,
    UNIQUE(entity_type, version)
);

-- Schema change log
CREATE TABLE IF NOT EXISTS system.schema_changes (
    id SERIAL PRIMARY KEY,
    entity_type TEXT NOT NULL,
    detected_at TIMESTAMPTZ DEFAULT NOW(),
    old_version INT,
    new_version INT,
    added_fields TEXT[],
    removed_fields TEXT[],
    type_changes JSONB,
    acknowledged_at TIMESTAMPTZ,
    acknowledged_by TEXT
);

-- Index for quick lookups
CREATE INDEX IF NOT EXISTS idx_schema_versions_current 
ON system.schema_versions (entity_type) 
WHERE is_current = true;

-- Function to detect and record schema changes
CREATE OR REPLACE FUNCTION system.detect_schema_change(
    p_entity_type TEXT,
    p_payload JSONB
) RETURNS BOOLEAN AS $$
DECLARE
    v_current_fields TEXT[];
    v_current_types JSONB;
    v_stored_fields TEXT[];
    v_stored_types JSONB;
    v_added_fields TEXT[];
    v_removed_fields TEXT[];
    v_type_changes JSONB;
    v_current_version INT;
    v_has_changes BOOLEAN := false;
BEGIN
    -- Extract current field names and types
    SELECT 
        array_agg(key ORDER BY key),
        jsonb_object_agg(key, jsonb_typeof(value))
    INTO v_current_fields, v_current_types
    FROM jsonb_each(p_payload);

    -- Get stored schema
    SELECT field_names, field_types, version
    INTO v_stored_fields, v_stored_types, v_current_version
    FROM system.schema_versions
    WHERE entity_type = p_entity_type AND is_current = true;

    -- If no stored schema, create initial version
    IF v_stored_fields IS NULL THEN
        INSERT INTO system.schema_versions (entity_type, version, field_names, field_types, sample_payload)
        VALUES (p_entity_type, 1, v_current_fields, v_current_types, p_payload);
        RETURN false;
    END IF;

    -- Detect added fields
    SELECT array_agg(f) INTO v_added_fields
    FROM unnest(v_current_fields) f
    WHERE f != ALL(v_stored_fields);

    -- Detect removed fields
    SELECT array_agg(f) INTO v_removed_fields
    FROM unnest(v_stored_fields) f
    WHERE f != ALL(v_current_fields);

    -- Detect type changes
    SELECT jsonb_object_agg(key, jsonb_build_object('old', v_stored_types->key, 'new', value))
    INTO v_type_changes
    FROM jsonb_each(v_current_types)
    WHERE v_stored_types ? key 
    AND v_stored_types->>key != value::text;

    -- Check if there are any changes
    v_has_changes := (
        coalesce(array_length(v_added_fields, 1), 0) > 0 OR
        coalesce(array_length(v_removed_fields, 1), 0) > 0 OR
        v_type_changes IS NOT NULL AND v_type_changes != '{}'::jsonb
    );

    IF v_has_changes THEN
        -- Mark old version as not current
        UPDATE system.schema_versions 
        SET is_current = false 
        WHERE entity_type = p_entity_type AND is_current = true;

        -- Insert new version
        INSERT INTO system.schema_versions (entity_type, version, field_names, field_types, sample_payload)
        VALUES (p_entity_type, v_current_version + 1, v_current_fields, v_current_types, p_payload);

        -- Log the change
        INSERT INTO system.schema_changes (
            entity_type, old_version, new_version, 
            added_fields, removed_fields, type_changes
        ) VALUES (
            p_entity_type, v_current_version, v_current_version + 1,
            v_added_fields, v_removed_fields, v_type_changes
        );
    END IF;

    RETURN v_has_changes;
END;
$$ LANGUAGE plpgsql;

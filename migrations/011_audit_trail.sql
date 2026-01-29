-- ============================================
-- AUDIT TRAIL SYSTEM
-- Immutable log of all data changes
-- ============================================

-- Main audit log table (partitioned by month)
CREATE TABLE IF NOT EXISTS audit.log (
    id BIGSERIAL,
    timestamp TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    
    -- What changed
    schema_name TEXT NOT NULL,
    table_name TEXT NOT NULL,
    operation TEXT NOT NULL CHECK (operation IN ('INSERT', 'UPDATE', 'DELETE')),
    record_id TEXT,
    
    -- Change details
    old_data JSONB,
    new_data JSONB,
    changed_fields TEXT[],
    
    -- Who/what made the change
    actor_type TEXT NOT NULL CHECK (actor_type IN ('user', 'sync_worker', 'outbound_worker', 'api', 'system')),
    actor_id TEXT,
    
    -- Context
    request_id UUID,
    ip_address INET,
    user_agent TEXT,
    mutation_id UUID,
    sync_batch_id UUID,
    
    PRIMARY KEY (id, timestamp)
) PARTITION BY RANGE (timestamp);

-- Create partitions for current and next 3 months
DO $$
DECLARE
    start_date DATE;
    end_date DATE;
    partition_name TEXT;
BEGIN
    FOR i IN 0..3 LOOP
        start_date := date_trunc('month', CURRENT_DATE + (i || ' month')::interval);
        end_date := start_date + INTERVAL '1 month';
        partition_name := 'audit_log_' || to_char(start_date, 'YYYY_MM');
        
        EXECUTE format(
            'CREATE TABLE IF NOT EXISTS audit.%I PARTITION OF audit.log FOR VALUES FROM (%L) TO (%L)',
            partition_name, start_date, end_date
        );
        
        RAISE NOTICE 'Created partition: audit.%', partition_name;
    END LOOP;
END $$;

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_audit_log_table ON audit.log (schema_name, table_name, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_audit_log_record ON audit.log (schema_name, table_name, record_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_actor ON audit.log (actor_type, actor_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_audit_log_mutation ON audit.log (mutation_id) WHERE mutation_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_audit_log_sync ON audit.log (sync_batch_id) WHERE sync_batch_id IS NOT NULL;

-- Function to detect changed fields
CREATE OR REPLACE FUNCTION audit.get_changed_fields(old_data JSONB, new_data JSONB)
RETURNS TEXT[] AS $$
DECLARE
    old_keys TEXT[];
    new_keys TEXT[];
    all_keys TEXT[];
    changed TEXT[] := '{}';
    k TEXT;
BEGIN
    IF old_data IS NULL OR new_data IS NULL THEN
        RETURN NULL;
    END IF;

    SELECT array_agg(key) INTO old_keys FROM jsonb_object_keys(old_data) key;
    SELECT array_agg(key) INTO new_keys FROM jsonb_object_keys(new_data) key;
    
    all_keys := old_keys || new_keys;
    all_keys := ARRAY(SELECT DISTINCT unnest(all_keys));
    
    FOREACH k IN ARRAY all_keys LOOP
        IF (old_data->k)::text IS DISTINCT FROM (new_data->k)::text THEN
            changed := array_append(changed, k);
        END IF;
    END LOOP;
    
    RETURN changed;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Generic audit trigger function
CREATE OR REPLACE FUNCTION audit.log_changes()
RETURNS TRIGGER AS $$
DECLARE
    v_old_data JSONB;
    v_new_data JSONB;
    v_record_id TEXT;
    v_changed_fields TEXT[];
BEGIN
    -- Get record ID
    IF TG_OP = 'DELETE' THEN
        v_record_id := COALESCE(OLD.id::text, OLD.st_id::text, (OLD.payload->>'id')::text);
        v_old_data := to_jsonb(OLD);
        v_new_data := NULL;
    ELSIF TG_OP = 'INSERT' THEN
        v_record_id := COALESCE(NEW.id::text, NEW.st_id::text, (NEW.payload->>'id')::text);
        v_old_data := NULL;
        v_new_data := to_jsonb(NEW);
    ELSE -- UPDATE
        v_record_id := COALESCE(NEW.id::text, NEW.st_id::text, (NEW.payload->>'id')::text);
        v_old_data := to_jsonb(OLD);
        v_new_data := to_jsonb(NEW);
        v_changed_fields := audit.get_changed_fields(v_old_data, v_new_data);
    END IF;

    -- Insert audit record
    INSERT INTO audit.log (
        schema_name, table_name, operation, record_id,
        old_data, new_data, changed_fields,
        actor_type, actor_id, request_id, mutation_id, sync_batch_id
    ) VALUES (
        TG_TABLE_SCHEMA,
        TG_TABLE_NAME,
        TG_OP,
        v_record_id,
        v_old_data,
        v_new_data,
        v_changed_fields,
        COALESCE(current_setting('app.actor_type', true), 'system'),
        current_setting('app.actor_id', true),
        NULLIF(current_setting('app.request_id', true), '')::uuid,
        NULLIF(current_setting('app.mutation_id', true), '')::uuid,
        NULLIF(current_setting('app.sync_batch_id', true), '')::uuid
    );

    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply audit triggers to master tables
DO $$
DECLARE
    tbl RECORD;
BEGIN
    FOR tbl IN 
        SELECT tablename 
        FROM pg_tables 
        WHERE schemaname = 'master'
    LOOP
        -- Drop existing trigger if any
        EXECUTE format('DROP TRIGGER IF EXISTS audit_trigger_%I ON master.%I', tbl.tablename, tbl.tablename);
        
        -- Create audit trigger
        EXECUTE format('
            CREATE TRIGGER audit_trigger_%I
            AFTER INSERT OR UPDATE OR DELETE ON master.%I
            FOR EACH ROW EXECUTE FUNCTION audit.log_changes()
        ', tbl.tablename, tbl.tablename);
        
        RAISE NOTICE 'Added audit trigger to master.%', tbl.tablename;
    END LOOP;
END $$;

-- Apply audit triggers to outbound.mutations
DROP TRIGGER IF EXISTS audit_trigger_mutations ON outbound.mutations;
CREATE TRIGGER audit_trigger_mutations
    AFTER INSERT OR UPDATE OR DELETE ON outbound.mutations
    FOR EACH ROW EXECUTE FUNCTION audit.log_changes();

-- Apply audit triggers to system.sync_batches
DROP TRIGGER IF EXISTS audit_trigger_sync_batches ON system.sync_batches;
CREATE TRIGGER audit_trigger_sync_batches
    AFTER INSERT OR UPDATE ON system.sync_batches
    FOR EACH ROW EXECUTE FUNCTION audit.log_changes();

-- Protection: make audit.log immutable
CREATE OR REPLACE FUNCTION audit.prevent_modification()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'Audit log is immutable. % operations are not allowed.', TG_OP;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Note: We only prevent UPDATE/DELETE, INSERT is allowed
DROP TRIGGER IF EXISTS audit_log_immutable ON audit.log;
CREATE TRIGGER audit_log_immutable
    BEFORE UPDATE OR DELETE ON audit.log
    FOR EACH ROW EXECUTE FUNCTION audit.prevent_modification();

-- View for recent audit entries
CREATE OR REPLACE VIEW audit.recent_changes AS
SELECT 
    timestamp,
    schema_name || '.' || table_name as table_full_name,
    operation,
    record_id,
    changed_fields,
    actor_type,
    actor_id,
    mutation_id,
    sync_batch_id
FROM audit.log
WHERE timestamp > NOW() - INTERVAL '24 hours'
ORDER BY timestamp DESC;

-- View for audit summary
CREATE OR REPLACE VIEW audit.daily_summary AS
SELECT 
    date_trunc('day', timestamp) as day,
    schema_name,
    table_name,
    operation,
    actor_type,
    COUNT(*) as change_count
FROM audit.log
WHERE timestamp > NOW() - INTERVAL '7 days'
GROUP BY 1, 2, 3, 4, 5
ORDER BY 1 DESC, 6 DESC;

-- Verify trigger count
DO $$
DECLARE
    trigger_count INT;
BEGIN
    SELECT COUNT(*) INTO trigger_count
    FROM pg_trigger t
    JOIN pg_class c ON t.tgrelid = c.oid
    JOIN pg_namespace n ON c.relnamespace = n.oid
    WHERE t.tgname LIKE 'audit_trigger_%';
    
    RAISE NOTICE 'Created % audit triggers', trigger_count;
END $$;

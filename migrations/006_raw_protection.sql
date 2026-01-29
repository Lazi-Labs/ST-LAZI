-- ============================================
-- RAW TABLE PROTECTION
-- Prevents UPDATE and DELETE on raw tables
-- ============================================

-- Function that blocks modifications
CREATE OR REPLACE FUNCTION raw.prevent_modification()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'Raw tables are immutable. % operations are not allowed on %.%', 
        TG_OP, TG_TABLE_SCHEMA, TG_TABLE_NAME;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Apply protection trigger to ALL raw tables
DO $$
DECLARE
    tbl RECORD;
BEGIN
    FOR tbl IN 
        SELECT tablename 
        FROM pg_tables 
        WHERE schemaname = 'raw' 
        AND tablename LIKE 'st_%'
    LOOP
        -- Drop existing trigger if any
        EXECUTE format('DROP TRIGGER IF EXISTS prevent_modify_%I ON raw.%I', tbl.tablename, tbl.tablename);
        
        -- Create protection trigger
        EXECUTE format('
            CREATE TRIGGER prevent_modify_%I
            BEFORE UPDATE OR DELETE ON raw.%I
            FOR EACH ROW
            EXECUTE FUNCTION raw.prevent_modification()
        ', tbl.tablename, tbl.tablename);
        
        RAISE NOTICE 'Protected raw.%', tbl.tablename;
    END LOOP;
END $$;

-- Verify protection
DO $$
DECLARE
    protected_count INT;
BEGIN
    SELECT COUNT(*) INTO protected_count
    FROM pg_trigger t
    JOIN pg_class c ON t.tgrelid = c.oid
    JOIN pg_namespace n ON c.relnamespace = n.oid
    WHERE n.nspname = 'raw'
    AND t.tgname LIKE 'prevent_modify_%';
    
    RAISE NOTICE 'Protected % raw tables with immutability triggers', protected_count;
END $$;

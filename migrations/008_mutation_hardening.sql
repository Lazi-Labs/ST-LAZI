-- ============================================
-- MUTATION HARDENING
-- Idempotency, conflict detection, DLQ automation
-- ============================================

-- Add idempotency key for duplicate prevention
ALTER TABLE outbound.mutations 
ADD COLUMN IF NOT EXISTS idempotency_key TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS idx_mutations_idempotency 
ON outbound.mutations (idempotency_key) 
WHERE idempotency_key IS NOT NULL;

-- Add conflict detection columns
ALTER TABLE outbound.mutations 
ADD COLUMN IF NOT EXISTS based_on_sync_batch UUID,
ADD COLUMN IF NOT EXISTS based_on_entity_hash TEXT;

-- Auto-move to DLQ after max retries
CREATE OR REPLACE FUNCTION outbound.auto_dlq()
RETURNS TRIGGER AS $$
BEGIN
    -- Move to DLQ if failed and retry_count >= 3
    IF NEW.status = 'failed' AND NEW.retry_count >= 3 THEN
        INSERT INTO outbound.dead_letter_queue (
            original_mutation_id,
            failure_reason,
            payload,
            retry_attempts,
            last_error
        ) VALUES (
            NEW.id,
            NEW.error_message,
            NEW.payload,
            NEW.retry_count,
            NEW.st_response
        );
        
        -- Mark as moved to DLQ
        NEW.status := 'dead_letter';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_auto_dlq ON outbound.mutations;
CREATE TRIGGER trigger_auto_dlq
    BEFORE UPDATE ON outbound.mutations
    FOR EACH ROW
    WHEN (NEW.status = 'failed')
    EXECUTE FUNCTION outbound.auto_dlq();

-- Add status enum value (drop and recreate constraint)
ALTER TABLE outbound.mutations 
DROP CONSTRAINT IF EXISTS mutations_status_check;

ALTER TABLE outbound.mutations 
ADD CONSTRAINT mutations_status_check 
CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'conflict', 'dead_letter'));

-- Function to create mutation with idempotency
CREATE OR REPLACE FUNCTION outbound.create_mutation(
    p_entity_type TEXT,
    p_entity_id BIGINT,
    p_operation TEXT,
    p_payload JSONB,
    p_initiated_by TEXT DEFAULT 'system',
    p_idempotency_key TEXT DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
    v_mutation_id UUID;
    v_sync_batch UUID;
    v_entity_hash TEXT;
BEGIN
    -- Get current entity state for conflict detection
    BEGIN
        EXECUTE format(
            'SELECT sync_batch_id, md5(payload::text) FROM raw.st_%s WHERE (payload->>''id'')::bigint = $1 ORDER BY synced_at DESC LIMIT 1',
            p_entity_type
        ) INTO v_sync_batch, v_entity_hash USING p_entity_id;
    EXCEPTION WHEN OTHERS THEN
        -- Table might not exist, continue without conflict detection
        v_sync_batch := NULL;
        v_entity_hash := NULL;
    END;

    -- Insert with idempotency handling
    INSERT INTO outbound.mutations (
        entity_type, entity_id, operation, payload, 
        initiated_by, idempotency_key, 
        based_on_sync_batch, based_on_entity_hash
    ) VALUES (
        p_entity_type, p_entity_id, p_operation, p_payload,
        p_initiated_by, p_idempotency_key,
        v_sync_batch, v_entity_hash
    )
    ON CONFLICT (idempotency_key) 
    WHERE idempotency_key IS NOT NULL
    DO UPDATE SET id = outbound.mutations.id  -- No-op update to return existing
    RETURNING id INTO v_mutation_id;

    RETURN v_mutation_id;
END;
$$ LANGUAGE plpgsql;

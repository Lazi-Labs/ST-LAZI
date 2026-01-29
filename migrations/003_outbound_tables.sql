-- ===========================================
-- MIGRATION 003: Outbound Tables
-- ===========================================
-- Queue for mutations going TO ServiceTitan

-- ===========================================
-- MUTATION QUEUE
-- ===========================================
CREATE TABLE IF NOT EXISTS outbound.mutations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- What entity are we mutating?
    entity_type TEXT NOT NULL,
    entity_id BIGINT,                  -- ST ID (null for creates)
    operation TEXT NOT NULL CHECK (operation IN ('create', 'update', 'delete')),
    
    -- The payload to send
    payload JSONB NOT NULL,
    
    -- Idempotency (prevents duplicate submissions)
    idempotency_key TEXT UNIQUE,
    
    -- Conflict detection
    based_on_sync_batch UUID,
    based_on_payload_hash TEXT,
    
    -- Status tracking
    status TEXT NOT NULL DEFAULT 'pending' 
        CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'conflict')),
    
    -- Who/what initiated this mutation
    initiated_by TEXT NOT NULL,
    initiated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Processing results
    processed_at TIMESTAMPTZ,
    st_response JSONB,
    st_entity_id BIGINT,              -- ID returned by ST (for creates)
    error_message TEXT,
    retry_count INT NOT NULL DEFAULT 0,
    
    -- Confirmation that ST has the change
    confirmed_in_sync_batch UUID
);

-- Index for worker to pick up pending mutations
CREATE INDEX IF NOT EXISTS idx_outbound_pending 
    ON outbound.mutations (status, initiated_at) 
    WHERE status = 'pending';

-- Index for finding mutations by entity
CREATE INDEX IF NOT EXISTS idx_outbound_entity 
    ON outbound.mutations (entity_type, entity_id);

-- Index for idempotency lookups
CREATE INDEX IF NOT EXISTS idx_outbound_idempotency 
    ON outbound.mutations (idempotency_key) 
    WHERE idempotency_key IS NOT NULL;

-- Index for status monitoring
CREATE INDEX IF NOT EXISTS idx_outbound_status 
    ON outbound.mutations (status, initiated_at DESC);

-- ===========================================
-- DEAD LETTER QUEUE
-- ===========================================
-- Permanently failed mutations that need human attention
CREATE TABLE IF NOT EXISTS outbound.dead_letter_queue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    original_mutation_id UUID NOT NULL REFERENCES outbound.mutations(id),
    
    failed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    failure_reason TEXT,
    payload JSONB NOT NULL,
    retry_attempts INT NOT NULL,
    last_error JSONB,
    
    -- Resolution tracking
    resolved_at TIMESTAMPTZ,
    resolved_by TEXT,
    resolution_notes TEXT
);

CREATE INDEX IF NOT EXISTS idx_dlq_unresolved 
    ON outbound.dead_letter_queue (failed_at) 
    WHERE resolved_at IS NULL;

-- ===========================================
-- AUTOMATIC DLQ FUNCTION
-- ===========================================
-- Moves failed mutations to DLQ after max retries
CREATE OR REPLACE FUNCTION outbound.check_dlq_threshold()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'failed' AND NEW.retry_count >= 3 THEN
        INSERT INTO outbound.dead_letter_queue 
            (original_mutation_id, failure_reason, payload, retry_attempts, last_error)
        VALUES 
            (NEW.id, NEW.error_message, NEW.payload, NEW.retry_count, NEW.st_response);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply DLQ trigger
DROP TRIGGER IF EXISTS trigger_check_dlq ON outbound.mutations;
CREATE TRIGGER trigger_check_dlq
    AFTER UPDATE ON outbound.mutations
    FOR EACH ROW
    WHEN (NEW.status = 'failed' AND NEW.retry_count >= 3)
    EXECUTE FUNCTION outbound.check_dlq_threshold();

-- ===========================================
-- HELPER FUNCTIONS
-- ===========================================

-- Create a new mutation
CREATE OR REPLACE FUNCTION outbound.create_mutation(
    p_entity_type TEXT,
    p_entity_id BIGINT,
    p_operation TEXT,
    p_payload JSONB,
    p_initiated_by TEXT,
    p_idempotency_key TEXT DEFAULT NULL,
    p_based_on_sync_batch UUID DEFAULT NULL,
    p_based_on_payload_hash TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    mutation_id UUID;
BEGIN
    INSERT INTO outbound.mutations (
        entity_type, entity_id, operation, payload, initiated_by,
        idempotency_key, based_on_sync_batch, based_on_payload_hash
    ) VALUES (
        p_entity_type, p_entity_id, p_operation, p_payload, p_initiated_by,
        p_idempotency_key, p_based_on_sync_batch, p_based_on_payload_hash
    )
    ON CONFLICT (idempotency_key) DO UPDATE SET
        -- Update nothing, just return existing
        initiated_at = outbound.mutations.initiated_at
    RETURNING id INTO mutation_id;
    
    RETURN mutation_id;
END;
$$ LANGUAGE plpgsql;

-- Claim a pending mutation for processing
CREATE OR REPLACE FUNCTION outbound.claim_next_mutation()
RETURNS outbound.mutations AS $$
DECLARE
    claimed outbound.mutations;
BEGIN
    UPDATE outbound.mutations SET
        status = 'processing'
    WHERE id = (
        SELECT id FROM outbound.mutations
        WHERE status = 'pending'
        ORDER BY initiated_at
        LIMIT 1
        FOR UPDATE SKIP LOCKED
    )
    RETURNING * INTO claimed;
    
    RETURN claimed;
END;
$$ LANGUAGE plpgsql;

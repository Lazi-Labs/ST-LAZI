-- Add next_retry_at for scheduling retries
ALTER TABLE outbound.mutations 
ADD COLUMN IF NOT EXISTS next_retry_at TIMESTAMPTZ;

-- Update pending query to respect retry timing
CREATE INDEX IF NOT EXISTS idx_mutations_pending_retry 
ON outbound.mutations (created_at) 
WHERE status = 'pending';

-- Add conflict status to the enum if not exists
DO $$
BEGIN
  -- Check if constraint exists and drop it
  IF EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'mutations_status_check'
  ) THEN
    ALTER TABLE outbound.mutations DROP CONSTRAINT mutations_status_check;
  END IF;
  
  -- Add new constraint with conflict status
  ALTER TABLE outbound.mutations ADD CONSTRAINT mutations_status_check 
    CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'conflict', 'dlq'));
EXCEPTION
  WHEN others THEN
    NULL; -- Ignore if constraint already exists with correct values
END $$;

COMMENT ON COLUMN outbound.mutations.next_retry_at IS 
'When to retry failed mutation. NULL means retry immediately.';

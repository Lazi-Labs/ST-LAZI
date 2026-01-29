-- ============================================
-- SPECIAL OPERATIONS SUPPORT
-- Extends mutation operations beyond CRUD
-- ============================================

-- Update the operation check constraint to allow special operations
ALTER TABLE outbound.mutations DROP CONSTRAINT IF EXISTS mutations_operation_check;
ALTER TABLE outbound.mutations ADD CONSTRAINT mutations_operation_check CHECK (
  operation IN (
    -- Standard CRUD
    'create', 'update', 'delete',
    -- Appointment operations
    'reschedule', 'cancel', 'assign', 'unassign', 'complete',
    -- Estimate operations
    'approve', 'decline', 'convert-to-invoice', 'email',
    -- Sub-resource operations
    'add-contact', 'add-note'
  )
);

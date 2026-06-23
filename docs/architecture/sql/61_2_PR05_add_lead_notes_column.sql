-- PR-61.2-05 Lead Notes
-- Target: Supabase PostgreSQL / relational Leads persistence
-- Governance:
--   Leads remains the Source of Truth.
--   This is an additive field on the certified Leads persistence path.
--   This does not introduce dual write, Lead replacement, or a new Source of Truth.
--   Notes are single-field operational Front Desk notes, not a history table.

BEGIN;

ALTER TABLE leads
  ADD COLUMN IF NOT EXISTS notes TEXT;

COMMENT ON COLUMN leads.notes IS 'PR-61.2-05 single-field internal Front Desk notes for the Lead. Owned by Leads; not a separate Source of Truth.';

COMMIT;

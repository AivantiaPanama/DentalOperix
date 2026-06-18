-- 57.1-B Relational Leads Schema Design
-- Status: DESIGN ONLY / NOT ACTIVE / NOT EXECUTED
-- Governance:
--   Leads remains the Source of Truth.
--   Google Sheet remains the active physical persistence until explicit cutover approval.
--   This SQL must not be applied to production as a runtime activation step.
--   No dual write is approved by this artifact.

CREATE TABLE IF NOT EXISTS leads (
  id TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  treatment TEXT NOT NULL,
  message TEXT,
  urgency TEXT CHECK (urgency IS NULL OR urgency IN ('low', 'media', 'high')),
  preferred_date TEXT,
  status TEXT NOT NULL CHECK (status IN ('nuevo', 'agendada', 'completada', 'cancelada', 'no asistió')),
  source TEXT,
  ai_summary TEXT,
  calendar_event_id TEXT,
  email_sent BOOLEAN NOT NULL DEFAULT FALSE,

  -- Migration and certification metadata.
  physical_source TEXT NOT NULL DEFAULT 'google-sheet' CHECK (physical_source IN ('google-sheet', 'relational-db')),
  source_record_hash TEXT,
  schema_version TEXT NOT NULL DEFAULT '57.1-B',
  inserted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads (created_at);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads (status);
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads (email);
CREATE INDEX IF NOT EXISTS idx_leads_phone ON leads (phone);
CREATE INDEX IF NOT EXISTS idx_leads_calendar_event_id ON leads (calendar_event_id);

CREATE TABLE IF NOT EXISTS lead_persistence_migration_audit (
  id TEXT PRIMARY KEY,
  migration_batch_id TEXT NOT NULL,
  source_system TEXT NOT NULL DEFAULT 'google-sheet',
  target_system TEXT NOT NULL DEFAULT 'relational-db',
  source_record_id TEXT NOT NULL,
  target_record_id TEXT,
  source_record_hash TEXT,
  migration_status TEXT NOT NULL CHECK (migration_status IN ('pending', 'migrated', 'reconciled', 'failed', 'skipped')),
  failure_reason TEXT,
  reconciled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_lead_migration_batch ON lead_persistence_migration_audit (migration_batch_id);
CREATE INDEX IF NOT EXISTS idx_lead_migration_source_record ON lead_persistence_migration_audit (source_record_id);
CREATE INDEX IF NOT EXISTS idx_lead_migration_status ON lead_persistence_migration_audit (migration_status);

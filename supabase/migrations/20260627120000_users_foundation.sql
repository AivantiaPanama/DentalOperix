-- DentalOperix 61.1-01 Users Foundation schema proposal
-- Status: implementation artifact aligned with 61.1-00 approved discovery and ADR-61.1-00-01..02
-- Governance: Users are identity records only. Roles are metadata; no RBAC enforcement or session/auth tables are created in PR-1.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('administrator', 'doctor', 'assistant', 'patient');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE user_status AS ENUM ('pending_activation', 'active', 'inactive', 'suspended');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS users (
  id text PRIMARY KEY DEFAULT ('user_' || gen_random_uuid()::text),
  email text NOT NULL,
  display_name text NOT NULL,
  role user_role NOT NULL,
  status user_status NOT NULL DEFAULT 'pending_activation',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deactivated_at timestamptz,
  CONSTRAINT users_email_not_blank CHECK (length(trim(email)) > 0),
  CONSTRAINT users_display_name_not_blank CHECK (length(trim(display_name)) > 0),
  CONSTRAINT users_email_unique UNIQUE (email)
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);
CREATE INDEX IF NOT EXISTS idx_users_status ON users (status);

COMMENT ON TABLE users IS '61.1 Users Foundation identity records. Users store identity metadata only; no RBAC/session/auth persistence is implemented in PR-1.';

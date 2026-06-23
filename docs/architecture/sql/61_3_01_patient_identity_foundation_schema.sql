-- DentalOperix 61.3-01 Patient Identity Foundation schema proposal
-- Status: implementation artifact aligned with 61.3-00 approved discovery and ADR-61.3-00-01..08
-- Governance: Patient is person identity only. Leads and Appointments remain their certified sources of truth.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$ BEGIN
  CREATE TYPE patient_status AS ENUM ('active', 'inactive', 'lost_contact', 'archived');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE patient_creation_source AS ENUM ('web', 'chat', 'whatsapp', 'phone', 'walk_in', 'lead', 'appointment', 'assistant', 'admin', 'doctor');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE patient_actor_role AS ENUM ('administrator', 'doctor', 'assistant', 'system');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE patient_contact_point_status AS ENUM ('active', 'inactive');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE patient_identifier_type AS ENUM ('cid', 'tax_id', 'external', 'other');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS patients (
  id text PRIMARY KEY DEFAULT ('patient_' || gen_random_uuid()::text),
  display_name text NOT NULL,
  first_name text,
  last_name text,
  second_last_name text,
  normalized_name text NOT NULL,
  status patient_status NOT NULL DEFAULT 'active',
  source patient_creation_source NOT NULL,
  linked_lead_id text,
  linked_appointment_id text,
  requires_invoice boolean NOT NULL DEFAULT false,
  is_retired boolean NOT NULL DEFAULT false,
  has_insurance boolean NOT NULL DEFAULT false,
  created_by_user_id text,
  created_by_role patient_actor_role,
  created_via patient_creation_source NOT NULL,
  updated_by_user_id text,
  updated_by_role patient_actor_role,
  updated_via patient_creation_source,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT patients_display_name_not_blank CHECK (length(trim(display_name)) > 0),
  CONSTRAINT patients_normalized_name_not_blank CHECK (length(trim(normalized_name)) > 0)
);

CREATE INDEX IF NOT EXISTS idx_patients_normalized_name ON patients (normalized_name);
CREATE INDEX IF NOT EXISTS idx_patients_status ON patients (status);
CREATE INDEX IF NOT EXISTS idx_patients_linked_lead_id ON patients (linked_lead_id) WHERE linked_lead_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_patients_linked_appointment_id ON patients (linked_appointment_id) WHERE linked_appointment_id IS NOT NULL;

CREATE TABLE IF NOT EXISTS patient_phones (
  id text PRIMARY KEY DEFAULT ('patient_phone_' || gen_random_uuid()::text),
  patient_id text NOT NULL REFERENCES patients(id) ON DELETE RESTRICT,
  phone text NOT NULL,
  normalized_phone text NOT NULL,
  label text,
  is_primary boolean NOT NULL DEFAULT false,
  status patient_contact_point_status NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT patient_phones_phone_not_blank CHECK (length(trim(phone)) > 0),
  CONSTRAINT patient_phones_normalized_phone_not_blank CHECK (length(trim(normalized_phone)) > 0)
);

CREATE INDEX IF NOT EXISTS idx_patient_phones_patient_id ON patient_phones (patient_id);
CREATE INDEX IF NOT EXISTS idx_patient_phones_normalized_phone ON patient_phones (normalized_phone) WHERE status = 'active';
CREATE UNIQUE INDEX IF NOT EXISTS uq_patient_primary_phone ON patient_phones (patient_id) WHERE is_primary = true AND status = 'active';

CREATE TABLE IF NOT EXISTS patient_emails (
  id text PRIMARY KEY DEFAULT ('patient_email_' || gen_random_uuid()::text),
  patient_id text NOT NULL REFERENCES patients(id) ON DELETE RESTRICT,
  email text NOT NULL,
  normalized_email text NOT NULL,
  label text,
  is_primary boolean NOT NULL DEFAULT false,
  status patient_contact_point_status NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT patient_emails_email_not_blank CHECK (length(trim(email)) > 0),
  CONSTRAINT patient_emails_normalized_email_not_blank CHECK (length(trim(normalized_email)) > 0)
);

CREATE INDEX IF NOT EXISTS idx_patient_emails_patient_id ON patient_emails (patient_id);
CREATE INDEX IF NOT EXISTS idx_patient_emails_normalized_email ON patient_emails (normalized_email) WHERE status = 'active';
CREATE UNIQUE INDEX IF NOT EXISTS uq_patient_primary_email ON patient_emails (patient_id) WHERE is_primary = true AND status = 'active';

CREATE TABLE IF NOT EXISTS patient_addresses (
  id text PRIMARY KEY DEFAULT ('patient_address_' || gen_random_uuid()::text),
  patient_id text NOT NULL REFERENCES patients(id) ON DELETE RESTRICT,
  line1 text NOT NULL,
  line2 text,
  city text,
  state text,
  postal_code text,
  country text,
  label text,
  is_primary boolean NOT NULL DEFAULT false,
  status patient_contact_point_status NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT patient_addresses_line1_not_blank CHECK (length(trim(line1)) > 0)
);

CREATE INDEX IF NOT EXISTS idx_patient_addresses_patient_id ON patient_addresses (patient_id);
CREATE UNIQUE INDEX IF NOT EXISTS uq_patient_primary_address ON patient_addresses (patient_id) WHERE is_primary = true AND status = 'active';

CREATE TABLE IF NOT EXISTS patient_identifiers (
  id text PRIMARY KEY DEFAULT ('patient_identifier_' || gen_random_uuid()::text),
  patient_id text NOT NULL REFERENCES patients(id) ON DELETE RESTRICT,
  type patient_identifier_type NOT NULL,
  value text NOT NULL,
  normalized_value text NOT NULL,
  issuing_authority text,
  is_primary boolean NOT NULL DEFAULT false,
  status patient_contact_point_status NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT patient_identifiers_value_not_blank CHECK (length(trim(value)) > 0),
  CONSTRAINT patient_identifiers_normalized_value_not_blank CHECK (length(trim(normalized_value)) > 0)
);

CREATE INDEX IF NOT EXISTS idx_patient_identifiers_patient_id ON patient_identifiers (patient_id);
CREATE INDEX IF NOT EXISTS idx_patient_identifiers_identity ON patient_identifiers (type, normalized_value) WHERE status = 'active';
CREATE UNIQUE INDEX IF NOT EXISTS uq_patient_primary_identifier ON patient_identifiers (patient_id) WHERE is_primary = true AND status = 'active';

COMMENT ON TABLE patients IS '61.3-01 Patient identity foundation. Patient does not replace Lead or Appointment.';
COMMENT ON TABLE patient_phones IS 'Normalized Patient phone contact points. Contact changes do not replace Patient identity.';
COMMENT ON TABLE patient_emails IS 'Normalized Patient email contact points for identity resolution.';
COMMENT ON TABLE patient_addresses IS 'Normalized Patient address contact points.';
COMMENT ON TABLE patient_identifiers IS 'Normalized Patient identifiers such as CID. Required for invoice workflows when applicable.';

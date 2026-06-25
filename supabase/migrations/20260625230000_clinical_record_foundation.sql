-- DentalOperix 75.0 WP-01 Clinical Record Foundation
-- Baseline: DENTALOPERIX_BASELINE_71_5_RELEASE_CANDIDATE
-- Governance: Clinical Records = Clinical Information Domain.
-- This migration does not modify Leads, Patients, Appointments, or protected components.

CREATE TABLE IF NOT EXISTS clinical_records (
  id text PRIMARY KEY,
  patient_id text NOT NULL REFERENCES patients(id),
  status text NOT NULL CHECK (status IN ('draft', 'active')),
  created_by_user_id text NULL,
  created_by_role text NULL,
  created_via text NOT NULL DEFAULT 'clinical-record-foundation',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_clinical_records_patient_id ON clinical_records(patient_id);
CREATE INDEX IF NOT EXISTS idx_clinical_records_status ON clinical_records(status);

CREATE TABLE IF NOT EXISTS clinical_record_domain_events (
  id text PRIMARY KEY,
  clinical_record_id text NOT NULL REFERENCES clinical_records(id) ON DELETE CASCADE,
  patient_id text NOT NULL REFERENCES patients(id),
  type text NOT NULL CHECK (type IN ('ClinicalRecordCreated', 'ClinicalRecordActivated')),
  occurred_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_clinical_record_domain_events_record_id
  ON clinical_record_domain_events(clinical_record_id);

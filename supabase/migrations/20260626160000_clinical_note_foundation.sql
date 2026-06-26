-- DentalOperix Program 75.x / WP-02 / I1-M4
-- Clinical Note Persistence Foundation
-- This migration extends Clinical Records with Clinical Notes without changing
-- Leads, Patients, Appointments, or the certified Clinical Record Foundation.

CREATE TABLE IF NOT EXISTS clinical_notes (
  id TEXT PRIMARY KEY,
  clinical_record_id TEXT NOT NULL REFERENCES clinical_records(id),
  patient_id TEXT NOT NULL,
  appointment_id TEXT,
  title TEXT,
  narrative TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('draft', 'completed', 'amended', 'archived')),
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL,
  created_by_healthcare_professional_id TEXT NOT NULL,
  updated_by_healthcare_professional_id TEXT,
  completed_at TIMESTAMPTZ,
  completed_by_healthcare_professional_id TEXT,
  reopened_at TIMESTAMPTZ,
  reopened_by_healthcare_professional_id TEXT,
  archived_at TIMESTAMPTZ,
  archived_by_healthcare_professional_id TEXT,
  source TEXT NOT NULL DEFAULT 'clinical-notes-foundation' CHECK (source = 'clinical-notes-foundation')
);

CREATE INDEX IF NOT EXISTS idx_clinical_notes_clinical_record_id
  ON clinical_notes(clinical_record_id);

CREATE INDEX IF NOT EXISTS idx_clinical_notes_patient_id_created_at
  ON clinical_notes(patient_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_clinical_notes_status
  ON clinical_notes(status);

COMMENT ON TABLE clinical_notes IS
  'WP-02 Clinical Notes Foundation. Stores clinical narrative records owned exclusively by Clinical Records.';

COMMENT ON COLUMN clinical_notes.patient_id IS
  'Reference to Patients identity only. Clinical Records does not duplicate or own patient identity.';

COMMENT ON COLUMN clinical_notes.appointment_id IS
  'Optional operational reference to Appointments. Appointments is not the owner of clinical information.';

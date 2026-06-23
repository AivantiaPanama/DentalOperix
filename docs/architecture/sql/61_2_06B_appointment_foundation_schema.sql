-- 61.2-06B Appointment Foundation Schema
-- Status: PROPOSED / NOT DEPLOYED BY THIS PACKAGE
-- Purpose: Durable Appointment Domain foundation without changing Leads as Source of Truth.

CREATE TABLE IF NOT EXISTS appointment_providers (
  id TEXT PRIMARY KEY,
  display_name TEXT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  default_slot_minutes INTEGER NOT NULL DEFAULT 60 CHECK (default_slot_minutes > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS appointments (
  id TEXT PRIMARY KEY,
  lead_id TEXT NULL REFERENCES leads(id) ON DELETE SET NULL,
  provider_id TEXT NULL REFERENCES appointment_providers(id) ON DELETE SET NULL,
  requested_date DATE NULL,
  requested_time TIME NULL,
  scheduled_start_at TIMESTAMPTZ NULL,
  scheduled_end_at TIMESTAMPTZ NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 60 CHECK (duration_minutes > 0),
  service TEXT NOT NULL,
  status TEXT NOT NULL CHECK (
    status IN (
      'requested',
      'suggested_alternative',
      'pending_patient_confirmation',
      'confirmed',
      'needs_assistant_review',
      'rescheduled',
      'cancelled',
      'expired'
    )
  ),
  source TEXT NOT NULL CHECK (
    source IN ('public_booking', 'assistant_workspace', 'system', 'manual_import')
  ),
  patient_name TEXT NOT NULL,
  patient_email TEXT NULL,
  patient_phone TEXT NULL,
  notes TEXT NULL,
  calendar_event_id TEXT NULL,
  created_by_user_id TEXT NULL REFERENCES users(id) ON DELETE SET NULL,
  created_by_role TEXT NULL,
  created_via TEXT NOT NULL CHECK (
    created_via IN ('public_booking', 'assistant_workspace', 'system', 'manual_import')
  ),
  updated_by_user_id TEXT NULL REFERENCES users(id) ON DELETE SET NULL,
  updated_by_role TEXT NULL,
  updated_via TEXT NULL CHECK (
    updated_via IS NULL OR updated_via IN ('public_booking', 'assistant_workspace', 'system', 'manual_import')
  ),
  cancelled_by_user_id TEXT NULL REFERENCES users(id) ON DELETE SET NULL,
  cancelled_by_role TEXT NULL,
  cancelled_via TEXT NULL CHECK (
    cancelled_via IS NULL OR cancelled_via IN ('public_booking', 'assistant_workspace', 'system', 'manual_import')
  ),
  cancellation_reason TEXT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT confirmed_appointments_require_provider CHECK (
    status <> 'confirmed' OR provider_id IS NOT NULL
  ),
  CONSTRAINT confirmed_appointments_require_interval CHECK (
    status <> 'confirmed' OR (scheduled_start_at IS NOT NULL AND scheduled_end_at IS NOT NULL)
  ),
  CONSTRAINT appointment_interval_order CHECK (
    scheduled_start_at IS NULL OR scheduled_end_at IS NULL OR scheduled_end_at > scheduled_start_at
  )
);

CREATE INDEX IF NOT EXISTS appointments_lead_id_idx ON appointments(lead_id);
CREATE INDEX IF NOT EXISTS appointments_provider_schedule_idx
  ON appointments(provider_id, scheduled_start_at, scheduled_end_at)
  WHERE status = 'confirmed';
CREATE INDEX IF NOT EXISTS appointments_status_idx ON appointments(status);
CREATE INDEX IF NOT EXISTS appointments_calendar_event_id_idx ON appointments(calendar_event_id);

COMMENT ON TABLE appointments IS
  '61.2-06B durable Appointment Domain. Complements Leads; does not replace Leads as Source of Truth.';

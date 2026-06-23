# 61.2-06B Proposed Appointment Foundation SQL

Status: PROPOSED / NOT DEPLOYED
Date: 2026-06-23

This is a design proposal only. Do not deploy without implementation approval and production migration review.

```sql
-- Proposed enum/check vocabulary only. Final implementation may use CHECK constraints.
-- appointment statuses:
-- requested, suggested_alternative, pending_patient_confirmation, confirmed,
-- needs_assistant_review, rescheduled, cancelled, expired

create table if not exists appointment_providers (
  id text primary key,
  display_name text not null,
  active boolean not null default true,
  default_slot_minutes integer not null default 60,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists appointments (
  id text primary key,
  lead_id text null,
  provider_id text null references appointment_providers(id),
  requested_date date null,
  requested_time text null,
  scheduled_start_at timestamptz null,
  scheduled_end_at timestamptz null,
  duration_minutes integer not null default 60,
  service text not null,
  status text not null,
  source text not null,
  patient_name text not null,
  patient_email text null,
  patient_phone text null,
  notes text null,
  calendar_event_id text null,
  created_by_user_id text null,
  created_by_role text null,
  created_via text not null,
  updated_by_user_id text null,
  updated_by_role text null,
  updated_via text null,
  cancelled_by_user_id text null,
  cancelled_by_role text null,
  cancelled_via text null,
  cancellation_reason text null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint appointments_status_check check (
    status in (
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
  constraint appointments_duration_positive check (duration_minutes > 0),
  constraint appointments_confirmed_has_provider check (
    status <> 'confirmed' or provider_id is not null
  ),
  constraint appointments_confirmed_has_schedule check (
    status <> 'confirmed' or (scheduled_start_at is not null and scheduled_end_at is not null)
  )
);

create index if not exists idx_appointments_lead_id on appointments(lead_id);
create index if not exists idx_appointments_provider_schedule on appointments(provider_id, scheduled_start_at, scheduled_end_at);
create index if not exists idx_appointments_status on appointments(status);
create index if not exists idx_appointments_calendar_event_id on appointments(calendar_event_id);
```

## Conflict Rule

Database exclusion constraints may be considered later if PostgreSQL range types/extensions are approved. For 61.2-06B, conflict detection can begin in service-layer tests with indexed provider/time lookup.

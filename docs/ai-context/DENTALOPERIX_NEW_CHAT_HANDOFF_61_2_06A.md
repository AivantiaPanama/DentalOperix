# DentalOperix New Chat Handoff - 61.2-06A Appointment Domain Discovery

Status: REQUIRED GATE
Date: 2026-06-23

## Mandatory Language

Responder y trabajar completamente en español.

## Current Program State

- 57.x Persistence Transition: CLOSED / CERTIFIED
- Production Cutover: CERTIFIED
- 61.1 Users + Authentication + RBAC + Dashboard Routing: CLOSED / CERTIFIED
- 61.2 Assistant / Front Desk Workspace: IN PROGRESS
- PR-61.2-05 Lead Notes: COMPLETE / VALIDATED / CERTIFIED
- 61.2-06A Appointment Domain Discovery: CURRENT REQUIRED GATE

## Certified Leads Architecture

```text
Leads
  -> LeadPersistencePort
  -> LeadPersistenceProvider
  -> RelationalLeadPersistenceAdapter
  -> Supabase PostgreSQL
```

Leads = Source of Truth remains mandatory.

## Decision Made

PR-61.2-06 Appointment Operations must not proceed directly to implementation.

61.2-06A Appointment Domain Discovery is mandatory before designing Appointment Operations.

## Why

The current system contains date/time-only booking slot behavior and local appointment read surfaces. This is insufficient for multi-provider clinical operations.

Do not assume:

```text
date + time = slot availability
```

Assume instead:

```text
date + time + provider/resource = availability
```

Do not assume:

```text
Appointment Request = Confirmed Appointment
```

## ADRs to Respect

- ADR-61.2-06A-01 Appointment Audit Trail
- ADR-61.2-06A-02 Provider Availability
- ADR-61.2-06A-03 Appointment Request Lifecycle
- ADR-61.2-06A-04 Appointment Domain Reassessment

## Current Code Findings

- `src/lib/appointments-store.ts` stores appointments in localStorage.
- `getBookedSlots(date)` returns blocked times only by date/time.
- `BookingDialog.tsx` disables time slots globally when `booked.includes(t)`.
- `TodayScheduleWidget.tsx` shows appointments from local appointment store.
- Provider display is derived from service name, not persisted assignment.
- `processDentalLead()` creates a Lead and then attempts Google Calendar event creation.
- Google Calendar event creation has fixed 45-minute duration and no provider-level availability check.

## Protected Components

Do not modify without explicit authorization:

- BookingDialog
- processDentalLead
- /api/leads/create
- Calendar
- Gmail
- FloatingDentalAIChat
- Home
- siteServices.ts

## Forbidden Outcomes

Do not introduce:

- Dual Write
- Lead Replacement
- New Source of Truth
- Persistence Re-Architecture
- Analytics Write Back
- RBAC Bypass

## Deferred Decisions

Do not model or implement without Architecture Review:

- Doctor <-> Patient Assignment
- Lead <-> Patient Relationship
- Retention Policy
- Soft Delete Policy
- Real-Time Updates
- Global Search Scope

## Next Step

Use the 61.2-06A documentation package to design 61.2-06B Appointment Foundation. Before code, deliver:

1. Architecture Review
2. Affected dependencies
3. Risks
4. Technical impact
5. Architectural options
6. Technical recommendation
7. File-by-file implementation plan
8. Test strategy
9. Documentation strategy

No code until explicit approval.

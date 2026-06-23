# DentalOperix New Chat Handoff - 61.2-06A Post Discovery v1

Status: DISCOVERY REPORT V1 COMPLETE
Date: 2026-06-23
Language: Spanish required for user-facing work.

## Program State

- 57.x Persistence Transition: CLOSED / CERTIFIED
- Production Cutover: CERTIFIED
- 61.1 Users + Authentication + RBAC + Dashboard Routing: CLOSED / CERTIFIED
- 61.2 Assistant / Front Desk Workspace: IN PROGRESS
- PR-61.2-05 Lead Notes: COMPLETE / VALIDATED / CERTIFIED
- 61.2-06A Appointment Domain Discovery: DISCOVERY REPORT V1 COMPLETE

## Mandatory Certified Architecture

```text
Leads
  -> LeadPersistencePort
  -> LeadPersistenceProvider
  -> RelationalLeadPersistenceAdapter
  -> Supabase PostgreSQL
```

Leads = Source of Truth remains mandatory.

## Discovery v1 Confirmed Findings

1. The current appointment model is a minimal front-end type in `src/lib/clinic-data.ts`.
2. `src/lib/appointments-store.ts` persists appointments in browser `localStorage` under `dentaloperix_appointments_v1`.
3. `getBookedSlots(date)` blocks by date/time only and returns occupied `time` values.
4. `BookingDialog.tsx` disables any booked time globally using `booked.includes(t)`.
5. Today's Schedule reads from local appointment store.
6. Provider display in Today's Schedule is static service-to-provider mapping, not persisted assignment.
7. Patient booking creates a Lead through `processDentalLead()` and then attempts Google Calendar event creation.
8. Calendar event creation has no provider availability/conflict check.
9. No durable Appointment persistence layer was found.
10. No appointment audit trail was found.
11. No appointment request lifecycle was found.
12. No Assistant Appointment Operations workflow was found.
13. Governance backlog includes GRC-005 Execution Continuity Rule.

## Gate Decision

Appointment Operations remains blocked.

Next recommended phase:

```text
61.2-06B Appointment Foundation
```

Do not proceed directly to Assistant create/modify/cancel UI.

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

## Next Required Work

Before code, deliver for 61.2-06B:

1. Architecture Review
2. Affected dependencies
3. Risks
4. Technical impact
5. Architectural options
6. Technical recommendation
7. File-by-file implementation plan
8. Test strategy
9. Documentation strategy

## Execution Continuity Rule

When objective, scope, and approval exist, and no business/architecture decision is pending, execute the next planned activity and produce the next deliverable without redundant confirmation.

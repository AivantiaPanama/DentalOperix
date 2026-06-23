# DentalOperix New Chat Handoff - 61.2-06B Appointment Foundation Planning

Status: 61.2-06B DESIGN DRAFT COMPLETE / NO CODE IMPLEMENTED
Date: 2026-06-23
Language: Spanish required for user-facing work.

## Program State

- 57.x Persistence Transition: CLOSED / CERTIFIED
- Production Cutover: CERTIFIED
- 61.1 Users + Authentication + RBAC + Dashboard Routing: CLOSED / CERTIFIED
- 61.2 Assistant / Front Desk Workspace: IN PROGRESS
- PR-61.2-05 Lead Notes: COMPLETE / VALIDATED / CERTIFIED
- 61.2-06A Appointment Domain Discovery: COMPLETE / DISCOVERY V1
- 61.2-06B Appointment Foundation: DESIGN DRAFT COMPLETE / PENDING APPROVAL

## Mandatory Architecture

Leads remain Source of Truth:

```text
Leads
  -> LeadPersistencePort
  -> LeadPersistenceProvider
  -> RelationalLeadPersistenceAdapter
  -> Supabase PostgreSQL
```

## 61.2-06A Findings Used

- Current availability blocks by date/time only.
- No provider-aware availability exists.
- No durable Appointment domain exists.
- No appointment request lifecycle exists.
- No appointment audit trail exists.

## 61.2-06B Direction

Create additive Appointment bounded context:

- Appointment durable persistence.
- Provider-aware availability.
- Appointment lifecycle statuses.
- Appointment audit trail.
- Optional Lead reference.
- Calendar integration metadata only.

## Do Not Implement Yet

No code should be generated until explicit approval.

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
- New Source of Truth for Leads
- Persistence Re-Architecture
- Analytics Write Back
- RBAC Bypass

## Deferred Decisions

Do not model:

- Doctor ↔ Patient Assignment
- Lead ↔ Patient Relationship
- Retention Policy
- Soft Delete Policy
- Real-Time Updates
- Global Search Scope

## Next Step

Review and approve the detailed 61.2-06B design. If approved, implementation should proceed as isolated foundation work before any Assistant Appointment UI.

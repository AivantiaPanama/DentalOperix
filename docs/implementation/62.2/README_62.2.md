# DentalOperix Phase 62.2

Patient Implementation Readiness and Governance Certification Phase.

## Status

62.2 OPENED.

## Purpose

Close certification criteria, approval checklist, residual risks, conceptual rollback, and formal authorization path before any future implementation.


## Certified Baseline

- 57.x CLOSED / CERTIFIED.
- 61.1 CLOSED / CERTIFIED.
- 61.2 CLOSED / CERTIFIED.
- 61.3 CLOSED / CERTIFIED.
- 61.4 CLOSED / DISCOVERY CERTIFIED / ARCHITECTURE CERTIFIED.

## Certified Architecture

```text
Leads -> LeadPersistencePort -> LeadPersistenceProvider -> RelationalLeadPersistenceAdapter -> Supabase PostgreSQL
```

## Source of Truth Constraints

- Leads = Source of Truth for acquisition, marketing, and lead lifecycle.
- Patients = Source of Truth for person identity.
- Appointments = Source of Truth for scheduled operational events.

## Protected Components

BookingDialog, processDentalLead, /api/leads/create, Calendar, Gmail, FloatingDentalAIChat, Home, siteServices.ts.

## Prohibited Actions

Dual Write, Lead Replacement, New Lead Source of Truth, Persistence Re-Architecture, RBAC Bypass, Automated Patient Merge.


## Scope

Certification criteria, governance certification checklist, residual risk review, rollback framework, implementation authorization matrix, production readiness certification, governance retrospective, final certification board review.

## Exclusions

Implementation, code generation, database changes, API implementation, UI implementation, runtime activation, production deployment.

# DentalOperix Phase 62.1

Patient Technical Design Phase.

## Status

62.1 OPENED / TECHNICAL DESIGN CERTIFICATION CANDIDATE.

## Purpose

Convert 62.0 Patient domain design into technical design specifications without implementation.


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


## Scope Completed

- Canonical Patient Identifier Strategy.
- Identity Evidence Technical Model.
- Patient Domain Service Blueprint.
- Authorization Matrix Design.
- Patient Event Model.
- Persistence Impact and Option Analysis.
- API Boundary Analysis.
- Migration Impact Assessment.
- Technical Design Consolidation Review.

## Final Decision

Technical design is approved as a certification candidate. Implementation remains unauthorized.

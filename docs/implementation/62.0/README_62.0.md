# DentalOperix Phase 62.0

Patient Design Phase.

## Status

62.0 OPENED / DOMAIN DESIGN CERTIFICATION CANDIDATE.

## Purpose

Transform the certified 61.4 Patient Discovery baseline into certifiable domain design artifacts before any technical implementation design.

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

- 62.0-00 Phase Opening and Design Plan.
- 62.0-01 Patient Domain Ownership Matrix.
- 62.0-01A Formal Patient-Owned Attributes Definition.
- 62.0-01B Patient Aggregate Boundary Definition.
- 62.0-02 Identity Certification Rules Framework.
- 62.0-03 Lead Patient Relationship Model.
- 62.0-04 Patient Appointment Association Model.
- 62.0-05 Patient Auditability Model.
- 62.0-06 Patient Governance Rulebook.
- 62.0-07 Architecture Synthesis and Domain Certification Review.

## Final Decision

Patient domain design is approved as a certification candidate. Implementation and code generation remain explicitly unauthorized.

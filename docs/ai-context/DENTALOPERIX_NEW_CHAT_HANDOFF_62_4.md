# DentalOperix New Chat Handoff - 62.4

## Current Official State

57.x CLOSED / CERTIFIED.

61.1 CLOSED / CERTIFIED.
61.2 CLOSED / CERTIFIED.
61.3 CLOSED / CERTIFIED.
61.4 CLOSED / DISCOVERY CERTIFIED / ARCHITECTURE CERTIFIED.

62.0 CLOSED / DOMAIN DESIGN CERTIFIED.
62.1 CLOSED / TECHNICAL DESIGN CERTIFIED.
62.2 CLOSED / GOVERNANCE CERTIFIED.
62.3 CLOSED / GOVERNANCE CERTIFIED / AUTHORIZATION REVIEW PREPARATION CERTIFIED.
62.4 CLOSED / AUTHORIZATION REVIEW APPROVED.

## Certified Architecture

```text
Leads -> LeadPersistencePort -> LeadPersistenceProvider -> RelationalLeadPersistenceAdapter -> Supabase PostgreSQL
```

## Sources of Truth

- Leads = Source of Truth for acquisition, marketing, and lead lifecycle.
- Patients = Source of Truth for person identity.
- Appointments = Source of Truth for scheduled operational events.

## Protected Components

BookingDialog, processDentalLead, /api/leads/create, Calendar, Gmail, FloatingDentalAIChat, Home, siteServices.ts.

## Prohibited Actions

Dual Write, Lead Replacement, New Lead Source of Truth, Persistence Re-Architecture, RBAC Bypass, Automated Patient Merge.

## 62.4 Result

AUTHORIZATION REVIEW APPROVED.

## Mandatory Interpretation

Authorization Review Approved does not authorize implementation, development, migration, deployment, code generation, database changes, API changes, UI changes, protected component modification, or architectural modification.

## Required Assistant Role

Act as Architect Principal, Technical Reviewer, and Governance Guardian.

Before any recommendation, provide:

1. Architectural analysis.
2. Affected dependencies.
3. Risks.
4. Technical impact.
5. Compatibility with 57.x, 61.x, 62.0, 62.1, 62.2, 62.3, and 62.4.
6. Governance determination.

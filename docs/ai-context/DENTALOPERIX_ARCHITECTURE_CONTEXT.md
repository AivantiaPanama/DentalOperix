# DentalOperix Architecture Context

Status: ACTIVE
Owner: Architecture Governance
Last updated: 2026-06-20

## Governing Documents

- `docs/architecture/57.9_DOCUMENTATION_CONSOLIDATION_AND_PROGRAM_CLOSURE.md`
- `docs/architecture/60.0_CLINICAL_INTELLIGENCE_PROGRAM_PLAN.md`
- `docs/architecture/DEVELOPMENT_GOVERNANCE_PATTERNS.md`
- `docs/architecture/IMPLEMENTATION_CHECKLIST.md`
- `docs/architecture/PROJECT_SCOPE_AND_EXPECTED_BEHAVIOR.md`

## Certified Persistence

```text
Leads
  -> LeadPersistencePort
  -> LeadPersistenceProvider
  -> RelationalLeadPersistenceAdapter
  -> Supabase PostgreSQL
```

## Source-of-Truth Boundaries

| Entity | Source of Truth |
|---|---|
| Lead acquisition and booking origin | Leads |
| Login identity | Users |
| User authorization | Roles / RBAC |
| Patient clinical relationship | Patients |
| Appointment operation | Appointments |
| Dashboards / analytics | Read-only derived data |

## Forbidden Architecture Outcomes

- Patients replacing Leads.
- Appointments replacing Leads.
- Analytics writing operational state.
- Dashboards creating operational records.
- Google Sheets becoming runtime source of truth without approved rollback.

## 61.x Architecture Position

61.x adds Identity, RBAC, Patient Management, and Role-Based Dashboards on top of the certified Leads architecture. It does not reopen 57.x.

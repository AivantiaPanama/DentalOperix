# DentalOperix Architecture Context

Status: ACTIVE
Owner: Architecture Governance
Last updated: 2026-06-21

## Governing Documents

- `docs/architecture/57.9_DOCUMENTATION_CONSOLIDATION_AND_PROGRAM_CLOSURE.md`
- `docs/architecture/60.0_CLINICAL_INTELLIGENCE_PROGRAM_PLAN.md`
- `docs/architecture/DEVELOPMENT_GOVERNANCE_PATTERNS.md`
- `docs/architecture/IMPLEMENTATION_CHECKLIST.md`
- `docs/architecture/PROJECT_SCOPE_AND_EXPECTED_BEHAVIOR.md`
- `docs/ai-outputs/CLAUDE/RBAC-MATRIX-V1.1.md`

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
| Patient clinical relationship | Patients - future scope, not 61.1 |
| Appointment operation | Appointments |
| Dashboards / analytics | Read-only derived data |

## RBAC Architecture Constraints

RBAC is an authorization layer only.

RBAC must not modify, bypass, replace, or directly write through:

- LeadPersistencePort
- LeadPersistenceProvider
- RelationalLeadPersistenceAdapter
- Supabase PostgreSQL

RBAC does not authorize direct persistence access.

RBAC does not reopen Program 57.x.

RBAC does not alter:

```text
Leads = Source of Truth
```

## 61.1 RBAC Constraints

- `lead.create` is denied for all roles via RBAC.
- Lead creation remains exclusively tied to `BookingDialog -> processDentalLead -> /api/leads/create`.
- `lead.delete.physical` is denied for all roles.
- `lead.owner.reassign` is Administrator-only.
- Physical deletion of Appointments is prohibited.
- Physical deletion of Users is prohibited.
- Patient Records are out of scope for 61.1.

## Forbidden Architecture Outcomes

- Patients replacing Leads.
- Appointments replacing Leads.
- Analytics writing operational state.
- Dashboards creating operational records.
- RBAC bypassing certified persistence architecture.
- RBAC introducing Dual Write.
- RBAC introducing Lead Replacement.
- Google Sheets becoming runtime source of truth without approved rollback.

## 61.x Architecture Position

61.x adds Identity, RBAC, Patient Management, and Role-Based Dashboards on top of the certified Leads architecture. It does not reopen 57.x.

## Open Architecture Questions

The following are deliberately unresolved by RBAC-MATRIX-V1.1:

1. Doctor <-> Patient Assignment Model.
2. Lead <-> Patient Relationship Model.
3. Retention / Soft Delete Policy.
4. Role Assignment Workflow.

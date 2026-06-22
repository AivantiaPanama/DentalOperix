# Iteration 61.1 - Users & RBAC Foundation

Status: `READY_FOR_IMPLEMENTATION`
Priority: `P0`
Owner: Architecture / Product Governance
Last updated: 2026-06-22

## Objective

Define and implement the foundation for DentalOperix user identity and role-based access control without altering the certified Leads architecture.

## Business Reason

DentalOperix cannot become a sellable multi-role clinic product without secure users, differentiated role-based access, and dashboard routing for Patient, Assistant, Doctor, and Administrator.

## Certified Architecture Constraint

```text
Leads
-> LeadPersistencePort
-> LeadPersistenceProvider
-> RelationalLeadPersistenceAdapter
-> Supabase PostgreSQL
```

Permanent rule:

```text
Leads = Source of Truth
```

## Official Functional Baseline

The official functional baseline for iteration 61.1 is:

```text
docs/ai-outputs/CLAUDE/RBAC-MATRIX-V1.1.md
```

Architecture review result:

```text
RBAC-MATRIX-V1.1
Functional Approval: PASS
Architecture Compatibility: PASS
Leads = Source of Truth: PASS

ARCHITECTURE-CERTIFICATION-REVIEW-61.1-V1.1
Status: READY_FOR_IMPLEMENTATION
```

## Scope

- Unified user identity foundation.
- Roles and permissions.
- Role-based dashboard routing.
- User lifecycle model: create, read, update, deactivate, reactivate.
- RBAC permission catalog for 61.1.
- RBAC acceptance criteria.

## Roles

- Patient
- Assistant
- Doctor
- Administrator

## RBAC Business Rules

| ID | Rule |
|---|---|
| `BR-RBAC-001` | No role may create, modify, or bypass the persistence adapter, or write directly to Supabase PostgreSQL outside the certified Leads flow. |
| `BR-RBAC-002` | Only Administrator may assign or change a user's role. |
| `BR-RBAC-003` | Doctor access to Leads and future Patient Records is limited to assigned patients. The assignment mechanism is an open architecture question. |
| `BR-RBAC-004` | Patient never has read access to Leads belonging to other patients. |
| `BR-RBAC-005` | Every `lead.status.update`, `lead.notes.update`, or `lead.owner.reassign` action must be attributable using existing model metadata such as `updated_by` and `updated_at`. This does not require a new store. |
| `BR-RBAC-006` | Physical deletion of Leads is prohibited for all roles. Any visible removal is a logical status change preserving Source of Truth. |
| `BR-RBAC-007` | Physical deletion of Appointments and Users is prohibited for all roles. Cancellation and deactivation are the terminal operations. |
| `BR-RBAC-008` | RBAC is an authorization layer only. RBAC does not modify LeadPersistencePort, LeadPersistenceProvider, RelationalLeadPersistenceAdapter, or Supabase PostgreSQL. |

## Dashboard Routing

| Role | Dashboard Target |
|---|---|
| Patient | Patient Portal |
| Assistant | Front Desk Workspace |
| Doctor | Clinical Workspace |
| Administrator | Operations Console |

## Protected Components

Do not modify without explicit approval:

- BookingDialog
- processDentalLead
- /api/leads/create
- Calendar
- Gmail
- FloatingDentalAIChat
- Home
- siteServices.ts

## Explicitly Out of Scope for 61.1

- Patient Records implementation.
- Lead-to-Patient conversion model.
- Doctor-to-Patient assignment model.
- Retention / legal-hold policy.
- New persistence architecture.
- Dual Write.
- Lead Replacement.
- Analytics Write Back.

## AI Assignments

| Work | AI |
|---|---|
| Architecture and governance review | ChatGPT |
| Permission matrix and business rules | Claude |
| UI management screens | v0 / Figma |
| Implementation candidate | Cursor after explicit approval |

## Acceptance Criteria

- User identity does not replace Leads.
- RBAC does not bypass existing auth or persistence semantics.
- Each role has a defined dashboard landing target.
- Administrator can manage user lifecycle except physical deletion.
- Administrator is the only role that can assign roles.
- Lead creation remains exclusively through the certified Booking flow.
- Lead physical deletion is prohibited.
- Appointment physical deletion is prohibited.
- Tests cover role checks.
- Documentation references `RBAC-MATRIX-V1.1`.

## Required Documentation Updates

Completed as part of `DUP-61.1-RBAC`:

- `docs/ai-outputs/CLAUDE/RBAC-MATRIX-V1.1.md`
- `docs/ai-outputs/REVIEWS/RBAC-ARCHITECTURE-REVIEW-V1.1.md`
- `docs/product-governance/61.0_PRODUCT_DECISION_LOG.md`
- `docs/product-governance/61.0_PRODUCT_MEMORY.md`
- `docs/product-governance/61.0_RELEASE_READINESS_CHECKLIST.md`
- `docs/product-governance/61.0_MODULE_DEPENDENCY_MAP.md`
- `docs/ai-context/DENTALOPERIX_ARCHITECTURE_CONTEXT.md`
- `docs/product-governance/61.0_PRODUCT_GOVERNANCE_DASHBOARD.md`
- `docs/product-governance/61.0_CURRENT_PROJECT_STATUS.md`

## Open Architecture Questions

1. Doctor <-> Patient Assignment Model.
2. Lead <-> Patient Relationship Model.
3. Retention / Soft Delete Policy.

## Resolved Architecture Questions

1. Role Assignment Workflow.
   - Status: `RESOLVED`
   - Decision: `Option A — Administrator-Created Users`
   - Reference: `docs/architecture/ARCHITECTURE-CERTIFICATION-REVIEW-61.1-V1.1.md`

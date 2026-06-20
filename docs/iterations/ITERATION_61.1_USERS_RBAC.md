# Iteration 61.1 - Users & RBAC Foundation

Status: READY_FOR_DESIGN
Priority: P0
Owner: Architecture / Product Governance
Last updated: 2026-06-20

## Objective

Define and implement the foundation for DentalOperix user identity and role-based access control.

## Business Reason

DentalOperix cannot become a sellable multi-role clinic product without secure users and differentiated access for Patient, Assistant, Doctor, and Administrator.

## Scope

- Unified users table design.
- Roles and permissions.
- Login/session governance.
- Role-based dashboard routing proposal.
- RBAC acceptance criteria.

## Roles

- Patient
- Assistant
- Doctor/Dentist
- Administrator

## AI Assignments

| Work | AI |
|---|---|
| Architecture design | ChatGPT |
| Permission matrix | Claude |
| UI management screens | v0 |
| Implementation candidate | Cursor after approval |

## Protected Components

Do not modify without explicit approval:

- BookingDialog
- processDentalLead
- /api/leads/create
- Calendar
- Gmail

## Acceptance Criteria

- User identity does not replace Leads.
- RBAC does not bypass existing auth semantics.
- Each role has a defined dashboard landing target.
- Admin can manage users in future scope.
- Tests cover role checks.

## Required Documentation Updates

- `61.0_MODULE_CATALOG.md`
- `61.0_PRODUCT_GOVERNANCE_DASHBOARD.md`
- `PROJECT_SCOPE_AND_EXPECTED_BEHAVIOR.md`
- `IMPLEMENTATION_CHECKLIST.md`

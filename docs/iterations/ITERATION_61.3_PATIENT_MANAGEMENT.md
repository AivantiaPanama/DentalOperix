# Iteration 61.3 - Patient Management

Status: PLANNED
Priority: P1
Owner: Product / Architecture Governance
Last updated: 2026-06-20

## Objective

Define the patient domain without replacing Leads as the source of truth for commercial acquisition and booking origin.

## Scope

- Patient profile.
- Multiple emails.
- Multiple phones.
- Billing profiles.
- Lead origin link.
- Patient status.
- Data quality classification.

## AI Assignments

| Work | AI |
|---|---|
| User stories and business rules | Claude |
| Data model proposal | ChatGPT |
| Patient UI mockup | v0/Lovable |
| Implementation candidate | Cursor after approval |

## Acceptance Criteria

- Patient links to lead origin but does not replace Lead.
- Multiple contact methods are supported.
- Billing data is separated from contact data.
- Patient data access is governed by RBAC.
- Analytics remains read-only.

## Required Documentation Updates

- `61.0_MODULE_CATALOG.md`
- `PATIENT_DASHBOARD_SPEC.md`
- `PROJECT_SCOPE_AND_EXPECTED_BEHAVIOR.md`

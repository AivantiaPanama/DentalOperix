# DentalOperix New Chat Handoff - 61.1

Use this file when starting a new ChatGPT session.

## Current certified state

```text
Program 57.x: CLOSED / CERTIFIED
61.0 Documentation Governance Consolidation: COMPLETE
61.1 Users + RBAC + Dashboard Routing: AUTHORIZED_FOR_IMPLEMENTATION
61.2 Assistant / Front Desk Workspace: FUNCTIONAL_PACKAGE_COMPLETE / BLOCKED BY 61.1 IMPLEMENTATION
61.3 Patient Management: NOT_STARTED
```

## Immediate next step

```text
Create Cursor Implementation Task Package 61.1
```

Do not create more functional documentation for 61.2 before 61.1 implementation is complete and certified.

## Required source documents for the new chat

1. `docs/ai-context/DENTALOPERIX_QUICK_START.md`
2. `docs/ai-context/DENTALOPERIX_MASTER_CONTINUATION_PROMPT.md`
3. `docs/product-governance/CURRENT_PROGRAM_STATUS.md`
4. `docs/product-governance/61.0_CURRENT_PROJECT_STATUS.md`
5. `docs/product-governance/61.0_PRODUCT_DECISION_LOG.md`
6. `docs/product-governance/61.0_PRODUCT_MEMORY.md`
7. `docs/architecture/ARCHITECTURE-CERTIFICATION-REVIEW-61.1-V1.1.md`
8. `docs/architecture/IMPLEMENTATION-READINESS-REVIEW-61.1-V1.0.md`
9. `docs/architecture/IMPLEMENTATION-AUTHORIZATION-REVIEW-61.1-V1.0.md`
10. `docs/architecture/IMPLEMENTATION-BLUEPRINT-61.1-USERS-RBAC-V1.0.md`

## Permanent rules

```text
Leads = Source of Truth
Users = Identity only
RBAC = Authorization only
```

## Protected components

Do not modify without explicit authorization:

```text
BookingDialog
processDentalLead
/api/leads/create
Calendar
Gmail
FloatingDentalAIChat
Home
siteServices.ts
```

## Prohibited changes

```text
Dual Write
Lead Replacement
Product Migration
New source of truth
Analytics Write Back
Persistence Re-Architecture
RBAC bypass
Patient Management in 61.1
Lead-to-Patient conversion in 61.1
Doctor-to-Patient assignment in 61.1
```

## Authorized 61.1 scope

```text
Users Foundation
Authentication
RBAC Enforcement frontend + backend
Dashboard Routing
Administrator-created users
Administrator-only role assignment
```

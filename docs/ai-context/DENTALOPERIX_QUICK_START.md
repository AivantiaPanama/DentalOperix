# DentalOperix Quick Start

Use this file to start a new ChatGPT / AI delivery session without losing context.

## Required first-read order

1. `docs/ai-context/DENTALOPERIX_MASTER_CONTINUATION_PROMPT.md`
2. `docs/product-governance/CURRENT_PROGRAM_STATUS.md`
3. `docs/product-governance/61.0_CURRENT_PROJECT_STATUS.md`
4. `docs/product-governance/61.0_PRODUCT_MEMORY.md`
5. `docs/product-governance/61.0_PRODUCT_DECISION_LOG.md`
6. `docs/product-governance/61.0_PRODUCT_GOVERNANCE_DASHBOARD.md`
7. `docs/product-governance/61.0_RELEASE_READINESS_CHECKLIST.md`
8. `docs/architecture/ARCHITECTURE-CERTIFICATION-REVIEW-61.1-V1.1.md`
9. `docs/architecture/IMPLEMENTATION-READINESS-REVIEW-61.1-V1.0.md`
10. `docs/architecture/IMPLEMENTATION-AUTHORIZATION-REVIEW-61.1-V1.0.md`
11. `docs/architecture/IMPLEMENTATION-BLUEPRINT-61.1-USERS-RBAC-V1.0.md`

## Current certified state

```text
61.0 Documentation Governance Consolidation: COMPLETE
61.1 Users + RBAC + Dashboard Routing: AUTHORIZED_FOR_IMPLEMENTATION
61.2 Assistant / Front Desk Workspace: FUNCTIONAL_PACKAGE_COMPLETE, BLOCKED BY 61.1 IMPLEMENTATION
61.3 Patient Management: NOT_STARTED
```

## Current priority

```text
Create Cursor Implementation Task Package 61.1
Then execute controlled implementation of:
Users Foundation -> Authentication -> RBAC Enforcement -> Dashboard Routing -> Validation -> Certification
```

## Permanent architecture rule

```text
Leads = Source of Truth
```

## Permanent restrictions

Do not introduce Dual Write, Lead Replacement, Product Migration, new sources of truth, Analytics Write Back, Persistence Re-Architecture, RBAC bypass, or changes to protected components without explicit authorization.

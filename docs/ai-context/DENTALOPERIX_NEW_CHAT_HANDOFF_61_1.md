# DentalOperix New Chat Handoff - 61.1 PR-3 Readiness

## START HERE

Use this file as the single entry point when starting a new ChatGPT or Cursor session for Iteration 61.1 implementation.

Read in this order:

1. `docs/ai-context/DENTALOPERIX_NEW_CHAT_HANDOFF_61_1.md`
2. `docs/ai-context/61.1_NEW_CHAT_CODE_GENERATION_PROMPT.md`
3. `docs/implementation/61.1/61.1_AUDIT_HANDOFF_FOR_PR3.md`
4. `docs/implementation/61.1/61.1_IMPLEMENTATION_TASK_PACKAGE_V1.0.md`
5. `docs/implementation/61.1/61.1_CURSOR_EXECUTION_PLAN.md`
6. `docs/implementation/61.1/61.1_REQUIREMENTS_TRACEABILITY_MATRIX.md`
7. `docs/implementation/61.1/61.1_TEST_STRATEGY.md`
8. `docs/implementation/61.1/61.1_CERTIFICATION_CHECKLIST.md`
9. `docs/implementation/61.1/61.1_IMPLEMENTATION_STATUS.md`
10. `docs/implementation/61.1/61.1_IMPLEMENTATION_DECISION_LOG.md`
11. `docs/implementation/61.1/61.1_RISK_REGISTER.md`

Do not read historical documents unless explicitly required by an architecture or governance question.

---

## Implementation Baseline

```text
Implementation Baseline: 61.1-GOVERNANCE-PACKAGE-V1.2
Frozen Date: 2026-06-22
Architecture Status: CERTIFIED
Implementation Status: AUTHORIZED_FOR_IMPLEMENTATION
Current Execution Target:
PR-4 Dashboard Routing
STATUS: CERTIFIED
```

---

## Current Certified State

```text
Program 57.x: CLOSED / CERTIFIED
Persistence Transition: CLOSED / CERTIFIED
Production Cutover: CERTIFIED
61.0 Documentation Governance Consolidation: COMPLETE
61.1 Users + RBAC + Dashboard Routing: IN_PROGRESS
61.2 Assistant / Front Desk Workspace: FUNCTIONAL_PACKAGE_COMPLETE / BLOCKED BY 61.1 CERTIFICATION
61.3 Patient Management: NOT_STARTED
```

---

## Completed 61.1 Work

```text
PR-1 Users Foundation: PASS
PR-2 Authentication Foundation: PASS
```

PR-1 evidence:

```text
4 test suites passed
14 tests passed
Production build passed
```

PR-2 evidence:

```text
16 authentication tests passed
Production build passed
```

Known unrelated regression context:

```text
Full suite reported 451 passed and 2 failed.
The failed tests were classified as pre-existing and unrelated to PR-2:
- src/routes/api/analytics/revenue.test.ts
- src/routes/api/crm/metrics.test.ts
```

---

## Certified Architecture

```text
Leads
-> LeadPersistencePort
-> LeadPersistenceProvider
-> RelationalLeadPersistenceAdapter
-> Supabase PostgreSQL
```

Absolute rule:

```text
Leads = Source of Truth
```

Supporting rules:

```text
Users = Identity only
RBAC = Authorization only
Dashboard Routing = Role-based navigation only
```

---

## Protected Components

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

Expected result during 61.1:

```text
NO FUNCTIONAL CHANGE
```

---

## Prohibited Changes

```text
Dual Write
Lead Replacement
Product Migration
New Source of Truth
Analytics Write Back
Persistence Re-Architecture
RBAC Bypass
Patient Management in 61.1
Lead-to-Patient conversion in 61.1
Doctor-to-Patient assignment in 61.1
```

---

## DO NOT DECIDE

The following items are deferred and must not be solved, modeled, implemented, or assumed during 61.1:

```text
Doctor <-> Patient Assignment Model
Lead <-> Patient Relationship Model
Retention Policy
Soft Delete Policy
Real-Time Updates
Global Search Scope
```

Status:

```text
DEFERRED
```

If any of these become necessary, stop implementation and request Architecture Review.

---

## Resolved Architecture Blocker

```text
BLOCK-61.1-001: RESOLVED
Decision: Option A - Administrator-Created Users
Rule: user.role.assign = Administrator only
```

This rule is mandatory for implementation and certification.

---

## Authorized 61.1 Scope

```text
Users Foundation
Authentication
RBAC Enforcement frontend + backend
Dashboard Routing
Administrator-created users
Administrator-only role assignment
```

Out of scope:

```text
Patient Management
Clinical Records
Doctor Assignment
Lead Assignment
Analytics Enhancements
Global Search
Real-Time Updates
Soft Delete Strategy
Retention Policies
```

---

## Current Execution Target

```text
PR-3: RBAC Enforcement
Status: READY_FOR_ARCHITECTURE_REVIEW
```

Authorized tasks:

```text
61.1-RBAC-001 - Role Model
61.1-RBAC-002 - Authorization Middleware
61.1-RBAC-003 - Frontend Route Protection
```

PR-3 must not implement Dashboard Routing, Patient Management, 61.2 Assistant Dashboard, Lead-to-Patient conversion, or Doctor-to-Patient assignment.

---

## Required Execution Order

```text
PR-1 Users Foundation
✓
PR-2 Authentication
✓
PR-3 RBAC Enforcement
STATUS: CERTIFIED
- current target
PR-4 Dashboard Routing
PR-5 Validation & Hardening
61.1 Certification
Unlock 61.2 Assistant Dashboard
```

No PR may skip its required validation gate.

---

## Mandatory Pre-Code Protocol for a New Chat

Before generating code, the new chat must produce:

1. Architecture compliance review for PR-3.
2. Affected dependencies.
3. Risks.
4. Technical impact.
5. Implementation plan.
6. Explicit confirmation that protected components will not be modified.
7. Explicit approval from the user.

Only after explicit approval should code be generated.

---

## First Prompt for the New Chat

Use this prompt to start the implementation chat:

```text
Read docs/ai-context/DENTALOPERIX_NEW_CHAT_HANDOFF_61_1.md.
Read docs/implementation/61.1/61.1_AUDIT_HANDOFF_FOR_PR3.md.
Follow all referenced governance documents.

Current execution target:
PR-3 RBAC Enforcement
STATUS: CERTIFIED

Tasks:
- 61.1-RBAC-001 Role Model
- 61.1-RBAC-002 Authorization Middleware
- 61.1-RBAC-003 Frontend Route Protection

Generate the architecture compliance review, affected dependencies, risks, technical impact, and implementation plan only.
Do not generate code until explicit approval is given.
Preserve Leads = Source of Truth.
Do not modify protected components.
Enforce user.role.assign = Administrator only.
```

---

## Certification Reminder

61.1 is not complete until:

```text
Users Foundation PASS
Authentication PASS
RBAC PASS
Dashboard Routing PASS
Security PASS
Regression PASS
Architecture Validation PASS
Certification Review PASS
```

Only then may 61.2 Assistant Dashboard move from:

```text
FUNCTIONAL_PACKAGE_COMPLETE / BLOCKED
```

to:

```text
IMPLEMENTATION_AUTHORIZED
```

# DentalOperix New Chat Handoff - 61.1 Code Generation Readiness

## START HERE

Use this file as the single entry point when starting a new ChatGPT or Cursor session for Iteration 61.1 implementation.

Read in this order:

1. `docs/ai-context/DENTALOPERIX_NEW_CHAT_HANDOFF_61_1.md`
2. `docs/implementation/61.1/61.1_IMPLEMENTATION_TASK_PACKAGE_V1.0.md`
3. `docs/implementation/61.1/61.1_CURSOR_EXECUTION_PLAN.md`
4. `docs/implementation/61.1/61.1_REQUIREMENTS_TRACEABILITY_MATRIX.md`
5. `docs/implementation/61.1/61.1_TEST_STRATEGY.md`
6. `docs/implementation/61.1/61.1_CERTIFICATION_CHECKLIST.md`
7. `docs/implementation/61.1/61.1_IMPLEMENTATION_STATUS.md`

Do not read historical documents unless explicitly required by an architecture or governance question.

---

## Implementation Baseline

```text
Implementation Baseline: 61.1-GOVERNANCE-PACKAGE-V1.2
Frozen Date: 2026-06-22
Architecture Status: CERTIFIED
Implementation Status: AUTHORIZED_FOR_IMPLEMENTATION
Current Execution Target: PR-1 Users Foundation
```

---

## Current Certified State

```text
Program 57.x: CLOSED / CERTIFIED
Persistence Transition: CLOSED / CERTIFIED
Production Cutover: CERTIFIED
61.0 Documentation Governance Consolidation: COMPLETE
61.1 Users + RBAC + Dashboard Routing: AUTHORIZED_FOR_IMPLEMENTATION
61.2 Assistant / Front Desk Workspace: FUNCTIONAL_PACKAGE_COMPLETE / BLOCKED BY 61.1 IMPLEMENTATION
61.3 Patient Management: NOT_STARTED
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
PR-1: Users Foundation
Status: READY TO START
```

Authorized tasks:

```text
61.1-FND-001 - User Domain Model
61.1-FND-002 - User Persistence Layer
```

PR-1 must not implement Authentication, RBAC enforcement, Dashboard Routing, Patient Management, or any future iteration scope.

---

## Required Execution Order

```text
PR-1 Users Foundation
-> PR-2 Authentication
-> PR-3 RBAC Enforcement
-> PR-4 Dashboard Routing
-> PR-5 Validation & Hardening
-> 61.1 Certification
-> Unlock 61.2 Assistant Dashboard
```

No PR may skip its required validation gate.

---

## Mandatory Pre-Code Protocol for a New Chat

Before generating code, the new chat must produce:

1. Architecture compliance review for the specific PR.
2. Affected dependencies.
3. Risks.
4. Technical impact.
5. Implementation plan.
6. Explicit confirmation that protected components will not be modified.

Only after explicit approval should code be generated.

---

## First Prompt for the New Chat

Use this prompt to start the implementation chat:

```text
Read docs/ai-context/DENTALOPERIX_NEW_CHAT_HANDOFF_61_1.md.
Follow all referenced governance documents.

Current execution target:
PR-1 Users Foundation
Tasks:
- 61.1-FND-001 User Domain Model
- 61.1-FND-002 User Persistence Layer

Generate the architecture compliance review, affected dependencies, risks, technical impact, and implementation plan only.
Do not generate code until explicit approval is given.
Preserve Leads = Source of Truth.
Do not modify protected components.
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

Only then may 61.2 Assistant Dashboard move from `FUNCTIONAL_PACKAGE_COMPLETE / BLOCKED` to `IMPLEMENTATION_AUTHORIZED`.

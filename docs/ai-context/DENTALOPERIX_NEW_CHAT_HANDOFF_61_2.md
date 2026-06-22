# DentalOperix New Chat Handoff - 61.2 Assistant / Front Desk Workspace

## START HERE

Use this file as the single entry point for a new ChatGPT or Cursor session starting Iteration 61.2.

Read in this order:

1. `docs/ai-context/DENTALOPERIX_NEW_CHAT_HANDOFF_61_1.md`
2. `docs/implementation/61.1/61.1_GOVERNANCE_CLOSURE_REPORT.md`
3. `docs/implementation/61.1/61.1_CERTIFICATION_PACKAGE.md`
4. `docs/ai-context/DENTALOPERIX_NEW_CHAT_HANDOFF_61_2.md`
5. Relevant 61.2 implementation package documents before proposing code.

Do not read historical documents unless explicitly required by an architecture or governance question.

---

## Certified Foundation

```text
Program 57.x: CLOSED / CERTIFIED
Persistence Transition: CLOSED / CERTIFIED
Production Cutover: CERTIFIED
61.0 Documentation Governance Consolidation: COMPLETE
61.1 Users + Authentication + RBAC + Dashboard Routing: CLOSED / CERTIFIED
61.2 Assistant / Front Desk Workspace: IMPLEMENTATION_AUTHORIZED
61.3 Patient Management: NOT_STARTED
```

---

## 61.1 Certification Evidence

```text
PR-1 Users Foundation: PASS / CERTIFIED
PR-2 Authentication Foundation: PASS / CERTIFIED
PR-3 RBAC Enforcement: PASS / CERTIFIED
PR-4 Dashboard Routing: PASS / CERTIFIED
PR-5 Validation & Hardening: PASS / CERTIFIED
```

Final validation:

```text
npm test: 107 test files passed, 464 tests passed
npm run build: client PASS, SSR PASS
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

---

## Deferred Decisions Not Authorized by 61.1

Do not solve, model, implement, or assume:

```text
Doctor <-> Patient Assignment Model
Lead <-> Patient Relationship Model
Retention Policy
Soft Delete Policy
Real-Time Updates
Global Search Scope
```

If any are required during 61.2, stop and request Architecture Review.

---

## 61.2 Status

```text
61.2 Assistant / Front Desk Workspace
STATUS: IMPLEMENTATION_AUTHORIZED
```

61.2 may proceed only after pre-code protocol:

1. Architecture compliance review.
2. Affected dependencies.
3. Risks.
4. Technical impact.
5. Implementation plan.
6. Confirmation that protected components will not be modified.
7. Explicit approval from the user.

---

## First Prompt for 61.2 Implementation Chat

```text
Read docs/ai-context/DENTALOPERIX_NEW_CHAT_HANDOFF_61_1.md.
Read docs/implementation/61.1/61.1_GOVERNANCE_CLOSURE_REPORT.md.
Read docs/implementation/61.1/61.1_CERTIFICATION_PACKAGE.md.
Read docs/ai-context/DENTALOPERIX_NEW_CHAT_HANDOFF_61_2.md.
Follow all referenced governance documents.

Current execution target:
61.2 Assistant / Front Desk Workspace
STATUS: IMPLEMENTATION_AUTHORIZED

Generate the architecture compliance review, affected dependencies, risks, technical impact, and implementation plan only.
Do not generate code until explicit approval is given.
Preserve Leads = Source of Truth.
Do not modify protected components.
Do not assume deferred models.
```

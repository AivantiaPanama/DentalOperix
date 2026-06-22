# DentalOperix New Chat Handoff - 61.2 Assistant / Front Desk Workspace

## START HERE

Use this file as the single entry point for any new ChatGPT or Cursor session continuing Iteration 61.2 after PR-61.2-02.

Read in this order:

1. `docs/ai-context/DENTALOPERIX_NEW_CHAT_HANDOFF_61_1.md`
2. `docs/implementation/61.1/61.1_GOVERNANCE_CLOSURE_REPORT.md`
3. `docs/implementation/61.1/61.1_CERTIFICATION_PACKAGE.md`
4. `docs/ai-context/DENTALOPERIX_NEW_CHAT_HANDOFF_61_2.md`
5. `docs/implementation/61.2/README.md`
6. `docs/implementation/61.2/61.2_STATUS_REPORT.md`
7. `docs/implementation/61.2/61.2_POST_PR02_REPOSITORY_AUDIT.md`
8. Relevant 61.2 implementation package documents before proposing code.

Do not read historical documents unless explicitly required by an architecture or governance question.

---

## Certified Foundation

```text
Program 57.x: CLOSED / CERTIFIED
Persistence Transition: CLOSED / CERTIFIED
Production Cutover: CERTIFIED

61.0 Documentation Governance Consolidation: COMPLETE

61.1 Users + Authentication + RBAC + Dashboard Routing:
CLOSED / CERTIFIED

61.2 Assistant / Front Desk Workspace:
IN PROGRESS

61.3 Patient Management:
NOT_STARTED
```

---

## Certified Baseline

```text
Baseline Tag: v61.1-certified

61.1 Status:
CLOSED / CERTIFIED

Certification Evidence:
- 107 test files passed
- 464 tests passed
- Production Build PASS
- SSR Build PASS

This baseline is the official starting point for all 61.2 work.

No certified 61.1 functionality may be redesigned,
replaced, re-opened, or re-architected without
formal Architecture Review.
```

---

## Current 61.2 Status

```text
PR-61.2-01 Assistant Workspace Shell:
COMPLETE / VALIDATED

PR-61.2-02 Today's Schedule:
COMPLETE / VALIDATED

Post PR-61.2-02 Repository Audit:
COMPLETE

PR-61.2-03 Lead Queue:
NOT_STARTED / NEXT
```

Validated local evidence reported in current work session:

```text
Targeted tests: PASS
- src/lib/dashboard-routing.test.ts
- src/routes/api/admin/login.test.ts
- src/routes/admin/login.test.tsx
- src/components/assistant/TodayScheduleWidget.test.tsx
```

Build evidence from update package:

```text
npm run build: PASS
Client build: PASS
SSR build: PASS
```

Full suite should be rerun locally/CI before formal 61.2 certification if required by governance.

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

## Important Post PR-61.2-02 Correction

The real Today's Schedule implementation consumes the existing appointment read surface:

```text
TodayScheduleWidget
 -> useAppointments()
 -> src/lib/appointments-store.ts
```

It does **not** consume `/api/leads/list`.

For PR-61.2-03 Lead Queue, use the certified Leads read surfaces as candidates:

```text
src/routes/api/leads/list.ts
src/routes/api/leads/operations.ts
```

Do not use or modify:

```text
src/routes/api/leads/create.ts
```

---

## Completed 61.2 Work

### PR-61.2-01 Assistant Workspace Shell

Implemented:

- Assistant role compatibility in authenticated session payload.
- Login API returns authenticated role.
- Login page uses role-based dashboard routing.
- `/assistant` remains protected by `RoleRouteGuard allowedRoles={["assistant"]}`.
- Assistant navigation no longer exposes Patient Management.
- Assistant dashboard reduced to a governed Front Desk Workspace shell.

### PR-61.2-02 Today's Schedule

Implemented:

- `TodayScheduleWidget` integrated into Assistant Dashboard.
- Read-only daily appointment list.
- Filters cancelled appointments.
- Orders appointments by start time.
- Displays patient name, appointment time, service, and provider label.
- Provides explicit empty state.

---

## Permanent Architecture Restrictions

The following remain prohibited during 61.2:

```text
Dual Write
Lead Replacement
New Source of Truth
Persistence Re-Architecture
Analytics Write Back
RBAC Bypass
```

61.2 must consume the certified architecture and may not alter:

```text
Leads
 -> LeadPersistencePort
 -> LeadPersistenceProvider
 -> RelationalLeadPersistenceAdapter
 -> Supabase PostgreSQL
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

## Deferred Decisions Not Authorized

Do not solve, model, implement, or assume:

```text
Doctor <-> Patient Assignment Model
Lead <-> Patient Relationship Model
Retention Policy
Soft Delete Policy
Real-Time Updates
Global Search Scope
```

If any are required during 61.2:

```text
STOP IMPLEMENTATION
REQUEST ARCHITECTURE REVIEW
```

---

## Out of Scope for 61.2

The following remain out of scope:

```text
Patient Management
Clinical Records
Doctor Assignment
Lead Assignment
Patient Conversion Flows
Retention Policies
Soft Delete Policies
Global Search
Real-Time Updates
```

If implementation requires any of these items:

```text
STOP IMPLEMENTATION
REQUEST ARCHITECTURE REVIEW
```

---

## Next Execution Target

```text
61.2 Assistant / Front Desk Workspace
Next PR: PR-61.2-03 Lead Queue
STATUS: NOT_STARTED
```

Recommended PR-61.2-03 scope:

```text
Read-only active Lead Queue inside AssistantDashboard.
```

Candidate files:

```text
src/components/assistant/LeadQueueWidget.tsx
src/components/assistant/LeadQueueWidget.test.tsx
src/components/assistant/AssistantDashboard.tsx
src/components/assistant/AssistantDashboard.test.tsx
```

Candidate read surfaces:

```text
src/routes/api/leads/list.ts
src/routes/api/leads/operations.ts
```

Forbidden for PR-61.2-03:

```text
src/routes/api/leads/create.ts
```

---

## Mandatory Pre-Code Protocol

Before generating code for PR-61.2-03 or any future 61.2 PR:

1. Architecture compliance review.
2. Affected dependencies.
3. Risks.
4. Technical impact.
5. Implementation plan.
6. Confirmation that certified architecture remains unchanged.
7. Confirmation that protected components will not be modified.
8. Explicit approval from the user.

No code may be generated before approval.

---

## First Prompt for New 61.2 Continuation Chat

```text
Read:

1. docs/ai-context/DENTALOPERIX_NEW_CHAT_HANDOFF_61_1.md
2. docs/implementation/61.1/61.1_GOVERNANCE_CLOSURE_REPORT.md
3. docs/implementation/61.1/61.1_CERTIFICATION_PACKAGE.md
4. docs/ai-context/DENTALOPERIX_NEW_CHAT_HANDOFF_61_2.md
5. docs/implementation/61.2/README.md
6. docs/implementation/61.2/61.2_STATUS_REPORT.md
7. docs/implementation/61.2/61.2_POST_PR02_REPOSITORY_AUDIT.md

Current program:

61.1 CLOSED / CERTIFIED
Baseline Tag: v61.1-certified

Current execution target:

61.2 Assistant / Front Desk Workspace
PR-61.2-01 COMPLETE / VALIDATED
PR-61.2-02 COMPLETE / VALIDATED
Post PR-61.2-02 Repository Audit COMPLETE
PR-61.2-03 Lead Queue NOT_STARTED / NEXT

Important correction:

Today's Schedule consumes useAppointments() / src/lib/appointments-store.ts.
It does not consume /api/leads/list.

For PR-61.2-03, inspect the current repository and plan a read-only Lead Queue using existing certified Leads read surfaces, likely:

- src/routes/api/leads/list.ts
- src/routes/api/leads/operations.ts

Before any code generation:

1. Architecture compliance review
2. Affected dependencies
3. Risks
4. Technical impact
5. Implementation plan
6. Confirmation that certified architecture remains unchanged
7. Confirmation that protected components will not be modified
8. Wait for explicit approval

Preserve:

Leads = Source of Truth

Do not introduce:

- Dual Write
- Lead Replacement
- New Source of Truth
- Persistence Re-Architecture
- Patient Management
- Clinical Records
- Doctor Assignment
- Lead Assignment
- Patient Conversion Flows
- Retention Policies
- Soft Delete Policies
- Global Search
- Real-Time Updates

Do not modify protected components:

- BookingDialog
- processDentalLead
- /api/leads/create
- Calendar
- Gmail
- FloatingDentalAIChat
- Home
- siteServices.ts
```

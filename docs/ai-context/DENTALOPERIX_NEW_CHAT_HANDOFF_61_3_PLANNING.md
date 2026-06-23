# DentalOperix New Chat Handoff — 61.3 Planning

**Status:** PLANNING / DO NOT IMPLEMENT WITHOUT ARCHITECTURE REVIEW  
**Date:** 2026-06-23  
**Context:** Post PR-61.2-05, clinic operational minimum identified as product priority.

---

## Required Reading

Before proposing post-61.2 work, read:

1. `docs/implementation/61.3/61.3_CLINIC_OPERATIONS_FOUNDATION_PLAN.md`
2. Current 61.2 handoff and status documents
3. Current 61.1 RBAC certification documents if user administration is being discussed

---

## Active Planning Decision

After 61.2 closure, DentalOperix should prioritize a minimum clinic operating foundation before advanced workflow expansion.

Recommended program:

```text
61.3 Clinic Operations Foundation
```

Recommended PR sequence:

```text
PR-61.3-01 User Administration Foundation
PR-61.3-02 Patient Administration Foundation
PR-61.3-03 Patient Directory
PR-61.3-04 Operational QA + Certification
```

---

## Reason

The clinic needs a minimum operational flow to continue operating while the product evolves:

- Administrator creates staff users.
- Administrator assigns roles/status.
- Front desk/admin registers walk-in patients.
- Authorized staff can search and view basic patient administrative records.

---

## Governance Boundary

This plan does not reopen 57.x and does not change certified Leads architecture.

Certified architecture remains:

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

---

## Do Not Implement Without Review

Before implementation, deliver:

1. Architecture Review
2. Affected dependencies
3. Risks
4. Technical impact
5. Architectural options
6. Technical recommendation
7. File-by-file implementation plan
8. Test strategy
9. Documentation strategy

Then wait for explicit approval.

---

## Protected Components

Do not modify without explicit authorization:

- BookingDialog
- processDentalLead
- /api/leads/create
- Calendar
- Gmail
- FloatingDentalAIChat
- Home
- siteServices.ts

---

## Prohibited Changes

Do not introduce:

- Dual Write
- Lead Replacement
- New Source of Truth for Leads
- Persistence Re-Architecture
- Analytics Write Back
- RBAC Bypass

---

## Deferred Decisions Still Blocked

Do not model or implement without Architecture Review:

- Doctor ↔ Patient Assignment
- Lead ↔ Patient Relationship
- Retention Policy
- Soft Delete Policy
- Real-Time Updates
- Global Search Scope

---

## Current Instruction

Use 61.3 Clinic Operations Foundation as the documented next priority after 61.2 closure.

# DentalOperix

# ARCHITECTURE-QUESTION-BRIEF-61.1-BLOCK-001_ROLE_ASSIGNMENT_WORKFLOW

Version: 1.0

Status: PENDING ARCHITECTURE DECISION

Related Iteration: 61.1 Users & RBAC Foundation

Related Blocking Item: BLOCK-61.1-001

---

# 1. Executive Summary

During the Architecture Certification Review for Iteration 61.1, one blocking item was identified:

```text
BLOCK-61.1-001
Role Assignment Workflow
```

The authorization rule is fully defined:

```text
user.role.assign = Administrator only
```

However, the workflow surrounding role assignment is not defined.

Current governance documentation consistently defines WHO may assign roles, but does not define HOW users are created, discovered, invited, onboarded, or assigned their initial role.

As a result, Cursor cannot safely implement user onboarding or role assignment without introducing architectural assumptions.

This document exists to support Architecture Review and obtain a formal decision.

---

# 2. Architectural Context

Certified constraints:

```text
Leads = Source of Truth
Users = Identity only
RBAC = Authorization only
```

Certified architecture:

```text
Leads
-> LeadPersistencePort
-> LeadPersistenceProvider
-> RelationalLeadPersistenceAdapter
-> Supabase PostgreSQL
```

The decision reached through this document must not:

- Introduce Dual Write.
- Introduce Lead Replacement.
- Introduce Product Migration.
- Introduce a New Source of Truth.
- Modify the certified persistence architecture.
- Reopen Program 57.x.
- Modify BookingDialog, processDentalLead, /api/leads/create, Calendar, Gmail, FloatingDentalAIChat, Home, or siteServices.ts.

---

# 3. Current State

Defined:

- Administrator can assign roles.
- Role permissions are approved.
- Dashboard routing is approved.
- User lifecycle actions exist.
- Physical deletion is prohibited.

Undefined:

- User creation workflow.
- Initial role assignment workflow.
- Registration process.
- Invitation process.
- Onboarding process.

---

# 4. Decision Question

Architecture Review must answer:

```text
How does a user account come into existence and receive its first role in DentalOperix 61.1?
```

---

# 5. Candidate Options

## Option A — Administrator-Created Users

Flow:

```text
Administrator
-> Creates User
-> Assigns Role
-> User Receives Access
```

Characteristics:

- Simplest implementation.
- Lowest architectural risk.
- No self-registration.
- No invitation workflow.
- Minimal scope for Starter.

Advantages:

- Fastest implementation.
- Lowest governance risk.
- Simplifies RBAC enforcement.
- Does not require Gmail or notification changes.
- Does not touch the certified Leads pipeline.

Disadvantages:

- Manual administration.
- Less scalable long term.

---

## Option B — Self-Registration + Admin Approval

Flow:

```text
User Registers
-> Pending State
-> Administrator Assigns Role
-> User Gains Access
```

Advantages:

- Better user autonomy.

Disadvantages:

- Additional lifecycle states.
- Additional workflow complexity.
- Additional security review required.
- Higher risk of implementing unreviewed access states.

---

## Option C — Invitation-Based Onboarding

Flow:

```text
Administrator Invites User
-> User Accepts Invitation
-> Administrator Confirms Role
-> User Gains Access
```

Advantages:

- Better enterprise experience.

Disadvantages:

- Requires invitation infrastructure.
- Requires email workflow.
- Larger implementation scope.
- Potential impact on Gmail/notification governance.

---

# 6. Architectural Evaluation

| Criterion | Option A | Option B | Option C |
|---|---|---|---|
| Complexity | Low | Medium | High |
| Governance Risk | Low | Medium | Medium |
| Starter Readiness | High | Medium | Low |
| Implementation Speed | High | Medium | Low |
| Architecture Impact | Low | Medium | Medium |
| Dependency on Gmail/Notifications | None | Possible | Likely |
| Risk of Reopening 57.x | None | None | None |

---

# 7. Recommendation

Architecture Recommendation:

```text
OPTION A
Administrator-Created Users
```

Rationale:

- Smallest possible implementation.
- Fully compatible with Users = Identity only.
- Fully compatible with RBAC = Authorization only.
- Does not affect Leads.
- Does not introduce additional architecture.
- Does not require invitation infrastructure.
- Does not require Gmail changes.
- Enables rapid completion of Iteration 61.1.
- Sufficient for DentalOperix Starter.

---

# 8. Requested Architecture Decision

Architecture Review must formally select one of:

```text
APPROVED: OPTION A
APPROVED: OPTION B
APPROVED: OPTION C
REQUIRES FURTHER ANALYSIS
```

---

# 9. Expected Outcome

If approved:

```text
BLOCK-61.1-001 = RESOLVED
```

and:

```text
ARCHITECTURE-CERTIFICATION-REVIEW-61.1-V1.1
```

may be updated from:

```text
CONDITIONALLY READY
```

to:

```text
READY FOR IMPLEMENTATION
```

subject to all existing governance constraints.

---

# 10. Cursor Guardrail Until Decision

Until this brief is formally decided:

- Cursor may implement permission checks for user.role.assign.
- Cursor must not implement registration.
- Cursor must not implement invitation flows.
- Cursor must not implement onboarding screens.
- Cursor must not infer how a user receives the first role.
- Cursor must stop and escalate if implementation requires a workflow decision.

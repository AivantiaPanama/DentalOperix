# DentalOperix

# ARCHITECTURE-CERTIFICATION-REVIEW-61.1-V1.0

Iteration: 61.1 Users & RBAC Foundation

Status: CONDITIONALLY READY — ONE BLOCKING ITEM

---

# 1. Certification Decision

```text
CONDITIONALLY READY FOR IMPLEMENTATION
NEEDS CLARIFICATION ON ONE ITEM BEFORE FULL CURSOR IMPLEMENTATION
```

Three evaluated areas are ready:

- User Lifecycle States.
- Dashboard Routing Rules.
- User <-> Lead Boundaries.

One evaluated area is not ready as a workflow:

```text
BLOCK-61.1-001
Role Assignment Workflow is undefined as a process, despite the permission being defined.
```

The permission is defined:

```text
user.role.assign = Administrator only
```

The workflow is not yet defined.

---

# 2. Blocking Item

## BLOCK-61.1-001 — Role Assignment Workflow

What is defined:

- Only Administrator can assign roles.
- user.role.assign is Allow for Administrator only.
- All other roles are denied.

What is not defined:

- How a user account comes to exist.
- How an Administrator discovers a user requiring a role.
- Whether self-registration exists.
- Whether invitation flow exists.
- What state a user has before role assignment.

Why this blocks full implementation:

Cursor cannot implement user creation, onboarding, registration, invitation, or role assignment screens without inventing a workflow that has not been reviewed by Architecture.

Resolution path:

```text
docs/architecture/ARCHITECTURE-QUESTION-BRIEF-61.1-BLOCK-001_ROLE_ASSIGNMENT_WORKFLOW.md
```

---

# 3. Ready Areas

## User Lifecycle States

Status: READY

Defined:

- user.create
- user.read
- user.update
- user.deactivate
- user.reactivate
- user.delete.physical = Deny for all roles

## Dashboard Routing Rules

Status: READY

Defined routing:

```text
Patient -> Patient Portal
Assistant -> Front Desk Workspace
Doctor -> Clinical Workspace
Administrator -> Operations Console
```

## User <-> Lead Boundaries

Status: READY

Boundary:

```text
Users = Identity only
Leads = Source of Truth
RBAC = Authorization only
```

Lead creation remains exclusively:

```text
BookingDialog -> processDentalLead -> /api/leads/create
```

---

# 4. Cursor Guardrails

Cursor may implement:

- User lifecycle states.
- Dashboard routing rules.
- User <-> Lead boundaries.
- Permission checks for user.role.assign.

Cursor must not implement until BLOCK-61.1-001 is resolved:

- Registration workflow.
- Invitation workflow.
- Onboarding workflow.
- First-role assignment workflow.
- User discovery workflow for Admin.

Cursor must stop and escalate if implementation requires a decision about how a user account first receives a role.

---

# 5. Final Statement

61.1 is conditionally ready.

Full implementation readiness requires resolving BLOCK-61.1-001.

After Architecture Review decides the Role Assignment Workflow, issue:

```text
ARCHITECTURE-CERTIFICATION-REVIEW-61.1-V1.1
STATUS: READY FOR IMPLEMENTATION
```

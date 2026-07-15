# IMPLEMENTATION BLUEPRINT 61.1

## DentalOperix - Users + RBAC + Dashboard Routing

```text
Artifact: IMPLEMENTATION_BLUEPRINT_61.1_USERS_RBAC
Iteration: 61.1 Users & RBAC Foundation
Status: READY_FOR_IMPLEMENTATION_BLUEPRINT
Code Generation: NOT AUTHORIZED
Date: 2026-06-22
Authority: Architect Principal / Technical Reviewer / Product Governance Guardian
```

---

## 0. Certification Basis

This blueprint is derived from the certified 61.1 implementation readiness state and must remain compatible with the DentalOperix certified persistence architecture.

Authoritative evidence:

- `docs/iterations/ITERATION_61.1_USERS_RBAC.md`
- `docs/architecture/ARCHITECTURE-CERTIFICATION-REVIEW-61.1-V1.1.md`
- `docs/architecture/ARCHITECTURE-QUESTION-BRIEF-61.1-BLOCK-001_ROLE_ASSIGNMENT_WORKFLOW.md`
- `docs/architecture/BLOCK-61.1-001-RESOLUTION-NOTE.md`
- `docs/ai-outputs/CLAUDE/RBAC-MATRIX-V1.1.md`
- `docs/ai-outputs/REVIEWS/RBAC-ARCHITECTURE-REVIEW-V1.1.md`
- `docs/product-governance/61.0_CURRENT_PROJECT_STATUS.md`
- `docs/product-governance/61.0_MODULE_DEPENDENCY_MAP.md`
- `docs/product-governance/61.0_RELEASE_READINESS_CHECKLIST.md`

---

## 1. Purpose

Define the controlled implementation blueprint for iteration 61.1:

```text
Users Foundation
-> RBAC Enforcement
-> Dashboard Routing
```

This blueprint is intended for implementation planning and Cursor task preparation. It is not a code artifact and does not authorize code generation.

---

## 2. Certified Architecture Constraints

The following architecture remains unchanged:

```text
Leads
-> LeadPersistencePort
-> LeadPersistenceProvider
-> RelationalLeadPersistenceAdapter
-> Supabase PostgreSQL
```

Permanent product rule:

```text
Leads = Source of Truth
```

61.1 adds an identity and authorization layer only:

```text
Users = Identity
RBAC = Authorization
Dashboard Routing = Role-based navigation
```

61.1 must not create a new source of truth for Leads, Patients, Appointments, Analytics, or Clinical Intelligence.

---

## 3. Implementation Scope

### In Scope

```text
User identity foundation
Role model
Permission model
User lifecycle management
Administrator-created users
Administrator-only role assignment
Frontend RBAC guards
Backend RBAC guards
Role-based dashboard routing
Admin user management shell
Base dashboard shells for routing validation
```

### Out of Scope

```text
Patient Records
Lead-to-Patient conversion
Doctor-to-Patient assignment
Clinical Records
Treatment Plans
Analytics Write Back
Invitation-based onboarding
Self-registration
Role delegation
Dual approval workflow
Physical delete of Leads
Physical delete of Users
Physical delete of Appointments
Persistence re-architecture
```

---

## 4. Protected Components

The following components must not be modified without explicit approval:

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

Lead creation must remain exclusively tied to:

```text
BookingDialog -> processDentalLead -> /api/leads/create
```

No RBAC work may bypass or rewrite this flow.

---

## 5. Target Domain Model

### 5.1 User

Purpose:

```text
Authenticated application identity
```

Required conceptual fields:

```text
id
email
full_name
status
created_at
updated_at
created_by
updated_by
```

Allowed lifecycle states:

```text
active
inactive
```

Rules:

- Users are not Leads.
- Users are not Patients.
- Users must not replace Lead ownership.
- Users may be linked to future Patient / Doctor models only after future architecture review.

### 5.2 Role

Official roles:

```text
patient
assistant
doctor
administrator
```

Rules:

- No role hierarchy in 61.1.
- No custom roles in 61.1.
- No delegated role assignment in 61.1.
- Role assignment is Administrator-only.

### 5.3 Permission

Permissions are action-level authorization keys.

Initial permission catalog must align with `RBAC-MATRIX-V1.1`.

Minimum permission groups:

```text
lead.*
appointment.*
user.*
dashboard.*
analytics.*
notification.*
```

Patient Records permissions remain placeholders only and must not be activated in 61.1.

---

## 6. Recommended Persistence Blueprint

### 6.1 Tables to Add

```text
app_users
app_roles
app_permissions
app_user_roles
app_role_permissions
```

Naming may be adjusted to project conventions, but the domain separation must remain explicit.

### 6.2 Table Responsibilities

#### app_users

Stores DentalOperix application users.

Must not store Lead canonical data.

#### app_roles

Stores the four certified roles.

Seed values:

```text
patient
assistant
doctor
administrator
```

#### app_permissions

Stores stable permission keys from the certified matrix.

#### app_user_roles

Stores user-role assignment.

61.1 recommended rule:

```text
one active role per user
```

If the implementation supports many-to-many technically, the application must still enforce a single active role unless a future architecture review authorizes multi-role users.

#### app_role_permissions

Maps roles to permissions.

This table is the operational representation of `RBAC-MATRIX-V1.1`.

### 6.3 Mandatory Database Rules

```text
No physical user deletion
No physical lead deletion
No physical appointment deletion
Role assignment requires Administrator authorization
Inactive users cannot access protected dashboards
```

### 6.4 RLS / Policy Direction

If Supabase Row Level Security is used, policies must enforce:

```text
Authenticated users can read own profile
Administrator can manage users
Administrator can assign roles
Non-admin users cannot assign roles
Inactive users cannot access protected app areas
```

Do not create policies that grant direct write access to Leads outside the certified application flow.

---

## 7. Permission Catalog Blueprint

### 7.1 Leads

```text
lead.create              DENY all roles through RBAC
lead.read
lead.status.update
lead.notes.update
lead.owner.reassign
lead.delete.physical     DENY all roles
```

Rules:

- `lead.create` remains exclusively through Booking flow.
- `lead.delete.physical` is prohibited for all roles.
- Assistant may update operational lead status and notes.
- Administrator may reassign owner.
- Doctor lead access is conditional and must not be fully implemented until assignment model is resolved.

### 7.2 Appointments

```text
appointment.create
appointment.read
appointment.update
appointment.cancel
appointment.delete.physical DENY all roles
```

Rules:

- Cancellation is terminal operation.
- Physical deletion is prohibited.

### 7.3 Users

```text
user.create
user.read
user.update
user.role.assign
user.deactivate
user.reactivate
user.delete.physical DENY all roles
```

Rules:

- Administrator only can create users.
- Administrator only can assign roles.
- Physical user deletion is prohibited.

### 7.4 Dashboard

```text
dashboard.patient.access
dashboard.assistant.access
dashboard.doctor.access
dashboard.admin.access
```

### 7.5 Analytics / Reporting

```text
analytics.read.own
analytics.read.global
```

Rules:

- No Analytics Write Back.

### 7.6 Notifications / Email / ICS

```text
notification.read.own
notification.send
notification.resend
notification.read.all
```

Rules:

- Do not modify Gmail, Calendar, or ICS implementations during 61.1 without explicit approval.

---

## 8. Dashboard Routing Blueprint

| Role          | Target               | Implementation Level in 61.1  |
| ------------- | -------------------- | ----------------------------- |
| patient       | Patient Portal       | Shell / protected route only  |
| assistant     | Front Desk Workspace | Shell / route target for 61.2 |
| doctor        | Clinical Workspace   | Shell / protected route only  |
| administrator | Operations Console   | User management enabled       |

Routing rule:

```text
Authenticated user
-> resolve active role
-> resolve dashboard target
-> redirect to authorized dashboard
```

Fallback rule:

```text
No active user -> login
No active role -> access denied / admin remediation
Inactive user -> access denied
Unknown role -> access denied
```

---

## 9. Frontend Blueprint

### 9.1 Allowed New UI Areas

```text
/auth/login
/auth/logout or logout action
/admin/users
/admin/users/new
/admin/users/:id
/dashboard/patient
/dashboard/assistant
/dashboard/doctor
/dashboard/admin
/access-denied
```

Route names may follow current router conventions.

### 9.2 Required Frontend Building Blocks

```text
AuthProvider
useAuth
useCurrentUser
usePermissions
RequireAuth
RequirePermission
RequireRole
DashboardRouter
UserManagementPage
UserCreateForm
UserEditForm
RoleAssignmentControl
AccessDeniedPage
```

### 9.3 Frontend Guard Rules

Frontend guards must:

```text
Block unauthenticated access
Block inactive users
Block missing roles
Block unauthorized route access
Hide unauthorized actions
Never be the only enforcement layer
```

---

## 10. Backend Blueprint

### 10.1 Allowed Backend Capabilities

```text
Current user resolution
Permission resolution
User listing for Administrator
User creation by Administrator
User update by Administrator
User deactivate / reactivate by Administrator
Role assignment by Administrator
Protected route / API middleware
```

### 10.2 Required Backend Guards

Every protected API mutation must validate:

```text
authenticated session
active user
required role or permission
operation-specific constraints
```

### 10.3 Backend Must Reject

```text
Self role assignment
Non-admin role assignment
Physical user deletion
Physical lead deletion
Physical appointment deletion
Lead creation through RBAC APIs
Direct write to certified Lead persistence components
```

---

## 11. Recommended File / Module Layout

This is a blueprint, not a mandate. Cursor must adapt to the existing project structure.

```text
src/
  auth/
    AuthProvider.tsx
    useAuth.ts
    authService.ts
    authTypes.ts

  rbac/
    permissions.ts
    roles.ts
    rbacMatrix.ts
    requirePermission.ts
    requireRole.ts
    usePermissions.ts

  users/
    userTypes.ts
    userService.ts
    userRepository.ts
    UserManagementPage.tsx
    UserCreateForm.tsx
    UserEditForm.tsx
    RoleAssignmentControl.tsx

  routing/
    DashboardRouter.tsx
    dashboardRoutes.ts
    ProtectedRoute.tsx

  pages-or-routes/
    auth/
    dashboard/
    admin/users/
```

Supabase / SQL:

```text
supabase/migrations/61_1_users_rbac_foundation.sql
supabase/seed/61_1_roles_permissions_seed.sql
```

Tests:

```text
tests/auth/
tests/rbac/
tests/users/
tests/dashboard-routing/
```

---

## 12. Implementation Sequence

### Phase 1 - Schema and Seeds

Deliver:

```text
app_users
app_roles
app_permissions
app_user_roles
app_role_permissions
seed roles
seed permissions
seed role-permission mappings
```

Validation:

```text
All four roles exist
Permission catalog exists
Role mapping matches RBAC-MATRIX-V1.1
No Lead schema changes
```

### Phase 2 - Auth Session Integration

Deliver:

```text
Current session detection
Current app user resolution
Inactive-user blocking
```

Validation:

```text
Unauthenticated users redirected
Inactive users denied
Active users resolved
```

### Phase 3 - Backend Authorization Layer

Deliver:

```text
requireAuth
requireActiveUser
requirePermission
requireRole
```

Validation:

```text
Protected APIs reject missing session
Protected APIs reject unauthorized role
Protected APIs reject inactive user
```

### Phase 4 - User Administration

Deliver:

```text
Administrator user listing
Administrator user creation
Administrator role assignment
Administrator deactivate/reactivate
```

Validation:

```text
Admin can manage users
Assistant cannot manage users
Doctor cannot manage users
Patient cannot manage users
No physical delete exists
```

### Phase 5 - Dashboard Routing

Deliver:

```text
Role-based routing
Dashboard shells
Access denied handling
```

Validation:

```text
Patient -> Patient Portal
Assistant -> Front Desk Workspace
Doctor -> Clinical Workspace
Administrator -> Operations Console
Unknown role -> Access Denied
```

### Phase 6 - Regression Validation

Deliver:

```text
Booking unaffected
Lead creation unaffected
Calendar unaffected
Gmail unaffected
ICS unaffected
No protected component modified without approval
```

---

## 13. Test Matrix

### 13.1 Authentication Tests

```text
login success
login failure
logout
session refresh
missing session blocked
inactive user blocked
```

### 13.2 User Lifecycle Tests

```text
admin creates user
admin updates user
admin assigns role
admin deactivates user
admin reactivates user
non-admin cannot create user
non-admin cannot assign role
physical user delete unavailable
```

### 13.3 RBAC Tests

```text
Patient cannot access Admin dashboard
Assistant cannot access Admin dashboard
Doctor cannot access Admin dashboard
Administrator can access Admin dashboard
Assistant can access Front Desk Workspace route
Doctor can access Clinical Workspace shell
Patient can access Patient Portal shell
```

### 13.4 Backend Authorization Tests

```text
protected API rejects unauthenticated request
protected API rejects inactive user
protected API rejects missing permission
protected API allows Administrator user management
protected API rejects non-admin role assignment
```

### 13.5 Regression Tests

```text
Booking flow still creates Leads
/api/leads/create behavior unchanged
processDentalLead behavior unchanged
Calendar behavior unchanged
Gmail behavior unchanged
ICS behavior unchanged
```

---

## 14. Acceptance Criteria

61.1 implementation may be considered complete only if:

```text
AC-61.1-001 Users domain is implemented without replacing Leads
AC-61.1-002 Administrator can create users
AC-61.1-003 Administrator can assign roles
AC-61.1-004 Administrator can deactivate/reactivate users
AC-61.1-005 Non-admin roles cannot assign roles
AC-61.1-006 RBAC is enforced in frontend
AC-61.1-007 RBAC is enforced in backend
AC-61.1-008 Each role routes to correct dashboard target
AC-61.1-009 Inactive users cannot access protected areas
AC-61.1-010 No physical user deletion is available
AC-61.1-011 No physical lead deletion is introduced
AC-61.1-012 Lead creation flow remains unchanged
AC-61.1-013 Protected components remain untouched unless explicitly approved
AC-61.1-014 Tests cover role checks and protected route behavior
AC-61.1-015 Documentation references RBAC-MATRIX-V1.1
```

---

## 15. Cursor Implementation Guardrails

Cursor may implement only after explicit code authorization.

When authorized, Cursor must follow these guardrails:

```text
Do not modify BookingDialog
Do not modify processDentalLead
Do not modify /api/leads/create
Do not modify Calendar
Do not modify Gmail
Do not modify FloatingDentalAIChat
Do not modify Home
Do not modify siteServices.ts
Do not introduce Dual Write
Do not introduce Lead Replacement
Do not introduce Product Migration
Do not introduce new Source of Truth
Do not implement Patient Management
Do not resolve Doctor <-> Patient assignment
Do not resolve Lead <-> Patient relationship
Do not implement Analytics Write Back
```

Cursor must stop and request architecture review if implementation requires touching any protected component.

---

## 16. Recommended Commit Plan

```text
commit 1: add 61.1 users/rbac schema and seeds
commit 2: add auth session and current user resolution
commit 3: add RBAC permission resolution and guards
commit 4: add admin user management workflow
commit 5: add dashboard routing and dashboard shells
commit 6: add tests for auth, RBAC, routing, and regression
commit 7: update documentation and certification checklist
```

Each commit must be independently reviewable.

---

## 17. Pull Request Checklist

Before PR approval:

```text
Architecture constraints verified
Protected components unchanged or explicitly approved
RBAC-MATRIX-V1.1 referenced
User lifecycle tests passing
Role assignment tests passing
Dashboard routing tests passing
Backend authorization tests passing
Booking regression validated
Calendar/Gmail/ICS regression validated
No physical delete introduced
No direct Lead persistence bypass introduced
Documentation updated
```

---

## 18. Post-Implementation Certification

After implementation, produce:

```text
IMPLEMENTATION_VALIDATION_REPORT_61.1
RBAC_ENFORCEMENT_VALIDATION_61.1
DASHBOARD_ROUTING_VALIDATION_61.1
REGRESSION_VALIDATION_61.1
ARCHITECTURE_CERTIFICATION_REVIEW_61.1_IMPLEMENTED
```

Expected post-certification state:

```text
61.1 Users & RBAC Foundation
STATUS: IMPLEMENTED_AND_VALIDATED

61.2 Assistant Dashboard
STATUS: UNBLOCKED_FOR_IMPLEMENTATION
```

---

## 19. Formal Blueprint Decision

```text
IMPLEMENTATION BLUEPRINT 61.1
STATUS: APPROVED AS IMPLEMENTATION BLUEPRINT
CODE GENERATION: NOT AUTHORIZED
NEXT STEP: Create Cursor Implementation Task 61.1 after explicit approval
```

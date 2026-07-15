# PR-3 RBAC Enforcement - Change Log

Execution target: PR-3 RBAC Enforcement

Implemented tasks:

- 61.1-RBAC-001 Role Model
- 61.1-RBAC-002 Authorization Middleware
- 61.1-RBAC-003 Frontend Route Protection

Governance preserved:

- Leads = Source of Truth
- Users = Identity only
- RBAC = Authorization only
- user.role.assign = Administrator only

Protected components intentionally unchanged:

- src/components/site/BookingDialog.tsx
- src/routes/api/leads/create.ts
- src/components/site/FloatingDentalAIChat.tsx
- src/data/siteServices.ts

Primary changes:

- Canonical RBAC role is now `administrator` instead of `admin`.
- RBAC roles now reuse USER_ROLES from src/server/users/user-domain.ts.
- Administrator bypass is centralized through isAdministrator().
- Role assignment authority is explicit through user.role.assign.
- Frontend and server route protection now use allowedRoles=["administrator"] for /admin.
- Added PR-3 RBAC tests in src/lib/rbac/rbac-pr3.test.ts.

Validation note:

- Tests could not be executed in this sandbox because node_modules is not present and vitest is unavailable.
- Run the commands listed in the assistant response inside Cursor or local repo after installing dependencies.

# PR-4 Dashboard Routing Changelog

## Scope

Iteration: 61.1 Users + RBAC + Dashboard Routing  
PR: PR-4 Dashboard Routing  
Status: PASS / CERTIFIED  
Date: 2026-06-22

## Governance Boundaries Preserved

- Leads = Source of Truth preserved.
- Certified persistence architecture unchanged.
- Dashboard Routing implemented as role-based navigation only.
- RBAC remains authorization only.
- Users remain identity only.
- No Patient Management introduced.
- No 61.2 Assistant Dashboard implementation introduced.
- No Lead-to-Patient conversion introduced.
- No Doctor-to-Patient assignment introduced.

## Files Added

- `src/lib/dashboard-routing.ts`
- `src/lib/dashboard-routing.test.ts`
- `PR4_DASHBOARD_ROUTING_CHANGELOG.md`

## Files Modified

- `src/routes/dashboard.tsx`
- `docs/implementation/61.1/61.1_IMPLEMENTATION_STATUS.md`

## Implementation Summary

- Added centralized Dashboard Resolver for official roles:
  - `patient -> /patient`
  - `assistant -> /assistant`
  - `doctor -> /doctor`
  - `administrator -> /admin`
- Replaced legacy `/dashboard` rendering with a protected resolver route.
- Undefined, null, empty, or invalid roles now result in `ACCESS BLOCKED`.
- Existing role-specific routes remain protected by `RoleRouteGuard`.

## Validation Status

Automated validation command required and confirmed passed in local/Cursor environment:

```text
npm test -- --run src/lib/dashboard-routing.test.ts src/lib/rbac/rbac-pr3.test.ts
```

Result:

```text
PASS
PR-4 dashboard routing tests passed.
RBAC regression tests passed.
Production build passed.
```

## Protected Component Confirmation

No changes were made to protected components:

- BookingDialog
- processDentalLead
- /api/leads/create
- Calendar
- Gmail
- FloatingDentalAIChat
- Home
- siteServices.ts

## Certification Evidence

```text
npm install
npm test -- --run src/lib/dashboard-routing.test.ts src/lib/rbac/rbac-pr3.test.ts
npm run build
```

PR-4 is certified. Next execution target is PR-5 Validation & Hardening.

# TD-06 Test Infrastructure Cleanup Report

Date: 2026-06-22
Status: IMPLEMENTED / VALIDATED

## Scope

TD-06 applies minimal TypeScript-only cleanup to test infrastructure files that were blocking repository-wide `tsc --noEmit` validation.

## Files Updated

- `src/lib/analytics.test.ts`
- `src/lib/goal-config.test.ts`
- `src/lib/api/revenue-dashboard-metrics.test.ts`
- `src/tests/dashboard.integration.test.tsx`
- `src/server/users/relational-user-repository.test.ts`

## Changes

- Replaced test-only `window` mutation `@ts-expect-error` usage with `Object.defineProperty`.
- Removed invalid `window` global redeclaration in goal config tests.
- Imported `MockedFunction` from Vitest instead of using the `vi` namespace as a type namespace.
- Aligned relational user repository test client mock with the generic `PgQueryResult<T>` contract.

## Validation

### TypeScript

Repository-wide TypeScript validation improved from:

- Before TD-06: 21 errors / 13 files
- After TD-06: 14 errors / 8 files

Remaining errors are outside TD-06 scope:

- Today Schedule typing / ES lib compatibility
- Protected frontend components (`BookingDialog`, `FloatingDentalAIChat`)
- Patient follow-up test fixture typing
- Goals API test request argument typing
- Server Google login handler argument typing

### Targeted Tests

Command:

```bash
npx vitest run src/lib/analytics.test.ts src/lib/goal-config.test.ts src/lib/api/revenue-dashboard-metrics.test.ts src/tests/dashboard.integration.test.tsx src/server/users/relational-user-repository.test.ts
```

Result:

- Test Files: 5 passed
- Tests: 22 passed

### Build

Command:

```bash
npm run build
```

Result:

- Client build: PASS
- SSR build: PASS

## Architecture Review

TD-06 does not modify runtime behavior, domain logic, persistence, Supabase schema, lead creation, or protected components.

## Governance Confirmation

- Leads = Source of Truth remains intact.
- Certified architecture remains unchanged.
- No persistence changes.
- No Supabase changes.
- No Dual Write.
- No Lead Replacement.
- No new Source of Truth.
- No protected components modified.

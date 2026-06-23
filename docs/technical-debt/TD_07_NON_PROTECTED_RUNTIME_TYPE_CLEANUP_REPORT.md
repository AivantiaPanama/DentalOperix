# TD-07 Non-Protected Runtime Type Cleanup Report

Date: 2026-06-22
Status: COMPLETE / VALIDATED

## Scope

TD-07 addressed TypeScript errors in non-protected runtime and test files only.

Files updated:

- `src/components/assistant/TodayScheduleWidget.tsx`
- `src/components/assistant/TodayScheduleWidget.test.tsx`
- `src/lib/patient-followup-engine.test.ts`
- `src/routes/api/goals.test.ts`
- `src/server.ts`

## Architecture Review

PASS.

TD-07 does not alter the certified Leads persistence architecture:

```text
Leads
-> LeadPersistencePort
-> LeadPersistenceProvider
-> RelationalLeadPersistenceAdapter
-> Supabase PostgreSQL
```

## Governance Confirmation

- Leads = Source of Truth remains intact.
- No persistence behavior changed.
- No Supabase schema changed.
- No Dual Write introduced.
- No Lead Replacement introduced.
- No new Source of Truth introduced.
- No Analytics Write Back introduced.
- No RBAC Bypass introduced.

## Protected Components

No protected component was modified:

- `BookingDialog`
- `processDentalLead`
- `/api/leads/create`
- `Calendar`
- `Gmail`
- `FloatingDentalAIChat`
- `Home`
- `siteServices.ts`

## Technical Changes

### TodayScheduleWidget

- Replaced `Array.prototype.toSorted()` with `slice().sort()` for current TypeScript target compatibility.
- Added explicit `Appointment` typing to callbacks to avoid implicit `any`.

### patient-followup-engine.test.ts

- Completed `FollowupRecord` fixtures with required fields instead of relying on unsafe partial casts.

### goals.test.ts

- Passed an explicit `Request` to the `GET` handler to match the route handler signature.

### server.ts

- Updated `/api/google/login` dispatch to call `googleLoginHandler.GET()` without an unsupported request argument.

## Validation Evidence

### TypeScript

Before TD-07:

```text
21 errors / 13 files
```

After TD-07:

```text
4 errors / 2 files
```

Remaining errors are in protected components only:

- `src/components/site/BookingDialog.tsx`
- `src/components/site/FloatingDentalAIChat.tsx`
- `src/components/site/FloatingDentalAIChat.test.ts`

### Targeted Tests

Command:

```bash
npx vitest run src/components/assistant/TodayScheduleWidget.test.tsx src/lib/patient-followup-engine.test.ts src/routes/api/goals.test.ts
```

Result:

```text
Test Files 3 passed
Tests 18 passed
```

### Build

Command:

```bash
npm run build
```

Result:

```text
PASS
```

## Remaining Backlog

The only TypeScript errors remaining after TD-07 are associated with protected frontend components. They require a separate Architecture Review and explicit approval before modification.

Recommended next step:

- TD-08 Protected Frontend Type Cleanup

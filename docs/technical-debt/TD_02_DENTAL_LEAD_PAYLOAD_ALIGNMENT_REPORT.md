# TD-02 DentalLeadPayload Alignment Report

Date: 2026-06-22
Status: IMPLEMENTED / TARGET VALIDATED
Scope: Minimal TypeScript type alignment near DentalLeadPayload and /api/leads/create tests.

## Architecture Review

Result: PASS

The change aligns TypeScript contracts with the existing runtime behavior of `processDentalLead` without changing the certified Leads architecture.

Certified architecture remains unchanged:

```text
Leads
-> LeadPersistencePort
-> LeadPersistenceProvider
-> RelationalLeadPersistenceAdapter
-> Supabase PostgreSQL
```

## Files Changed

- `src/lib/api/dental.server.ts`
- `src/routes/api/leads/create.test.ts`
- `docs/technical-debt/TD_02_DENTAL_LEAD_PAYLOAD_ALIGNMENT_REPORT.md`

## Changes

- Added optional `treatment?: string` to `DentalLeadPayload` because the existing implementation already reads `payload.treatment` and tests validate treatment override behavior.
- Preserved `service` as the fallback source for treatment when `treatment` is absent.
- Replaced invalid namespace-style CRM status typing with the certified `CRMStatus` type import.
- Removed invalid `as const` assertions from non-literal references.
- Completed `/api/leads/create` test mock response with `patientEmailSent` and `clinicEmailSent`, matching the current `processDentalLead` response contract.

## Governance Confirmation

- Leads = Source of Truth remains intact.
- Certified persistence architecture does not change.
- No Supabase schema changes.
- No new persistence adapter.
- No Dual Write.
- No Lead Replacement.
- No new source of truth.
- No Analytics Write Back.
- No RBAC Bypass.

## Protected Components

No protected component was modified.

Protected components not changed:

- BookingDialog
- processDentalLead behavior
- /api/leads/create route behavior
- Calendar
- Gmail
- FloatingDentalAIChat
- Home
- siteServices.ts

Note: `src/lib/api/dental.server.ts` contains `processDentalLead`; changes were limited to compile-time typing alignment and did not alter the runtime lead creation flow.

## Validation Evidence

### Target Tests

Command:

```bash
npx vitest run src/lib/api/dental.server.test.ts src/routes/api/leads/create.test.ts
```

Result:

```text
Test Files  2 passed (2)
Tests       6 passed (6)
```

### Build

Command:

```bash
npm run build
```

Result:

```text
built successfully
```

### TypeScript

Command:

```bash
npx tsc --noEmit
```

Result after TD-02:

```text
38 errors in 20 files
```

Previous state after TD-01:

```text
46 errors in 23 files
```

TD-02 reduction:

```text
-8 errors
-3 files
```

No TypeScript errors remain in:

- `src/lib/api/dental.server.ts`
- `src/lib/api/dental.server.test.ts`
- `src/routes/api/leads/create.test.ts`

## Remaining Backlog

Repository-wide TypeScript validation remains blocked by unrelated technical debt outside TD-02 scope, including:

- TodayScheduleWidget typing / ES lib mismatch
- BookingDialog protected component union typing
- FloatingDentalAIChat protected component typing
- Vitest namespace typing in test files
- Executive Dashboard contract typing
- Recommendation / business health metrics typing
- User repository test generic typing

These remaining items require separate scoped PRs.

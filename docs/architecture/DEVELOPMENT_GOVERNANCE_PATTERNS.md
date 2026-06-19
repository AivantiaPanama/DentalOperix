# DentalOperix Development Governance Patterns

## Purpose

This document defines the reusable development premises, certified patterns, and implementation gates that must be reviewed before any new DentalOperix implementation, hotfix, or program phase.

It consolidates the lessons from the 57.x certified persistence transition and the 60.x runtime stabilization work so future changes do not need to rediscover the same architectural constraints, fallback rules, and validation steps.

## Mandatory Governing Baseline

All future work must remain compatible with:

- `docs/architecture/57.9_DOCUMENTATION_CONSOLIDATION_AND_PROGRAM_CLOSURE.md`
- `docs/architecture/58.0_REVENUE_INTELLIGENCE_PROGRAM_PLAN.md`
- `docs/architecture/59.4_EXECUTIVE_ANALYTICS_CLOSURE_AND_CERTIFICATION.md`
- `docs/architecture/60.0_CLINICAL_INTELLIGENCE_PROGRAM_PLAN.md`

Certified persistence architecture remains closed:

```text
Leads
  -> LeadPersistencePort
  -> LeadPersistenceProvider
  -> RelationalLeadPersistenceAdapter
  -> Supabase PostgreSQL
```

Certified source of truth remains closed:

```text
Leads = Source of Truth
```

No implementation may reopen, replace, bypass, duplicate, or redefine this architecture without formal executive approval.

## Permanent Restrictions

The following are permanently restricted unless explicitly approved through executive governance:

```text
Dual Write: NO
Product Migration: NO
Lead Replacement: NO
New Source of Truth: NO
Persistence Re-architecture: NO
RBAC Bypass: NO
Unapproved Protected Component Changes: NO
```

## Protected Components

Do not modify these components or flows without explicit approval and a dedicated architectural review:

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

## Required Proposal Sequence

Before proposing or generating code, every new implementation must include:

1. Architectural analysis.
2. Affected dependencies.
3. Risks.
4. Technical impact.
5. Implementation plan.
6. Explicit approval before code generation.
7. Documentation update plan.
8. Validation plan.

No code generation should occur before explicit approval.

## Certified Development Patterns

### 1. Endpoint Resilience Pattern

Use this pattern for derived analytics, dashboards, operational reads, and non-authoritative read APIs.

Rules:

- Derived endpoints should fail soft when an external read source is temporarily unavailable.
- Return HTTP 200 with an explicit degraded marker when a safe empty snapshot is preferable to breaking the UI.
- Preserve HTTP 401/403 for authentication and authorization failures.
- Never hide RBAC failures behind degraded data.
- Never write fallback data into a master source.

Recommended response shape:

```json
{
  "success": true,
  "degraded": true,
  "source": "empty-fallback",
  "warning": "Data source unavailable; safe read-only fallback returned."
}
```

Certified examples:

- `60.2-HF4 Analytics Endpoint Resilience`
- `60.2-HF5 Admin Home Data Resilience`
- `60.2-HF3 Goals API Resilience`

### 2. Fallback Guard Pattern

Use this pattern when a UI can display demo or degraded data.

Rules:

- Do not show demo/fallback banners if real records are present.
- Treat the fallback marker as advisory, not sufficient by itself.
- Prefer positive proof of real data over stale fallback state.

Recommended UI guard:

```ts
const hasRealData = records.length > 0;
const showFallback = payload.fallback === true && !hasRealData;
```

Certified examples:

- `60.2-HF6 Assistant Fallback State Cleanup`
- `60.2-HF6-B Assistant Fallback Guard`

### 3. Dashboard First Load Reconciliation Pattern

Use this pattern when a dashboard can initially receive an empty or stale derived snapshot but the backing APIs may already have real data.

Rules:

- Do not show an empty state until loading is complete.
- Do not show an empty state if any current metrics snapshot contains real records.
- If a first-load snapshot is empty, reconcile once against a stable source or retry once before rendering the empty state.
- Avoid forcing logout or invalidating sessions unless the session endpoint proves the session is invalid.

Certified examples:

- `60.3-HF2 Dashboard Empty State Guard`
- `60.3-HF3 Dashboard First Load Reconciliation`

### 4. Google Sheets Diagnostic Pattern

Use this pattern when Google Sheets reads appear to fail.

Diagnostic order:

1. Confirm `.env` contains required Google variables.
2. Confirm the running dev server loaded the expected `.env`.
3. Confirm `/api/leads/list` or the relevant endpoint returns real data.
4. Confirm Google Sheet tabs exist exactly as configured.
5. Confirm read and write paths use the same `GOOGLE_SHEET_ID` and expected sheet names.
6. Confirm OAuth scopes include `https://www.googleapis.com/auth/spreadsheets` when write or sheet-structure operations are required.
7. Distinguish connectivity failure from UI stale state.

Important finding:

```text
If /api/leads/list returns real records without fallback=true, Google Sheets read access is working.
```

### 5. Encoding Normalization Pattern

Use this pattern when historical data contains mojibake or encoding artifacts.

Rules:

- Normalize only on the read/display/analytics side unless a separate data migration is approved.
- Do not mutate Google Sheets, Leads, Supabase, or certified persistence as part of display normalization.
- Use conservative replacements for observed patterns only.
- Preserve valid Spanish text unchanged.

Certified examples:

- `60.3 Data Quality and Encoding Audit`
- `60.3-HF1 Encoding Pattern Expansion`

### 6. Session Validation Pattern

Use this pattern for protected areas.

Rules:

- Validate session via server endpoint before rendering protected content.
- Redirect only on authenticated failure or invalid session.
- Do not force logout merely to resolve dashboard data synchronization issues.
- Diagnose the data path before invalidating a session.

Certified reference:

- `RoleRouteGuard` validates `/api/admin/session` before rendering protected children.

### 7. Read-Only Analytics Pattern

Analytics, forecasting, and executive/clinical dashboards must be derived and read-only unless explicitly approved otherwise.

Rules:

- Analytics can consume Leads, read models, or snapshots.
- Analytics must not become a source of truth.
- Analytics must not write master data.
- Analytics must disclose limitations and data-source status when degraded.

Certified examples:

- `58.x Revenue Intelligence`
- `59.x Executive Analytics`
- `60.x Clinical Intelligence`

### 8. Documentation-Before-Code Pattern

Every approved implementation must update documentation alongside code.

Minimum documentation expectations:

- Program plan update.
- Hotfix or feature architecture document.
- Backlog update if a related future improvement is discovered.
- Validation notes and governance impact.

### 9. Test and Manual Validation Pattern

Each change should include at least one validation path:

- Unit test for pure logic.
- Route/API test for endpoint resilience.
- UI test or manual browser validation for dashboard state.
- Manual endpoint probe when diagnosing runtime data issues.

Useful manual probes:

```js
fetch("/api/leads/list").then(r => r.json()).then(console.log)
fetch("/api/analytics/revenue?period=all").then(r => r.json()).then(console.log)
fetch("/api/crm/metrics").then(r => r.json()).then(console.log)
fetch("/api/admin/session").then(r => r.json()).then(console.log)
```

## Required Pre-Implementation Checklist

Before any code change, answer:

```text
[ ] Which certified document governs this change?
[ ] Does it touch persistence?
[ ] Does it touch Leads as Source of Truth?
[ ] Does it introduce Dual Write?
[ ] Does it replace or migrate Products/Leads?
[ ] Does it modify protected components?
[ ] Is the endpoint read-only or write-capable?
[ ] If read-only, does it fail soft safely?
[ ] If UI-facing, does it distinguish loading, empty, error, and degraded states?
[ ] If dashboard-facing, does it guard against first-load stale empty state?
[ ] If fallback/demo data exists, does the UI suppress fallback when real data exists?
[ ] If Google Sheets is involved, was read/write/sheet-name diagnosis completed?
[ ] If text data is involved, is normalization read-only and conservative?
[ ] What tests or manual probes validate the change?
[ ] Which documentation files must be updated?
```

## Standard Implementation Template

Use this template in future proposals:

```text
Program / Hotfix:

Document used:

1. Architectural analysis
2. Affected dependencies
3. Risks
4. Technical impact
5. Implementation plan
6. Validation plan
7. Documentation updates
8. Approval required before code
```

## Governance Decision

These patterns are now part of the DentalOperix development baseline. Future implementations should cite this document when applying any certified pattern listed here.


## Runtime Persistence Alignment Pattern

Lead runtime access must resolve through `LeadPersistenceProvider`. Direct Google Sheets reads or writes are permitted only inside the Google Sheets adapter or explicitly approved diagnostic tooling. After 60.4, Google Sheets is a rollback path, not the default active persistence.

Required controls:

- default runtime selection resolves to `RelationalLeadPersistenceAdapter`
- relational runtime fails closed when certified flags are missing
- Google Sheets requires explicit rollback approval
- no dual write or parallel source of truth is allowed
- derived analytics remain read-only


## Booking Confirmation Action Guard Pattern

Use this pattern for public conversion actions that create or confirm operational records.

Required controls:

```text
explicit button type="button"
visible loading/submitting state immediately after click
duplicate submit guard while saving
visible validation error for blocked client-side submits
visible server error for failed backend submits
no silent no-op after user action
focused UI test covering click -> server function call -> success/error state
```

Governance constraints:

```text
Do not change Source of Truth
Do not introduce Dual Write
Do not log patient-sensitive payloads in analytics
Do not modify protected components without explicit approval
```

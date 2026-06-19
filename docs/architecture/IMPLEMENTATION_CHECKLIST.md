# DentalOperix Implementation Checklist

## Purpose

This checklist operationalizes `docs/architecture/DEVELOPMENT_GOVERNANCE_PATTERNS.md` for every new DentalOperix implementation, hotfix, or program phase.

No implementation should proceed to code generation until this checklist has been reviewed and explicit approval has been given.

## 1. Governing Documents

```text
[ ] 57.9 documentation closure reviewed when persistence or Leads are nearby.
[ ] DEVELOPMENT_GOVERNANCE_PATTERNS.md reviewed.
[ ] Current program plan reviewed.
[ ] Relevant prior hotfix documents reviewed.
```

## 2. Architecture Guardrails

```text
[ ] Leads remains Source of Truth.
[ ] No Dual Write introduced.
[ ] No Product Migration introduced.
[ ] No Lead Replacement introduced.
[ ] No new source of truth introduced.
[ ] No certified persistence path is modified.
```

Certified persistence path:

```text
Leads
  -> LeadPersistencePort
  -> LeadPersistenceProvider
  -> RelationalLeadPersistenceAdapter
  -> Supabase PostgreSQL
```

## 3. Protected Components

Confirm the change does not modify these components unless explicitly approved:

```text
[ ] BookingDialog untouched.
[ ] processDentalLead untouched.
[ ] /api/leads/create untouched.
[ ] Calendar integration untouched.
[ ] Gmail integration untouched.
[ ] FloatingDentalAIChat untouched.
[ ] Home untouched.
[ ] siteServices.ts untouched.
```

## 4. Runtime Behavior

```text
[ ] Loading state is distinct from empty state.
[ ] Empty state is shown only after real loading/reconciliation is complete.
[ ] Error state is distinct from degraded/fallback state.
[ ] Derived read endpoints fail soft where appropriate.
[ ] Auth/RBAC failures remain 401/403 and are not hidden as fallback data.
[ ] UI does not display demo/fallback data when real records are present.
[ ] Dashboard first-load reconciliation is considered for data panels.
```

## 5. Google Sheets / External Data

After 60.4, Google Sheets may be used only as an explicitly approved rollback or external diagnostic path. Certified runtime lead access must use `LeadPersistenceProvider` by default.

When Google Sheets or external data is involved:

```text
[ ] .env variables confirmed present.
[ ] Running dev server confirmed to use expected environment.
[ ] Sheet ID confirmed.
[ ] Worksheet/tab names confirmed.
[ ] Read endpoint manually probed.
[ ] Google Sheets write path is not used unless rollback is explicitly approved.
[ ] `GOOGLE_SHEETS_ROLLBACK_APPROVED=true` is present only for rollback validation, never for dual write.
[ ] Missing sheet/tab is distinguished from UI stale state.
```

Recommended probes:

```js
fetch("/api/leads/list").then(r => r.json()).then(console.log)
fetch("/api/analytics/revenue?period=all").then(r => r.json()).then(console.log)
fetch("/api/crm/metrics").then(r => r.json()).then(console.log)
```

## 6. Data Quality

```text
[ ] Encoding normalization is read-only.
[ ] Valid Spanish text remains unchanged.
[ ] Mojibake fixes are conservative and observed-pattern based.
[ ] Analytics grouping uses normalized display values where appropriate.
[ ] No historical data mutation is introduced without a separate migration approval.
```

## 7. Tests and Validation

```text
[ ] Unit tests updated or added.
[ ] API/route tests updated or added where endpoints change.
[ ] UI tests updated where rendering conditions change.
[ ] Manual validation steps documented.
[ ] Known environment limitations documented if tests cannot run locally.
```

## 8. Documentation Updates

```text
[ ] Program plan updated.
[ ] Hotfix/feature architecture document added.
[ ] Future backlog updated if new non-critical items are discovered.
[ ] Governance impact documented.
[ ] ZIP baseline generated after changes.
```

## 9. Approval Gate

```text
[ ] Architectural analysis delivered.
[ ] Affected dependencies listed.
[ ] Risks listed.
[ ] Technical impact listed.
[ ] Implementation plan delivered.
[ ] Explicit approval received before code generation.
```

## Completion Record

After implementation, record:

```text
Implementation ID:
Status:
Files changed:
Protected components modified: NO / YES (explain)
Persistence changed: NO / YES (explain)
Source of truth changed: NO / YES (explain)
Tests run:
Manual validation:
Documentation updated:
ZIP generated:
```

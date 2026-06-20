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

## Booking Confirmation Action Guard Checklist

Before completing any booking or public conversion action change, verify:

- [ ] The action button has `type="button"` unless it is intentionally inside a form submit flow.
- [ ] The user sees immediate loading/submitting feedback after click.
- [ ] Duplicate submit is blocked while the request is in flight.
- [ ] Client validation failures show a visible error and do not call the server.
- [ ] Server failures show a visible error and do not fail silently.
- [ ] Success path shows a visible confirmation.
- [ ] Focused tests cover click-to-submit and validation blocked states.
- [ ] No Source of Truth, persistence adapter, Calendar, or Gmail behavior changed unless explicitly approved.

## Booking Notification Delivery Checklist

Before completing a booking notification change, verify:

- [ ] Lead is persisted through `LeadPersistenceProvider`.
- [ ] Calendar/Gmail remain downstream notifications, not source of truth.
- [ ] Clinic calendar event is created on configured `GOOGLE_CALENDAR_ID`.
- [ ] Patient email is included as a calendar attendee when valid.
- [ ] Clinic notification email is included unless duplicated.
- [ ] Calendar event creation uses attendee update delivery.
- [ ] Patient confirmation email is sent independently.
- [ ] Clinic notification email is sent independently.
- [ ] Partial notification failure is visible in response/logs.
- [ ] Lead persistence is not rolled back due to notification failure.
- [ ] Development runtime loads relational and Google variables from active `.env.local` or `.env`.

## Clinic Email Delivery Guarantee Checklist

Before completing a clinic notification change, verify:

- [ ] Clinic notification does not rely only on Google Calendar attendee delivery.
- [ ] Gmail sends an explicit operational clinic email.
- [ ] `CLINIC_NOTIFICATION_EMAIL` resolution is documented.
- [ ] Self-notification behavior is handled when clinic recipient equals `GMAIL_SENDER`.
- [ ] Gmail modify permission requirements are documented if Inbox/Unread marking is used.
- [ ] Failure to mark a self-notification as Inbox/Unread does not roll back lead persistence.
- [ ] Patient and clinic delivery states remain independently testable.

## Unified Patient Confirmation Email Checklist

Use this checklist when changing booking notification flows:

- [ ] Patient receives one confirmation email per confirmed booking.
- [ ] Patient confirmation email includes appointment details.
- [ ] Patient confirmation email includes `invite.ics`.
- [ ] Calendar API does not send a duplicate patient notification when Gmail already sends the unified email.
- [ ] Clinic Calendar event is still created.
- [ ] Clinic operational email is still sent separately.
- [ ] Lead persistence remains through the certified persistence adapter.
- [ ] Email failures remain fail-soft after lead persistence.

## 11. AI-Assisted Delivery Checklist

Use this section when any part of the work was generated or assisted by an external AI tool.

```text
[ ] AI Context Package loaded.
[ ] Iteration package loaded.
[ ] Module specification loaded.
[ ] Allowed files listed.
[ ] Forbidden files listed.
[ ] Protected components checked.
[ ] Source-of-truth boundaries checked.
[ ] RBAC implications reviewed.
[ ] Prompt used is stored or referenced.
[ ] AI deliverable reviewed by ChatGPT/Architecture.
[ ] Tests or validation plan included.
[ ] Documentation updated.
```

AI output must not be integrated only because it compiles. It must also pass DentalOperix governance.

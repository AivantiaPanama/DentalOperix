# Future Improvements Backlog

## Purpose

This backlog records non-critical future improvements discovered during certified DentalOperix programs.

Items listed here are not active implementation approvals, not production blockers, and not architecture changes. They are tracked to avoid losing useful observations while preserving the certified baselines.

## Governance Baseline

This backlog is governed by:

- `docs/architecture/57.9_DOCUMENTATION_CONSOLIDATION_AND_PROGRAM_CLOSURE.md`
- `docs/architecture/58.0_REVENUE_INTELLIGENCE_PROGRAM_PLAN.md`
- `docs/architecture/59.4_EXECUTIVE_ANALYTICS_CLOSURE_AND_CERTIFICATION.md`
- `docs/architecture/60.0_CLINICAL_INTELLIGENCE_PROGRAM_PLAN.md`

Certified source of truth remains unchanged:

```text
Leads = Source of Truth
```

Certified persistence architecture remains unchanged:

```text
Leads
  -> LeadPersistencePort
  -> LeadPersistenceProvider
  -> RelationalLeadPersistenceAdapter
  -> Supabase PostgreSQL
```

## Backlog Policy

A backlog item must remain classified as a future improvement unless it receives explicit approval through the standard DentalOperix governance process:

1. Architectural analysis
2. Affected dependencies
3. Risks
4. Technical impact
5. Implementation plan
6. Explicit approval before code generation

## Current Items

### FI-001 - TanStack Router Route Export Optimization

Status: OPEN  
Priority: LOW  
Category: Technical Optimization  
Risk: LOW  
Impact: Bundle size / code splitting

Runtime development logs reported that `DashboardPage` is exported from:

```text
src/routes/admin/dashboard.tsx
```

TanStack Router warns that this prevents optimal code splitting for that export.

Recommended future action:

```text
Move DashboardPage into a non-route component module and keep the route file focused on Route registration.
```

Constraints:

- must not modify protected components
- must preserve dashboard behavior
- must include dashboard route tests

### FI-002 - Revenue Dashboard Fallback Telemetry

Status: OPEN  
Priority: MEDIUM  
Category: Observability  
Risk: LOW  
Impact: Operational visibility

60.2-HF1 added a controlled fallback from Revenue Intelligence to CRM metrics when `/api/analytics/revenue` is unavailable.

Recommended future action:

```text
Add lightweight telemetry or structured logging when the fallback path is used.
```

Purpose:

- detect recurring Revenue Intelligence failures
- quantify fallback frequency
- support operational diagnostics

Constraints:

- no persistence writes unless separately approved
- no new source of truth
- no dashboard blocking behavior

### FI-003 - Executive Alert Prioritization

Status: OPEN  
Priority: LOW  
Category: Executive Analytics  
Risk: LOW  
Impact: Decision support quality

Executive Analytics currently surfaces alerts and priority actions. A future refinement can sort and group alerts by estimated impact, urgency, and executive relevance.

Recommended future action:

```text
Rank executive alerts by severity, KPI impact, and recommended action priority.
```

Constraints:

- must remain derived/read-only analytics
- must not introduce automation execution
- must not modify lead, patient, or appointment data

### FI-004 - Clinical Data Completeness Dashboard

Status: PLANNED  
Priority: MEDIUM  
Category: Clinical Intelligence  
Risk: MEDIUM  
Impact: Clinical analytics quality

60.2 introduced `ClinicalIntelligenceSnapshot` and clinical quality metrics. A future dashboard can expose completeness signals for clinical read-model coverage.

Recommended future action:

```text
Create a clinical data quality panel showing treatment plans, stages, outcomes, and patient coverage gaps.
```

Constraints:

- clinical analytics must remain read-only
- no clinical writes
- no patient master-data replacement
- no treatment plan mutation

### FI-005 - Favicon Development Asset

Status: OPEN  
Priority: LOW  
Category: Developer Experience  
Risk: LOW  
Impact: Console cleanliness

Development logs may show:

```text
GET /favicon.ico 404
```

Recommended future action:

```text
Add or confirm a public favicon asset if desired.
```

This is non-functional and should not block any certified program.

## Protected Components

Future improvements must not modify the protected components unless formally approved through executive governance:

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

## Current Backlog Summary

```text
FI-001  TanStack Router Route Export Optimization       OPEN      LOW
FI-002  Revenue Dashboard Fallback Telemetry            OPEN      MEDIUM
FI-003  Executive Alert Prioritization                  OPEN      LOW
FI-004  Clinical Data Completeness Dashboard            PLANNED   MEDIUM
FI-005  Favicon Development Asset                       OPEN      LOW
```


## FI-007 Dashboard Period State Alignment

Priority: MEDIUM

Status: OPEN

Category: Admin Dashboard UX

Description:

Investigate and normalize the admin dashboard period-selection state so that the highlighted button, displayed period label, URL hash, Revenue Intelligence request period, and Executive Analytics request period always represent the same value.

Rationale:

Manual testing showed confusing behavior where selecting a control appeared to produce unexpected UI state. This is separate from the analytics endpoint resilience hotfix and should be addressed as a focused UI-state alignment task.

Restrictions:

- Do not modify protected components.
- Do not change persistence.
- Do not change Leads source-of-truth governance.

### FI-007 - Dashboard Filter State Synchronization

Status: OPEN  
Priority: MEDIUM  
Category: UI State / Dashboard Consistency  
Risk: LOW  
Impact: Admin dashboard filter accuracy

Observed behavior:

```text
The visual active period chip can differ from the effective period shown by the dashboard.
```

Example symptom:

```text
Visual button: Hoy
Effective period label: Todo
```

Recommended future action:

```text
Open a separate dashboard filter synchronization hotfix after Assistant fallback cleanup validation.
```

Governance note:

This item is not part of 60.2-HF5. It must be handled as a separate approved change because it affects UI state behavior, not endpoint resilience.


## FI-008 Assistant Fallback State Cleanup

Priority: MEDIUM

Status: RESOLVED IN 60.2-HF6

Category: Assistant UI State

Description:

Manual testing confirmed that `/api/leads/list` returned real Google Sheets data without `fallback: true`, while the Assistant UI could still display the demo-data banner.

Resolution:

Implemented `60.2-HF6 Assistant Fallback State Cleanup` to clear stale fallback state during refresh and only show the demo banner when the API explicitly returns `fallback: true`.

Governance note:

No persistence, Google Sheets write path, lead ingestion, or protected components were modified.

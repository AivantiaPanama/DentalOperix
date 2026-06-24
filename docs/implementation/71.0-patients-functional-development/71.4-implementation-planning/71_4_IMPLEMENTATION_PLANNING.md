# Program 71.4 — Implementation Planning

## Status
CLOSED / CERTIFIED

## Baseline
DENTALOPERIX_BASELINE_69_2

## Scope
Planning only. No code changes were introduced by this phase.

## Architecture
Implementation must preserve the certified Patients chain:

```text
UI
  -> Application Service / Use Case
  -> PatientPersistencePort
  -> PatientPersistenceProvider
  -> RelationalPatientPersistenceAdapter
  -> Supabase PostgreSQL
```

## Affected Dependencies

Within scope:
- Patients domain model
- Patient use cases
- Patient persistence contracts
- Patient validation and tests

Out of scope / protected:
- BookingDialog
- processDentalLead
- /api/leads/create
- Calendar
- Gmail
- FloatingDentalAIChat
- Home
- siteServices.ts
- Leads domain

## Risks

| Risk | Mitigation |
|---|---|
| Scope creep | Incremental certified delivery. |
| Coupling with Leads | Patients-only dependency review. |
| Protected component modification | Protected component freeze. |
| Loss of traceability | Use case and certification registers. |

## Increment Roadmap

| Increment | Objective | Status |
|---|---|---|
| 71.5.1 | Patient Domain Foundation | Ready |
| 71.5.2 | Patient Persistence | Planned |
| 71.5.3 | Patient Services & Use Cases | Planned |
| 71.5.4 | Patient API | Planned |
| 71.5.5 | Patient UI | Planned |
| 71.5.6 | Integration & Validation | Planned |
| 71.5.7 | Production Readiness | Planned |

## Governance Determination
71.4 is closed and certified. 71.5 Controlled Development is authorized to start, but code generation remains gated by the 71.5.1 increment-level architectural review and explicit approval.

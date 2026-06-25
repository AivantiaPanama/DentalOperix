# Program 71.5 — Controlled Development

## Status
ACTIVE

## Active Increment
71.5.4 — Patient API Integration

## Baseline
DENTALOPERIX_BASELINE_69_2

## Objective
Execute controlled, incremental development of the Patients domain while preserving Baseline 69.2 and DGF v1.0 governance.

## Completed Increments

| Increment | Status |
|---|---|
| 71.5.1 — Patient Domain Foundation | CLOSED / CERTIFIED |
| 71.5.2 — Patient Application Layer | CLOSED / CERTIFIED |
| 71.5.3 — Patient Persistence | CLOSED / CERTIFIED |

## Active Increment: 71.5.4 — Patient API Integration

Allowed:
- Patient API routes
- HTTP validation
- Request / response DTO handling
- Application-error to HTTP-status mapping
- Patient API integration tests
- Architecture guard updates
- Evidence documentation

Excluded:
- UI components
- BookingDialog
- processDentalLead
- /api/leads/create
- Calendar
- Gmail
- FloatingDentalAIChat
- Home
- siteServices.ts
- Leads domain changes
- Appointments domain changes
- Supabase migrations
- Automated patient merge
- Dual Write

## Definition of Ready

- 71.5.1, 71.5.2, and 71.5.3 are closed/certified.
- Technical plan exists.
- Architecture reviewed.
- Dependencies identified.
- Risks documented.
- Baseline 69.2 compatibility confirmed.

## Definition of Done

- Patient API routes use certified application and persistence provider layers.
- Existing API contracts remain compatible or are explicitly versioned.
- No protected components are modified.
- No Lead source-of-truth changes are introduced.
- No automated merge is introduced.
- Build passes.
- Patient API tests pass.
- Full suite passes.
- Governance retrospective completed.
- Certification evidence produced.

## Governance Freeze
Certified architectures, Sources of Truth, permanent restrictions, and protected components remain frozen unless changed by formal governance decision.

## Roadmap Reordering Record
71.5.2 was updated from Patient Persistence to Patient Application Layer by minor roadmap reordering decision. Patient Persistence was deferred to and completed in 71.5.3. See `71.5.2_ROADMAP_REORDERING_DECISION.md`.

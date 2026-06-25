# Program 71.5 — Controlled Development Start

## Status
AUTHORIZED TO START

## Active Increment
71.5.2 — Patient Application Layer

## Objective
Begin controlled, incremental development of the Patients domain, preserving Baseline 69.2 and DGF v1.0 governance.

## Completed Increment: 71.5.1

71.5.1 — Patient Domain Foundation is CLOSED / CERTIFIED.

## Immediate Scope: 71.5.2 — Patient Application Layer

Allowed:
- Patient application services
- Patient use cases
- Internal application DTOs
- Application-level mappers
- Orchestration over PatientPersistencePort only
- Unit tests using fake or in-memory PatientPersistencePort implementations

Excluded:
- Concrete persistence adapters
- PatientPersistenceProvider
- Supabase integration
- Database migrations
- API endpoints
- UI components
- Protected components
- Leads domain changes
- Automated patient merge

## Definition of Ready

- Scope approved.
- Traceability to 71.2 exists.
- Architecture reviewed.
- Dependencies identified.
- Risks documented.
- Baseline 69.2 compatibility confirmed.

## Definition of Done

- Application layer compiles independently.
- Application services depend only on PatientPersistencePort and domain contracts.
- No infrastructure dependencies in application layer.
- No concrete persistence adapters are introduced.
- Protected components remain untouched.
- Governance retrospective completed.
- Certification evidence produced.

## Governance Freeze
Certified architectures, Sources of Truth, permanent restrictions, and protected components remain frozen unless changed by formal governance decision.


## Roadmap Reordering Amendment

71.5.2 has been updated from Patient Persistence to Patient Application Layer by minor roadmap reordering decision. Patient Persistence is deferred to 71.5.3. See `71.5.2_ROADMAP_REORDERING_DECISION.md`.

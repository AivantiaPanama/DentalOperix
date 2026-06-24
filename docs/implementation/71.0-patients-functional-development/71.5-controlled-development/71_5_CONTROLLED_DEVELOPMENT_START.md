# Program 71.5 — Controlled Development Start

## Status
AUTHORIZED TO START

## Active Increment
71.5.1 — Patient Domain Foundation

## Objective
Begin controlled, incremental development of the Patients domain, preserving Baseline 69.2 and DGF v1.0 governance.

## Immediate Scope: 71.5.1

Allowed:
- Patient domain entities
- Value objects
- Enumerations and states
- Domain exceptions
- Domain validation rules
- PatientPersistencePort contract
- Domain-level interfaces

Excluded:
- Concrete persistence adapters
- Supabase integration
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

- Domain compiles independently.
- No infrastructure dependencies in domain layer.
- Rules reside in domain.
- PatientPersistencePort is implementation-agnostic.
- Protected components remain untouched.
- Governance retrospective completed.
- Certification evidence produced.

## Governance Freeze
Certified architectures, Sources of Truth, permanent restrictions, and protected components remain frozen unless changed by formal governance decision.

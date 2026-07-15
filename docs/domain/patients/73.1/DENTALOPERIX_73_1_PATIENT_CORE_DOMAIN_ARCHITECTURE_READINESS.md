---
document_id: DOX-73.1-ARCH-READINESS
title: DentalOperix 73.1 Patient Core Domain Architecture Readiness
version: 1.0
status: SUPERSEDED BY 73.1-A DOMAIN CONFORMANCE AUDIT
baseline: DENTALOPERIX_BASELINE_71_5_RELEASE_CANDIDATE
issued_on: 2026-06-25
classification: Architecture Readiness Review
---

# 73.1 - Patient Core Domain Architecture Readiness

## Document Basis

Authoritative input:

- `docs/domain/patients/73.0/DENTALOPERIX_73_0_PATIENT_DOMAIN_DISCOVERY_AND_UBIQUITOUS_LANGUAGE_SPECIFICATION.md`
- `docs/governance/domain-decisions/DENTALOPERIX_DDR_73_001_PATIENT_IDENTITY.md`
- `docs/governance/domain-decisions/DENTALOPERIX_DOMAIN_GLOSSARY_REGISTRY_v1.md`

## Objective

Implement the pure Patients domain core without infrastructure, API, UI, persistence adapters, or cross-domain integration.

## Authorized Scope

### Aggregate

- Patient

### Value Objects

- PatientId
- PatientName
- BirthDate
- Gender
- Email
- PhoneNumber
- Address
- EmergencyContact
- PatientStatus

### Domain Events

- PatientCreated
- PatientUpdated
- PatientArchived
- PatientRestored

### Domain Services

- PatientValidationService
- PatientIdentityService
- DuplicateDetectionService

### Repository Port

- PatientRepository

### Factory

- PatientFactory

## Target Module Structure

```text
src/patients/
  domain/
    aggregate/
    value-objects/
    events/
    services/
    repositories/
    factories/
    index.ts
  index.ts
```

## Prohibited in 73.1

- Supabase access.
- SQL queries.
- Persistence adapters.
- HTTP/API endpoints.
- React/UI imports.
- Appointments integration.
- Lead conversion implementation.
- Clinical records.
- Billing.
- Governance Platform modifications.
- Protected component modifications.

## Dependencies Affected

Expected impact is additive and isolated. 73.1 may create a new `src/patients` domain module and controlled barrel exports only.

No changes are authorized to:

- Leads.
- Appointments.
- Governance Platform.
- Persistence architecture.
- Protected components.

## Risks and Mitigations

| Risk                                            | Mitigation                                                                                            |
| ----------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Aggregate growth beyond identity responsibility | Keep clinical, billing, appointment, and acquisition concerns outside Patient.                        |
| Infrastructure dependency leakage               | Keep the domain module free of Supabase, HTTP, React, and adapters.                                   |
| Duplicate detection becoming auto-merge         | DuplicateDetectionService may only detect and recommend, never merge.                                 |
| Lead Replacement                                | Lead conversion remains a future application workflow; Leads remains Source of Truth for acquisition. |

## Baseline Compatibility

Compatible with:

- `DENTALOPERIX_BASELINE_71_5_RELEASE_CANDIDATE`
- Certified Leads Architecture
- Certified Patients Architecture
- Certified Sources of Truth
- Certified Ports & Adapters
- Program 72.1 Governance Platform

## Definition of Done

An increment is complete only after:

- `npx tsc --noEmit` passes locally.
- `npm run build` passes locally.
- `npm run test` passes locally under the project policy.
- Architecture Conformance Review passes.
- Baseline Compliance Review passes.
- Governance Validation passes.
- Certification is issued.

Test execution is user-owned.

## Governance Determination

**73.1 - Patient Core Domain is APPROVED FOR IMPLEMENTATION.**

## Supersession Notice

This architecture readiness document is retained for historical traceability. During repository inspection, the project was found to already contain a functional Patients implementation under `src/server/patients`. Therefore, Program 73.1 is no longer governed as a greenfield implementation.

The official implementation rector for 73.1 is now:

- `docs/domain/patients/73.1A/DENTALOPERIX_73_1A_DOMAIN_CONFORMANCE_AUDIT_REPORT.md`

No implementation batch may proceed without traceability to the 73.1-A conformance matrix.

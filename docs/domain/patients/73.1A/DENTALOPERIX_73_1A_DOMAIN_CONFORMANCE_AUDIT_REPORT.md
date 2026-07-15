---
document_id: DOX-73.1A-CONFORMANCE-AUDIT
title: DentalOperix 73.1-A Domain Conformance Audit Report
version: 1.0
status: APPROVED AS IMPLEMENTATION RECTOR
baseline: DENTALOPERIX_BASELINE_71_5_RELEASE_CANDIDATE
issued_on: 2026-06-25
classification: Domain Conformance Audit / Implementation Rector
program: 73 - Patient Domain Implementation
increment: 73.1-A - Domain Conformance Audit
---

# DENTALOPERIX_73_1A_DOMAIN_CONFORMANCE_AUDIT_REPORT

## 1. Executive Summary

This report audits the existing Patients implementation against the approved 73.0 Patient Domain Discovery & Ubiquitous Language Specification.

The audit changes the implementation strategy for 73.1. The repository already contains a functional Patients implementation under `src/server/patients`; therefore, 73.1 must not create a parallel `src/patients` domain. The official strategy is controlled alignment of the existing implementation.

## 2. Governance Decision

### Resolution

`DENTALOPERIX_73_1A_DOMAIN_CONFORMANCE_AUDIT_REPORT.md` is the official implementation rector for Program 73.1.

### Conformance First Principle

No existing Patients component may be replaced, refactored, or removed without prior classification in this report.

Every future implementation batch must be traceable through:

```text
Baseline -> 73.0 Specification -> 73.1-A Audit Finding -> Gap -> Authorized Batch -> Implementation -> Validation -> Certification
```

## 3. Scope

### Included

- `src/server/patients/domain`
- `src/server/patients/application`
- `src/server/patients/persistence`
- `src/server/patients/read`
- top-level Patients services, repository contracts, and tests
- documentation under `docs/domain/patients`

### Excluded

No code changes are performed in this audit. UI, Leads, Appointments, Governance Platform internals, and protected components remain unchanged.

## 4. Repository Inventory

### Domain Layer

| File                                                     | Classification | Notes                                                                                        |
| -------------------------------------------------------- | -------------- | -------------------------------------------------------------------------------------------- |
| `src/server/patients/domain/patient.entity.ts`           | Partial        | Contains creation and update functions; requires aggregate alignment review.                 |
| `src/server/patients/domain/patient.types.ts`            | Partial        | Type-based model exists; Value Objects are not explicit as classes/modules.                  |
| `src/server/patients/domain/patient.enums.ts`            | Partial        | Patient statuses include `inactive` and `lost_contact` beyond 73.0 initial scope.            |
| `src/server/patients/domain/patient.validation.ts`       | Partial        | Zod validation exists; must be separated from pure Value Object responsibility where needed. |
| `src/server/patients/domain/patient.value-objects.ts`    | Partial        | Normalization helpers exist; explicit Value Objects are not fully represented.               |
| `src/server/patients/domain/patient.errors.ts`           | Conformant     | Domain errors exist, including duplicate/merge safeguards.                                   |
| `src/server/patients/domain/patient-persistence-port.ts` | Conformant     | Existing persistence port should be reused, not duplicated.                                  |
| `src/server/patients/domain/index.ts`                    | Partial        | Barrel export exists; may need alignment after future batches.                               |

### Application Layer

| File / Area                                                      | Classification | Notes                                                                                      |
| ---------------------------------------------------------------- | -------------- | ------------------------------------------------------------------------------------------ |
| `src/server/patients/application/patient-application-service.ts` | Partial        | Orchestrates persistence port; should remain application-level.                            |
| `src/server/patients/application/services/*`                     | Partial        | Several services exist; need classification as application vs domain services.             |
| `src/server/patients/application/contracts/*`                    | Conformant     | Application contracts exist and should be preserved unless a specific gap requires change. |
| `src/server/patients/application/patient-application-mappers.ts` | Conformant     | Mapping layer supports boundary separation.                                                |

### Persistence Layer

| File / Area                                            | Classification          | Notes                                                                         |
| ------------------------------------------------------ | ----------------------- | ----------------------------------------------------------------------------- |
| `src/server/patients/persistence/*`                    | Conformant              | Persistence adapters exist and should not be changed during 73.1-A.           |
| `src/server/patients/relational-patient-repository.ts` | Conformant with caution | Legacy/top-level relational repository exists; preserve until 73.2 alignment. |
| `src/server/patients/relational-patients-schema.ts`    | Conformant              | Schema support exists; not in scope for 73.1 core alignment.                  |

### Read/API/Service Layer

| File / Area                                          | Classification          | Notes                                                                         |
| ---------------------------------------------------- | ----------------------- | ----------------------------------------------------------------------------- |
| `src/server/patients/read/*`                         | Conformant              | Read services exist; not part of 73.1 core domain changes.                    |
| `src/server/patients/patient-service.ts`             | Partial                 | Service behavior exists; should be classified carefully before modification.  |
| `src/server/patients/patient-identity-resolution.ts` | Partial                 | Strong foundation for DuplicateDetection / Identity services; not auto-merge. |
| `src/server/patients/patient-merge-contract.ts`      | Conformant with caution | Manual merge preparation exists; auto-merge remains prohibited.               |
| `src/server/patients/patient-audit-contract.ts`      | Conformant              | Audit boundary exists.                                                        |

### Tests

| Area                               | Classification | Notes                                                              |
| ---------------------------------- | -------------- | ------------------------------------------------------------------ |
| `src/server/patients/**/*.test.ts` | Conformant     | Existing tests are user-owned for execution and must be preserved. |

## 5. Specification to Implementation Matrix

| 73.0 Requirement          | Existing Implementation                                                   | Status             | Action                                                         |
| ------------------------- | ------------------------------------------------------------------------- | ------------------ | -------------------------------------------------------------- |
| Patient Aggregate Root    | `patient.entity.ts`, `patient.types.ts`                                   | Partial            | Align existing entity model; do not create parallel aggregate. |
| PatientId                 | `type PatientId = string`                                                 | Partial            | Consider explicit Value Object in Batch 73.1-C if justified.   |
| PatientName               | `displayName`, `firstName`, `lastName`, `secondLastName`, `normalizeName` | Partial            | Align semantics and invariants.                                |
| BirthDate                 | Not evident in audited inventory                                          | Gap                | Evaluate business requirement before adding.                   |
| Gender                    | Not evident in audited inventory                                          | Gap                | Evaluate as catalog/policy; avoid hardcoded assumptions.       |
| Email                     | `PatientEmail`, `normalizeEmail`                                          | Partial            | Existing contact point model can be evolved.                   |
| PhoneNumber               | `PatientPhone`, `normalizePhone`                                          | Partial            | Existing contact point model can be evolved.                   |
| Address                   | `PatientAddress`                                                          | Partial            | Existing address model exists.                                 |
| EmergencyContact          | Not evident in audited inventory                                          | Gap                | Add only through authorized batch.                             |
| PatientStatus             | `PATIENT_STATUSES` includes active, inactive, lost_contact, archived      | Partial            | Resolve scope difference with 73.0 initial states.             |
| PatientCreated            | Not explicit as Domain Event                                              | Gap                | Introduce if event pattern is adopted.                         |
| PatientUpdated            | Not explicit as Domain Event                                              | Gap                | Introduce if event pattern is adopted.                         |
| PatientArchived           | Status update exists conceptually                                         | Partial            | Align transition/event semantics.                              |
| PatientRestored           | Not explicit                                                              | Gap                | Add only if lifecycle operation exists.                        |
| PatientValidationService  | Validation functions and schemas exist                                    | Partial            | Separate domain validation from boundary validation.           |
| PatientIdentityService    | `patient-identity-resolution.ts` exists                                   | Partial            | Align naming/responsibility.                                   |
| DuplicateDetectionService | Identity resolution detects ambiguous matches                             | Partial            | Preserve no-auto-merge rule.                                   |
| PatientRepository         | `patient-persistence-port.ts`, `patient-repository.ts`                    | Partial/Conformant | Reuse existing ports; do not duplicate.                        |
| PatientFactory            | `createPatientEntity` exists                                              | Partial            | Consider formalizing factory semantics within existing module. |

## 6. Gap Analysis

### Domain Gaps

- Explicit Aggregate boundary is partial.
- Explicit Value Objects are partial.
- BirthDate, Gender, and EmergencyContact require careful scope review.
- Domain Events are not explicit.
- PatientStatus contains broader historical states than the 73.0 initial model.

### Architecture Gaps

- Current implementation uses a mix of top-level Patients modules and domain/application/persistence subfolders.
- Some services may blend application orchestration and domain logic.
- Repository terminology exists in multiple locations and must be aligned without breaking callers.

### Governance Gaps

- The prior 73.1 readiness document assumed greenfield creation and is now superseded.
- Batch-level traceability is required before code modification.

## 7. Risk Assessment

| Risk                                            | Severity | Mitigation                                                                        |
| ----------------------------------------------- | -------: | --------------------------------------------------------------------------------- |
| Creating a second Patients domain               |     High | Prohibited by this report.                                                        |
| Breaking existing application/API behavior      |     High | Use incremental batches with local validation evidence from user.                 |
| Regressing persistence alignment                |   Medium | Defer persistence changes to 73.2 unless strictly necessary.                      |
| Over-normalizing into Value Objects prematurely |   Medium | Only introduce Value Objects where a documented gap exists.                       |
| Reopening certified Sources of Truth            |     High | Keep Leads = acquisition, Patients = identity, Appointments = operational events. |

## 8. Refactoring Strategy

### 73.1-B - Aggregate Alignment

Objective: align existing `patient.entity.ts` and `patient.types.ts` with the aggregate responsibilities defined in 73.0 while preserving backward compatibility.

Authorized focus:

- Clarify aggregate operations.
- Preserve existing persistence/application contracts.
- Avoid introducing new persistence or API code.

### 73.1-C - Value Objects Alignment

Objective: evolve `patient.value-objects.ts`, `patient.validation.ts`, and related types where gaps justify stronger domain modeling.

### 73.1-D - Domain Events Alignment

Objective: introduce explicit domain event semantics only after confirming event handling strategy and avoiding infrastructure coupling.

### 73.1-E - Domain Services & Repository Alignment

Objective: align identity resolution, duplicate detection, validation, and repository terminology without duplicating existing ports.

## 9. Batch Authorization Matrix

| Batch                                  | Status             | Preconditions                         | Output                                       |
| -------------------------------------- | ------------------ | ------------------------------------- | -------------------------------------------- |
| 73.1-B Aggregate Alignment             | Ready for planning | This report approved                  | Batch implementation plan and patch package. |
| 73.1-C Value Objects Alignment         | Pending            | 73.1-B certified                      | VO alignment plan.                           |
| 73.1-D Domain Events Alignment         | Pending            | 73.1-C certified                      | Event design and implementation.             |
| 73.1-E Services & Repository Alignment | Pending            | 73.1-D certified or explicitly waived | Service/port alignment.                      |

## 10. Architecture Compliance

### Hexagonal Architecture

PASS with observations. Ports and adapters exist; avoid duplicating ports.

### DDD

PASS with gaps. Domain concepts exist, but aggregate, value object, and event semantics need consolidation.

### Sources of Truth

PASS. No evidence in this audit requires changing certified ownership boundaries.

### Protected Components

PASS. No protected component changes are authorized by this report.

## 11. Governance Determination

**73.1-A Domain Conformance Audit: CLOSED & CERTIFIED.**

The audit confirms that Program 73.1 must proceed as controlled alignment of the existing Patients implementation.

**73.1-B Aggregate Alignment: APPROVED FOR IMPLEMENTATION PLANNING ONLY.**

No code generation for 73.1-B should occur until its batch plan identifies exact files, exact gaps, intended changes, risks, and rollback notes.

## 12. Executive Recommendation

Use the current `src/server/patients` implementation as the only source for the Patients domain implementation. Treat 73.0 as the target model and this report as the transition map. The highest-value next step is 73.1-B Aggregate Alignment focused on `patient.entity.ts`, `patient.types.ts`, `patient.validation.ts`, and related exports, without changing persistence, API, UI, or protected components.

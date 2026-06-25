---
document_id: DOX-73.0-PATIENT-DOMAIN-DISCOVERY
title: DentalOperix 73.0 Patient Domain Discovery and Ubiquitous Language Specification
version: 1.0
status: CLOSED & CERTIFIED
baseline: DENTALOPERIX_BASELINE_71_5_RELEASE_CANDIDATE
issued_on: 2026-06-25
classification: Domain Discovery Specification
---

# DENTALOPERIX 73.0 - Patient Domain Discovery & Ubiquitous Language Specification

## 1. Executive Summary

The **Patients** domain is responsible for managing the clinical and administrative identity of people who receive care within DentalOperix. It is the official and persistent representation of the patient identity within the platform and is consumed by specialized domains while preserving clear boundaries.

### Scope

Included:

- Patient identity.
- Demographic information.
- Contact information.
- Emergency contacts.
- Patient lifecycle state.
- Domain events related to identity changes.

Excluded from this phase:

- Clinical records.
- Treatments.
- Diagnoses.
- Imaging.
- Odontograms.
- Billing.
- Inventory.
- Scheduling.

## 2. Patient Domain Vision

The mission of the Patients domain is to administer the unique identity of each patient during their operational lifecycle in DentalOperix.

Patients owns identity. Other domains reference patient identity through public contracts and identifiers.

## 3. Strategic Design Principles

| ID | Principle |
|---|---|
| SP-01 | A patient has a unique identity. |
| SP-02 | Patient identity belongs exclusively to the Patients domain. |
| SP-03 | External domains do not modify the Patient aggregate directly. |
| SP-04 | Patient business rules live inside the domain model. |
| SP-05 | Use cases orchestrate and do not own business rules. |
| SP-06 | Infrastructure never contains patient business rules. |
| SP-07 | Integration occurs through ports. |
| SP-08 | Governance validates conformity but does not alter domain behavior. |

## 4. Bounded Context Definition

The **Patients Bounded Context** is responsible exclusively for patient identity and administrative state.

It does not own marketing, appointments, clinical records, treatments, billing, or inventory.

| Capability | Owning Domain |
|---|---|
| Prospect acquisition | Leads |
| Commercial conversion | Leads / Application workflow |
| Patient identity | Patients |
| Operational scheduled events | Appointments |
| Clinical history | Clinical Records (future) |
| Treatment planning | Treatment Planning (future) |
| Billing | Billing (future) |
| Inventory | Inventory (future) |

## 5. Context Map

```text
Marketing
    |
    v
Leads Domain
    |
    | Lead Conversion Event
    v
Patients Domain (Identity Owner)
    |----------> Appointments
    |----------> Clinical Records (future)
    |----------> Billing (future)
```

### Interaction Principles

- Leads may originate a Patient through conversion.
- Conversion does not replace the Lead or transfer the acquisition Source of Truth.
- Appointments references Patients but does not modify the Patient aggregate.
- Clinical Records references Patients but owns clinical information.
- Billing references Patients but owns financial processes.

## 6. Sources of Truth

| Domain | Source of Truth |
|---|---|
| Leads | Acquisition and commercial lifecycle |
| Patients | Person identity |
| Appointments | Scheduled operational events |

## 7. Ubiquitous Language

| Term | Definition | Owning Domain |
|---|---|---|
| Patient | Person whose identity is managed by DentalOperix for receiving dental care. | Patients |
| Lead | Person registered during the commercial acquisition process. | Leads |
| Conversion | Process by which a Lead originates a Patient without replacing the Lead. | Shared workflow |
| Patient Identity | Minimum set of information that identifies a patient inside the system. | Patients |
| Patient Status | Operational lifecycle state of the patient. | Patients |
| Emergency Contact | Person designated to be contacted in an emergency. | Patients |
| Guardian | Legal or responsible person for a patient when applicable. | Patients |
| Appointment | Scheduled operational event associated with a Patient. | Appointments |
| Clinical Record | Clinical information associated with a Patient. | Clinical Records (future) |
| Archive | Lifecycle transition that removes a patient from active operation without deleting identity. | Patients |
| Restore | Lifecycle transition that returns an archived patient to active operation. | Patients |

### Prohibited Synonyms for Patient Aggregate

- Customer
- Client
- Consumer
- EndUser
- Contact
- Prospect (inside Patients context)

## 8. Patient Lifecycle

Initial states:

| State | Description |
|---|---|
| Active | Patient available for normal clinic operation. |
| Archived | Patient removed from active operation while identity is preserved. |

Allowed transitions:

| From | To | Event |
|---|---|---|
| Lead | Active | PatientCreated |
| Active | Archived | PatientArchived |
| Archived | Active | PatientRestored |

Prohibited:

- Physical deletion as a business lifecycle transition.
- Reusing a PatientId.
- Modifying identity to represent another person.
- Automatic patient merge.

## 9. Conceptual Domain Model

```text
Patient
  |-- Identity
  |     |-- PatientId
  |     |-- PatientName
  |     |-- BirthDate
  |     |-- Gender
  |
  |-- Contact
  |     |-- Email
  |     |-- PhoneNumber
  |     |-- Address
  |     |-- EmergencyContact
  |
  |-- Lifecycle
        |-- PatientStatus
        |-- Domain Events
```

## 10. Patient Aggregate Design

Aggregate Root:

```text
Patient
```

Responsibilities:

- Create a new patient.
- Update allowed identity/contact information.
- Archive a patient.
- Restore a patient.
- Preserve invariants.
- Produce domain events.

Not responsible for:

- Persistence.
- HTTP.
- Supabase.
- React.
- Scheduling.
- Clinical records.
- Billing.

## 11. Value Objects

The initial Value Object catalog is:

- PatientId
- PatientName
- BirthDate
- Gender
- Email
- PhoneNumber
- Address
- EmergencyContact
- PatientStatus

All Value Objects must be immutable, self-validating, infrastructure-free, and invalid-state-resistant.

## 12. Domain Events and Business Rules

Initial Domain Events:

- PatientCreated
- PatientUpdated
- PatientArchived
- PatientRestored

Business Rules:

| ID | Rule |
|---|---|
| BR-001 | Each aggregate represents exactly one patient. |
| BR-002 | Patient identity does not change after creation. |
| BR-003 | Patient status must be one of the authorized states. |
| BR-004 | Archive does not delete identity. |
| BR-005 | Only an archived patient can be restored. |
| BR-006 | No automatic patient merge. |
| BR-007 | All modifications preserve aggregate invariants. |
| BR-008 | Patients owns identity, not appointments, clinical records, payments, or campaigns. |
| BR-009 | Patients is the Source of Truth for identity. |
| BR-010 | Lead conversion does not alter Leads ownership of acquisition. |

## 13. Domain Services and Repository Contracts

Domain Services:

- PatientValidationService
- PatientIdentityService
- DuplicateDetectionService

Critical restriction:

- DuplicateDetectionService may detect possible duplicates but must not auto-merge patients.

Repository Port:

```text
PatientRepository
```

Responsibilities:

- Save a Patient aggregate.
- Retrieve a Patient aggregate by identity.
- Check existence.
- Remain an abstraction over storage.

Repository must not contain business rules, mutate the aggregate, validate invariants, or generate events.

## 14. Architecture Compliance

| Area | Result |
|---|---|
| Hexagonal Architecture | PASS |
| DDD | PASS |
| Sources of Truth | PASS |
| Leads Architecture | PASS |
| Patients Architecture | PASS |
| Persistence Architecture | PASS |
| Governance Platform | PASS |
| Protected Components | PASS |

## 15. Acceptance Criteria

73.0 is accepted when:

- Patients purpose is clear.
- Bounded Context is documented.
- Context Map is approved.
- Sources of Truth are preserved.
- Ubiquitous Language is defined.
- Patient lifecycle is defined.
- Patient aggregate is specified.
- Value Objects are identified.
- Domain Events are defined.
- Business Rules are documented.
- Domain Services are delimited.
- Repository Contract is established.
- Baseline compatibility is verified.

All criteria are satisfied.

## 16. Certification

| Review | Result |
|---|---|
| Architecture Conformance | PASS |
| Baseline Compliance | PASS |
| Governance Validation | PASS |

**73.0 - Patient Domain Discovery & Ubiquitous Language is CLOSED & CERTIFIED.**

## 17. Authorization for 73.1

The next increment is authorized for architecture review and implementation planning:

**73.1 - Patient Core Domain**

Implementation scope:

- Patient aggregate.
- Value Objects.
- Domain Events.
- Domain Services.
- PatientRepository port.
- PatientFactory.

Not authorized in 73.1:

- Persistence adapters.
- API endpoints.
- UI.
- Appointments integration.
- Lead conversion implementation.
- Clinical records.
- Billing.

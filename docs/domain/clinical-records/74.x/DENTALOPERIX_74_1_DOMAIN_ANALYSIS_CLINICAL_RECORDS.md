# DentalOperix Documentation Update Package

**Generated:** 2026-06-25  
**Source package:** DENTALOPERIX_73_X_DOCUMENTATION_AUDITED_UPDATED_PACKAGE.zip  
**Baseline:** DENTALOPERIX_BASELINE_71_5_RELEASE_CANDIDATE  
**Mode:** Documentation, architecture and governance update only. No source-code implementation included.

## 74.1 Domain Analysis - Clinical Records

### Status

Closed.

### Domain Selected

Clinical Records.

### Business Capability

Manage the longitudinal clinical record of a patient during dental care.

### Bounded Context

Clinical Records owns clinical information generated during care.

### Aggregate Root

`ClinicalRecord`

### Entities

- ClinicalEncounter
- ClinicalNote
- Diagnosis
- ClinicalFinding

### Value Object Candidates

- VitalSigns
- PainScale
- BloodPressure
- Temperature
- MedicalAlert
- DiagnosisCode
- ToothReference
- SurfaceReference

### Domain Events

- ClinicalRecordCreated
- ClinicalRecordActivated
- ClinicalEncounterStarted
- ClinicalEncounterCompleted
- ClinicalNoteAdded
- DiagnosisRecorded
- ClinicalFindingRecorded
- ClinicalRecordClosed
- ClinicalRecordArchived

### Domain Ownership Matrix

| Concept | Owner Domain | Reference Allowed | Notes |
|---|---|---|---|
| Lead | Leads | Yes | Lead lifecycle Source of Truth. |
| Patient Identity | Patients | Yes | Identity Source of Truth. |
| PatientId | Patients | Yes | Required reference for Clinical Records. |
| Appointment | Appointments | Yes | Operational Scheduling Source of Truth. |
| AppointmentId | Appointments | Yes | Optional reference. |
| Clinical Record | Clinical Records | No | Aggregate Root. |
| Clinical Encounter | Clinical Records | No | Entity owned by Clinical Records. |
| Clinical Note | Clinical Records | No | Entity owned by Clinical Records. |
| Clinical Finding | Clinical Records | No | Entity owned by Clinical Records. |
| Diagnosis | Clinical Records | No | Entity owned by Clinical Records. |
| Treatment Plan | Future Treatment Plans Domain | Yes | Explicitly outside Clinical Records. |
| Invoice | Future Billing Domain | Yes | Outside current program. |
| Payment | Future Payments Domain | Yes | Outside current program. |

### Governance Result

Clinical Records can be introduced as a new bounded context without invading Leads, Patients, or Appointments.

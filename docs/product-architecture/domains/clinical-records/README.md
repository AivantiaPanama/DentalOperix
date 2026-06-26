# Clinical Records

**Domain Type:** Clinical Information Domain  
**Product:** DentalOperix  
**Baseline:** DENTALOPERIX_BASELINE_71_5_RELEASE_CANDIDATE  
**Current Program:** 75.x  
**Current Work Package:** WP-02 Clinical Notes Foundation

## Why Clinical Records exists

Clinical Records exists to preserve the clinical history generated during patient care.

DentalOperix already manages acquisition, identity and operational scheduling through separate domains. Clinical Records begins where clinical information must be documented, protected, consulted and evolved over time.

This domain protects the longitudinal clinical memory of the patient.

## Who this domain serves

### Direct beneficiaries

- Dentists.
- Clinical specialists.
- Authorized healthcare professionals.

### Indirect beneficiaries

- Patients.
- Clinical assistants.
- Clinic administration.
- Clinical quality and audit processes.

### Future beneficiaries

- Clinical analytics.
- Clinical decision support.
- Future clinical AI capabilities, if formally authorized.

## What Clinical Records owns

Clinical Records owns clinical information only.

Current and future capabilities include:

- Clinical Notes.
- Clinical Assessments.
- Diagnoses.
- Treatment Plans.
- Dental Charts.
- Clinical Evolution.
- Clinical Attachments.
- Prescriptions.

Not all capabilities exist yet. They will be introduced incrementally through certified Work Packages.

## What Clinical Records does not own

Clinical Records does not own:

- Patient identity.
- Leads or acquisition data.
- Appointment scheduling.
- Authentication.
- Users and RBAC.
- Marketing or CRM workflows.

## Domain relationships

Clinical Records collaborates with other domains without taking ownership of their responsibilities.

- **Patients** provides patient identity references.
- **Appointments** may provide operational context.
- **Leads** remains isolated as the Source of Truth for acquisition and lead lifecycle.

Clinical Records must never replace, redefine or mutate patient identity, lead lifecycle or appointment ownership.

## Current state

- Program 74.x: closed and certified.
- WP-01 Clinical Record Foundation: closed and certified.
- WP-02 Clinical Notes Foundation: in controlled development.

## Capability roadmap

1. WP-01 Clinical Record Foundation — Certified.
2. WP-02 Clinical Notes Foundation — Active.
3. WP-03 Clinical Assessment — Candidate.
4. WP-04 Treatment Planning — Candidate.
5. WP-05 Dental Chart — Candidate.
6. WP-06 Clinical Attachments — Candidate.
7. WP-07 Prescriptions — Candidate.

## How to start reading

### If you are a developer

1. Read `CLINICAL_LANGUAGE.md`.
2. Read `CLINICAL_RECORDS_CONSTITUTION.md`.
3. Review the active Work Package dossier.
4. Review the domain implementation under `src/server/clinical-records`.

### If you are an architect

1. Read `CLINICAL_RECORDS_CONSTITUTION.md`.
2. Review certified architecture documents.
3. Review ADR/FDR decisions related to Clinical Records.
4. Review the active Implementation Blueprint.

### If you are a clinical stakeholder

1. Read this README.
2. Review capability descriptions.
3. Review the roadmap and current scope.

## What this domain cannot do yet

Clinical Records does not yet support:

- Structured diagnoses.
- Treatment planning.
- Dental charting.
- Clinical attachments.
- Prescriptions.
- Clinical analytics.
- Clinical AI.

These are future capabilities and must be introduced through separate certified Work Packages.

## Philosophy

Clinical Records is not a generic data storage area.

It exists to preserve the clinical history of a patient with integrity, dignity, confidentiality and traceability. Every future capability must strengthen this purpose without compromising the boundaries of DentalOperix.

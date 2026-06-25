---
document_id: DGR-v1
title: DentalOperix Domain Glossary Registry v1
version: 1.0
status: CURRENT
baseline: DENTALOPERIX_BASELINE_71_5_RELEASE_CANDIDATE
issued_on: 2026-06-25
classification: Domain Glossary Registry
---

# DentalOperix Domain Glossary Registry v1

## Purpose

The Domain Glossary Registry establishes official business terms for DentalOperix domains. Terms in this registry guide documentation, contracts, code names, and governance reviews.

## Registry

| Term | Definition | Owning Domain | Status |
|---|---|---|---|
| Lead | Person registered during the acquisition or commercial lifecycle. | Leads | Approved |
| Patient | Person whose identity is managed by DentalOperix to receive dental care. | Patients | Approved |
| Conversion | Process by which a Lead originates a Patient without replacing the Lead. | Shared Workflow | Approved |
| Patient Identity | Minimum information set used to identify a patient inside the system. | Patients | Approved |
| PatientId | Immutable technical identifier for a Patient aggregate. | Patients | Approved |
| Appointment | Scheduled operational event associated with clinic activity. | Appointments | Approved |
| Clinical Record | Clinical information associated with a Patient. | Clinical Records | Future |
| Emergency Contact | Person designated for emergency communication regarding a Patient. | Patients | Approved |
| Guardian | Legal/responsible person associated with a Patient when business rules require it. | Patients | Approved |
| Archive | Lifecycle transition that removes a Patient from active operation without deleting identity. | Patients | Approved |
| Restore | Lifecycle transition that returns an archived Patient to active operation. | Patients | Approved |
| Source of Truth | Domain that owns a category of information. | Governance | Approved |

## Prohibited Patient Synonyms

The following terms must not be used to represent the Patient aggregate:

- Customer
- Client
- Consumer
- EndUser
- Contact
- Prospect

## Governance Rule

New domain terms must be documented in this registry or an approved increment-specific glossary before they are introduced into code or public contracts.

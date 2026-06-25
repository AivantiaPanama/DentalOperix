---
document_id: BAP-1
title: BAP-1 Architecture Knowledge Base
version: 1.0
status: CLOSED / CERTIFIED
baseline: DENTALOPERIX_BASELINE_71_5_RELEASE_CANDIDATE
framework: DentalOperix Governance Framework (DGF v1.0)
classification: Architecture
issued_on: 2026-06-24
source: ChatGPT governance consolidation session
---

# BAP-1 Architecture Knowledge Base

## Certified Architectures

### Leads

LeadPersistencePort -> LeadPersistenceProvider -> RelationalLeadPersistenceAdapter -> Supabase PostgreSQL

### Patients

PatientPersistencePort -> PatientPersistenceProvider -> RelationalPatientPersistenceAdapter -> Supabase PostgreSQL

### Patient Read

PatientReadService -> PatientReadAdapter -> Patient Persistence Provider -> RelationalPatientPersistenceAdapter -> Supabase PostgreSQL

## Sources of Truth

- Leads = Acquisition / Marketing / Lead Lifecycle
- Patients = Person Identity
- Appointments = Scheduled Operational Events

## Closure State

BAP-1 is marked CLOSED / CERTIFIED based on prior governance approval and its documentation-only nature.

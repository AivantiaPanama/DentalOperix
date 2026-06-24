# DENTALOPERIX 71.3-C — Use Case Traceability Matrix

| Field | Value |
|---|---|
| Document ID | DENTALOPERIX_71_3_USE_CASE_TRACEABILITY_MATRIX |
| Classification | Controlled Record |
| Status | PASSED |
| Baseline | DENTALOPERIX_BASELINE_69_2 |
| Date | 2026-06-24 |

## Traceability Matrix

| Use Case | Domain Object(s) | Application Boundary | Persistence Boundary | Audit Required | RBAC Required | Result |
|---|---|---|---|---:|---:|---:|
| UC-PAT-001 Create Patient | Patient, Contact Points | Patient Application Service | PatientPersistencePort | Yes | Yes | PASS |
| UC-PAT-002 Update Patient Attributes | Patient | Patient Application Service | PatientPersistencePort | Yes for identity-relevant changes | Yes | PASS |
| UC-PAT-003 Add/Update Contact Point | Phone, Email, Address | Patient Application Service | PatientPersistencePort | Yes for primary/contact changes | Yes | PASS |
| UC-PAT-004 Search Patients | Patient Read Model/Search | Patient Application Service | PatientPersistencePort | Optional/read audit by policy | Yes | PASS |
| UC-PAT-005 Archive Patient | Patient Lifecycle | Patient Application Service | PatientPersistencePort | Yes | Yes | PASS |
| UC-PAT-006 Reactivate Patient | Patient Lifecycle | Patient Application Service | PatientPersistencePort | Yes | Yes | PASS |
| UC-PAT-007 Duplicate Review | Patient Identity Review | Patient Application Service | PatientPersistencePort | Yes | Yes | PASS |

## Required Flow

```text
Authorized UI / Workflow
→ Patient Application Service / Use Case
→ PatientPersistencePort
→ PatientPersistenceProvider
→ RelationalPatientPersistenceAdapter
→ Supabase PostgreSQL
```

## Final Result

```text
USE CASE TRACEABILITY: PASSED
```

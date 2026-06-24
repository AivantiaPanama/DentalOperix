# DENTALOPERIX 71.3-B — Domain Compliance Matrix

| Field | Value |
|---|---|
| Document ID | DENTALOPERIX_71_3_DOMAIN_COMPLIANCE_MATRIX |
| Classification | Controlled Record |
| Status | PASSED |
| Baseline | DENTALOPERIX_BASELINE_69_2 |
| Date | 2026-06-24 |

## Compliance Matrix

| Area | 71.2 Scope | Governance Rule | Status |
|---|---|---|---:|
| Patient Identity | In scope | Patients = Person Identity | PASS |
| Demographics | In scope | Patients domain only | PASS |
| Contact Points | In scope | Patients domain only | PASS |
| Identifiers | In scope | Must not create new source of truth | PASS |
| Lifecycle State | In scope | Patient identity preserved | PASS |
| Duplicate Detection | In scope | No automated merge | PASS |
| Manual Duplicate Review | In scope | Manual only, auditable | PASS |
| Manual Merge | Policy only | Future controlled workflow, not implementation | PASS |
| Leads | Out of scope except contextual creation | No Lead Replacement | PASS |
| Appointments | Reference only | Appointments remain scheduled events SoT | PASS |
| Billing / Benefits / Claims | Out of scope | Not Patients domain | PASS |
| Clinical Diagnosis / Treatment | Out of scope | Not authorized in 71.2 | PASS |
| Protected Components | Out of scope | No modification | PASS |
| RBAC | Must comply | No bypass | PASS |
| Persistence | Behind PatientPersistencePort | No re-architecture | PASS |

## Final Result

```text
DOMAIN COMPLIANCE: PASSED
```

# Patient Ownership Matrix

**Program:** DentalOperix 61.3 Patient Management
**Phase:** 61.3-02B Patient Ownership & Legacy Classification
**Baseline:** `DENTALOPERIX_BASELINE_61_3_DISCOVERY_COMPLETE`
**Status:** ADOPTED / OWNERSHIP CLASSIFIED

## 1. Purpose

Define the official ownership boundaries for Patient-related artifacts after the introduction of Patient Foundation 61.3.

This matrix closes observation `H-61.3-02-002` by classifying all Patient-related code areas as either official domain, legacy API, support layer, or read model.

## 2. Official Architectural Authority

```text
src/server/patients/*
```

Classification:

```text
OFFICIAL PATIENT DOMAIN
```

Authority:

```text
Patient Aggregate
Patient Lifecycle
Patient Identity
Patient Contracts
Patient Repository
Identity Resolution
Merge Contracts
Audit Contracts
```

Rule:

```text
Patient Foundation 61.3 is the authoritative Patient domain boundary.
```

## 3. Ownership Matrix

| Artifact Area | Classification | Authority Level | Notes |
|---|---|---|---|
| `src/server/patients/patient-domain.ts` | Official Domain | Authoritative | Patient aggregate and value model |
| `src/server/patients/patient-service.ts` | Official Application Layer | Authoritative | Patient application service boundary |
| `src/server/patients/patient-repository.ts` | Official Contract Layer | Authoritative | Repository contract |
| `src/server/patients/relational-patient-repository.ts` | Official Infrastructure Adapter | Authoritative | Relational persistence adapter |
| `src/server/patients/relational-patients-schema.ts` | Official Schema Mapping | Authoritative | Relational mapping metadata |
| `src/server/patients/patient-identity-resolution.ts` | Official Identity Resolution | Authoritative | Candidate resolution logic |
| `src/server/patients/patient-merge-contract.ts` | Official Merge Contract | Authoritative contract only | Manual merge framework contract |
| `src/server/patients/patient-audit-contract.ts` | Official Audit Contract | Authoritative contract only | Patient audit contract |
| `src/routes/api/patients/*` | Legacy API Layer | Non-authoritative | Existing API surface; must not redefine Patient domain rules |
| `src/lib/patients/*` | Legacy Support Layer | Non-authoritative | Existing support utilities |
| `src/server/read-models/patient-*` | Read Model Layer | Non-authoritative | Query/read projections only |

## 4. Non-Authoritative Components Rule

The following areas must not redefine Patient identity, lifecycle, merge, or repository ownership:

```text
src/routes/api/patients/*
src/lib/patients/*
src/server/read-models/patient-*
```

They may continue to exist as:

```text
Legacy API
Administrative Layer
Read Model
Support Utility
```

until a future approved convergence plan is created.

## 5. Governance Constraints

### Leads

```text
Leads = Source of Truth for acquisition, marketing, and commercial follow-up.
```

Patient does not replace Lead.

### Appointments

```text
Appointments = Source of Truth for scheduled operational events.
```

Patient does not replace Appointment.

### Prohibited Changes

This ownership matrix does not authorize:

```text
Dual Write
Lead Replacement
New Source of Truth
Persistence Re-Architecture
Analytics Write Back
RBAC Bypass
Patient UI
```

## 6. Future Convergence Rule

Any future attempt to migrate legacy Patient API/read-model behavior into Patient Foundation requires:

1. Formal architecture review.
2. Explicit ownership impact analysis.
3. Repository/API compatibility assessment.
4. Governance approval.
5. No changes to protected components without explicit authorization.

## 7. Result

```text
H-61.3-02-002
STATUS: RESOLVED
```

Reason:

```text
Official Patient ownership has been established.
Legacy and read-model components have been classified as non-authoritative.
```

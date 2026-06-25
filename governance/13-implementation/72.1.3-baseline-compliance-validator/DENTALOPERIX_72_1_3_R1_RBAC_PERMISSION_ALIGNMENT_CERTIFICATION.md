---
document_id: DOX-72.1.3-R1-CERT
title: 72.1.3-R1 RBAC Permission Catalog Alignment Certification
version: 1.0
status: CLOSED & CERTIFIED
baseline: DENTALOPERIX_BASELINE_71_5_RELEASE_CANDIDATE
issued_on: 2026-06-25
classification: Remediation Certification
---

# 72.1.3-R1 - RBAC Permission Catalog Alignment Certification

## Trigger

During validation of 72.1.3-I1, `npx tsc --noEmit` identified two TypeScript errors in Patients API routes because both routes used a permission literal not present in the RBAC permission catalog:

- `src/routes/api/patients/create.ts`
- `src/routes/api/patients/update.ts`

## Root Cause

`requirePermission` accepts the typed `Permission` union sourced from `src/lib/rbac/permissions.ts`. The RBAC catalog includes Patients permissions such as:

- `patients:read`
- `patients:selfRead`
- `patients:update`
- `patients:adminUpdate`
- `patients:verifyProfile`

The catalog does not include `patients:write`.

## Authorized Remediation

The remediation aligned the Patients API consumers with the certified RBAC catalog by replacing:

```ts
requirePermission(request, "patients:write");
```

with:

```ts
requirePermission(request, "patients:update");
```

Affected routes:

- `src/routes/api/patients/create.ts`
- `src/routes/api/patients/update.ts`

Affected tests updated to match the certified permission contract:

- `src/routes/api/patients/create.test.ts`
- `src/routes/api/patients/update.test.ts`

## Governance Constraints

The remediation did not add a new RBAC permission, did not change the RBAC catalog, and did not modify Patients persistence, domain logic, or Source of Truth.

## Validation Evidence

Project-owner local evidence after remediation:

- `npx tsc --noEmit`: PASS
- `npm run build`: PASS
- `npm run test`: 135 Test Files PASS / 583 Tests PASS

## Governance Determination

72.1.3-R1 is CLOSED & CERTIFIED.

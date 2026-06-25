---
document_id: EVD-72.1.1-SDK-CORE
program: 72.1 Governance Platform Implementation
increment: 72.1.1 Governance SDK Core
baseline: DENTALOPERIX_BASELINE_71_5_RELEASE_CANDIDATE
status: IMPLEMENTED / PENDING ENVIRONMENT TEST EXECUTION
classification: Governance Implementation Evidence
issued_on: 2026-06-24
---

# 72.1.1 Governance SDK Core Execution Evidence

## Scope

This evidence records implementation of the Governance SDK Core as a transversal Governance Platform component. The implementation does not modify certified functional runtime domains or protected components.

## Implemented Artifacts

- `src/governance/sdk/contracts/governance-contracts.ts`
- `src/governance/sdk/models/governance-models.ts`
- `src/governance/sdk/registry/validator-registry.ts`
- `src/governance/sdk/reporting/report-builder.ts`
- `src/governance/sdk/evidence/static-evidence-provider.ts`
- `src/governance/sdk/version/governance-version.ts`
- `src/governance/sdk/index.ts`
- `src/governance/sdk/__tests__/governance-sdk-core.test.ts`
- `src/governance/sdk/__tests__/governance-sdk-boundary.test.ts`

## Governance Capabilities Covered

| Capability | Artifact |
|---|---|
| Public contracts | `contracts/governance-contracts.ts` |
| Canonical models | `models/governance-models.ts` |
| Validator registry | `registry/validator-registry.ts` |
| Report generation | `reporting/report-builder.ts` |
| Evidence collection | `evidence/static-evidence-provider.ts` |
| Version policy | `version/governance-version.ts` |
| SDK export surface | `index.ts` |
| Contract and boundary tests | `__tests__/*.test.ts` |

## Boundary Declaration

The SDK Core is implemented under `src/governance/sdk` and remains isolated from:

- Leads runtime.
- Patients runtime.
- Calendar runtime.
- Gmail runtime.
- Booking UI runtime.
- Site services runtime.

## Protected Components

No changes were intentionally made to the protected components listed by the project governance rules:

- BookingDialog
- processDentalLead
- /api/leads/create
- Calendar
- Gmail
- FloatingDentalAIChat
- Home
- siteServices.ts

## Execution Command

```bash
npm run test:governance-sdk
```

## Current Execution Status

The package received for this implementation did not include `node_modules`. The test suite has been added as executable Vitest tests and the package script has been registered. Full runtime execution requires dependency installation in the target development environment.

## Governance Determination

72.1.1 Governance SDK Core is implemented as an isolated, transversal Governance Platform foundation compatible with DGF, GPS, GPRA, and the baseline `DENTALOPERIX_BASELINE_71_5_RELEASE_CANDIDATE`.

## Local Validation Attempt

A local test execution attempt was performed in the received package workspace:

```bash
npm run test:governance-sdk
```

Result:

```text
sh: 1: vitest: not found
```

Interpretation: the uploaded package does not contain installed dependencies (`node_modules`). The executable tests and package script are present; execution must be repeated after dependency installation in the development environment.

## Static Boundary Check

A static source scan was performed against `src/governance/sdk` excluding test files for protected runtime terms. No protected runtime references were found in SDK source files.

# 72.1.3-I4 Manifest Validation & Compatibility Engine - Implementation Notes

## Scope

This increment adds `src/governance/manifest-validation` as a read-only governance platform module for validating `GovernanceManifest` artifacts before Rule Registry adaptation.

## Baseline

- Active baseline: `DENTALOPERIX_BASELINE_71_5_RELEASE_CANDIDATE`
- Program: `72.1 Governance Platform Implementation`
- Increment: `72.1.3-I4 Manifest Validation & Compatibility Engine`

## Implemented Contracts

- `ManifestValidationIssue`
- `ManifestValidationReport`
- `ManifestCompatibilityStatus`
- `ManifestValidationEngine`
- `ManifestCompatibilityRule`

## Architectural Safeguards

The implementation is constrained to governance manifest validation and compatibility checks.

It does not:

- mutate manifests;
- execute governance rules;
- write to filesystem;
- introduce persistence;
- alter Rule Registry contracts;
- alter Governance Validation Engine behavior;
- alter functional DentalOperix domains;
- modify protected components.

## Validation Coverage

The default rule set validates:

- required manifest structure;
- supported manifest schema version;
- supported baseline version;
- baseline declaration in the compatibility matrix;
- read-only validation profile;
- required governance capability declarations;
- required rule fields;
- duplicate rule identifiers;
- allowed rule lifecycle states;
- dependency references within the manifest.

## User-Owned Validation Evidence

Per DentalOperix testing policy, local validation remains user-owned. The project owner should execute:

```text
npx tsc --noEmit
npm run build
npm run test
```

Evidence should be submitted for Architecture Conformance Review, Baseline Compliance Review, Governance Validation, Governance Retrospective, and certification of 72.1.3-I4.

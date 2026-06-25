---
document_id: DOX-72.1.3-I2-ARCH
title: 72.1.3-I2 Rule Registry Infrastructure Architecture Review
version: 1.0
status: IMPLEMENTATION AUTHORIZED - NOT YET IMPLEMENTED
baseline: DENTALOPERIX_BASELINE_71_5_RELEASE_CANDIDATE
issued_on: 2026-06-25
classification: Architecture Review
---

# 72.1.3-I2 - Rule Registry Infrastructure Architecture Review

## Objective

Implement governance rule registry infrastructure that can register and query governance rule metadata without modifying the Governance Validation Engine.

## Approved Scope

Target module:

`src/governance/rule-registry`

Approved structure:

```text
src/governance/rule-registry/
├── domain/
│   ├── RuleDefinition.ts
│   ├── RuleCategory.ts
│   └── RuleVersion.ts
├── ports/
│   └── RuleRegistryPort.ts
├── application/
│   ├── RegisterRuleUseCase.ts
│   ├── FindRuleByIdUseCase.ts
│   └── ListRulesUseCase.ts
├── infrastructure/
│   └── InMemoryRuleRegistry.ts
└── catalog/
    └── CertifiedRuleCatalog.ts
```

## Approved Responsibilities

- Define rule metadata model.
- Provide a registry port.
- Provide application use cases that depend only on the port.
- Provide a replaceable in-memory registry implementation.
- Prepare a certified rule catalog for future manifest consumption.

## Explicit Exclusions

I2 does not include:

- Persistence.
- Manifest loading.
- Baseline loading.
- Validation Engine integration.
- Report generation.
- Functional domain integration.

## Compatibility Determination

The package is compatible with DGF, GPS, GPRA, GARB, GCMM, and `DENTALOPERIX_BASELINE_71_5_RELEASE_CANDIDATE`, provided implementation remains isolated and does not modify protected functional components.

## Status

72.1.3-I2 is authorized for implementation, but no I2 source implementation is certified yet in this package.

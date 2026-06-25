# DentalOperix 72.1.3-I2 - Rule Registry Infrastructure Notes

## Purpose

This module provides a registry for certified governance rule metadata. It does not execute rules and does not invoke the Governance Validation Engine.

## Module Boundaries

The module remains isolated under `src/governance/rule-registry`.

Allowed dependencies:

- Baseline domain value objects and enums from 72.1.3-I1.
- TypeScript standard runtime.

Disallowed dependencies:

- Functional runtime modules.
- Persistence adapters.
- UI components.
- Calendar/Gmail/Booking/Lead/Patient runtime flows.

## Extensibility

`RuleRegistryPort` allows future adapters such as:

- ManifestRuleRegistry
- FileRuleRegistry
- PersistentRuleRegistry

without changing application use cases.

## Certified Catalog

`CERTIFIED_RULE_CATALOG` is an initial static catalog for governance rule metadata. It is intentionally separate from the validator execution engine.

# ADR-016: Domain Boundaries

## Status

CERTIFIED

## Context

The read architecture separates analytical consumption across bounded domains.

## Decision

The certified domain boundaries are:

- Clinical
- Operations
- Finance
- Inventory
- Support
- Executive

Each domain exposes governed read contracts only.

## Consequences

- Cross-domain coupling must be avoided.
- Domain-specific read contracts must remain explicit.
- Executive consumption must aggregate through governed contracts rather than direct internal coupling.

## Governance

This ADR preserves the multi-domain read architecture certified in the enterprise analytics and dashboard programs.

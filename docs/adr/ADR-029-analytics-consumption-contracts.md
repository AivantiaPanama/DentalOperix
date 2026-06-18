# ADR-029: Analytics Consumption Contracts

## Status

CERTIFIED

## Context

Analytics and dashboard layers must consume data through explicit, stable contracts.

## Decision

All analytical consumption must use governed consumption contracts.

Direct coupling to internal infrastructure or implementation details is prohibited.

## Consequences

- Consumers must not directly depend on persistence implementation details.
- Contracts must be versionable and auditable.
- Read model and dashboard consumers remain decoupled from operational persistence changes.

## Governance

This ADR protects the future Leads persistence transition from leaking into analytics and dashboard consumers.

# ADR-025: Projection Engine Deferral

## Status

CERTIFIED

## Context

The current certified read architecture already supports observability, executive dashboards and KPI consumption.

## Decision

Projection Engine adoption is deferred.

No Projection Engine, event projection layer or event-sourcing derivative may be introduced as part of the current persistence transition.

## Consequences

- 57.x remains a persistence transition only.
- No additional projection infrastructure is authorized.
- Existing read-model governance remains closed and frozen.

## Governance

This ADR reinforces the permanent restriction: No Projection Engine.

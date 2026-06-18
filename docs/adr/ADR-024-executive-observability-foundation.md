# ADR-024: Executive Observability Foundation

## Status

Accepted

## Context

Read Model Platform v2 is closed and frozen with validated Patient, CRM, Billing, Clinical, Operations, Finance, Inventory, and Support domains. The platform already emits read, fallback, aggregate, and domain telemetry through `ReadObservabilityProvider`.

Executive observability is required to convert technical telemetry into platform, domain, aggregate, and governance metrics without creating a new business domain or coupling existing aggregates.

## Decision

Introduce `ExecutiveObservabilityProvider` as an infrastructure-only layer that consumes buffered telemetry events from `ReadObservabilityProvider` and derives executive metrics.

The provider may consume only:

- `ReadTelemetryEvent`
- `FallbackTelemetryEvent`
- `AggregateTelemetryEvent`
- `DomainTelemetryEvent`

The provider must not consume:

- domain aggregates
- read adapters
- read models
- operational source-of-truth data

## Metric Contracts

The foundation defines:

- `PlatformHealthMetric`
- `DomainHealthMetric`
- `AggregateHealthMetric`
- `GovernanceHealthMetric`

Dashboard-facing contracts are limited to derived metrics and must not expose telemetry payloads, diagnostics, patient data, CRM data, finance data, inventory data, support data, or other functional domain records.

## Consequences

Executive observability remains an infrastructure layer, not a ninth read domain. It reuses existing telemetry and preserves aggregate isolation, domain ownership, fallback governance, and the Read Model Platform v2 freeze.

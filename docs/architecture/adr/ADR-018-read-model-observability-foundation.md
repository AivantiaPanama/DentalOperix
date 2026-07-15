# ADR-018 — Read Model Observability Foundation

## Status

Accepted

## Context

DentalOperix now has governed read domains for Patient, CRM, and Billing. Each domain is read-only and falls back to Leads when read models are unavailable or fail.

The remaining platform gap is operational observability: fallback usage, aggregate health, domain read source utilization, and telemetry consistency.

## Decision

Introduce `ReadObservabilityProvider` as the single observability facade for Read Model telemetry.

The provider records four event families:

- `ReadTelemetryEvent`
- `FallbackTelemetryEvent`
- `AggregateTelemetryEvent`
- `DomainTelemetryEvent`

Telemetry is best effort. A telemetry sink failure must never fail a read request.

## Rules

1. Read telemetry must not change public API contracts.
2. Telemetry must remain internal.
3. Adapters and aggregates should not emit ad-hoc logs for read governance.
4. Fallback events must identify the domain and reason.
5. Leads remains the source of truth.
6. Read Models remain a read layer only.

## Consequences

The platform can measure read model utilization and fallback health without introducing dual write, persistence changes, or cross-domain coupling.

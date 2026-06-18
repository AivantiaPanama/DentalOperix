# Read Model Observability Standard

## Purpose

Define the observability baseline for DentalOperix Read Models across Patient, CRM, and Billing domains.

## Event families

### ReadTelemetryEvent
Tracks read source utilization by domain, aggregate, source, and record count.

### FallbackTelemetryEvent
Tracks fallback usage and reason when read models are unavailable or fail.

### AggregateTelemetryEvent
Tracks aggregate execution health and diagnostic summary.

### DomainTelemetryEvent
Tracks domain-level health and source.

## Provider

All observability must go through:

```text
ReadObservabilityProvider
```

The provider is best effort and must not throw into read flows.

## Instrumented domains

```text
Patient
CRM
Billing
```

## Instrumentation point

Initial foundation instrumentation is centralized in:

```text
ReadModelSourceProvider
```

This keeps public contracts stable and avoids coupling adapters directly to telemetry infrastructure.

## Contract policy

Telemetry must not appear in:

```text
GET /api/patients/list
GET /api/patients/:id
```

or any other public API payload.

## Fallback policy

Fallback telemetry must identify:

```text
domain
aggregate
reason
consumerName
```

Supported reasons:

```text
read-model-unavailable
read-model-error
```

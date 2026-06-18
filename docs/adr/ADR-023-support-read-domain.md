# ADR-023 — Support Read Domain

## Status

Accepted

## Context

Read Model Platform v2 selected Support as the next expansion domain after Inventory. Support provides operational visibility for support cases, tickets, resolution metrics, and satisfaction metrics. Workflow execution, survey processing, and escalation automation are transactional or runtime concerns and remain outside the first read-domain pilot.

## Decision

Introduce an isolated Support read domain with:

- `SupportAggregateReadService`
- `SupportCaseReadAdapter`
- `SupportTicketReadAdapter`
- `ResolutionMetricReadAdapter`
- `SatisfactionMetricReadAdapter`

Support v1 is read-only and owns only:

- SupportCases
- SupportTickets
- ResolutionMetrics
- SatisfactionMetrics

## Boundaries

Support must not import or depend on Patient, CRM, Billing, Clinical, Operations, Finance, or Inventory aggregate services.

Support v1 must not include:

- SurveyProcessing
- TicketWorkflowExecution
- EscalationAutomation

## Fallback

Support follows the platform fallback standard:

```text
Read Model
↓
Support Projection
↓
Error
```

## Observability

Support must emit standard read-platform telemetry through `ReadObservabilityProvider`:

- ReadTelemetryEvent
- FallbackTelemetryEvent
- AggregateTelemetryEvent
- DomainTelemetryEvent

The telemetry domain is `Support`.

## Consequences

Support can participate in the read platform without becoming a ticketing workflow engine. Future survey processing, workflow execution, or escalation automation require separate qualification and must not be added to Support v1 without a new ADR.

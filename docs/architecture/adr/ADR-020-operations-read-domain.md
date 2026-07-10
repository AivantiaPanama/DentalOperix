# ADR-020 — Operations Read Domain

## Decision

Create Operations as an independent read domain with its own aggregate and read adapters.

## Context

The platform already contains Patient, CRM, Billing, and Clinical read domains. Operations was qualified in 16.2-B and designed in 16.2-C as a read-heavy domain for automation and operational status visibility.

## Scope

Operations owns:

- AutomationRuns
- OperationalKPIs
- WorkflowExecutionStatus

Operations does not own:

- Patient records
- CRM records
- Billing records
- Clinical records
- Runtime command execution
- Task queues

## Consequences

Operations can be consumed through ReadModelSourceProvider without coupling runtime execution to the read platform. Operations must comply with existing governance, fallback, and observability standards.

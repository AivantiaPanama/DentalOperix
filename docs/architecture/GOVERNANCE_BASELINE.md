# Governance Baseline

## Permanent Restrictions

Do Not Modify:

* BookingDialog
* processDentalLead
* /api/leads/create
* Calendar
* Gmail
* FloatingDentalAIChat
* Home
* siteServices.ts

---

## Forbidden Changes

* dual write
* product migration
* lead replacement
* new source of truth

---

## Source of Truth

Leads = Source of Truth

---

## ADR Baseline

ADR-015 Read Model Governance

ADR-016 Domain Boundaries

ADR-017 Fallback Policy

ADR-018 Observability Foundation

ADR-019 Clinical Domain

ADR-020 Operations Domain

ADR-021 Finance Domain

ADR-022 Inventory Domain

ADR-023 Support Domain

ADR-024 Executive Observability

---

## Dashboard Rules

Dashboard may only consume:

* ExecutiveDashboardApiContracts

Dashboard may never access:

* Aggregates
* Adapters
* Read Sources
* Raw Telemetry

---

## Observability Rules

Allowed:

* PlatformHealthMetric
* DomainHealthMetric
* AggregateHealthMetric
* GovernanceHealthMetric

Forbidden:

* ReadTelemetryEvent
* AggregateTelemetryEvent
* DomainTelemetryEvent
* FallbackTelemetryEvent

---

## Architectural Principles

Aggregate Isolation

Domain Ownership

Read Model Governance

Metric-Only Dashboard

Read-Only Dashboard

Permission-Gated Access


ADR-025 Projection Engine Deferral

STATUS:
APPROVED

ADR-026 Persistent Read Database Strategy

STATUS:
APPROVED

ADR-027 Enterprise Analytics Architecture

STATUS:
APPROVED

ADR-028 KPI Governance Architecture

STATUS:
APPROVED

ADR-029 Analytics Consumption Contracts

STATUS:
APPROVED
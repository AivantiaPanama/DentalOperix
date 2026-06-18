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

```txt
Leads = Source of Truth
```

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

---

## Enterprise Analytics Governance

### KPI Governance Principles

All KPIs must have:

* KPI ID
* Domain
* Owner
* Definition
* Formula
* Version
* Certification Status
* Freshness Status

---

### KPI Lifecycle

Allowed States:

* DRAFT
* REVIEW
* CERTIFIED
* DEPRECATED
* RETIRED

Forbidden:

* DRAFT → Dashboard Consumption

---

### KPI Versioning

Minor Changes:

* Documentation
* Description

Version Example:

```txt
v1.0 → v1.1
```

Major Changes:

* Formula
* Definition

Version Example:

```txt
v1.0 → v2.0
```

---

### Dashboard Consumption Rules

Dashboards may consume only:

* CERTIFIED KPIs
* CURRENT KPIs

Dashboards may never:

* Calculate KPIs locally
* Redefine KPI formulas
* Consume DRAFT KPIs
* Consume REVIEW KPIs
* Consume STALE KPIs
* Consume EXPIRED KPIs

---

## Analytics Consumption Contracts

### Consumption Rule

Consumers consume KPIs.

Consumers do not calculate KPIs.

---

### Allowed Consumers

* Executive Dashboard
* Operational Dashboard
* Governance Dashboard
* Enterprise Reporting
* Historical Analytics
* AI Analytics

---

### Contract Rules

All consumption must be:

* Contract-Based
* Certified
* Versioned
* Governed

---

## Persistent Read Database Governance

### PRD-GR-001

PRD is Read Only

---

### PRD-GR-002

Lead Sovereignty

Leads remain Source of Truth.

---

### PRD-GR-003

No Reverse Flow

Allowed:

```txt
Leads
↓
PRD
```

Forbidden:

```txt
PRD
↓
Leads
```

---

### PRD-GR-004

Certification First

Only CERTIFIED datasets may enter PRD.

---

### PRD-GR-005

Freshness Visibility

All datasets must expose:

* CURRENT
* STALE
* EXPIRED

---

### PRD-GR-006

Immutable Snapshots

Historical snapshots are:

* Append Only
* Immutable

---

### PRD-GR-007

Contract-Based Consumption

Consumers access PRD through certified contracts only.

---

### PRD-GR-008

KPI Registry Authority

KPIs stored in PRD must originate from:

```txt
KPI Registry
```

---

### PRD-GR-009

Patient Master Governance

PATIENT_MASTER is:

```txt
Certified Read Model
```

PATIENT_MASTER is NOT:

```txt
Source of Truth
```

Source of Truth remains:

```txt
Leads
```

---

### PRD-GR-010

Identity Resolution Priority

Official Patient Identity Resolution Order:

```txt
CID
↓
PASSPORT
↓
FOREIGN_ID
↓
TMP-PAT
```

---

## Governance Compliance Matrix

### Must Always Remain True

```txt
Leads = Source of Truth
```

```txt
READ MODEL PLATFORM v2 = CLOSED
```

```txt
READ MODEL PLATFORM v2 = FROZEN
```

```txt
READ MODEL PLATFORM v2 = GOVERNANCE BASELINED
```

---

### Never Allowed

* Dual Write
* Product Migration
* Lead Replacement
* New Source of Truth
* Reverse Flow from PRD to Leads
* Dashboard KPI Calculation
* Dashboard Direct Access to Read Sources

---

## Current Governance Status

```txt
Dashboard Program:
BASELINED
```

```txt
Executive Observability:
CERTIFIED
```

```txt
Read Database Strategy:
APPROVED
```

```txt
Enterprise Analytics Architecture:
APPROVED
```

```txt
KPI Governance Architecture:
APPROVED
```

```txt
Persistent Read Database Architecture:
IN PROGRESS
```

---

## 53.3 / 53.4 PRD Governance Addendum

### Historical Persistence Governance

```txt
PATIENT_MASTER_SNAPSHOT = Certified Historical Read Model
```

Rules:

* Historical snapshots are immutable.
* Historical snapshots are append-only.
* Historical snapshots are read-only analytical artifacts.
* Historical snapshots cannot modify Leads.
* Historical snapshots cannot become a Source of Truth.

### Certification & Freshness Governance

Certified PRD consumers may rely only on datasets with explicit certification and freshness metadata.

Required metadata:

```txt
model_name
certification_status
certification_version
generated_at
certified_at
freshness_status
source_timestamp
```

Executive KPI consumption is prohibited for:

```txt
UNKNOWN
STALE
EXPIRED
```

unless an approved consumption contract explicitly permits degraded display with visible warnings.

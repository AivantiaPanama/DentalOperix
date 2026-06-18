# DentalOperix Dashboard Program Master Plan

## Purpose

This document is the official architectural memory and roadmap for the DentalOperix Dashboard Program.

Its purpose is to:

* preserve project context
* guide future implementation
* align developers, AI agents and stakeholders
* provide a single source of architectural direction

---

# Strategic Vision

DentalOperix requires an executive visibility layer capable of exposing operational, governance and platform health information without exposing internal implementation details.

The Dashboard Program exists to provide:

* Executive Dashboard
* Operational Dashboard
* Governance Dashboard

while preserving:

* Aggregate Isolation
* Domain Ownership
* Read Model Governance
* Executive Observability Governance

---

# Source of Truth

Permanent Rule:

```txt id="5dph1u"
Leads = Source of Truth
```

No implementation may introduce:

* dual write
* lead replacement
* new source of truth
* product migration

---

# Read Model Platform

Status:

```txt id="qtjbgs"
READ MODEL PLATFORM v2

CLOSED
FROZEN
GOVERNANCE BASELINED
```

Architecture:

```txt id="y8l4iw"
ReadModelSourceProvider
↓
Read Sources
↓
Read Adapters
↓
Read Models
↓
Fallback
↓
Executive Observability
↓
Dashboard
```

---

# Executive Observability

Implemented:

* ExecutiveObservabilityProvider

Metrics:

* PlatformHealthMetric
* DomainHealthMetric
* AggregateHealthMetric
* GovernanceHealthMetric

Contracts:

* ExecutiveDashboardContracts
* ExecutiveDashboardApiContracts

Rules:

* metric-only
* no aggregate exposure
* no adapter exposure
* no raw telemetry exposure

---

# Dashboard Program Progress

Completed:

```txt id="n0i1kh"
17.3 UI Readiness

17.4 UI Foundation

17.5 UI Implementation

17.6 Activation Pack

17.7 Admin Route Integration

17.8–18.0 Production Readiness

18.1–18.3 Controlled Activation

18.4–18.6 Runtime Consumption

18.7–18.9 Runtime Wiring

19.0–19.2 Release Candidate

19.3–19.5 Final Governance Closure
```

Result:

```txt id="xxyy8n"
Dashboard Program

COMPLETED

GOVERNANCE CERTIFIED
```

---

# Relational Data Architecture Program

Status:

```txt id="y6mkqg"
COMPLETED
CERTIFIED
```

Program Scope:

```txt id="evmhd6"
20.x–49.x
```

Objectives:

* Relational Domain Modeling
* Identity Resolution
* Patient Registry Design
* Google Sheets Simulation Layer
* Governance Validation
* Relational Certification

Result:

```txt id="13l3se"
RELATIONAL ARCHITECTURE

CERTIFIED
```

---

# Projection Engine Feasibility Study

Program:

```txt id="yv6wqs"
50.x
```

Status:

```txt id="o77w8z"
COMPLETED
```

Decision:

```txt id="80u3yw"
NOT RECOMMENDED
```

Reason:

```txt id="hb4nqt"
Value not sufficient
to justify complexity.
```

---

# Real Read Database Feasibility Study

Program:

```txt id="6j09tw"
51.x
```

Status:

```txt id="w0d6uz"
COMPLETED
```

Decision:

```txt id="0kqz3r"
RECOMMENDED
```

Rationale:

* Historical Analytics
* Enterprise Reporting
* Cross-Domain Analytics
* Audit Reconstruction

---

# Enterprise Analytics & KPI Architecture

Program:

```txt id="k5qxgn"
52.x
```

Status:

```txt id="jlwm5j"
COMPLETED
APPROVED
CERTIFIED
```

Deliverables:

* Analytics Domain Model
* Enterprise KPI Catalog
* KPI Governance Architecture
* Analytics Consumption Contracts

Analytics Domains:

* Executive Analytics
* Patient Analytics
* Operations Analytics
* Finance Analytics
* Governance Analytics
* Enterprise Analytics

Result:

```txt id="zhy8od"
Enterprise Analytics Architecture

APPROVED
```

---

# Persistent Read Database Architecture

Program:

```txt id="fq7j9v"
53.x
```

Status:

```txt id="m89jxp"
IN PROGRESS
```

Completed:

```txt id="9ksvko"
53.1 Logical Architecture

53.2 Domain Storage Model

53.3 Historical Persistence Model

53.4 Certification & Freshness Architecture
```

Next:

```txt id="h6c17p"
53.5 Security & Access Architecture

53.6 Executive Architecture Decision
```

---

# Persistent Read Database Principles

## PRD Role

```txt id="6x9hhf"
Certified Read Store
```

Supports:

* Analytics
* Reporting
* Historical Analysis
* KPI Consumption

---

## PRD Restrictions

```txt id="n0cwz6"
Read Only
```

```txt id="2e8zkk"
No Reverse Flow
```

```txt id="r4d9m5"
Certification First
```

```txt id="u6jz5u"
Immutable Snapshots
```

---

## Patient Registry Strategy

Core Decision:

```txt id="w6o7wn"
PATIENT_MASTER
```

Classification:

```txt id="n4lnow"
Certified Read Model
```

Role:

```txt id="v3a4jq"
Unified Patient Identity Registry
```

Not:

```txt id="xtixba"
Source of Truth
```

Source of Truth remains:

```txt id="n0g1y5"
Leads
```

---

## Identity Resolution Priority

Official Order:

```txt id="79nnyh"
CID
↓
PASSPORT
↓
FOREIGN_ID
↓
TMP-PAT
```

---

# Current Architecture Status

Dashboard Program:

```txt id="kq9gdr"
COMPLETE
```

Executive Observability:

```txt id="0pcwvv"
CERTIFIED
```

Relational Architecture:

```txt id="6aqdu8"
CERTIFIED
```

Projection Engine:

```txt id="6z8zd8"
NOT RECOMMENDED
```

Read Database Strategy:

```txt id="ezv6zd"
RECOMMENDED
```

Enterprise Analytics:

```txt id="gfjlwm"
APPROVED
```

Persistent Read Database:

```txt id="ys5z1n"
IN PROGRESS
```

---

# Current Phase

```txt id="3a1c3j"
53.5 Security & Access Architecture
```

---

# Long-Term Goal

Provide executive visibility for:

* Patients
* CRM
* Billing
* Clinical
* Operations
* Finance
* Inventory
* Support

while preserving:

* Aggregate Isolation
* Domain Ownership
* Read Model Governance
* Executive Observability Governance
* KPI Governance
* Analytics Governance
* Lead Sovereignty

without exposing implementation internals.

---

# Architectural North Star

```txt id="q7s5wi"
Leads
↓
Certified Read Models
↓
Persistent Read Database
↓
Analytics
↓
Executive Visibility
```

while maintaining:

```txt id="g7l1tp"
Leads = Source of Truth
```

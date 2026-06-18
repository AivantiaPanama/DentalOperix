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

Leads = Source of Truth

No implementation may introduce:

* dual write
* lead replacement
* new source of truth
* product migration

---

# Read Model Platform

Status:

READ MODEL PLATFORM v2

* CLOSED
* FROZEN
* GOVERNANCE BASELINED

Architecture:

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

---

# Current State

Dashboard Program Status:

Governance Complete

Next Major Program:

20.x Relational Data Architecture

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

without exposing implementation internals.

# Relational Data Roadmap

## Purpose

Define the future relational data architecture for DentalOperix.

This document does not authorize migration.

This document does not authorize replacement of existing systems.

This document defines:

* Target Relational Architecture
* Relational Governance
* Identity Resolution Strategy
* Persistent Read Database Direction
* Historical Analytics Direction

---

# Architectural Status

Current Source of Truth:

```txt id="gjv31m"
Leads
```

Permanent Rule:

```txt id="n5f8px"
Leads = Source of Truth
```

Current Read Model Platform:

```txt id="fxr6hy"
READ MODEL PLATFORM v2

CLOSED
FROZEN
GOVERNANCE BASELINED
```

---

# Identity Rules

## Patient Identity Priority

Official identity resolution order:

```txt id="p4z8tw"
CID
↓
PASSPORT
↓
FOREIGN_ID
↓
TMP-PAT
```

---

## Identity Governance

Identity resolution is deterministic.

Higher priority identifiers always win.

---

# Panama Requirements

Required support:

* CID
* RUC
* DV
* Business Name
* Fiscal Address

Rule:

```txt id="q7w2mu"
RUC/DV
does not replace
patient identity.
```

---

# Relational Architecture Program

Program:

```txt id="s3v5tn"
20.x–49.x
```

Status:

```txt id="y6m1pk"
COMPLETED
CERTIFIED
```

Result:

```txt id="x2v8re"
RELATIONAL ARCHITECTURE CERTIFIED
```

---

# Core Relational Domains

## Patient Domain

Core entities:

```txt id="c8n4jk"
Patient

PatientIdentity

PatientContact

PatientFiscalProfile
```

---

## Operations Domain

Core entities:

```txt id="q4v7wh"
Lead

OperationalCase

Appointment

FollowUp

TreatmentInterest
```

---

## Finance Domain

Core entities:

```txt id="r9m2xc"
BillingAccount

Invoice

InvoiceLine

Payment

Collection
```

---

## Governance Domain

Core entities:

```txt id="n7v5kt"
Certification

Freshness

Validation

AuditEvent
```

---

## Analytics Domain

Core entities:

```txt id="k5p8zu"
DashboardMetric

EnterpriseKPI

ExecutiveScorecard
```

---

# Proposed Relationships

```txt id="m4w2ce"
Patient
→ Operational Cases

Patient
→ Appointments

Patient
→ FollowUps

Patient
→ Treatments

Patient
→ Billing Accounts

Billing Account
→ Invoices

Invoice
→ Payments

Lead
→ Patient

DashboardMetric
→ Executive Observability
```

---

# Google Sheet Simulation Strategy

Status:

```txt id="g2m9yr"
COMPLETED
```

Purpose:

```txt id="r6v4qt"
Relational Simulation Layer
```

Google Sheets are:

* Projection Layer
* Read Model Validation Layer
* Relational Simulation Layer

Google Sheets are NOT:

* Source of Truth
* Production Database

---

## Simulated Tables

```txt id="u3m8px"
patients

patient_identities

leads

appointments

treatments

clinical_records

invoices

payments

inventory_items

support_tickets

audit_events

dashboard_metrics
```

---

# Projection Engine Study

Program:

```txt id="f7v1mn"
50.x
```

Status:

```txt id="h8m4tr"
COMPLETED
```

Decision:

```txt id="v9p2qw"
NOT RECOMMENDED
```

---

# Persistent Read Database Study

Program:

```txt id="w6m8pk"
51.x
```

Status:

```txt id="n4v7rx"
COMPLETED
```

Decision:

```txt id="k1m5zt"
RECOMMENDED
```

Reason:

* Historical Analytics
* Enterprise Reporting
* Cross-Domain Analytics
* Audit Reconstruction

---

# Enterprise Analytics Architecture

Program:

```txt id="t8m3vw"
52.x
```

Status:

```txt id="r5v1qn"
APPROVED
CERTIFIED
```

Deliverables:

* Analytics Domains
* KPI Catalog
* KPI Governance
* Consumption Contracts

---

# Persistent Read Database Architecture

Program:

```txt id="d7m9xp"
53.x
```

Status:

```txt id="q2v5kt"
IN PROGRESS
```

---

## Completed

### 53.1 Logical Architecture

Status:

```txt id="y8m2wr"
COMPLETED
```

---

### 53.2 Domain Storage Model

Status:

```txt id="j4v7ps"
COMPLETED
```

---

## Current Phase

### 53.3 Historical Persistence Model

Status:

```txt id="v1m8qy"
ACTIVE
```

---

## Pending

```txt id="n6v4tr"
53.4 Certification & Freshness Architecture

53.5 Security & Access Architecture

53.6 Executive Architecture Decision
```

---

# Persistent Read Database Direction

## Role

```txt id="k7m3pw"
Certified Read Store
```

Supports:

* Analytics
* Reporting
* Historical Analysis
* KPI Consumption

---

## Restrictions

```txt id="q5v8ny"
Read Only
```

```txt id="m2r4wx"
No Reverse Flow
```

```txt id="t9v1qe"
Certification First
```

```txt id="z4m7pk"
Immutable Snapshots
```

---

# PATIENT_MASTER Strategy

Status:

```txt id="f3v8tr"
APPROVED
```

Role:

```txt id="h6m1qx"
Core Identity Registry
```

Classification:

```txt id="x9v5pn"
Certified Read Model
```

Source of Truth:

```txt id="s2m7kw"
NO
```

Source of Truth remains:

```txt id="d8v3pt"
Leads
```

---

## PATIENT_MASTER Relationships

```txt id="n4m8qy"
PATIENT_MASTER
↓
Operational Cases

PATIENT_MASTER
↓
Billing Accounts

PATIENT_MASTER
↓
Analytics

PATIENT_MASTER
↓
Reporting
```

---

# Future Database Candidates

* PostgreSQL
* SQL Server
* MySQL

Current Decision:

```txt id="w7m2rx"
NO DATABASE SELECTION AUTHORIZED
```

---

# Migration Policy

Current Status:

```txt id="f5v8qn"
NO MIGRATION AUTHORIZED
```

---

## Forbidden

* Dual Write
* Product Migration
* Lead Replacement
* New Source of Truth

---

## Allowed

* Architecture Design
* Simulation
* Read Modeling
* Analytics Modeling
* Governance Modeling

---

# Roadmap Status

```txt id="q8m4tw"
20.x–49.x
COMPLETE

50.x
COMPLETE

51.x
COMPLETE

52.x
COMPLETE

53.x
IN PROGRESS
```

---

# Next Milestone

```txt id="v3m7pk"
53.3 Historical Persistence Model
```

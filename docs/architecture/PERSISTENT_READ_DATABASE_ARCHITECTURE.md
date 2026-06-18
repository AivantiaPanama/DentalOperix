# PERSISTENT_READ_DATABASE_ARCHITECTURE.md

# 53.x Persistent Read Database Architecture

## Status

```txt
STATUS:
IN PROGRESS

Completed:

53.1 Logical Architecture
53.2 Domain Storage Model
53.3 Historical Persistence Model
53.4 Certification & Freshness Architecture

Next:
53.5 Security & Access Architecture
53.6 Executive Architecture Decision
```

---

# Purpose

Persistent Read Database (PRD) is the future certified read platform for:

* Analytics
* Reporting
* Historical Analysis
* Cross-Domain Read Models

The PRD is not a transactional platform.

The PRD is not a System of Record.

The PRD is not a Source of Truth.

---

# Architectural Principles

## PRD-AP-001

```txt
Leads = Source of Truth
```

Permanent rule.

---

## PRD-AP-002

```txt
PRD = Certified Read Store
```

Purpose:

* Analytics
* Reporting
* Historical Analysis
* KPI Consumption

---

## PRD-AP-003

```txt
Read Only
```

No operational writes.

---

## PRD-AP-004

```txt
No Reverse Flow
```

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

## PRD-AP-005

```txt
Certification First
```

Only certified datasets may enter PRD.

---

## PRD-AP-006

```txt
Freshness Visible
```

All datasets expose:

```txt
CURRENT
STALE
EXPIRED
```

---

# Logical Architecture

```txt
Leads
↓
Certified Intake Layer
↓
Domain Read Store
↓
Historical Snapshot Store
↓
KPI Store
↓
Consumption Contract Layer
↓
Dashboards
Reporting
Analytics
```

---

# Certified Intake Layer

Purpose:

```txt
Accept certified datasets only.
```

Minimum metadata:

```txt
dataset_id
domain
source_batch_id
certification_status
freshness_status
generated_at
accepted_at
```

---

# Domain Read Store

Logical domains:

```txt
Patient Master Domain

Operations Read Domain

Finance Read Domain

Governance Domain

Enterprise Analytics Domain
```

---

# Historical Snapshot Store

Purpose:

```txt
Historical persistence.
```

Supported snapshots:

```txt
DAILY
WEEKLY
MONTHLY
RELEASE
```

Rule:

```txt
Append Only
```

---

# KPI Store

Purpose:

```txt
Certified KPI persistence.
```

Only KPIs from:

```txt
KPI Registry
```

may be stored.

---

# Consumption Contract Layer

Consumers:

```txt
Executive Dashboard

Operational Dashboard

Governance Dashboard

Enterprise Reporting

Historical Analytics

AI Analytics
```

Rule:

```txt
Consumers do not calculate KPIs.
Consumers consume certified KPIs.
```

---

# Domain Storage Model

## PATIENT_MASTER

Classification:

```txt
Certified Read Model
```

Purpose:

```txt
Unified Patient Identity Layer
```

Critical Rule:

```txt
PATIENT_MASTER

≠ Source of Truth
```

Source of Truth remains:

```txt
Leads
```

---

## Identity Priority

Official identity resolution order:

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

## PATIENT_MASTER Structure

```txt
patient_master_id

primary_identifier_type
primary_identifier_value

display_name

identity_status
identity_confidence

country

source_lead_count

first_source_lead_id

first_seen_at
last_seen_at

certification_status
freshness_status
```

---

## PATIENT_MASTER_IDENTIFIERS

```txt
patient_master_identifier_id

patient_master_id

identifier_type
identifier_value

is_primary

confidence_level

source_lead_id
```

---

## PATIENT_MASTER_LEAD_LINKS

```txt
patient_master_lead_link_id

patient_master_id

lead_id

identity_match_type

confidence_level
```

Rule:

```txt
Every patient_master_id
must reference at least one lead.
```

---

## PATIENT_MASTER_CONTACTS

```txt
patient_master_contact_id

patient_master_id

contact_type

contact_value

is_primary

source_lead_id
```

Rule:

```txt
Contact is not identity.
```

---

## PATIENT_MASTER_FISCAL_PROFILE

Panama support:

```txt
RUC
DV
Legal Name
Fiscal Address
```

Rule:

```txt
Fiscal identity
does not replace patient identity.
```

---

# Operations Read Domain

```txt
OPERATIONAL_CASES

APPOINTMENT_PROJECTIONS

FOLLOWUP_PROJECTIONS

TREATMENT_INTERESTS

OPERATIONAL_STATUS_HISTORY
```

All entities reference:

```txt
patient_master_id
```

---

# Finance Read Domain

```txt
BILLING_ACCOUNTS

INVOICES

INVOICE_LINES

PAYMENTS

COLLECTIONS
```

Traceability required:

```txt
patient_master_id
```

---

# Governance Domain

```txt
CERTIFICATION_REGISTRY

FRESHNESS_REGISTRY

VALIDATION_RESULTS

GOVERNANCE_AUDIT

KPI_REGISTRY
```

---

# Enterprise Analytics Domain

```txt
ENTERPRISE_KPI_VALUES

EXECUTIVE_SCORECARDS

CROSS_DOMAIN_COVERAGE

PATIENT_JOURNEY_SUMMARY
```

---

# Historical Snapshot Domain

```txt
PATIENT_MASTER_SNAPSHOT

OPERATIONS_SNAPSHOT

FINANCE_SNAPSHOT

KPI_SNAPSHOT

GOVERNANCE_SNAPSHOT
```

Rule:

```txt
Immutable
Append Only
```

---

# 53.3 Historical Persistence Model

## Status

```txt
COMPLETED
CERTIFIED FOR ARCHITECTURAL BASELINE
```

## Objective

Define historical persistence inside the Persistent Read Database (PRD) so certified read models can retain immutable historical states for analytics, auditing, KPI evolution, executive reporting, and temporal analysis.

Historical persistence SHALL NOT become an operational system, transactional authority, or alternative Source of Truth.

---

## Governance Principles

### HP-GP-001 Source of Truth Preservation

```txt
Leads = Source of Truth
```

Historical records stored inside the PRD are derived read artifacts and never authoritative operational records.

### HP-GP-002 Read-Only Historical Consumption

Historical datasets are read-only. No operational workflow may write back to Leads using historical data.

### HP-GP-003 No Reverse Synchronization

Forbidden:

```txt
PRD Historical Storage
↓
Leads
```

Historical persistence supports analytics only.

### HP-GP-004 Certified Read Model Continuity

PATIENT_MASTER remains the certified current-state representation. Historical persistence extends PATIENT_MASTER visibility through time but does not replace it.

---

## Historical Architecture Position

```txt
PATIENT_MASTER
(Current Certified State)
↓
Historical Capture Boundary
↓
PATIENT_MASTER_SNAPSHOT
(Historical Certified State)
```

PATIENT_MASTER_SNAPSHOT represents immutable historical versions of PATIENT_MASTER.

Characteristics:

* Append-only
* Immutable
* Read-only
* Analytics-oriented
* Contract-consumed

---

## Snapshot Rules

### HP-SR-001 Immutable Records

Snapshots cannot be modified. Corrections require generation of a new certified snapshot.

### HP-SR-002 Temporal Traceability

Every snapshot must include:

```txt
snapshot_id
patient_master_id
snapshot_timestamp
certification_version
source_generation_timestamp
certified_at
```

### HP-SR-003 Independent Consumption

Consumers may query current state, historical state, or comparative state without modifying operational systems.

---

## Supported Historical Capabilities

Supported:

* Point-in-time reconstruction
* KPI evolution
* Cohort analysis
* Executive trend analysis
* Longitudinal reporting

Not supported:

* Operational edits
* Lead modification
* Workflow execution
* Scheduling decisions
* Clinical transaction processing

---

## Historical Storage Classification

```txt
CERTIFIED ANALYTICAL STORAGE
```

Historical storage is not:

* Transactional Storage
* Operational Storage
* Domain Authority Storage
* Source of Truth

---

# 53.4 Certification & Freshness Architecture

## Status

```txt
COMPLETED
CERTIFIED FOR ARCHITECTURAL BASELINE
```

## Objective

Define how PRD certified read models expose certification, freshness, and consumption validity so executive dashboards, KPI consumers, reporting systems, and analytics clients can determine whether data is safe to consume.

53.4 does not define new operational storage and does not introduce write paths.

---

## Certified Read Model Contract

Every Certified Read Model SHALL expose the following metadata:

```txt
model_name
certification_status
certification_version
generated_at
certified_at
freshness_status
source_timestamp
```

---

## Certification States

```txt
CERTIFIED
DEGRADED
STALE
UNKNOWN
```

Rules:

* CERTIFIED models are approved for executive consumption.
* DEGRADED models are usable only with explicit degradation visibility.
* STALE models are not eligible for executive KPI consumption.
* UNKNOWN models are prohibited for certified consumers.

---

## Freshness States

```txt
FRESH
WARNING
EXPIRED
```

Rules:

* FRESH is inside the approved SLA.
* WARNING is close to the approved SLA boundary.
* EXPIRED is outside the approved SLA and must not power executive KPIs.

---

## Certified Models Registry

Current certified registry:

```txt
PATIENT_MASTER
PATIENT_MASTER_SNAPSHOT
```

Future models require formal certification before PRD consumption.

---

## KPI Consumption Matrix

| Certification | Freshness | Executive KPI Consumption |
| --- | --- | --- |
| CERTIFIED | FRESH | Allowed |
| CERTIFIED | WARNING | Allowed with visibility |
| CERTIFIED | EXPIRED | Prohibited |
| DEGRADED | FRESH | Limited with visibility |
| STALE | Any | Prohibited |
| UNKNOWN | Any | Prohibited |

---

## Historical Freshness Rule

PATIENT_MASTER_SNAPSHOT preserves:

```txt
certification_version
snapshot_timestamp
certified_at
```

Historical certification is durable after snapshot certification. Freshness does not expire the historical snapshot itself; consumers must interpret it by snapshot_timestamp.

---

## Executive Dashboard Rule

Executive dashboards must not silently display:

```txt
UNKNOWN
STALE
EXPIRED
```

without explicit degradation or stale-state indicators.

---

## Observability Integration

Executive Observability Layer SHALL monitor:

* freshness age
* certification validity
* degraded datasets
* expired datasets
* consumption violations

---

# Governance Rules

## PRD-GR-001

```txt
PRD is Read Only
```

---

## PRD-GR-002

```txt
Lead Sovereignty
```

Leads remain Source of Truth.

---

## PRD-GR-003

```txt
No Reverse Flow
```

---

## PRD-GR-004

```txt
Certification First
```

---

## PRD-GR-005

```txt
Immutable Snapshots
```

---

## PRD-GR-006

```txt
Contract-Based Consumption
```

---

## PRD-GR-007

```txt
KPIs originate from KPI Registry only
```

---

# Current Architecture Status

```txt
53.1 Logical Architecture
COMPLETED

53.2 Domain Storage Model
COMPLETED

53.3 Historical Persistence Model
COMPLETED

53.4 Certification & Freshness Architecture
COMPLETED

53.5 Security & Access Architecture
NEXT
```

---

# Baseline Compliance

```txt
Leads = Source of Truth                PASS

READ MODEL PLATFORM v2 = FROZEN       PASS

No Dual Write                         PASS

No Migration                          PASS

No Replacement                        PASS
```

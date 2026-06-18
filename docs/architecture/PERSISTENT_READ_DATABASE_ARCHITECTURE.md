# PERSISTENT_READ_DATABASE_ARCHITECTURE.md

# 53.x Persistent Read Database Architecture

## Status

```txt
STATUS:
IN PROGRESS

Completed:

53.1 Logical Architecture
53.2 Domain Storage Model

Next:

53.3 Historical Persistence Model
53.4 Certification & Freshness Architecture
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

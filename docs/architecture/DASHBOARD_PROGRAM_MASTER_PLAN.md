# DentalOperix Dashboard Program Master Plan

## Governance Baseline

The program is governed by the following permanent rules:

- Leads = Source of Truth.
- Google Sheet = Current Physical Persistence.
- Relational Database = Future Physical Persistence.
- READ MODEL PLATFORM v2 = CLOSED / FROZEN / GOVERNANCE BASELINED.
- No Dual Write.
- No Multiple Sources of Truth.
- No Projection Engine.
- No Product Migration.
- No Lead Replacement.
- No operational cutover without explicit approval.

## Certified Programs

### 52.x Enterprise Analytics & KPI Architecture

CLOSED / CERTIFIED

### 53.x Persistent Read Database Architecture

CLOSED / CERTIFIED / GOVERNANCE BASELINED

### 54.x Executive Dashboard Consumption Layer

CLOSED / CERTIFIED

### 55.x Enterprise Implementation Assessment

CLOSED / SUCCESSFUL

Primary finding:

Implementation maturity exceeds historical documentation maturity.

Verified conclusions:

- Read Model Infrastructure = Implemented.
- Executive Dashboard Infrastructure = Implemented.
- Provider Layer = Implemented.
- Fallback Layer = Implemented.
- Multi-Domain Read Architecture = Implemented.
- Governance Alignment = Verified.

## Active Program

### 57.x Leads Persistence Transition Strategy

STATUS: ACTIVE
TYPE: Persistence transition, not re-architecture.

Purpose:

Prepare the governed transition from Google Sheet-backed Leads persistence to relational database-backed Leads persistence while preserving Leads as the Source of Truth.

Non-goals:

- No new Source of Truth.
- No permanent dual write.
- No product migration.
- No lead replacement.
- No PRD write-back.
- No Projection Engine.
- No cutover without explicit approval.

## 57.x Phase Plan

### 57.1-A Persistence Adapter Infrastructure

STATUS: COMPLETED / COMPILED / TESTED / ACCEPTED

Deliverables:

- LeadPersistencePort
- GoogleSheetLeadPersistenceAdapter
- RelationalLeadPersistenceAdapter (inactive)
- LeadPersistenceProvider

### 57.1-B Relational Leads Schema Design

STATUS: COMPLETED / COMPILED / TESTED / ACCEPTED
RUNTIME STATUS: NOT ACTIVE
CUTOVER STATUS: NOT APPROVED

Deliverables:

- Relational Leads Schema Design
- Offline SQL Reference
- TypeScript Schema Metadata
- Governance Validation

### 57.1-C Documentation State Reconciliation

STATUS: COMPLETED

Deliverables:

- Program status reconciliation
- Master plan reconciliation
- Transition strategy reconciliation
- Relational schema design status reconciliation

### 57.1-C.1 Baseline ADR Restoration

STATUS: COMPLETED

Deliverables:

- ADR-015 Read Model Governance
- ADR-016 Domain Boundaries
- ADR-017 Fallback Policy
- ADR-025 Projection Engine Deferral
- ADR-026 Persistent Read Database Strategy
- ADR-027 Enterprise Analytics Architecture
- ADR-028 KPI Governance Architecture
- ADR-029 Analytics Consumption Contracts

### 57.2 Persistence Readiness Validation

STATUS: COMPLETED
RESULT: PARTIALLY READY

Deliverables:

- Persistence Inventory Report
- Schema Compatibility Matrix
- Adapter Readiness Report
- Governance Compliance Report
- Migration Readiness Score

Decision:

Architecture and governance are ready. Operational and production-data validation were required before executive review.

### 57.3 Migration Readiness Assessment

STATUS: COMPLETED
RESULT: READY FOR EXECUTIVE REVIEW
CUTOVER RESULT: NO GO

Deliverables:

- Production Data Quality Assessment
- Migration Mapping Matrix
- Rollback Readiness Assessment
- Go / No-Go Criteria Definition

Decision:

Migration readiness is sufficient for executive review, but cutover remains NO GO until explicit executive approval exists.

### 57.4 Cutover Governance Package

STATUS: APPROVED TO START
TYPE: Executive governance package.

Deliverables:

- Cutover Governance Package
- Executive Approval Checklist
- Rollback Validation Checklist
- Go / No-Go Decision Record

Boundary:

57.4 prepares decision evidence only. It does not activate relational persistence.

## Evidence Policy

The codebase is the latest tested implementation reference.

Architecture documentation must be updated from repository evidence and may not infer implementation state without code or data validation.

## Success Criteria for 57.x

57.x may only complete when all of the following are true:

- Leads remains Source of Truth.
- Google Sheet remains active until separately approved cutover.
- Relational persistence activation is explicitly approved.
- Data quality and mapping evidence are accepted.
- Rollback procedure is documented and validated.
- Go / No-Go criteria are met.
- Executive approval exists.

## 57.5 Executive Review and Authorization Hold

```text
STATUS: READY FOR EXECUTIVE REVIEW
RESULT: HOLD
```

The program is held at executive authorization boundary. Google Sheet remains active persistence and the relational database remains inactive.

## 57.6 Authorization Hold Handoff

```text
STATUS: COMPLETED
RESULT: HOLD ENFORCED
```

57.6 formalizes repository handoff while the program waits for explicit executive authorization.

The only valid runtime state remains:

```text
LeadPersistenceProvider -> GoogleSheetLeadPersistenceAdapter
RelationalLeadPersistenceAdapter -> Inactive
Cutover -> Not Approved
```

Future cutover requires a separate explicit executive approval record.

---

## 57.7-D Relational Dry-Run Validation

STATUS: IMPLEMENTATION PACKAGE PREPARED / READY FOR LOCAL EXECUTION

57.7-D is a pre-cutover validation stage. It proves that the prepared relational schema can support controlled synthetic transactional operations while keeping Google Sheet as active persistence.

The phase does not authorize cutover. Cutover remains a separate decision and execution window.

---

## 57.8 Controlled Cutover Execution

```text
STATUS: IMPLEMENTED AS CONTROLLED RUNTIME READINESS PACKAGE
```

Scope completed:

- Relational runtime adapter implementation.
- Fail-closed activation flags.
- Runtime flag validation script.
- Rollback runbook.
- Documentation update.
- Targeted persistence tests.

Restrictions preserved:

- No dual write.
- No multiple sources of truth.
- No projection engine.
- No product migration.
- No modification of restricted UI/API/calendar/Gmail components.

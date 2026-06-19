# Leads Persistence Transition Strategy

## Status

57.x STATUS: ACTIVE

Current completed milestones:

- 57.1-A Persistence Adapter Infrastructure: COMPLETED / COMPILED / TESTED / ACCEPTED
- 57.1-B Relational Leads Schema Design: COMPLETED / COMPILED / TESTED / ACCEPTED
- 57.1-C Documentation State Reconciliation: COMPLETED
- 57.1-C.1 Baseline ADR Restoration: COMPLETED
- 57.2 Persistence Readiness Validation: COMPLETED / PARTIALLY READY
- 57.3 Migration Readiness Assessment: COMPLETED / READY FOR EXECUTIVE REVIEW / CUTOVER NO GO

Current phase:

- 57.4 Cutover Governance Package: APPROVED TO START

## Purpose

Define and govern the future transition from Google Sheet-backed Leads persistence to relational database-backed Leads persistence.

This is a persistence transition only.

It is not:

- a re-architecture,
- a new Source of Truth,
- a product migration,
- a Projection Engine adoption,
- a dashboard redesign,
- a read-model rewrite.

## Current State

Logical Source of Truth:

- Leads

Current physical persistence:

- Google Sheet / Google Sheets CRM worksheet

Verified implementation evidence:

- `src/server/leads/persistence/lead-persistence-port.ts`
- `src/server/leads/persistence/google-sheet-lead-persistence-adapter.ts`
- `src/server/leads/persistence/relational-lead-persistence-adapter.ts`
- `src/server/leads/persistence/lead-persistence-provider.ts`
- `src/server/leads/persistence/lead-persistence-provider.test.ts`
- `src/server/leads/persistence/relational-leads-schema.ts`
- `src/server/leads/persistence/relational-leads-schema.test.ts`

## Target State

Logical Source of Truth:

- Leads

Future physical persistence:

- Relational operational Leads database

The future database is not a new Source of Truth. It is the future physical persistence mechanism for the same Leads domain.

## Non-Goals

This strategy must not introduce:

- New Source of Truth
- Multiple Sources of Truth
- Permanent Dual Write
- Product Migration
- Lead Replacement
- PRD write-back
- Projection Engine adoption
- Runtime cutover without explicit approval

## 57.1-A Persistence Adapter Infrastructure

STATUS: COMPLETED / COMPILED / TESTED / ACCEPTED

Implemented:

- LeadPersistencePort
- GoogleSheetLeadPersistenceAdapter
- RelationalLeadPersistenceAdapter (inactive)
- LeadPersistenceProvider

Governance decision:

The 57.1-A implementation introduces a persistence boundary only.

It does not activate relational persistence.
It does not introduce dual write.
It does not change the Leads Source of Truth.
It does not modify operational flows.

## 57.1-B Relational Leads Schema Design

STATUS: COMPLETED / COMPILED / TESTED / ACCEPTED
RUNTIME STATUS: NOT ACTIVE
CUTOVER STATUS: NOT APPROVED

Implemented:

- Relational Leads Schema
- Offline SQL Migration Reference
- Schema Metadata
- Governance Validation

Governance decision:

57.1-B defines the target relational schema for the existing Leads domain only.

It does not activate relational persistence.
It does not approve dual write.
It does not change the Leads Source of Truth.
It does not modify operational flows.

## 57.2 Persistence Readiness Validation

STATUS: COMPLETED
RESULT: PARTIALLY READY

Subphase results:

- 57.2-A Persistence Inventory Validation: PASS
- 57.2-B Schema Compatibility Assessment: PASS
- 57.2-C Adapter Readiness Assessment: PASS
- 57.2-D Governance Validation: PASS
- 57.2-E Migration Readiness Score: PARTIALLY READY

Reason for PARTIALLY READY:

- Architecture readiness verified.
- Governance readiness verified.
- Adapter readiness verified.
- Production data and operational cutover readiness still required at that stage.

## 57.3 Migration Readiness Assessment

STATUS: COMPLETED
RESULT: READY FOR EXECUTIVE REVIEW
CUTOVER RESULT: NO GO

Subphase results:

- 57.3-A Production Data Quality Assessment: PASS WITH OBSERVATIONS
- 57.3-B Data Mapping Verification: PASS
- 57.3-C Rollback Readiness Assessment: PASS
- 57.3-D Go / No-Go Criteria Definition: NO GO

Reason for NO GO:

- Executive approval for cutover is not present.

Open observations:

- MIG-RISK-001 Status Normalization: MEDIUM (`new` / `nuevo`).
- MIG-RISK-002 Mixed ID Prefixes: LOW (`lead_` / `dental_`).
- MIG-RISK-003 Configuration Exposure Risk: LOW (`LEADS_PERSISTENCE_MODE=relational-db`).

## Required Architecture Gates Before Any Future Cutover

Before activation, the following must be approved:

1. Production data quality report.
2. Data mapping and reconciliation report.
3. Rollback plan.
4. Cutover plan.
5. Runtime adapter activation plan.
6. Google Sheet archival or read-only policy.
7. Post-cutover certification plan.
8. Executive Go / No-Go approval.

## Transitional Rule

During transition planning, Google Sheet remains the current active physical persistence mechanism.

No runtime change is approved by this document.

## Relationship to PRD

The Persistent Read Database remains downstream, read-only and analytical.

The PRD must not become the operational Leads database.

## Current Persistence Boundary

Current:

```text
Leads
  ↓
Google Sheet
```

Future, only after separately approved cutover:

```text
Leads
  ↓
Relational Database
```

## Cutover Status

Cutover remains blocked.

Google Sheet remains the active physical persistence mechanism until a future explicit cutover approval.


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

57.x has reached the authorization boundary.

Prepared:

- Persistence adapters
- Relational schema
- Documentation reconciliation
- ADR baseline restoration
- Readiness validation
- Migration readiness assessment
- Cutover governance package
- Executive authorization hold record

Not authorized:

- Relational database activation
- Cutover
- Dual Write
- Runtime persistence change

Current state remains:

```text
Leads -> Google Sheet
```

Future state remains conditional:

```text
Leads -> Relational Database
```

The future state requires explicit executive approval before activation.


---

## 57.7-D Relational Dry-Run Validation

STATUS: IMPLEMENTATION PACKAGE PREPARED / READY FOR LOCAL EXECUTION

The dry-run validation verifies Supabase relational write/read/update/audit capability using synthetic data inside a rolled-back transaction.

This validation does not migrate production data and does not activate relational persistence.

Required governance flags:

```text
LEADS_PERSISTENCE_MODE=google-sheet
RELATIONAL_CUTOVER_APPROVED=false
RELATIONAL_DRY_RUN_APPROVED=true
RELATIONAL_DRY_RUN_ENABLED=true
```

Result expectation:

```text
Result: PASS
Persisted rows after rollback: 0
```

---

## 57.8 Controlled Cutover Execution

```text
STATUS: IMPLEMENTED AS CONTROLLED RUNTIME READINESS PACKAGE
```

57.8 adds guarded relational runtime capability to `RelationalLeadPersistenceAdapter`.

The adapter remains fail-closed unless all 57.8 runtime flags are explicitly enabled:

```env
LEADS_PERSISTENCE_MODE=relational-db
RELATIONAL_CUTOVER_APPROVED=true
RELATIONAL_RUNTIME_ACTIVATION_APPROVED=true
```

This remains a physical persistence transition only. Leads remains the Source of Truth.

Rollback is documented in `57.8_ROLLBACK_RUNBOOK.md`.

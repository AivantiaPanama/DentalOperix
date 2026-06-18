# Leads Persistence Transition Strategy

## Status

PLANNED / NOT STARTED

## Purpose

Define the future governed transition from Google Sheet-backed Leads persistence to relational database-backed Leads persistence.

## Current State

Logical Source of Truth:

- Leads

Current physical persistence:

- Google Sheet / Google Sheets CRM worksheet

Verified implementation evidence:

- `src/server/google/crm.ts` appends, reads and updates Leads through Google Sheets.
- `src/server/google/sheets.ts` exposes the sheet-facing Leads adapter.
- `src/lib/api/dental.server.ts` writes new leads and updates Calendar/email metadata through the Google Sheets CRM adapter.
- `src/lib/config.server.ts` requires `GOOGLE_SHEET_ID` and `GOOGLE_SHEET_NAME`.

## Target State

Logical Source of Truth:

- Leads

Future physical persistence:

- Relational operational Leads database

The future database is not a new Source of Truth. It is the future persistence mechanism for the same Leads domain.

## Non-Goals

This strategy must not introduce:

- New Source of Truth
- Permanent dual write
- Product migration
- Lead replacement
- PRD write-back
- Projection Engine adoption

## Required Architecture Gates

Before implementation, the following must be approved:

1. Leads relational schema
2. Persistence adapter boundary
3. Data backfill and reconciliation plan
4. Cutover plan
5. Rollback plan
6. Google Sheet retirement, archival or read-only policy
7. Governance validation that all writes continue to belong to the Leads domain

## Transitional Rule

During transition planning, Google Sheet remains the current physical persistence mechanism.

No runtime change is approved by this document.

## Relationship to PRD

The Persistent Read Database remains downstream, read-only and analytical.

The PRD must not become the operational Leads database.

## Relationship to 55.x

55.x may assess current implementation readiness and document gaps, but may not implement the database transition.

## Future Program

Recommended future program:

57.x Leads Persistence Transition Strategy

---

## 57.1-A Persistence Adapter Infrastructure

Status: IMPLEMENTED / NOT ACTIVE

Repository evidence added during 57.1-A:

- `src/server/leads/persistence/lead-persistence-port.ts`
- `src/server/leads/persistence/google-sheet-lead-persistence-adapter.ts`
- `src/server/leads/persistence/relational-lead-persistence-adapter.ts`
- `src/server/leads/persistence/lead-persistence-provider.ts`
- `src/server/leads/persistence/lead-persistence-provider.test.ts`

### Governance Decision

The initial 57.x code introduces a persistence boundary only.

It does not activate relational persistence.

It does not introduce dual write.

It does not change the Leads Source of Truth.

### Active Persistence

Current active persistence remains:

```text
Leads
  ↓
Google Sheet
```

### Future Persistence Placeholder

The relational adapter exists as an inactive placeholder for future cutover planning:

```text
Leads
  ↓
Relational Database
```

The relational adapter intentionally throws `LeadPersistenceNotConfiguredError` for reads, writes and updates until a future cutover decision explicitly activates it.

### Cutover Rule

No runtime flow may switch to relational persistence until the following are approved:

1. Relational Leads schema
2. Backfill and reconciliation plan
3. Cutover plan
4. Rollback plan
5. Google Sheet archival/read-only policy
6. Post-cutover certification

### Non-Regression Rule

The following remain prohibited:

- dual write
- multiple active Sources of Truth
- PRD write-back
- lead replacement
- product migration
- Projection Engine adoption

---

## 57.1-B Relational Leads Schema Design

Status: DESIGNED / NOT ACTIVE / NOT EXECUTED

Repository evidence added during 57.1-B:

- `docs/architecture/57.1-B_RELATIONAL_LEADS_SCHEMA_DESIGN.md`
- `docs/architecture/sql/57_1_B_relational_leads_schema.sql`
- `src/server/leads/persistence/relational-leads-schema.ts`
- `src/server/leads/persistence/relational-leads-schema.test.ts`

### Governance Decision

57.1-B defines the target relational schema for the existing Leads domain only.

It does not activate relational persistence.
It does not approve dual write.
It does not change the Leads Source of Truth.
It does not modify operational flows.

### Target Persistence Boundary

Current:

```text
Leads
  ↓
Google Sheet
```

Future, after separately approved cutover:

```text
Leads
  ↓
Relational Database
```

### Designed Tables

Primary table:

- `leads`

Migration support table:

- `lead_persistence_migration_audit`

The migration audit table supports future backfill and reconciliation certification. It is not an operational Source of Truth.

### Cutover Status

Cutover remains blocked.

Google Sheet remains the active physical persistence mechanism until a future explicit cutover approval.

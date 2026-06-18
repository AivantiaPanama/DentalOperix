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

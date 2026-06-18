# Relational Data Roadmap

## Completed Initiative

Persistent Read Database Architecture
STATUS: CLOSED / APPROVED / GOVERNANCE BASELINED

## Completed Direction

Executive Dashboard Consumption Layer
STATUS: CLOSED / APPROVED / READY FOR IMPLEMENTATION ASSESSMENT

## Active Initiative

55.x Enterprise Implementation Assessment

Status:
IN PROGRESS

Current Phase:
55.1 Repository Architecture Assessment

Primary Deliverable:
EXECUTIVE_IMPLEMENTATION_ASSESSMENT.md

## Evidence-Based Findings

Repository inspection confirms:

- A dedicated read-model layer exists under `src/server/read-models`.
- Multi-domain aggregate read services exist for Patient, CRM, Billing, Clinical, Operations, Finance, Inventory and Support.
- Executive dashboard contract and observability packages exist.
- Internal executive observability APIs exist.


## Planned Future Initiative

57.x Leads Persistence Transition Strategy

Status:
PLANNED / NOT STARTED

Objective:
Move the physical persistence of the Leads Source of Truth from Google Sheets to a governed relational database when the database exists and is certified for operational persistence.

Current state:

- Leads logical Source of Truth: active
- Current physical persistence: Google Sheet / Google Sheets CRM worksheet
- Future target physical persistence: relational operational Leads database

Governance constraint:

This is a persistence transition, not a product migration, not a domain replacement and not a new Source of Truth.

Required future gates:

- Database schema approval
- Leads persistence adapter design
- Backfill/reconciliation plan
- Cutover plan
- Rollback plan
- Post-cutover Google Sheet retirement or read-only archival decision
- Explicit no-dual-write validation

## Current Roadmap Decision

The roadmap should not introduce new data architecture before completing 55.x.

Next work must focus on:

- Dashboard capability assessment
- PRD consumption readiness
- Conceptual-to-implementation mapping
- Executive gap analysis
- Executive implementation decision


## Read Model Platform Status Update

Read Model Platform:
- Implemented
- Verified During Repository Assessment

Migration readiness is assessed as focused on persistence transition rather than architectural redesign.

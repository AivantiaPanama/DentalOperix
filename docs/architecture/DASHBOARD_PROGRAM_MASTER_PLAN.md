# DentalOperix Dashboard Program Master Plan

## Certified Programs

### 52.x Enterprise Analytics & KPI Architecture
CLOSED / APPROVED / CERTIFIED

### 53.x Persistent Read Database Architecture
CLOSED / APPROVED / CERTIFIED / GOVERNANCE BASELINED

### 54.x Executive Dashboard Consumption Layer
CLOSED / APPROVED / READY FOR IMPLEMENTATION ASSESSMENT

## Active Program

### 55.x Enterprise Implementation Assessment

Primary Deliverable:
EXECUTIVE_IMPLEMENTATION_ASSESSMENT.md

Current Phase:
55.1 Repository Architecture Assessment

Current Decision:
CONDITIONAL

## Evidence Policy

The codebase is the latest tested implementation reference.

Architecture documentation must be updated from repository evidence and may not infer current-state implementation without code validation.

## Phases

- 55.1 Repository Architecture Assessment
- 55.2 Dashboard Capability Assessment
- 55.3 PRD Consumption Readiness
- 55.4 Executive Gap Analysis
- 55.5 Executive Implementation Decision

## 55.1 Repository Architecture Assessment - Current Findings

Verified:

- Application structure is layered across `components`, `routes`, `lib`, `server`, `data`, `hooks` and tests.
- Read-model services exist under `src/server/read-models`.
- Executive dashboard readiness and release-candidate packs exist.
- Internal executive observability APIs exist.
- Architecture guard tests exist.

Preliminary classification:

CONDITIONAL

## Success Criteria

- No governance violations.
- Leads remains Source of Truth.
- Certified KPI lineage is mapped to implementation evidence.
- Certified dashboard consumption path is verified from route to contract to read model.
- Executive readiness assessment is completed.


## Planned Future Program

### 57.x Leads Persistence Transition Strategy

Status:
PLANNED / NOT STARTED

Purpose:
Define the governed transition from Google Sheet-backed Leads persistence to relational database-backed Leads persistence.

Non-goals:

- No new Source of Truth
- No permanent dual write
- No product migration
- No lead replacement
- No PRD write-back

Entry criteria:

- 55.x implementation assessment completed or sufficiently scoped
- Relational database target selected
- Operational Leads schema proposed
- Cutover and rollback strategy approved

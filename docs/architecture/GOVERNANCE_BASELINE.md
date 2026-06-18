# Governance Baseline

## Permanent Restrictions

Do Not Modify:

- BookingDialog
- processDentalLead
- /api/leads/create
- Calendar
- Gmail
- FloatingDentalAIChat
- Home
- siteServices.ts

## Architectural Baseline

Leads = Source of Truth

Certified Read Models:

- PATIENT_MASTER
- PATIENT_MASTER_SNAPSHOT

Persistent Read Database:

- Read Only
- Certified
- Analytical
- Non Transactional

Forbidden Patterns:

- Dual Write
- Product Migration
- Lead Replacement
- New Source of Truth
- Projection Engine Adoption
- PRD to Leads Synchronization


## Source of Truth Persistence Clarification

Logical Source of Truth:

- Leads

Current physical persistence:

- Google Sheet / Google Sheets CRM worksheet

Verified implementation evidence:

- `src/server/google/crm.ts` appends, reads and updates Leads through Google Sheets.
- `src/server/google/sheets.ts` exposes the legacy Leads sheet adapter.
- `src/lib/api/dental.server.ts` writes new dental leads through `appendLeadToSheet` and updates status, Calendar event id and email-sent flags through `updateLeadInSheet`.
- `GOOGLE_SHEET_ID` and `GOOGLE_SHEET_NAME` are required server configuration values for the current working implementation.

Governance interpretation:

`Leads = Source of Truth` is a logical domain rule. Google Sheet is the current physical persistence mechanism for Leads.

A future relational database may replace Google Sheet as the physical persistence mechanism only through a governed persistence transition. That transition must preserve the Leads domain as the Source of Truth and must not create a second concurrent Source of Truth.

## Evidence-Based Documentation Rule

Implementation assessments may inspect, inventory, audit and classify.

Implementation assessments may not:

- Re-architect
- Alter governance baselines
- Change the Source of Truth
- Certify current-state architecture without repository evidence

The current code reference is treated as the latest tested implementation.

Documentation must be updated from repository evidence when describing implementation state.

## Verified Governance Evidence

Repository evidence currently includes:

- `src/architecture-guards.test.ts`
- Restricted appointment creation boundary around `BookingDialog` and `useCreateDentalAppointment`
- Public appointment navigation kept dialog-driven and route-free
- Admin authentication protected from browser storage usage
- Dedicated read-model layer under `src/server/read-models`
- Executive dashboard contract and observability packages under `src/server/read-models`

## Fallback Governance

The read-model source provider may use legacy Leads fallback only as a read resilience mechanism.

Fallback may not become:

- Dual write
- Lead replacement
- New source of truth
- PRD to Leads synchronization

Fallback usage must remain observable and governed under the fallback policy.

---

## 57.x Persistence Adapter Governance

Initial 57.x implementation introduced a Leads persistence adapter boundary.

Governance classification:

- Approved as infrastructure-only.
- Not approved as runtime cutover.
- Not approved as dual write.
- Not approved as Source of Truth replacement.

The active physical persistence remains Google Sheet until a future cutover decision certifies relational persistence.

The relational persistence adapter must remain inactive and non-writable until explicit approval of:

1. relational schema,
2. migration/backfill plan,
3. reconciliation plan,
4. cutover plan,
5. rollback plan,
6. post-cutover certification.

Permanent rule:

```text
Leads = Source of Truth
```

Current physical persistence:

```text
Google Sheet
```

Future physical persistence:

```text
Relational Database
```

The future database is a persistence mechanism for Leads, not a new Source of Truth.

---

## 57.1-B Relational Leads Schema Governance

Status: DESIGNED / NOT ACTIVE

57.1-B defines a relational Leads schema as a future physical persistence target.

Governance rules:

- Leads remains the Source of Truth.
- Google Sheet remains the active physical persistence until explicit cutover approval.
- Relational Database is not a new Source of Truth.
- Dual write is not approved.
- Operational flows are not changed by the schema design.
- Cutover requires separate approval.

---

## 57.1-C Documentation State Reconciliation

Status: COMPLETED

Purpose:

Restore alignment between implementation evidence, certified architectural baseline and program documentation.

Outcome:

- 55.x is closed as SUCCESSFUL.
- 57.x is active as a persistence transition.
- 57.1-A is completed, compiled, tested and accepted.
- 57.1-B is completed, compiled, tested and accepted.
- Relational persistence remains inactive.
- Cutover remains not approved.

---

## 57.1-C.1 Baseline ADR Restoration

Status: COMPLETED

Restored baseline ADRs:

- ADR-015 Read Model Governance
- ADR-016 Domain Boundaries
- ADR-017 Fallback Policy
- ADR-025 Projection Engine Deferral
- ADR-026 Persistent Read Database Strategy
- ADR-027 Enterprise Analytics Architecture
- ADR-028 KPI Governance Architecture
- ADR-029 Analytics Consumption Contracts

Restoration rule:

The restored ADRs document the already-certified architecture baseline. They do not introduce new architecture decisions.

---

## 57.2 Persistence Readiness Validation

Status: COMPLETED
Result: PARTIALLY READY

Validated:

- Persistence inventory
- Schema compatibility
- Adapter readiness
- Governance compliance
- Migration readiness score

Outcome:

Architecture and governance readiness are verified. Full migration readiness requires operational package and executive review.

---

## 57.3 Migration Readiness Assessment

Status: COMPLETED
Result: READY FOR EXECUTIVE REVIEW
Cutover Result: NO GO

Validated:

- Production data quality from the provided Google Sheet snapshot
- Data mapping from Google Sheet to relational schema
- Rollback readiness
- Go / No-Go criteria

Open observations:

- Status values should be normalized before or during future migration certification (`new` / `nuevo`).
- Mixed ID prefixes are accepted as historical values (`lead_` / `dental_`).
- `LEADS_PERSISTENCE_MODE=relational-db` remains a low configuration exposure risk because the relational adapter fails closed.

Cutover remains NO GO until explicit executive approval exists.

---

## 57.4 Cutover Governance Package

Status: APPROVED TO START

57.4 may prepare evidence and decision materials only.

57.4 must not:

- activate relational persistence,
- run a production migration,
- enable dual write,
- change the Source of Truth,
- retire Google Sheet,
- alter restricted components.

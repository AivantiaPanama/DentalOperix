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


## Repository Assessment Finding

Repository assessment indicates implementation is materially aligned with the governance baseline. Verified evidence exists for read-model infrastructure, executive dashboard infrastructure, provider abstraction and fallback policy implementation.

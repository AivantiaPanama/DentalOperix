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

# Persistent Read Database Architecture

## Status

53.x Persistent Read Database Architecture

STATUS: CLOSED
CERTIFICATION: APPROVED
GOVERNANCE: BASELINED

Completed Scope:

- 53.1 Logical Architecture
- 53.2 Domain Storage Model
- 53.3 Historical Persistence Model
- 53.4 Certification & Freshness Architecture
- 53.5 Security & Access Architecture
- 53.6 Executive Architecture Decision

Certified Conceptual Read Models:

- PATIENT_MASTER
- PATIENT_MASTER_SNAPSHOT

Source of Truth:

- Leads

Projection Engine:

- Reviewed
- Not Recommended
- Closed


## Source of Truth Persistence Boundary

`Leads` remains the logical Source of Truth.

The current tested implementation persists Leads in Google Sheets. Repository evidence includes:

- `src/server/google/crm.ts` as the CRM Leads persistence adapter.
- `src/server/google/sheets.ts` as the legacy sheet-facing Leads adapter.
- `src/lib/api/dental.server.ts` as the current lead creation orchestration path that writes to the Google Sheet-backed CRM.

The future relational database is not a new source of truth. It is the intended future physical persistence mechanism for the same Leads domain, subject to a separate governed transition plan.

The Persistent Read Database remains downstream, read-only and analytical. It must not become the operational Leads database and must not write back to Leads.

## Implementation Evidence Update

Repository inspection shows a concrete read-model implementation under:

`src/server/read-models`

Observed read-model implementation artifacts include:

- Worksheet read models
- Patient aggregate read service
- CRM read aggregate service
- Billing read aggregate service
- Clinical read aggregate service
- Operations read aggregate service
- Finance read aggregate service
- Inventory read aggregate service
- Support read aggregate service
- Read observability provider
- Executive observability provider

## Conceptual-to-Implementation Mapping

`PATIENT_MASTER` remains the certified conceptual patient read model.

Current implementation evidence expresses patient read state through worksheet read-model sheets and aggregate services, including:

- Patients
- PatientIdentifiers
- PatientContacts
- PatientAdministrativeProfiles
- TreatmentInterests
- PatientBillingProfiles
- TreatmentPlans
- TreatmentStages
- ClinicalOutcomes
- Patient aggregate read service

The documentation must treat these implementation artifacts as concrete contributors to the certified conceptual `PATIENT_MASTER` model unless later architecture review introduces a different mapping.

## Historical Persistence Verification

`PATIENT_MASTER_SNAPSHOT` remains certified as the conceptual historical read model.

Concrete runtime persistence for `PATIENT_MASTER_SNAPSHOT` remains pending verification in 55.x.

Until verified, historical persistence status is:

ARCHITECTURE CERTIFIED / IMPLEMENTATION VERIFICATION PENDING

## Fallback Boundary

The read-model source provider contains controlled fallback to legacy Leads when read models are unavailable or fail.

This is classified as read fallback only.

It is not:

- Dual write
- Source of truth replacement
- Projection Engine adoption
- PRD to Leads synchronization


## PATIENT_MASTER Verification Update

PATIENT_MASTER Status:
- Certified Architecture
- Substantially Verified Implementation

Evidence includes patient aggregate read services and supporting patient adapters.

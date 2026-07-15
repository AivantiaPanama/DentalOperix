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

---

# 57.9 Documentation Consolidation & Program Closure

STATUS: CLOSED
CERTIFICATION: CERTIFIED
RESULT: PRODUCTION CUTOVER VALIDATED

## Final Evidence

- 57.7-B Relational Connectivity Validation: PASS.
- 57.7-C Relational Schema Deployment: PASS.
- 57.7-D Relational Dry-Run Validation: PASS.
- 57.8-A Production Cutover Checklist: COMPLETED.
- 57.8-B Production Relational Environment Preparation: PASS for DEV and PROD Supabase environments.
- 57.8-C Runtime Flag Validation: PASS.
- 57.8-C Production Cutover Readiness Validation: PASS.
- 57.8-C Production Post-Cutover Validation: PASS.

## Final Persistence State

- Leads remains the logical Source of Truth.
- Supabase PostgreSQL is the certified active relational physical persistence target for the controlled cutover path.
- Google Sheet remains the rollback/reference persistence source until operational archival or read-only policy is separately approved.
- No dual write, multiple Sources of Truth, Projection Engine, Lead Replacement, or Product Migration was introduced.

## Final Validation Note

The production post-cutover validation was aligned with the certified `lead_persistence_migration_audit` schema by using:

```text
migration_status = reconciled
```

This matches the approved audit status constraint and validates INSERT lead, SELECT lead, UPDATE lead, INSERT audit, and ROLLBACK cleanup with zero residual synthetic rows.

## Final Governance Outcome

57.x Leads Persistence Transition Strategy is closed and certified as a persistence transition, not a re-architecture.

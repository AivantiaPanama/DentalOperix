# 61.4 Documentation Structure

Phase: 61.4
Status: DISCOVERY
Implementation: NOT AUTHORIZED
Code generation: NOT AUTHORIZED
Schema changes: NOT AUTHORIZED

## Purpose

This folder organizes the documentation artifacts for phase 61.4.

61.4 begins from the certified baseline:

- 57.x CLOSED / CERTIFIED
- 61.1 CLOSED / CERTIFIED
- 61.2 CLOSED / CERTIFIED
- 61.3 CLOSED / CERTIFIED

Certified architecture remains:

```text
Leads
 -> LeadPersistencePort
 -> LeadPersistenceProvider
 -> RelationalLeadPersistenceAdapter
 -> Supabase PostgreSQL
```

## Source-of-Truth Boundaries

- Leads = Source of Truth for acquisition, marketing, and lead lifecycle.
- Patients = Source of Truth for person identity.
- Appointments = Source of Truth for scheduled operational events.

## Folder Map

```text
docs/implementation/61.4/
  README_61.4_DOCUMENTATION_STRUCTURE.md
  61.4-00-phase-opening/
  61.4-01-patient-domain-discovery/
  61.4-02-identity-discovery/
  61.4-03-patient-governance-discovery/
  61.4-04-patient-architecture-discovery/
  61.4-architecture-reviews/
  61.4-impact-assessments/
  61.4-manifests/

docs/governance/61.4/
```

## Current Produced Artifacts

Patient Domain Discovery:

- 61.4-DD-01_PATIENT_DOMAIN_DEFINITION.md
- 61.4-DD-02_PATIENT_LIFECYCLE_MODEL.md
- 61.4-DD-03_DOMAIN_BOUNDARY_MATRIX.md

Patient Architecture Discovery:

- 61.4-PA-01_PATIENT_AGGREGATE_BLUEPRINT.md
- 61.4-PA-02_PATIENT_DOMAIN_EVENTS_CATALOG.md
- 61.4-PA-03_PATIENT_RELATIONSHIP_MODEL.md
- 61.4-PA-04_PATIENT_CAPABILITY_MAP.md

## Governance Rule

This documentation structure does not authorize implementation.

Any implementation proposal must first include:

1. Architecture Review
2. Affected Dependencies
3. Risk Assessment
4. Technical Impact
5. Implementation Plan
6. Explicit approval

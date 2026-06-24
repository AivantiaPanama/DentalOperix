# DentalOperix Governance Master Index

## Document Control

| Field | Value |
|---|---|
| Document ID | GMI-70.0 |
| Classification | Normative |
| Status | APPROVED |
| Version | 1.0 |
| Date | 2026-06-24 |
| Active Technical Baseline | DENTALOPERIX_BASELINE_69_2 |
| Governance Framework | DGF v1.0 |
| Governance Maturity | GML-1 defined |

## Authority Statement

This document is the governance entry point for DentalOperix documentation. It identifies the active technical baseline, certified architectures, Sources of Truth, protected components, permanent restrictions, program status, and governance process.

DENTALOPERIX_BASELINE_69_2 is the active technical baseline. Earlier baselines, including 57.9, remain historical evidence only unless explicitly cited for audit traceability.

## Certified Architectures

### Leads

```text
LeadPersistencePort
  -> LeadPersistenceProvider
  -> RelationalLeadPersistenceAdapter
  -> Supabase PostgreSQL
```

### Patients

```text
PatientPersistencePort
  -> PatientPersistenceProvider
  -> RelationalPatientPersistenceAdapter
  -> Supabase PostgreSQL
```

## Sources of Truth

| Domain | Source of Truth |
|---|---|
| Leads | Acquisition / Marketing / Lead Lifecycle |
| Patients | Person Identity |
| Appointments | Scheduled Operational Events |

## Protected Components

- BookingDialog
- processDentalLead
- /api/leads/create
- Calendar
- Gmail
- FloatingDentalAIChat
- Home
- siteServices.ts

## Permanent Restrictions

- No Dual Write
- No Lead Replacement
- No New Lead Source of Truth
- No Persistence Re-Architecture
- No RBAC Bypass
- No Automated Patient Merge

## Required Governance Mode

Every proposal must be reviewed as:

1. Architect Principal
2. Technical Reviewer
3. Governance Guardian

Before any implementation proposal, the following must be delivered:

1. Architectural analysis
2. Affected dependencies
3. Risks
4. Technical impact
5. Compatibility with Baseline 69.2
6. Governance determination
7. Explicit approval gate before code generation

## Consolidated Program Status

| Program | Status |
|---|---|
| 57.x | CLOSED / CERTIFIED / HISTORICAL |
| 61.x | CLOSED / CERTIFIED |
| 62.x | CLOSED / CERTIFIED |
| 63.0 | CLOSED / DOCUMENTALLY CERTIFIED |
| 64.0 | CLOSED / IMPLEMENTATION PLANNING CERTIFIED |
| 65.0 | CLOSED / EXECUTION PREPARATION CERTIFIED |
| 66.1 | CLOSED / CERTIFIED |
| 67.x | CLOSED / CERTIFIED |
| 68.1-68.5 | CLOSED / CERTIFIED |
| 69.0 | CLOSED / AUTHORIZATION REVIEW APPROVED |
| 69.1 | CLOSED / IMPLEMENTATION PLANNING CERTIFIED |
| 69.2 | CLOSED / IMPLEMENTATION EXECUTION AUTHORIZED |
| 70.0 | GOVERNANCE PACK / APPROVED |
| 70.1 | GOVERNANCE CONSOLIDATION / APPROVED |
| 71.1 | PATIENTS DOMAIN ANALYSIS / CLOSED / CERTIFIED |
| 71.2 | PATIENTS FUNCTIONAL SPECIFICATION / CLOSED / CERTIFIED |
| 71.3 | ARCHITECTURE VALIDATION / CLOSED / CERTIFIED |
| 71.4 | IMPLEMENTATION PLANNING / CLOSED / CERTIFIED |
| 71.5 | CONTROLLED DEVELOPMENT / AUTHORIZED TO START |

## Document Hierarchy

1. Governance Master Index
2. Active technical baseline: DENTALOPERIX_BASELINE_69_2
3. Architecture Overview
4. Program Status
5. Executive Summary
6. Handoff documents
7. ADRs
8. Implementation documents
9. Certification and closure evidence

## Phase Closure Rule

A major phase cannot be formally closed until the governance retrospective is completed and the applicable registers are updated.

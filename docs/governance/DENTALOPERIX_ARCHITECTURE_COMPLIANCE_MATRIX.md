# DentalOperix Architecture Compliance Matrix

Status: ACTIVE GOVERNANCE ARTIFACT  
Created during: 73.x closure audit  
Baseline: DENTALOPERIX_BASELINE_71_5_RELEASE_CANDIDATE

## Purpose

This matrix centralizes the governance constraints, certified architecture decisions, evidence, and latest validation status for DentalOperix.

## Compliance Matrix

| Governance Constraint / Architecture | Required State | Evidence | Latest Validation | Status |
|---|---|---|---|---|
| Leads Source of Truth | Leads remains acquisition/marketing/lifecycle Source of Truth | Prior certified programs and 73.1-D review | 73.1-D.4 | Compliant |
| Patients Identity Domain | Patients models person identity only | 73.1-A, 73.1-B, 73.1-C, 73.1-D | 73.1-D.1/D.4 | Compliant |
| Appointments Operational Domain | Appointments models scheduled operational events | Prior certified programs and 73.1-D review | 73.1-D.4 | Compliant |
| No Dual Write | No duplicate persistence path or second Source of Truth | 73.1-B/73.1-C scope and validation | 73.1-D.4 | Compliant |
| No New Patient Domain | Existing `src/server/patients` implementation is the only Patients domain | 73.1-A rector and implementation reports | 73.1-D.4 | Compliant |
| No Persistence Re-Architecture | Persistence ports/adapters remain unchanged | 73.1-B/73.1-C implementation scope | 73.1-D.2/D.4 | Compliant |
| Protected Components | No changes to BookingDialog, processDentalLead, /api/leads/create, Calendar, Gmail, FloatingDentalAIChat, Home, siteServices.ts | 73.1-B/73.1-C manifests and closure reviews | 73.1-D.4 | Compliant |
| Hexagonal Architecture | Domain remains isolated from infrastructure/frameworks | 73.1-D.2 | 73.1-D.2 | Compliant |
| Public Contract Stability | Domain contracts remain backward compatible | 73.1-D.3 | 73.1-D.3 | Compliant |

## Current Certified Increments

- 72.1: CLOSED & CERTIFIED.
- 73.0: CLOSED & CERTIFIED.
- 73.1: CLOSED & CERTIFIED.
- 73.1-A: CLOSED & CERTIFIED.
- 73.1-B: CLOSED & CERTIFIED.
- 73.1-C: CLOSED & CERTIFIED.
- 73.1-D: CLOSED & CERTIFIED.

## Maintenance Rule

Every future program must update this matrix before governance closure.

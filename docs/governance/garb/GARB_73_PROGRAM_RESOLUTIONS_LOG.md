---
document_id: GARB-73-RESOLUTIONS-LOG
title: DentalOperix Program 73 Governance Resolutions Log
version: 1.0
status: ACTIVE
issued_on: 2026-06-25
classification: Governance Resolutions
---

# DentalOperix Program 73 Governance Resolutions Log

## GARB-73.1-002 - Strategy Adjustment

Status: APPROVED

Decision: Program 73.1 shifts from greenfield Patient Core Domain implementation to consolidation and alignment of the existing Patients implementation under `src/server/patients`.

## GARB-73.1-003 - Domain Conformance Audit Authorization

Status: APPROVED

Decision: Add 73.1-A Domain Conformance Audit before implementation batches. Produce a Specification to Implementation matrix before changing code.

## GARB-73.1-004 - 73.1-A as Implementation Rector

Status: APPROVED

Decision: `DENTALOPERIX_73_1A_DOMAIN_CONFORMANCE_AUDIT_REPORT.md` becomes the implementation rector for Program 73.1.

## GARB-73.1-005 - Conformance-First Methodology

Status: APPROVED

Decision: Existing components cannot be replaced, refactored, or removed without classification in the Domain Conformance Audit Report.

## Current Program 73 State

| Increment                                       | Status                               |
| ----------------------------------------------- | ------------------------------------ |
| 73.0 - Domain Discovery & Ubiquitous Language   | CLOSED & CERTIFIED                   |
| 73.1-A - Domain Conformance Audit               | CLOSED & CERTIFIED                   |
| 73.1-B - Aggregate Alignment                    | APPROVED FOR IMPLEMENTATION PLANNING |
| 73.1-C - Value Objects Alignment                | PENDING                              |
| 73.1-D - Domain Events Alignment                | PENDING                              |
| 73.1-E - Domain Services & Repository Alignment | PENDING                              |

## Standing Restrictions

- No Dual Write.
- No Lead Replacement.
- No new Source of Truth.
- No persistence re-architecture.
- No protected component modification.
- No automated Patient merge.

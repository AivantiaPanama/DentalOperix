---
document_id: DDR-73-001
title: Patient Identity Domain Decision Record
version: 1.0
status: APPROVED
baseline: DENTALOPERIX_BASELINE_71_5_RELEASE_CANDIDATE
issued_on: 2026-06-25
classification: Domain Decision Record
---

# DDR-73-001 - Patient Identity

## Context

Program 73 introduces the functional Patients domain. The project requires a clear decision regarding what owns patient identity and how it relates to Leads, Appointments, and future domains.

## Decision

**Patients is the sole Source of Truth for person identity inside DentalOperix.**

A `Patient` represents the identity of a person who receives care in the clinic. Leads remains responsible for acquisition and commercial lifecycle. Appointments remains responsible for scheduled operational events.

## Consequences

- `PatientId` must not be derived from mutable personal data.
- A Lead-to-Patient conversion may create a Patient but does not replace or delete the Lead.
- Appointments, Clinical Records, Billing, and future domains reference Patients through identifiers and contracts.
- Patient identity must not be duplicated as an owned concept in downstream domains.

## Alternatives Considered

### Alternative A - Lead becomes Patient

Rejected. This would violate the certified Leads Source of Truth and introduce Lead Replacement.

### Alternative B - Appointments owns patient identity

Rejected. Appointments owns scheduled events, not identity.

### Alternative C - Shared generic Contact identity

Rejected for Program 73. It would introduce a new Source of Truth and reopen certified architecture.

## Governance Impact

This decision preserves:

- No Lead Replacement.
- No new Source of Truth.
- No persistence re-architecture.
- Certified Sources of Truth.

## Status

**APPROVED**

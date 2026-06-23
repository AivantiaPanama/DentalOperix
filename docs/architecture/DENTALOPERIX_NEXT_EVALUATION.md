# DentalOperix Next Evaluation

Status: OPEN / EVIDENCE COLLECTION ONLY
Date Created: 2026-06-23
Owner: Architecture Governance

## Purpose

This document captures evidence for a future evaluation of whether DentalOperix should continue incremental evolution or consider a larger platform redesign.

No rewrite is approved by this document.

## Current Strategic Position

Continue with the current certified system:

```text
61.2 completion -> Governance Retrospective -> 61.3 Clinic Operations Foundation
```

A future DentalOperix Next evaluation may be appropriate after 61.3 if accumulated evidence shows that incremental evolution is slower, riskier, or more expensive than a controlled redesign.

## Evidence Collected

### Appointment Domain

- Current booking availability blocks date/time globally.
- Multi-provider availability is required for real clinic operation.
- Appointment Request and Confirmed Appointment must be separated.
- Audit trail is required for appointment operations.
- Local appointment store is not sufficient for operational appointment source of truth.

### Patient / Clinical Operations

- Patient Management remains future scope.
- Lead <-> Patient relationship remains deferred.
- Doctor <-> Patient permanent assignment remains deferred.

## Evaluation Criteria for Later Review

| Criterion | Question |
|---|---|
| Domain fit | Can the current architecture represent providers, patients, appointments, and clinical operations correctly? |
| Delivery speed | Is incremental delivery still faster than redesign? |
| Risk | Are protected components causing excessive implementation risk? |
| Data integrity | Can operational records be made durable without new source-of-truth conflicts? |
| Governance cost | Are rules protecting quality or creating avoidable bottlenecks? |

## Next Review Point

Evaluate during the Governance Retrospective after 61.3 Clinic Operations Foundation, unless a critical architecture blocker appears earlier.

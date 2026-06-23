# ADR-61.2-06A-04 Appointment Domain Reassessment

Status: ACCEPTED
Date: 2026-06-23

## Context

During PR-61.2-06 planning, the team identified that Appointment Operations cannot safely be designed as simple create/modify/cancel buttons because the underlying domain assumptions require correction.

## Decision

Appointment Operations are blocked until Appointment Domain Discovery is completed.

61.2-06A is now mandatory before Appointment Operations design or implementation.

## Required Discovery Questions

1. Where does a durable appointment live?
2. How is provider/resource availability calculated?
3. What states exist for Appointment Request and Confirmed Appointment?
4. How is audit captured?
5. How does Assistant-created appointment differ from Patient-booked appointment?
6. How does Calendar integration interact with appointment persistence?
7. How are alternatives recommended when exact availability is missing?

## Consequences

- PR-61.2-06 is split into discovery/foundation/workflow increments.
- The system avoids implementing appointment operations on top of incorrect date/time-only slot assumptions.
- Evidence is captured for future DentalOperix Next evaluation without approving a rewrite now.

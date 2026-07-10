# ADR-61.2-06A-02 Provider Availability

Status: ACCEPTED FOR 61.2-06A PLANNING
Date: 2026-06-23

## Context

The current front-end booking behavior blocks a time globally when any appointment exists for the selected date/time. This assumes a single clinical resource.

A real clinic may have multiple doctors/providers available at the same time.

## Decision

DentalOperix appointment availability must be evaluated by clinical resource, initially provider/doctor.

Correct availability concept:

```text
date + time + provider/resource = availability
```

Incorrect availability concept:

```text
date + time = availability
```

## Consequences

- Two appointments may exist at the same date/time if they are assigned to different available providers/resources.
- A conflict exists when the same provider/resource is unavailable for the requested time range.
- Provider assignment to an appointment is operational scheduling, not Doctor <-> Patient permanent assignment.

## Out of Scope

- Permanent Doctor <-> Patient assignment.
- Patient Management.
- Clinical record assignment.

## Governance

This preserves Leads = Source of Truth and does not introduce Patient Management into 61.2.

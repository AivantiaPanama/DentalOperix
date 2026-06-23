# ADR-61.2-06A-03 Appointment Request Lifecycle

Status: ACCEPTED FOR 61.2-06A PLANNING
Date: 2026-06-23

## Context

A requested date/time may not be available. Treating lack of exact availability as a hard error creates poor patient experience and increases front desk workload.

## Decision

Lack of exact availability is not an error. It should trigger alternative recommendations or assistant review.

Appointment Request is distinct from Confirmed Appointment.

Initial conceptual states:

```text
requested
suggested_alternative
pending_patient_confirmation
confirmed
needs_assistant_review
rescheduled
cancelled
expired
```

## Flow

### Exact availability exists

```text
request -> availability check -> confirmed
```

### Exact availability missing, patient accepts alternative

```text
request -> alternatives suggested -> patient confirms -> confirmed
```

### Exact availability missing, patient does not confirm

```text
request -> alternatives suggested -> no confirmation -> needs_assistant_review
```

## Capacity Rule

A confirmed appointment consumes provider/resource capacity.

Whether `pending_patient_confirmation` temporarily holds capacity is deferred to 61.2-06B architecture.

## Governance

This does not replace Leads. Lead acquisition remains governed by the certified Leads architecture.

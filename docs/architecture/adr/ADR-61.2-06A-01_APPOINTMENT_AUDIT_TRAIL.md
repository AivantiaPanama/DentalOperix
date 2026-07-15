# ADR-61.2-06A-01 Appointment Audit Trail

Status: ACCEPTED FOR 61.2-06A PLANNING
Date: 2026-06-23

## Context

Appointment operations may be performed by a patient, assistant, doctor, administrator, or system process. DentalOperix must distinguish who performed an operation and through which channel.

## Decision

Appointment operations must include audit metadata for creation, update/reschedule, and cancellation.

Minimum conceptual fields:

```ts
createdByUserId;
createdByRole;
createdVia;
createdAt;
updatedByUserId;
updatedByRole;
updatedVia;
updatedAt;
cancelledByUserId;
cancelledByRole;
cancelledVia;
cancelledAt;
cancellationReason;
```

## Consequences

- Assistant-created appointments and patient-booked appointments can result in the same confirmed appointment entity, but their origin remains auditable.
- Appointment operations must not be anonymous once performed by authenticated staff.
- Audit fields belong to Appointment/Appointment Operation domain, not Lead persistence.

## Governance

This does not modify Leads = Source of Truth and does not reopen Program 57.x.

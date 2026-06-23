# ADR-61.2-06B-01 - Appointment Foundation Boundary

Status: PROPOSED
Date: 2026-06-23
Owner: Architecture Governance

## Context

61.2-06A confirmed that current booking/calendar behavior does not provide a durable appointment domain. The current system uses browser localStorage appointments, Google Calendar events, and Lead calendar metadata. Availability is blocked by date/time only and does not support provider-aware capacity.

## Decision

Create an Appointment bounded context as a durable operational domain, separate from but linkable to Leads.

Appointments will represent scheduling lifecycle and provider capacity. Leads remain Source of Truth for lead intake and commercial follow-up.

## Consequences

### Positive

- Supports multi-provider availability.
- Supports appointment request lifecycle.
- Enables audit trail.
- Avoids overloading Lead persistence with scheduling rules.
- Enables future Assistant Appointment Workflow.

### Negative / Cost

- Requires new schema, repository, service, and tests.
- Requires future integration with BookingDialog, Calendar, and Assistant Workspace.

## Guardrails

- Appointment does not replace Lead.
- Appointment provider assignment is per appointment only.
- No Doctor ↔ Patient relationship is introduced.
- Calendar remains integration, not source of truth for appointment lifecycle.

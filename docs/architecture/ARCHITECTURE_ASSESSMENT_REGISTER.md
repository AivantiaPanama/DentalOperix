# Architecture Assessment Register

Status: OPEN
Date Created: 2026-06-23
Owner: Architecture Governance

## Purpose

This register captures architectural findings that may affect future platform direction, including whether DentalOperix should continue incremental evolution or later evaluate a larger re-architecture.

This register does not approve a rewrite. It preserves evidence for future Governance Retrospective review.

## Assessment Items

| ID      | Finding                                                                                             | Severity | Current Impact                                                               | Future Evaluation                                                |
| ------- | --------------------------------------------------------------------------------------------------- | -------: | ---------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| AAR-001 | Appointment availability currently behaves as date/time blocking in BookingDialog local read model. |     High | Multi-provider clinics cannot be represented correctly.                      | Requires provider/resource availability model.                   |
| AAR-002 | Appointment Request is not separated from Confirmed Appointment.                                    |     High | Patient request may be treated as booking confirmation too early.            | Requires lifecycle states and assistant review flow.             |
| AAR-003 | Assistant Today's Schedule uses localStorage appointment store.                                     |     High | Not durable/certified as operational appointment source.                     | Requires appointment persistence strategy.                       |
| AAR-004 | Provider in Today's Schedule is derived from service name.                                          |   Medium | Display can imply assignment that does not exist.                            | Requires explicit provider/resource assignment for appointments. |
| AAR-005 | Appointment audit trail does not exist.                                                             |     High | Cannot identify who created/updated/cancelled.                               | Requires audit metadata.                                         |
| AAR-006 | Possible future DentalOperix Next evaluation.                                                       |   Medium | Incremental evolution remains preferred today, but evidence must be tracked. | Reassess after 61.3 closure and Governance Retrospective.        |

## Governance Note

Findings in this register must not be used to bypass certified architecture. Leads remains Source of Truth for acquisition and booking origin.

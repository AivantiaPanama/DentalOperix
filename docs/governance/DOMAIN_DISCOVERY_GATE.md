# DentalOperix Governance Rule — Domain Discovery Gate

**Status:** ADOPTED  
**Origin:** 61.2-06A Appointment Domain Discovery and 61.3-00 Patient Domain Discovery  
**Date Adopted:** 2026-06-23

## Purpose

Prevent implementation of under-specified domains and reduce architectural rework.

## Rule

Before implementing a new domain or materially changing an existing domain, perform a Domain Discovery Gate.

Required outputs:

- Domain Discovery Report
- Architecture Review or Architecture Audit
- Relevant ADRs
- Open Architecture Watch Items
- Boundary decisions
- Source-of-truth impact assessment
- Protected component impact assessment
- Explicit approval before implementation

## Applies To

Examples:

- Appointment Domain
- Patient Identity Domain
- Treatment Episode Domain
- Insurance / Benefits Domain
- Billing Domain
- Communication / Marketing Consent Domain

## Non-Goal

This gate is not intended to block small UI-only refinements that do not introduce or materially alter a domain.

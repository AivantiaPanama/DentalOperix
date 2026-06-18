# ADR-026: Persistent Read Database Strategy

## Status

CERTIFIED

## Context

DentalOperix distinguishes operational persistence from analytical read persistence.

## Decision

Persistent Read Database is read-only, analytical and non-transactional.

The future relational database for Leads is a physical persistence mechanism for the Leads domain, not a new Source of Truth.

Current state:

- Leads = Source of Truth
- Google Sheet = Current Physical Persistence

Future state, only after explicit cutover approval:

- Leads = Source of Truth
- Relational Database = Future Physical Persistence

## Consequences

- PRD must not become the operational Leads database.
- Relational Leads persistence must not activate without cutover approval.
- Google Sheet remains active until a separately approved transition occurs.

## Governance

This ADR governs the distinction between analytical read persistence and operational Leads persistence.

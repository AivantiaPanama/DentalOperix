# ADR-015: Read Model Governance

## Status

CERTIFIED

## Context

DentalOperix uses read models to support analytical, dashboard and executive consumption without changing transactional ownership.

## Decision

Read Models are consumption artifacts only.

They are not:

- Source of Truth
- transactional systems
- operational write targets
- replacements for Leads

## Consequences

- Leads remains the Source of Truth.
- Read Models may be regenerated from governed sources.
- Read Models must not accept operational writes.
- Persistent Read Database remains read-only and analytical.

## Governance

This ADR supports READ MODEL PLATFORM v2 as CLOSED / FROZEN / GOVERNANCE BASELINED.

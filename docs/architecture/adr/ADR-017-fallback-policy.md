# ADR-017: Fallback Policy

## Status

CERTIFIED

## Context

Executive and analytical consumption requires controlled degradation when a preferred provider is unavailable.

## Decision

Fallback may be used only as a read resilience mechanism.

Fallback must not become:

- Dual Write
- Lead Replacement
- New Source of Truth
- PRD to Leads synchronization

## Consequences

- Provider failures must degrade into safe responses.
- Fallback usage must remain observable.
- Fallback must not mutate operational sources.

## Governance

Fallback supports availability without changing ownership or persistence authority.

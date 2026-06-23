# ADR-61.3-00-03 — Patient Duplicate Resolution

**Status:** ACCEPTED  
**Date:** 2026-06-23

## Context

Duplicate patients create operational risk, especially when multiple channels create records. However, automatic merges can incorrectly combine two distinct people.

## Decision

Use identity resolution before creation and require additional differentiators when ambiguity exists.

Initial matching policy:

1. Strong match: normalized name + email.
2. Ambiguous match: same/similar name without sufficient differentiator.
3. If ambiguous, request additional data such as second surname, CID, phone or another identifier.
4. Do not automatically merge ambiguous records.

## Consequences

- Prevents obvious duplicates.
- Avoids unsafe automatic identity merges.
- Creates a foundation for future Patient Identity Resolution service.

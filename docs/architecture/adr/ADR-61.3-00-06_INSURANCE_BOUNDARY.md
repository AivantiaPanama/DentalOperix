# ADR-61.3-00-06 — Insurance and Benefits Boundary

**Status:** ACCEPTED  
**Date:** 2026-06-23

## Context

Retired patients may receive discounts. Insured patients may require plan-specific conditions and coverage handling. These are important administrative facts but can grow into billing and benefits rules.

## Decision

Patient may store basic administrative indicators:

```text
retirement_status / is_retired
insurance_status / has_insurance
```

Patient may later link to insurance policy records, but automatic coverage calculation, discount application, billing rules and insurance plan conditions belong to future Insurance / Benefits / Billing domains.

## Consequences

- 61.3 can capture basic patient administrative facts.
- Billing and benefits logic remains bounded.
- Avoids embedding financial rules inside Patient identity.

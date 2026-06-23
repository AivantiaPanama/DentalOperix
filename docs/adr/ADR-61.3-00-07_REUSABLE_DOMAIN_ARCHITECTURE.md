# ADR-61.3-00-07 — Reusable Domain Architecture

**Status:** ACCEPTED  
**Date:** 2026-06-23

## Context

DentalOperix should be built with healthy development practices so current work can be reused in future products and modules.

## Decision

61.3 must follow reusable domain architecture:

```text
Domain
  -> Application Service
  -> Repository / Adapter
  -> Infrastructure
  -> UI
```

Rules:

1. Business rules must not live inside UI components.
2. Patient identity resolution, duplicate handling, merge policy, lifecycle and insurance boundary must be domain/application logic.
3. Persistence must be behind repositories/adapters.
4. UI must consume services/contracts.
5. Domain boundaries must support reuse beyond the current workspace.

## Consequences

- Better separation of responsibilities.
- Lower future rewrite risk.
- Reusable foundation for DentalOperix and potential future products such as MedicalOperix, VeterinaryOperix or ClinicOperix.

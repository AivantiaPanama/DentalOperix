# ADR-61.3-00-05 — Patient Lifecycle States

**Status:** ACCEPTED  
**Date:** 2026-06-23

## Context

A patient remains a patient even when inactive, unreachable, or archived. Deleting or replacing Patient identity would undermine historical and operational continuity.

## Decision

Approved Patient states:

```text
active
inactive
lost_contact
archived
```

The patient is not normally deleted; the patient changes state.

## Consequences

- Preserves patient identity.
- Supports future marketing/recovery flows.
- Avoids destructive deletion workflows.
- Leaves retention and soft delete policies deferred for future governance review.

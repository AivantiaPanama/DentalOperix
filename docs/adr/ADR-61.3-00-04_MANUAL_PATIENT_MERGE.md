# ADR-61.3-00-04 — Manual Patient Merge

**Status:** ACCEPTED  
**Date:** 2026-06-23

## Context

Duplicates may still occur despite identity resolution. Merging patient records affects identity, contact data, appointments, leads and future billing/treatment relationships.

## Decision

Patient merge must be manual, controlled, authorized, and auditable. Automatic merge is not allowed.

Future minimum audit model:

```text
merged_from_patient_id
merged_into_patient_id
merged_by_user_id
merged_at
merge_reason
```

Allowed roles should be defined in implementation, but the Discovery assumption is Assistant/Admin controlled.

## Consequences

- Reduces risk of incorrect merge.
- Supports accountability.
- Preserves legal/operational traceability.

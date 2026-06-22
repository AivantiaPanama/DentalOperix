# BLOCK-61.1-001 Resolution Note

Date: 2026-06-22

## Status

```text
RESOLVED
```

## Decision

```text
Option A — Administrator-Created Users
```

## Summary

The Role Assignment Workflow for Iteration 61.1 is resolved. DentalOperix 61.1 will use Administrator-created users with Administrator-only role assignment.

## Guardrails

- No self-registration in 61.1.
- No invitation workflow in 61.1.
- No role delegation in 61.1.
- No dual approval workflow in 61.1.
- User access must not be enabled until an initial role is assigned.
- `user.role.assign = Administrator only` remains mandatory.

## Certification Reference

```text
docs/architecture/ARCHITECTURE-CERTIFICATION-REVIEW-61.1-V1.1.md
```

## Architecture Compatibility

```text
Leads = Source of Truth: PRESERVED
Users = Identity only: PRESERVED
RBAC = Authorization only: PRESERVED
Certified persistence architecture: UNCHANGED
```

# ADR-61.3-00-01 — Patient Identity Normalization

**Status:** ACCEPTED  
**Date:** 2026-06-23

## Context

Patient data changes over time. A single patient may have multiple phones, emails, addresses and identifiers. Storing all variable data directly in one row would create duplication, overwrite history, and make future merge/audit workflows harder.

## Decision

Model Patient as a permanent identity with normalized related tables for variable data.

Foundational tables:

```text
patients
patient_phones
patient_emails
patient_addresses
patient_identifiers
```

Future tables may include:

```text
patient_insurance_policies
patient_contacts_or_guardians
patient_consents
patient_audit_events
patient_merge_events
```

## Consequences

- Patient identity remains stable.
- Contact points can change without replacing the patient.
- Identity resolution and merge can be implemented cleanly.
- Future insurance, billing and marketing domains can reuse the same identity base.

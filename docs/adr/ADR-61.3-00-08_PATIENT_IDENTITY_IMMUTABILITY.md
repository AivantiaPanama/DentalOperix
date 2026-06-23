# ADR-61.3-00-08 — Patient Identity Immutability

**Status:** ACCEPTED  
**Date:** 2026-06-23

## Context

A patient's phone, email, address, insurance, or administrative status may change. The person should not be replaced by a new Patient record when contact data changes.

## Decision

Patient identity is permanent and must not be replaced by ordinary updates.

Principle:

```text
The patient does not change; patient attributes and contact points change.
```

Valid operations:

```text
update patient attributes
add/update/deactivate contact points
merge duplicate patients manually
archive patient state
```

Invalid ordinary operation:

```text
replace Patient identity because contact data changed
```

## Consequences

- Supports legal/operational traceability.
- Strengthens normalized contact-point model.
- Requires future audit trail for important identity/contact updates.
- Reinforces manual merge policy.

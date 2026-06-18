# ADR-028: KPI Governance Architecture

## Status

CERTIFIED

## Context

Executive dashboards require consistent KPI definitions and lineage.

## Decision

Every governed KPI must define:

- name
- business meaning
- source
- owner
- calculation method
- consumption contract

## Consequences

- Ad hoc executive KPIs are not allowed.
- KPI lineage must be auditable.
- Dashboard consumption must use certified contracts.

## Governance

This ADR supports enterprise analytics and executive dashboard certification.

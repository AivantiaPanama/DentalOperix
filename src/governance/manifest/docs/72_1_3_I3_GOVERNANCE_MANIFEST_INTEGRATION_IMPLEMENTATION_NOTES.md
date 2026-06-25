# DentalOperix 72.1.3-I3 - Governance Manifest Integration Notes

## Purpose

This module introduces the Governance Manifest as the canonical read-only configuration artifact for baseline governance rule metadata.

## Included

- GovernanceManifest domain contract
- Manifest validation helper
- Manifest loader and parser ports
- StaticManifestLoader
- JsonManifestParser
- ManifestRuleRegistry adapter
- Baseline 71.5 RC governance manifest catalog

## Excluded

- Remote manifest download
- Database persistence
- Runtime manifest refresh
- Validation Engine changes
- Functional runtime changes
- Unit tests

## Boundary Constraints

The module is isolated under `src/governance/manifest` and depends only on:

- 72.1.3-I1 baseline domain contracts
- 72.1.3-I2 rule-registry contracts and in-memory registry
- TypeScript standard runtime

It does not depend on Leads, Patients, Appointments, Booking, Calendar, Gmail, UI, persistence adapters, or Sources of Truth.

## Governance Interpretation

The manifest is a configuration and certification descriptor. It does not execute validation rules and does not mutate application state.

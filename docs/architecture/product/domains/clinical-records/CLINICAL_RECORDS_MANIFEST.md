# Clinical Records Manifest

**Domain:** Clinical Records  
**Domain Type:** Clinical Information Domain  
**Product:** DentalOperix  
**Baseline:** DENTALOPERIX_BASELINE_71_5_RELEASE_CANDIDATE  
**Status:** Active  
**Current Program:** 75.x  
**Current Work Package:** WP-02 Clinical Notes Foundation

## Domain identity

Clinical Records is responsible for preserving the longitudinal clinical information generated during patient care.

## Domain owner

Clinical Information Domain.

## Certified source boundaries

| Related Domain | Relationship | Ownership |
|---|---|---|
| Leads | No direct dependency | Leads remains acquisition Source of Truth |
| Patients | Patient identity reference only | Patients owns identity |
| Appointments | Optional operational reference | Appointments owns scheduling operations |
| Clinical Records | Clinical information | Clinical Records owns clinical information |

## Aggregate root

- `ClinicalRecord`

## Initial entities

- `ClinicalNote`

## Certified architecture pattern

Domain -> Application Services -> Ports -> Provider -> Relational Adapter -> Supabase PostgreSQL

## Current capabilities

| Capability | Status |
|---|---|
| Clinical Record Foundation | Certified |
| Clinical Notes Foundation | Active |

## Future capabilities

- Clinical Assessment.
- Treatment Planning.
- Dental Chart.
- Clinical Attachments.
- Prescriptions.
- Clinical Analytics.

## Permanent restrictions

- No Dual Write.
- No Persistence Re-Architecture.
- No modification of protected components.
- No mutation of patient identity from Clinical Records.
- No appointment ownership transfer.
- No lead lifecycle coupling.

## Latest certified milestone

WP-01 Clinical Record Foundation — closed and certified.

## Current implementation milestone

WP-02 I1-M4 Clinical Note Persistence Port & Infrastructure Adapter — implemented / pending user validation.

## Next milestone

WP-02 I1-M5 Clinical Note API Boundary — pending authorization after validation.

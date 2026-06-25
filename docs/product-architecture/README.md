# DentalOperix Product Architecture

**Generated:** 2026-06-25  
**Baseline:** DENTALOPERIX_BASELINE_71_5_RELEASE_CANDIDATE  
**Status:** Product-specific architecture index.

## Purpose

This area contains DentalOperix-specific product and domain architecture. It is intentionally separate from the reusable Engineering & Governance Framework.

Product Architecture describes what DentalOperix is, which domains own which responsibilities, and which source-of-truth rules are certified.

## Certified Domain Ownership

| Domain | Certified Responsibility | Current State |
|---|---|---|
| Leads | Acquisition, marketing and lead lifecycle source of truth | Certified |
| Patients | Person identity domain | Certified |
| Appointments | Operational scheduling domain | Certified |
| Clinical Records | Clinical information domain | WP-01 Foundation closed and certified |
| Future Domains | Must reuse the approved framework and define only domain-specific facts | Pending |

## Separation Rule

Product Architecture must not duplicate framework methodology. It references the Engineering & Governance Framework for process and certification mechanics.

## Permanent Architecture Rules

- Leads = Source of Truth.
- Patients = Identity Domain.
- Appointments = Operational Domain.
- Clinical Records = Clinical Information Domain.
- New domains must not override certified ownership.
- Decisions already certified are not reopened without formal documentary evidence.

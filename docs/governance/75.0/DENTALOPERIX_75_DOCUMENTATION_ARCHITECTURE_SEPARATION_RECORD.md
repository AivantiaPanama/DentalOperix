# DentalOperix 75.x Documentation Architecture Separation Record

**Generated:** 2026-06-25  
**Baseline:** DENTALOPERIX_BASELINE_71_5_RELEASE_CANDIDATE  
**Status:** Approved documentation adequation record.

## Objective

Separate product-specific DentalOperix architecture documentation from reusable architecture, development and governance framework documentation.

## Audit Finding

The package contained extensive Program 74.x Clinical Records documentation and Program 75.x WP-01 documentation. Some documents described product/domain facts, while others described reusable methods, certification gates and governance practices.

## Decision

Create two top-level documentation areas:

1. `docs/product-architecture/`
   - DentalOperix-specific domain architecture.
   - Leads, Patients, Appointments, Clinical Records and future domains.

2. `docs/engineering-governance-framework/`
   - reusable Domain Analysis Framework;
   - reusable Functional Specification Framework;
   - reusable Architecture Validation Framework;
   - reusable Implementation Planning Framework;
   - reusable Work Package Certification Framework;
   - reusable ADR/FDR Framework;
   - reusable Traceability Framework;
   - reusable Rollout/Rollback Framework;
   - reusable Governance Retrospective Framework.

## Governance Meaning

The architecture of development is not recreated from scratch for every implementation.

The Program 74.x Clinical Records phases produced reusable artifacts. Those reusable practices are elevated to framework status. In Program 75.x, work package reviews are conformance reviews against certified architecture, not redesigns.

Each new domain reuses the approved framework and completes only domain-specific information.

Certified decisions are not reopened without formal documentary evidence.

## Restrictions Preserved

- No code modified.
- No implementation generated.
- No tests executed.
- Baseline unchanged.
- Leads = Source of Truth.
- Patients = Identity Domain.
- Appointments = Operational Domain.
- Clinical Records = Clinical Information Domain.
- No Dual Write.
- No Persistence Re-Architecture.
- No protected component modifications.

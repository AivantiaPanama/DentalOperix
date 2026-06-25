# DentalOperix New Chat Handoff - Program 75.x After Documentation Framework Separation

**Generated:** 2026-06-25  
**Baseline:** DENTALOPERIX_BASELINE_71_5_RELEASE_CANDIDATE

## Current State

- Program 74.x: Closed and Certified.
- Program 75.x: Initiated.
- WP-01 Clinical Record Foundation: Closed and Certified.
- WP-02 Clinical Encounter: Pending architectural conformance review; not started.
- Documentation architecture separation: Completed.

## Current Documentation Source

The current package separates:

1. `docs/product-architecture/` - DentalOperix product/domain architecture.
2. `docs/engineering-governance-framework/` - reusable architecture, development and governance framework.

## Certified Architecture

- Leads = Source of Truth.
- Patients = Identity Domain.
- Appointments = Operational Domain.
- Clinical Records = Clinical Information Domain.

## Mandatory Operating Mode

Always act as:

- Architect Principal.
- Technical Reviewer.
- Governance Guardian.

## Mandatory Before Any Future Code

Before any WP-02 or future implementation:

1. Review the current documentary package.
2. Identify the work-package document rector.
3. Review related code.
4. Validate compatibility with the baseline.
5. Treat work package reviews as conformance reviews, not architecture redesigns.
6. Present architectural analysis, dependencies, risks, technical impact, implementation plan and governance determination.
7. Wait for explicit user authorization.

## Framework Reuse Rule

The development architecture is not recreated from scratch. New work packages and domains reuse the Engineering & Governance Framework and complete only domain/work-package-specific information.

## Testing Policy

The assistant must not execute tests automatically. The user owns execution and evidence for build/type-check validation.

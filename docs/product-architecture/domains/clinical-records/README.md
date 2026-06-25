# Clinical Records Product Architecture

**Generated:** 2026-06-25  
**Baseline:** DENTALOPERIX_BASELINE_71_5_RELEASE_CANDIDATE

## Domain Classification

Clinical Records is the certified Clinical Information Domain.

## Current Certified State

- Program 74.x: closed and certified.
- 74.1 Domain Analysis: certified.
- 74.2 Functional Specification: certified.
- 74.3 Architecture Validation: certified.
- 74.4 Implementation Planning: certified.
- Program 75.x: initiated.
- WP-01 Clinical Record Foundation: closed and certified.
- WP-02: pending conformance review; not started.

## Product-Specific Scope

Clinical Records owns clinical information only. It references patient identity through PatientId and must not create, replace, merge or redefine patient identity.

## Certified Boundary

Clinical Records may depend on Patients through lookup/reference contracts only. It must not alter Leads, Appointments, protected UI components or existing source-of-truth rules.

## Implementation Pattern

Clinical Records follows the certified Ports & Adapters pattern used by existing domains:

Domain -> Application/Input Ports -> Output Ports -> Provider -> Relational Adapter -> Supabase PostgreSQL

## Reusable Framework Reference

Future Clinical Records work packages must reuse:

- Engineering & Governance Framework / Architecture Validation Framework.
- Engineering & Governance Framework / Implementation Planning Framework.
- Engineering & Governance Framework / Work Package Certification Framework.
- Engineering & Governance Framework / Traceability Framework.

Work package reviews are conformance reviews, not architecture redesigns.

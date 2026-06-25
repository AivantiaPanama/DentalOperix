---
document_id: PROG-72.0.1-NIAB
title: Non-Invasive Architecture Boundary
version: 1.0
status: APPROVED
baseline: DENTALOPERIX_BASELINE_71_5_RELEASE_CANDIDATE
framework: DentalOperix Governance Framework (DGF v1.0)
classification: Architecture Boundary
issued_on: 2026-06-24
source: ChatGPT governed implementation session
---

# Non-Invasive Architecture Boundary

## Allowed Change Zones

- `/governance`
- governance indexes
- governance registries
- governance templates
- governance schemas
- governance audit evidence
- non-executable governance script placeholders

## Prohibited Change Zones

- runtime application code
- domain logic
- persistence adapters
- API routes
- database migrations
- protected components
- certified Sources of Truth

## Architectural Rule

Governance Platform assets may observe, index, classify, validate, and report. They may not create alternate persistence paths, replace certified ports/adapters, or introduce new business Sources of Truth.

## Enforcement

Any future automation must fail closed when a proposed change touches a protected component or contradicts certified architecture.

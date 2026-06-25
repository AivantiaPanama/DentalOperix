---
document_id: SDK-72.1.1
title: Governance SDK Core Specification
version: 1.0
status: ACTIVE / AUTHORIZED FOR IMPLEMENTATION
baseline: DENTALOPERIX_BASELINE_71_5_RELEASE_CANDIDATE
framework: DentalOperix Governance Framework (DGF v1.0)
classification: SDK Core Specification
issued_on: 2026-06-24
source: ChatGPT governance implementation session
---

# Governance SDK Core Specification

## Objective

Provide the stable contracts, canonical models, registry abstractions, reporting primitives, versioning policy, and evidence abstractions used by the Governance Platform.

## Public Contracts

- IValidator.
- IValidationEngine.
- IReportGenerator.
- IEvidenceProvider.
- IRegistryProvider.
- IComplianceRule.

## Canonical Models

- ValidationContext.
- ValidationResult.
- ValidationReport.
- GovernanceFinding.
- GovernanceEvidence.
- ComplianceStatus.
- BaselineDescriptor.
- ADRDescriptor.
- RegistryDescriptor.

## Versioning Policy

- MAJOR: incompatible public contract changes.
- MINOR: backward-compatible capabilities.
- PATCH: internal fixes and clarifications.

## Compatibility Declaration

Governance SDK Core v1.0 is intended for DENTALOPERIX_BASELINE_71_5_RELEASE_CANDIDATE and Program 72.1 implementation increments.

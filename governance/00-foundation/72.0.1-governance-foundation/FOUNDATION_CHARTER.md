---
document_id: PROG-72.0.1-CHARTER
title: Program 72.0.1 Governance Foundation Charter
version: 1.0
status: ACTIVE
baseline: DENTALOPERIX_BASELINE_71_5_RELEASE_CANDIDATE
framework: DentalOperix Governance Framework (DGF v1.0)
classification: Governance Foundation
issued_on: 2026-06-24
program: 72.0 Governance Platform
increment: 72.0.1 Governance Foundation
source: ChatGPT governed implementation session
---

# Program 72.0.1 Governance Foundation Charter

## Objective

Initiate Program 72.0 by materializing the Governance Foundation as a transversal repository layer over the certified DentalOperix baseline.

## Scope

This increment creates repository-native governance structure, indexes, registries, status records, and audit controls required to operate the Baseline Audit Package and prepare later governance-as-code automation.

## Non-Invasive Rule

72.0.1 is documentation and governance-structure only. It must not modify runtime behavior, product features, domain boundaries, persistence architecture, APIs, protected UI components, or certified Sources of Truth.

## Certified Architecture Compatibility

This increment preserves:

- Leads Architecture CERTIFIED
- Patients Architecture CERTIFIED
- Patient Read CERTIFIED
- Sources of Truth CERTIFIED
- Ports & Adapters CERTIFIED
- Baseline Audit Package structure BAP-1 through BAP-10

## Protected Components

No changes are authorized to:

- BookingDialog
- processDentalLead
- /api/leads/create
- Calendar
- Gmail
- FloatingDentalAIChat
- Home
- siteServices.ts

## Governance Outcome

72.0.1 establishes the minimum operating governance layer needed for Program 72.0 without changing the certified application architecture.

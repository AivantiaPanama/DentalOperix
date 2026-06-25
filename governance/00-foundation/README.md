---
document_id: BAPC-README
title: Governance Platform Foundation
version: 1.0
status: APPROVED
baseline: DENTALOPERIX_BASELINE_71_5_RELEASE_CANDIDATE
framework: DentalOperix Governance Framework (DGF v1.0)
classification: Foundation
issued_on: 2026-06-24
source: ChatGPT governance consolidation session
---

# Governance Platform Foundation

## Purpose

This folder institutionalizes the Baseline Audit Package (BAP) design created during the governance session and prepares DentalOperix for operational governance toward GML-2.

## Current Baseline

`DENTALOPERIX_BASELINE_71_5_RELEASE_CANDIDATE` is the active reference baseline. It derives from `DENTALOPERIX_BASELINE_69_2` and preserves the certified Leads, Patients, and Patient Read architectures.

## Scope

This package is documentation-only. It does not modify application code, APIs, persistence, database schemas, protected components, or Sources of Truth.

## Permanent Restrictions Preserved

- No Dual Write
- No Lead Replacement
- No New Lead Source of Truth
- No Persistence Re-Architecture
- No RBAC Bypass
- No Automated Patient Merge

## Protected Components

- BookingDialog
- processDentalLead
- /api/leads/create
- Calendar
- Gmail
- FloatingDentalAIChat
- Home
- siteServices.ts

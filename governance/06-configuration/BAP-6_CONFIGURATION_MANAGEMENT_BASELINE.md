---
document_id: BAP-6
title: BAP-6 Configuration Management Baseline
version: 1.0
status: DESIGN APPROVED / READY FOR MATERIALIZATION
baseline: DENTALOPERIX_BASELINE_71_5_RELEASE_CANDIDATE
framework: DentalOperix Governance Framework (DGF v1.0)
classification: Configuration Management
issued_on: 2026-06-24
source: ChatGPT governance consolidation session
---

# BAP-6 Configuration Management Baseline

## Configuration Item Taxonomy

| Prefix  | CI Type           |
| ------- | ----------------- |
| CI-ARCH | Architecture      |
| CI-APP  | Application       |
| CI-API  | API               |
| CI-DB   | Database          |
| CI-INF  | Infrastructure    |
| CI-DOC  | Documentation     |
| CI-TEST | Test assets       |
| CI-REL  | Release artifacts |

## CI Classification Matrix

| Tier   | Description                                           | Examples                                                       |
| ------ | ----------------------------------------------------- | -------------------------------------------------------------- |
| Tier 1 | Critical; architecture and governance review required | Sources of Truth, certified architecture, protected components |
| Tier 2 | High impact; technical review required                | APIs, adapters, schemas                                        |
| Tier 3 | Operational; standard control                         | Scripts, deployment config, documentation, tests               |

## Closure State

Design approved. Certification requires a populated CI catalog and configuration audit.

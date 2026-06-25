# DentalOperix Engineering & Governance Framework

**Generated:** 2026-06-25  
**Baseline:** DENTALOPERIX_BASELINE_71_5_RELEASE_CANDIDATE  
**Status:** Approved reusable framework consolidation for Program 75.x and future work packages.

## Purpose

This framework captures reusable architecture, development, certification, traceability, rollout, rollback, ADR/FDR and governance-retrospective practices that must not be recreated from scratch for each DentalOperix implementation.

Program 74.x produced extensive Clinical Records documentation. The reusable method, review structure, certification gates and governance rules extracted from that work are elevated here as a project asset. Domain-specific content remains under Product Architecture or domain/program folders.

## Framework Principle

New work packages and new domains reuse the approved framework. They only complete domain-specific facts, constraints, decisions, evidence and traceability.

A work package review in Program 75.x is a conformance review against certified architecture, not a redesign of the architecture.

## Non-Reopening Rule

Certified architectural decisions remain closed unless formal documentary evidence requires review. No decision is reopened by default because a new work package or domain starts.

## Framework Modules

| Module | Purpose |
|---|---|
| Domain Analysis Framework | reusable discovery and bounded-context analysis method |
| Functional Specification Framework | reusable use-case and behavior specification method |
| Architecture Validation Framework | reusable architecture conformity and boundary validation method |
| Implementation Planning Framework | reusable implementation planning structure |
| Work Package Certification Framework | reusable closure/certification gates |
| ADR / FDR Framework | reusable decision record structure |
| Traceability Framework | reusable requirement-to-artifact mapping |
| Rollout / Rollback Framework | reusable operational safety planning |
| Governance Retrospective Framework | reusable keep/improve/remove/add review method |

## Mandatory Scope Controls

- No Dual Write.
- No Persistence Re-Architecture.
- No modification of protected components.
- No bypass of certified bounded-context ownership.
- No recreation of architecture from scratch for each implementation.

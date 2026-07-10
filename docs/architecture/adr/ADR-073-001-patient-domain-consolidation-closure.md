# ADR-073-001 - Patient Domain Consolidation Closure

Status: Accepted  
Program: 73.x  
Date: 2026-06-25

## Context

Programs 73.1-B and 73.1-C implemented incremental alignment of the Patients domain aggregate and value objects. Program 73.1-D assessed maturity, boundaries, contract stability, governance compliance, technical debt, and capability roadmap.

## Decision

The Patients domain is considered consolidated for the current scope. The 73.x program is closed and governance-certified.

The official active baseline remains `DENTALOPERIX_BASELINE_71_5_RELEASE_CANDIDATE` until a future approved rector adopts a successor baseline.

## Consequences

- Future work must not reopen certified Patients architecture without formal documentation and authorization.
- Clinical Records or other future capabilities require their own program charter and architecture analysis.
- Governance artifacts ADR Catalog, ACM, Capability Catalog, and Baseline Register should be maintained going forward.

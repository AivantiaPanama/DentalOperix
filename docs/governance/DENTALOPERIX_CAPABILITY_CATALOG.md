# DentalOperix Capability Catalog

Status: ACTIVE PLANNING ARTIFACT  
Created during: 73.x closure audit

## Purpose

This catalog complements program/increment planning with a business-capability view. It does not replace certified architecture, Sources of Truth, or governance constraints.

## Capability Map

| Capability | Current State | Notes |
|---|---|---|
| Lead Acquisition | Consolidated | Leads remains Source of Truth. |
| Patient Identity | Consolidated | Advanced maturity after 73.1-B and 73.1-C. |
| Appointment Management | Stable | Must remain operational event domain. |
| Clinical Records | Planned | Recommended future capability; requires dedicated rector. |
| Communications | Planned | Must consume existing domains; not a Source of Truth. |
| Billing & Payments | Planned | Should be modeled as independent domain. |
| Analytics & Reporting | Planned | Should use read models and not mutate transactional domains. |

## Recommended Priority

1. Preserve Patient Identity certification.
2. Open future Clinical Records only with new rector and baseline review.
3. Add Communications, Billing, and Analytics only through separate architecture reviews.

## Governance Rule

No capability may introduce a new Source of Truth or bypass certified domains without formal executive authorization and a rector document.

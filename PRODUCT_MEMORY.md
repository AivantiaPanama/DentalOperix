# Product Memory

## Purpose

This document preserves the certified evolution that led to DentalOperix Commercial Acceleration Baseline 1.0.

## Technical foundation preserved

DentalOperix entered the commercial acceleration cycle with governed capabilities for Leads, Patients, Appointments, Assistant Workspace and Authentication/RBAC. Earlier baselines remain preserved as historical and technical foundations.

## Commercial evolution

### PR-01 — Commercial Demo Foundation

A read-only data contract was added in `src/data/commercialDemoFoundation.ts`. It introduced the scenario `new-patient-acquisition` and organized the narrative into Patient Journey, Clinic Journey and Commercial Evidence. No runtime business process or persistence was added.

### PR-02 — Demo Journey Integration

`CommercialDemoJourneyCard` was added as a presentation-only composition in Assistant Workspace. It reused the PR-01 contract and presented patient, clinic and evidence narratives without owning business logic or modifying state.

### PR-03 — Commercial Presentation Layer

The public route `/commercial-demo` and four presentational components were added. The page composes the existing commercial foundation and journey card. It remains narrative and read-only rather than becoming a dashboard, analytics system or operational module.

## Publication memory

RB-01 synchronized the repository entry documents, institutional state, product memory, decision log, discovery log and knowledge registry. It then assembled and verified the official release package.

## Permanent lesson

Commercial value can be demonstrated through governed composition of existing capabilities without duplicating domains, persistence or Sources of Truth.

# DENTALOPERIX 70.1 / 71.5 Documentation Update Manifest

## Package
Documentation audit, governance consolidation, generated-document integration, status update, and ZIP refresh.

## Date
2026-06-24

## Active Technical Baseline
DENTALOPERIX_BASELINE_69_2

## Package Determination

```text
DOCUMENTATION PACKAGE UPDATED
GOVERNANCE STRUCTURE UPDATED
BASELINE 69.2 REMAINS ACTIVE
57.9 PRESERVED AS HISTORICAL CERTIFIED EVIDENCE
70.1 GOVERNANCE CONSOLIDATION CLOSED / CERTIFIED
71.5 CONTROLLED DEVELOPMENT AUTHORIZED TO START
CODE NOT MODIFIED BY THIS PACKAGE
PROTECTED COMPONENTS NOT MODIFIED
```

## New Governance Documents

- docs/governance/70.0-governance-pack/GDR-001_GOVERNANCE_MASTER_INDEX_ADOPTION.md
- docs/governance/70.0-governance-pack/GOVERNANCE_MASTER_INDEX.md
- docs/governance/70.0-governance-pack/DENTALOPERIX_GOVERNANCE_FRAMEWORK_V1.md
- docs/governance/70.0-governance-pack/GOVERNANCE_MATURITY_MODEL_GML1.md
- docs/governance/70.1-governance-consolidation/70_1_GOVERNANCE_CONSOLIDATION_PLAN.md
- docs/governance/70.1-governance-consolidation/70_1_GOVERNANCE_CONSOLIDATION_CLOSURE_REPORT.md

## New Master Registers

- docs/registries/DOCUMENT_REGISTRY.md
- docs/registries/BASELINE_TRANSITION_REGISTER.md
- docs/registries/CERTIFICATION_REGISTER.md
- docs/registries/GOVERNANCE_CHANGE_LOG.md

## New Audit Evidence

- docs/audits/70.1/70_1_CROSS_REFERENCE_VALIDATION_REPORT.md

## Integrated Patients Documents

- docs/implementation/71.0-patients-functional-development/71.2-functional-specification/DENTALOPERIX_71_2_PATIENTS_FUNCTIONAL_SPECIFICATION.md
- docs/implementation/71.0-patients-functional-development/71.3-architecture-validation/DENTALOPERIX_71_3_ARCHITECTURE_VALIDATION_REPORT.md
- docs/implementation/71.0-patients-functional-development/71.3-architecture-validation/DENTALOPERIX_71_3_DOMAIN_COMPLIANCE_MATRIX.md
- docs/implementation/71.0-patients-functional-development/71.3-architecture-validation/DENTALOPERIX_71_3_USE_CASE_TRACEABILITY_MATRIX.md
- docs/implementation/71.0-patients-functional-development/71.3-architecture-validation/DENTALOPERIX_71_3_IMPLEMENTATION_READINESS_ASSESSMENT.md
- docs/implementation/71.0-patients-functional-development/71.4-implementation-planning/71_4_IMPLEMENTATION_PLANNING.md
- docs/implementation/71.0-patients-functional-development/71.5-controlled-development/71_5_CONTROLLED_DEVELOPMENT_START.md

## Updated Handoff

- docs/ai-context/DENTALOPERIX_NEW_CHAT_HANDOFF_70_1_71_5.md

## No Modified Product Runtime Scope

- No source code changes were introduced intentionally.
- No database migrations were introduced.
- No API was changed.
- No protected component was modified.
- No Lead Source of Truth was changed.
- No Patient Source of Truth was changed.
- No Appointments Source of Truth was changed.

## 71.5.2 Roadmap Reordering Amendment

Added documentation file:

```text
docs/implementation/71.0-patients-functional-development/71.5-controlled-development/71.5.2_ROADMAP_REORDERING_DECISION.md
```

Updated handoff/start documentation to record:

```text
71.5.2 — Patient Application Layer
71.5.3 — Patient Persistence
```

This amendment is a minor roadmap sequencing update only. It does not modify the certified architecture, Baseline 69.2, protected components, sources of truth, or permanent restrictions.

## 71.5.2 Patient Application Layer Implementation Amendment

Implemented controlled application-layer files:

```text
src/server/patients/application/patient-application.types.ts
src/server/patients/application/patient-application.errors.ts
src/server/patients/application/patient-application-mappers.ts
src/server/patients/application/patient-application-service.ts
src/server/patients/application/patient-use-cases.ts
src/server/patients/application/patient-application-layer.test.ts
```

Modified controlled exports and architecture guards:

```text
src/server/patients/application/index.ts
src/server/patients/index.ts
src/architecture-guards.test.ts
```

Added evidence documentation:

```text
docs/implementation/71.0-patients-functional-development/71.5-controlled-development/71.5.2_PATIENT_APPLICATION_LAYER_EVIDENCE.md
docs/implementation/71.0-patients-functional-development/71.5-controlled-development/71.5.2_PATIENT_APPLICATION_LAYER_IMPLEMENTATION_SUMMARY.md
```

This implementation is application orchestration only and does not introduce Supabase, concrete persistence adapters, API routes, UI changes, Lead changes, or automated patient merge.

## 71.5.3 Patient Persistence

- Status: IMPLEMENTED / PENDING EXTERNAL VALIDATION
- Scope: PatientPersistenceProvider and RelationalPatientPersistenceAdapter.
- Created: `src/server/patients/persistence/*`.
- Modified: `src/server/patients/index.ts`, `src/architecture-guards.test.ts`.
- Preserved: API, UI, Leads, Appointments, protected components, Supabase migrations.
- Governance: Baseline 69.2 compatible; no dual write, no lead replacement, no persistence re-architecture, no RBAC bypass, no automated patient merge.## 71.5 Documentation Audit Refresh

Date: 2026-06-25

This package refresh integrates documentation generated during the ChatGPT-governed 71.5 workflow and updates closure states.

### Updated Increment States

```text
71.5.1 — Patient Domain Foundation      CLOSED / CERTIFIED
71.5.2 — Patient Application Layer      CLOSED / CERTIFIED
71.5.3 — Patient Persistence            CLOSED / CERTIFIED
71.5.4 — Patient API Integration        IN PROGRESS / PLANNING AUTHORIZED
```

### Added Program 71.5 Documents

```text
docs/implementation/71.0-patients-functional-development/71.5-controlled-development/71.5_PROGRAM_STATUS.md
docs/implementation/71.0-patients-functional-development/71.5-controlled-development/71.5_DOCUMENT_AUDIT_AND_UPDATE_REPORT.md
docs/implementation/71.0-patients-functional-development/71.5-controlled-development/71.5_CHAT_GENERATED_DOCUMENTATION_INDEX.md
```

### Added 71.5.1 Documents

```text
docs/implementation/71.0-patients-functional-development/71.5-controlled-development/71.5.1_PATIENT_DOMAIN_FOUNDATION_IMPLEMENTATION_SUMMARY.md
docs/implementation/71.0-patients-functional-development/71.5-controlled-development/71.5.1_GOVERNANCE_RETROSPECTIVE.md
docs/implementation/71.0-patients-functional-development/71.5-controlled-development/71.5.1_CERTIFICATION_REPORT.md
```

### Added 71.5.2 Documents

```text
docs/implementation/71.0-patients-functional-development/71.5-controlled-development/71.5.2_PATIENT_APPLICATION_LAYER_TECHNICAL_PLAN.md
docs/implementation/71.0-patients-functional-development/71.5-controlled-development/71.5.2_GOVERNANCE_RETROSPECTIVE.md
docs/implementation/71.0-patients-functional-development/71.5-controlled-development/71.5.2_CERTIFICATION_REPORT.md
```

### Added 71.5.3 Documents

```text
docs/implementation/71.0-patients-functional-development/71.5-controlled-development/71.5.3_GOVERNANCE_RETROSPECTIVE.md
docs/implementation/71.0-patients-functional-development/71.5-controlled-development/71.5.3_CERTIFICATION_REPORT.md
```

### Added 71.5.4 Documents

```text
docs/implementation/71.0-patients-functional-development/71.5-controlled-development/71.5.4_PATIENT_API_INTEGRATION_START.md
docs/implementation/71.0-patients-functional-development/71.5-controlled-development/71.5.4_PATIENT_API_INTEGRATION_TECHNICAL_PLAN.md
```

### Governance Determination

The update is documentation-only. Runtime code, database migrations, API behavior, UI components, Leads, Appointments, Google integrations, and protected components remain unchanged by this documentation refresh.

## 71.5.4 Patient API Integration

Date: 2026-06-25

Status: IMPLEMENTED / PENDING VALIDATION

### Implemented Scope

Created controlled Patient API endpoints:

```text
src/routes/api/patients/create.ts
src/routes/api/patients/update.ts
src/routes/api/patients/search.ts
src/routes/api/patients/create.test.ts
src/routes/api/patients/update.test.ts
src/routes/api/patients/search.test.ts
```

Modified controlled Patient API validation and architecture evidence:

```text
src/server/patients/api-validation.ts
src/architecture-guards.test.ts
```

### Governance Notes

- API routes consume the certified Patient Application Layer.
- API routes obtain persistence only through PatientPersistenceProvider helpers.
- No direct API access to Supabase or relational adapters was introduced.
- No Lead source-of-truth replacement, dual write, automated merge, UI changes, Google integration changes, protected component changes, or database migrations were introduced.
- Duplicate patient search results return manual-review semantics via HTTP 409; no automated merge path is implemented.

### Validation Evidence To Execute

```bash
npm run test -- src/routes/api/patients/create.test.ts src/routes/api/patients/update.test.ts src/routes/api/patients/search.test.ts src/routes/api/patients/list.test.ts src/routes/api/patients/$id.test.ts src/architecture-guards.test.ts
npm run test
npm run build
```

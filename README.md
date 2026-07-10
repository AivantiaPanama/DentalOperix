# DentalOperix — Baseline 75 WP-02 Certified

## Canonical Foundation Release Structure

This package implements the Baseline 75 canonical structure:

```text
/docs
    /foundation
    /governance
    /architecture
    /knowledge
    /reference-implementations
    /work-packages

/src
    /domains
    /shared
    /platform

/tools
    /foundation-release-builder
    /governance
```

Runtime code import paths are preserved. The `src/domains`, `src/shared`, and `src/platform` folders establish the canonical target boundaries without moving certified runtime code in this release.

---

# DentalOperix

## Current Governance Baseline

```text
DENTALOPERIX_BASELINE_69_2
IMPLEMENTATION PLANNING: CERTIFIED
IMPLEMENTATION EXECUTION: AUTHORIZED FOR PATIENTS DOMAIN ONLY
GOVERNANCE: ACTIVE
ARCHITECTURE: CERTIFIED
```

## Certified architectures

### Leads

```text
LeadPersistencePort
→ LeadPersistenceProvider
→ RelationalLeadPersistenceAdapter
→ Supabase PostgreSQL
```

### Patients

```text
PatientPersistencePort
→ PatientPersistenceProvider
→ RelationalPatientPersistenceAdapter
→ Supabase PostgreSQL
```

## Sources of Truth

- Leads = Acquisition / Marketing / Lead Lifecycle
- Patients = Person Identity
- Appointments = Scheduled Operational Events

## Protected components

Do not modify without a new governance review:

- BookingDialog
- processDentalLead
- /api/leads/create
- Calendar
- Gmail
- FloatingDentalAIChat
- Home
- siteServices.ts

## Permanent restrictions

- No Dual Write.
- No Lead Replacement.
- No New Lead Source of Truth.
- No Persistence Re-Architecture.
- No RBAC Bypass.
- No Automated Patient Merge.

## Latest documentation package

See:

- DENTALOPERIX_BASELINE_69_2_UPDATE_MANIFEST.md
- docs/implementation/68.0/
- docs/governance/69.0/
- docs/audits/69.0/69.2_DOCUMENTATION_STRUCTURE_AUDIT.md
- docs/ai-context/DENTALOPERIX_NEW_CHAT_HANDOFF_69_2.md

---

## Documentation Update Notice — 70.1 / 71.5

This package includes a documentation and governance consolidation update generated on 2026-06-24.

Active technical baseline remains: `DENTALOPERIX_BASELINE_69_2`.

Added governance structure:

- Governance Master Index
- DentalOperix Governance Framework v1.0
- Governance Maturity Model GML-1
- Document Registry
- Certification Register
- Baseline Transition Register
- Governance Change Log
- 70.1 Cross-Reference Validation Report
- 71.2 Patients Functional Specification
- 71.3 Architecture Validation evidence
- 71.4 Implementation Planning
- 71.5 Controlled Development start record

No runtime product code was intentionally modified by this documentation update.


## Governance Platform Status - 72.1.2 Certification

- 72.1.1 Governance SDK Core: CLOSED & CERTIFIED
- 72.1.2 Governance Validation Engine: CLOSED & CERTIFIED
- Local evidence submitted by the project owner confirmed 135/135 test files and 583/583 tests passing.
- Test execution evidence is user-owned for future DentalOperix increments; certification is performed after evidence review.

---

## Foundation Release Structure Note

As of **DENTALOPERIX_BASELINE_75_WP02_CERTIFIED**, the repository uses a cleaner Foundation Release structure:

- Active project/runtime files remain at repository root.
- Foundation Release materials are under `docs/foundation-release/75.0/`.
- Historical governance and previous package artifacts are under `docs/historical-governance/`.
- RI-001 materials are under `docs/reference-implementations/RI-001_Clinical_Notes_Foundation/`.

See:

- `docs/foundation-release/75.0/structure/75_STRUCTURE_UPDATE_REPORT.md`
- `docs/foundation-release/75.0/structure/CANONICAL_REPOSITORY_STRUCTURE_75.md`

# DentalOperix — Commercial Acceleration Baseline 1.0

## Official Institutional Publication

**Project:** DentalOperix  
**Edition:** Commercial Acceleration Baseline  
**Version:** 1.0  
**Publication phase:** RB-01 — Release Baseline Finalization  
**Publication date:** 2026-07-11

DentalOperix is a governed dental-clinic product baseline. This edition publishes the certified Commercial Acceleration capability as a presentation and composition layer over existing product capabilities.

## Official status

- Editorial Infrastructure: **CERTIFIED** — EP-00, EP-01, EP-02.
- Baseline Foundation: **CERTIFIED** — BC-00, BC-00B, BC-01, BC-02, BC-03, BC-04, BC-05, PEC-01, BC-06.
- Editorial Integration Review: **PASS**.
- Institutional Certification: **COMPLETED**.
- Commercial increments: **PR-01, PR-02 and PR-03 implemented and evidenced**.
- Publication Engineering: **RB-01 completed for this release package**.

## Commercial Acceleration capability

The commercial demo is not a new domain, application, operational module, persistence mechanism, or Source of Truth. It is a read-only composition and presentation capability.

```text
/commercial-demo
        ↓
Commercial Presentation Components
        ↓
Commercial Demo Journey
        ↓
Existing DentalOperix Capabilities
```

Certified implementation:

- **PR-01 — Commercial Demo Foundation**
  - `src/data/commercialDemoFoundation.ts`
  - scenario: `new-patient-acquisition`
  - Patient Journey, Clinic Journey and Commercial Evidence.
- **PR-02 — Demo Journey Integration**
  - `src/components/assistant/CommercialDemoJourneyCard.tsx`
  - read-only presentation within Assistant Workspace.
- **PR-03 — Commercial Presentation Layer**
  - public route: `/commercial-demo`
  - presentational components under `src/components/commercial/`.

## Preserved architectural boundaries

The edition introduces no new domain, API, table, migration, persistence layer or Source of Truth. The following boundaries remain protected:

- BookingDialog.
- processDentalLead.
- Lead lifecycle.
- Patient Identity boundaries.
- Appointment lifecycle.
- Authentication/RBAC.

## Sources of Truth

- Leads = Acquisition, marketing and lead lifecycle.
- Patients = Person identity.
- Appointments = Scheduled operational events.

## Repository navigation

- [MANIFEST.md](MANIFEST.md) — official contents and publication authority.
- [INDEX.md](INDEX.md) — institutional navigation index.
- [CURRENT_PRODUCT_STATUS.md](CURRENT_PRODUCT_STATUS.md) — current certified state.
- [PRODUCT_MEMORY.md](PRODUCT_MEMORY.md) — institutional product memory.
- [PRODUCT_DECISION_LOG.md](PRODUCT_DECISION_LOG.md) — certified decisions.
- [DISCOVERY_LOG.md](DISCOVERY_LOG.md) — discovery candidates and status.
- [KNOWLEDGE_REGISTRY.md](KNOWLEDGE_REGISTRY.md) — knowledge and evidence registry.
- [RELEASE_NOTES.md](RELEASE_NOTES.md) — release summary.
- [CHANGELOG.md](CHANGELOG.md) — publication changes.
- [CONTINUITY_STATUS.md](CONTINUITY_STATUS.md) — closure and next mission.
- [`docs/publication-engineering/RB-01/`](docs/publication-engineering/RB-01/) — synchronization, verification and traceability evidence.

## Historical continuity

The repository preserves earlier governed baselines, including Baseline 69.2, 71.5, Governance Platform 72.1 and Foundation Release 75 WP-02. They remain historical and technical antecedents; they are not replaced or reinterpreted by this commercial publication.

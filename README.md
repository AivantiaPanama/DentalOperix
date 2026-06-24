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

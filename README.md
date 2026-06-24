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

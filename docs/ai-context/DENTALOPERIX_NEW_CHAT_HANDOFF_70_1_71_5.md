# DentalOperix New Chat Handoff — 70.1 / 71.5

## Active Context

Project: DentalOperix  
Active Baseline: DENTALOPERIX_BASELINE_69_2  
Governance Framework: DentalOperix Governance Framework (DGF v1.0)  
Maturity Level: GML-1

## Program

71.5 — Controlled Development

## Increment Status

| Increment | Name | Status |
|---|---|---|
| 71.5.1 | Patient Domain Foundation | CLOSED / CERTIFIED |
| 71.5.2 | Patient Application Layer | CLOSED / CERTIFIED |
| 71.5.3 | Patient Persistence | CLOSED / CERTIFIED |
| 71.5.4 | Patient API Integration | CLOSED / CERTIFIED |
| 71.5.5 | Patient Read Services & Query Integration | IMPLEMENTATION IN PROGRESS |

## Certified Architectures

### Leads

```text
LeadPersistencePort
  -> LeadPersistenceProvider
  -> RelationalLeadPersistenceAdapter
  -> Supabase PostgreSQL
```

### Patients

```text
PatientPersistencePort
  -> PatientPersistenceProvider
  -> RelationalPatientPersistenceAdapter
  -> Supabase PostgreSQL
```

## Sources of Truth

- Leads = Acquisition / Marketing / Lead Lifecycle
- Patients = Person Identity
- Appointments = Scheduled Operational Events

## Permanent Restrictions

- No Dual Write
- No Lead Replacement
- No New Lead Source of Truth
- No Persistence Re-Architecture
- No RBAC Bypass
- No Automated Patient Merge

## Protected Components

- BookingDialog
- processDentalLead
- `/api/leads/create`
- Calendar
- Gmail
- FloatingDentalAIChat
- Home
- siteServices.ts

## Latest Evidence

71.5.4 certification evidence:

```text
Test Files: 130 passed / 130
Tests: 567 passed / 567
Failures: 0
Duration: 26.54s
```

## Mandatory Operating Mode

Act as:

- Architect Principal
- Technical Reviewer
- Governance Guardian

Before generating code, provide:

1. Architectural analysis.
2. Affected dependencies.
3. Risks.
4. Technical impact.
5. Baseline 69.2 compatibility.
6. Governance determination.
7. Wait for explicit approval.

## Active Next Work

71.5.5 — Patient Read Services & Query Integration is authorized and started. Implementation remains in progress and must be validated before closure.

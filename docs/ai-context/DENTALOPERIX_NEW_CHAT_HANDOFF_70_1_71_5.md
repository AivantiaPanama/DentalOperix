# DENTALOPERIX NEW CHAT HANDOFF — GOVERNANCE CONSOLIDATION 70.1 / CONTROLLED DEVELOPMENT 71.5

## Current Official Baseline

DENTALOPERIX_BASELINE_69_2

## Governance State

```text
DGF v1.0 ACTIVE
GML-1 DEFINED
GOVERNANCE MASTER INDEX APPROVED
70.1 GOVERNANCE CONSOLIDATION CLOSED / CERTIFIED
71.5 CONTROLLED DEVELOPMENT ACTIVE
```

## Program Status

```text
57.x CLOSED / CERTIFIED / HISTORICAL
61.x CLOSED / CERTIFIED
62.x CLOSED / CERTIFIED
63.0 CLOSED / DOCUMENTALLY CERTIFIED
64.0 CLOSED / IMPLEMENTATION PLANNING CERTIFIED
65.0 CLOSED / EXECUTION PREPARATION CERTIFIED
66.1 CLOSED / CERTIFIED
67.x CLOSED / CERTIFIED
68.1-68.5 CLOSED / CERTIFIED
69.0 CLOSED / AUTHORIZATION REVIEW APPROVED
69.1 CLOSED / IMPLEMENTATION PLANNING CERTIFIED
69.2 CLOSED / IMPLEMENTATION EXECUTION AUTHORIZED
70.0 GOVERNANCE PACK APPROVED
70.1 GOVERNANCE CONSOLIDATION CLOSED / CERTIFIED
71.1 PATIENTS DOMAIN ANALYSIS CLOSED / CERTIFIED
71.2 PATIENTS FUNCTIONAL SPECIFICATION CLOSED / CERTIFIED
71.3 ARCHITECTURE VALIDATION CLOSED / CERTIFIED
71.4 IMPLEMENTATION PLANNING CLOSED / CERTIFIED
71.5.1 PATIENT DOMAIN FOUNDATION CLOSED / CERTIFIED
71.5.2 PATIENT APPLICATION LAYER CLOSED / CERTIFIED
71.5.3 PATIENT PERSISTENCE CLOSED / CERTIFIED
71.5.4 PATIENT API INTEGRATION IN PROGRESS / PLANNING AUTHORIZED
```

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
Patient Domain
  -> Patient Application Layer
  -> PatientPersistencePort
  -> PatientPersistenceProvider
  -> RelationalPatientPersistenceAdapter
  -> Supabase PostgreSQL
```

## Sources of Truth

- Leads = Acquisition / Marketing / Lead Lifecycle
- Patients = Person Identity
- Appointments = Scheduled Operational Events

## Protected Components

- BookingDialog
- processDentalLead
- /api/leads/create
- Calendar
- Gmail
- FloatingDentalAIChat
- Home
- siteServices.ts

## Permanent Restrictions

- No Dual Write
- No Lead Replacement
- No New Lead Source of Truth
- No Persistence Re-Architecture
- No RBAC Bypass
- No Automated Patient Merge

## Required Operating Mode

- Architect Principal
- Technical Reviewer
- Governance Guardian

## Before Any Code Proposal

Always provide:

1. Architectural analysis
2. Affected dependencies
3. Risks
4. Technical impact
5. Compatibility with DENTALOPERIX_BASELINE_69_2
6. Governance determination
7. Technical implementation plan
8. Wait for explicit approval before generating code

## Active Development Increment

71.5.4 — Patient API Integration

## Completed Controlled Development Increments

- 71.5.1 — Patient Domain Foundation: CLOSED / CERTIFIED
- 71.5.2 — Patient Application Layer: CLOSED / CERTIFIED
- 71.5.3 — Patient Persistence: CLOSED / CERTIFIED

## 71.5.4 Allowed Scope

- Patient API routes
- HTTP validation
- Request / response DTO handling
- Application-error to HTTP-status mapping
- Patient API integration tests
- Architecture guard updates
- Evidence documentation

## 71.5.4 Excluded Scope

- UI components
- BookingDialog
- processDentalLead
- /api/leads/create
- Calendar
- Gmail
- FloatingDentalAIChat
- Home
- siteServices.ts
- Leads changes
- Appointments changes
- Supabase migrations
- Automated Patient Merge
- Dual Write

## Latest Consolidated Evidence

```text
Test Files: 127 passed / 127
Tests: 557 passed / 557
Failed: 0
```

## Documentation Refresh

See:

- docs/implementation/71.0-patients-functional-development/71.5-controlled-development/71.5_PROGRAM_STATUS.md
- docs/implementation/71.0-patients-functional-development/71.5-controlled-development/71.5_DOCUMENT_AUDIT_AND_UPDATE_REPORT.md
- docs/implementation/71.0-patients-functional-development/71.5-controlled-development/71.5_CHAT_GENERATED_DOCUMENTATION_INDEX.md

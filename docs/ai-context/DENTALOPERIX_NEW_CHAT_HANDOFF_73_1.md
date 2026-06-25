# DentalOperix New Chat Handoff - Program 73.1

## Current Baseline

`DENTALOPERIX_BASELINE_71_5_RELEASE_CANDIDATE`

## Program State

### Program 72.1 - Governance Platform Implementation

Status: CLOSED & CERTIFIED

Certified increments:

- 72.1.1 Governance SDK Core
- 72.1.2 Governance Validation Engine
- 72.1.3-R1 RBAC Permission Catalog Alignment
- 72.1.3-I1 Domain Foundation
- 72.1.3-I2 Rule Registry Infrastructure
- 72.1.3-I3 Governance Manifest Integration
- 72.1.3-I4 Manifest Validation & Compatibility Engine

### Program 73 - Patient Domain Implementation

Status: ACTIVE

- 73.0 Patient Domain Discovery & Ubiquitous Language: CLOSED & CERTIFIED
- 73.1 Patient Core Domain: APPROVED FOR IMPLEMENTATION

## Required Operating Mode

Act as:

- Architect Principal
- Technical Reviewer
- Governance Guardian

Before any implementation, provide:

- Documentary review.
- Architectural analysis.
- Affected dependencies.
- Risks.
- Technical impact.
- Baseline compatibility.
- Governance determination.
- Wait for explicit authorization before code generation.

## Permanent Restrictions

Do not modify:

- BookingDialog
- processDentalLead
- `/api/leads/create`
- Calendar
- Gmail
- FloatingDentalAIChat
- Home
- siteServices.ts

Do not introduce:

- Dual Write
- Lead Replacement
- New Source of Truth
- Persistence re-architecture
- Certified functional architecture changes

## Test Policy

Assistant does not generate or execute unit tests as implementation deliverables.

User runs locally:

```bash
npx tsc --noEmit
npm run build
npm run test
```

Assistant then performs:

- Architecture Conformance Review
- Baseline Compliance Review
- Governance Validation
- Governance Retrospective
- Increment certification

## 73.1 Authorized Scope

Implement only the pure Patient Core Domain.

Authorized:

- Patient aggregate
- PatientId
- PatientName
- BirthDate
- Gender
- Email
- PhoneNumber
- Address
- EmergencyContact
- PatientStatus
- PatientCreated
- PatientUpdated
- PatientArchived
- PatientRestored
- PatientValidationService
- PatientIdentityService
- DuplicateDetectionService
- PatientRepository
- PatientFactory

Not authorized in 73.1:

- Persistence adapters
- Supabase
- SQL
- HTTP/API endpoints
- UI/React
- Appointments integration
- Lead conversion implementation
- Clinical records
- Billing

## Reference Documents

- `docs/domain/patients/73.0/DENTALOPERIX_73_0_PATIENT_DOMAIN_DISCOVERY_AND_UBIQUITOUS_LANGUAGE_SPECIFICATION.md`
- `docs/domain/patients/73.1/DENTALOPERIX_73_1_PATIENT_CORE_DOMAIN_ARCHITECTURE_READINESS.md`
- `docs/governance/domain-decisions/DENTALOPERIX_DDR_73_001_PATIENT_IDENTITY.md`
- `docs/governance/domain-decisions/DENTALOPERIX_DOMAIN_GLOSSARY_REGISTRY_v1.md`

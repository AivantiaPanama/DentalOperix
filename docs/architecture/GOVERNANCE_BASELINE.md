# Governance Baseline

## Permanent Restrictions

Do Not Modify:
- BookingDialog
- processDentalLead
- /api/leads/create
- Calendar
- Gmail
- FloatingDentalAIChat
- Home
- siteServices.ts

## Architectural Baseline

Leads = Source of Truth

Certified Read Models:
- PATIENT_MASTER
- PATIENT_MASTER_SNAPSHOT

Persistent Read Database:
- Read Only
- Certified
- Analytical
- Non Transactional

Forbidden Patterns:
- Dual Write
- Product Migration
- Lead Replacement
- New Source of Truth
- Projection Engine Adoption
- PRD to Leads Synchronization

Implementation Assessments may inspect, inventory, audit and classify.
Implementation Assessments may not re-architect, alter governance baselines or change the Source of Truth.

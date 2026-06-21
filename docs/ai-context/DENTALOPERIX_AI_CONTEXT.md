# DentalOperix AI Context

Status: ACTIVE
Owner: AI Delivery Governance
Last updated: 2026-06-20

## Project

DentalOperix is an intelligent clinical-commercial operating system for dental clinics.

## Certified Architecture

```text
Leads
  -> LeadPersistencePort
  -> LeadPersistenceProvider
  -> RelationalLeadPersistenceAdapter
  -> Supabase PostgreSQL
```

## Permanent Rule

```text
Leads = Source of Truth
```

## Official Timezone

```text
America/Panama
```

## Current Validated Booking Behavior

```text
Patient books appointment
  -> Lead stored in Supabase
  -> Clinic Calendar event created
  -> Patient receives one confirmation email
  -> Email includes appointment details and invite.ics
  -> Outlook/Gmail/Apple Calendar compatibility expected
  -> UI shows appointment confirmation
```

## Roles

* Patient
* Assistant
* Doctor/Dentist
* Administrator

## Permanent Restrictions

* No Dual Write.
* No Lead Replacement.
* No new source of truth.
* No Analytics write-back.
* No RBAC bypass.
* No protected component changes without explicit approval.

## Protected Components

* BookingDialog
* processDentalLead
* /api/leads/create
* Calendar
* Gmail
* FloatingDentalAIChat
* Home
* siteServices.ts

## Required Process

Before proposing implementation:

1. Architectural analysis.
2. Affected dependencies.
3. Risks.
4. Technical impact.
5. Compatibility with certified architecture.
6. Implementation plan.
7. Wait for explicit approval before code.





## Product Terminology



Reference:



61.0\_PRODUCT\_GLOSSARY.md


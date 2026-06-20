# DentalOperix Project Scope and Expected Behavior

## Purpose

This document is the living continuity reference for DentalOperix. It records what the system is expected to do so future chats, reviews, and hotfixes do not lose project scope.

## Current Certified Baseline

```text
Program 57.x: CLOSED and CERTIFIED
Persistence Transition: CLOSED
Production Cutover: CERTIFIED
Source of Truth: Leads
```

Certified persistence architecture:

```text
Leads
  -> LeadPersistencePort
  -> LeadPersistenceProvider
  -> RelationalLeadPersistenceAdapter
  -> Supabase PostgreSQL
```

## Non-Negotiable Constraints

```text
Dual Write: NO
Product Migration: NO
Lead Replacement: NO
New Source of Truth: NO
RBAC Bypass: NO
Analytics Writes: NO
```

Protected components require explicit approval before modification:

```text
BookingDialog
processDentalLead
/api/leads/create
Calendar
Gmail
FloatingDentalAIChat
Home
siteServices.ts
```

## Public Booking Expected Behavior

When a patient books a dental appointment from the public site:

1. Patient enters valid contact and treatment data.
2. Patient selects date and time.
3. Confirm button provides immediate loading feedback.
4. System creates the lead through the certified persistence provider.
5. Supabase PostgreSQL stores the lead as the source of truth.
6. Clinic calendar receives the event.
7. Patient is added as a calendar attendee.
8. Clinic notification email is added as a calendar attendee unless duplicated.
9. Calendar update notifications are requested for all attendees.
10. Patient receives a confirmation email even if the patient does not use Google Calendar.
11. Clinic receives an operational notification email.
12. UI confirmation must reflect actual known delivery state.

Expected booking chain:

```text
BookingDialog
  -> createDentalAppointment
  -> processDentalLead
  -> LeadPersistenceProvider
  -> RelationalLeadPersistenceAdapter
  -> Supabase PostgreSQL
  -> Google Calendar
  -> Gmail patient confirmation
  -> Gmail clinic notification
```

## Notification Policy

Calendar and Gmail are downstream operational integrations. They do not define the source of truth.

If notification delivery fails:

- the lead must remain saved;
- the calendar result must remain visible if created;
- the response must not claim that all emails were sent;
- the clinic must be able to identify incomplete delivery from response/logs.

## Runtime Environment Policy

In development, active runtime variables must be available through `.env.local` or `.env`.

Historical cutover files such as `.env.cutover.prod` may remain as local references but are not automatically loaded unless explicitly wired by the runtime.

Required active runtime groups:

```text
Relational persistence variables
Google OAuth variables
Google Calendar variables
Gmail sender variables
Clinic notification email variable
```

## Documentation Update Rule

Every hotfix must update:

```text
1. Specific hotfix or initiative document
2. 60.0_CLINICAL_INTELLIGENCE_PROGRAM_PLAN.md
3. FUTURE_IMPROVEMENTS_BACKLOG.md
```

If a reusable pattern or governance rule is introduced, update:

```text
DEVELOPMENT_GOVERNANCE_PATTERNS.md
IMPLEMENTATION_CHECKLIST.md
```

## Clinic Email Delivery Expectation

The final booking implementation must notify the clinic independently from Calendar. Calendar presence alone is not enough.

Expected clinic notification behavior:

```text
A Gmail operational notification is sent to CLINIC_NOTIFICATION_EMAIL.
If CLINIC_NOTIFICATION_EMAIL is absent, it falls back to GMAIL_SENDER.
If the clinic recipient equals GMAIL_SENDER, the system attempts to mark the sent self-notification as INBOX and UNREAD when Gmail permissions allow it.
```

Operational recommendation:

```text
Prefer CLINIC_NOTIFICATION_EMAIL as a monitored clinic inbox or Google Group distinct from GMAIL_SENDER.
If the same account is used for both, include Gmail modify permission when refreshing OAuth credentials.
```

## Unified Patient Confirmation Email Expectation

The final booking implementation must avoid duplicate patient notifications.

Expected behavior after a successful public booking:

1. Supabase stores the lead/booking record.
2. The clinic Calendar receives the event.
3. The patient receives exactly one confirmation email.
4. The patient email includes the appointment details and an `invite.ics` attachment.
5. The clinic receives a separate operational notification email.

The patient may or may not use Google. Therefore, patient calendar support must not depend exclusively on Google Calendar attendee delivery. The `invite.ics` attachment is the portable calendar handoff for non-Google recipients.

## 61.x Product Governance and AI Delivery Continuity

Status: ACTIVE  
Added: 2026-06-20

DentalOperix now maintains a formal 61.x product governance layer for roadmap, AI-assisted delivery, role-based dashboards, users/RBAC, patient management, and sellable release planning.

New governing references:

- `docs/product-governance/61.0_MASTER_PRODUCT_ROADMAP.md`
- `docs/product-governance/61.0_PRODUCT_GOVERNANCE_DASHBOARD.md`
- `docs/product-governance/61.0_MODULE_CATALOG.md`
- `docs/product-governance/61.0_PRODUCT_RELEASE_PLAN.md`
- `docs/ai-governance/61.0_AI_DRIVEN_PRODUCT_DEVELOPMENT_STRATEGY.md`
- `docs/ai-context/DENTALOPERIX_AI_CONTEXT.md`

61.x does not modify the certified persistence architecture. The current product direction is:

```text
DentalOperix Starter
  -> Leads
  -> Booking
  -> Calendar/Gmail/ICS
  -> Users/RBAC
  -> Assistant Dashboard
  -> Admin Starter Dashboard
```

The next prioritized initiatives are:

1. `61.1 Users & RBAC Foundation`
2. `61.2 Assistant Operations Dashboard`
3. `61.3 Patient Management`

AI-assisted development is allowed only through the documented workflow and must remain compatible with all certified architecture constraints.

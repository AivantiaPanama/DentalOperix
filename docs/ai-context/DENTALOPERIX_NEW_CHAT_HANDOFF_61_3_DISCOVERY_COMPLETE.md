# DentalOperix — New Chat Handoff 61.3 Discovery Complete

Status: 61.3 PHASE CLOSED / CERTIFIED  
**Date:** 2026-06-23  
Next Recommended Work: Await 61.4 Program Opening

---

## 1. Required Reading Order

Read first:

1. `docs/implementation/61.3/61.3-00_PATIENT_DOMAIN_DISCOVERY_REPORT.md`
2. `docs/implementation/61.3/61.3-00A_ARCHITECTURE_AUDIT_REPORT.md`
3. `docs/implementation/61.3/61.3-00A_DOCUMENTATION_ALIGNMENT_REPORT.md`
4. `docs/implementation/61.3/61.3-00A_GOVERNANCE_ALIGNMENT_REPORT.md`
5. `docs/implementation/61.3/61.3-01_PATIENT_IDENTITY_FOUNDATION_OPENING.md`
6. ADRs `ADR-61.3-00-01` through `ADR-61.3-00-08`
7. `docs/governance/EXECUTION_CONTINUITY_RULE.md`
8. `docs/governance/DOMAIN_DISCOVERY_GATE.md`

Then review only documentation relevant to the requested objective.

---

## 2. Certified State

Program 57.x:

```text
CLOSED / CERTIFIED
```

61.1 Users + Authentication + RBAC + Dashboard Routing:

```text
CLOSED / CERTIFIED
```

61.2 Assistant / Front Desk Workspace:

```text
CLOSED / CERTIFIED
```

61.2 validation evidence:

```text
Build PASS
TypeScript PASS
119 / 119 Test Files PASS
517 / 517 Tests PASS
```

61.3-00 Patient Domain Discovery:

```text
COMPLETE / APPROVED
```

61.3-00A Documentation & Architecture Audit:

```text
PASS WITH FINDINGS / CONSOLIDATED
```

---

## 3. Certified Architecture Constraints

Leads architecture remains certified:

```text
Leads
  -> LeadPersistencePort
  -> LeadPersistenceProvider
  -> RelationalLeadPersistenceAdapter
  -> Supabase PostgreSQL
```

Refined source-of-truth scope:

```text
Leads = Source of Truth for acquisition, marketing and lead lifecycle.
Patients = Source of Truth for person identity.
Appointments = Source of Truth for scheduled operational events.
```

Do not reopen 57.x or alter the certified Leads source-of-truth architecture.

---

## 4. Protected Components

Do not modify without explicit authorization:

- BookingDialog
- processDentalLead
- /api/leads/create
- Calendar
- Gmail
- FloatingDentalAIChat
- Home
- siteServices.ts

---

## 5. Prohibited Changes

Do not introduce:

- Dual Write
- Lead Replacement
- New Source of Truth for Leads
- Persistence Re-Architecture
- Analytics Write Back
- RBAC Bypass
- Automated patient merge
- Doctor ↔ Patient permanent assignment
- Clinical EHR / treatment plan in 61.3-01
- Insurance coverage calculation in Patient identity

---

## 6. Patient Domain Decisions

Approved:

- Patient is permanent identity.
- Patient identity is immutable; attributes/contact points change.
- Patient data must be normalized.
- Patients have states: `active`, `inactive`, `lost_contact`, `archived`.
- Patient can be created from web, chat, WhatsApp, phone, walk-in, lead, appointment or staff entry.
- Duplicate resolution must avoid unsafe automatic merge.
- Patient merge is manual and auditable.
- Patient may have retired/insurance indicators, but benefits/coverage rules are future domains.
- Patient must follow reusable domain architecture.

---

## 7. Architecture Watch Items

Carry forward:

- AWI-61.3-001 Future Treatment Episode Domain
- AWI-61.3-002 Guardian / Responsible Party
- AWI-61.3-003 Consent & Marketing Preferences
- AWI-61.3-004 Multi-Clinic Patient Identity
- AWI-61.3-005 Insurance & Benefits Domain
- AWI-61.3-006 Patient Audit Trail
- AWI-61.3-007 Patient Identity Resolution
- AWI-61.3-008 Patient Contact Point Management
- AWI-61.3-009 Marketing Consent Domain
- AWI-61.3-010 Tenant Boundary Assessment

These are not all implementation requirements for 61.3-01. They are watch items and boundaries.

---

## 8. Governance Rules

Execution Continuity Rule is adopted.

Domain Discovery Gate is adopted for new/materially changed domains.

Before any code generation for 61.3-01, provide:

1. Architecture Review
2. Affected dependencies
3. Risks
4. Technical impact
5. Architectural options
6. Technical recommendation
7. File-by-file implementation plan
8. Test strategy
9. Documentation strategy

Then wait for explicit implementation authorization.

---

## 9. Historical Record

```text
61.3-01 Patient Identity Foundation
CLOSED / CERTIFIED

61.3-02
CLOSED / CERTIFIED

61.3-03-A
CLOSED / CERTIFIED

61.3-03-B
CLOSED / CERTIFIED

61.3 PHASE
CLOSED / CERTIFIED
```

Recommended scope:

- Patient domain types
- Patient state model
- Patient validation
- Contact point contracts
- Identifier contracts
- Repository interface
- Application service
- Identity resolution skeleton
- Manual merge contract skeleton
- Audit contract skeleton
- SQL migration proposal
- Unit/integration tests

Do not implement UI first.

Recommended order:

```text
Domain
Contracts
Services
Repositories
Persistence
Tests
UI later
```

## 10. Phase Status Update

61.3-02 CLOSED / CERTIFIED

61.3-03-A CLOSED / CERTIFIED

(Application Contracts + Shared Types)

61.3-03-B CLOSED / CERTIFIED

(Application Services)

61.3 PHASE CLOSED / CERTIFIED

Closure Documentation:

- docs/governance/61.3/61.3_GOVERNANCE_RETROSPECTIVE_REVIEW.md
- docs/governance/61.3/61.3_PHASE_CLOSURE_REVIEW.md

# Iteration 61.3 - Patient Management

Status: IN PROGRESS / 61.3-01 CLOSED  
Priority: P1  
Owner: Product / Architecture Governance  
Last updated: 2026-06-23

## Objective

Define and implement the Patient Management foundation without replacing Leads as the source of truth for commercial acquisition, lead intake, marketing follow-up, or booking origin.

## Certified Boundary

```text
Leads = Source of Truth for commercial acquisition and follow-up.
Patient = permanent person identity.
Appointment = operational scheduled event.
```

Patient does not replace Lead. Appointment does not replace Lead. No new source of truth is introduced.

## Completed Work

### 61.3-00 Patient Domain Discovery

Status: COMPLETE / APPROVED

Completed outputs:

- Patient identity definition
- Patient lifecycle states
- Patient normalization model
- Patient creation source analysis
- Identity resolution boundary
- Manual merge boundary
- Insurance boundary
- Reusable domain architecture decision

### 61.3-00A Documentation & Architecture Audit

Status: PASS WITH FINDINGS / CONSOLIDATED

Completed outputs:

- Architecture Audit Report
- Documentation Alignment Report
- Governance Alignment Report

### 61.3-01 Patient Identity Foundation

Status: CLOSED / VALIDATED

Completed outputs:

- Patient Domain Foundation
- Patient Contracts
- Patient States
- Patient Identity Resolution Foundation
- Patient Merge Framework Contracts
- Patient Repository Interfaces
- Patient Audit Contracts
- 61.3-01 Implementation Report
- 61.3-01 Validation Report
- 61.3-01 Governance Retrospective
- 61.3-01 Handoff

## Current Phase

```text
61.3-02 Patient Persistence & Infrastructure Validation
```

Expected focus:

- Patient repository validation
- Supabase mapping validation
- Migration validation
- Identity resolution validation
- Merge framework validation
- Infrastructure boundary validation

No Patient UI should be introduced before the domain, application services, repositories, and infrastructure validation remain complete and aligned.

## Out of Scope Until Explicit Architecture Review

The following Architecture Watch Items remain blocked unless explicitly reviewed and authorized:

- Future Treatment Episode Domain
- Guardian / Responsible Party
- Consent & Marketing Preferences
- Multi-Clinic Patient Identity
- Insurance & Benefits Domain
- Patient Audit Trail expansion
- Patient Identity Resolution expansion
- Patient Contact Point Management expansion
- Marketing Consent Domain
- Tenant Boundary Assessment

## AI Assignments

| Work                                                 | AI                                | Status                    |
| ---------------------------------------------------- | --------------------------------- | ------------------------- |
| Patient domain discovery and governance framing      | ChatGPT / Architecture Governance | COMPLETE                  |
| Data model and domain proposal                       | ChatGPT                           | COMPLETE                  |
| Patient identity foundation implementation candidate | ChatGPT / Cursor after approval   | COMPLETE                  |
| Patient persistence and infrastructure validation    | ChatGPT / Cursor after approval   | NEXT                      |
| Patient UI mockup                                    | v0/Lovable                        | BLOCKED UNTIL LATER PHASE |

## Acceptance Criteria

- Patient links to lead origin but does not replace Lead.
- Multiple contact methods are supported through normalized identity/contact structures.
- Billing, insurance, and benefits remain outside the Patient Identity Foundation unless separately approved.
- Patient data access remains governed by RBAC.
- Analytics remains read-only.
- No protected components are modified without explicit approval.

## Required Documentation Updates

Completed for 61.3-01:

- `docs/implementation/61.3/61.3-01_IMPLEMENTATION_REPORT.md`
- `docs/implementation/61.3/61.3-01_VALIDATION_REPORT.md`
- `docs/implementation/61.3/61.3-01_GOVERNANCE_RETROSPECTIVE.md`
- `docs/implementation/61.3/61.3-01_HANDOFF.md`
- `docs/implementation/61.3/61.3_BASELINE_PACKAGE_MANIFEST.md`

Recommended before or during 61.3-02:

- `docs/implementation/61.3/61.3-02_*` validation package
- 61.3 handoff update after persistence validation
- Governance retrospective update before 61.3-02 closure

## Governance Confirmation

```text
No Dual Write.
No Lead Replacement.
No Persistence Re-Architecture.
No RBAC Bypass.
No Analytics Write Back.
No Patient UI introduced in 61.3-01.
```

---

## 61.3 Status Update

```text
61.3-00 Discovery: CLOSED
61.3-00A Audit: PASS
61.3-01 Patient Identity Foundation: CLOSED
61.3-02 Patient Persistence & Infrastructure Validation: CLOSED / CERTIFIED
61.3-03 Patient Application Services: OPEN / IMPLEMENTATION AUTHORIZED
```

---

## 61.3-03 Implementation Readiness Update

```text
61.3-02 Patient Persistence & Infrastructure Validation: CLOSED / CERTIFIED
61.3-03 Patient Application Services: OPEN / IMPLEMENTATION AUTHORIZED
61.3-03 Implementation Impact Assessment: COMPLETE
Next Authorized Batch: 61.3-03-A Application Contracts and Shared Types
```

# DENTALOPERIX 71.2 — Patients Functional Specification

## Document Control

| Field | Value |
|---|---|
| Document ID | DENTALOPERIX_71_2_PATIENTS_FUNCTIONAL_SPECIFICATION |
| Program | 71.0 — Patients Functional Development |
| Phase | 71.2 — Functional Specification |
| Classification | Normative / Functional Specification |
| Status | DRAFT FOR GOVERNANCE REVIEW |
| Baseline | DENTALOPERIX_BASELINE_69_2 |
| Date | 2026-06-24 |
| Governance Framework | DGF v1.0 / GML-1 aligned |

---

## 1. Governance Statement

This specification defines the authorized functional scope for the Patients domain under DENTALOPERIX_BASELINE_69_2.

It does not modify Leads, Appointments, protected components, or certified persistence architecture.

### Certified Patients Architecture

```text
PatientPersistencePort
→ PatientPersistenceProvider
→ RelationalPatientPersistenceAdapter
→ Supabase PostgreSQL
```

### Sources of Truth

```text
Leads = Acquisition / Marketing / Lead Lifecycle
Patients = Person Identity
Appointments = Scheduled Operational Events
```

### Protected Components — Not Modified

- BookingDialog
- processDentalLead
- /api/leads/create
- Calendar
- Gmail
- FloatingDentalAIChat
- Home
- siteServices.ts

### Permanent Restrictions

- No Dual Write
- No Lead Replacement
- No New Lead Source of Truth
- No Persistence Re-Architecture
- No RBAC Bypass
- No Automated Patient Merge

---

## 2. Scope

### In Scope

The Patients domain may include:

- Patient identity management
- Patient demographic attributes
- Patient contact points
- Patient addresses
- Patient identifiers
- Patient lifecycle state
- Duplicate detection before creation
- Manual duplicate review workflows
- Manual patient merge policy definition
- Administrative insurance/retirement indicators
- Patient search and retrieval
- Patient update workflows
- Patient archival/reactivation workflows
- Patient audit requirements

### Out of Scope

The following are out of scope for this specification unless separately authorized:

- Lead capture, lead lifecycle, or lead replacement
- BookingDialog behavior
- Calendar scheduling behavior
- Gmail behavior
- Appointment source-of-truth changes
- Billing, benefits, claims, automatic discounts, or coverage calculation
- Clinical diagnosis or treatment records
- Automated patient merge
- RBAC bypasses or unauthorized role expansion

---

## 3. Domain Definition

A Patient represents a durable person identity in DentalOperix.

The Patient identity must remain stable even when attributes, contact points, addresses, insurance indicators, or lifecycle state change.

Principle:

```text
The patient does not change; patient attributes and contact points change.
```

---

## 4. Patient Aggregate

### 4.1 Core Patient Identity

A Patient must include:

- patient_id
- first_name
- last_name
- optional second_last_name
- normalized_full_name
- date_of_birth, if available
- lifecycle_state
- created_at
- updated_at
- created_source
- created_by_user_id, if applicable

### 4.2 Contact Points

A Patient may have multiple:

- phones
- emails
- addresses

Each contact point should support:

- primary flag
- active/inactive state
- verification state, if applicable
- created_at / updated_at

### 4.3 Identifiers

A Patient may have multiple identifiers, including:

- internal patient identifier
- government or equivalent identifier, when required for invoicing or clinic administration
- external system identifier, if later authorized

Identifiers must not create a new source of truth outside Patients.

### 4.4 Administrative Indicators

The Patient may store basic administrative indicators:

- requires_invoice
- is_retired / retirement_status
- has_insurance / insurance_status

Insurance coverage calculation, plan rules, billing rules, and discount application remain outside the Patients domain.

---

## 5. Lifecycle States

Approved lifecycle states:

```text
active
inactive
lost_contact
archived
```

Rules:

- New clinic-created patients default to active unless otherwise specified.
- A patient is not normally deleted.
- Archival changes state; it does not replace or destroy identity.
- Reactivation may return archived/inactive/lost_contact patients to active when operationally valid.

---

## 6. Creation Sources

Allowed patient creation sources:

```text
web
chat
whatsapp
phone
walk_in
lead
appointment
assistant
admin
doctor
```

### Public Channel Minimum Data

- name
- email

### Clinic/Internal Minimum Data

- first_name
- last_name
- primary_phone
- lifecycle_state default
- created_at automatic
- requires_invoice
- government/equivalent identifier if invoice is required
- email optional

Patient creation from a Lead is permitted only if it does not replace the Lead and does not convert Leads into the Patient source of truth.

---

## 7. Duplicate Detection and Identity Resolution

Before creating a Patient, the system must apply duplicate detection.

Initial matching policy:

1. Strong match: normalized name + email.
2. Ambiguous match: same or similar name without sufficient differentiators.
3. If ambiguous, request additional differentiators such as second surname, government/equivalent identifier, phone, date of birth, or another authorized identifier.
4. Do not automatically merge ambiguous records.

Outcomes:

- create new patient;
- return existing likely match;
- mark as ambiguous and require manual review;
- request additional information.

---

## 8. Manual Merge Policy

Patient merge is allowed only as a future controlled manual workflow.

Automatic merge is prohibited.

Minimum audit requirements for future merge implementation:

- merged_from_patient_id
- merged_into_patient_id
- merged_by_user_id
- merged_at
- merge_reason
- reviewed_conflicts
- retained_values

The merge workflow must be explicitly authorized before implementation.

---

## 9. Functional Use Cases

### UC-PAT-001 — Create Patient

Actor: authorized staff, assistant, doctor, or authorized system source.

Preconditions:

- Source is allowed.
- Required minimum fields are present.
- Duplicate detection has been executed.

Success outcome:

- New patient identity is created.
- Contact points are created as related records.
- Audit event is recorded.

Blocked conditions:

- duplicate match requiring reuse of existing patient;
- ambiguous identity without required differentiators;
- unauthorized source;
- missing required fields.

### UC-PAT-002 — Update Patient Attributes

Updates allowed:

- names, where authorized;
- demographic attributes;
- administrative indicators;
- lifecycle state transitions.

Rules:

- Patient identity must not be replaced.
- Important identity changes should produce audit evidence.

### UC-PAT-003 — Add or Update Contact Point

Allows authorized users to:

- add phone/email/address;
- set primary contact point;
- deactivate obsolete contact point;
- update verification state.

Rules:

- Old contact points should not be destructively overwritten when historical retention is required.
- Contact update does not create a new Patient.

### UC-PAT-004 — Search Patients

Search criteria may include:

- name
- email
- phone
- identifier
- lifecycle_state
- creation source

Search must respect RBAC and must not bypass authorized access controls.

### UC-PAT-005 — Archive Patient

Allows authorized users to mark a patient as archived.

Rules:

- Archive is a lifecycle state change.
- Archive must not delete patient identity.
- Archive must not affect Leads or Appointments source-of-truth definitions.

### UC-PAT-006 — Reactivate Patient

Allows authorized users to reactivate a patient from inactive, lost_contact, or archived.

Rules:

- Audit event required.
- Reactivation must preserve original patient_id.

### UC-PAT-007 — Duplicate Review

Allows authorized users to review ambiguous potential duplicates.

Outcomes:

- confirm existing patient;
- approve new patient;
- request more information;
- defer decision.

Automatic merge remains prohibited.

---

## 10. Validation Rules

### Names

- first_name required for clinic/internal creation.
- last_name required for clinic/internal creation.
- normalized_full_name generated for matching.

### Email

- required for minimum public-channel creation.
- optional for clinic/internal creation unless required by workflow.
- normalized email should be used for duplicate matching.

### Phone

- primary_phone required for clinic/internal creation.
- phone normalization required for matching and search.

### Invoice Identifier

If requires_invoice = true, government/equivalent identifier is required, subject to local clinic policy.

### Lifecycle State

Must be one of:

```text
active
inactive
lost_contact
archived
```

---

## 11. RBAC and Access Control

This specification does not authorize RBAC bypass.

Expected access model:

- Admin: full authorized administrative management.
- Assistant/Staff: create/update/search within operational limits.
- Doctor: access relevant patient identity and administrative information, subject to policy.
- Public/unauthenticated channels: may initiate patient creation only through authorized controlled workflows.

Final role permissions require implementation-level validation against the existing RBAC framework.

---

## 12. Audit Requirements

Audit evidence should exist for:

- patient creation;
- identity-relevant updates;
- lifecycle state changes;
- primary contact changes;
- duplicate review decisions;
- future manual merge decisions.

Minimum audit event fields:

- event_id
- patient_id
- event_type
- actor_user_id or actor_source
- occurred_at
- previous_value, where applicable
- new_value, where applicable
- reason, where applicable

---

## 13. Integration Boundaries

### Leads

Patient may be created from Lead context only if:

- Lead remains the source of truth for acquisition lifecycle;
- Patient becomes the source of truth for person identity;
- no Lead replacement occurs;
- no dual write pattern is introduced.

### Appointments

Appointments remain the source of truth for scheduled operational events.

Patients may be referenced by appointments, but this specification does not change scheduling behavior.

### Insurance / Benefits / Billing

Patients may store basic administrative indicators only.

Coverage logic, billing rules, discounts, claims, and benefit calculations are out of scope.

---

## 14. Non-Functional Requirements

- Persistence must remain behind PatientPersistencePort and certified adapters.
- Business rules must not live inside UI components.
- Duplicate detection must be domain/application logic.
- Protected components must not be modified.
- Data updates must preserve patient identity.
- Search and access must respect RBAC.
- Important operations must be auditable.

---

## 15. Acceptance Criteria

This specification is acceptable when:

- It remains within the Patients domain.
- It is compatible with DENTALOPERIX_BASELINE_69_2.
- It respects all protected components.
- It preserves all Sources of Truth.
- It prohibits automated patient merge.
- It defines Patient identity, lifecycle, creation, update, search, duplicate handling, and audit requirements.
- It is ready for Architecture Validation in 71.3.

---

## 16. Governance Determination

Status: DRAFT FOR REVIEW

Determination:

```text
FUNCTIONAL SPECIFICATION CREATED
PATIENTS DOMAIN ONLY
BASELINE 69.2 COMPATIBLE
NO PROTECTED COMPONENT MODIFICATION
NO SOURCE OF TRUTH CHANGE
NO PERSISTENCE RE-ARCHITECTURE
READY FOR GOVERNANCE REVIEW AND 71.3 ARCHITECTURE VALIDATION
```

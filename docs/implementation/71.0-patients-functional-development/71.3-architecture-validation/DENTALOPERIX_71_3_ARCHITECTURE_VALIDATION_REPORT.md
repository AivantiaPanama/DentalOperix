# DENTALOPERIX 71.3 — Patients Architecture Validation Report

## Document Control

| Field | Value |
|---|---|
| Document ID | DENTALOPERIX_71_3_ARCHITECTURE_VALIDATION_REPORT |
| Program | 71.0 — Patients Functional Development |
| Phase | 71.3 — Architecture Validation |
| Classification | Evidence / Architecture Validation |
| Status | PASSED / IMPLEMENTATION PLANNING AUTHORIZED |
| Baseline | DENTALOPERIX_BASELINE_69_2 |
| Source Specification | DENTALOPERIX_71_2_PATIENTS_FUNCTIONAL_SPECIFICATION |
| Date | 2026-06-24 |
| Governance Framework | DGF v1.0 / GML-1 aligned |

---

## 1. Executive Determination

The Patients Functional Specification 71.2 has been formally reviewed against DENTALOPERIX_BASELINE_69_2, the certified Patients persistence architecture, the official Sources of Truth, protected components, and permanent governance restrictions.

### Final Result

```text
ARCHITECTURE VALIDATION: PASSED
IMPLEMENTATION PLANNING: AUTHORIZED
CODE IMPLEMENTATION: NOT YET AUTHORIZED
NEXT PHASE: 71.4 — Implementation Planning
```

The specification is implementable without changing the certified architecture and without modifying protected components.

---

## 2. Baseline Evidence Used

This validation used the following official documents as governing evidence:

| Evidence | Purpose |
|---|---|
| DENTALOPERIX_BASELINE_69_2_UPDATE_MANIFEST.md | Confirms current certified baseline, certified architectures, and Patients-only implementation authorization. |
| DENTALOPERIX_NEW_CHAT_HANDOFF_69_2.md | Confirms protected components, prohibited actions, required governance mode, and Patients-only scope. |
| DENTALOPERIX_71_2_PATIENTS_FUNCTIONAL_SPECIFICATION.md | Functional specification under validation. |

---

## 3. Certified Architecture Under Review

### Patients Persistence Architecture

```text
PatientPersistencePort
→ PatientPersistenceProvider
→ RelationalPatientPersistenceAdapter
→ Supabase PostgreSQL
```

### Required Implementation Flow

```text
UI / Authorized Workflow
→ Application Service / Use Case
→ PatientPersistencePort
→ PatientPersistenceProvider
→ RelationalPatientPersistenceAdapter
→ Supabase PostgreSQL
```

### Validation Finding

The 71.2 specification correctly requires persistence to remain behind `PatientPersistencePort` and certified adapters. It does not authorize direct UI-to-database access or persistence bypass.

**Result:** PASS

---

## 4. Architectural Analysis

### 4.1 Domain Boundary

The 71.2 specification defines Patient as durable person identity and confines changes to the Patients domain.

Validated areas:

- patient identity management;
- demographic attributes;
- contact points;
- identifiers;
- lifecycle state;
- duplicate detection;
- manual duplicate review;
- audit requirements;
- search and retrieval;
- archival and reactivation.

Excluded areas remain correctly outside scope:

- lead lifecycle;
- appointment scheduling behavior;
- billing, benefits, claims, and discounts;
- clinical diagnosis and treatment records;
- automated patient merge;
- RBAC bypass.

**Result:** PASS

### 4.2 Source of Truth Preservation

Official Sources of Truth remain:

```text
Leads = Acquisition / Marketing / Lead Lifecycle
Patients = Person Identity
Appointments = Scheduled Operational Events
```

The specification preserves Patients as the source of truth for person identity and does not authorize replacement of Leads or Appointments.

**Result:** PASS

### 4.3 Persistence Boundary

The specification explicitly states that persistence must remain behind `PatientPersistencePort` and certified adapters.

No persistence re-architecture is introduced.

**Result:** PASS

### 4.4 Protected Components

The specification does not require modification of:

- BookingDialog
- processDentalLead
- /api/leads/create
- Calendar
- Gmail
- FloatingDentalAIChat
- Home
- siteServices.ts

**Result:** PASS

---

## 5. Dependency Validation

| Dependency | Status | Finding |
|---|---:|---|
| Patient Domain | Allowed | Primary scope of implementation. |
| PatientPersistencePort | Allowed | Required architecture boundary. |
| PatientPersistenceProvider | Allowed | Required provider boundary. |
| RelationalPatientPersistenceAdapter | Allowed | Certified Supabase adapter. |
| Supabase PostgreSQL | Allowed | Certified persistence target. |
| Leads Domain | Restricted | Reference only; no lifecycle or source-of-truth modification. |
| Appointments Domain | Restricted | Reference only; no scheduling behavior modification. |
| RBAC Framework | Restricted | Must be respected; no bypass authorized. |
| Protected Components | Prohibited | No modification authorized. |

**Dependency Validation Result:** PASS

---

## 6. Use Case Traceability Matrix

| Use Case | Required Architecture Path | Source of Truth Impact | Protected Component Impact | Result |
|---|---|---|---|---|
| UC-PAT-001 Create Patient | Use Case → PatientPersistencePort → Provider → Adapter | Patients only | None | PASS |
| UC-PAT-002 Update Patient Attributes | Use Case → PatientPersistencePort → Provider → Adapter | Patients only | None | PASS |
| UC-PAT-003 Add/Update Contact Point | Use Case → PatientPersistencePort → Provider → Adapter | Patients only | None | PASS |
| UC-PAT-004 Search Patients | Use Case → PatientPersistencePort → Provider → Adapter | Read Patients only | None | PASS |
| UC-PAT-005 Archive Patient | Use Case → PatientPersistencePort → Provider → Adapter | Patients lifecycle only | None | PASS |
| UC-PAT-006 Reactivate Patient | Use Case → PatientPersistencePort → Provider → Adapter | Patients lifecycle only | None | PASS |
| UC-PAT-007 Duplicate Review | Use Case → PatientPersistencePort → Provider → Adapter | Patients identity review only | None | PASS |

---

## 7. Permanent Restriction Compliance

| Restriction | Validation Finding | Result |
|---|---|---:|
| No Dual Write | Specification does not introduce parallel write paths. | PASS |
| No Lead Replacement | Lead context may create Patient only without replacing Lead. | PASS |
| No New Lead Source of Truth | Leads remain acquisition lifecycle source of truth. | PASS |
| No Persistence Re-Architecture | Certified Patient persistence chain is preserved. | PASS |
| No RBAC Bypass | Specification requires RBAC compliance. | PASS |
| No Automated Patient Merge | Automatic merge is explicitly prohibited. | PASS |

---

## 8. Risk Assessment

| Risk | Level | Mitigation |
|---|---:|---|
| Accidental coupling to Leads | Low | Keep Lead references read/contextual only; do not modify Lead lifecycle. |
| Persistence bypass from UI | Low | Require all persistence through PatientPersistencePort. |
| Automated merge introduced during implementation | Medium | Treat merge as explicitly blocked unless separately authorized. |
| RBAC gaps in search/update workflows | Medium | Validate permissions during 71.4 implementation planning. |
| Overlap with billing/insurance logic | Low | Keep only administrative indicators in Patients; billing logic out of scope. |

---

## 9. Technical Impact

The 71.2 specification can be implemented without:

- modifying protected components;
- changing existing Lead architecture;
- changing existing Appointment source-of-truth ownership;
- changing persistence architecture;
- introducing dual write;
- modifying production integrations outside Patients.

Expected implementation impact is limited to Patients domain artifacts, application services, validation logic, adapter methods, and Supabase-backed Patient persistence structures already authorized by the baseline.

---

## 10. Compatibility with DENTALOPERIX_BASELINE_69_2

Compatibility determination:

```text
BASELINE 69.2 COMPATIBILITY: CONFIRMED
PATIENTS-ONLY SCOPE: CONFIRMED
CERTIFIED ARCHITECTURE PRESERVED: CONFIRMED
PROTECTED COMPONENTS PRESERVED: CONFIRMED
SOURCES OF TRUTH PRESERVED: CONFIRMED
```

---

## 11. Implementation Planning Preconditions

Before any code implementation, 71.4 must define:

1. Backlog sequencing by Patient use case.
2. Files/modules expected to change.
3. Files/modules explicitly protected from change.
4. RBAC validation matrix.
5. Adapter method plan.
6. Migration/schema impact review, if applicable.
7. Test and evidence plan.
8. Rollback plan.
9. Governance approval for implementation execution.

---

## 12. Governance Determination

```text
71.3 ARCHITECTURE VALIDATION COMPLETED
RESULT: PASSED
71.2 FUNCTIONAL SPECIFICATION ARCHITECTURALLY VALIDATED
IMPLEMENTATION PLANNING AUTHORIZED
CODE IMPLEMENTATION REMAINS BLOCKED UNTIL 71.4 IS APPROVED
```

---

## 13. Final Certification Statement

As Architect Principal, Technical Reviewer, and Governance Guardian, this report certifies that the Patients Functional Specification 71.2 is architecturally valid under DENTALOPERIX_BASELINE_69_2 and may proceed to 71.4 — Implementation Planning.

No code implementation is authorized by this report.

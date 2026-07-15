# DentalOperix RBAC Authorization Matrix

Document ID: `RBAC-MATRIX-V1.1`
Iteration: `61.1 - Users & RBAC Foundation`
Status: `REVISED - ARCHITECTURE REVIEW FEEDBACK INCORPORATED`
Author Role: Product Analyst / Functional Designer
Architecture Review: ChatGPT / Architect Principal
Supersedes: `RBAC-MATRIX-V1.md` preliminary draft

Permanent constraint honored throughout this document:

```text
Leads = Source of Truth
```

Certified persistence architecture:

```text
Leads
-> LeadPersistencePort
-> LeadPersistenceProvider
-> RelationalLeadPersistenceAdapter
-> Supabase PostgreSQL
```

## 1. Purpose and Scope

This document defines the preliminary Role-Based Access Control authorization matrix for DentalOperix iteration `61.1 - Users & RBAC Foundation`.

Roles in scope:

- Patient
- Assistant
- Doctor
- Administrator

This document defines authorization rules only. It does not define, alter, or propose changes to architecture, persistence, data modeling, or the certified Leads pipeline.

## 2. Architecture Review Feedback Incorporated

| Section           | Architecture Review Finding                                                     | Resolution in V1.1                                                                        |
| ----------------- | ------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Leads permissions | Single `Update` action hid distinct authorization concerns.                     | Split into `lead.status.update`, `lead.notes.update`, and `lead.owner.reassign`.          |
| Appointments      | Hard delete is inconsistent with audit and recoverability.                      | Physical deletion prohibited for all roles. Cancellation is the terminal operation.       |
| Users             | Lifecycle actions were ambiguous.                                               | `user.delete` prohibited; `user.deactivate` and `user.reactivate` are Administrator-only. |
| Dashboard Routing | Names referenced internal iteration numbers.                                    | Product-oriented dashboard targets documented.                                            |
| Patient Records   | Resource is not in 61.1 scope.                                                  | Marked `OUT OF SCOPE` for 61.1; retained only as future placeholder for 61.3.             |
| Business Rules    | Missing explicit non-interference rule with certified persistence architecture. | Added `BR-RBAC-008`.                                                                      |
| Open Questions    | Risk of premature resolution by functional design.                              | Open Architecture Questions preserved.                                                    |

## 3. Summary Matrix

| Module                    | Patient           | Assistant                                                    | Doctor                              | Administrator                                                    |
| ------------------------- | ----------------- | ------------------------------------------------------------ | ----------------------------------- | ---------------------------------------------------------------- |
| Leads                     | No access         | `lead.status.update`, `lead.notes.update` operational access | Read only - assigned patients       | `lead.status.update`, `lead.notes.update`, `lead.owner.reassign` |
| Calendar / Appointments   | Read + Cancel own | Create / Read / Update / Cancel all                          | Read / Update / Cancel own schedule | Create / Read / Update / Cancel all                              |
| Dashboard                 | Patient Portal    | Front Desk Workspace                                         | Clinical Workspace                  | Operations Console                                               |
| Users & Roles             | Read own profile  | Read own profile                                             | Read own profile                    | Full lifecycle except physical delete                            |
| Patient Records           | Placeholder only  | Placeholder only                                             | Placeholder only                    | Placeholder only                                                 |
| Analytics / Reporting     | No access         | No access                                                    | Read own patients                   | Read global                                                      |
| Notifications Email / ICS | Read own          | Send / Resend                                                | Read own                            | Send / Resend / Read all                                         |

## 4. Leads - Detailed Permissions

All permissions in this section operate strictly at the application layer and never imply direct access to persistence components.

| Permission             | Patient | Assistant                                                                                      | Doctor                                                    | Administrator                   |
| ---------------------- | ------- | ---------------------------------------------------------------------------------------------- | --------------------------------------------------------- | ------------------------------- |
| `lead.create`          | Deny    | Deny - creation remains exclusive to `BookingDialog -> processDentalLead -> /api/leads/create` | Deny                                                      | Deny                            |
| `lead.read`            | Deny    | Allow - all active leads                                                                       | Conditional - only leads linked to assigned patients      | Allow - all leads               |
| `lead.status.update`   | Deny    | Allow                                                                                          | Deny                                                      | Allow                           |
| `lead.notes.update`    | Deny    | Allow                                                                                          | Conditional - clinical notes only, assigned patients only | Allow                           |
| `lead.owner.reassign`  | Deny    | Deny                                                                                           | Deny                                                      | Allow - Administrator only      |
| `lead.delete.physical` | Deny    | Deny                                                                                           | Deny                                                      | Deny - prohibited for all roles |

Governance note:

```text
No role may create Leads directly through RBAC.
Lead creation remains tied exclusively to the certified BookingDialog -> processDentalLead -> /api/leads/create flow.
```

## 5. Appointments - Detailed Permissions

Physical deletion of appointments is prohibited for all roles. Cancellation is the standard terminal operation.

| Permission                    | Patient                                              | Assistant           | Doctor                          | Administrator                   |
| ----------------------------- | ---------------------------------------------------- | ------------------- | ------------------------------- | ------------------------------- |
| `appointment.create`          | Allow - self only                                    | Allow - any patient | Conditional - own schedule only | Allow - any patient or doctor   |
| `appointment.read`            | Allow - own only                                     | Allow - all         | Allow - own schedule only       | Allow - all                     |
| `appointment.update`          | Allow - own, subject to minimum-notice business rule | Allow - all         | Allow - own schedule only       | Allow - all                     |
| `appointment.cancel`          | Allow - own                                          | Allow - all         | Allow - own schedule only       | Allow - all                     |
| `appointment.delete.physical` | Deny                                                 | Deny                | Deny                            | Deny - prohibited for all roles |

Cancelled appointments remain in the system as historical records with a cancelled status.

## 6. Users - Lifecycle Permissions

User lifecycle management distinguishes deactivation from deletion.

| Permission             | Patient                                   | Assistant                                 | Doctor                                    | Administrator                                   |
| ---------------------- | ----------------------------------------- | ----------------------------------------- | ----------------------------------------- | ----------------------------------------------- |
| `user.create`          | Deny                                      | Deny                                      | Deny                                      | Allow                                           |
| `user.read`            | Allow - own profile only                  | Allow - own profile only                  | Allow - own profile only                  | Allow - all profiles                            |
| `user.update`          | Allow - own profile, non-sensitive fields | Allow - own profile, non-sensitive fields | Allow - own profile, non-sensitive fields | Allow - all profiles, including role assignment |
| `user.role.assign`     | Deny                                      | Deny                                      | Deny                                      | Allow                                           |
| `user.deactivate`      | Deny                                      | Deny                                      | Deny                                      | Allow                                           |
| `user.reactivate`      | Deny                                      | Deny                                      | Deny                                      | Allow                                           |
| `user.delete.physical` | Deny                                      | Deny                                      | Deny                                      | Deny - prohibited for all roles                 |

## 7. Dashboard Routing

| Role          | Dashboard Target     |
| ------------- | -------------------- |
| Patient       | Patient Portal       |
| Assistant     | Front Desk Workspace |
| Doctor        | Clinical Workspace   |
| Administrator | Operations Console   |

## 8. Patient Records - Out of Scope for 61.1

Patient Records are explicitly out of scope for iteration 61.1. The names below are retained only as future permission placeholders for iteration 61.3.

| Permission Future 61.3 | Patient     | Assistant   | Doctor      | Administrator |
| ---------------------- | ----------- | ----------- | ----------- | ------------- |
| `patientrecord.create` | Placeholder | Placeholder | Placeholder | Placeholder   |
| `patientrecord.read`   | Placeholder | Placeholder | Placeholder | Placeholder   |
| `patientrecord.update` | Placeholder | Placeholder | Placeholder | Placeholder   |
| `patientrecord.delete` | Placeholder | Placeholder | Placeholder | Placeholder   |

No permission in this table is active, enforced, or implied for 61.1.

## 9. Business Rules

| ID            | Rule                                                                                                                                                                                                                      |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `BR-RBAC-001` | No role may create, modify, or bypass the persistence adapter, or write directly to Supabase PostgreSQL outside the certified Leads flow.                                                                                 |
| `BR-RBAC-002` | Only Administrator may assign or change a user's role.                                                                                                                                                                    |
| `BR-RBAC-003` | Doctor access to Leads and future Patient Records is limited to assigned patients. The assignment mechanism is an open architecture question.                                                                             |
| `BR-RBAC-004` | Patient never has read access to Leads belonging to other patients.                                                                                                                                                       |
| `BR-RBAC-005` | Every `lead.status.update`, `lead.notes.update`, or `lead.owner.reassign` action must be attributable using existing model metadata such as `updated_by` and `updated_at`. This does not require a new store.             |
| `BR-RBAC-006` | Physical deletion of Leads is prohibited for all roles. Any visible removal is a logical status change preserving Source of Truth.                                                                                        |
| `BR-RBAC-007` | Physical deletion of Appointments and Users is prohibited for all roles. Cancellation and deactivation are the terminal operations.                                                                                       |
| `BR-RBAC-008` | RBAC is an authorization layer only. RBAC does not modify LeadPersistencePort, LeadPersistenceProvider, RelationalLeadPersistenceAdapter, or Supabase PostgreSQL. RBAC does not alter certified persistence architecture. |

## 10. Open Architecture Questions

The following remain explicitly open and are not resolved by this document:

1. Doctor <-> Patient Assignment Model.
2. Lead <-> Patient Relationship Model.
3. Retention / Soft Delete Policy.
4. Role Assignment Workflow.

Resolution is deferred to Architecture Review.

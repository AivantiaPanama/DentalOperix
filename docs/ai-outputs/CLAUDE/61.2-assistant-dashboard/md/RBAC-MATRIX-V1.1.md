**DentalOperix**

**RBAC Authorization Matrix**

Document ID: RBAC-MATRIX-V1.1

Iteration: 61.1 — Users & RBAC Foundation

**Status: REVISED — Architecture Review feedback incorporated**

Author role: Product Analyst / Functional Designer

_Supersedes: RBAC Matrix (Preliminary, unversioned draft)_

**Permanent constraint honored throughout this document:**

**Leads = Source of Truth**

# 1. Purpose and Scope

This document defines the preliminary Role-Based Access Control (RBAC)
authorization matrix for DentalOperix iteration 61.1 — Users & RBAC
Foundation. It supersedes the earlier unversioned preliminary draft and
incorporates all findings from the Architecture Review.

Roles in scope: Patient, Assistant, Doctor, Administrator.

_This document defines authorization rules only. It does not define,
alter, or propose any change to architecture, persistence, data
modeling, or the certified Leads pipeline (LeadPersistencePort -\>
LeadPersistenceProvider -\> RelationalLeadPersistenceAdapter -\>
Supabase PostgreSQL). Leads remains the Source of Truth throughout._

# 2. Change Log — Architecture Review Feedback Incorporated

| **Section**           | **Architecture Review Finding**                                                      | **Resolution in V1.1**                                                                            |
| --------------------- | ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------- |
| **Leads permissions** | Granularity insufficient — single Update action hid distinct authorization concerns. | Split into lead.status.update, lead.notes.update, lead.owner.reassign as independent permissions. |
| **Appointments**      | Hard delete is inconsistent with audit and recoverability needs.                     | Physical deletion prohibited for all roles. Cancellation is now the sole terminal operation.      |
| **Users**             | Lifecycle actions were ambiguous (Delete vs Deactivate).                             | user.delete = prohibited (all roles). user.deactivate / user.reactivate = Administrator only.     |
| **Dashboard Routing** | Names referenced internal iteration numbers, not suitable for product surface.       | Renamed to product-oriented names with no iteration references.                                   |
| **Patient Records**   | Module included permissions for a resource not yet in scope.                         | Marked OUT OF SCOPE for 61.1. Retained only as labeled future placeholders for 61.3.              |
| **Business Rules**    | Missing explicit non-interference rule with certified persistence architecture.      | Added BR-RBAC-008, stating RBAC is authorization-only and does not touch the persistence chain.   |
| **Open Questions**    | Risk of premature resolution by functional design.                                   | Open Architecture Questions section added; explicitly not resolved in this document.              |

# 3. Summary Matrix (Role x Module)

| **Module**                              | **Patient**         | **Assistant**                                      | **Doctor**                            | **Administrator**                                        |
| --------------------------------------- | ------------------- | -------------------------------------------------- | ------------------------------------- | -------------------------------------------------------- |
| **Leads (application layer only)**      | No access           | lead.status.update lead.notes.update (operational) | Read only — assigned patients         | lead.status.update lead.notes.update lead.owner.reassign |
| **Calendar / Appointments**             | Read + Cancel (own) | Create / Read / Update / Cancel (all)              | Read / Update / Cancel (own schedule) | Create / Read / Update / Cancel (all)                    |
| **Dashboard**                           | Patient Portal      | Front Desk Workspace                               | Clinical Workspace                    | Operations Console                                       |
| **Users & Roles**                       | Read (own profile)  | Read (own profile)                                 | Read (own profile)                    | Full lifecycle (see Section on Users)                    |
| **Patient Records — OUT OF SCOPE 61.1** | Placeholder only    | Placeholder only                                   | Placeholder only                      | Placeholder only                                         |
| **Analytics / Reporting**               | No access           | No access                                          | Read (own patients)                   | Read (global)                                            |
| **Notifications (Email / ICS)**         | Read (own)          | Send / Resend                                      | Read (own)                            | Send / Resend / Read (all)                               |

_This is a high-level overview. Section 4 onward provides
permission-level detail, including the granular split of Leads
permissions requested by Architecture Review._

# 4. Leads — Detailed Permissions (Application Layer Only)

Per Architecture Review finding \#1, the previously unified "Update"
action on Leads has been split into three independent permissions:
lead.status.update, lead.notes.update, and lead.owner.reassign. Each is
authorized separately and may be granted independently per role.

| **Permission**             | **Patient** | **Assistant**                                                                                                       | **Doctor**                                              | **Administrator**                              |
| -------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- | ---------------------------------------------- |
| **lead.create**            | Deny        | Deny — creation remains exclusive to the certified flow (BookingDialog -\> processDentalLead -\> /api/leads/create) | Deny                                                    | Deny                                           |
| **lead.read**              | Deny        | Allow — all active leads                                                                                            | Conditional — only leads linked to assigned patients    | Allow — all leads                              |
| **lead.status.update**     | Deny        | Allow                                                                                                               | Deny                                                    | Allow                                          |
| **lead.notes.update**      | Deny        | Allow                                                                                                               | Conditional — clinical notes only, on assigned patients | Allow                                          |
| **lead.owner.reassign**    | Deny        | Deny                                                                                                                | Deny                                                    | Allow — Administrator only                     |
| **lead.delete (physical)** | Deny        | Deny                                                                                                                | Deny                                                    | Deny — prohibited for all roles, no exceptions |

_All permissions in this section operate strictly at the application
layer, through the existing certified flow. No permission listed here
implies or authorizes any direct interaction with LeadPersistencePort,
LeadPersistenceProvider, RelationalLeadPersistenceAdapter, or Supabase
PostgreSQL. See BR-RBAC-001 and BR-RBAC-008._

# 5. Appointments — Detailed Permissions

Per Architecture Review finding \#2, physical deletion of appointments
is prohibited for all roles without exception. Cancellation is the
standard and only terminal operation for ending an appointment's
lifecycle.

| **Permission**                      | **Patient**                                          | **Assistant**           | **Doctor**                      | **Administrator**                              |
| ----------------------------------- | ---------------------------------------------------- | ----------------------- | ------------------------------- | ---------------------------------------------- |
| **appointment.create**              | Allow — for self only                                | Allow — for any patient | Conditional — own schedule only | Allow — for any patient or doctor              |
| **appointment.read**                | Allow — own appointments only                        | Allow — all             | Allow — own schedule only       | Allow — all                                    |
| **appointment.update (reschedule)** | Allow — own, subject to minimum-notice business rule | Allow — all             | Allow — own schedule only       | Allow — all                                    |
| **appointment.cancel**              | Allow — own appointments                             | Allow — all             | Allow — own schedule only       | Allow — all                                    |
| **appointment.delete (physical)**   | Deny                                                 | Deny                    | Deny                            | Deny — prohibited for all roles, no exceptions |

_See BR-RBAC-007. Cancelled appointments remain in the system as
historical records with a cancelled status; they are never physically
removed._

# 6. Users — Lifecycle Permissions

Per Architecture Review finding \#3, user lifecycle management
distinguishes deactivation (reversible, Administrator-controlled) from
deletion (prohibited for all roles).

| **Permission**             | **Patient**                               | **Assistant**                             | **Doctor**                                | **Administrator**                               |
| -------------------------- | ----------------------------------------- | ----------------------------------------- | ----------------------------------------- | ----------------------------------------------- |
| **user.create**            | Deny                                      | Deny                                      | Deny                                      | Allow                                           |
| **user.read**              | Allow — own profile only                  | Allow — own profile only                  | Allow — own profile only                  | Allow — all profiles                            |
| **user.update**            | Allow — own profile, non-sensitive fields | Allow — own profile, non-sensitive fields | Allow — own profile, non-sensitive fields | Allow — all profiles, including role assignment |
| **user.role.assign**       | Deny                                      | Deny                                      | Deny                                      | Allow                                           |
| **user.deactivate**        | Deny                                      | Deny                                      | Deny                                      | Allow                                           |
| **user.reactivate**        | Deny                                      | Deny                                      | Deny                                      | Allow                                           |
| **user.delete (physical)** | Deny                                      | Deny                                      | Deny                                      | Deny — prohibited for all roles, no exceptions  |

_See BR-RBAC-007. A deactivated user retains their historical record and
associations; reactivation restores access without recreating the
account._

# 7. Dashboard Routing

Per Architecture Review finding \#4, dashboard names have been revised
to product-oriented naming with no references to internal iteration
numbers.

| **Role**          | **Dashboard (product-oriented name)** |
| ----------------- | ------------------------------------- |
| **Patient**       | Patient Portal                        |
| **Assistant**     | Front Desk Workspace                  |
| **Doctor**        | Clinical Workspace                    |
| **Administrator** | Operations Console                    |

# 8. Patient Records — Out of Scope for Iteration 61.1

Per Architecture Review finding \#5, Patient Records is explicitly
marked out of scope for iteration 61.1. The table below is retained only
as a labeled placeholder for future iteration 61.3 and carries no
authorization weight in the current iteration.

| **Permission (future — 61.3)** | **Patient** | **Assistant** | **Doctor**  | **Administrator** |
| ------------------------------ | ----------- | ------------- | ----------- | ----------------- |
| **patientrecord.create**       | Placeholder | Placeholder   | Placeholder | Placeholder       |
| **patientrecord.read**         | Placeholder | Placeholder   | Placeholder | Placeholder       |
| **patientrecord.update**       | Placeholder | Placeholder   | Placeholder | Placeholder       |
| **patientrecord.delete**       | Placeholder | Placeholder   | Placeholder | Placeholder       |

_OUT OF SCOPE — 61.1. No permission in this table is active, enforced,
or implied for the current iteration. Placeholder values exist solely to
preserve naming continuity for future design work._

# 9. Business Rules

| **ID**          | **Rule**                                                                                                                                                                                                                      |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **BR-RBAC-001** | No role may create, modify, or bypass the persistence adapter, or write directly to Supabase PostgreSQL outside the certified Leads flow.                                                                                     |
| **BR-RBAC-002** | Only Administrator may assign or change a user's role.                                                                                                                                                                        |
| **BR-RBAC-003** | Doctor access to Leads and future Patient Records is limited to assigned patients. The assignment mechanism itself is an open architecture question (see Section 10).                                                         |
| **BR-RBAC-004** | Patient never has read access to Leads belonging to other patients, regardless of shared Doctor or Assistant.                                                                                                                 |
| **BR-RBAC-005** | Every lead.status.update, lead.notes.update, or lead.owner.reassign action must be attributable (updated_by, updated_at) using existing model metadata. This does not require a new store.                                    |
| **BR-RBAC-006** | Physical deletion of Leads is prohibited for all roles. Any visible removal is a logical status change, preserving Source of Truth.                                                                                           |
| **BR-RBAC-007** | Physical deletion of Appointments and Users is prohibited for all roles. Cancellation (appointments) and deactivation (users) are the only terminal operations.                                                               |
| **BR-RBAC-008** | RBAC is an authorization layer only. RBAC does not modify LeadPersistencePort, LeadPersistenceProvider, RelationalLeadPersistenceAdapter, or Supabase PostgreSQL. RBAC does not alter the certified persistence architecture. |

# 10. Open Architecture Questions

Per Architecture Review finding \#7, the following items are explicitly
preserved as open and are not resolved, narrowed, or implied by this
document. They remain the responsibility of Architecture Review.

- Doctor \<-\> Patient Assignment Model — the mechanism by which a
  Doctor becomes associated with a given patient, which determines the
  conditional scope of lead.read, lead.notes.update, and future Patient
  Records access.

- Lead \<-\> Patient Relationship Model — whether a Patient record
  originates from a converted Lead, exists independently, or follows
  another model.

- Retention / Soft Delete Policy — applicable to Users, Appointments,
  and future Patient Records, including any legal or clinical retention
  requirements.

- Role Assignment Workflow — the operational process by which an
  Administrator assigns or changes a user's role (e.g., self-service
  request, manual provisioning, invitation flow).

_This functional design package intentionally does not propose answers
to the items above. Resolution is deferred to Architecture Review._

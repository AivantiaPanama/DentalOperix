**DentalOperix**

**Business Rules Package**

Front Desk Workspace (Assistant Dashboard)

Document ID: BUSINESS-RULES-61.2-V1.0

Iteration: 61.2 — Assistant Dashboard

**Status: READY FOR ARCHITECTURE REVIEW**

Author role: Product Analyst / Functional Designer

**Upstream references:**

*RBAC-MATRIX-V1.1 (authorization source)*

*UX-SPEC-61.2-V1.0 (functional/UX source)*

*USER-STORIES-61.2-V1.0 (behavioral source)*

**Permanent constraint honored throughout this document:**

**Leads = Source of Truth**

0\. Scope Statement

This document defines the functional business rules governing the Front
Desk Workspace (Iteration 61.2). It is distinct in kind from the
BR-RBAC-XXX series defined in RBAC-MATRIX-V1.1:

- BR-RBAC-XXX rules govern authorization — who is allowed to perform an
  action.

- BR-61.2-XXX rules (this document) govern domain and workspace behavior
  — what happens, in what order, and under what condition, once an
  authorized action is taken.

This document does not duplicate any BR-RBAC rule. Where a rule in this
document depends on or is bounded by a BR-RBAC rule, that BR-RBAC rule
is referenced explicitly rather than restated.

This document does not include or imply:

- Any new permission, role, or RBAC scope beyond what RBAC-MATRIX-V1.1
  already authorizes.

- Any change to the certified Leads pipeline (LeadPersistencePort -\>
  LeadPersistenceProvider -\> RelationalLeadPersistenceAdapter -\>
  Supabase PostgreSQL) or to Leads as Source of Truth.

- Any persistence, schema, or data-modeling change.

- Resolution of any item listed as an Open Item in UX-SPEC-61.2-V1.0
  Section 11 or RBAC-MATRIX-V1.1 Section 10. Those remain open here as
  well.

*Every rule below is traceable to a User Story in
USER-STORIES-61.2-V1.0, an Acceptance Criterion in UX-SPEC-61.2-V1.0,
and (where applicable) a permission already authorized in
RBAC-MATRIX-V1.1. No rule introduces a new identifier outside the
BR-61.2-XXX series.*

1\. Relationship to the BR-RBAC Series

This section exists to prevent duplication. It maps each BR-RBAC rule
that is relevant to the Front Desk Workspace to where it is referenced
in this document, without restating its content.

|                  |                                                                                                                        |                                                                                                                                                                     |
|------------------|------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **BR-RBAC rule** | **What it governs**                                                                                                    | **How BR-61.2 rules relate to it**                                                                                                                                  |
| **BR-RBAC-001**  | No role may bypass the persistence adapter or write directly to Supabase outside the certified Leads flow.             | BR-61.2 rules never define or imply a data-write path; all rules describe application-layer behavior reachable only through already-authorized actions.             |
| **BR-RBAC-005**  | Lead status/notes/owner changes must be attributable (updated_by, updated_at).                                         | Referenced by BR-61.2-001 and BR-61.2-002 rather than restated; this document adds queue ordering and save-failure behavior on top of that attribution requirement. |
| **BR-RBAC-006**  | Physical deletion of Leads is prohibited for all roles.                                                                | Referenced by BR-61.2-001; this document does not redefine deletion prohibition, only the visible queue behavior that results from it.                              |
| **BR-RBAC-007**  | Physical deletion of Appointments and Users is prohibited; cancellation/deactivation are the only terminal operations. | Referenced by BR-61.2-005 and BR-61.2-006, which define the workspace-level behavior of cancellation as a terminal, confirmable action.                             |
| **BR-RBAC-008**  | RBAC is an authorization layer only; it does not modify the certified persistence architecture.                        | This entire document operates under the same constraint — no rule below proposes or implies a persistence change.                                                   |

2\. Rule Index / Traceability Overview

This table is the master index. Full detail for each rule, including the
required 11 fields, follows in Section 3.

|                 |                                                        |                                    |                                       |
|-----------------|--------------------------------------------------------|------------------------------------|---------------------------------------|
| **Rule ID**     | **Rule Name**                                          | **Related User Stories**           | **Related AC**                        |
| **BR-61.2-001** | Lead Queue Ordering by Urgency                         | US-61.2-03                         | AC-61.2-004                           |
| **BR-61.2-002** | Lead Update Attribution and Failure Integrity          | US-61.2-04, US-61.2-05             | AC-61.2-005, AC-61.2-006              |
| **BR-61.2-003** | Appointment Conflict Prevention                        | US-61.2-06, US-61.2-07             | AC-61.2-007                           |
| **BR-61.2-004** | Absence of Physical Deletion Controls in the Workspace | US-61.2-07, US-61.2-08             | AC-61.2-008                           |
| **BR-61.2-005** | Mandatory Confirmation Before Cancellation             | US-61.2-08                         | AC-61.2-009                           |
| **BR-61.2-006** | Cancellation Is Terminal and Non-Reversible In-Place   | US-61.2-08                         | AC-61.2-010                           |
| **BR-61.2-007** | Notification Resend Requires Valid Contact Information | US-61.2-09                         | AC-61.2-011                           |
| **BR-61.2-008** | Shift Summary Counts Must Reflect Live Underlying Data | US-61.2-10                         | AC-61.2-012                           |
| **BR-61.2-009** | Unauthorized Controls Must Be Absent, Not Disabled     | US-61.2-11                         | AC-61.2-004, AC-61.2-008, AC-61.2-013 |
| **BR-61.2-010** | Detail Views Must Return to Their Originating Section  | US-61.2-12                         | AC-61.2-014                           |
| **BR-61.2-011** | Empty States Must Be Explicit, Never Blank             | US-61.2-02, US-61.2-03, US-61.2-09 | AC-61.2-003                           |
| **BR-61.2-012** | Default Dashboard Routing Is Deterministic by Role     | US-61.2-01                         | AC-61.2-001                           |

3\. Business Rules — Detail

Each rule below follows the required 11-field structure. Rule order
follows the Rule Index (Section 2).

BR-61.2-001 — Lead Queue Ordering by Urgency

<table>
<colgroup>
<col style="width: 24%" />
<col style="width: 75%" />
</colgroup>
<tbody>
<tr class="odd">
<td><strong>1. Rule ID</strong></td>
<td>BR-61.2-001</td>
</tr>
<tr class="even">
<td><strong>2. Rule Name</strong></td>
<td>Lead Queue Ordering by Urgency</td>
</tr>
<tr class="odd">
<td><strong>3. Description</strong></td>
<td>Within the Lead Queue, active leads are ordered so that the most
time-sensitive lead — defined as the one that has gone longest without
an action — is surfaced first.</td>
</tr>
<tr class="even">
<td><strong>4. Business Rationale</strong></td>
<td>The Assistant's core responsibility is to prevent leads from going
unactioned (Persona Section 1.1, UX-SPEC-61.2-V1.0). Without a
deterministic urgency ordering, an Assistant under time pressure may
work leads in an arbitrary order and miss the one that has waited
longest, directly undermining the workspace's purpose.</td>
</tr>
<tr class="odd">
<td><strong>5. Related User Stories</strong></td>
<td>US-61.2-03</td>
</tr>
<tr class="even">
<td><strong>6. Related Acceptance Criteria</strong></td>
<td>AC-61.2-004</td>
</tr>
<tr class="odd">
<td><strong>7. Related RBAC Permissions</strong></td>
<td>lead.read — Allow (all active leads), RBAC-MATRIX-V1.1 Section
4.</td>
</tr>
<tr class="even">
<td><strong>8. Trigger</strong></td>
<td>The Assistant opens the Lead Queue widget or its full view.</td>
</tr>
<tr class="odd">
<td><strong>9. Expected Behavior</strong></td>
<td><p>The system computes time-since-last-action for each active
lead.</p>
<p>Leads are sorted with the oldest unactioned lead first.</p>
<p>This ordering is the default; no manual re-ordering is required of
the Assistant for the rule to apply.</p></td>
</tr>
<tr class="even">
<td><strong>10. Exceptions</strong></td>
<td><p>A lead already reassigned by an Administrator remains visible per
lead.read and remains subject to the same ordering rule; no exception is
made for reassigned leads.</p>
<p>The exact sort algorithm and tie-breaking logic (e.g., for two leads
with identical wait times) are left to design/implementation discretion
within this rule's intent and are not fixed here.</p></td>
</tr>
<tr class="odd">
<td><strong>11. Out of Scope</strong></td>
<td><p>Any configurable or user-customizable sort order — not defined
for this iteration.</p>
<p>Prioritization based on lead value, source, or other business
attributes beyond time-since-last-action — not defined for this
iteration.</p></td>
</tr>
</tbody>
</table>

BR-61.2-002 — Lead Update Attribution and Failure Integrity

<table>
<colgroup>
<col style="width: 24%" />
<col style="width: 75%" />
</colgroup>
<tbody>
<tr class="odd">
<td><strong>1. Rule ID</strong></td>
<td>BR-61.2-002</td>
</tr>
<tr class="even">
<td><strong>2. Rule Name</strong></td>
<td>Lead Update Attribution and Failure Integrity</td>
</tr>
<tr class="odd">
<td><strong>3. Description</strong></td>
<td>Every successful update to a lead's status or notes by the Assistant
is attributed and persisted as a whole; if a save operation fails, no
partial update is applied and the lead's prior state is preserved.</td>
</tr>
<tr class="even">
<td><strong>4. Business Rationale</strong></td>
<td>Front desk operations depend on trust that the Lead Queue reflects
reality. A partial save (e.g., status updated but notes not saved, or
vice versa) would silently corrupt that trust and could cause a lead to
be miscategorized without anyone noticing.</td>
</tr>
<tr class="odd">
<td><strong>5. Related User Stories</strong></td>
<td><p>US-61.2-04</p>
<p>US-61.2-05</p></td>
</tr>
<tr class="even">
<td><strong>6. Related Acceptance Criteria</strong></td>
<td><p>AC-61.2-005</p>
<p>AC-61.2-006</p></td>
</tr>
<tr class="odd">
<td><strong>7. Related RBAC Permissions</strong></td>
<td><p>lead.status.update — Allow, RBAC-MATRIX-V1.1 Section 4.</p>
<p>lead.notes.update — Allow, RBAC-MATRIX-V1.1 Section 4.</p></td>
</tr>
<tr class="even">
<td><strong>8. Trigger</strong></td>
<td>The Assistant saves a change to a lead's status and/or notes from
Lead Detail.</td>
</tr>
<tr class="odd">
<td><strong>9. Expected Behavior</strong></td>
<td><p>On success, the change is persisted and attributed per
BR-RBAC-005 (updated_by, updated_at), and the Assistant is returned to
an updated Lead Queue.</p>
<p>On failure (e.g., connectivity issue), the Assistant sees an explicit
error and the lead's prior status/notes remain exactly as they were
before the save attempt — no partial or silent write occurs.</p></td>
</tr>
<tr class="even">
<td><strong>10. Exceptions</strong></td>
<td><p>If both status and notes are changed in a single save action,
they are treated as one atomic update for the purposes of this rule:
both succeed together or neither is applied.</p>
<p>Retry behavior after a failed save is left to design/implementation
discretion; this rule only requires that failure never results in a
partial state.</p></td>
</tr>
<tr class="odd">
<td><strong>11. Out of Scope</strong></td>
<td><p>The specific attribution storage mechanism — governed by
BR-RBAC-005, not redefined here.</p>
<p>Conflict resolution if two Assistants attempt to update the same lead
simultaneously — not defined in this iteration.</p></td>
</tr>
</tbody>
</table>

BR-61.2-003 — Appointment Conflict Prevention

<table>
<colgroup>
<col style="width: 24%" />
<col style="width: 75%" />
</colgroup>
<tbody>
<tr class="odd">
<td><strong>1. Rule ID</strong></td>
<td>BR-61.2-003</td>
</tr>
<tr class="even">
<td><strong>2. Rule Name</strong></td>
<td>Appointment Conflict Prevention</td>
</tr>
<tr class="odd">
<td><strong>3. Description</strong></td>
<td>The system must prevent an appointment from being created or
modified into a time slot that conflicts with an existing booking for
the same provider.</td>
</tr>
<tr class="even">
<td><strong>4. Business Rationale</strong></td>
<td>Double-booking directly damages patient trust and clinic operations.
Front desk staff under time pressure are the most likely to make this
mistake manually; the system must catch it instead of relying on memory
or manual cross-checking.</td>
</tr>
<tr class="odd">
<td><strong>5. Related User Stories</strong></td>
<td><p>US-61.2-06</p>
<p>US-61.2-07</p></td>
</tr>
<tr class="even">
<td><strong>6. Related Acceptance Criteria</strong></td>
<td>AC-61.2-007</td>
</tr>
<tr class="odd">
<td><strong>7. Related RBAC Permissions</strong></td>
<td><p>appointment.create — Allow (for any patient), RBAC-MATRIX-V1.1
Section 5.</p>
<p>appointment.update — Allow (all), RBAC-MATRIX-V1.1 Section
5.</p></td>
</tr>
<tr class="even">
<td><strong>8. Trigger</strong></td>
<td>The Assistant attempts to save a new or modified appointment with a
specific time and provider.</td>
</tr>
<tr class="odd">
<td><strong>9. Expected Behavior</strong></td>
<td><p>The system checks the requested time against existing bookings
for the same provider.</p>
<p>If a conflict exists, the save is blocked and the Assistant is shown
an explanation of the conflict.</p>
<p>If no conflict exists, the save proceeds normally.</p></td>
</tr>
<tr class="even">
<td><strong>10. Exceptions</strong></td>
<td><p>Overlapping appointments for different providers at the same time
are not considered a conflict under this rule.</p>
<p>The precise definition of "overlap" (e.g., back-to-back appointments
with zero gap) is left to design/implementation discretion within this
rule's intent.</p></td>
</tr>
<tr class="odd">
<td><strong>11. Out of Scope</strong></td>
<td><p>Buffer-time rules between appointments (e.g., minimum gap
required) — not defined in this iteration.</p>
<p>Provider-specific availability windows or working-hours constraints —
owned by existing domain logic, not redefined here.</p></td>
</tr>
</tbody>
</table>

BR-61.2-004 — Absence of Physical Deletion Controls in the Workspace

<table>
<colgroup>
<col style="width: 24%" />
<col style="width: 75%" />
</colgroup>
<tbody>
<tr class="odd">
<td><strong>1. Rule ID</strong></td>
<td>BR-61.2-004</td>
</tr>
<tr class="even">
<td><strong>2. Rule Name</strong></td>
<td>Absence of Physical Deletion Controls in the Workspace</td>
</tr>
<tr class="odd">
<td><strong>3. Description</strong></td>
<td>No view, widget, or detail screen in the Front Desk Workspace
presents a control to physically delete an appointment, regardless of
the appointment's state.</td>
</tr>
<tr class="even">
<td><strong>4. Business Rationale</strong></td>
<td>This rule makes BR-RBAC-007's prohibition on physical deletion
concrete at the workspace level: it is not enough for deletion to be
denied on the backend if the interface still invites the Assistant to
attempt it. The absence must be structural, not just enforced after the
fact.</td>
</tr>
<tr class="odd">
<td><strong>5. Related User Stories</strong></td>
<td><p>US-61.2-07</p>
<p>US-61.2-08</p></td>
</tr>
<tr class="even">
<td><strong>6. Related Acceptance Criteria</strong></td>
<td>AC-61.2-008</td>
</tr>
<tr class="odd">
<td><strong>7. Related RBAC Permissions</strong></td>
<td><p>appointment.update — Allow (all), RBAC-MATRIX-V1.1 Section 5.</p>
<p>appointment.cancel — Allow (all), RBAC-MATRIX-V1.1 Section 5.</p>
<p>appointment.delete (physical) — Deny for all roles, per
BR-RBAC-007.</p></td>
</tr>
<tr class="even">
<td><strong>8. Trigger</strong></td>
<td>The Assistant opens Appointment Detail for any appointment, in any
state (confirmed, cancelled, past).</td>
</tr>
<tr class="odd">
<td><strong>9. Expected Behavior</strong></td>
<td><p>Only reschedule (via appointment.update) and cancel (via
appointment.cancel) controls are ever rendered.</p>
<p>This holds uniformly across all appointment states, including
already-cancelled appointments, which offer no further deletion
path.</p></td>
</tr>
<tr class="even">
<td><strong>10. Exceptions</strong></td>
<td>None — this rule applies uniformly with no state-based
exception.</td>
</tr>
<tr class="odd">
<td><strong>11. Out of Scope</strong></td>
<td>Backend/server-side enforcement of the deletion prohibition —
governed by BR-RBAC-007, not redefined here. This rule addresses only
what the workspace renders.</td>
</tr>
</tbody>
</table>

BR-61.2-005 — Mandatory Confirmation Before Cancellation

<table>
<colgroup>
<col style="width: 24%" />
<col style="width: 75%" />
</colgroup>
<tbody>
<tr class="odd">
<td><strong>1. Rule ID</strong></td>
<td>BR-61.2-005</td>
</tr>
<tr class="even">
<td><strong>2. Rule Name</strong></td>
<td>Mandatory Confirmation Before Cancellation</td>
</tr>
<tr class="odd">
<td><strong>3. Description</strong></td>
<td>Cancelling an appointment requires the Assistant to pass through an
explicit confirmation step before the cancellation is finalized.</td>
</tr>
<tr class="even">
<td><strong>4. Business Rationale</strong></td>
<td>Because cancellation is terminal (BR-61.2-006) and the appointment
record can never be physically restored to its prior confirmed state by
the Assistant, an accidental one-click cancellation would cause real
operational harm (a patient incorrectly believing they are no longer
booked, or a slot incorrectly freed).</td>
</tr>
<tr class="odd">
<td><strong>5. Related User Stories</strong></td>
<td>US-61.2-08</td>
</tr>
<tr class="even">
<td><strong>6. Related Acceptance Criteria</strong></td>
<td>AC-61.2-009</td>
</tr>
<tr class="odd">
<td><strong>7. Related RBAC Permissions</strong></td>
<td>appointment.cancel — Allow (all), RBAC-MATRIX-V1.1 Section 5.</td>
</tr>
<tr class="even">
<td><strong>8. Trigger</strong></td>
<td>The Assistant selects "Cancel appointment" from Appointment
Detail.</td>
</tr>
<tr class="odd">
<td><strong>9. Expected Behavior</strong></td>
<td><p>The system presents a confirmation step describing the
consequence of cancelling before finalizing the action.</p>
<p>The cancellation is only finalized after explicit confirmation.</p>
<p>If the Assistant exits or dismisses the confirmation without
confirming, the appointment remains in its prior state,
unchanged.</p></td>
</tr>
<tr class="even">
<td><strong>10. Exceptions</strong></td>
<td>None — confirmation is required uniformly for every cancellation,
regardless of how far in the future the appointment is or who booked
it.</td>
</tr>
<tr class="odd">
<td><strong>11. Out of Scope</strong></td>
<td>The specific wording or visual presentation of the confirmation step
— a UI design concern, not addressed here (see UX-SPEC-61.2-V1.0 Scope
Statement).</td>
</tr>
</tbody>
</table>

BR-61.2-006 — Cancellation Is Terminal and Non-Reversible In-Place

<table>
<colgroup>
<col style="width: 24%" />
<col style="width: 75%" />
</colgroup>
<tbody>
<tr class="odd">
<td><strong>1. Rule ID</strong></td>
<td>BR-61.2-006</td>
</tr>
<tr class="even">
<td><strong>2. Rule Name</strong></td>
<td>Cancellation Is Terminal and Non-Reversible In-Place</td>
</tr>
<tr class="odd">
<td><strong>3. Description</strong></td>
<td>Once an appointment is cancelled, it cannot be reverted back to a
confirmed state in place; restoring the patient's booking requires
creating a new appointment.</td>
</tr>
<tr class="even">
<td><strong>4. Business Rationale</strong></td>
<td>This rule keeps the cancellation history honest: a cancelled
appointment is a historical fact, not a draft state. Allowing in-place
reversal would blur the record of what actually happened and complicate
the guarantee in BR-RBAC-007 that cancellation is a terminal
operation.</td>
</tr>
<tr class="odd">
<td><strong>5. Related User Stories</strong></td>
<td>US-61.2-08</td>
</tr>
<tr class="even">
<td><strong>6. Related Acceptance Criteria</strong></td>
<td>AC-61.2-010</td>
</tr>
<tr class="odd">
<td><strong>7. Related RBAC Permissions</strong></td>
<td><p>appointment.cancel — Allow (all), RBAC-MATRIX-V1.1 Section 5.</p>
<p>appointment.create — Allow (for any patient), RBAC-MATRIX-V1.1
Section 5 (used if the Assistant needs to rebook).</p></td>
</tr>
<tr class="even">
<td><strong>8. Trigger</strong></td>
<td>An appointment's status has been changed to cancelled, per
BR-61.2-005.</td>
</tr>
<tr class="odd">
<td><strong>9. Expected Behavior</strong></td>
<td><p>The cancelled appointment remains visible in appointment history
with a cancelled status; it is never physically removed (per
BR-RBAC-007).</p>
<p>No control is offered to change the status directly back to
confirmed.</p>
<p>If the patient needs to be rebooked, the Assistant uses the standard
appointment creation flow (US-61.2-06) to create a new
appointment.</p></td>
</tr>
<tr class="even">
<td><strong>10. Exceptions</strong></td>
<td>None identified.</td>
</tr>
<tr class="odd">
<td><strong>11. Out of Scope</strong></td>
<td>Automatic rebooking suggestions or waitlist handling triggered by a
cancellation — not defined in this iteration.</td>
</tr>
</tbody>
</table>

BR-61.2-007 — Notification Resend Requires Valid Contact Information

<table>
<colgroup>
<col style="width: 24%" />
<col style="width: 75%" />
</colgroup>
<tbody>
<tr class="odd">
<td><strong>1. Rule ID</strong></td>
<td>BR-61.2-007</td>
</tr>
<tr class="even">
<td><strong>2. Rule Name</strong></td>
<td>Notification Resend Requires Valid Contact Information</td>
</tr>
<tr class="odd">
<td><strong>3. Description</strong></td>
<td>A notification resend action is only completed if the underlying
contact information (e.g., email address) for the recipient is present
and valid; otherwise the resend is blocked and the reason is shown to
the Assistant.</td>
</tr>
<tr class="even">
<td><strong>4. Business Rationale</strong></td>
<td>A resend that silently fails or reports success without actually
reaching the patient is worse than no resend at all, because it gives
the Assistant false confidence that the patient was notified.</td>
</tr>
<tr class="odd">
<td><strong>5. Related User Stories</strong></td>
<td>US-61.2-09</td>
</tr>
<tr class="even">
<td><strong>6. Related Acceptance Criteria</strong></td>
<td>AC-61.2-011</td>
</tr>
<tr class="odd">
<td><strong>7. Related RBAC Permissions</strong></td>
<td>Notification send/resend — Allow, per RBAC-MATRIX-V1.1 preliminary
RBAC summary (Section 3, Notifications row).</td>
</tr>
<tr class="even">
<td><strong>8. Trigger</strong></td>
<td>The Assistant selects "Resend notification" for a given appointment
or lead communication.</td>
</tr>
<tr class="odd">
<td><strong>9. Expected Behavior</strong></td>
<td><p>The system checks that valid contact information exists for the
recipient.</p>
<p>If valid, the notification is sent through the existing certified
notification channel (email/ICS) and the resend event is logged.</p>
<p>If invalid or missing, the resend is blocked and the Assistant is
told why, rather than receiving a false success confirmation.</p></td>
</tr>
<tr class="even">
<td><strong>10. Exceptions</strong></td>
<td>None identified — this check applies uniformly to every resend
attempt.</td>
</tr>
<tr class="odd">
<td><strong>11. Out of Scope</strong></td>
<td>Correcting or updating the patient's contact information — not part
of this rule or this iteration's flow; the Assistant is informed of the
problem but fixing it happens elsewhere.</td>
</tr>
</tbody>
</table>

BR-61.2-008 — Shift Summary Counts Must Reflect Live Underlying Data

<table>
<colgroup>
<col style="width: 24%" />
<col style="width: 75%" />
</colgroup>
<tbody>
<tr class="odd">
<td><strong>1. Rule ID</strong></td>
<td>BR-61.2-008</td>
</tr>
<tr class="even">
<td><strong>2. Rule Name</strong></td>
<td>Shift Summary Counts Must Reflect Live Underlying Data</td>
</tr>
<tr class="odd">
<td><strong>3. Description</strong></td>
<td>The counts shown in the Shift Summary widget (open leads,
unconfirmed appointments, pending notification resends) must, at the
moment they are viewed, match the actual underlying data visible in the
Lead Queue, Today's Schedule, and Notifications Log respectively.</td>
</tr>
<tr class="even">
<td><strong>4. Business Rationale</strong></td>
<td>The Shift Summary exists specifically so a Shift Lead can trust a
quick glance instead of manually cross-checking three separate views
(US-61.2-10). If the counts can silently drift from the underlying data,
the summary becomes actively misleading rather than merely
incomplete.</td>
</tr>
<tr class="odd">
<td><strong>5. Related User Stories</strong></td>
<td>US-61.2-10</td>
</tr>
<tr class="even">
<td><strong>6. Related Acceptance Criteria</strong></td>
<td>AC-61.2-012</td>
</tr>
<tr class="odd">
<td><strong>7. Related RBAC Permissions</strong></td>
<td><p>lead.read — Allow (all active leads), RBAC-MATRIX-V1.1 Section
4.</p>
<p>appointment.read — Allow (all), RBAC-MATRIX-V1.1 Section 5.</p></td>
</tr>
<tr class="even">
<td><strong>8. Trigger</strong></td>
<td>The Assistant views the Shift Summary widget on the Front Desk
Workspace.</td>
</tr>
<tr class="odd">
<td><strong>9. Expected Behavior</strong></td>
<td><p>Each displayed count is derived directly from the same underlying
data used by Lead Queue and Today's Schedule at view time — not from a
separately maintained or cached total that could drift.</p>
<p>If the underlying data for a given count fails to load, that count is
shown as failed to load rather than defaulting to zero.</p></td>
</tr>
<tr class="even">
<td><strong>10. Exceptions</strong></td>
<td>None identified.</td>
</tr>
<tr class="odd">
<td><strong>11. Out of Scope</strong></td>
<td>The specific technical mechanism for keeping counts live (polling
interval, on-demand recompute, etc.) — an architecture/implementation
concern, explicitly left open (see UX-SPEC-61.2-V1.0 Section 11,
real-time update mechanism).</td>
</tr>
</tbody>
</table>

BR-61.2-009 — Unauthorized Controls Must Be Absent, Not Disabled

<table>
<colgroup>
<col style="width: 24%" />
<col style="width: 75%" />
</colgroup>
<tbody>
<tr class="odd">
<td><strong>1. Rule ID</strong></td>
<td>BR-61.2-009</td>
</tr>
<tr class="even">
<td><strong>2. Rule Name</strong></td>
<td>Unauthorized Controls Must Be Absent, Not Disabled</td>
</tr>
<tr class="odd">
<td><strong>3. Description</strong></td>
<td>Any action outside the Assistant's authorized permission set, as
defined in RBAC-MATRIX-V1.1, must never appear as a visible-but-disabled
control anywhere in the Front Desk Workspace; it must be entirely absent
from the rendered interface.</td>
</tr>
<tr class="even">
<td><strong>4. Business Rationale</strong></td>
<td>A disabled control still teaches the Assistant that the action
exists and invites repeated, frustrating attempts to use it. More
importantly, visible-but-disabled controls for Administrator-only or
universally prohibited actions (e.g., lead.owner.reassign, lead.delete)
blur the boundary RBAC-MATRIX-V1.1 establishes and create confusion
about what the role can actually do.</td>
</tr>
<tr class="odd">
<td><strong>5. Related User Stories</strong></td>
<td>US-61.2-11</td>
</tr>
<tr class="even">
<td><strong>6. Related Acceptance Criteria</strong></td>
<td><p>AC-61.2-004</p>
<p>AC-61.2-008</p>
<p>AC-61.2-013</p></td>
</tr>
<tr class="odd">
<td><strong>7. Related RBAC Permissions</strong></td>
<td>This rule is a cross-cutting constraint over every permission
boundary in RBAC-MATRIX-V1.1, including lead.owner.reassign,
lead.delete, appointment.delete, user.delete, user.deactivate, and
user.reactivate, all Administrator-only or universally denied for
Assistant.</td>
</tr>
<tr class="even">
<td><strong>8. Trigger</strong></td>
<td>Any dashboard section, widget, or detail view is rendered for the
Assistant role.</td>
</tr>
<tr class="odd">
<td><strong>9. Expected Behavior</strong></td>
<td><p>The rendering logic includes only controls for actions the
Assistant role is authorized to perform.</p>
<p>No control for an out-of-scope action is rendered in a disabled,
greyed-out, or hidden-but-present state — it is not present in the
rendered output at all.</p></td>
</tr>
<tr class="even">
<td><strong>10. Exceptions</strong></td>
<td>None — this rule applies uniformly across every view in the
workspace with no exception.</td>
</tr>
<tr class="odd">
<td><strong>11. Out of Scope</strong></td>
<td>Server-side/backend enforcement of these same boundaries — assumed
to already exist as part of the certified authorization layer; this rule
addresses dashboard rendering only, not backend enforcement.</td>
</tr>
</tbody>
</table>

BR-61.2-010 — Detail Views Must Return to Their Originating Section

<table>
<colgroup>
<col style="width: 24%" />
<col style="width: 75%" />
</colgroup>
<tbody>
<tr class="odd">
<td><strong>1. Rule ID</strong></td>
<td>BR-61.2-010</td>
</tr>
<tr class="even">
<td><strong>2. Rule Name</strong></td>
<td>Detail Views Must Return to Their Originating Section</td>
</tr>
<tr class="odd">
<td><strong>3. Description</strong></td>
<td>Navigating back from Lead Detail or Appointment Detail returns the
Assistant to the specific section they came from (Lead Queue or Today's
Schedule), not merely to the Front Desk Workspace root.</td>
</tr>
<tr class="even">
<td><strong>4. Business Rationale</strong></td>
<td>An Assistant working through a list of leads or appointments loses
meaningful time and context if every detail view dumps them back to the
top-level dashboard, forcing them to re-navigate and re-find their
place.</td>
</tr>
<tr class="odd">
<td><strong>5. Related User Stories</strong></td>
<td>US-61.2-12</td>
</tr>
<tr class="even">
<td><strong>6. Related Acceptance Criteria</strong></td>
<td>AC-61.2-014</td>
</tr>
<tr class="odd">
<td><strong>7. Related RBAC Permissions</strong></td>
<td><p>lead.read — Allow (all active leads), RBAC-MATRIX-V1.1 Section 4
(required to enter Lead Detail).</p>
<p>appointment.read — Allow (all), RBAC-MATRIX-V1.1 Section 5 (required
to enter Appointment Detail).</p></td>
</tr>
<tr class="even">
<td><strong>8. Trigger</strong></td>
<td>The Assistant selects the back control from Lead Detail or
Appointment Detail, or completes a save/cancel action that concludes the
detail view.</td>
</tr>
<tr class="odd">
<td><strong>9. Expected Behavior</strong></td>
<td><p>The Assistant is returned to the specific section (Lead Queue or
Today's Schedule) they navigated from, reflecting any update just
made.</p>
<p>This applies both to an explicit back action and to the automatic
return that follows a successful save or cancellation.</p></td>
</tr>
<tr class="even">
<td><strong>10. Exceptions</strong></td>
<td>None identified.</td>
</tr>
<tr class="odd">
<td><strong>11. Out of Scope</strong></td>
<td><p>Browser-level back-button behavior beyond the in-app back control
— not addressed by this rule.</p>
<p>Deep-linking directly into a detail view from outside the dashboard —
not defined in this iteration.</p></td>
</tr>
</tbody>
</table>

BR-61.2-011 — Empty States Must Be Explicit, Never Blank

<table>
<colgroup>
<col style="width: 24%" />
<col style="width: 75%" />
</colgroup>
<tbody>
<tr class="odd">
<td><strong>1. Rule ID</strong></td>
<td>BR-61.2-011</td>
</tr>
<tr class="even">
<td><strong>2. Rule Name</strong></td>
<td>Empty States Must Be Explicit, Never Blank</td>
</tr>
<tr class="odd">
<td><strong>3. Description</strong></td>
<td>Whenever a list-based section of the Front Desk Workspace (Today's
Schedule, Lead Queue, Notifications Log) has no items to show, it
displays an explicit message stating that, rather than appearing as a
blank or empty area indistinguishable from a loading or failed
state.</td>
</tr>
<tr class="even">
<td><strong>4. Business Rationale</strong></td>
<td>An Assistant glancing at a blank widget cannot tell whether there is
genuinely nothing to do, the data failed to load, or the page is still
loading. That ambiguity is exactly the kind of moment-of-doubt this
time-pressured role (Persona Section 1.1) cannot afford.</td>
</tr>
<tr class="odd">
<td><strong>5. Related User Stories</strong></td>
<td><p>US-61.2-02</p>
<p>US-61.2-03</p>
<p>US-61.2-09</p></td>
</tr>
<tr class="even">
<td><strong>6. Related Acceptance Criteria</strong></td>
<td>AC-61.2-003</td>
</tr>
<tr class="odd">
<td><strong>7. Related RBAC Permissions</strong></td>
<td><p>appointment.read — Allow (all), RBAC-MATRIX-V1.1 Section 5.</p>
<p>lead.read — Allow (all active leads), RBAC-MATRIX-V1.1 Section
4.</p></td>
</tr>
<tr class="even">
<td><strong>8. Trigger</strong></td>
<td>A list-based section finishes loading and finds zero items to
display.</td>
</tr>
<tr class="odd">
<td><strong>9. Expected Behavior</strong></td>
<td><p>The section displays an explicit, unambiguous empty-state message
appropriate to that section (e.g., no appointments today, no active
leads).</p>
<p>An empty state is visually and programmatically distinguishable from
a loading state and from a load-failure state.</p></td>
</tr>
<tr class="even">
<td><strong>10. Exceptions</strong></td>
<td>None identified — this rule applies uniformly to every list-based
section named above.</td>
</tr>
<tr class="odd">
<td><strong>11. Out of Scope</strong></td>
<td>The exact wording or visual treatment of each empty-state message —
a UI design concern, not addressed here.</td>
</tr>
</tbody>
</table>

BR-61.2-012 — Default Dashboard Routing Is Deterministic by Role

<table>
<colgroup>
<col style="width: 24%" />
<col style="width: 75%" />
</colgroup>
<tbody>
<tr class="odd">
<td><strong>1. Rule ID</strong></td>
<td>BR-61.2-012</td>
</tr>
<tr class="even">
<td><strong>2. Rule Name</strong></td>
<td>Default Dashboard Routing Is Deterministic by Role</td>
</tr>
<tr class="odd">
<td><strong>3. Description</strong></td>
<td>An authenticated user whose role resolves to Assistant is always
routed to the Front Desk Workspace immediately after login, with no
intermediate generic landing page.</td>
</tr>
<tr class="even">
<td><strong>4. Business Rationale</strong></td>
<td>Time-pressured front desk staff (Persona Section 1.1) need to start
working immediately. Any generic intermediate landing step adds friction
to every single login, multiplied across every shift.</td>
</tr>
<tr class="odd">
<td><strong>5. Related User Stories</strong></td>
<td>US-61.2-01</td>
</tr>
<tr class="even">
<td><strong>6. Related Acceptance Criteria</strong></td>
<td>AC-61.2-001</td>
</tr>
<tr class="odd">
<td><strong>7. Related RBAC Permissions</strong></td>
<td>This rule depends on role resolution already authorized and defined
by RBAC-MATRIX-V1.1 Section 7 (dashboard routing for Assistant -&gt;
Front Desk Workspace); it introduces no new permission.</td>
</tr>
<tr class="even">
<td><strong>8. Trigger</strong></td>
<td>An Assistant completes successful authentication.</td>
</tr>
<tr class="odd">
<td><strong>9. Expected Behavior</strong></td>
<td><p>The system resolves the authenticated user's role as
Assistant.</p>
<p>The system routes the Assistant directly to the Front Desk
Workspace.</p>
<p>The Front Desk Workspace renders its dashboard sections
(UX-SPEC-61.2-V1.0 Section 6) without an intermediate generic
page.</p></td>
</tr>
<tr class="even">
<td><strong>10. Exceptions</strong></td>
<td>If role resolution fails or returns an unrecognized role, routing to
the Front Desk Workspace does not occur; this failure case belongs to
the authentication/identity layer (see Out of Scope).</td>
</tr>
<tr class="odd">
<td><strong>11. Out of Scope</strong></td>
<td><p>The authentication mechanism itself (credential validation,
session management) and role-resolution failure handling — owned by the
identity/auth layer, not this rule.</p>
<p>Dashboard routing for any role other than Assistant.</p></td>
</tr>
</tbody>
</table>

4\. Document-Wide Open Items

Consistent with UX-SPEC-61.2-V1.0 Section 11, USER-STORIES-61.2-V1.0
Section 3, and RBAC-MATRIX-V1.1 Section 10, the following remain
unresolved by this document and are not narrowed, implied, or answered
by any rule above:

- Doctor \<-\> Patient Assignment Model.

- Lead \<-\> Patient Relationship Model.

- Retention / Soft Delete Policy.

- Role Assignment Workflow.

- Real-time update mechanism (polling, websockets, or otherwise)
  underlying near-real-time widgets and live counts (referenced in
  BR-61.2-008).

- Global search (explicitly deferred).

*This Business Rules Package intentionally does not propose answers to
the items above. Resolution remains deferred to Architecture Review.*

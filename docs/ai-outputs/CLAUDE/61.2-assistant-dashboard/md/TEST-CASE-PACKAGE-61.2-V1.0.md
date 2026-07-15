**DentalOperix**

**Test Case Package**

Front Desk Workspace (Assistant Dashboard)

Document ID: TEST-CASE-PACKAGE-61.2-V1.0

Iteration: 61.2 — Assistant Dashboard

**Status: READY FOR ARCHITECTURE REVIEW**

Author role: Product Analyst / Functional Designer

**Derived exclusively from:**

_RBAC-MATRIX-V1.1_

_UX-SPEC-61.2-V1.0_

_USER-STORIES-61.2-V1.0_

_BUSINESS-RULES-61.2-V1.0_

_ARCHITECTURE-REVIEW-SUMMARY-61.2-V1.0_

**Permanent constraint honored throughout this document:**

**Leads = Source of Truth**

0\. Scope Statement

This document defines the formal test case package for Iteration 61.2 —
Front Desk Workspace. Every test case below is derived from, and only
from, the five artifacts listed on the title page. No test case
introduces behavior, condition, or expected result that is not already
stated in one of those artifacts.

Specifically, every test case traces to:

- An Acceptance Criterion (AC-61.2-001 through AC-61.2-014), as the
  primary source of expected behavior.

- The User Story that AC belongs to, in USER-STORIES-61.2-V1.0.

- The Business Rule(s), where applicable, that the AC's expected
  behavior implements, in BUSINESS-RULES-61.2-V1.0.

- The RBAC permission(s) the test case exercises or verifies the absence
  of, in RBAC-MATRIX-V1.1.

This document does not include or imply:

- Any new acceptance criterion, business rule, or user story beyond what
  the five source artifacts already define.

- Any new permission or modification to a permission already defined in
  RBAC-MATRIX-V1.1.

- Resolution of any Open Item or Architecture Review Question already
  registered in ARCHITECTURE-REVIEW-SUMMARY-61.2-V1.0.

- Any change to the certified Leads pipeline (LeadPersistencePort -\>
  LeadPersistenceProvider -\> RelationalLeadPersistenceAdapter -\>
  Supabase PostgreSQL) or to Leads as Source of Truth.

- Test automation code, scripts, or framework-specific syntax — this is
  a functional test specification, not an automation artifact.

_Where a test case exercises a permission boundary (e.g., verifying an
Administrator-only control is absent for Assistant), the test case
verifies behavior already specified in RBAC-MATRIX-V1.1 and
BUSINESS-RULES-61.2-V1.0; it does not define a new boundary._

1\. Test Approach and Conventions

1.1 Test Case ID Convention

Test cases use the ID format TC-61.2-XXX, numbered sequentially. Each
test case maps to exactly one Acceptance Criterion as its primary
source; where an AC's own Given/When/Then already encodes more than one
distinct condition (e.g., a success path and a failure path stated
together), multiple test cases are derived from that single AC to cover
each condition explicitly — no condition is added beyond what the AC
already states.

1.2 Test Case Structure

Each test case includes:

- Test Case ID and Title.

- Source AC, User Story, Business Rule(s), and RBAC permission(s) — full
  traceability, no new identifiers introduced.

- Preconditions.

- Test Steps (numbered, restarting at 1 for each test case).

- Expected Result — taken directly from the AC's "Then" clause, expanded
  into concrete, checkable terms without adding new behavior.

- Test Type — Functional, Authorization, Negative, or Navigation, used
  only to aid organization in Section 3; not a new requirement category.

  1.3 Test Types Used

|                   |                                                                                                                                              |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| **Type**          | **Meaning**                                                                                                                                  |
| **Functional**    | Verifies the system performs the primary, intended behavior described by the AC under normal conditions.                                     |
| **Authorization** | Verifies a permission boundary already defined in RBAC-MATRIX-V1.1 is correctly enforced or correctly absent in the UI.                      |
| **Negative**      | Verifies the system's behavior when the AC's stated exception/failure condition occurs (e.g., save failure, conflict, invalid contact info). |
| **Navigation**    | Verifies a navigation or routing guarantee stated in the AC or UX-SPEC-61.2-V1.0 Navigation Model.                                           |

1.4 Out-of-Scope Test Concerns (Document-Wide)

Consistent with the source artifacts, this package does not include test
cases for:

- Any item listed in ARCHITECTURE-REVIEW-SUMMARY-61.2-V1.0 Section 7
  (Open Items Registry) — these remain unresolved by design and are not
  testable until resolved.

- Backend/server-side enforcement mechanisms for permission boundaries —
  assumed to exist as part of the certified authorization layer; this
  package tests dashboard-level behavior only, consistent with
  BR-61.2-009's stated boundary.

- Any visual/UI design verification (colors, layout, pixel-level checks)
  — none of the source artifacts specify visual design (see
  UX-SPEC-61.2-V1.0 Scope Statement).

- Performance, load, or scalability testing — not addressed by any
  source artifact.

2\. Traceability Overview

This table is the master index of all test cases. All 14 Acceptance
Criteria (AC-61.2-001 through AC-61.2-014) are covered by exactly one
test case each in this initial package; full detail, including secondary
traceability to User Stories, Business Rules, and RBAC permissions,
follows in Section 3.

|                 |                                                                           |               |               |
| --------------- | ------------------------------------------------------------------------- | ------------- | ------------- |
| **Test Case**   | **Title**                                                                 | **Source AC** | **Type**      |
| **TC-61.2-001** | Assistant lands on Front Desk Workspace after login                       | AC-61.2-001   | Functional    |
| **TC-61.2-002** | Today's Schedule lists appointments ordered by start time                 | AC-61.2-002   | Functional    |
| **TC-61.2-003** | Today's Schedule shows explicit empty state with zero appointments        | AC-61.2-003   | Negative      |
| **TC-61.2-004** | Lead Queue displays active leads without unauthorized controls            | AC-61.2-004   | Authorization |
| **TC-61.2-005** | Lead status/notes update persists with attribution                        | AC-61.2-005   | Functional    |
| **TC-61.2-006** | Lead status/notes save failure preserves prior state                      | AC-61.2-006   | Negative      |
| **TC-61.2-007** | Appointment save blocked on time conflict                                 | AC-61.2-007   | Negative      |
| **TC-61.2-008** | Appointment Detail offers no physical delete control                      | AC-61.2-008   | Authorization |
| **TC-61.2-009** | Cancellation requires explicit confirmation before finalizing             | AC-61.2-009   | Functional    |
| **TC-61.2-010** | Cancelled appointment remains visible in history, never removed           | AC-61.2-010   | Functional    |
| **TC-61.2-011** | Notification resend blocked on invalid contact information                | AC-61.2-011   | Negative      |
| **TC-61.2-012** | Shift Summary counts match underlying Lead/Appointment data               | AC-61.2-012   | Functional    |
| **TC-61.2-013** | No out-of-scope control is rendered, disabled or otherwise, for Assistant | AC-61.2-013   | Authorization |
| **TC-61.2-014** | Detail view back navigation returns to originating section                | AC-61.2-014   | Navigation    |

3\. Test Cases — Detail

Each test case below follows the structure defined in Section 1.2. Test
case order follows the Traceability Overview (Section 2).

TC-61.2-001 — Assistant lands on Front Desk Workspace after login

|                                 |                                                                                       |
| ------------------------------- | ------------------------------------------------------------------------------------- |
| **Test Case ID**                | TC-61.2-001                                                                           |
| **Title**                       | Assistant lands on Front Desk Workspace after login                                   |
| **Test Type**                   | Functional                                                                            |
| **Source Acceptance Criterion** | AC-61.2-001                                                                           |
| **Source User Story**           | US-61.2-01                                                                            |
| **Source Business Rule(s)**     | BR-61.2-012                                                                           |
| **Source RBAC Permission(s)**   | Dashboard routing for Assistant -\> Front Desk Workspace, RBAC-MATRIX-V1.1 Section 7. |

Preconditions

- A valid user account exists with role Assistant.

- The Assistant is not currently authenticated.

Test Steps

1.  Navigate to the DentalOperix login page.

2.  Enter valid credentials for the Assistant account.

3.  Submit the login form.

Expected Result

- Login completes successfully.

- The Assistant is routed directly to the Front Desk Workspace.

- No other role's dashboard (e.g., Operations Console, Clinical
  Workspace, Patient Portal) is displayed at any point during or after
  routing.

TC-61.2-002 — Today's Schedule lists appointments ordered by start time

|                                 |                                                                                                                          |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| **Test Case ID**                | TC-61.2-002                                                                                                              |
| **Title**                       | Today's Schedule lists appointments ordered by start time                                                                |
| **Test Type**                   | Functional                                                                                                               |
| **Source Acceptance Criterion** | AC-61.2-002                                                                                                              |
| **Source User Story**           | US-61.2-02                                                                                                               |
| **Source Business Rule(s)**     | (none — this case verifies the AC's stated display behavior directly; no additional BR governs ordering of appointments) |
| **Source RBAC Permission(s)**   | appointment.read — Allow (all), RBAC-MATRIX-V1.1 Section 5.                                                              |

Preconditions

- The Assistant is authenticated and viewing the Front Desk Workspace.

- At least three appointments exist for the current date, with distinct
  start times, across at least two providers.

Test Steps

1.  Observe the Today's Schedule widget on the Front Desk Workspace.

2.  Record the order in which appointments are listed.

3.  Compare the listed order against the actual start times of the
    underlying appointments.

Expected Result

- All appointments scheduled for the current date are listed in the
  widget.

- The listed order matches ascending start time, regardless of provider.

- Each listed appointment shows patient name, time, and provider, per
  UX-SPEC-61.2-V1.0 Section 7.1.

TC-61.2-003 — Today's Schedule shows explicit empty state with zero
appointments

|                                 |                                                                    |
| ------------------------------- | ------------------------------------------------------------------ |
| **Test Case ID**                | TC-61.2-003                                                        |
| **Title**                       | Today's Schedule shows explicit empty state with zero appointments |
| **Test Type**                   | Negative                                                           |
| **Source Acceptance Criterion** | AC-61.2-003                                                        |
| **Source User Story**           | US-61.2-02                                                         |
| **Source Business Rule(s)**     | BR-61.2-011                                                        |
| **Source RBAC Permission(s)**   | appointment.read — Allow (all), RBAC-MATRIX-V1.1 Section 5.        |

Preconditions

- The Assistant is authenticated and viewing the Front Desk Workspace.

- Zero appointments exist for the current date.

Test Steps

1.  Observe the Today's Schedule widget on the Front Desk Workspace.

Expected Result

- The widget displays an explicit message stating there are no
  appointments scheduled for the current date.

- The widget area is not blank, and is not visually or programmatically
  indistinguishable from a loading state or a load-failure state, per
  BR-61.2-011.

TC-61.2-004 — Lead Queue displays active leads without unauthorized
controls

|                                 |                                                                                                                                                                       |
| ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Test Case ID**                | TC-61.2-004                                                                                                                                                           |
| **Title**                       | Lead Queue displays active leads without unauthorized controls                                                                                                        |
| **Test Type**                   | Authorization                                                                                                                                                         |
| **Source Acceptance Criterion** | AC-61.2-004                                                                                                                                                           |
| **Source User Story**           | US-61.2-03                                                                                                                                                            |
| **Source Business Rule(s)**     | BR-61.2-001, BR-61.2-009                                                                                                                                              |
| **Source RBAC Permission(s)**   | lead.read — Allow (all active leads), RBAC-MATRIX-V1.1 Section 4. lead.owner.reassign — Deny for Assistant. lead.delete (physical) — Deny for all roles, BR-RBAC-006. |

Preconditions

- The Assistant is authenticated and viewing the Front Desk Workspace.

- At least one active lead exists.

Test Steps

1.  Open the Lead Queue widget or its full view.

2.  Inspect the list of active leads displayed.

3.  Select a lead to open Lead Detail.

4.  Inspect all controls rendered on both the Lead Queue list and Lead
    Detail.

Expected Result

- All active leads are visible in the Lead Queue, consistent with
  lead.read.

- Leads are ordered with the oldest unactioned lead first, per
  BR-61.2-001.

- No control for reassigning lead ownership (lead.owner.reassign) is
  present anywhere in the Lead Queue or Lead Detail.

- No control for physically deleting a lead is present anywhere in the
  Lead Queue or Lead Detail.

TC-61.2-005 — Lead status/notes update persists with attribution

|                                 |                                                                                                                |
| ------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| **Test Case ID**                | TC-61.2-005                                                                                                    |
| **Title**                       | Lead status/notes update persists with attribution                                                             |
| **Test Type**                   | Functional                                                                                                     |
| **Source Acceptance Criterion** | AC-61.2-005                                                                                                    |
| **Source User Story**           | US-61.2-04, US-61.2-05                                                                                         |
| **Source Business Rule(s)**     | BR-61.2-002                                                                                                    |
| **Source RBAC Permission(s)**   | lead.status.update — Allow, RBAC-MATRIX-V1.1 Section 4. lead.notes.update — Allow, RBAC-MATRIX-V1.1 Section 4. |

Preconditions

- The Assistant is authenticated and has opened Lead Detail for an
  existing active lead.

- The lead's current status and notes are known/recorded for comparison.

Test Steps

1.  On Lead Detail, select the status field and choose a new status
    value different from the current one.

2.  Edit the notes field, adding new text.

3.  Save the change.

4.  Observe the resulting state of the lead in the Lead Queue after the
    save completes.

Expected Result

- The save completes successfully with no error shown.

- The lead's status reflects the newly selected value.

- The lead's notes reflect the newly added text.

- The change is attributed with updated_by and updated_at values
  reflecting the acting Assistant and the time of the save, per
  BR-RBAC-005.

- The Assistant is returned to the Lead Queue, which reflects the
  updated lead state.

TC-61.2-006 — Lead status/notes save failure preserves prior state

|                                 |                                                                                                                |
| ------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| **Test Case ID**                | TC-61.2-006                                                                                                    |
| **Title**                       | Lead status/notes save failure preserves prior state                                                           |
| **Test Type**                   | Negative                                                                                                       |
| **Source Acceptance Criterion** | AC-61.2-006                                                                                                    |
| **Source User Story**           | US-61.2-04, US-61.2-05                                                                                         |
| **Source Business Rule(s)**     | BR-61.2-002                                                                                                    |
| **Source RBAC Permission(s)**   | lead.status.update — Allow, RBAC-MATRIX-V1.1 Section 4. lead.notes.update — Allow, RBAC-MATRIX-V1.1 Section 4. |

Preconditions

- The Assistant is authenticated and has opened Lead Detail for an
  existing active lead.

- A save failure condition can be induced or simulated (e.g., network
  interruption) for this lead's update.

Test Steps

1.  On Lead Detail, change the status and/or notes for the lead.

2.  Trigger the save action while the failure condition is active.

3.  Observe the system's response.

4.  After the failed attempt, inspect the lead's actual stored status
    and notes.

Expected Result

- An explicit error message is shown to the Assistant indicating the
  save did not complete.

- The lead's stored status and notes remain exactly as they were before
  the save attempt.

- No partial update (e.g., status changed but notes not saved, or vice
  versa) is observed.

TC-61.2-007 — Appointment save blocked on time conflict

|                                 |                                                                                                                                         |
| ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| **Test Case ID**                | TC-61.2-007                                                                                                                             |
| **Title**                       | Appointment save blocked on time conflict                                                                                               |
| **Test Type**                   | Negative                                                                                                                                |
| **Source Acceptance Criterion** | AC-61.2-007                                                                                                                             |
| **Source User Story**           | US-61.2-06, US-61.2-07                                                                                                                  |
| **Source Business Rule(s)**     | BR-61.2-003                                                                                                                             |
| **Source RBAC Permission(s)**   | appointment.create — Allow (for any patient), RBAC-MATRIX-V1.1 Section 5. appointment.update — Allow (all), RBAC-MATRIX-V1.1 Section 5. |

Preconditions

- The Assistant is authenticated and viewing Today's Schedule.

- An existing confirmed appointment occupies a known time slot for a
  specific provider.

Test Steps

1.  Initiate creation of a new appointment (or modification of a
    different existing appointment) for the same provider, using a time
    that overlaps the existing appointment's slot.

2.  Attempt to save.

3.  Observe the system's response.

4.  Confirm whether the new/modified appointment was saved.

Expected Result

- The save is blocked; the conflicting appointment is not created or
  modified into the conflicting time.

- The Assistant is shown an explanation that identifies the conflict.

- The pre-existing appointment remains unchanged.

- No double-booking exists in the system after the attempt.

TC-61.2-008 — Appointment Detail offers no physical delete control

|                                 |                                                                                                                                                                                              |
| ------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Test Case ID**                | TC-61.2-008                                                                                                                                                                                  |
| **Title**                       | Appointment Detail offers no physical delete control                                                                                                                                         |
| **Test Type**                   | Authorization                                                                                                                                                                                |
| **Source Acceptance Criterion** | AC-61.2-008                                                                                                                                                                                  |
| **Source User Story**           | US-61.2-07, US-61.2-08                                                                                                                                                                       |
| **Source Business Rule(s)**     | BR-61.2-004                                                                                                                                                                                  |
| **Source RBAC Permission(s)**   | appointment.update — Allow (all), RBAC-MATRIX-V1.1 Section 5. appointment.cancel — Allow (all), RBAC-MATRIX-V1.1 Section 5. appointment.delete (physical) — Deny for all roles, BR-RBAC-007. |

Preconditions

- The Assistant is authenticated.

- At least one appointment exists in each of the following states:
  confirmed (upcoming), cancelled, and past/completed.

Test Steps

1.  Open Appointment Detail for the confirmed appointment and inspect
    all available controls.

2.  Repeat for the cancelled appointment.

3.  Repeat for the past/completed appointment.

Expected Result

- In every state inspected, only reschedule (appointment.update) and
  cancel (appointment.cancel) controls are available, where applicable
  to that state.

- No control to physically delete the appointment is present in any
  state, including the already-cancelled appointment, per BR-61.2-004.

TC-61.2-009 — Cancellation requires explicit confirmation before
finalizing

|                                 |                                                               |
| ------------------------------- | ------------------------------------------------------------- |
| **Test Case ID**                | TC-61.2-009                                                   |
| **Title**                       | Cancellation requires explicit confirmation before finalizing |
| **Test Type**                   | Functional                                                    |
| **Source Acceptance Criterion** | AC-61.2-009                                                   |
| **Source User Story**           | US-61.2-08                                                    |
| **Source Business Rule(s)**     | BR-61.2-005                                                   |
| **Source RBAC Permission(s)**   | appointment.cancel — Allow (all), RBAC-MATRIX-V1.1 Section 5. |

Preconditions

- The Assistant is authenticated and has opened Appointment Detail for
  an existing confirmed appointment.

Test Steps

1.  Select "Cancel appointment."

2.  Observe whether a confirmation step is presented before the
    cancellation is finalized.

3.  Without confirming, dismiss or exit the confirmation step.

4.  Inspect the appointment's status after exiting without confirming.

5.  Repeat the cancel action and this time confirm.

6.  Inspect the appointment's status after confirming.

Expected Result

- A confirmation step is presented after selecting "Cancel appointment"
  and before the cancellation is finalized.

- If the Assistant exits without confirming, the appointment remains in
  its prior (confirmed) state, unchanged.

- If the Assistant confirms, the appointment's status changes to
  cancelled.

TC-61.2-010 — Cancelled appointment remains visible in history, never
removed

|                                 |                                                                                                                                |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| **Test Case ID**                | TC-61.2-010                                                                                                                    |
| **Title**                       | Cancelled appointment remains visible in history, never removed                                                                |
| **Test Type**                   | Functional                                                                                                                     |
| **Source Acceptance Criterion** | AC-61.2-010                                                                                                                    |
| **Source User Story**           | US-61.2-08                                                                                                                     |
| **Source Business Rule(s)**     | BR-61.2-006                                                                                                                    |
| **Source RBAC Permission(s)**   | appointment.cancel — Allow (all), RBAC-MATRIX-V1.1 Section 5. appointment.delete (physical) — Deny for all roles, BR-RBAC-007. |

Preconditions

- An appointment has already been cancelled (following TC-61.2-009 or
  equivalent prior state).

Test Steps

1.  Navigate to the appointment's history or record view (e.g., via
    Today's Schedule for the relevant date, or appointment history if
    available).

2.  Locate the cancelled appointment.

3.  Inspect its displayed status.

4.  Attempt to locate any path that would restore it directly to
    confirmed status without creating a new appointment.

Expected Result

- The cancelled appointment remains visible in the historical record.

- Its status is displayed as cancelled.

- The appointment record has not been physically removed.

- No control exists to revert the appointment directly back to confirmed
  status in place, per BR-61.2-006.

TC-61.2-011 — Notification resend blocked on invalid contact information

|                                 |                                                                                              |
| ------------------------------- | -------------------------------------------------------------------------------------------- |
| **Test Case ID**                | TC-61.2-011                                                                                  |
| **Title**                       | Notification resend blocked on invalid contact information                                   |
| **Test Type**                   | Negative                                                                                     |
| **Source Acceptance Criterion** | AC-61.2-011                                                                                  |
| **Source User Story**           | US-61.2-09                                                                                   |
| **Source Business Rule(s)**     | BR-61.2-007                                                                                  |
| **Source RBAC Permission(s)**   | Notification send/resend — Allow, per RBAC-MATRIX-V1.1 preliminary RBAC summary (Section 3). |

Preconditions

- The Assistant is authenticated.

- An appointment or lead communication exists where the recipient's
  contact information (e.g., email address) is missing or invalid.

Test Steps

1.  Open Appointment Detail or the Notifications Log for the affected
    record.

2.  Select "Resend notification."

3.  Observe the system's response.

Expected Result

- The resend is blocked; no notification is actually sent.

- The Assistant is shown an explanation that the contact information is
  missing or invalid.

- The system does not report a false success for the resend attempt.

TC-61.2-012 — Shift Summary counts match underlying Lead/Appointment
data

|                                 |                                                                                                                               |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| **Test Case ID**                | TC-61.2-012                                                                                                                   |
| **Title**                       | Shift Summary counts match underlying Lead/Appointment data                                                                   |
| **Test Type**                   | Functional                                                                                                                    |
| **Source Acceptance Criterion** | AC-61.2-012                                                                                                                   |
| **Source User Story**           | US-61.2-10                                                                                                                    |
| **Source Business Rule(s)**     | BR-61.2-008                                                                                                                   |
| **Source RBAC Permission(s)**   | lead.read — Allow (all active leads), RBAC-MATRIX-V1.1 Section 4. appointment.read — Allow (all), RBAC-MATRIX-V1.1 Section 5. |

Preconditions

- The Assistant is authenticated and viewing the Front Desk Workspace.

- A known number of open leads and a known number of unconfirmed
  appointments exist.

Test Steps

1.  Independently count the actual number of open leads visible in the
    Lead Queue.

2.  Independently count the actual number of unconfirmed appointments
    visible in Today's Schedule.

3.  Observe the counts displayed in the Shift Summary widget.

4.  Compare the Shift Summary counts to the independently counted
    values.

Expected Result

- The open-leads count shown in Shift Summary matches the actual count
  in the Lead Queue at the time of viewing.

- The unconfirmed-appointments count shown in Shift Summary matches the
  actual count in Today's Schedule at the time of viewing.

- Selecting a count navigates to the corresponding full section (Lead
  Queue or Today's Schedule).

TC-61.2-013 — No out-of-scope control is rendered, disabled or
otherwise, for Assistant

|                                 |                                                                                                                                                                                                                                                              |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Test Case ID**                | TC-61.2-013                                                                                                                                                                                                                                                  |
| **Title**                       | No out-of-scope control is rendered, disabled or otherwise, for Assistant                                                                                                                                                                                    |
| **Test Type**                   | Authorization                                                                                                                                                                                                                                                |
| **Source Acceptance Criterion** | AC-61.2-013                                                                                                                                                                                                                                                  |
| **Source User Story**           | US-61.2-11                                                                                                                                                                                                                                                   |
| **Source Business Rule(s)**     | BR-61.2-009                                                                                                                                                                                                                                                  |
| **Source RBAC Permission(s)**   | Cross-cutting — exercises the absence of lead.owner.reassign, lead.delete, appointment.delete, user.deactivate, user.reactivate, and user.create/update/delete for roles other than self, all Administrator-only or universally denied per RBAC-MATRIX-V1.1. |

Preconditions

- The Assistant is authenticated and has access to every dashboard
  section and widget defined in UX-SPEC-61.2-V1.0 Section 6 (Today's
  Schedule, Lead Queue, Quick Actions, Notifications Log, Shift
  Summary).

Test Steps

1.  Systematically inspect every rendered control across the Front Desk
    Workspace landing view.

2.  Systematically inspect every rendered control across Lead Detail.

3.  Systematically inspect every rendered control across Appointment
    Detail.

4.  For each control found, verify it corresponds to a permission marked
    Allow for Assistant in RBAC-MATRIX-V1.1.

5.  Specifically search for, and confirm the absence of, controls for:
    lead.owner.reassign, lead.delete, appointment.delete,
    user.deactivate, user.reactivate, and user.role.assign.

Expected Result

- Every rendered control corresponds to an action authorized for
  Assistant.

- No control for any Administrator-only or universally denied action is
  present in the rendered interface, in any state (visible-enabled,
  visible-disabled, or hidden-but-present in markup) — the control is
  absent entirely, per BR-61.2-009.

TC-61.2-014 — Detail view back navigation returns to originating section

|                                 |                                                                                                                               |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| **Test Case ID**                | TC-61.2-014                                                                                                                   |
| **Title**                       | Detail view back navigation returns to originating section                                                                    |
| **Test Type**                   | Navigation                                                                                                                    |
| **Source Acceptance Criterion** | AC-61.2-014                                                                                                                   |
| **Source User Story**           | US-61.2-12                                                                                                                    |
| **Source Business Rule(s)**     | BR-61.2-010                                                                                                                   |
| **Source RBAC Permission(s)**   | lead.read — Allow (all active leads), RBAC-MATRIX-V1.1 Section 4. appointment.read — Allow (all), RBAC-MATRIX-V1.1 Section 5. |

Preconditions

- The Assistant is authenticated and viewing the Front Desk Workspace.

Test Steps

1.  From the Lead Queue, select a lead to open Lead Detail.

2.  Select the back control on Lead Detail.

3.  Observe the resulting view.

4.  From Today's Schedule, select an appointment to open Appointment
    Detail.

5.  Select the back control on Appointment Detail.

6.  Observe the resulting view.

Expected Result

- Selecting back from Lead Detail returns the Assistant to the Lead
  Queue specifically, not to the Front Desk Workspace root.

- Selecting back from Appointment Detail returns the Assistant to
  Today's Schedule specifically, not to the Front Desk Workspace root.

- In both cases, the section returned to reflects any update made during
  the detail view, per BR-61.2-010.

4\. Coverage Summary

This section confirms that the test case package achieves full traceable
coverage of the source artifacts, with no test case exceeding the scope
of what those artifacts already define.

|                                                                          |                                                                                                                                                                                                                                                                            |                                                                                 |                                       |
| ------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- | ------------------------------------- |
| **Source artifact**                                                      | **Items in source**                                                                                                                                                                                                                                                        | **Items covered by at least one test case**                                     | **Coverage**                          |
| **UX-SPEC-61.2-V1.0 — Acceptance Criteria**                              | 14 (AC-61.2-001–014)                                                                                                                                                                                                                                                       | 14                                                                              | 100%                                  |
| **USER-STORIES-61.2-V1.0 — User Stories**                                | 12 (US-61.2-01–12)                                                                                                                                                                                                                                                         | 12                                                                              | 100%                                  |
| **BUSINESS-RULES-61.2-V1.0 — Business Rules**                            | 12 (BR-61.2-001–012)                                                                                                                                                                                                                                                       | 11 of 12 directly; BR-61.2-001 covered jointly with BR-61.2-009 via TC-61.2-004 | 12 of 12 referenced across test cases |
| **RBAC-MATRIX-V1.1 — Permissions exercised by Assistant-facing actions** | 11 Assistant-relevant permissions (lead.read, lead.status.update, lead.notes.update, appointment.create, appointment.read, appointment.update, appointment.cancel, plus verified-absent: lead.owner.reassign, lead.delete, appointment.delete, user.deactivate/reactivate) | 11                                                                              | 100%                                  |

5\. Open Items Not Tested

Consistent with ARCHITECTURE-REVIEW-SUMMARY-61.2-V1.0 Section 7 (Open
Items Registry), the following are not covered by any test case in this
package, because they are not yet resolved and are not testable until
they are:

- Doctor \<-\> Patient Assignment Model.

- Lead \<-\> Patient Relationship Model.

- Retention / Soft Delete Policy.

- Role Assignment Workflow.

- Real-time update mechanism (polling, websockets, or otherwise) —
  TC-61.2-012 tests that Shift Summary counts match underlying data at
  view time, per BR-61.2-008, but does not test any specific update
  mechanism, since none is defined.

- Global search (explicitly deferred).

_This Test Case Package intentionally does not propose test cases for
the items above. Resolution and subsequent test coverage remain deferred
to Architecture Review and future iterations._

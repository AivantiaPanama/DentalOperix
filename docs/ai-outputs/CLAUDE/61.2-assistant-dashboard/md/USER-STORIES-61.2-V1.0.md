**DentalOperix**

**Formal User Story Package**

Front Desk Workspace (Assistant Dashboard)

Document ID: USER-STORIES-61.2-V1.0

Iteration: 61.2 — Assistant Dashboard

**Status: READY FOR ARCHITECTURE REVIEW**

Author role: Product Analyst / Functional Designer

**Upstream references:**

_RBAC-MATRIX-V1.1 (authorization source)_

_UX-SPEC-61.2-V1.0 (functional/UX source)_

**Permanent constraint honored throughout this document:**

**Leads = Source of Truth**

0\. Scope Statement

This document is the formal User Story Package for Iteration 61.2 —
Front Desk Workspace. It translates the goals, flows, and acceptance
criteria already defined in UX-SPEC-61.2-V1.0 into discrete,
independently reviewable user stories, each fully traceable to:

- A User Goal (G-01 through G-08), as defined in UX-SPEC-61.2-V1.0
  Section 2.

- One or more Acceptance Criteria (AC-61.2-001 through AC-61.2-014), as
  defined in UX-SPEC-61.2-V1.0 Section 8.

- One or more permissions already authorized in RBAC-MATRIX-V1.1.

This document does not include or imply:

- Any new permission, role, or RBAC scope not already present in
  RBAC-MATRIX-V1.1.

- Any change to the certified Leads pipeline (LeadPersistencePort -\>
  LeadPersistenceProvider -\> RelationalLeadPersistenceAdapter -\>
  Supabase PostgreSQL).

- Any architecture, persistence, or Dual Write proposal.

- Resolution of any item listed in UX-SPEC-61.2-V1.0 Section 11 (Open
  Items). Those remain open here as well.

- Any visual UI design — stories describe behavior and outcomes, not
  layout or styling.

_Every story below reuses the exact Goal IDs, AC IDs, and permission
names already defined in RBAC-MATRIX-V1.1 and UX-SPEC-61.2-V1.0. No new
identifiers, permissions, or scope are introduced at this stage._

1\. Traceability Overview

This table is the master index. Every row maps a story to its goal(s),
acceptance criteria, and persona. Full detail for each story follows in
Section 2.

|                |                                                          |                  |                                       |                                        |
| -------------- | -------------------------------------------------------- | ---------------- | ------------------------------------- | -------------------------------------- |
| **Story ID**   | **Title**                                                | **Goal(s)**      | **AC(s)**                             | **Persona**                            |
| **US-61.2-01** | Land on the Front Desk Workspace after login             | G-01             | AC-61.2-001                           | Front Desk Assistant                   |
| **US-61.2-02** | View today's appointment schedule                        | G-01             | AC-61.2-002, AC-61.2-003              | Front Desk Assistant                   |
| **US-61.2-03** | Triage the active Lead Queue                             | G-02             | AC-61.2-004                           | Front Desk Assistant                   |
| **US-61.2-04** | Update a lead's status                                   | G-03             | AC-61.2-005, AC-61.2-006              | Front Desk Assistant                   |
| **US-61.2-05** | Update a lead's notes                                    | G-03             | AC-61.2-005, AC-61.2-006              | Front Desk Assistant                   |
| **US-61.2-06** | Create a new appointment                                 | G-04             | AC-61.2-007                           | Front Desk Assistant                   |
| **US-61.2-07** | Modify an existing appointment                           | G-04             | AC-61.2-007, AC-61.2-008              | Front Desk Assistant                   |
| **US-61.2-08** | Cancel an appointment                                    | G-05             | AC-61.2-008, AC-61.2-009, AC-61.2-010 | Front Desk Assistant                   |
| **US-61.2-09** | Resend a patient notification                            | G-06             | AC-61.2-011                           | Front Desk Assistant                   |
| **US-61.2-10** | View end-of-shift summary counts                         | G-07             | AC-61.2-012                           | Lead Front Desk Assistant (Shift Lead) |
| **US-61.2-11** | Be shielded from actions outside Assistant authorization | G-08             | AC-61.2-004, AC-61.2-008, AC-61.2-013 | Front Desk Assistant                   |
| **US-61.2-12** | Return reliably from a detail view                       | G-01, G-02, G-03 | AC-61.2-014                           | Front Desk Assistant                   |

2\. User Stories — Detail

Each story below follows the required 11-field structure. Story order
follows the Traceability Overview (Section 1).

US-61.2-01 — Land on the Front Desk Workspace after login

1\. Story ID

US-61.2-01

2\. Title

Land on the Front Desk Workspace after login

3\. Persona

Front Desk Assistant (Primary Persona, UX-SPEC-61.2-V1.0 Section 1.1)

4\. As a / I want / So that

|             |                                                                                      |
| ----------- | ------------------------------------------------------------------------------------ |
| **As a**    | Assistant                                                                            |
| **I want**  | to land directly on the Front Desk Workspace immediately after I log in              |
| **So that** | I can start working without navigating away from a generic or incorrect landing page |

5\. Preconditions

- The user has successfully authenticated.

- The authenticated user's role is Assistant, as defined in
  RBAC-MATRIX-V1.1.

6\. Main Flow

1.  Assistant submits valid credentials.

2.  Authentication completes successfully.

3.  System resolves the user's role as Assistant.

4.  System routes the Assistant to the Front Desk Workspace, the
    product-oriented dashboard name defined in RBAC-MATRIX-V1.1 Section 7.

5.  Front Desk Workspace renders with its dashboard sections
    (UX-SPEC-61.2-V1.0 Section 6).

7\. Alternate Flows

- None — routing after successful authentication is deterministic per
  role and has no alternate path within this story's scope.

8\. Error Flows

- If role resolution fails or returns an unrecognized role, the
  Assistant is not routed to the Front Desk Workspace; this failure case
  is an authentication/identity concern and is out of scope for this
  story (see Out of Scope).

9\. Acceptance Criteria References

- AC-61.2-001

10\. RBAC Dependencies

- Dashboard routing definition for Assistant -\> Front Desk Workspace,
  RBAC-MATRIX-V1.1 Section 7.

- This story does not grant or check any individual permission beyond
  role identification; it relies on role resolution happening upstream
  of this dashboard.

11\. Out of Scope

- Authentication mechanism itself (login form, credential validation,
  session management).

- Role resolution failure handling — owned by the identity/auth layer,
  not this dashboard.

- Dashboard routing for any role other than Assistant.

US-61.2-02 — View today's appointment schedule

1\. Story ID

US-61.2-02

2\. Title

View today's appointment schedule

3\. Persona

Front Desk Assistant (Primary Persona)

4\. As a / I want / So that

|             |                                                                                                |
| ----------- | ---------------------------------------------------------------------------------------------- |
| **As a**    | Assistant                                                                                      |
| **I want**  | to see all of today's appointments across providers as soon as I open the Front Desk Workspace |
| **So that** | I can immediately answer questions about today's bookings without searching or switching tools |

5\. Preconditions

- Assistant is on the Front Desk Workspace.

- Assistant is authorized for appointment.read across all appointments,
  per RBAC-MATRIX-V1.1 Section 5.

6\. Main Flow

1.  Assistant opens or is already viewing the Front Desk Workspace.

2.  The Today's Schedule widget (UX-SPEC-61.2-V1.0 Section 7.1) loads
    appointments for the current date.

3.  Appointments are displayed ordered by start time, with patient name,
    time, and provider.

4.  Assistant may open the full Today's Schedule view for the complete
    list.

7\. Alternate Flows

- Assistant navigates to a different date range from the full Today's
  Schedule view; this remains within appointment.read but is not
  detailed further here (see UX-SPEC-61.2-V1.0 Section 4.2 for
  navigation).

8\. Error Flows

- If there are zero appointments for the current date, the widget
  displays an explicit empty state rather than a blank area
  (AC-61.2-003).

- If appointment data fails to load, the widget offers a retry option
  and does not silently display stale data as if it were current.

9\. Acceptance Criteria References

- AC-61.2-002

- AC-61.2-003

10\. RBAC Dependencies

- appointment.read — Allow (all), RBAC-MATRIX-V1.1 Section 5.

11\. Out of Scope

- Creating, modifying, or cancelling an appointment from this view
  (covered by US-61.2-06, US-61.2-07, US-61.2-08).

- Any date range other than the current date in the widget itself
  (full-view navigation is a separate concern).

US-61.2-03 — Triage the active Lead Queue

1\. Story ID

US-61.2-03

2\. Title

Triage the active Lead Queue

3\. Persona

Front Desk Assistant (Primary Persona)

4\. As a / I want / So that

|             |                                                                 |
| ----------- | --------------------------------------------------------------- |
| **As a**    | Assistant                                                       |
| **I want**  | to see all active leads ordered by urgency                      |
| **So that** | I know which leads need a response first and none are forgotten |

5\. Preconditions

- Assistant is on the Front Desk Workspace or has opened the Lead Queue
  full view.

- Assistant is authorized for lead.read on all active leads, per
  RBAC-MATRIX-V1.1 Section 4.

6\. Main Flow

1.  Assistant opens the Lead Queue widget or its full view.

2.  Active leads load, showing status, last updated time, and
    time-unactioned indicator.

3.  Leads are sorted with the most time-sensitive (oldest unactioned)
    surfaced first.

4.  Assistant selects a lead to open Lead Detail (covered by US-61.2-04
    and US-61.2-05).

7\. Alternate Flows

- A lead has already been reassigned by an Administrator; it remains
  visible to the Assistant per lead.read, but exposes no action the
  Assistant is not authorized to perform.

8\. Error Flows

- If there are zero active leads, the widget shows an explicit empty
  state.

- If lead data fails to load, the queue communicates the failure rather
  than appearing empty by default.

9\. Acceptance Criteria References

- AC-61.2-004

10\. RBAC Dependencies

- lead.read — Allow (all active leads), RBAC-MATRIX-V1.1 Section 4.

- This story explicitly excludes lead.create, lead.owner.reassign, and
  lead.delete, none of which are authorized for Assistant.

11\. Out of Scope

- Creating a new lead — remains exclusive to the certified flow
  (BookingDialog -\> processDentalLead -\> /api/leads/create), not part
  of this dashboard.

- Reassigning lead ownership — Administrator-only, not exposed here.

- Deleting a lead — prohibited for all roles (BR-RBAC-006).

US-61.2-04 — Update a lead's status

1\. Story ID

US-61.2-04

2\. Title

Update a lead's status

3\. Persona

Front Desk Assistant (Primary Persona)

4\. As a / I want / So that

|             |                                                                  |
| ----------- | ---------------------------------------------------------------- |
| **As a**    | Assistant                                                        |
| **I want**  | to change the status of a lead I am working                      |
| **So that** | the lead queue reflects accurate, current progress for that lead |

5\. Preconditions

- Assistant has opened Lead Detail for a specific lead from the Lead
  Queue.

- Assistant is authorized for lead.status.update, per RBAC-MATRIX-V1.1
  Section 4.

6\. Main Flow

1.  Assistant selects the status field on Lead Detail.

2.  Assistant chooses a new status value.

3.  Assistant saves the change.

4.  System persists the change and records attribution (updated_by,
    updated_at) per BR-RBAC-005.

5.  System confirms the save.

6.  Assistant is returned to the Lead Queue with the updated state
    reflected.

7\. Alternate Flows

- Assistant changes status and notes together in the same save action
  (see also US-61.2-05); both updates are attributed together.

8\. Error Flows

- If the save fails (e.g., connectivity issue), the Assistant sees an
  explicit error and the prior status is preserved — no partial save
  occurs (AC-61.2-006).

9\. Acceptance Criteria References

- AC-61.2-005

- AC-61.2-006

10\. RBAC Dependencies

- lead.status.update — Allow, RBAC-MATRIX-V1.1 Section 4.

- Attribution requirement per BR-RBAC-005 (updated_by, updated_at using
  existing model metadata; no new store implied).

11\. Out of Scope

- Defining the set of valid status values — owned by existing domain
  rules, not introduced here.

- lead.owner.reassign — Administrator-only, never exposed in this
  story's interface.

- Any lead status change for a lead not visible to the Assistant under
  lead.read.

US-61.2-05 — Update a lead's notes

1\. Story ID

US-61.2-05

2\. Title

Update a lead's notes

3\. Persona

Front Desk Assistant (Primary Persona)

4\. As a / I want / So that

|             |                                                                                                     |
| ----------- | --------------------------------------------------------------------------------------------------- |
| **As a**    | Assistant                                                                                           |
| **I want**  | to add or edit notes on a lead I am working                                                         |
| **So that** | important context (e.g., a callback request, a patient preference) is not lost between interactions |

5\. Preconditions

- Assistant has opened Lead Detail for a specific lead from the Lead
  Queue.

- Assistant is authorized for lead.notes.update, per RBAC-MATRIX-V1.1
  Section 4.

6\. Main Flow

1.  Assistant selects the notes field on Lead Detail.

2.  Assistant adds or edits free-text notes.

3.  Assistant saves the change.

4.  System persists the change and records attribution (updated_by,
    updated_at) per BR-RBAC-005.

5.  System confirms the save.

6.  Assistant is returned to the Lead Queue with the updated state
    reflected.

7\. Alternate Flows

- Notes are used as the end-of-shift handoff mechanism described in
  US-61.2-10; no separate handoff feature is introduced.

8\. Error Flows

- If the save fails, the Assistant sees an explicit error and the prior
  notes content is preserved — no partial save occurs (AC-61.2-006).

9\. Acceptance Criteria References

- AC-61.2-005

- AC-61.2-006

10\. RBAC Dependencies

- lead.notes.update — Allow, RBAC-MATRIX-V1.1 Section 4.

- Attribution requirement per BR-RBAC-005.

11\. Out of Scope

- Structured note categories, tagging, or templated notes — not defined
  in this iteration.

- Notes visibility to roles other than Assistant/Administrator — not
  addressed here; governed by existing lead.read scope per role.

US-61.2-06 — Create a new appointment

1\. Story ID

US-61.2-06

2\. Title

Create a new appointment

3\. Persona

Front Desk Assistant (Primary Persona)

4\. As a / I want / So that

|             |                                                                 |
| ----------- | --------------------------------------------------------------- |
| **As a**    | Assistant                                                       |
| **I want**  | to create a new appointment for a patient                       |
| **So that** | the patient is booked correctly without needing a separate tool |

5\. Preconditions

- Assistant is on Today's Schedule (or a future-date view) and selects
  the option to create a new appointment.

- Assistant is authorized for appointment.create, per RBAC-MATRIX-V1.1
  Section 5.

6\. Main Flow

1.  Assistant initiates appointment creation from Today's Schedule.

2.  Assistant enters appointment details (patient, time, provider).

3.  Assistant saves the appointment.

4.  System validates the requested time against existing bookings.

5.  System confirms the save; the new appointment appears in Today's
    Schedule (or the relevant date).

7\. Alternate Flows

- Assistant creates an appointment for a future date rather than the
  current date; the same flow applies, only the displayed date view
  differs.

8\. Error Flows

- If the requested time conflicts with an existing booking, the system
  blocks the save and explains the conflict; it does not silently
  double-book (AC-61.2-007).

9\. Acceptance Criteria References

- AC-61.2-007

10\. RBAC Dependencies

- appointment.create — Allow (for any patient), RBAC-MATRIX-V1.1 Section 5.

11\. Out of Scope

- Provider availability rules and scheduling constraints beyond conflict
  detection — owned by existing domain logic, not redefined here.

- Patient record creation — out of scope per RBAC-MATRIX-V1.1 Section 8
  (Patient Records, out of scope for 61.1) and not introduced for 61.2.

US-61.2-07 — Modify an existing appointment

1\. Story ID

US-61.2-07

2\. Title

Modify an existing appointment

3\. Persona

Front Desk Assistant (Primary Persona)

4\. As a / I want / So that

|             |                                                              |
| ----------- | ------------------------------------------------------------ |
| **As a**    | Assistant                                                    |
| **I want**  | to reschedule or edit the details of an existing appointment |
| **So that** | the schedule stays accurate when a patient's plans change    |

5\. Preconditions

- Assistant has selected an existing appointment from Today's Schedule
  and opened Appointment Detail.

- Assistant is authorized for appointment.update, per RBAC-MATRIX-V1.1
  Section 5.

6\. Main Flow

1.  Assistant opens Appointment Detail for the appointment to modify.

2.  Assistant edits time, provider, or other editable details.

3.  Assistant saves the change.

4.  System validates the requested time against existing bookings.

5.  System confirms the save; Today's Schedule reflects the updated
    appointment.

7\. Alternate Flows

- None beyond the standard edit-and-save path described in Main Flow.

8\. Error Flows

- If the requested new time conflicts with an existing booking, the
  system blocks the save and explains the conflict (AC-61.2-007).

- Appointment Detail never offers a physical delete option, regardless
  of edit context — only reschedule and cancel are available
  (AC-61.2-008, BR-RBAC-007).

9\. Acceptance Criteria References

- AC-61.2-007

- AC-61.2-008

10\. RBAC Dependencies

- appointment.update — Allow (all), RBAC-MATRIX-V1.1 Section 5.

- Physical deletion is structurally absent per BR-RBAC-007; this story
  never surfaces a delete control.

11\. Out of Scope

- Cancelling an appointment — covered separately by US-61.2-08.

- Bulk modification of multiple appointments at once — not defined in
  this iteration.

US-61.2-08 — Cancel an appointment

1\. Story ID

US-61.2-08

2\. Title

Cancel an appointment

3\. Persona

Front Desk Assistant (Primary Persona)

4\. As a / I want / So that

|             |                                                                                                            |
| ----------- | ---------------------------------------------------------------------------------------------------------- |
| **As a**    | Assistant                                                                                                  |
| **I want**  | to cancel an appointment that is no longer needed                                                          |
| **So that** | the schedule reflects reality and the time slot can be reused, without ever deleting the historical record |

5\. Preconditions

- Assistant has opened Appointment Detail for the appointment to cancel.

- Assistant is authorized for appointment.cancel, per RBAC-MATRIX-V1.1
  Section 5.

6\. Main Flow

1.  Assistant selects "Cancel appointment" from Appointment Detail.

2.  System requires an explicit confirmation step before finalizing,
    since cancellation is terminal (AC-61.2-009).

3.  Assistant confirms.

4.  System changes the appointment's status to cancelled.

5.  The record remains visible in appointment history; it is never
    physically removed (AC-61.2-010, BR-RBAC-007).

7\. Alternate Flows

- Assistant cancels from the Today's Schedule list view by first
  drilling into Appointment Detail; there is no separate inline-cancel
  path per the navigation model in UX-SPEC-61.2-V1.0 Section 4.

8\. Error Flows

- If the Assistant attempts to exit before confirming, the cancellation
  does not proceed and the appointment remains in its prior state.

- There is no "undo" back to confirmed status; reversing a cancellation
  requires creating a new appointment, since cancellation is terminal by
  design.

9\. Acceptance Criteria References

- AC-61.2-008

- AC-61.2-009

- AC-61.2-010

10\. RBAC Dependencies

- appointment.cancel — Allow (all), RBAC-MATRIX-V1.1 Section 5.

- appointment.delete (physical) — Deny for all roles, BR-RBAC-007. This
  story never exposes a delete path.

11\. Out of Scope

- Automated patient notification upon cancellation — if required, this
  is covered separately by the notification flow (US-61.2-09), not
  assumed automatic here.

- Waitlist or rebooking automation triggered by a cancellation — not
  defined in this iteration.

US-61.2-09 — Resend a patient notification

1\. Story ID

US-61.2-09

2\. Title

Resend a patient notification

3\. Persona

Front Desk Assistant (Primary Persona)

4\. As a / I want / So that

|             |                                                                                                        |
| ----------- | ------------------------------------------------------------------------------------------------------ |
| **As a**    | Assistant                                                                                              |
| **I want**  | to resend a confirmation or reminder notification to a patient                                         |
| **So that** | the patient receives communication that may have been missed, without me needing a separate email tool |

5\. Preconditions

- Assistant has opened Appointment Detail or the Notifications Log for a
  given appointment or lead communication.

- Assistant is authorized to send/resend notifications, per the
  notification permission area defined in RBAC-MATRIX-V1.1 (preliminary
  summary, Section 3).

6\. Main Flow

1.  Assistant selects "Resend notification" for a given appointment or
    lead communication.

2.  System sends the notification through the existing certified
    notification channel (email/ICS).

3.  System logs the resend event.

4.  Assistant sees confirmation that the resend was sent.

7\. Alternate Flows

- Assistant initiates the resend from the Notifications Log full view
  rather than from Appointment Detail; the same underlying action
  applies.

8\. Error Flows

- If the underlying contact information is missing or invalid, the
  system blocks the resend and explains why, rather than reporting false
  success (AC-61.2-011).

9\. Acceptance Criteria References

- AC-61.2-011

10\. RBAC Dependencies

- Notification send/resend — Allow, per RBAC-MATRIX-V1.1 preliminary
  RBAC summary (Section 3, Notifications row).

11\. Out of Scope

- Composing a new, non-templated notification — not defined in this
  iteration; this story covers resend of existing notification types
  only.

- Changing the patient's contact information — not part of this story;
  if contact data is invalid, the fix happens outside this flow.

US-61.2-10 — View end-of-shift summary counts

1\. Story ID

US-61.2-10

2\. Title

View end-of-shift summary counts

3\. Persona

Lead Front Desk Assistant (Shift Lead usage pattern, UX-SPEC-61.2-V1.0
Section 1.2)

4\. As a / I want / So that

|             |                                                                                                        |
| ----------- | ------------------------------------------------------------------------------------------------------ |
| **As a**    | Assistant acting in the Shift Lead usage pattern                                                       |
| **I want**  | to see a count-based summary of open leads, unconfirmed appointments, and pending notification resends |
| **So that** | I can hand off my shift confidently, knowing nothing was missed                                        |

5\. Preconditions

- Assistant (Shift Lead usage pattern) is on the Front Desk Workspace
  near the end of a shift.

- Underlying counts are derived from data already readable under
  lead.read and appointment.read; no new permission or data source is
  introduced.

6\. Main Flow

1.  Assistant opens or views the Shift Summary widget on the Front Desk
    Workspace.

2.  Widget displays counts: open leads, unconfirmed appointments,
    pending notification resends.

3.  Assistant selects a count to drill into the corresponding full
    section (Lead Queue, Today's Schedule, or Notifications Log).

4.  Assistant reviews and either actions outstanding items or records
    context via existing lead.notes.update for the next shift.

7\. Alternate Flows

- Any Assistant, not only a designated Shift Lead, may view this widget;
  it is a usage pattern within the single Assistant role, not a distinct
  permission tier (RBAC-MATRIX-V1.1 does not define a separate Shift
  Lead role).

8\. Error Flows

- If underlying lead or appointment data fails to load, the affected
  count is not silently shown as zero; the widget communicates the load
  failure for that count.

9\. Acceptance Criteria References

- AC-61.2-012

10\. RBAC Dependencies

- lead.read — Allow (all active leads), RBAC-MATRIX-V1.1 Section 4.

- appointment.read — Allow (all), RBAC-MATRIX-V1.1 Section 5.

- This story introduces no new permission; counts are derived, not
  separately authorized.

11\. Out of Scope

- Formal shift handoff workflows, sign-off, or audit trail of handoff
  completion — not defined in this iteration.

- Any distinct Shift Lead role or permission tier — explicitly not
  introduced (see UX-SPEC-61.2-V1.0 Section 1.2).

US-61.2-11 — Be shielded from actions outside Assistant authorization

1\. Story ID

US-61.2-11

2\. Title

Be shielded from actions outside Assistant authorization

3\. Persona

Front Desk Assistant (Primary Persona)

4\. As a / I want / So that

|             |                                                                                                              |
| ----------- | ------------------------------------------------------------------------------------------------------------ |
| **As a**    | Assistant                                                                                                    |
| **I want**  | to never see a control for an action I am not authorized to perform                                          |
| **So that** | I cannot accidentally attempt something outside my role, and the interface stays trustworthy and uncluttered |

5\. Preconditions

- Assistant is viewing any dashboard section or widget within the Front
  Desk Workspace.

6\. Main Flow

1.  Assistant navigates to any dashboard section, widget, or detail view
    (Lead Queue, Lead Detail, Today's Schedule, Appointment Detail,
    Notifications Log, Shift Summary).

2.  System renders only controls for actions authorized to the Assistant
    role under RBAC-MATRIX-V1.1.

3.  Controls for actions outside Assistant authorization (e.g.,
    lead.owner.reassign, lead.delete, appointment.delete,
    user.deactivate, user.reactivate) are entirely absent from the
    rendered interface — not merely disabled or hidden behind a state
    change.

7\. Alternate Flows

- None — this story describes a structural guarantee that applies
  uniformly across every view, not a path the Assistant actively
  chooses.

8\. Error Flows

- Not applicable — there is no user-facing error state for this story;
  the absence of unauthorized controls is enforced at render time,
  before any action could be attempted.

9\. Acceptance Criteria References

- AC-61.2-004

- AC-61.2-008

- AC-61.2-013

10\. RBAC Dependencies

- This story is a cross-cutting guarantee over every permission boundary
  already defined in RBAC-MATRIX-V1.1, including lead.owner.reassign,
  lead.delete, appointment.delete, user.delete, user.deactivate, and
  user.reactivate, all of which are Administrator-only or universally
  prohibited.

- This story introduces no new permission; it constrains rendering
  behavior only.

11\. Out of Scope

- Server-side enforcement mechanisms for these same boundaries — assumed
  to exist already as part of the certified authorization layer; this
  story addresses dashboard rendering, not backend enforcement.

- Any role other than Assistant.

US-61.2-12 — Return reliably from a detail view

1\. Story ID

US-61.2-12

2\. Title

Return reliably from a detail view

3\. Persona

Front Desk Assistant (Primary Persona)

4\. As a / I want / So that

|             |                                                                                                                  |
| ----------- | ---------------------------------------------------------------------------------------------------------------- |
| **As a**    | Assistant                                                                                                        |
| **I want**  | to always have a single, clear way back to the section I came from after viewing a Lead or Appointment in detail |
| **So that** | I never lose my place or have to re-find where I was working                                                     |

5\. Preconditions

- Assistant has navigated into Lead Detail or Appointment Detail from
  its respective section (Lead Queue or Today's Schedule).

6\. Main Flow

1.  Assistant is on Lead Detail or Appointment Detail.

2.  Assistant selects the back control.

3.  System returns the Assistant to the specific section they came from
    (Lead Queue or Today's Schedule), not merely to the Front Desk
    Workspace root.

7\. Alternate Flows

- Assistant completes a save action (status/notes update, or appointment
  update/cancel) and is returned automatically to the originating
  section, satisfying the same back-path guarantee without a separate
  manual back action.

8\. Error Flows

- Not applicable — returning to the prior section is a navigation
  guarantee, not an operation that can fail in the same sense as a save.

9\. Acceptance Criteria References

- AC-61.2-014

10\. RBAC Dependencies

- This story does not depend on any specific permission beyond the read
  access already required to enter the detail view (lead.read or
  appointment.read, RBAC-MATRIX-V1.1 Sections 4 and 5).

11\. Out of Scope

- Browser-level back button behavior — addressed only to the extent the
  in-app back control must exist; broader browser-history behavior is
  outside this story's scope.

- Deep-linking directly to a detail view from outside the dashboard —
  not defined in this iteration.

3\. Document-Wide Open Items

Consistent with UX-SPEC-61.2-V1.0 Section 11 and RBAC-MATRIX-V1.1
Section 10, the following remain unresolved by this document and are not
narrowed, implied, or answered by any story above:

- Doctor \<-\> Patient Assignment Model.

- Lead \<-\> Patient Relationship Model.

- Retention / Soft Delete Policy.

- Role Assignment Workflow.

- Real-time update mechanism (polling, websockets, or otherwise)
  underlying near-real-time widgets.

- Global search (explicitly deferred).

_This User Story Package intentionally does not propose answers to the
items above. Resolution remains deferred to Architecture Review._

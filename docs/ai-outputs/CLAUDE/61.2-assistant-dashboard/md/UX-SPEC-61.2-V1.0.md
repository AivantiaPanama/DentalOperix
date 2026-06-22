**DentalOperix**

**UX Specification Pack**

Front Desk Workspace (Assistant Dashboard)

Document ID: UX-SPEC-61.2-V1.0

Iteration: 61.2 — Assistant Dashboard

**Status: DRAFT — READY FOR ARCHITECTURE REVIEW**

Author role: Product Analyst / Functional Designer

*Governing authorization reference: RBAC-MATRIX-V1.1*

**Permanent constraint honored throughout this document:**

**Leads = Source of Truth**

0\. Scope Statement

This document is a functional UX specification. It defines information
structure, navigation, flows, content, and behavior for the Front Desk
Workspace (the product-facing name for the role previously referred to
internally as "Assistant Dashboard", per RBAC-MATRIX-V1.1 Section 7).

This document does not include:

- Visual UI design (layout mockups, color systems, component styling,
  pixel specifications).

- Architecture changes of any kind.

- Persistence design, schema changes, or data modeling.

- Any modification to the certified Leads pipeline (LeadPersistencePort
  -\> LeadPersistenceProvider -\> RelationalLeadPersistenceAdapter -\>
  Supabase PostgreSQL).

- Any proposal of Dual Write or alternate Source of Truth.

*Every permission, action, and data-visibility rule referenced in this
document is constrained by RBAC-MATRIX-V1.1. Where this document
specifies an action for the Assistant role, that action exists in
RBAC-MATRIX-V1.1; this document does not introduce new permissions — it
only describes how existing authorized permissions surface in the
dashboard experience.*

1\. User Personas

Iteration 61.2 serves a single RBAC role (Assistant). Two usage patterns
are described within that single role to ensure the dashboard serves
both moment-to-moment work and shift-level oversight, without
introducing a sub-role.

1.1 Primary Persona — Front Desk Assistant

|                                      |                                                                                                                                                                            |
|--------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Attribute**                        | **Primary Persona — Front Desk Assistant**                                                                                                                                 |
| **Role (RBAC)**                      | Assistant                                                                                                                                                                  |
| **Context of use**                   | Works at the clinic front desk or remotely via phone/tablet during patient-facing hours. Frequently interrupted by phone calls, walk-ins, and in-person patient questions. |
| **Primary responsibility**           | Keep the day's schedule accurate, keep Lead status current, and make sure no patient communication falls through.                                                          |
| **Technical comfort**                | Comfortable with everyday software (calendar apps, messaging, basic CRM-style tools). Not a power user — needs clarity over configurability.                               |
| **Time pressure**                    | High. Most actions must be completable in a few seconds between other tasks.                                                                                               |
| **Primary device**                   | Desktop at the front desk; tablet or phone when away from the desk (e.g., during a clinic walkthrough).                                                                    |
| **Frustration with current process** | Switching between multiple tools (calendar, phone notes, spreadsheet) to track who called, who is booked, and who still needs a callback.                                  |
| **Success looks like**               | Opening one workspace and immediately knowing: who is coming in today, which leads need a response, and which actions are theirs to take.                                  |

1.2 Secondary Persona — Lead Front Desk Assistant (Shift Lead)

|                            |                                                                                                                                                                                                                     |
|----------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Attribute**              | **Secondary Persona — Lead Front Desk Assistant (Shift Lead)**                                                                                                                                                      |
| **Role (RBAC)**            | Assistant (same permission set — no distinct RBAC role; described separately because behavior differs)                                                                                                              |
| **Context of use**         | Same environment as the Primary Persona, but also responsible for end-of-day handoff and ensuring no lead or appointment was missed during the shift.                                                               |
| **Primary responsibility** | Same individual tasks as Primary Persona, plus a shift-level overview: how many leads are open, how many appointments are unconfirmed.                                                                              |
| **Distinct need**          | Needs an at-a-glance summary view rather than working item by item.                                                                                                                                                 |
| **Note**                   | This persona does not require a different RBAC role. It is a usage pattern within the Assistant role, included here to justify the existence of summary widgets (Section 7) without implying a new permission tier. |

*Both personas map to the single Assistant role defined in
RBAC-MATRIX-V1.1. No new role, permission, or sub-tier is introduced by
this document.*

2\. User Goals

Each goal below is traceable to a permission already authorized in
RBAC-MATRIX-V1.1. No goal implies a new permission.

|             |                                                                     |                                                                                                                                                                                |
|-------------|---------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Goal ID** | **Goal**                                                            | **Why it matters**                                                                                                                                                             |
| **G-01**    | See today's appointments at a glance                                | Prevents double-booking confusion and lets the Assistant answer "are we fully booked today" instantly.                                                                         |
| **G-02**    | Identify which leads need action                                    | Leads that sit untouched are lost revenue opportunities; the Assistant's core job is to prevent that.                                                                          |
| **G-03**    | Update a lead's status or notes quickly                             | Reflects authorized permissions lead.status.update and lead.notes.update (RBAC-MATRIX-V1.1 Section 4) without leaving the workspace.                                           |
| **G-04**    | Create or modify an appointment for a patient                       | Reflects authorized permission appointment.create / appointment.update (RBAC-MATRIX-V1.1 Section 5).                                                                           |
| **G-05**    | Cancel an appointment correctly                                     | Reflects appointment.cancel; physical deletion is prohibited (BR-RBAC-007), so the Assistant must be guided toward cancellation as the only terminal action.                   |
| **G-06**    | Resend a patient notification (confirmation/reminder)               | Reflects the notification.send / notification.resend permission area described in the preliminary RBAC matrix.                                                                 |
| **G-07**    | Hand off a shift cleanly                                            | The Shift Lead usage pattern needs a summary of open items so nothing is dropped between shifts.                                                                               |
| **G-08**    | Avoid accidentally performing an action outside their authorization | The dashboard must never present an action the Assistant role cannot perform (e.g., lead.owner.reassign, user.deactivate) — those are Administrator-only per RBAC-MATRIX-V1.1. |

3\. Information Architecture

The Front Desk Workspace is organized as a single-level dashboard with
drill-in detail views. There is no multi-level menu tree — this keeps
the structure appropriate for a high-interruption, time-pressured role
(see Persona Section 1).

3.1 Top-Level Structure

- **Front Desk Workspace (landing view)**

  - Today's Schedule (drill-in from dashboard widget)

  - Lead Queue (drill-in from dashboard widget)

  - Lead Detail (drill-in from Lead Queue row)

  - Appointment Detail (drill-in from Today's Schedule row)

  - Notifications Log (drill-in from dashboard widget)

3.2 Content Ownership Map

This table states which underlying data domain feeds each IA node. It
does not define persistence — it states which already-existing domain
(per certified architecture) supplies the data.

|                        |                            |                                                           |
|------------------------|----------------------------|-----------------------------------------------------------|
| **IA Node**            | **Data Domain (existing)** | **Authorization boundary (per RBAC-MATRIX-V1.1)**         |
| **Today's Schedule**   | Appointments               | appointment.read — Allow (all), Section 5                 |
| **Lead Queue**         | Leads (application layer)  | lead.read — Allow (all active leads), Section 4           |
| **Lead Detail**        | Leads (application layer)  | lead.status.update, lead.notes.update — Allow, Section 4  |
| **Appointment Detail** | Appointments               | appointment.update, appointment.cancel — Allow, Section 5 |
| **Notifications Log**  | Notifications (Email/ICS)  | Send / Resend — Allow, per preliminary RBAC summary       |

*Lead Detail never exposes lead.owner.reassign or lead.delete controls.
Those remain Administrator-only per RBAC-MATRIX-V1.1 Section 4 and
BR-RBAC-006.*

4\. Navigation Model

Navigation is flat and dashboard-centric: every destination is reachable
in at most two steps from the landing view (dashboard -\> section, or
dashboard -\> section -\> detail).

4.1 Navigation Rules

1.  The Front Desk Workspace is the default landing view immediately
    after Assistant login (per dashboard routing defined in
    RBAC-MATRIX-V1.1 Section 7).

2.  Every dashboard widget (Section 7) is independently navigable —
    clicking/tapping a widget's header opens its full section view.

3.  Detail views (Lead Detail, Appointment Detail) always provide a
    single, unambiguous way back to the section they were opened from
    (not just to the dashboard).

4.  There is no global search defined in this iteration; search may be
    considered in a future iteration but is explicitly out of scope
    here.

5.  No navigation path in this dashboard may lead to an action outside
    the Assistant permission set in RBAC-MATRIX-V1.1. If a future
    role-shared view is considered, the navigation model must hide (not
    merely disable) controls outside the current role's authorization.

4.2 Navigation Map

*Described structurally; no visual layout, iconography, or component
styling is specified here (see Scope Statement, Section 0).*

|                          |                              |                                                |
|--------------------------|------------------------------|------------------------------------------------|
| **From**                 | **Action**                   | **To**                                         |
| **Front Desk Workspace** | Open Today's Schedule widget | Today's Schedule (full view)                   |
| **Front Desk Workspace** | Open Lead Queue widget       | Lead Queue (full view)                         |
| **Front Desk Workspace** | Open Notifications widget    | Notifications Log (full view)                  |
| **Today's Schedule**     | Select an appointment row    | Appointment Detail                             |
| **Lead Queue**           | Select a lead row            | Lead Detail                                    |
| **Appointment Detail**   | Confirm cancel               | Returns to Today's Schedule with updated state |
| **Lead Detail**          | Save status/notes change     | Returns to Lead Queue with updated state       |
| **Any section view**     | Back control                 | Front Desk Workspace                           |

5\. User Flows

Flows describe behavior, not visual interaction details. Each flow
references the goal it satisfies (Section 2) and the permission it
relies on (RBAC-MATRIX-V1.1).

5.1 Flow — Review Today's Schedule

*Goal reference: G-01*

1.  Assistant lands on Front Desk Workspace after login.

2.  Today's Schedule widget displays appointments for the current date,
    ordered by start time.

3.  Assistant opens the full Today's Schedule view to see the complete
    list, if more appointments exist than the widget displays.

4.  Assistant selects an appointment row to view Appointment Detail.

**Exceptions / alternate paths:**

- If there are zero appointments for the day, the widget shows an
  explicit empty state, not a blank area.

- If appointment data fails to load, the widget shows a retry option; it
  never silently shows stale or cached data as if current.

5.2 Flow — Triage the Lead Queue

*Goal reference: G-02*

1.  Assistant opens the Lead Queue widget or its full view.

2.  Leads are visible per lead.read (Allow — all active leads,
    RBAC-MATRIX-V1.1 Section 4).

3.  Leads are sorted with the most time-sensitive (e.g., oldest
    unactioned) surfaced first.

4.  Assistant selects a lead to open Lead Detail.

**Exceptions / alternate paths:**

- Leads with no further authorized action available to Assistant (e.g.,
  already reassigned by an Administrator) are still visible per
  lead.read, but do not expose action controls the Assistant cannot
  perform.

5.3 Flow — Update Lead Status or Notes

*Goal reference: G-03*

1.  From Lead Detail, Assistant selects the status field and chooses a
    new status value.

2.  Assistant may add or edit notes in the notes field.

3.  Assistant saves the change.

4.  System confirms the save and records attribution (updated_by,
    updated_at) per BR-RBAC-005.

5.  Assistant is returned to the Lead Queue with the updated state
    reflected.

**Exceptions / alternate paths:**

- If the save fails (e.g., connectivity issue), the Assistant sees an
  explicit error and the prior state is preserved — no silent partial
  save.

- Lead Detail never shows an owner-reassignment control to the
  Assistant; reassignment is Administrator-only (RBAC-MATRIX-V1.1
  Section 4).

5.4 Flow — Create or Modify an Appointment

*Goal reference: G-04*

1.  From Today's Schedule (or a future date view), Assistant selects
    "new appointment" or selects an existing appointment to modify.

2.  Assistant enters or edits appointment details (patient, time,
    provider).

3.  Assistant saves the appointment.

4.  System confirms the save and the appointment appears in Today's
    Schedule (or the relevant date).

**Exceptions / alternate paths:**

- If the requested time conflicts with an existing booking, the system
  blocks the save and explains the conflict; it does not silently
  double-book.

- Modifying an appointment never offers a physical delete option — only
  reschedule or cancel, per BR-RBAC-007.

5.5 Flow — Cancel an Appointment

*Goal reference: G-05*

1.  From Appointment Detail, Assistant selects "Cancel appointment."

2.  System asks for confirmation before finalizing, since cancellation
    is a terminal, non-reversible-by-Assistant action.

3.  Assistant confirms.

4.  Appointment status changes to cancelled; the record remains visible
    in history, never physically removed (per BR-RBAC-007).

**Exceptions / alternate paths:**

- Assistant may not "undo" a cancellation back to a confirmed state
  directly — that requires creating a new appointment, since
  cancellation is terminal by design.

5.6 Flow — Resend a Patient Notification

*Goal reference: G-06*

1.  From Appointment Detail or Notifications Log, Assistant selects
    "Resend notification" for a given appointment or lead communication.

2.  System sends the notification through the existing certified
    notification channel (email/ICS) and logs the resend event.

3.  Assistant sees confirmation that the resend was sent.

**Exceptions / alternate paths:**

- If the underlying contact information is missing or invalid, the
  system blocks the resend and tells the Assistant why, rather than
  failing silently.

5.7 Flow — End-of-Shift Handoff (Shift Lead usage pattern)

*Goal reference: G-07*

1.  Shift Lead opens the Front Desk Workspace near the end of their
    shift.

2.  Summary widgets (Section 7) show count of open leads, unconfirmed
    appointments, and pending notifications.

3.  Shift Lead reviews any item flagged as outstanding and either
    actions it or notes it for the next shift (note-taking mechanism is
    part of existing lead.notes.update, not a new feature).

**Exceptions / alternate paths:**

- This flow uses no permission beyond what is already defined for
  Assistant; it is a usage pattern, not a new capability.

6\. Dashboard Sections

The Front Desk Workspace landing view is composed of the sections below.
Each section corresponds to one or more widgets defined in Section 7.

|                       |                                                                                                      |                             |                                              |
|-----------------------|------------------------------------------------------------------------------------------------------|-----------------------------|----------------------------------------------|
| **Section**           | **Purpose**                                                                                          | **Primary data source**     | **Key permission(s) used**                   |
| **Today's Schedule**  | Show the Assistant what is happening today across all providers.                                     | Appointments                | appointment.read (all)                       |
| **Lead Queue**        | Surface active leads that may require action, ordered by urgency.                                    | Leads (application layer)   | lead.read (all active leads)                 |
| **Quick Actions**     | Provide one-step access to the most frequent Assistant tasks (new appointment, resend notification). | Appointments, Notifications | appointment.create, notification.resend      |
| **Notifications Log** | Show recent outbound communications and their delivery state.                                        | Notifications (Email/ICS)   | notification.read (all), notification.resend |
| **Shift Summary**     | Give the Shift Lead usage pattern a count-based overview (open leads, unconfirmed appointments).     | Leads, Appointments         | lead.read, appointment.read                  |

7\. Widget Definitions

Widgets are defined functionally: what they show, what data feeds them,
what actions they expose, and what they must never expose. No visual
layout, sizing, or styling is specified (see Scope Statement).

7.1 Widget — Today's Schedule

|                       |                                                                                                                               |
|-----------------------|-------------------------------------------------------------------------------------------------------------------------------|
| **Attribute**         | **Definition**                                                                                                                |
| **Displays**          | List of appointments for the current date, ordered by start time, with patient name, time, and provider.                      |
| **Data source**       | Appointments domain, read via appointment.read.                                                                               |
| **Available actions** | Open Appointment Detail (drill-in). No inline cancel/delete from the widget itself — those occur in Appointment Detail.       |
| **Empty state**       | Explicit message indicating no appointments are scheduled for today.                                                          |
| **Refresh behavior**  | Reflects near-real-time state; does not require a full page reload to show newly created or cancelled appointments.           |
| **Never exposes**     | Appointments belonging to a date range the Assistant has not navigated to; physical delete control (prohibited, BR-RBAC-007). |

7.2 Widget — Lead Queue

|                       |                                                                                                                                                                                                                                     |
|-----------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Attribute**         | **Definition**                                                                                                                                                                                                                      |
| **Displays**          | List of active leads with status, last updated time, and an indicator of how long the lead has been unactioned.                                                                                                                     |
| **Data source**       | Leads, application layer, read via lead.read (Allow — all active leads).                                                                                                                                                            |
| **Available actions** | Open Lead Detail (drill-in). No inline owner-reassignment control (Administrator-only, RBAC-MATRIX-V1.1 Section 4).                                                                                                                 |
| **Empty state**       | Explicit message indicating no active leads require attention.                                                                                                                                                                      |
| **Sort order**        | Most time-sensitive (oldest unactioned) first; exact sort algorithm is a design decision for visual/interaction design, not specified here.                                                                                         |
| **Never exposes**     | lead.create control (creation remains exclusive to the certified flow: BookingDialog -\> processDentalLead -\> /api/leads/create); lead.delete control (prohibited, BR-RBAC-006); lead.owner.reassign control (Administrator-only). |

7.3 Widget — Quick Actions

|                       |                                                                                               |
|-----------------------|-----------------------------------------------------------------------------------------------|
| **Attribute**         | **Definition**                                                                                |
| **Displays**          | A short set of one-step entry points for the most frequent Assistant tasks.                   |
| **Data source**       | None directly — this widget is a set of navigation shortcuts into existing flows (Section 5). |
| **Available actions** | Create new appointment (G-04); resend most recent notification (G-06).                        |
| **Never exposes**     | Any action outside the Assistant permission set (e.g., user management, role assignment).     |

7.4 Widget — Notifications Log

|                       |                                                                                                                                                                                                                       |
|-----------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Attribute**         | **Definition**                                                                                                                                                                                                        |
| **Displays**          | Recent outbound notifications (confirmations, reminders) with recipient, channel, timestamp, and delivery status.                                                                                                     |
| **Data source**       | Notifications domain (Email/ICS).                                                                                                                                                                                     |
| **Available actions** | Resend a notification (G-06).                                                                                                                                                                                         |
| **Empty state**       | Explicit message indicating no recent notifications.                                                                                                                                                                  |
| **Never exposes**     | Notification content belonging to a patient/lead the Assistant has no read access to (none currently restricted, since Assistant has lead.read on all active leads — flagged here for completeness if scope changes). |

7.5 Widget — Shift Summary

|                       |                                                                                                                                    |
|-----------------------|------------------------------------------------------------------------------------------------------------------------------------|
| **Attribute**         | **Definition**                                                                                                                     |
| **Displays**          | Count-based overview: number of open leads, number of unconfirmed appointments, number of pending notification resends.            |
| **Data source**       | Aggregated counts from Leads and Appointments domains; no new data store implied — counts are derived from existing readable data. |
| **Available actions** | None directly actionable; each count links to the corresponding full section (Lead Queue, Today's Schedule, Notifications Log).    |
| **Primary persona**   | Shift Lead usage pattern (Section 1.2), though visible to any Assistant.                                                           |

8\. Acceptance Criteria

Acceptance criteria use Given/When/Then format and are traceable to the
goals in Section 2 and the permissions in RBAC-MATRIX-V1.1.

<table>
<colgroup>
<col style="width: 16%" />
<col style="width: 83%" />
</colgroup>
<tbody>
<tr class="odd">
<td><strong>AC ID</strong></td>
<td><strong>Criterion (Given / When / Then)</strong></td>
</tr>
<tr class="even">
<td><strong>AC-61.2-001</strong></td>
<td><p>Given an Assistant logs in successfully</p>
<p>When the login completes</p>
<p>Then the Assistant lands on the Front Desk Workspace, not on any
other role's dashboard.</p></td>
</tr>
<tr class="odd">
<td><strong>AC-61.2-002</strong></td>
<td><p>Given the Assistant is viewing the Front Desk Workspace</p>
<p>When there are appointments scheduled for the current date</p>
<p>Then the Today's Schedule widget lists them ordered by start
time.</p></td>
</tr>
<tr class="even">
<td><strong>AC-61.2-003</strong></td>
<td><p>Given the Assistant is viewing the Front Desk Workspace</p>
<p>When there are zero appointments scheduled for the current date</p>
<p>Then the Today's Schedule widget shows an explicit empty state, not a
blank or misleading area.</p></td>
</tr>
<tr class="odd">
<td><strong>AC-61.2-004</strong></td>
<td><p>Given the Assistant opens the Lead Queue</p>
<p>When active leads exist</p>
<p>Then leads are visible per lead.read, and no lead.owner.reassign or
lead.delete control is rendered anywhere in the queue or in Lead
Detail.</p></td>
</tr>
<tr class="even">
<td><strong>AC-61.2-005</strong></td>
<td><p>Given the Assistant is on Lead Detail for a given lead</p>
<p>When the Assistant changes the status and/or notes and saves</p>
<p>Then the change persists, is attributed (updated_by/updated_at per
BR-RBAC-005), and the Assistant is returned to an updated Lead
Queue.</p></td>
</tr>
<tr class="odd">
<td><strong>AC-61.2-006</strong></td>
<td><p>Given the Assistant attempts to save a lead status/notes
change</p>
<p>When the save operation fails (e.g., network error)</p>
<p>Then the Assistant sees an explicit error message and the prior lead
state remains unchanged — no partial save occurs.</p></td>
</tr>
<tr class="even">
<td><strong>AC-61.2-007</strong></td>
<td><p>Given the Assistant is creating or modifying an appointment</p>
<p>When the requested time conflicts with an existing booking</p>
<p>Then the system blocks the save and explains the conflict instead of
allowing a double-booking.</p></td>
</tr>
<tr class="odd">
<td><strong>AC-61.2-008</strong></td>
<td><p>Given the Assistant opens Appointment Detail for any
appointment</p>
<p>When the Assistant looks for a delete option</p>
<p>Then no physical delete control exists anywhere in the interface;
only reschedule and cancel are available, per BR-RBAC-007.</p></td>
</tr>
<tr class="even">
<td><strong>AC-61.2-009</strong></td>
<td><p>Given the Assistant selects Cancel on an appointment</p>
<p>When the Assistant has not yet confirmed</p>
<p>Then the system requires an explicit confirmation step before the
cancellation is finalized.</p></td>
</tr>
<tr class="odd">
<td><strong>AC-61.2-010</strong></td>
<td><p>Given an appointment has been cancelled</p>
<p>When the Assistant or anyone else views appointment history</p>
<p>Then the cancelled appointment remains visible with a cancelled
status; it is never physically removed from the record.</p></td>
</tr>
<tr class="even">
<td><strong>AC-61.2-011</strong></td>
<td><p>Given the Assistant selects Resend on a notification</p>
<p>When the underlying contact information is missing or invalid</p>
<p>Then the system blocks the resend and explains why, rather than
reporting false success.</p></td>
</tr>
<tr class="odd">
<td><strong>AC-61.2-012</strong></td>
<td><p>Given the Assistant views the Shift Summary widget</p>
<p>When open leads or unconfirmed appointments exist</p>
<p>Then the displayed counts match the actual underlying data in Lead
Queue and Today's Schedule at the time of viewing.</p></td>
</tr>
<tr class="even">
<td><strong>AC-61.2-013</strong></td>
<td><p>Given any dashboard section or widget is rendered for the
Assistant role</p>
<p>When the rendering completes</p>
<p>Then no control for an action outside the Assistant permission set in
RBAC-MATRIX-V1.1 (e.g., user.deactivate, lead.owner.reassign) is
present, visible, or merely disabled — it must be absent
entirely.</p></td>
</tr>
<tr class="odd">
<td><strong>AC-61.2-014</strong></td>
<td><p>Given the Assistant navigates into any detail view (Lead Detail,
Appointment Detail)</p>
<p>When the Assistant wants to return</p>
<p>Then a single, unambiguous back path returns them to the section they
came from, not just to the dashboard root.</p></td>
</tr>
</tbody>
</table>

9\. Responsive Behavior

This section defines functional requirements across device contexts. It
intentionally does not specify breakpoints in pixels, grid systems, or
component resizing — those are visual/interaction design decisions
outside this document's scope.

|                                                                    |                                                                                                                                                                                                                                                                                                                                                            |
|--------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Breakpoint context**                                             | **Required behavior (functional, not visual)**                                                                                                                                                                                                                                                                                                             |
| **Desktop (primary front-desk use)**                               | All five dashboard sections (Section 6) are reachable without horizontal scrolling. Today's Schedule and Lead Queue are the two highest-priority sections and must be the first content the Assistant sees without scrolling past lower-priority widgets.                                                                                                  |
| **Tablet (mobile front-desk use, e.g., walking the clinic floor)** | All functional flows (Section 5) remain fully completable — no flow may be desktop-only. Widgets may stack vertically; the priority order (Today's Schedule, Lead Queue, then the rest) must be preserved in the stacking order.                                                                                                                           |
| **Phone (on-call or remote check from Assistant)**                 | Core flows (G-01 review schedule, G-02 triage leads, G-03 update lead, G-05 cancel appointment) must remain completable. Quick Actions (Section 7.3) must remain a single tap/step away from the landing view. Shift Summary may be deprioritized (e.g., collapsed by default) on phone, since the Shift Lead handoff is more commonly a desktop activity. |
| **Any breakpoint**                                                 | Confirmation steps (e.g., cancellation confirmation, AC-61.2-009) must never be skippable due to layout constraints — the confirmation step is a functional requirement independent of screen size.                                                                                                                                                        |

10\. Accessibility Requirements

Accessibility requirements are stated functionally, aligned to WCAG 2.1
AA intent, without prescribing specific visual implementation.

|                                                    |                                                                                                                                                                                                                                                                                                |
|----------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Requirement area**                               | **Functional requirement**                                                                                                                                                                                                                                                                     |
| **Keyboard operability**                           | Every action defined in Sections 5 and 7 (open detail, change status, save, cancel, resend, confirm) must be completable using keyboard alone, with no action reachable only by pointer/touch.                                                                                                 |
| **Screen reader support**                          | Every widget (Section 7) must expose its purpose and current state (e.g., "Today's Schedule, 6 appointments") in a way a screen reader can announce, including empty states (Section 7.1, 7.2, 7.4).                                                                                           |
| **Status and error communication**                 | Save confirmations, save failures (AC-61.2-006), and blocked actions (AC-61.2-007, AC-61.2-011) must be communicated in a way that does not rely on color alone (e.g., icon/text plus color, not color only).                                                                                  |
| **Focus management**                               | After completing an action that returns the Assistant to a prior view (e.g., AC-61.2-005, AC-61.2-014), keyboard focus must move to a sensible, predictable location in that view — not reset to the top of the page silently.                                                                 |
| **Time-sensitive content**                         | Counts and lists that update in near-real-time (Today's Schedule, Lead Queue, Shift Summary) must not visually or programmatically update in a way that disorients assistive technology users mid-interaction (e.g., a list reordering itself while the user is mid-selection).                |
| **Confirmation dialogs**                           | The cancellation confirmation step (AC-61.2-009) must be implemented as an accessible dialog pattern: focus trapped within it while open, and a clear accessible name/description for both the action and its consequence (e.g., "this cannot be undone — the appointment will be cancelled"). |
| **Color independence for role-restricted absence** | Because restricted actions (e.g., lead.owner.reassign) must be entirely absent rather than disabled (AC-61.2-013), there is no accessibility requirement to announce "disabled" states for those — they simply do not exist in the DOM/markup for the Assistant role.                          |

11\. Open Items Not Resolved by This Document

Consistent with prior governance (RBAC-MATRIX-V1.1, Section 10), the
following items are explicitly not resolved here and remain the
responsibility of Architecture Review or future iterations:

- Doctor \<-\> Patient Assignment Model — not relevant to Assistant
  scope directly, but referenced here for consistency since it affects
  any future shared-view work.

- Lead \<-\> Patient Relationship Model — unresolved; this dashboard
  treats Leads strictly as Leads, per Source of Truth.

- Retention / Soft Delete Policy — this document assumes
  cancellation/status-change semantics (BR-RBAC-006, BR-RBAC-007) but
  does not define retention windows or archival behavior.

- Real-time update mechanism — Section 7 and Section 9 require
  near-real-time reflection of state changes; the technical mechanism
  (polling, websockets, etc.) is an architecture decision outside this
  document's authority.

- Global search — explicitly deferred (Section 4.1).

*This functional/UX specification intentionally does not propose answers
to the items above. Resolution is deferred to Architecture Review.*

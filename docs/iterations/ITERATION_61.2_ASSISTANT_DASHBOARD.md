# Iteration 61.2 - Assistant Operations Dashboard

Status: READY_FOR_DESIGN
Priority: P0
Owner: Product / UX Governance
Last updated: 2026-06-20

## Objective

Design and implement the daily operational dashboard for clinic assistants.

## Business Reason

The assistant dashboard is the fastest path to a sellable Starter product because it helps the clinic operate today's appointments and follow-up work.

## Scope

Dashboard should show:

- Today's appointments.
- Pending confirmations.
- New leads.
- Reschedules.
- No-shows.
- Patients needing contact.
- Quick actions.

## AI Assignments

| Work | AI |
|---|---|
| UI mockup | v0 |
| Data contract | ChatGPT |
| User stories | Claude |
| Integration candidate | Cursor after approval |

## Design Rule

Do not start with large tables. Start with action-oriented cards:

```text
What is happening?
What needs attention?
What should the assistant do now?
```

## Acceptance Criteria

- Dashboard is role-specific for Assistant.
- No hidden fallback data.
- Empty states appear only after real load/reconciliation.
- Uses read-only data unless explicit operational action is approved.
- Mobile responsive.

## Required Documentation Updates

- `ASSISTANT_DASHBOARD_SPEC.md`
- `61.0_PRODUCT_GOVERNANCE_DASHBOARD.md`
- `PROJECT_SCOPE_AND_EXPECTED_BEHAVIOR.md`

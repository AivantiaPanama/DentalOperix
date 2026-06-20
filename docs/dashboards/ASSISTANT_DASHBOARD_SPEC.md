# Assistant Dashboard Specification

Status: DRAFT
Owner: Product / UX Governance
Last updated: 2026-06-20

## Goal

Help the assistant operate the clinic today.

## Primary Questions

- Which patients are coming today?
- Which appointments still need confirmation?
- Who needs follow-up?
- Which leads are new?
- Which appointments were no-shows or rescheduled?

## Core Components

1. Today Summary Card
2. Appointment Timeline
3. Pending Confirmations Queue
4. New Leads Queue
5. No-show / Reschedule Alerts
6. Quick Actions

## Data Rules

- Do not show demo/fallback data when real data exists.
- Do not show empty states until first-load reconciliation is complete.
- Assistant actions must respect RBAC.

## v0 Design Prompt Reference

Use `docs/ai-prompts/V0_DASHBOARD_PROMPT.md` with this spec.

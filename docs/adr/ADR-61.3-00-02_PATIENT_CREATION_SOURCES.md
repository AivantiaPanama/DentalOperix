# ADR-61.3-00-02 — Patient Creation Sources

**Status:** ACCEPTED  
**Date:** 2026-06-23

## Context

A patient may appear through multiple channels: web, chat, WhatsApp, phone, walk-in reception, lead generation, appointment request, or internal staff entry.

## Decision

Patient creation is allowed from multiple sources, provided identity resolution rules are applied.

Allowed sources:

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

Minimum public-channel data:

```text
name
email
```

Minimum clinic/internal data:

```text
first_name
last_name(s)
primary_phone
status default
created_at automatic
requires_invoice
CID/equivalent identifier if invoice is required
email optional
```

## Consequences

- Patient can be created before a confirmed appointment.
- Patient can be created from a Lead without replacing Lead.
- Patient can be created manually by clinic staff.
- Duplicate detection becomes mandatory before creation.

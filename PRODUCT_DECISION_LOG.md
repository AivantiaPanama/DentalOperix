# Product Decision Log

## D-CA-001 — Commercial Demo is composition, not a domain

**Status:** Certified for this edition.  
The Commercial Demo is a read-only composition and presentation layer. It is not a Commercial Domain, Sales Domain, CRM, new application or operational module.

## D-CA-002 — Preserve existing Sources of Truth

**Status:** Certified for this edition.  
No new Source of Truth, table, migration, API or parallel persistence is introduced. Leads, Patients and Appointments retain their established responsibilities.

## D-CA-003 — Reuse existing capabilities

**Status:** Certified for this edition.  
The presentation reuses Lead Management, Patient Experience, Assistant Workspace, Appointment capabilities and Authentication/RBAC context.

## D-CA-004 — Protected boundaries remain unchanged

**Status:** Certified for this edition.  
BookingDialog, processDentalLead, Lead lifecycle, Patient Identity boundaries, Appointment lifecycle and Authentication/RBAC are not modified by PR-01 through PR-03.

## D-CA-005 — Public route remains presentational

**Status:** Certified for this edition.  
`/commercial-demo` contains no operational logic. CommercialEvidencePanel remains a value narrative and is not a metrics dashboard or analytics subsystem.

## D-CA-006 — Evidence-based publication

**Status:** Applied operationally in RB-01; not promoted to Canon.  
Institutional assertions in this publication are tied to repository state, certified baseline declarations or primary implementation evidence.

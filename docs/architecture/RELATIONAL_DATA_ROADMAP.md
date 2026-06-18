# Relational Data Roadmap

## Purpose

Define the future relational data architecture for DentalOperix.

This document does not authorize migration.

It only defines the target architecture.

---

# Identity Rules

Patient Identity Priority:

CID
↓
PASSPORT
↓
FOREIGN_ID
↓
TMP-PAT

---

# Panama Requirements

Required support:

* CID
* RUC
* DV
* Business Name
* Fiscal Address

---

# Core Entities

Patient

PatientIdentity

Lead

Appointment

Treatment

ClinicalRecord

Invoice

Payment

InventoryItem

SupportTicket

AuditEvent

DashboardMetric

---

# Proposed Relationships

Patient
→ Appointments

Patient
→ Treatments

Patient
→ Clinical Records

Patient
→ Invoices

Invoice
→ Payments

Lead
→ Patient

DashboardMetric
→ Executive Observability

---

# Google Sheet Simulation Strategy

Temporary table simulation:

patients

patient_identities

leads

appointments

treatments

clinical_records

invoices

payments

inventory_items

support_tickets

audit_events

dashboard_metrics

---

# Future Database Candidates

PostgreSQL

SQL Server

MySQL

---

# Migration Policy

Current Status:

NO MIGRATION AUTHORIZED

Current Source of Truth:

Leads

Google Sheets:

Temporary simulation only

Future SQL Database:

Target architecture only

53.x Persistent Read Database Architecture

53.1 Logical Architecture

53.2 Domain Storage Model

53.3 Historical Persistence Model

53.4 Certification & Freshness Architecture

53.5 Security & Access Architecture

53.6 Executive Architecture Decision
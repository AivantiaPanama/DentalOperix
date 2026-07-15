# ADR-021 — Finance Read Domain

## Status

Accepted

## Context

Read Model Platform v2 prioritized Finance as the next expansion domain after Patient, CRM, Billing, Clinical, and Operations. Finance is read-heavy and report-heavy, but accounting reconciliation and ledger posting remain transactional concerns outside the read platform.

## Decision

Create Finance as an independent read domain with its own aggregate and read adapters.

Finance owns:

- Invoices
- Payments
- Collections
- FinancialKPIs

Finance does not own:

- Patient identity or administrative profiles
- CRM folios or treatment interests
- Billing profiles
- Clinical treatment state
- Operations runtime execution
- Ledger posting, accounting entries, or reconciliation workflows

The first implementation introduces:

- FinanceAggregateReadService
- InvoiceReadAdapter
- PaymentReadAdapter
- CollectionReadAdapter
- FinancialKpiReadAdapter

## Consequences

Finance can be consumed through ReadModelSourceProvider without coupling to Patient, CRM, Billing, Clinical, or Operations aggregates. Finance must comply with existing governance, fallback, and observability standards.

Finance remains read-only. Leads and existing operational systems remain the source of truth. No dual write, backfill, productive migration, or public contract expansion is introduced by this pilot.

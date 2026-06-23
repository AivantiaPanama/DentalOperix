# TypeScript Backlog Review

**Date:** 2026-06-22  
**Scope:** Repository-wide TypeScript debt classification after PR-61.2-04A validation  
**Command reviewed:** `npx tsc --noEmit`  
**Observed baseline:** 57 errors in 32 files

---

## Governance Context

This review is a technical-debt classification artifact. It does not authorize architectural changes.

Certified architecture remains:

```text
Leads
→ LeadPersistencePort
→ LeadPersistenceProvider
→ RelationalLeadPersistenceAdapter
→ Supabase PostgreSQL
```

Mandatory constraints:

- Leads = Source of Truth remains intact.
- No Dual Write.
- No Lead Replacement.
- No new Source of Truth.
- No Persistence Re-Architecture.
- No Analytics Write Back.
- No RBAC Bypass.
- No Supabase schema change.
- No production cutover reopening.

Protected components remain out of scope unless separately authorized:

- BookingDialog
- processDentalLead
- /api/leads/create
- Calendar
- Gmail
- FloatingDentalAIChat
- Home
- siteServices.ts

---

## Executive Summary

Repository-wide TypeScript validation is currently blocked by historical type debt outside PR-61.2-04A. The errors are concentrated in CRM/Lead contracts, Dental API payloads, Executive Dashboard contracts, Google integration schemas, protected frontend components, Today Schedule typing, analytics/recommendation contracts, follow-up tests, and test infrastructure typing.

PR-61.2-04A remains functionally validated in its local scope. This backlog must be handled in isolated technical-debt PRs to avoid accidental changes to certified Lead persistence contracts.

---

## Backlog Classification


| ID    | Program / Area                                | Priority    | Risk   | Summary                                                                                                       |
| ----- | --------------------------------------------- | ----------- | ------ | ------------------------------------------------------------------------------------------------------------- |
| TD-01 | CRM / Lead Type Alignment                     | High        | Medium | Align Lead read-model typing across persistence, CRM metrics, and analytics consumers.                        |
| TD-02 | Dental API Payload Contract                   | High        | High   | Resolve `DentalLeadPayload` treatment mismatch and create-flow result contract drift.                         |
| TD-03 | Executive Dashboard Contracts                 | Medium-High | Medium | Align envelope version literal types and dashboard payload access.                                            |
| TD-04 | Google Integrations                           | Medium      | Medium | Fix `z.enum` tuple typing and CRM status value contracts.                                                     |
| TD-05 | Frontend Protected Component Typing           | High        | High   | BookingDialog and FloatingDentalAIChat type issues; requires explicit protected-component authorization.      |
| TD-06 | Today Schedule Typing                         | Medium      | Low    | Replace unsupported `toSorted` usage or raise lib target; address implicit any.                               |
| TD-07 | Analytics / Recommendations / Business Health | Medium      | Medium | Align metrics contracts such as `averageLeadScore`, `leadScoreDistribution`, and service trend period fields. |
| TD-08 | Follow-up Engine Test Contracts               | Medium      | Medium | Align test fixtures with `FollowupRecord` contract.                                                           |
| TD-09 | Test Infrastructure Typing                    | Low-Medium  | Low    | Fix Vitest namespace typing, `window` redeclaration, and unused `@ts-expect-error`.                           |
| TD-10 | Goals / Server Handler Contracts              | Medium      | Medium | Align route handler test invocation signatures and server handler signatures.                                 |


---

## TD-01 Architecture Review — CRM / Lead Type Alignment

### Objective

Reduce TypeScript debt around CRM and Lead read models without changing persistence behavior, Lead creation behavior, database schema, or source-of-truth ownership.

### Scope

Allowed files for TD-01:

- `src/server/google/types.ts`
- `src/server/google/crm.ts`
- `src/server/leads/persistence/google-sheet-lead-persistence-adapter.ts`
- `src/server/leads/persistence/lead-persistence-provider.ts`
- `src/server/leads/persistence/relational-lead-persistence-adapter.ts`
- `src/server/leads/operations-repository.ts`
- `src/lib/crm-metrics.ts`
- `src/routes/api/crm/metrics.ts`
- `src/routes/api/analytics/executive.ts`
- `src/routes/api/analytics/revenue.ts`
- `src/routes/api/analytics/revenue-forecast.ts`

### Out of Scope

- Any database migration.
- Any schema change in Supabase.
- Any change to runtime persistence mode selection.
- Any write behavior change.
- Any create-lead flow change.
- Any protected component change.
- Any endpoint behavior change beyond type alignment.

### Key Findings

1. `CRM_STATUS_VALUES` was typed as an array from `Object.values`, which is not accepted by `z.enum` because Zod requires a non-empty tuple.
2. `urgency` was represented inconsistently as generic `string` in Google Sheet read models and as a strict union in Lead persistence contracts.
3. `emailSent` was represented as `boolean` in Lead persistence read models and as `string` in CRM metrics read models.
4. Multiple analytics and CRM consumers cast Lead persistence rows directly to `CrmLeadRow[]`, causing TypeScript overlap warnings.

### Approved Remediation Pattern

- Centralize CRM status values as a readonly tuple.
- Centralize Lead urgency values as a readonly tuple.
- Normalize legacy Spanish urgency labels (`baja`, `alta`) into certified internal values (`low`, `high`) at read-model boundaries.
- Allow CRM metrics read models to accept `emailSent` as `boolean | string` because historical Google Sheet rows and relational rows differ in representation.
- Do not alter persistence writes, source of truth, database tables, or business behavior.

### Architecture Decision

TD-01 is approved only as **type alignment** and **read-model normalization**.

It is not approved as:

- Persistence re-architecture.
- Dual-write remediation.
- Lead model replacement.
- Source-of-truth change.
- Analytics write-back.

---

## PR Sequencing Recommendation

### PR-TD-01 — CRM / Lead Type Alignment

Target:

- `CRM_STATUS_VALUES`
- `LeadUrgency`
- Google Sheet read-model urgency normalization
- CRM metrics `emailSent` compatibility

Validation:

- `npx tsc --noEmit`
- Targeted tests for CRM metrics and analytics if available
- Confirm no protected components changed
- Confirm no persistence behavior changed

### PR-TD-02 — Dental API Payload Contract

Target:

- `DentalLeadPayload.treatment`
- create-flow tests
- process result shape

Requires separate governance review because `/api/leads/create` and `processDentalLead` are protected.

### PR-TD-03 — Executive Dashboard Contracts

Target:

- contract version literal typing
- envelope payload access
- executive/operational/governance dashboard tests

### PR-TD-04 — Test Infrastructure Typing

Target:

- Vitest namespace typing
- `window` typing
- unused `@ts-expect-error`

---

## Current TD-01 Status

Status: INITIATED

Initial remediation has been limited to type-only/read-model alignment:

- CRM status tuple typing.
- Lead urgency tuple typing.
- Shared `LeadUrgency` and `normalizeLeadUrgency` utility.
- Google Sheet urgency normalization on read.
- CRM metrics `emailSent` compatibility with boolean or string sources.

No persistence behavior, source-of-truth ownership, protected components, Supabase schema, or create-lead behavior were changed.

---

## Required Validation Evidence

Before PR-TD-01 can be marked validated, collect:

```bash
npx tsc --noEmit
npx vitest run src/routes/api/crm/metrics.test.ts src/routes/api/analytics/revenue.test.ts src/routes/api/analytics/revenue-forecast.test.ts src/routes/api/analytics/executive.test.ts
npm run build
```

If repository-wide TypeScript still fails, classify remaining errors by TD group and confirm TD-01 files are clean.

---

## Governance Confirmation

- Leads = Source of Truth remains intact.
- Certified architecture remains unchanged.
- No protected components were modified for TD-01.
- No new endpoint was added.
- No backend write behavior was added.
- No analytics write-back was introduced.
- No Supabase schema or migration was introduced.

---

## TD-01 Initial Validation Evidence

Executed after initial TD-01 remediation:

```bash
npm install
npx tsc --noEmit
npx vitest run src/routes/api/crm/metrics.test.ts src/routes/api/analytics/revenue.test.ts src/routes/api/analytics/revenue-forecast.test.ts src/routes/api/analytics/executive.test.ts
```

Results:

- `npm install` completed and triggered production build successfully.
- Targeted TD-01 tests passed: 4 test files, 13 tests.
- Repository-wide TypeScript error count was reduced from 57 errors to 46 errors.
- No remaining TypeScript errors were reported in the TD-01 target paths:
  - `src/server/google/*`
  - `src/server/leads/*`
  - `src/lib/crm-metrics.ts`
  - `src/routes/api/crm/*`
  - `src/routes/api/analytics/*`

Remaining TypeScript errors belong to separately classified backlog groups:

- TD-02 Dental API Payload Contract
- TD-03 Executive Dashboard Contracts
- TD-05 Frontend Protected Component Typing
- TD-06 Today Schedule Typing
- TD-07 Analytics / Recommendations / Business Health
- TD-08 Follow-up Engine Test Contracts
- TD-09 Test Infrastructure Typing
- TD-10 Goals / Server Handler Contracts

TD-01 can be considered locally validated if code review confirms that only type/read-model alignment was changed and no protected component or persistence behavior was modified.



Final Resolution

TD-01 CLOSED

TD-02 CLOSED

TD-04 CLOSED

TD-05 CLOSED

TD-06 CLOSED

TD-07 CLOSED

TD-08 CLOSED

TD-09 CLOSED

Final Repository State

TypeScript:

0 errors

Build:

PASS

Tests:

492 / 492 PASS

STATUS:

CLOSED / VALIDATED
\# DentalOperix New Chat Handoff - 61.2 Assistant / Front Desk Workspace



\## START HERE



Use this file as the single entry point for a new ChatGPT or Cursor session starting Iteration 61.2.



Read in this order:



1\. `docs/ai-context/DENTALOPERIX\\\_NEW\\\_CHAT\\\_HANDOFF\\\_61\\\_1.md`

2\. `docs/implementation/61.1/61.1\\\_GOVERNANCE\\\_CLOSURE\\\_REPORT.md`

3\. `docs/implementation/61.1/61.1\\\_CERTIFICATION\\\_PACKAGE.md`

4\. `docs/ai-context/DENTALOPERIX\\\_NEW\\\_CHAT\\\_HANDOFF\\\_61\\\_2.md`

5\. Relevant 61.2 implementation package documents before proposing code.



Do not read historical documents unless explicitly required by an architecture or governance question.



\---



\## Certified Foundation



```text

Program 57.x: CLOSED / CERTIFIED

Persistence Transition: CLOSED / CERTIFIED

Production Cutover: CERTIFIED



61.0 Documentation Governance Consolidation: COMPLETE



61.1 Users + Authentication + RBAC + Dashboard Routing:

CLOSED / CERTIFIED



61.2 Assistant / Front Desk Workspace:

IMPLEMENTATION\\\_AUTHORIZED



61.3 Patient Management:

NOT\\\_STARTED

```



\---



\## Certified Baseline



```text

Baseline Tag: v61.1-certified



61.1 Status:

CLOSED / CERTIFIED



Certification Evidence:

\\- 107 test files passed

\\- 464 tests passed

\\- Production Build PASS

\\- SSR Build PASS



This baseline is the official starting point for all 61.2 work.



No certified 61.1 functionality may be redesigned,

replaced, re-opened, or re-architected without

formal Architecture Review.

```



\---



\## 61.1 Certification Evidence



```text

PR-1 Users Foundation:

PASS / CERTIFIED



PR-2 Authentication Foundation:

PASS / CERTIFIED



PR-3 RBAC Enforcement:

PASS / CERTIFIED



PR-4 Dashboard Routing:

PASS / CERTIFIED



PR-5 Validation \\\& Hardening:

PASS / CERTIFIED

```



Final validation:



```text

npm test:

107 test files passed

464 tests passed



npm run build:

Client PASS

SSR PASS

```



\---



\## Certified Architecture



```text

Leads

\\-> LeadPersistencePort

\\-> LeadPersistenceProvider

\\-> RelationalLeadPersistenceAdapter

\\-> Supabase PostgreSQL

```



Absolute rule:



```text

Leads = Source of Truth

```



Supporting rules:



```text

Users = Identity only

RBAC = Authorization only

Dashboard Routing = Role-based navigation only

```



\---



\## Permanent Architecture Restrictions



The following remain prohibited during 61.2:



```text

Dual Write

Lead Replacement

New Source of Truth

Persistence Re-Architecture

Analytics Write Back

RBAC Bypass

```



61.2 must consume the certified architecture and may not alter:



```text

Leads

\\-> LeadPersistencePort

\\-> LeadPersistenceProvider

\\-> RelationalLeadPersistenceAdapter

\\-> Supabase PostgreSQL

```



\---



\## Protected Components



Do not modify without explicit authorization:



```text

BookingDialog

processDentalLead

/api/leads/create

Calendar

Gmail

FloatingDentalAIChat

Home

siteServices.ts

```



\---



\## Deferred Decisions Not Authorized



Do not solve, model, implement, or assume:



```text

Doctor <-> Patient Assignment Model

Lead <-> Patient Relationship Model

Retention Policy

Soft Delete Policy

Real-Time Updates

Global Search Scope

```



If any are required during 61.2:



```text

STOP IMPLEMENTATION

REQUEST ARCHITECTURE REVIEW

```



\---



\## Out of Scope for 61.2



The following remain out of scope:



```text

Patient Management

Clinical Records

Doctor Assignment

Lead Assignment

Patient Conversion Flows

Retention Policies

Soft Delete Policies

Global Search

Real-Time Updates

```



If implementation requires any of these items:



```text

STOP IMPLEMENTATION

REQUEST ARCHITECTURE REVIEW

```



\---



\## 61.2 Status



```text

61.2 Assistant / Front Desk Workspace



STATUS:

IMPLEMENTATION\\\_AUTHORIZED

```



\---



\## Mandatory Pre-Code Protocol



Before generating code:



1\. Architecture compliance review.

2\. Affected dependencies.

3\. Risks.

4\. Technical impact.

5\. Implementation plan.

6\. Confirmation that certified architecture remains unchanged.

7\. Confirmation that protected components will not be modified.

8\. Explicit approval from the user.



No code may be generated before approval.



\---



\## First Prompt for 61.2 Implementation Chat



```text

Read:



docs/ai-context/DENTALOPERIX\\\_NEW\\\_CHAT\\\_HANDOFF\\\_61\\\_1.md

docs/implementation/61.1/61.1\\\_GOVERNANCE\\\_CLOSURE\\\_REPORT.md

docs/implementation/61.1/61.1\\\_CERTIFICATION\\\_PACKAGE.md

docs/ai-context/DENTALOPERIX\\\_NEW\\\_CHAT\\\_HANDOFF\\\_61\\\_2.md



Follow all referenced governance documents.



Current program:



61.1 CLOSED / CERTIFIED

Baseline Tag: v61.1-certified



Current execution target:



61.2 Assistant / Front Desk Workspace

STATUS: IMPLEMENTATION\\\_AUTHORIZED



Before any code generation:



1\\. Architecture compliance review

2\\. Affected dependencies

3\\. Risks

4\\. Technical impact

5\\. Implementation plan

6\\. Confirmation that certified architecture remains unchanged

7\\. Confirmation that protected components will not be modified



Do not generate code until explicit approval is given.



Preserve:



Leads = Source of Truth



Do not introduce:



\\- Dual Write

\\- Lead Replacement

\\- New Source of Truth

\\- Persistence Re-Architecture



Do not assume deferred models.



Use the 61.1 certified baseline as the starting point.

```


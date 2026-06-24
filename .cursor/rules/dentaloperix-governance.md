\# DentalOperix Governance Rules



\## Certified Architecture



Official architecture:



Leads

→ LeadPersistencePort

→ LeadPersistenceProvider

→ RelationalLeadPersistenceAdapter

→ Supabase PostgreSQL



Permanent rule:



Leads = Source of Truth



\## Protected Components



Do not modify without explicit approval:



\- BookingDialog

\- processDentalLead

\- /api/leads/create

\- Calendar

\- Gmail

\- FloatingDentalAIChat

\- Home

\- siteServices.ts



\## Forbidden Patterns



Never introduce:



\- Dual Write

\- Lead Replacement

\- New Source of Truth

\- Analytics Write Back

\- Direct writes bypassing LeadPersistencePort



\## RBAC Constraints



RBAC is an authorization layer only.



RBAC must not modify:



\- LeadPersistencePort

\- LeadPersistenceProvider

\- RelationalLeadPersistenceAdapter

\- Supabase persistence architecture



\## Implementation Policy



Before proposing changes:



1\. Analyze architecture impact

2\. Identify dependencies

3\. Identify risks

4\. Confirm compatibility

5\. Generate implementation plan



Never assume architecture changes without documentary evidence.



## Baseline 68.1 Update

- 67.3 Patient Architecture Certification Review: CERTIFIED.
- 67.4 Patient Implementation Authorization Review: APPROVED for implementation planning only.
- 68.1 Patient Implementation Readiness Assessment: COMPLETED.
- Implementation remains NOT AUTHORIZED.
- Code, database changes, migrations and protected component changes remain prohibited without explicit future authorization.

## Baseline 69.2 Update

- 68.2 Patient Implementation Strategy: CLOSED / CERTIFIED.
- 68.3 Patient Risk & Rollback Plan: CLOSED / CERTIFIED.
- 68.4 Patient Validation & Evidence Plan: CLOSED / CERTIFIED.
- 68.5 Patient Implementation Authorization Package: CLOSED / CERTIFIED.
- 69.0 Patient Implementation Authorization Review: CLOSED / AUTHORIZATION REVIEW APPROVED.
- 69.1 Implementation Planning Certification: CLOSED / IMPLEMENTATION PLANNING CERTIFIED.
- 69.2 Implementation Execution Authorization: CLOSED / IMPLEMENTATION EXECUTION AUTHORIZED.
- Implementation execution is authorized only for the Patients domain.
- Patient architecture is certified as PatientPersistencePort -> PatientPersistenceProvider -> RelationalPatientPersistenceAdapter -> Supabase PostgreSQL.
- Protected components remain out of scope.
- Any implementation increment must include architecture analysis, affected dependencies, risks, technical impact, compatibility with DENTALOPERIX_BASELINE_69_2, governance determination, validation and evidence.

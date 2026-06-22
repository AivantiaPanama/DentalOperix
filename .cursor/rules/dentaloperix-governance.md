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


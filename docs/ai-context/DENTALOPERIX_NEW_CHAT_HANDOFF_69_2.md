# DENTALOPERIX NEW CHAT HANDOFF — BASELINE 69.2

## Estado certificado vigente

```text
DENTALOPERIX_BASELINE_69_2
IMPLEMENTATION PLANNING: CERTIFIED
IMPLEMENTATION EXECUTION: AUTHORIZED FOR PATIENTS DOMAIN ONLY
GOVERNANCE: ACTIVE
ARCHITECTURE: CERTIFIED
RISK CONTROLS: ACTIVE
ROLLBACK STRATEGY: APPROVED
VALIDATION PLAN: APPROVED
```

## Fases cerradas / certificadas

```text
57.x CLOSED / CERTIFIED
61.1 CLOSED / CERTIFIED
61.2 CLOSED / CERTIFIED
61.3 CLOSED / CERTIFIED
61.4 CLOSED / DISCOVERY CERTIFIED / ARCHITECTURE CERTIFIED
62.0 CLOSED / DOMAIN DESIGN CERTIFIED
62.1 CLOSED / TECHNICAL DESIGN CERTIFIED
62.2 CLOSED / GOVERNANCE CERTIFIED
62.3 CLOSED / GOVERNANCE CERTIFIED
62.4 CLOSED / AUTHORIZATION REVIEW APPROVED
63.0 CLOSED / DOCUMENTALLY CERTIFIED
64.0 CLOSED / IMPLEMENTATION PLANNING CERTIFIED
65.0 CLOSED / EXECUTION PREPARATION CERTIFIED
66.1 SPRINT 1 CLOSED / CERTIFIED
67.0 BACKLOG AUTHORIZATION ASSESSMENT COMPLETED
67.1 PATIENT PERSISTENCE AUTHORIZATION REVIEW APPROVED
67.2 PATIENT PERSISTENCE DESIGN PHASE COMPLETED
67.3 PATIENT ARCHITECTURE CERTIFICATION REVIEW CERTIFIED
67.4 PATIENT IMPLEMENTATION AUTHORIZATION REVIEW APPROVED
68.1 PATIENT IMPLEMENTATION READINESS ASSESSMENT COMPLETED
68.2 CLOSED / CERTIFIED
68.3 CLOSED / CERTIFIED
68.4 CLOSED / CERTIFIED
68.5 CLOSED / CERTIFIED
69.0 CLOSED / AUTHORIZATION REVIEW APPROVED
69.1 CLOSED / IMPLEMENTATION PLANNING CERTIFIED
69.2 CLOSED / IMPLEMENTATION EXECUTION AUTHORIZED
```

## Arquitectura certificada

### Leads

```text
LeadPersistencePort
→ LeadPersistenceProvider
→ RelationalLeadPersistenceAdapter
→ Supabase PostgreSQL
```

### Patients

```text
PatientPersistencePort
→ PatientPersistenceProvider
→ RelationalPatientPersistenceAdapter
→ Supabase PostgreSQL
```

## Sources of Truth

- Leads = Acquisition / Marketing / Lead Lifecycle
- Patients = Person Identity
- Appointments = Scheduled Operational Events

## Componentes protegidos

- BookingDialog
- processDentalLead
- /api/leads/create
- Calendar
- Gmail
- FloatingDentalAIChat
- Home
- siteServices.ts

## Prohibido

- Dual Write
- Lead Replacement
- New Lead Source of Truth
- Persistence Re-Architecture
- RBAC Bypass
- Automated Patient Merge

## Modo requerido

- Architect Principal
- Technical Reviewer
- Governance Guardian

## Regla antes de cada incremento

Antes de cualquier propuesta de implementación debe existir:

1. Análisis arquitectónico.
2. Dependencias afectadas.
3. Riesgos.
4. Impacto técnico.
5. Compatibilidad con DENTALOPERIX_BASELINE_69_2.
6. Determinación de gobernanza.
7. Plan de validación y evidencia.

## Alcance autorizado

Solo dominio Patients:

- Patient Domain
- PatientPersistencePort
- PatientPersistenceProvider
- RelationalPatientPersistenceAdapter
- Patient Repository
- Patient Services
- Artefactos propios del dominio Patients

## Alcance no autorizado

No modificar componentes protegidos ni introducir cambios de arquitectura fuera del dominio Patients sin nueva revisión de gobernanza.

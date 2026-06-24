# DENTALOPERIX New Chat Handoff 68.1

## Baseline operativo

DENTALOPERIX_BASELINE_68_1

## Estado consolidado

```text
66.1 SPRINT 1 CLOSED / CERTIFIED
67.0 COMPLETED
67.1 APPROVED
67.2 COMPLETED
67.3 PATIENT ARCHITECTURE CERTIFIED
67.4 APPROVED FOR IMPLEMENTATION PLANNING ONLY
68.1 COMPLETED / READY FOR IMPLEMENTATION PLANNING
```

## Arquitectura certificada

```text
Leads -> LeadPersistencePort -> LeadPersistenceProvider -> RelationalLeadPersistenceAdapter -> Supabase PostgreSQL

PatientPersistencePort -> PatientPersistenceProvider -> RelationalPatientPersistenceAdapter -> Supabase PostgreSQL
```

## Sources of Truth

```text
Leads = Acquisition / Marketing / Lead Lifecycle
Patients = Person Identity
Appointments = Scheduled Operational Events
```

## Restricciones vigentes

- No Dual Write.
- No Lead Replacement.
- No New Lead Source of Truth.
- No Persistence Re-Architecture.
- No RBAC Bypass.
- No Automated Patient Merge.
- No código sin autorización explícita.

## Componentes protegidos

BookingDialog, processDentalLead, /api/leads/create, Calendar, Gmail, FloatingDentalAIChat, Home, siteServices.ts.

## Siguiente fase recomendada

```text
68.2 PATIENT IMPLEMENTATION STRATEGY
```

## Alcance vigente

Implementation Planning autorizado. Implementación no autorizada.

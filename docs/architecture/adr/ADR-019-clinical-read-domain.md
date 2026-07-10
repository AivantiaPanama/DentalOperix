# ADR-019 — Clinical Read Domain

## Estado

Aceptado.

## Contexto

La plataforma Read Model v1 ya cuenta con dominios Patient, CRM y Billing. El dominio Clinical fue calificado en 16.1-A y diseñado en 16.1-B como dominio independiente para vistas clínicas read-only.

## Decisión

Crear un dominio Clinical independiente con:

- `ClinicalAggregateReadService`
- `TreatmentPlanReadAdapter`
- `TreatmentStageReadAdapter`
- `ClinicalOutcomeReadAdapter`

El dominio Clinical no puede depender de PatientAggregate, CRMReadAggregate ni BillingReadAggregate.

## Alcance inicial

Incluye:

- TreatmentPlans
- TreatmentStages
- ClinicalOutcomes

Excluye:

- ClinicalNotes
- escritura clínica
- dual write
- migración productiva

## Consecuencias

El dominio Clinical queda preparado para pilotos read-only y observabilidad estándar sin alterar Leads como Source of Truth.

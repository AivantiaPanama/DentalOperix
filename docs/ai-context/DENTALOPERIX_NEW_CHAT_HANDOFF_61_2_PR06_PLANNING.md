# DentalOperix — New Chat Handoff 61.2 PR06 Planning

## Idioma

Trabajar completamente en español.

## Estado certificado vigente

- Program 57.x: CLOSED / CERTIFIED.
- Persistence Transition: CLOSED / CERTIFIED.
- Production Cutover: CERTIFIED.
- 61.1 Users + Authentication + RBAC + Dashboard Routing: CLOSED / CERTIFIED.
- 61.2 Assistant / Front Desk Workspace: IN PROGRESS.

## 61.2 completado hasta ahora

- PR-61.2-01 Assistant Workspace Shell: COMPLETE / VALIDATED.
- PR-61.2-02 Today's Schedule: COMPLETE / VALIDATED.
- PR-61.2-03 Lead Queue: COMPLETE / VALIDATED.
- PR-61.2-04A Lead Detail Read-Only: COMPLETE / VALIDATED.
- PR-61.2-04B Lead Status Management: COMPLETE / VALIDATED.
- PR-61.2-05 Lead Notes: COMPLETE / VALIDATED / CERTIFIED.

## Siguiente PR recomendado

PR-61.2-06 Appointment Operations.

Objetivo:

- Crear cita desde Assistant Workspace.
- Modificar cita.
- Cancelar cita.
- Registrar auditoría de operación.
- Validar disponibilidad por doctor/proveedor.

## Decisiones documentadas antes de código

Leer primero:

1. `docs/implementation/61.2/61.2_PR06_APPOINTMENT_OPERATIONS_ARCHITECTURE_REVIEW.md`
2. `docs/adr/ADR-061-2-06-appointment-operations-audit-and-provider-availability.md`

## Decisión conceptual

Crear cita desde asistente no es lo mismo que booking público de paciente, aunque ambos pueden producir un Appointment.

Definición:

```text
Appointment = entidad operativa de agenda
Booking = solicitud/agendamiento iniciado por paciente o canal externo
Appointment Operation = acción interna de usuario autorizado
```

Crear cita no significa abrir expediente.

## Regla de disponibilidad

No validar únicamente por fecha y hora.

Usar principio:

```text
date + time + providerId = provider slot
```

Debe permitirse:

```text
Dr. A ocupado a las 10:00
Dr. B disponible a las 10:00
→ nueva cita permitida con Dr. B
```

Debe rechazarse:

```text
Dr. A ocupado a las 10:00
Nueva cita con Dr. A a las 10:00
→ conflicto
```

## Audit Trail obligatorio

Toda operación debe registrar:

```text
createdByUserId / createdByRole / createdVia / createdAt
updatedByUserId / updatedByRole / updatedVia / updatedAt
cancelledByUserId / cancelledByRole / cancelledVia / cancelledAt / cancellationReason
```

## Límites de gobernanza

No modelar:

- Lead ↔ Patient Relationship.
- Doctor ↔ Patient Assignment permanente.
- Patient Management formal.
- Expediente clínico.

Sí se permite:

```text
Appointment → Provider
```

como asignación operativa de una cita específica.

## Componentes protegidos

No modificar sin autorización explícita:

- BookingDialog.
- processDentalLead.
- /api/leads/create.
- Calendar.
- Gmail.
- FloatingDentalAIChat.
- Home.
- siteServices.ts.

## Confirmaciones obligatorias antes de propuesta técnica

Antes de cualquier propuesta de implementación entregar:

1. Architecture Review.
2. Dependencias afectadas.
3. Riesgos.
4. Impacto técnico.
5. Opciones arquitectónicas.
6. Recomendación técnica.
7. Plan de implementación archivo por archivo.
8. Estrategia de pruebas.
9. Estrategia documental.

No generar código sin aprobación explícita.

## Próximo paso recomendado

Inspección técnica dirigida del código actual para responder:

1. Cómo se crean citas actualmente.
2. Dónde vive la persistencia de appointments.
3. Qué APIs existen para create/update/cancel.
4. Si ya existe providerId/doctorId en appointments.
5. Si ya existe audit trail.
6. Qué cambios pueden hacerse sin tocar componentes protegidos.

Después de esa inspección, preparar propuesta técnica final de PR-61.2-06 para aprobación.

## Governance Retrospective

Antes de cerrar formalmente 61.2, realizar Governance Retrospective Review:

- KEEP.
- IMPROVE.
- REMOVE.
- ADD.
- Lecciones aprendidas.
- Ajustes de reglas para 61.3.

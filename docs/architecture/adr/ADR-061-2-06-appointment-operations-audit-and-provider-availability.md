# ADR-061.2-06 — Appointment Operations Audit Trail and Provider Availability

## Estado

**Proposed / Pending Approval**  
**Fecha:** 2026-06-23  
**Fase:** 61.2 Assistant / Front Desk Workspace  
**PR:** PR-61.2-06 Appointment Operations

---

## Contexto

PR-61.2-06 busca permitir que Front Desk cree, modifique y cancele citas desde Assistant Workspace.

Durante la revisión conceptual se identificaron dos problemas:

1. Crear cita desde asistente no es idéntico a que un paciente agende una cita públicamente.
2. El sistema parece asumir disponibilidad por fecha/hora, lo cual falla en clínicas con múltiples doctores/proveedores.

Ejemplo del problema:

```text
10:00 Dr. A ocupado
10:00 Dr. B disponible
```

Si el sistema bloquea todo el horario 10:00, impide aprovechar capacidad real de la clínica.

---

## Decisión

Adoptar dos principios para Appointment Operations.

### 1. Audit Trail obligatorio

Toda cita debe registrar el actor y canal que ejecutó la operación.

Campos conceptuales:

```ts
createdByUserId;
createdByRole;
createdVia;
createdAt;
updatedByUserId;
updatedByRole;
updatedVia;
updatedAt;
cancelledByUserId;
cancelledByRole;
cancelledVia;
cancelledAt;
cancellationReason;
```

Valores conceptuales de `createdVia`:

```text
public_booking
assistant_workspace
admin_workspace
system
```

### 2. Disponibilidad por provider

La disponibilidad no se valida únicamente por fecha/hora.

Regla:

```text
date + time + providerId = provider slot
```

Se permite más de una cita en la misma fecha/hora si están asignadas a providers diferentes.

---

## No-decisions

Este ADR no decide:

- Lead ↔ Patient Relationship.
- Doctor ↔ Patient Assignment permanente.
- Patient Management formal.
- Expediente clínico.
- Retention Policy.
- Soft Delete Policy.
- Global Search Scope.
- Real-Time Updates.

---

## Consecuencias

### Positivas

- Permite operación real con múltiples doctores.
- Evita bloqueo artificial de agenda.
- Mejora trazabilidad operacional.
- Diferencia booking externo de operación interna.

### Costos

- Puede requerir migración del modelo de citas.
- Requiere validar usuario autenticado y rol.
- Requiere nuevas pruebas de conflictos por provider.

### Riesgos mitigados

- Evita asumir clínica de un solo doctor.
- Evita que citas internas parezcan creadas por paciente/sistema.
- Evita mezclar cita con expediente clínico.

---

## Compatibilidad con gobernanza certificada

- Compatible con Leads = Source of Truth.
- No cambia arquitectura certificada de Leads.
- No introduce nueva Source of Truth.
- No introduce Dual Write.
- No modifica componentes protegidos sin aprobación.
- No modela Doctor ↔ Patient permanente.
- Solo permite Appointment → Provider como asignación operativa por cita.

---

## Criterio de aceptación arquitectónico

PR-61.2-06 solo podrá implementarse si el diseño técnico demuestra:

1. Cómo se identifica al usuario creador/modificador/cancelador.
2. Cómo se guarda la auditoría en persistencia.
3. Cómo se valida disponibilidad por provider.
4. Cómo se permite misma fecha/hora con providers diferentes.
5. Cómo se rechaza conflicto del mismo provider en el mismo horario.
6. Cómo se evita modificar componentes protegidos sin autorización.

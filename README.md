# DentalOperix Followup Automation

## API endpoint

- `POST /api/followups/run`
- Body: JSON
  - `dryRun`: boolean (default `true`)

### Ejemplos

Dry run (no envía correos):

```json
{ "dryRun": true }
```

Ejecución real (envía correos):

```json
{ "dryRun": false }
```

### Respuesta

La API devuelve un resumen de las acciones generadas y su estado:

```json
{
  "success": true,
  "summary": {
    "generated": 5,
    "sent": 3,
    "omitted": 0,
    "failed": 0
  },
  "actions": [
    {
      "leadId": "lead-1",
      "type": "appointment_reminder",
      "channel": "email",
      "recipient": "paciente@example.com",
      "subject": "Recordatorio de cita DentalOperix",
      "message": "...",
      "scheduledAt": "2026-06-14T10:00:00.000Z"
    }
  ]
}
```

## Hoja de Google Sheets: `PatientFollowUps`

La hoja utilizada para persistir los registros de seguimiento debe tener las siguientes columnas:

1. `leadId`
2. `type`
3. `channel`
4. `recipient`
5. `message`
6. `status`
7. `scheduledAt`
8. `executedAt`
9. `error`

### Comportamiento

- Si `dryRun` es `true`, el endpoint genera las acciones pero no envía correos.
- Si `dryRun` es `false`, el endpoint envía correos usando Gmail y registra cada intento en `PatientFollowUps`.
- No se generan correos duplicados para un mismo `leadId` y `type` ya registrado.

## Variables de entorno relevantes

- `GOOGLE_SHEET_ID`
- `GOOGLE_SHEET_NAME`
- `GOOGLE_FOLLOWUPS_SHEET_NAME` (por defecto `PatientFollowUps`)
- `GOOGLE_REFRESH_TOKEN`
- `GMAIL_SENDER`

## Notas

El seguimiento automático está desacoplado del flujo de `BookingDialog`, de la creación de eventos de Calendar y del chatbot. El `BookingDialog` sigue siendo el único mecanismo para crear citas.

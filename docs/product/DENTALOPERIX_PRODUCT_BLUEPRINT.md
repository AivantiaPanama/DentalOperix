# DENTALOPERIX PRODUCT BLUEPRINT

## Estado actual

Fases completadas:

- Fase 8
- Fase 9
- Fase 10
- Fase 11
- Fase 11.5
- Fase 12

Fases de evolución de experiencia:

- Fase 13.1: Fundación filosófica e identidad de atención
- Fase 13.2: Humanización de la experiencia pública
- Fase 13.3: ClinicEntryDialog

## Visión del producto

DentalOperix es una plataforma integral para clínicas dentales que combina sitio web, CRM odontológico, agenda, chatbot de orientación, automatización de seguimiento, panel administrativo y métricas de negocio.

La tecnología existe para apoyar la atención de las personas.

## Arquitectura protegida

### BookingDialog

BookingDialog es el único mecanismo autorizado para crear citas.

Responsabilidades:

- Registrar lead en Google Sheets CRM
- Crear evento en Google Calendar
- Enviar correo mediante Gmail
- Mostrar confirmación al paciente

Ningún otro módulo debe crear citas.

### Chatbot

Puede orientar, precalificar, detectar urgencia y abrir BookingDialog.

No puede crear citas, diagnosticar, escribir CRM, crear eventos ni enviar correos.

### Administración

Rutas administrativas:

- /admin/login
- /admin/dashboard
- /admin/automation

La autenticación administrativa no debe usar localStorage ni sessionStorage.

## Experiencia pública

La experiencia pública se divide en:

1. Home: presentación institucional y servicios.
2. Nuestra Filosofía: principios de atención.
3. Solicitar Atención: entrada funcional hacia BookingDialog mediante una bienvenida.
4. Área administrativa: separada de la experiencia del paciente.

## Regla de producto

Antes de aprobar una funcionalidad orientada al paciente, debe responderse:

¿Esto ayuda al paciente a sentirse atendido, informado y respetado?

Si la respuesta es no, la funcionalidad debe revisarse.

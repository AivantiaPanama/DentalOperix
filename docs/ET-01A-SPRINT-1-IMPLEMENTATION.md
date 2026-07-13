# ET-01A Sprint 1 — Public Experience

## Estado

IMPLEMENTADO / PENDIENTE DE VALIDACIÓN LOCAL DEL USUARIO

## Alcance entregado

- Landing pública para clínicas en `/clinicas`.
- Quick Assessment móvil en `/clinicas/diagnostico`.
- Flujo dividido en seis pasos con validación progresiva.
- Página de cierre en `/clinicas/gracias`.
- Navegación hacia la Commercial Demo existente.
- Metadatos básicos para buscadores y redes.
- Persistencia temporal en `sessionStorage` exclusivamente para continuidad de sesión.

## Decisión de arquitectura

No se reutilizó `/api/leads/create`, porque ese endpoint pertenece al flujo de pacientes de una clínica y su fuente de verdad certificada. Los prospectos B2B de DentalOperix requieren una decisión explícita sobre repositorio comercial antes de habilitar persistencia o automatizaciones.

## Componentes creados

- `src/components/commercial-engagement/CommercialLandingPage.tsx`
- `src/components/commercial-engagement/QuickAssessmentPage.tsx`
- `src/components/commercial-engagement/AssessmentThankYouPage.tsx`

## Rutas creadas

- `src/routes/clinicas.tsx`
- `src/routes/clinicas/diagnostico.tsx`
- `src/routes/clinicas/gracias.tsx`

## Siguiente incremento recomendado

ET-01A Sprint 2 debe definir y autorizar el repositorio de prospectos comerciales B2B, el contrato de envío del assessment y la generación del Growth Readiness Report, sin alterar los SoT certificados de Leads, Patients o Appointments.

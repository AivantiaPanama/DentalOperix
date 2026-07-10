export type CommercialDemoScenario = {
  id: string;
  name: string;
  description: string;
  audience: string;
  commercialGoal: string;
};

export type CommercialDemoFoundation = {
  scenario: CommercialDemoScenario;
  patientJourney: string[];
  clinicJourney: string[];
  commercialEvidence: string[];
  supportingCapabilities: string[];
};

export const commercialDemoFoundation: CommercialDemoFoundation = {
  scenario: {
    id: "new-patient-acquisition",
    name: "Paciente nuevo interesado en iniciar un tratamiento dental",
    description:
      "Escenario base para representar un paciente nuevo que necesita orientación y una primera conversación comercial clara.",
    audience:
      "paciente nuevo que busca información, confianza y una primera propuesta de tratamiento.",
    commercialGoal:
      "captar interés inicial, traducirlo en un primer contacto útil y preparar evidencia comercial para la siguiente conversación.",
  },
  patientJourney: [
    "Descubrir la clínica y comprender la propuesta de valor dental.",
    "Expresar interés por un tratamiento o una valoración inicial.",
    "Recibir una respuesta clara y una siguiente acción o seguimiento.",
  ],
  clinicJourney: [
    "Identificar al lead como un paciente nuevo con intención de tratamiento.",
    "Coordinar una conversación clínica o una valoración inicial de forma ordenada.",
    "Registrar la interacción como parte de la ruta de adquisición comercial.",
  ],
  commercialEvidence: [
    "Volumen inicial de leads captados desde la experiencia comercial.",
    "Tasa de interés y avance desde el primer contacto hasta la valoración.",
    "Evidencia de recorrido desde la adquisición hasta la conversación clínica.",
  ],
  supportingCapabilities: [
    "Lead Management",
    "Patient Identity Foundation",
    "Appointment Operations",
    "Assistant Workspace",
    "Authentication/RBAC",
  ],
};

export function getCommercialDemoFoundationById(id: string) {
  return commercialDemoFoundation.scenario.id === id ? commercialDemoFoundation : undefined;
}

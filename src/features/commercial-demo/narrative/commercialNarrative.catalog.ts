import type {
  CommercialDemoSource,
  CommercialFocusArea,
  CommercialReadinessLevel,
  DemoJourneyStep,
} from "../context/commercialDemoContext.types";

export interface CommercialNarrativeReadinessCatalogEntry {
  clinicSituation: string;
  openingMessage: string;
  primaryOpportunity: string;
  expectedBenefit: string;
  meetingObjective: string;
}

export interface CommercialNarrativeFocusAreaCatalogEntry {
  opportunity: string;
  benefit: string;
  evidence: string;
}

export interface CommercialNarrativeJourneyCatalogEntry {
  explanation: string;
}

export interface CommercialNarrativeSourceCatalogEntry {
  openingMessage: string;
}

export const commercialNarrativeCatalog = {
  readinessLevels: {
    organized: {
      clinicSituation:
        "La clínica ya tiene una base operativa organizada y puede aprovecharla para consolidar visibilidad, evolución y crecimiento controlado.",
      openingMessage:
        "La demostración se presenta con un tono de consolidación y evolución para mostrar cómo la clínica puede avanzar con mayor claridad.",
      primaryOpportunity:
        "La oportunidad principal es consolidar la visibilidad de la operación y aprovechar mejor las capacidades existentes.",
      expectedBenefit:
        "El beneficio esperado es fortalecer la continuidad del trabajo del equipo y sostener un crecimiento más controlado.",
      meetingObjective:
        "El objetivo de la reunión es mostrar cómo la clínica puede evolucionar con mayor visibilidad, coordinación y control sin perder la calidad de su operación.",
    },
    developing: {
      clinicSituation:
        "La clínica cuenta con una base funcional en evolución y puede reforzar su organización para mejorar seguimiento, coordinación y continuidad.",
      openingMessage:
        "La demostración se presenta con un tono de orden progresivo para acompañar a la clínica en un avance más consistente.",
      primaryOpportunity:
        "La oportunidad principal es reforzar la continuidad del seguimiento y reducir tareas manuales que limitan la coordinación.",
      expectedBenefit:
        "El beneficio esperado es reducir oportunidades perdidas y mantener una relación más consistente con pacientes interesados.",
      meetingObjective:
        "El objetivo de la reunión es mostrar cómo la clínica puede avanzar hacia un proceso más ordenado, visible y productivo.",
    },
    "high-opportunity": {
      clinicSituation:
        "La clínica muestra oportunidades claras de impacto y puede avanzar con un recorrido más simple, visible y alineado con prioridades concretas.",
      openingMessage:
        "La demostración se presenta con un tono positivo y práctico para destacar oportunidades de impacto rápido y acompañamiento claro.",
      primaryOpportunity:
        "La oportunidad principal es simplificar la operación y convertir varias oportunidades en una experiencia más clara para el equipo y el paciente.",
      expectedBenefit:
        "El beneficio esperado es generar impacto visible con una operación más simple, más clara y más fácil de sostener.",
      meetingObjective:
        "El objetivo de la reunión es mostrar cómo la clínica puede avanzar con una propuesta concreta, profesional y fácil de adoptar.",
    },
  } satisfies Record<CommercialReadinessLevel, CommercialNarrativeReadinessCatalogEntry>,
  focusAreas: {
    "patient-follow-up": {
      opportunity: "Mejorar la continuidad desde el primer contacto hasta la siguiente acción.",
      benefit:
        "Reducir oportunidades perdidas y mantener una relación más consistente con pacientes interesados.",
      evidence: "Trazabilidad del seguimiento y avance de oportunidades.",
    },
    "appointment-management": {
      opportunity: "Coordinar mejor las citas y los pasos necesarios para concretarlas.",
      benefit:
        "Reducir fricción administrativa y facilitar el avance desde el interés hasta la atención.",
      evidence: "Visibilidad del recorrido entre contacto, cita y seguimiento.",
    },
    "administrative-efficiency": {
      opportunity: "Reducir tareas repetitivas y dependencia de procesos manuales.",
      benefit: "Liberar tiempo del equipo para actividades de mayor valor.",
      evidence: "Procesos más claros, ordenados y repetibles.",
    },
    "operational-visibility": {
      opportunity: "Convertir información dispersa en una visión más clara de la operación.",
      benefit: "Tomar decisiones con mejor contexto y detectar oportunidades de mejora.",
      evidence: "Indicadores y trazabilidad del recorrido comercial y operativo.",
    },
    "patient-experience": {
      opportunity: "Ofrecer respuestas y siguientes pasos más claros para el paciente.",
      benefit: "Fortalecer confianza, continuidad y percepción de servicio.",
      evidence: "Experiencia más coherente desde el primer contacto.",
    },
    "team-coordination": {
      opportunity:
        "Coordinar mejor responsabilidades, información y seguimiento entre miembros del equipo.",
      benefit: "Reducir confusión y mejorar la continuidad de la atención.",
      evidence: "Responsabilidades y acciones visibles dentro del recorrido operativo.",
    },
  } satisfies Record<CommercialFocusArea, CommercialNarrativeFocusAreaCatalogEntry>,
  journeys: {
    "lead-management": {
      explanation:
        "El recorrido comienza con el contacto inicial para mostrar cómo una consulta puede convertirse en una oportunidad organizada.",
    },
    "patient-identity": {
      explanation:
        "El recorrido mantiene una identidad consistente del paciente para que la historia sea clara desde el inicio.",
    },
    "appointment-operations": {
      explanation:
        "El recorrido avanza hacia la cita para mostrar cómo una intención se convierte en una operación coordinada.",
    },
    "assistant-workspace": {
      explanation:
        "El recorrido incorpora el trabajo del equipo para mostrar cómo se gestionan tareas y seguimiento de forma ordenada.",
    },
    "operational-evidence": {
      explanation:
        "El recorrido cierra con evidencia operativa para mostrar cómo la clínica puede sostener trazabilidad y aprendizaje.",
    },
  } satisfies Record<DemoJourneyStep, CommercialNarrativeJourneyCatalogEntry>,
  sources: {
    "growth-readiness-report": {
      openingMessage:
        "La demostración se prepara considerando las oportunidades identificadas para la clínica y el contexto comercial disponible.",
    },
    "direct-demo": {
      openingMessage:
        "Esta demostración muestra una propuesta profesional para acompañar a la clínica en un avance claro y ordenado.",
    },
  } satisfies Record<CommercialDemoSource, CommercialNarrativeSourceCatalogEntry>,
} as const;

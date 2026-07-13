import type { CommercialDemoContext, CommercialFocusArea } from "../context/commercialDemoContext.types";
import { commercialNarrativeCatalog } from "./commercialNarrative.catalog";
import type { CommercialNarrative } from "./commercialNarrative.types";

const DEFAULT_FOCUS_AREA: CommercialFocusArea = "operational-visibility";

function getPrimaryFocusArea(context: CommercialDemoContext): CommercialFocusArea {
  const [firstFocusArea] = context.focusAreas;
  return firstFocusArea ?? DEFAULT_FOCUS_AREA;
}

function buildEvidenceEmphasis(context: CommercialDemoContext): string[] {
  const focusAreas = context.focusAreas.length > 0 ? context.focusAreas : [DEFAULT_FOCUS_AREA];
  const evidenceEntries = focusAreas.map((focusArea) => {
    return commercialNarrativeCatalog.focusAreas[focusArea].evidence;
  });

  const uniqueEvidence = evidenceEntries.filter(
    (entry, index) => evidenceEntries.indexOf(entry) === index,
  );

  return uniqueEvidence.length > 0 ? uniqueEvidence : [commercialNarrativeCatalog.focusAreas[DEFAULT_FOCUS_AREA].evidence];
}

function buildJourneyRationale(context: CommercialDemoContext): string {
  if (context.recommendedJourney.length === 0) {
    return `El recorrido se presenta de forma general para mostrar cómo la clínica puede avanzar con una historia comercial coherente y útil.`;
  }

  const steps = context.recommendedJourney
    .map((step) => commercialNarrativeCatalog.journeys[step].explanation)
    .filter(Boolean);

  if (steps.length === 0) {
    return `El recorrido se presenta de forma general para mostrar cómo la clínica puede avanzar con una historia comercial coherente y útil.`;
  }

  const joinedSteps = steps.join(" ");

  return `El recorrido se organiza para contar una historia coherente desde el contacto inicial hasta la evidencia operativa: ${joinedSteps}`;
}

export function buildCommercialNarrative(context: CommercialDemoContext): CommercialNarrative {
  const readiness = commercialNarrativeCatalog.readinessLevels[context.readinessLevel];
  const primaryFocusArea = getPrimaryFocusArea(context);
  const primaryAreaEntry = commercialNarrativeCatalog.focusAreas[primaryFocusArea];
  const sourceEntry = commercialNarrativeCatalog.sources[context.source];

  return {
    headline: `Narrativa comercial para ${context.readinessLevel}`,
    openingMessage: `${sourceEntry.openingMessage} ${readiness.openingMessage}`,
    clinicSituation: readiness.clinicSituation,
    primaryOpportunity: `${readiness.primaryOpportunity} ${primaryAreaEntry.opportunity}`,
    expectedBenefit: `${readiness.expectedBenefit} ${primaryAreaEntry.benefit}`,
    meetingObjective: readiness.meetingObjective,
    journeyRationale: buildJourneyRationale(context),
    evidenceEmphasis: buildEvidenceEmphasis(context),
    closingMessage: `La demostración busca acompañar a la clínica con una propuesta clara, profesional y alineada con su contexto comercial.`,
  };
}

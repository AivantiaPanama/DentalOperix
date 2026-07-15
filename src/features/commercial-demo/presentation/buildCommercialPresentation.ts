import type { CommercialNarrative } from "../narrative/commercialNarrative.types";
import { commercialPresentationCatalog } from "./commercialPresentation.catalog";
import type { CommercialPresentationModel } from "./commercialPresentation.types";

function normalizeText(value: string, fallback: string): string {
  const trimmedValue = value.trim();
  return trimmedValue.length > 0 ? trimmedValue : fallback;
}

function composeMessage(first: string, second: string): string {
  const normalizedFirst = first.trim();
  const normalizedSecond = second.trim();

  if (!normalizedFirst) {
    return normalizedSecond;
  }

  if (!normalizedSecond) {
    return normalizedFirst;
  }

  const firstEndsWithPunctuation = /[.!?]$/.test(normalizedFirst);
  const secondStartsWithPunctuation = /^[.!?]/.test(normalizedSecond);

  if (firstEndsWithPunctuation || secondStartsWithPunctuation) {
    return `${normalizedFirst} ${normalizedSecond}`;
  }

  return `${normalizedFirst}. ${normalizedSecond}`;
}

function buildBadges(narrative: CommercialNarrative): string[] {
  const badges = [
    narrative.primaryOpportunity,
    narrative.expectedBenefit,
    narrative.meetingObjective,
  ]
    .map((value) => normalizeText(value, ""))
    .filter(Boolean);

  return badges.slice(0, 3);
}

function buildSteps(narrative: CommercialNarrative) {
  return [
    {
      title: commercialPresentationCatalog.steps.context.title,
      description: normalizeText(
        narrative.clinicSituation,
        "La clínica cuenta con una base sólida para avanzar con mayor claridad.",
      ),
    },
    {
      title: commercialPresentationCatalog.steps.opportunity.title,
      description: normalizeText(
        narrative.primaryOpportunity,
        "La oportunidad principal se presenta con claridad y enfoque comercial.",
      ),
    },
    {
      title: commercialPresentationCatalog.steps.journey.title,
      description: normalizeText(
        narrative.journeyRationale,
        "El recorrido se presenta como una historia coherente para la clínica.",
      ),
    },
    {
      title: commercialPresentationCatalog.steps.result.title,
      description: normalizeText(
        narrative.expectedBenefit,
        "El resultado esperado se presenta con foco en el valor comercial.",
      ),
    },
  ];
}

function buildEvidenceItems(narrative: CommercialNarrative): string[] {
  const items = narrative.evidenceEmphasis.map((item) => normalizeText(item, "")).filter(Boolean);

  if (items.length > 0) {
    const uniqueItems = items.filter((item, index) => items.indexOf(item) === index);
    return uniqueItems;
  }

  return [commercialPresentationCatalog.evidence.fallbackItem];
}

function buildEvidenceBeforeMessage(narrative: CommercialNarrative): string {
  const primaryOpportunity = normalizeText(
    narrative.primaryOpportunity,
    "Existe una oportunidad de fortalecer la propuesta comercial.",
  );

  const cleanedOpportunity = [
    /^la principal oportunidad(?: está| es)?(?: en| para)?\s*/i,
    /^la oportunidad principal(?: está| es)?(?: en| para)?\s*/i,
    /^la oportunidad(?: está| es)?(?: en| para)?\s*/i,
  ].reduce((value, pattern) => value.replace(pattern, ""), primaryOpportunity);

  if (cleanedOpportunity && cleanedOpportunity !== primaryOpportunity) {
    return `Existe una oportunidad de fortalecer ${cleanedOpportunity.toLowerCase()}`;
  }

  return "Existe una oportunidad de fortalecer la propuesta comercial.";
}

export function buildCommercialPresentation(
  narrative: CommercialNarrative,
): CommercialPresentationModel {
  const normalizedNarrative = {
    headline: normalizeText(narrative.headline, "Narrativa comercial preparada para la clínica"),
    openingMessage: normalizeText(
      narrative.openingMessage,
      "Esta demostración presenta una propuesta preparada para la clínica.",
    ),
    clinicSituation: normalizeText(
      narrative.clinicSituation,
      "La clínica cuenta con una base sólida para avanzar con mayor claridad.",
    ),
    primaryOpportunity: normalizeText(
      narrative.primaryOpportunity,
      "La oportunidad principal se presenta con claridad y enfoque comercial.",
    ),
    expectedBenefit: normalizeText(
      narrative.expectedBenefit,
      "El beneficio esperado se presenta con foco en el valor comercial.",
    ),
    meetingObjective: normalizeText(
      narrative.meetingObjective,
      "El objetivo de la reunión se presenta con claridad y enfoque comercial.",
    ),
    journeyRationale: normalizeText(
      narrative.journeyRationale,
      "El recorrido se presenta como una historia coherente para la clínica.",
    ),
    evidenceEmphasis: narrative.evidenceEmphasis,
    closingMessage: normalizeText(
      narrative.closingMessage,
      "La demostración busca acompañar a la clínica con una propuesta clara.",
    ),
  };

  return {
    header: {
      eyebrow: commercialPresentationCatalog.header.eyebrow,
      title: normalizedNarrative.headline,
      description: composeMessage(
        normalizedNarrative.openingMessage,
        normalizedNarrative.clinicSituation,
      ),
      badges: buildBadges(narrative),
    },
    steps: buildSteps(normalizedNarrative as CommercialNarrative),
    journey: {
      title: commercialPresentationCatalog.journey.title,
      description: normalizedNarrative.meetingObjective,
      rationale: normalizedNarrative.journeyRationale,
    },
    evidence: {
      title: commercialPresentationCatalog.evidence.title,
      description: commercialPresentationCatalog.evidence.description,
      beforeMessage: buildEvidenceBeforeMessage(normalizedNarrative as CommercialNarrative),
      items: buildEvidenceItems(normalizedNarrative as CommercialNarrative),
    },
    closingMessage: normalizedNarrative.closingMessage,
  };
}

import {
  COMMERCIAL_DEMO_CONTEXT_VERSION,
  type CommercialFocusArea,
  type CommercialReadinessLevel,
  type DemoJourneyStep,
  type CommercialDemoSource,
} from "./commercialDemoContext.types";

export const commercialDemoContextCatalog = {
  version: COMMERCIAL_DEMO_CONTEXT_VERSION,
  readinessLevels: ["organized", "developing", "high-opportunity"] as CommercialReadinessLevel[],
  focusAreas: [
    "patient-follow-up",
    "appointment-management",
    "administrative-efficiency",
    "operational-visibility",
    "patient-experience",
    "team-coordination",
  ] as CommercialFocusArea[],
  journeys: [
    "lead-management",
    "patient-identity",
    "appointment-operations",
    "assistant-workspace",
    "operational-evidence",
  ] as DemoJourneyStep[],
} as const;

export const commercialDemoContextAllowedSources = [
  "growth-readiness-report",
  "direct-demo",
] as CommercialDemoSource[];

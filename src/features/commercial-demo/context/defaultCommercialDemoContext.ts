import type { CommercialDemoContext } from "./commercialDemoContext.types";

export const defaultCommercialDemoContext: CommercialDemoContext = {
  version: "1.0",
  readinessLevel: "developing",
  focusAreas: ["patient-follow-up", "appointment-management", "operational-visibility"],
  recommendedJourney: [
    "lead-management",
    "appointment-operations",
    "assistant-workspace",
    "operational-evidence",
  ],
  source: "direct-demo",
};

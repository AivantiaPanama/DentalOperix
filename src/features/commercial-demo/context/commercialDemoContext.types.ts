export const COMMERCIAL_DEMO_CONTEXT_VERSION = "1.0" as const;

export type CommercialReadinessLevel = "organized" | "developing" | "high-opportunity";
export type CommercialFocusArea =
  | "patient-follow-up"
  | "appointment-management"
  | "administrative-efficiency"
  | "operational-visibility"
  | "patient-experience"
  | "team-coordination";
export type DemoJourneyStep =
  | "lead-management"
  | "patient-identity"
  | "appointment-operations"
  | "assistant-workspace"
  | "operational-evidence";
export type CommercialDemoSource = "growth-readiness-report" | "direct-demo";

export interface CommercialDemoContext {
  version: typeof COMMERCIAL_DEMO_CONTEXT_VERSION;
  readinessLevel: CommercialReadinessLevel;
  focusAreas: CommercialFocusArea[];
  recommendedJourney: DemoJourneyStep[];
  source: CommercialDemoSource;
}

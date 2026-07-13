import { describe, expect, it } from "vitest";
import { defaultCommercialDemoContext } from "./defaultCommercialDemoContext";
import { parseCommercialDemoContext } from "./parseCommercialDemoContext";

describe("parseCommercialDemoContext", () => {
  it("parses a valid commercial demo context from URL params", () => {
    const params = new URLSearchParams(
      "v=1.0&level=high-opportunity&focus=patient-follow-up,appointment-management&journey=lead-management,appointment-operations,assistant-workspace&source=growth-readiness-report",
    );

    const context = parseCommercialDemoContext(params);

    expect(context).toEqual({
      version: "1.0",
      readinessLevel: "high-opportunity",
      focusAreas: ["patient-follow-up", "appointment-management"],
      recommendedJourney: ["lead-management", "appointment-operations", "assistant-workspace"],
      source: "growth-readiness-report",
    });
  });

  it("returns the default context when no params are provided", () => {
    const context = parseCommercialDemoContext(new URLSearchParams());

    expect(context).toEqual(defaultCommercialDemoContext);
  });

  it("filters unknown focus and journey values", () => {
    const params = new URLSearchParams(
      "v=1.0&level=unknown&focus=unknown,administrative-efficiency&journey=unknown,assistant-workspace&source=unknown",
    );

    const context = parseCommercialDemoContext(params);

    expect(context.readinessLevel).toBe(defaultCommercialDemoContext.readinessLevel);
    expect(context.focusAreas).toEqual(["administrative-efficiency"]);
    expect(context.recommendedJourney).toEqual(["assistant-workspace"]);
    expect(context.source).toBe(defaultCommercialDemoContext.source);
  });

  it("keeps partially valid lists and drops unsupported values", () => {
    const params = new URLSearchParams(
      "v=1.0&focus=patient-follow-up,appointment-management,unknown&journey=lead-management,assistant-workspace,unknown",
    );

    const context = parseCommercialDemoContext(params);

    expect(context.focusAreas).toEqual(["patient-follow-up", "appointment-management"]);
    expect(context.recommendedJourney).toEqual(["lead-management", "assistant-workspace"]);
  });

  it("preserves duplicate values in focus and journey lists", () => {
    const params = new URLSearchParams(
      "v=1.0&focus=patient-follow-up,patient-follow-up,appointment-management&journey=lead-management,lead-management,assistant-workspace&source=direct-demo",
    );

    const context = parseCommercialDemoContext(params);

    expect(context.focusAreas).toEqual([
      "patient-follow-up",
      "patient-follow-up",
      "appointment-management",
    ]);
    expect(context.recommendedJourney).toEqual([
      "lead-management",
      "lead-management",
      "assistant-workspace",
    ]);
  });

  it("falls back to default lists when focus or journey params are empty", () => {
    const params = new URLSearchParams("v=1.0&focus=&journey=&source=direct-demo");

    const context = parseCommercialDemoContext(params);

    expect(context.focusAreas).toEqual(defaultCommercialDemoContext.focusAreas);
    expect(context.recommendedJourney).toEqual(defaultCommercialDemoContext.recommendedJourney);
    expect(context.source).toBe("direct-demo");
  });

  it("falls back to the default context for incompatible versions", () => {
    const params = new URLSearchParams(
      "v=2.0&level=high-opportunity&focus=patient-experience&journey=patient-identity&source=growth-readiness-report",
    );

    const context = parseCommercialDemoContext(params);

    expect(context).toEqual(defaultCommercialDemoContext);
  });

  it("falls back to the default context for invalid sources", () => {
    const params = new URLSearchParams(
      "v=1.0&level=organized&focus=patient-follow-up&journey=lead-management&source=invalid-source",
    );

    const context = parseCommercialDemoContext(params);

    expect(context.source).toBe(defaultCommercialDemoContext.source);
  });
});

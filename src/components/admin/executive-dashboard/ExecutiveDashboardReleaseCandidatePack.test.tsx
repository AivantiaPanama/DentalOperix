import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  ExecutiveDashboardReleaseCandidateBoundary,
  assertExecutiveDashboardReleaseCandidatePack,
  createExecutiveDashboardReleaseCandidatePack,
  createExecutiveDashboardReleaseCandidatePackFromRuntime,
  getExecutiveDashboardReleaseCandidateSurface,
} from "./ExecutiveDashboardReleaseCandidatePack";
import { createExecutiveDashboardRuntimeWiringPackFromRuntime } from "./ExecutiveDashboardRuntimeWiringPack";

const principal = {
  id: "admin",
  permissions: ["executive-observability:read" as const],
};

const deniedPrincipal = {
  id: "assistant",
  permissions: ["reports:read" as const],
};

const viewModel = {
  surface: "executive" as const,
  state: "ready" as const,
  principal,
  widgets: [
    {
      widgetId: "platform-health-widget" as const,
      title: "Platform Health",
      metricCards: [{ label: "Estado", value: "Healthy" }],
    },
  ],
};

describe("19.0-19.2 Executive Dashboard Release Candidate Pack", () => {
  it("declares the full 15-scope release candidate block", () => {
    const runtimeWiring = createExecutiveDashboardRuntimeWiringPackFromRuntime({
      featureFlagEnabled: true,
      mode: "enabled",
      principal,
      responseKind: "metric-response",
      generatedAt: "2026-06-18T00:00:00.000Z",
    });

    const pack = createExecutiveDashboardReleaseCandidatePack({
      runtimeWiring,
      generatedAt: "2026-06-18T00:00:00.000Z",
    });

    assertExecutiveDashboardReleaseCandidatePack(pack);

    expect(pack.coveredScopes).toHaveLength(15);
    expect(pack.phase).toBe("19.0-19.2");
    expect(pack.status).toBe("approved-release-candidate");
    expect(pack.releaseCandidateDecision).toBe("approved-for-controlled-production-activation-review");
    expect(pack.nextPhase).toBe("19.3 Dashboard Production Activation Review");
  });

  it("consolidates only approved dashboard capabilities", () => {
    const pack = createExecutiveDashboardReleaseCandidatePackFromRuntime({
      featureFlagEnabled: true,
      mode: "enabled",
      principal,
      responseKind: "metric-response",
    });

    expect(pack.approvedCapabilities).toEqual([
      "runtime-wiring",
      "runtime-consumption",
      "controlled-activation",
      "production-readiness",
      "admin-route-candidate",
    ]);
    expect(pack.guardrails.newDomainCapabilityIncluded).toBe(false);
    expect(pack.guardrails.newDataSourceIncluded).toBe(false);
    expect(pack.guardrails.metricOnly).toBe(true);
    expect(pack.guardrails.readOnly).toBe(true);
    expect(pack.guardrails.featureFlagged).toBe(true);
    expect(pack.guardrails.permissionGated).toBe(true);
  });

  it("publishes a complete governance matrix without blockers", () => {
    const pack = createExecutiveDashboardReleaseCandidatePackFromRuntime({
      featureFlagEnabled: true,
      mode: "enabled",
      principal,
      responseKind: "metric-response",
    });

    expect(pack.governanceMatrix).toHaveLength(11);
    expect(pack.governanceMatrix.every((entry) => entry.decision === "pass")).toBe(true);
    expect(pack.governanceMatrix.map((entry) => entry.rule)).toEqual([
      "metric-only",
      "read-only",
      "feature-flagged",
      "permission-gated",
      "no-direct-internal-access",
      "no-client-fallback",
      "no-route-mutation",
      "no-login-mutation",
      "no-api-mutation",
      "source-of-truth-preserved",
      "platform-freeze-preserved",
    ]);
  });

  it("preserves release candidate surface bindings for all dashboard surfaces", () => {
    const pack = createExecutiveDashboardReleaseCandidatePackFromRuntime({
      featureFlagEnabled: true,
      mode: "enabled",
      principal,
      responseKind: "metric-response",
    });

    expect(pack.surfaces).toHaveLength(3);
    for (const surface of pack.surfaces) {
      expect(surface.releaseCandidate).toBe(true);
      expect(surface.capability).toBe("dashboard-runtime-view");
      expect(surface.exposure).toBe("metric-only");
      expect(surface.readOnly).toBe(true);
      expect(surface.permissionGated).toBe(true);
      expect(surface.featureFlagged).toBe(true);
      expect(surface.renderState).toBe("ready");
      expect(surface.rendersMetrics).toBe(true);
    }

    const executive = getExecutiveDashboardReleaseCandidateSurface("executive", pack);
    expect(executive.surface).toBe("executive");
    expect(executive.binding.allowedContract).toBe("ExecutiveDashboardApiContracts");
  });

  it("preserves forbidden state when permission is missing", () => {
    const pack = createExecutiveDashboardReleaseCandidatePackFromRuntime({
      featureFlagEnabled: true,
      mode: "enabled",
      principal: deniedPrincipal,
      responseKind: "metric-response",
    });

    const executive = getExecutiveDashboardReleaseCandidateSurface("executive", pack);
    expect(executive.renderState).toBe("forbidden");
    expect(executive.rendersMetrics).toBe(false);
    expect(executive.rendersRestrictedState).toBe(true);
  });

  it("renders the release candidate through runtime wiring when ready", () => {
    const html = renderToStaticMarkup(
      <ExecutiveDashboardReleaseCandidateBoundary
        featureFlagEnabled={true}
        mode="enabled"
        principal={principal}
        viewModel={viewModel}
        responseKind="metric-response"
      />,
    );

    expect(html).toContain("data-release-candidate-pack=\"executive-dashboard-release-candidate-pack/v1\"");
    expect(html).toContain("data-release-candidate-phase=\"19.0-19.2\"");
    expect(html).toContain("data-render-state=\"ready\"");
    expect(html).toContain("data-release-candidate=\"true\"");
    expect(html).toContain("data-runtime-wiring-pack=\"executive-dashboard-runtime-wiring-pack/v1\"");
    expect(html).toContain("data-client-fallback=\"false\"");
    expect(html).toContain("data-route-mutation=\"false\"");
    expect(html).toContain("data-login-mutation=\"false\"");
    expect(html).toContain("Platform Health");
  });

  it("renders non-ready states without exposing metrics", () => {
    for (const [responseKind, renderState] of [
      ["pending", "loading"],
      ["empty-response", "empty"],
      ["sanitized-error", "error"],
    ] as const) {
      const html = renderToStaticMarkup(
        <ExecutiveDashboardReleaseCandidateBoundary
          featureFlagEnabled={true}
          mode="enabled"
          principal={principal}
          viewModel={viewModel}
          responseKind={responseKind}
        />,
      );

      expect(html).toContain(`data-render-state=\"${renderState}\"`);
      expect(html).toContain("data-renders-metrics=\"false\"");
      expect(html).not.toContain("Platform Health");
    }
  });

  it("does not reference restricted internals, route mutation, login mutation or raw event names", () => {
    const source = readFileSync(fileURLToPath(import.meta.resolve("./ExecutiveDashboardReleaseCandidatePack.tsx")), "utf8");

    expect(source).not.toContain("ReadTelemetryEvent");
    expect(source).not.toContain("FallbackTelemetryEvent");
    expect(source).not.toContain("AggregateTelemetryEvent");
    expect(source).not.toContain("DomainTelemetryEvent");
    expect(source).not.toContain("ReadAdapter");
    expect(source).not.toContain("ReadModelSourceProvider");
    expect(source).not.toContain("processDentalLead");
    expect(source).not.toContain("BookingDialog");
    expect(source).not.toContain("FloatingDentalAIChat");
    expect(source).not.toContain("siteServices");
    expect(source).not.toContain("/api/leads/create");
    expect(source).not.toContain("createRoute");
    expect(source).not.toContain("/admin/login");
  });
});

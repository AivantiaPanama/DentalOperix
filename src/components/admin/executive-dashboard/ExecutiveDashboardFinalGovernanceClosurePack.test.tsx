import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  ExecutiveDashboardFinalGovernanceClosureBoundary,
  assertExecutiveDashboardFinalGovernanceClosurePack,
  createExecutiveDashboardFinalGovernanceClosurePack,
  createExecutiveDashboardFinalGovernanceClosurePackFromRuntime,
  getExecutiveDashboardFinalGovernanceClosureSurface,
} from "./ExecutiveDashboardFinalGovernanceClosurePack";
import { createExecutiveDashboardReleaseCandidatePackFromRuntime } from "./ExecutiveDashboardReleaseCandidatePack";

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

describe("19.3-19.5 Executive Dashboard Final Governance Closure Pack", () => {
  it("declares the full 16-scope final governance closure block", () => {
    const releaseCandidate = createExecutiveDashboardReleaseCandidatePackFromRuntime({
      featureFlagEnabled: true,
      mode: "enabled",
      principal,
      responseKind: "metric-response",
      generatedAt: "2026-06-18T00:00:00.000Z",
    });

    const pack = createExecutiveDashboardFinalGovernanceClosurePack({
      releaseCandidate,
      generatedAt: "2026-06-18T00:00:00.000Z",
    });

    assertExecutiveDashboardFinalGovernanceClosurePack(pack);

    expect(pack.coveredScopes).toHaveLength(16);
    expect(pack.phase).toBe("19.3-19.5");
    expect(pack.status).toBe("final-governance-closure-approved");
    expect(pack.finalDecision).toBe("closed-as-production-activation-candidate");
    expect(pack.nextPhase).toBe("20.0 Controlled Production Activation Approval");
  });

  it("preserves the release candidate baseline without adding new capabilities", () => {
    const pack = createExecutiveDashboardFinalGovernanceClosurePackFromRuntime({
      featureFlagEnabled: true,
      mode: "enabled",
      principal,
      responseKind: "metric-response",
    });

    expect(pack.releaseCandidateStatus).toBe("approved-release-candidate");
    expect(pack.guardrails.releaseCandidateBaselineIncluded).toBe(true);
    expect(pack.guardrails.newDashboardCapabilityIncluded).toBe(false);
    expect(pack.guardrails.newDomainCapabilityIncluded).toBe(false);
    expect(pack.guardrails.newDataSourceIncluded).toBe(false);
    expect(pack.guardrails.metricOnly).toBe(true);
    expect(pack.guardrails.readOnly).toBe(true);
    expect(pack.guardrails.featureFlagged).toBe(true);
    expect(pack.guardrails.permissionGated).toBe(true);
  });

  it("publishes the final compliance matrix without blockers", () => {
    const pack = createExecutiveDashboardFinalGovernanceClosurePackFromRuntime({
      featureFlagEnabled: true,
      mode: "enabled",
      principal,
      responseKind: "metric-response",
    });

    expect(pack.complianceMatrix).toHaveLength(15);
    expect(pack.complianceMatrix.every((entry) => entry.decision === "pass")).toBe(true);
    expect(pack.complianceMatrix.map((entry) => entry.rule)).toEqual([
      "release-candidate-preserved",
      "metric-only",
      "read-only",
      "feature-flagged",
      "permission-gated",
      "no-direct-internal-access",
      "no-client-fallback",
      "no-route-mutation",
      "no-login-mutation",
      "no-api-mutation",
      "no-write-path",
      "source-of-truth-preserved",
      "platform-freeze-preserved",
      "aggregate-isolation-preserved",
      "domain-ownership-preserved",
    ]);
  });

  it("closes all dashboard surfaces as production activation candidates", () => {
    const pack = createExecutiveDashboardFinalGovernanceClosurePackFromRuntime({
      featureFlagEnabled: true,
      mode: "enabled",
      principal,
      responseKind: "metric-response",
    });

    expect(pack.surfaces).toHaveLength(3);
    for (const surface of pack.surfaces) {
      expect(surface.finalClosure).toBe(true);
      expect(surface.baseline).toBe("production-activation-candidate");
      expect(surface.exposure).toBe("metric-only");
      expect(surface.readOnly).toBe(true);
      expect(surface.permissionGated).toBe(true);
      expect(surface.featureFlagged).toBe(true);
      expect(surface.aggregateIsolationPreserved).toBe(true);
      expect(surface.domainOwnershipPreserved).toBe(true);
      expect(surface.renderState).toBe("ready");
      expect(surface.rendersMetrics).toBe(true);
    }

    const executive = getExecutiveDashboardFinalGovernanceClosureSurface("executive", pack);
    expect(executive.surface).toBe("executive");
    expect(executive.releaseCandidateSurface.binding.allowedContract).toBe(
      "ExecutiveDashboardApiContracts",
    );
  });

  it("preserves restricted state when permission is missing", () => {
    const pack = createExecutiveDashboardFinalGovernanceClosurePackFromRuntime({
      featureFlagEnabled: true,
      mode: "enabled",
      principal: deniedPrincipal,
      responseKind: "metric-response",
    });

    const executive = getExecutiveDashboardFinalGovernanceClosureSurface("executive", pack);
    expect(executive.renderState).toBe("forbidden");
    expect(executive.rendersMetrics).toBe(false);
    expect(executive.rendersRestrictedState).toBe(true);
  });

  it("renders final closure through the release candidate when ready", () => {
    const html = renderToStaticMarkup(
      <ExecutiveDashboardFinalGovernanceClosureBoundary
        featureFlagEnabled={true}
        mode="enabled"
        principal={principal}
        viewModel={viewModel}
        responseKind="metric-response"
      />,
    );

    expect(html).toContain(
      'data-final-governance-closure-pack="executive-dashboard-final-governance-closure-pack/v1"',
    );
    expect(html).toContain('data-final-governance-closure-phase="19.3-19.5"');
    expect(html).toContain('data-render-state="ready"');
    expect(html).toContain('data-final-closure="true"');
    expect(html).toContain(
      'data-release-candidate-pack="executive-dashboard-release-candidate-pack/v1"',
    );
    expect(html).toContain('data-client-fallback="false"');
    expect(html).toContain('data-write-path="false"');
    expect(html).toContain("Platform Health");
  });

  it("renders non-ready states without exposing metrics", () => {
    for (const [responseKind, renderState] of [
      ["pending", "loading"],
      ["empty-response", "empty"],
      ["sanitized-error", "error"],
    ] as const) {
      const html = renderToStaticMarkup(
        <ExecutiveDashboardFinalGovernanceClosureBoundary
          featureFlagEnabled={true}
          mode="enabled"
          principal={principal}
          viewModel={viewModel}
          responseKind={responseKind}
        />,
      );

      expect(html).toContain(`data-render-state="${renderState}"`);
      expect(html).toContain('data-renders-metrics="false"');
      expect(html).not.toContain("Platform Health");
    }
  });

  it("does not reference restricted internals, route mutation, login mutation or raw event names", () => {
    const source = readFileSync(
      fileURLToPath(import.meta.resolve("./ExecutiveDashboardFinalGovernanceClosurePack.tsx")),
      "utf8",
    );

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

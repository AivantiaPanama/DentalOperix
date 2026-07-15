import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  ExecutiveDashboardProductionReadinessBoundary,
  assertExecutiveDashboardProductionReadinessPack,
  createExecutiveDashboardProductionReadinessPack,
  getExecutiveDashboardProductionReleaseCandidates,
} from "./ExecutiveDashboardProductionReadinessPack";

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

describe("17.8-18.0 Executive Dashboard Production Readiness Pack", () => {
  it("declares the full 30-scope production readiness block", () => {
    const pack = createExecutiveDashboardProductionReadinessPack(
      undefined,
      "2026-06-18T00:00:00.000Z",
    );

    assertExecutiveDashboardProductionReadinessPack(pack);

    expect(pack.coveredScopes).toHaveLength(30);
    expect(pack.phase).toBe("17.8-18.0");
    expect(pack.status).toBe("approved-production-readiness-candidate");
    expect(pack.finalResult).toBe("approved-for-controlled-production-readiness-review");
    expect(pack.nextPhase).toBe("18.1 Controlled Dashboard Route Enablement Review");
  });

  it("hardens production activation as feature-flagged, permission-gated, metric-only and read-only", () => {
    const { hardening } = createExecutiveDashboardProductionReadinessPack();

    expect(hardening.featureFlagRequired).toBe("EXECUTIVE_DASHBOARD_UI_ENABLED");
    expect(hardening.defaultEnabled).toBe(false);
    expect(hardening.requiredPermission).toBe("executive-observability:read");
    expect(hardening.allowedRenderStates).toEqual([
      "loading",
      "ready",
      "empty",
      "error",
      "forbidden",
    ]);
    expect(hardening.exposure).toBe("metric-only");
    expect(hardening.readOnly).toBe(true);
    expect(hardening.metricOnly).toBe(true);
    expect(hardening.clientFallbackAllowed).toBe(false);
    expect(hardening.rawTelemetryAllowed).toBe(false);
    expect(hardening.aggregateAccessAllowed).toBe(false);
    expect(hardening.adapterAccessAllowed).toBe(false);
    expect(hardening.readSourceAccessAllowed).toBe(false);
    expect(hardening.readModelDirectAccessAllowed).toBe(false);
    expect(hardening.writePathAllowed).toBe(false);
  });

  it("freezes all three admin dashboard release candidates as candidate-only", () => {
    const candidates = getExecutiveDashboardProductionReleaseCandidates();

    expect(candidates.map((candidate) => candidate.candidatePath)).toEqual([
      "/admin/dashboard/executive",
      "/admin/dashboard/operational",
      "/admin/dashboard/governance",
    ]);

    for (const candidate of candidates) {
      expect(candidate.releaseState).toBe("release-candidate");
      expect(candidate.routeImplementationStatus).toBe("candidate-only");
      expect(candidate.navigationRegistrationStatus).toBe("candidate-only");
      expect(candidate.adminLoginMutationAllowed).toBe(false);
      expect(candidate.apiMutationAllowed).toBe(false);
      expect(candidate.requiredPermission).toBe("executive-observability:read");
      expect(candidate.featureFlagRequired).toBe("EXECUTIVE_DASHBOARD_UI_ENABLED");
      expect(candidate.exposure).toBe("metric-only");
      expect(candidate.readOnly).toBe(true);
    }
  });

  it("preserves the 18.0 governance baseline", () => {
    const { baseline, guardrails } = createExecutiveDashboardProductionReadinessPack();

    expect(baseline.adr015ReadModelGovernanceCompliant).toBe(true);
    expect(baseline.adr016DomainBoundariesCompliant).toBe(true);
    expect(baseline.adr017FallbackPolicyCompliant).toBe(true);
    expect(baseline.adr018ObservabilityFoundationCompliant).toBe(true);
    expect(baseline.adr024ExecutiveObservabilityCompliant).toBe(true);
    expect(baseline.aggregateIsolationPreserved).toBe(true);
    expect(baseline.domainOwnershipPreserved).toBe(true);
    expect(baseline.leadsSourceOfTruthPreserved).toBe(true);
    expect(baseline.readModelPlatformV2ClosedFrozenPreserved).toBe(true);
    expect(baseline.metricOnlyResponsesPreserved).toBe(true);
    expect(baseline.rawTelemetryExposurePrevented).toBe(true);
    expect(baseline.aggregateAccessPrevented).toBe(true);
    expect(baseline.adapterAccessPrevented).toBe(true);
    expect(baseline.clientFallbackPrevented).toBe(true);
    expect(guardrails.metricOnly).toBe(true);
    expect(guardrails.readOnly).toBe(true);
    expect(guardrails.loginModificationIncluded).toBe(false);
    expect(guardrails.apiImplementationIncluded).toBe(false);
    expect(guardrails.fetchImplementationIncluded).toBe(false);
    expect(guardrails.routeTreeMutationIncluded).toBe(false);
  });

  it("renders through the admin integration boundary without implementing routes, login or API", () => {
    const html = renderToStaticMarkup(
      <ExecutiveDashboardProductionReadinessBoundary
        mode="enabled"
        principal={principal}
        viewModel={viewModel}
      />,
    );

    expect(html).toContain(
      'data-production-readiness-pack="executive-dashboard-production-readiness-pack/v1"',
    );
    expect(html).toContain('data-production-phase="17.8-18.0"');
    expect(html).toContain('data-production-path="/admin/dashboard/executive"');
    expect(html).toContain('data-release-state="release-candidate"');
    expect(html).toContain('data-feature-flag="EXECUTIVE_DASHBOARD_UI_ENABLED"');
    expect(html).toContain('data-permission="executive-observability:read"');
    expect(html).toContain('data-exposure="metric-only"');
    expect(html).toContain('data-route-implementation="candidate-only"');
    expect(html).toContain('data-login-mutation="false"');
    expect(html).toContain('data-api-mutation="false"');
    expect(html).toContain("Platform Health");
  });

  it("preserves forbidden render-state semantics through production readiness", () => {
    const html = renderToStaticMarkup(
      <ExecutiveDashboardProductionReadinessBoundary
        mode="enabled"
        principal={deniedPrincipal}
        viewModel={{ ...viewModel, principal: deniedPrincipal }}
      />,
    );

    expect(html).toContain('data-render-state="forbidden"');
    expect(html).not.toContain("Platform Health");
  });

  it("does not reference raw telemetry, adapters, route tree mutation, login mutation or restricted files", () => {
    const source = readFileSync(
      fileURLToPath(import.meta.resolve("./ExecutiveDashboardProductionReadinessPack.tsx")),
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
  });
});

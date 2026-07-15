import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  ExecutiveDashboardAdminMountAdapter,
  assertExecutiveDashboardAdminRouteIntegrationPack,
  createExecutiveDashboardAdminRouteIntegrationPack,
  getExecutiveDashboardAdminNavigationCandidates,
  getExecutiveDashboardAdminSurfaceContract,
} from "./ExecutiveDashboardAdminRouteIntegrationPack";

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

describe("17.7 Executive Dashboard Admin Route Integration Pack", () => {
  it("declares the full A/J admin route integration scope without login, route tree, API, fetch or write mutations", () => {
    const pack = createExecutiveDashboardAdminRouteIntegrationPack(
      undefined,
      "2026-06-18T00:00:00.000Z",
    );

    assertExecutiveDashboardAdminRouteIntegrationPack(pack);

    expect(pack.coveredScopes).toHaveLength(10);
    expect(pack.guardrails.adminRouteCandidateContractIncluded).toBe(true);
    expect(pack.guardrails.adminDashboardMountAdapterIncluded).toBe(true);
    expect(pack.guardrails.featureFlagGateIncluded).toBe(true);
    expect(pack.guardrails.permissionGuardBindingIncluded).toBe(true);
    expect(pack.guardrails.dashboardAdminSurfaceContractIncluded).toBe(true);
    expect(pack.guardrails.navigationRegistrationCandidateIncluded).toBe(true);
    expect(pack.guardrails.adminLoginModificationIncluded).toBe(false);
    expect(pack.guardrails.adminLoginMutationAllowed).toBe(false);
    expect(pack.guardrails.existingRouteMutationAllowed).toBe(false);
    expect(pack.guardrails.routeTreeMutationAllowed).toBe(false);
    expect(pack.guardrails.apiRouteMutationAllowed).toBe(false);
    expect(pack.guardrails.routeImplementationIncluded).toBe(false);
    expect(pack.guardrails.apiImplementationIncluded).toBe(false);
    expect(pack.guardrails.fetchImplementationIncluded).toBe(false);
    expect(pack.guardrails.clientSideFallbackIncluded).toBe(false);
    expect(pack.guardrails.writePathIncluded).toBe(false);
    expect(pack.guardrails.rawTelemetryExposure).toBe(false);
    expect(pack.guardrails.aggregateAccess).toBe(false);
    expect(pack.guardrails.adapterAccess).toBe(false);
    expect(pack.guardrails.leadsSourceOfTruthPreserved).toBe(true);
    expect(pack.guardrails.readModelPlatformV2ClosedFrozenPreserved).toBe(true);
  });

  it("keeps admin route candidates inherited from activation as candidate-only metric-only routes", () => {
    const pack = createExecutiveDashboardAdminRouteIntegrationPack();

    expect(pack.routeCandidates.map((route) => route.candidatePath)).toEqual([
      "/admin/dashboard/executive",
      "/admin/dashboard/operational",
      "/admin/dashboard/governance",
    ]);

    for (const route of pack.routeCandidates) {
      expect(route.routeImplementationIncluded).toBe(false);
      expect(route.modifiesAdminLogin).toBe(false);
      expect(route.modifiesExistingRoutes).toBe(false);
      expect(route.exposure).toBe("metric-only");
      expect(route.apiRoute).toContain("/api/internal/executive-observability/");
    }
  });

  it("creates navigation registration candidates without mutating existing navigation", () => {
    const navigation = getExecutiveDashboardAdminNavigationCandidates();

    expect(navigation.map((item) => item.label)).toEqual([
      "Executive",
      "Operational",
      "Governance",
    ]);
    for (const item of navigation) {
      expect(item.parentSurface).toBe("admin-dashboard");
      expect(item.registrationStatus).toBe("candidate-only");
      expect(item.requiresFeatureFlag).toBe("EXECUTIVE_DASHBOARD_UI_ENABLED");
      expect(item.requiresPermission).toBe("executive-observability:read");
      expect(item.exposure).toBe("metric-only");
      expect(item.modifiesExistingNavigation).toBe(false);
    }
  });

  it("exposes admin surface contracts that are read-only, permission gated and candidate-only", () => {
    const contract = getExecutiveDashboardAdminSurfaceContract("governance");

    expect(contract.candidatePath).toBe("/admin/dashboard/governance");
    expect(contract.activationBoundary).toBe("ExecutiveDashboardActivationBoundary");
    expect(contract.routeImplementationStatus).toBe("candidate-only");
    expect(contract.readOnly).toBe(true);
    expect(contract.metricOnly).toBe(true);
    expect(contract.featureFlagRequired).toBe(true);
    expect(contract.permissionRequired).toBe("executive-observability:read");
    expect(contract.adminLoginMutationAllowed).toBe(false);
    expect(contract.apiMutationAllowed).toBe(false);
  });

  it("mounts through the activation boundary using feature flag and permission metadata", () => {
    const html = renderToStaticMarkup(
      <ExecutiveDashboardAdminMountAdapter
        mode="enabled"
        principal={principal}
        viewModel={viewModel}
      />,
    );

    expect(html).toContain('data-admin-dashboard-surface="executive"');
    expect(html).toContain('data-admin-dashboard-path="/admin/dashboard/executive"');
    expect(html).toContain('data-admin-dashboard-registration="candidate-only"');
    expect(html).toContain('data-feature-flag="EXECUTIVE_DASHBOARD_UI_ENABLED"');
    expect(html).toContain('data-permission="executive-observability:read"');
    expect(html).toContain('data-exposure="metric-only"');
    expect(html).toContain("Platform Health");
  });

  it("preserves forbidden rendering when permission is missing", () => {
    const html = renderToStaticMarkup(
      <ExecutiveDashboardAdminMountAdapter
        mode="enabled"
        principal={deniedPrincipal}
        viewModel={{ ...viewModel, principal: deniedPrincipal }}
      />,
    );

    expect(html).toContain('data-render-state="forbidden"');
    expect(html).not.toContain("Platform Health");
  });

  it("does not reference raw telemetry, aggregates, adapters, route implementations, login mutation or restricted files", () => {
    const source = readFileSync(
      fileURLToPath(import.meta.resolve("./ExecutiveDashboardAdminRouteIntegrationPack.tsx")),
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

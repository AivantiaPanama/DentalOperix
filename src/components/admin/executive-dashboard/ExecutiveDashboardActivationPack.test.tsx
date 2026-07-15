import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  ExecutiveDashboardActivationBoundary,
  assertExecutiveDashboardActivationPack,
  canMountExecutiveDashboardSurface,
  createExecutiveDashboardActivationPack,
  getExecutiveDashboardActivationPermission,
  isExecutiveDashboardActivationEnabled,
} from "./ExecutiveDashboardActivationPack";

const principal = {
  id: "admin",
  permissions: ["executive-observability:read" as const],
};

const deniedPrincipal = {
  id: "assistant",
  permissions: ["reports:read" as const],
};

describe("17.6 Executive Dashboard Activation Pack", () => {
  it("declares the full A/J activation scope without routes, login, API, fetch, fallback or writes", () => {
    const pack = createExecutiveDashboardActivationPack(
      undefined,
      undefined,
      "2026-06-18T00:00:00.000Z",
    );

    assertExecutiveDashboardActivationPack(pack);

    expect(pack.coveredScopes).toHaveLength(10);
    expect(pack.guardrails.activationBoundaryIncluded).toBe(true);
    expect(pack.guardrails.routeCandidateModelIncluded).toBe(true);
    expect(pack.guardrails.mountContractIncluded).toBe(true);
    expect(pack.guardrails.featureFlagContractIncluded).toBe(true);
    expect(pack.guardrails.routeImplementationIncluded).toBe(false);
    expect(pack.guardrails.adminLoginModificationIncluded).toBe(false);
    expect(pack.guardrails.existingRouteModificationIncluded).toBe(false);
    expect(pack.guardrails.apiImplementationIncluded).toBe(false);
    expect(pack.guardrails.fetchImplementationIncluded).toBe(false);
    expect(pack.guardrails.clientSideFallbackIncluded).toBe(false);
    expect(pack.guardrails.writePathIncluded).toBe(false);
    expect(pack.guardrails.aggregateAccess).toBe(false);
    expect(pack.guardrails.adapterAccess).toBe(false);
    expect(pack.guardrails.rawTelemetryExposure).toBe(false);
    expect(pack.guardrails.leadsSourceOfTruthPreserved).toBe(true);
    expect(pack.guardrails.readModelPlatformV2ClosedFrozenPreserved).toBe(true);
  });

  it("keeps activation behind an explicit feature flag and permission", () => {
    const pack = createExecutiveDashboardActivationPack();

    expect(pack.featureFlag.key).toBe("EXECUTIVE_DASHBOARD_UI_ENABLED");
    expect(pack.featureFlag.defaultMode).toBe("disabled");
    expect(pack.featureFlag.allowedModes).toEqual(["disabled", "preview", "enabled"]);
    expect(pack.featureFlag.requiresPermission).toBe("executive-observability:read");
    expect(pack.featureFlag.mayBypassPermission).toBe(false);
    expect(pack.featureFlag.mayEnableWrites).toBe(false);
    expect(pack.featureFlag.mayEnableClientFallback).toBe(false);
    expect(getExecutiveDashboardActivationPermission()).toBe("executive-observability:read");
  });

  it("defines route candidates without implementing routes or modifying admin login", () => {
    const pack = createExecutiveDashboardActivationPack();

    expect(pack.routeCandidates).toHaveLength(3);
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

  it("allows mount only when feature mode is active and executive-observability:read is present", () => {
    const pack = createExecutiveDashboardActivationPack();

    expect(isExecutiveDashboardActivationEnabled("disabled")).toBe(false);
    expect(isExecutiveDashboardActivationEnabled("preview")).toBe(true);
    expect(isExecutiveDashboardActivationEnabled("enabled")).toBe(true);
    expect(canMountExecutiveDashboardSurface(pack, principal, "executive", "disabled")).toBe(false);
    expect(canMountExecutiveDashboardSurface(pack, principal, "executive", "preview")).toBe(true);
    expect(canMountExecutiveDashboardSurface(pack, deniedPrincipal, "executive", "enabled")).toBe(
      false,
    );
  });

  it("renders empty while disabled, forbidden when denied, and mounts presentational dashboard when allowed", () => {
    const readyViewModel = {
      surface: "executive" as const,
      principal,
      state: "ready" as const,
      widgets: [
        {
          widgetId: "platform-health-widget" as const,
          title: "Platform Health",
          metricCards: [{ label: "Estado", value: "Healthy" }],
        },
      ],
    };

    const disabled = renderToStaticMarkup(
      <ExecutiveDashboardActivationBoundary
        mode="disabled"
        principal={principal}
        viewModel={readyViewModel}
      />,
    );
    const forbidden = renderToStaticMarkup(
      <ExecutiveDashboardActivationBoundary
        mode="enabled"
        principal={deniedPrincipal}
        viewModel={{ ...readyViewModel, principal: deniedPrincipal }}
      />,
    );
    const allowed = renderToStaticMarkup(
      <ExecutiveDashboardActivationBoundary
        mode="enabled"
        principal={principal}
        viewModel={readyViewModel}
      />,
    );

    expect(disabled).toContain("Sin métricas ejecutivas disponibles");
    expect(forbidden).toContain("Acceso restringido a observabilidad ejecutiva");
    expect(allowed).toContain("Executive Dashboard");
    expect(allowed).toContain("Platform Health");
    expect(allowed).toContain('data-exposure="metric-only"');
  });

  it("does not import or reference forbidden implementation dependencies", () => {
    const source = readFileSync(
      fileURLToPath(new URL("./ExecutiveDashboardActivationPack.tsx", import.meta.url)),
      "utf8",
    );

    expect(source).not.toMatch(/from ["']@\/server\/read-models\/.*adapter/i);
    expect(source).not.toMatch(/from ["']@\/server\/read-models\/.*aggregate/i);
    expect(source).not.toContain("ReadTelemetryEvent");
    expect(source).not.toContain("FallbackTelemetryEvent");
    expect(source).not.toContain("AggregateTelemetryEvent");
    expect(source).not.toContain("DomainTelemetryEvent");
    expect(source).not.toContain("fetch(");
    expect(source).not.toContain("localStorage");
    expect(source).not.toContain("sessionStorage");
    expect(source).not.toContain("/admin/login");
  });
});

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  ExecutiveDashboardControlledActivationBoundary,
  assertExecutiveDashboardControlledActivationPack,
  createExecutiveDashboardControlledActivationPack,
  getExecutiveDashboardControlledAccessDecision,
  getExecutiveDashboardControlledAdminNavigationEntries,
  resolveExecutiveDashboardRuntimeFeatureFlag,
} from "./ExecutiveDashboardControlledActivationPack";

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

describe("18.1-18.3 Executive Dashboard Controlled Activation Pack", () => {
  it("declares the full 15-scope controlled activation block", () => {
    const pack = createExecutiveDashboardControlledActivationPack({
      featureFlagEnabled: true,
      principal,
      generatedAt: "2026-06-18T00:00:00.000Z",
    });

    assertExecutiveDashboardControlledActivationPack(pack);

    expect(pack.coveredScopes).toHaveLength(15);
    expect(pack.phase).toBe("18.1-18.3");
    expect(pack.status).toBe("approved-controlled-activation-candidate");
    expect(pack.finalResult).toBe("approved-for-controlled-admin-dashboard-activation");
    expect(pack.nextPhase).toBe("18.4-18.6 Dashboard Runtime Data Binding Review");
  });

  it("resolves the runtime feature flag as disabled by default without exposing secrets or writes", () => {
    const disabled = resolveExecutiveDashboardRuntimeFeatureFlag(false);
    const enabled = resolveExecutiveDashboardRuntimeFeatureFlag(true);

    expect(disabled.name).toBe("EXECUTIVE_DASHBOARD_UI_ENABLED");
    expect(disabled.value).toBe("disabled");
    expect(disabled.defaultValue).toBe("disabled");
    expect(disabled.source).toBe("runtime-configuration");
    expect(disabled.exposesSecret).toBe(false);
    expect(disabled.enablesWritePath).toBe(false);
    expect(enabled.value).toBe("enabled");
  });

  it("hides admin navigation when the feature flag is disabled", () => {
    const pack = createExecutiveDashboardControlledActivationPack({
      featureFlagEnabled: false,
      principal,
    });
    const entries = getExecutiveDashboardControlledAdminNavigationEntries(pack);

    expect(entries).toHaveLength(3);
    expect(entries.map((entry) => entry.href)).toEqual([
      "/admin/dashboard/executive",
      "/admin/dashboard/operational",
      "/admin/dashboard/governance",
    ]);

    for (const entry of entries) {
      expect(entry.visible).toBe(false);
      expect(entry.reason).toBe("feature-flag-disabled");
      expect(entry.registrationStatus).toBe("controlled-candidate");
      expect(entry.requiresFeatureFlag).toBe("EXECUTIVE_DASHBOARD_UI_ENABLED");
      expect(entry.requiresPermission).toBe("executive-observability:read");
      expect(entry.mutatesExistingNavigation).toBe(false);
      expect(entry.mutatesAdminLogin).toBe(false);
      expect(entry.exposure).toBe("metric-only");
      expect(entry.readOnly).toBe(true);
    }
  });

  it("exposes admin navigation only when flag and permission are both present", () => {
    const allowed = createExecutiveDashboardControlledActivationPack({
      featureFlagEnabled: true,
      principal,
    });
    const denied = createExecutiveDashboardControlledActivationPack({
      featureFlagEnabled: true,
      principal: deniedPrincipal,
    });

    expect(
      getExecutiveDashboardControlledAdminNavigationEntries(allowed).every(
        (entry) => entry.visible,
      ),
    ).toBe(true);
    expect(
      getExecutiveDashboardControlledAdminNavigationEntries(allowed).every(
        (entry) => entry.reason === "available",
      ),
    ).toBe(true);
    expect(
      getExecutiveDashboardControlledAdminNavigationEntries(denied).every((entry) => entry.visible),
    ).toBe(false);
    expect(
      getExecutiveDashboardControlledAdminNavigationEntries(denied).every(
        (entry) => entry.reason === "permission-missing",
      ),
    ).toBe(true);
  });

  it("keeps controlled access read-only, metric-only and forbidden when permission is missing", () => {
    const pack = createExecutiveDashboardControlledActivationPack({
      featureFlagEnabled: true,
      principal: deniedPrincipal,
    });
    const decision = getExecutiveDashboardControlledAccessDecision("executive", pack);

    expect(decision.allowed).toBe(false);
    expect(decision.renderState).toBe("forbidden");
    expect(decision.reason).toBe("permission-missing");
    expect(decision.requiredPermission).toBe("executive-observability:read");
    expect(decision.exposure).toBe("metric-only");
    expect(decision.readOnly).toBe(true);
    expect(decision.metricOnly).toBe(true);
    expect(decision.clientFallbackAllowed).toBe(false);
    expect(decision.rawTelemetryAllowed).toBe(false);
    expect(decision.aggregateAccessAllowed).toBe(false);
    expect(decision.adapterAccessAllowed).toBe(false);
    expect(decision.readSourceAccessAllowed).toBe(false);
    expect(decision.readModelDirectAccessAllowed).toBe(false);
    expect(decision.writePathAllowed).toBe(false);
  });

  it("renders a controlled forbidden state without exposing dashboard metrics", () => {
    const html = renderToStaticMarkup(
      <ExecutiveDashboardControlledActivationBoundary
        featureFlagEnabled={false}
        mode="enabled"
        principal={principal}
        viewModel={viewModel}
      />,
    );

    expect(html).toContain(
      'data-controlled-activation-pack="executive-dashboard-controlled-activation-pack/v1"',
    );
    expect(html).toContain('data-feature-flag="EXECUTIVE_DASHBOARD_UI_ENABLED"');
    expect(html).toContain('data-feature-flag-value="disabled"');
    expect(html).toContain('data-access-allowed="false"');
    expect(html).toContain('data-render-state="forbidden"');
    expect(html).toContain('data-access-reason="feature-flag-disabled"');
    expect(html).not.toContain("Platform Health");
  });

  it("renders through production readiness when flag and permission allow access", () => {
    const html = renderToStaticMarkup(
      <ExecutiveDashboardControlledActivationBoundary
        featureFlagEnabled={true}
        mode="enabled"
        principal={principal}
        viewModel={viewModel}
      />,
    );

    expect(html).toContain('data-access-allowed="true"');
    expect(html).toContain('data-render-state="ready"');
    expect(html).toContain(
      'data-production-readiness-pack="executive-dashboard-production-readiness-pack/v1"',
    );
    expect(html).toContain('data-exposure="metric-only"');
    expect(html).toContain('data-read-only="true"');
    expect(html).toContain("Platform Health");
  });

  it("does not reference raw telemetry, adapters, route mutation, login mutation or restricted files", () => {
    const source = readFileSync(
      fileURLToPath(import.meta.resolve("./ExecutiveDashboardControlledActivationPack.tsx")),
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

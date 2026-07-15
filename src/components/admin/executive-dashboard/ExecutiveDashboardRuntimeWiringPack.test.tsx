import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  ExecutiveDashboardRuntimeWiringBoundary,
  assertExecutiveDashboardRuntimeWiringPack,
  createExecutiveDashboardRuntimeWiringPack,
  createExecutiveDashboardRuntimeWiringPackFromRuntime,
  getExecutiveDashboardRuntimeWiringViewBinding,
} from "./ExecutiveDashboardRuntimeWiringPack";
import { createExecutiveDashboardControlledActivationPack } from "./ExecutiveDashboardControlledActivationPack";
import { createExecutiveDashboardRuntimeConsumptionPack } from "./ExecutiveDashboardRuntimeConsumptionPack";

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

describe("18.7-18.9 Executive Dashboard Runtime Wiring Pack", () => {
  it("declares the full 15-scope runtime wiring block", () => {
    const controlledActivation = createExecutiveDashboardControlledActivationPack({
      featureFlagEnabled: true,
      principal,
      generatedAt: "2026-06-18T00:00:00.000Z",
    });
    const runtimeConsumption = createExecutiveDashboardRuntimeConsumptionPack({
      controlledActivation,
      responseKind: "metric-response",
      generatedAt: "2026-06-18T00:00:00.000Z",
    });

    const pack = createExecutiveDashboardRuntimeWiringPack({
      runtimeConsumption,
      generatedAt: "2026-06-18T00:00:00.000Z",
    });

    assertExecutiveDashboardRuntimeWiringPack(pack);

    expect(pack.coveredScopes).toHaveLength(15);
    expect(pack.phase).toBe("18.7-18.9");
    expect(pack.status).toBe("approved-runtime-wiring-candidate");
    expect(pack.mode).toBe("declarative-runtime-view-binding");
    expect(pack.finalResult).toBe("approved-for-controlled-runtime-wiring-review");
    expect(pack.nextPhase).toBe("19.0 Dashboard Controlled Release Review");
  });

  it("binds activation, consumption and render state without creating new data access", () => {
    const pack = createExecutiveDashboardRuntimeWiringPackFromRuntime({
      featureFlagEnabled: true,
      mode: "enabled",
      principal,
      responseKind: "metric-response",
    });
    const binding = getExecutiveDashboardRuntimeWiringViewBinding("executive", pack);

    expect(binding.viewBridge).toBe("runtime-consumption-boundary");
    expect(binding.viewState).toBe("ready");
    expect(binding.rendersMetrics).toBe(true);
    expect(binding.allowedContract).toBe("ExecutiveDashboardApiContracts");
    expect(binding.exposure).toBe("metric-only");
    expect(binding.readOnly).toBe(true);
    expect(binding.metricOnly).toBe(true);
    expect(binding.permissionGated).toBe(true);
    expect(binding.fetchImplementationIncluded).toBe(false);
    expect(binding.transportImplementationIncluded).toBe(false);
    expect(binding.clientFallbackAllowed).toBe(false);
    expect(binding.aggregateAccessAllowed).toBe(false);
    expect(binding.adapterAccessAllowed).toBe(false);
    expect(binding.readSourceAccessAllowed).toBe(false);
    expect(binding.rawTelemetryAllowed).toBe(false);
  });

  it("preserves forbidden view binding when permission is missing", () => {
    const pack = createExecutiveDashboardRuntimeWiringPackFromRuntime({
      featureFlagEnabled: true,
      mode: "enabled",
      principal: deniedPrincipal,
      responseKind: "metric-response",
    });
    const binding = getExecutiveDashboardRuntimeWiringViewBinding("executive", pack);

    expect(binding.viewState).toBe("forbidden");
    expect(binding.rendersMetrics).toBe(false);
    expect(binding.rendersRestrictedState).toBe(true);
    expect(binding.runtimeBinding.response.kind).toBe("access-denied");
  });

  it("renders metrics only through the runtime consumption boundary when wiring is ready", () => {
    const html = renderToStaticMarkup(
      <ExecutiveDashboardRuntimeWiringBoundary
        featureFlagEnabled={true}
        mode="enabled"
        principal={principal}
        viewModel={viewModel}
        responseKind="metric-response"
      />,
    );

    expect(html).toContain('data-runtime-wiring-pack="executive-dashboard-runtime-wiring-pack/v1"');
    expect(html).toContain('data-runtime-view-bridge="runtime-consumption-boundary"');
    expect(html).toContain('data-render-state="ready"');
    expect(html).toContain(
      'data-runtime-consumption-pack="executive-dashboard-runtime-consumption-pack/v1"',
    );
    expect(html).toContain('data-client-fallback="false"');
    expect(html).toContain('data-route-mutation="false"');
    expect(html).toContain('data-login-mutation="false"');
    expect(html).toContain("Platform Health");
  });

  it("renders non-ready states without exposing dashboard metrics", () => {
    for (const [responseKind, renderState] of [
      ["pending", "loading"],
      ["empty-response", "empty"],
      ["sanitized-error", "error"],
    ] as const) {
      const html = renderToStaticMarkup(
        <ExecutiveDashboardRuntimeWiringBoundary
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
      fileURLToPath(import.meta.resolve("./ExecutiveDashboardRuntimeWiringPack.tsx")),
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

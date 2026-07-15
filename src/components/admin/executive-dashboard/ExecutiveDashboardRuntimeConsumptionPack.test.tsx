import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  ExecutiveDashboardRuntimeConsumptionBoundary,
  assertExecutiveDashboardRuntimeConsumptionPack,
  createExecutiveDashboardRuntimeConsumptionPack,
  getExecutiveDashboardRuntimeConsumptionBinding,
  mapExecutiveDashboardRuntimeResponseToRenderState,
} from "./ExecutiveDashboardRuntimeConsumptionPack";
import { createExecutiveDashboardControlledActivationPack } from "./ExecutiveDashboardControlledActivationPack";

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

describe("18.4-18.6 Executive Dashboard Runtime Consumption Pack", () => {
  it("declares the full 16-scope runtime consumption block", () => {
    const controlledActivation = createExecutiveDashboardControlledActivationPack({
      featureFlagEnabled: true,
      principal,
      generatedAt: "2026-06-18T00:00:00.000Z",
    });

    const pack = createExecutiveDashboardRuntimeConsumptionPack({
      controlledActivation,
      responseKind: "metric-response",
      generatedAt: "2026-06-18T00:00:00.000Z",
    });

    assertExecutiveDashboardRuntimeConsumptionPack(pack);

    expect(pack.coveredScopes).toHaveLength(16);
    expect(pack.phase).toBe("18.4-18.6");
    expect(pack.status).toBe("approved-runtime-consumption-candidate");
    expect(pack.mode).toBe("contract-bound-runtime-descriptor");
    expect(pack.finalResult).toBe("approved-for-runtime-consumption-review");
    expect(pack.nextPhase).toBe("18.7-18.9 Dashboard Runtime Route Enablement Review");
  });

  it("maps API response kinds to approved render states", () => {
    expect(mapExecutiveDashboardRuntimeResponseToRenderState("pending")).toBe("loading");
    expect(mapExecutiveDashboardRuntimeResponseToRenderState("metric-response")).toBe("ready");
    expect(mapExecutiveDashboardRuntimeResponseToRenderState("empty-response")).toBe("empty");
    expect(mapExecutiveDashboardRuntimeResponseToRenderState("sanitized-error")).toBe("error");
    expect(mapExecutiveDashboardRuntimeResponseToRenderState("access-denied")).toBe("forbidden");
  });

  it("keeps runtime request and response descriptors metric-only and read-only", () => {
    const controlledActivation = createExecutiveDashboardControlledActivationPack({
      featureFlagEnabled: true,
      principal,
    });
    const pack = createExecutiveDashboardRuntimeConsumptionPack({
      controlledActivation,
      responseKind: "metric-response",
    });
    const binding = getExecutiveDashboardRuntimeConsumptionBinding("executive", pack);

    expect(binding.allowed).toBe(true);
    expect(binding.renderState).toBe("ready");
    expect(binding.request.allowedContract).toBe("ExecutiveDashboardApiContracts");
    expect(binding.request.requiredPermission).toBe("executive-observability:read");
    expect(binding.request.exposure).toBe("metric-only");
    expect(binding.request.readOnly).toBe(true);
    expect(binding.request.metricOnly).toBe(true);
    expect(binding.request.transportImplementationIncluded).toBe(false);
    expect(binding.request.fetchImplementationIncluded).toBe(false);
    expect(binding.request.clientFallbackAllowed).toBe(false);
    expect(binding.request.rawTelemetryAllowed).toBe(false);
    expect(binding.request.aggregateAccessAllowed).toBe(false);
    expect(binding.request.adapterAccessAllowed).toBe(false);
    expect(binding.response.containsMetricValues).toBe(true);
    expect(binding.response.containsRawTelemetry).toBe(false);
    expect(binding.response.containsAggregateState).toBe(false);
    expect(binding.response.containsAdapterState).toBe(false);
    expect(binding.response.triggersClientFallback).toBe(false);
    expect(binding.response.persistsData).toBe(false);
  });

  it("forces forbidden state when runtime permission is missing", () => {
    const controlledActivation = createExecutiveDashboardControlledActivationPack({
      featureFlagEnabled: true,
      principal: deniedPrincipal,
    });
    const pack = createExecutiveDashboardRuntimeConsumptionPack({
      controlledActivation,
      responseKind: "metric-response",
    });
    const binding = getExecutiveDashboardRuntimeConsumptionBinding("executive", pack);

    expect(binding.allowed).toBe(false);
    expect(binding.accessDecision.allowed).toBe(false);
    expect(binding.response.kind).toBe("access-denied");
    expect(binding.renderState).toBe("forbidden");
    expect(binding.response.containsMetricValues).toBe(false);
  });

  it("renders loading, empty and error states without exposing dashboard metrics", () => {
    for (const [responseKind, renderState] of [
      ["pending", "loading"],
      ["empty-response", "empty"],
      ["sanitized-error", "error"],
    ] as const) {
      const html = renderToStaticMarkup(
        <ExecutiveDashboardRuntimeConsumptionBoundary
          featureFlagEnabled={true}
          mode="enabled"
          principal={principal}
          viewModel={viewModel}
          responseKind={responseKind}
        />,
      );

      expect(html).toContain(
        'data-runtime-consumption-pack="executive-dashboard-runtime-consumption-pack/v1"',
      );
      expect(html).toContain(`data-runtime-response-kind="${responseKind}"`);
      expect(html).toContain(`data-render-state="${renderState}"`);
      expect(html).toContain('data-client-fallback="false"');
      expect(html).toContain('data-raw-telemetry="false"');
      expect(html).toContain('data-aggregate-access="false"');
      expect(html).toContain('data-adapter-access="false"');
      expect(html).not.toContain("Platform Health");
    }
  });

  it("renders metrics only when flag, permission and ready response allow access", () => {
    const html = renderToStaticMarkup(
      <ExecutiveDashboardRuntimeConsumptionBoundary
        featureFlagEnabled={true}
        mode="enabled"
        principal={principal}
        viewModel={viewModel}
        responseKind="metric-response"
      />,
    );

    expect(html).toContain('data-render-state="ready"');
    expect(html).toContain('data-access-allowed="true"');
    expect(html).toContain(
      'data-controlled-activation-pack="executive-dashboard-controlled-activation-pack/v1"',
    );
    expect(html).toContain("Platform Health");
  });

  it("does not reference raw telemetry, adapters, route mutation, login mutation or restricted files", () => {
    const source = readFileSync(
      fileURLToPath(import.meta.resolve("./ExecutiveDashboardRuntimeConsumptionPack.tsx")),
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

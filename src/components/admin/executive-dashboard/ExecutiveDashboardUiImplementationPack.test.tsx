import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  ExecutiveDashboardView,
  GovernanceDashboardView,
  OperationalDashboardView,
  createExecutiveDashboardUiImplementationPack,
  assertExecutiveDashboardUiImplementationPack,
  hasExecutiveDashboardPermission,
} from "./ExecutiveDashboardUiImplementationPack";

const principal = {
  id: "admin",
  permissions: ["executive-observability:read" as const],
};

const deniedPrincipal = {
  id: "assistant",
  permissions: ["reports:read" as const],
};

describe("17.5 Executive Dashboard UI Implementation Pack", () => {
  it("declares the full A/J implementation scope without route, API, fetch, fallback or write paths", () => {
    const pack = createExecutiveDashboardUiImplementationPack(
      undefined,
      "2026-06-18T00:00:00.000Z",
    );

    assertExecutiveDashboardUiImplementationPack(pack);

    expect(pack.coveredScopes).toHaveLength(10);
    expect(pack.guardrails.presentationalUiIncluded).toBe(true);
    expect(pack.guardrails.routeImplementationIncluded).toBe(false);
    expect(pack.guardrails.apiImplementationIncluded).toBe(false);
    expect(pack.guardrails.fetchImplementationIncluded).toBe(false);
    expect(pack.guardrails.clientSideFallbackIncluded).toBe(false);
    expect(pack.guardrails.rawTelemetryExposure).toBe(false);
    expect(pack.guardrails.aggregateAccess).toBe(false);
    expect(pack.guardrails.adapterAccess).toBe(false);
    expect(pack.guardrails.leadsSourceOfTruthPreserved).toBe(true);
    expect(pack.guardrails.readModelPlatformV2ClosedFrozenPreserved).toBe(true);
    expect(pack.widgetIds).toHaveLength(11);
  });

  it("renders executive dashboard metric cards through a metric-only presentational shell", () => {
    const html = renderToStaticMarkup(
      <ExecutiveDashboardView
        principal={principal}
        state="ready"
        widgets={[
          {
            widgetId: "platform-health-widget",
            title: "Platform Health",
            metricCards: [
              { label: "Estado", value: "Healthy", description: "Métrica ejecutiva aprobada" },
            ],
          },
        ]}
      />,
    );

    expect(html).toContain("Executive Dashboard");
    expect(html).toContain("Platform Health");
    expect(html).toContain('data-exposure="metric-only"');
    expect(html).not.toContain("ReadTelemetryEvent");
    expect(html).not.toContain("AggregateTelemetryEvent");
  });

  it("renders operational and governance surfaces without mixing dashboard ownership", () => {
    const operational = renderToStaticMarkup(
      <OperationalDashboardView principal={principal} state="empty" widgets={[]} />,
    );
    const governance = renderToStaticMarkup(
      <GovernanceDashboardView principal={principal} state="error" widgets={[]} />,
    );

    expect(operational).toContain("Operational Dashboard");
    expect(operational).toContain("Sin métricas ejecutivas disponibles");
    expect(governance).toContain("Governance Dashboard");
    expect(governance).toContain("No fue posible cargar métricas ejecutivas");
  });

  it("blocks dashboard rendering when executive-observability:read is missing", () => {
    const html = renderToStaticMarkup(
      <ExecutiveDashboardView principal={deniedPrincipal} state="ready" widgets={[]} />,
    );

    expect(html).toContain("Acceso restringido a observabilidad ejecutiva");
    expect(html).not.toContain("Executive Dashboard</h2>");
  });

  it("keeps permission evaluation explicit and reusable", () => {
    expect(hasExecutiveDashboardPermission(principal.permissions)).toBe(true);
    expect(hasExecutiveDashboardPermission(deniedPrincipal.permissions)).toBe(false);
  });

  it("does not import forbidden implementation dependencies", () => {
    const source = readFileSync(
      fileURLToPath(new URL("./ExecutiveDashboardUiImplementationPack.tsx", import.meta.url)),
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
  });
});

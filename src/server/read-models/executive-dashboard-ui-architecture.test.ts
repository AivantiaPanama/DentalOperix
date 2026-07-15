import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { createExecutiveDashboardApiContracts } from "./executive-dashboard-api-contracts";
import {
  EXECUTIVE_DASHBOARD_UI_ARCHITECTURE_VERSION,
  assertExecutiveDashboardUiArchitectureDesign,
  createExecutiveDashboardUiArchitectureDesign,
} from "./executive-dashboard-ui-architecture";

const uiArchitectureSource = readFileSync(
  fileURLToPath(new URL("./executive-dashboard-ui-architecture.ts", import.meta.url)),
  "utf8",
);

describe("17.3-B executive dashboard UI architecture design", () => {
  it("creates an architecture-only design approved for component design", () => {
    const contracts = createExecutiveDashboardApiContracts(undefined, "2026-01-01T00:00:00.000Z");
    const design = createExecutiveDashboardUiArchitectureDesign(
      contracts,
      undefined,
      "2026-01-01T00:00:00.000Z",
    );

    expect(design).toMatchObject({
      version: EXECUTIVE_DASHBOARD_UI_ARCHITECTURE_VERSION,
      phase: "17.3-B",
      status: "approved-for-component-design",
      generatedAt: "2026-01-01T00:00:00.000Z",
      nextPhase: "17.3-C Dashboard Component Design",
    });
    expect(() => assertExecutiveDashboardUiArchitectureDesign(design)).not.toThrow();
  });

  it("keeps UI architecture behind ExecutiveDashboardApiContracts only", () => {
    const contracts = createExecutiveDashboardApiContracts(undefined, "2026-01-01T00:00:00.000Z");
    const design = createExecutiveDashboardUiArchitectureDesign(contracts);

    expect(design.consumptionRule).toEqual({
      allowedContract: "ExecutiveDashboardApiContracts",
      permissionRequired: "executive-observability:read",
      allowedRoutes: contracts.endpoints.map((endpoint) => endpoint.route),
      metricOnly: true,
    });
    expect(design.guardrails.allowedConsumption).toBe("executive-dashboard-api-contracts-only");
  });

  it("defines executive, operational, and governance dashboard surfaces without implementing UI", () => {
    const design = createExecutiveDashboardUiArchitectureDesign();

    expect(design.surfaces).toEqual([
      {
        surface: "executive",
        label: "Executive Dashboard",
        route: "/api/internal/executive-observability/executive",
        layers: [
          "dashboard-shell",
          "dashboard-client",
          "dashboard-view-model",
          "widget-composition",
          "navigation-model",
        ],
        ownership: "presentation-only",
        consumption: "metric-only-api-contract",
        implementationStatus: "architecture-only",
      },
      {
        surface: "operational",
        label: "Operational Dashboard",
        route: "/api/internal/executive-observability/operational",
        layers: [
          "dashboard-shell",
          "dashboard-client",
          "dashboard-view-model",
          "widget-composition",
          "navigation-model",
        ],
        ownership: "presentation-only",
        consumption: "metric-only-api-contract",
        implementationStatus: "architecture-only",
      },
      {
        surface: "governance",
        label: "Governance Dashboard",
        route: "/api/internal/executive-observability/governance",
        layers: [
          "dashboard-shell",
          "dashboard-client",
          "dashboard-view-model",
          "widget-composition",
          "navigation-model",
        ],
        ownership: "presentation-only",
        consumption: "metric-only-api-contract",
        implementationStatus: "architecture-only",
      },
    ]);
  });

  it("preserves aggregate isolation, domain ownership, Leads source of truth, and frozen read platform", () => {
    const design = createExecutiveDashboardUiArchitectureDesign();

    expect(design.guardrails).toMatchObject({
      uiImplementationIncluded: false,
      routeImplementationIncluded: false,
      publicApiIncluded: false,
      persistenceIncluded: false,
      leadWriteIncluded: false,
      aggregateAccess: false,
      adapterAccess: false,
      rawTelemetryExposure: false,
      aggregateIsolationPreserved: true,
      domainOwnershipPreserved: true,
      leadsSourceOfTruthPreserved: true,
      readModelPlatformV2ClosedFrozenPreserved: true,
    });
  });

  it("declares forbidden dependencies explicitly", () => {
    const design = createExecutiveDashboardUiArchitectureDesign();

    expect(design.forbiddenDependencies).toEqual([
      "aggregates",
      "adapters",
      "raw-telemetry",
      "read-sources",
      "read-model-source-provider",
      "lead-write-paths",
      "public-api-expansion",
      "persistence",
    ]);
  });

  it("does not import UI components, routes, aggregates, adapters, read sources, or lead write paths", () => {
    expect(uiArchitectureSource).toContain("./executive-dashboard-api-contracts");
    expect(uiArchitectureSource).toContain("./executive-dashboard-ui-readiness");
    expect(uiArchitectureSource).not.toMatch(/from\s+["'].+components\//);
    expect(uiArchitectureSource).not.toMatch(/from\s+["'].+routes\//);
    expect(uiArchitectureSource).not.toMatch(/from\s+["'].+aggregate-read-service["']/);
    expect(uiArchitectureSource).not.toMatch(/from\s+["'].+read-adapter["']/);
    expect(uiArchitectureSource).not.toMatch(/from\s+["'].+read-source["']/);
    expect(uiArchitectureSource).not.toMatch(/from\s+["'].+read-model-source-provider["']/);
    expect(uiArchitectureSource).not.toMatch(/createFileRoute|createServerFileRoute|route\(/);
    expect(uiArchitectureSource).not.toMatch(
      /processDentalLead|\/api\/leads\/create|BookingDialog|Calendar|Gmail|FloatingDentalAIChat|Home|siteServices/,
    );
  });
});

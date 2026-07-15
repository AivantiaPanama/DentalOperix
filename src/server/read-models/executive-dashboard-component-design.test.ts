import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { createExecutiveDashboardApiContracts } from "./executive-dashboard-api-contracts";
import { createExecutiveDashboardUiArchitectureDesign } from "./executive-dashboard-ui-architecture";
import {
  EXECUTIVE_DASHBOARD_COMPONENT_DESIGN_VERSION,
  assertExecutiveDashboardComponentDesign,
  createExecutiveDashboardComponentDesign,
} from "./executive-dashboard-component-design";

const componentDesignSource = readFileSync(
  fileURLToPath(new URL("./executive-dashboard-component-design.ts", import.meta.url)),
  "utf8",
);

describe("17.3-C executive dashboard component design", () => {
  it("creates a component-contract-only design approved for future UI implementation", () => {
    const contracts = createExecutiveDashboardApiContracts(undefined, "2026-01-01T00:00:00.000Z");
    const architecture = createExecutiveDashboardUiArchitectureDesign(
      contracts,
      undefined,
      "2026-01-01T00:00:00.000Z",
    );
    const design = createExecutiveDashboardComponentDesign(
      contracts,
      architecture,
      "2026-01-01T00:00:00.000Z",
    );

    expect(design).toMatchObject({
      version: EXECUTIVE_DASHBOARD_COMPONENT_DESIGN_VERSION,
      phase: "17.3-C",
      status: "approved-for-future-ui-implementation",
      generatedAt: "2026-01-01T00:00:00.000Z",
      architectureVersion: architecture.version,
      nextPhase: "17.3-D Dashboard UI Implementation Readiness Gate",
    });
    expect(() => assertExecutiveDashboardComponentDesign(design)).not.toThrow();
  });

  it("defines executive, operational, and governance panels without visual UI implementation", () => {
    const design = createExecutiveDashboardComponentDesign();

    expect(design.panels).toEqual([
      {
        surface: "executive",
        label: "Executive Dashboard",
        route: "/api/internal/executive-observability/executive",
        widgets: [
          "platform-health-widget",
          "aggregate-health-summary-widget",
          "domain-health-overview-widget",
          "executive-governance-summary-widget",
        ],
        compositionStatus: "design-only",
        allowedContract: "ExecutiveDashboardApiContracts",
      },
      {
        surface: "operational",
        label: "Operational Dashboard",
        route: "/api/internal/executive-observability/operational",
        widgets: [
          "domain-health-matrix-widget",
          "operational-status-widget",
          "domain-trend-summary-widget",
        ],
        compositionStatus: "design-only",
        allowedContract: "ExecutiveDashboardApiContracts",
      },
      {
        surface: "governance",
        label: "Governance Dashboard",
        route: "/api/internal/executive-observability/governance",
        widgets: [
          "governance-health-widget",
          "adr-compliance-widget",
          "isolation-status-widget",
          "read-model-freeze-status-widget",
        ],
        compositionStatus: "design-only",
        allowedContract: "ExecutiveDashboardApiContracts",
      },
    ]);
  });

  it("declares all widgets as metric-only contracts behind ExecutiveDashboardApiContracts", () => {
    const design = createExecutiveDashboardComponentDesign();

    expect(design.widgets).toHaveLength(11);
    expect(
      design.widgets.every(
        (widget) => widget.requiredContract === "ExecutiveDashboardApiContracts",
      ),
    ).toBe(true);
    expect(
      design.widgets.every(
        (widget) => widget.permissionRequired === "executive-observability:read",
      ),
    ).toBe(true);
    expect(design.widgets.every((widget) => widget.exposure === "metric-only")).toBe(true);
    expect(
      design.widgets.every((widget) => widget.implementationStatus === "component-contract-only"),
    ).toBe(true);
    expect(
      design.widgets.every(
        (widget) => widget.presentationResponsibility === "render-governed-metrics-only",
      ),
    ).toBe(true);
  });

  it("maps widgets only to approved metric source types", () => {
    const design = createExecutiveDashboardComponentDesign();
    const allowedMetricSources = new Set([
      "PlatformHealthMetric",
      "DomainHealthMetric",
      "AggregateHealthMetric",
      "GovernanceHealthMetric",
    ]);

    expect(
      design.widgets.every((widget) =>
        widget.metricSources.every((source) => allowedMetricSources.has(source)),
      ),
    ).toBe(true);
    expect(
      design.widgets.find((widget) => widget.id === "platform-health-widget")?.metricSources,
    ).toEqual(["PlatformHealthMetric"]);
    expect(
      design.widgets.find((widget) => widget.id === "adr-compliance-widget")?.metricSources,
    ).toEqual(["GovernanceHealthMetric"]);
  });

  it("preserves aggregate isolation, domain ownership, Leads source of truth, and frozen read platform", () => {
    const design = createExecutiveDashboardComponentDesign();

    expect(design.guardrails).toMatchObject({
      uiImplementationIncluded: false,
      visualComponentsIncluded: false,
      routeImplementationIncluded: false,
      apiImplementationIncluded: false,
      persistenceIncluded: false,
      domainLogicIncluded: false,
      fallbackLogicIncluded: false,
      aggregateAccess: false,
      adapterAccess: false,
      readModelDirectAccess: false,
      rawTelemetryExposure: false,
      leadWriteIncluded: false,
      aggregateIsolationPreserved: true,
      domainOwnershipPreserved: true,
      leadsSourceOfTruthPreserved: true,
      readModelPlatformV2ClosedFrozenPreserved: true,
    });
  });

  it("keeps every widget isolated from aggregates, adapters, raw telemetry, read sources, and writes", () => {
    const design = createExecutiveDashboardComponentDesign();

    for (const widget of design.widgets) {
      expect(widget.forbiddenDependencies).toEqual([
        "aggregates",
        "adapters",
        "raw-telemetry",
        "read-sources",
        "read-model-source-provider",
        "read-model-direct-access",
        "lead-write-paths",
        "persistence",
        "domain-logic",
        "fallback-logic",
      ]);
    }
  });

  it("does not import UI components, routes, aggregates, adapters, read sources, or lead write paths", () => {
    expect(componentDesignSource).toContain("./executive-dashboard-api-contracts");
    expect(componentDesignSource).toContain("./executive-dashboard-ui-architecture");
    expect(componentDesignSource).not.toMatch(/from\s+["'].+components\//);
    expect(componentDesignSource).not.toMatch(/from\s+["'].+routes\//);
    expect(componentDesignSource).not.toMatch(/from\s+["'].+aggregate-read-service["']/);
    expect(componentDesignSource).not.toMatch(/from\s+["'].+read-adapter["']/);
    expect(componentDesignSource).not.toMatch(/from\s+["'].+read-source["']/);
    expect(componentDesignSource).not.toMatch(/from\s+["'].+read-model-source-provider["']/);
    expect(componentDesignSource).not.toMatch(/createFileRoute|createServerFileRoute|route\(/);
    expect(componentDesignSource).not.toMatch(
      /processDentalLead|\/api\/leads\/create|BookingDialog|Calendar|Gmail|FloatingDentalAIChat|Home|siteServices/,
    );
  });
});

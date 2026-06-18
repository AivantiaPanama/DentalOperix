import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { createExecutiveDashboardDataClientDesign } from "./executive-dashboard-data-client-design";
import {
  EXECUTIVE_DASHBOARD_INTEGRATION_BOUNDARY_DESIGN_VERSION,
  assertExecutiveDashboardIntegrationBoundaryDesign,
  createExecutiveDashboardIntegrationBoundaryDesign,
} from "./executive-dashboard-integration-boundary-design";

const integrationBoundarySource = readFileSync(
  fileURLToPath(new URL("./executive-dashboard-integration-boundary-design.ts", import.meta.url)),
  "utf8",
);

describe("17.3-F executive dashboard integration boundary design", () => {
  it("creates an approved metric-only integration boundary design for future view model design", () => {
    const dataClientDesign = createExecutiveDashboardDataClientDesign(undefined, undefined, "2026-01-01T00:00:00.000Z");
    const design = createExecutiveDashboardIntegrationBoundaryDesign(dataClientDesign, "2026-01-01T00:00:00.000Z");

    expect(design).toMatchObject({
      version: EXECUTIVE_DASHBOARD_INTEGRATION_BOUNDARY_DESIGN_VERSION,
      phase: "17.3-F",
      status: "approved-for-future-view-model-design",
      generatedAt: "2026-01-01T00:00:00.000Z",
      dataClientDesignVersion: dataClientDesign.version,
      accessModelVersion: dataClientDesign.accessModelVersion,
      apiContractVersion: dataClientDesign.apiContractVersion,
      mode: "metric-only-contract-boundary",
      nextPhase: "17.3-G Dashboard View Model Design",
    });
    expect(() => assertExecutiveDashboardIntegrationBoundaryDesign(design)).not.toThrow();
  });

  it("defines exactly three integration boundaries bound to data client endpoint descriptors", () => {
    const design = createExecutiveDashboardIntegrationBoundaryDesign();

    expect(design.boundaries).toEqual([
      {
        surface: "executive",
        layers: [
          "dashboard-shell-boundary",
          "access-gate-boundary",
          "data-client-boundary",
          "api-contract-boundary",
        ],
        route: "/api/internal/executive-observability/executive",
        method: "GET",
        requiredPermission: "executive-observability:read",
        allowedContract: "ExecutiveDashboardApiContracts",
        exposure: "metric-only",
        dataClientMode: "contract-bound-metric-read",
        runtimeStatus: "design-contract-only",
        boundaryOwnership: "presentation-integration-only",
        fallbackOwnership: "server-read-platform-only",
      },
      {
        surface: "operational",
        layers: [
          "dashboard-shell-boundary",
          "access-gate-boundary",
          "data-client-boundary",
          "api-contract-boundary",
        ],
        route: "/api/internal/executive-observability/operational",
        method: "GET",
        requiredPermission: "executive-observability:read",
        allowedContract: "ExecutiveDashboardApiContracts",
        exposure: "metric-only",
        dataClientMode: "contract-bound-metric-read",
        runtimeStatus: "design-contract-only",
        boundaryOwnership: "presentation-integration-only",
        fallbackOwnership: "server-read-platform-only",
      },
      {
        surface: "governance",
        layers: [
          "dashboard-shell-boundary",
          "access-gate-boundary",
          "data-client-boundary",
          "api-contract-boundary",
        ],
        route: "/api/internal/executive-observability/governance",
        method: "GET",
        requiredPermission: "executive-observability:read",
        allowedContract: "ExecutiveDashboardApiContracts",
        exposure: "metric-only",
        dataClientMode: "contract-bound-metric-read",
        runtimeStatus: "design-contract-only",
        boundaryOwnership: "presentation-integration-only",
        fallbackOwnership: "server-read-platform-only",
      },
    ]);
  });

  it("preserves governance guardrails and explicitly excludes UI, transport, fetch, persistence, fallback, and aggregation", () => {
    const design = createExecutiveDashboardIntegrationBoundaryDesign();

    expect(design.guardrails).toMatchObject({
      uiImplementationIncluded: false,
      visualComponentsIncluded: false,
      routeImplementationIncluded: false,
      apiImplementationIncluded: false,
      transportImplementationIncluded: false,
      fetchImplementationIncluded: false,
      browserStorageIncluded: false,
      credentialStorageIncluded: false,
      credentialForwardingIncluded: false,
      persistenceIncluded: false,
      domainLogicIncluded: false,
      fallbackLogicIncluded: false,
      clientSideFallbackIncluded: false,
      clientSideAggregationIncluded: false,
      aggregateAccess: false,
      adapterAccess: false,
      readModelDirectAccess: false,
      rawTelemetryExposure: false,
      leadWriteIncluded: false,
      publicApiExpansionIncluded: false,
      aggregateIsolationPreserved: true,
      domainOwnershipPreserved: true,
      leadsSourceOfTruthPreserved: true,
      readModelPlatformV2ClosedFrozenPreserved: true,
    });
  });

  it("keeps fallback ownership in the server read platform and never in the dashboard boundary", () => {
    const design = createExecutiveDashboardIntegrationBoundaryDesign();

    expect(design.boundaries.every((boundary) => boundary.fallbackOwnership === "server-read-platform-only")).toBe(true);
    expect(design.guardrails.clientSideFallbackIncluded).toBe(false);
    expect(design.guardrails.fallbackLogicIncluded).toBe(false);
  });

  it("keeps the boundary isolated from forbidden dependencies", () => {
    const design = createExecutiveDashboardIntegrationBoundaryDesign();

    expect(design.forbiddenDependencies).toEqual([
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
      "public-api-expansion",
      "admin-login-credential-storage",
      "browser-storage",
      "credential-forwarding",
      "client-side-aggregation",
      "client-side-fallback",
      "transport-implementation",
      "fetch-implementation",
      "route-implementation",
      "visual-ui-implementation",
    ]);
  });

  it("does not import UI components, routes, aggregates, adapters, raw telemetry, admin login, browser storage, or lead write paths", () => {
    expect(integrationBoundarySource).toContain("./executive-dashboard-data-client-design");
    expect(integrationBoundarySource).not.toMatch(/from\s+["'].+components\//);
    expect(integrationBoundarySource).not.toMatch(/from\s+["'].+routes\//);
    expect(integrationBoundarySource).not.toMatch(/from\s+["'].+aggregate-read-service["']/);
    expect(integrationBoundarySource).not.toMatch(/from\s+["'].+read-adapter["']/);
    expect(integrationBoundarySource).not.toMatch(/from\s+["'].+read-source["']/);
    expect(integrationBoundarySource).not.toMatch(/from\s+["'].+read-model-source-provider["']/);
    expect(integrationBoundarySource).not.toMatch(
      /ReadTelemetryEvent|FallbackTelemetryEvent|AggregateTelemetryEvent|DomainTelemetryEvent/,
    );
    expect(integrationBoundarySource).not.toMatch(/fetch\(|axios|localStorage|sessionStorage|indexedDB|document\.cookie/);
    expect(integrationBoundarySource).not.toMatch(/createFileRoute|createServerFileRoute|route\(/);
    expect(integrationBoundarySource).not.toMatch(/admin-auth|login\.tsx|api\/admin\/login/);
    expect(integrationBoundarySource).not.toMatch(
      /processDentalLead|\/api\/leads\/create|BookingDialog|Calendar|Gmail|FloatingDentalAIChat|Home|siteServices/,
    );
  });
});

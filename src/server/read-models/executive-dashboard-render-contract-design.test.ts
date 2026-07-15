import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { createExecutiveDashboardIntegrationBoundaryDesign } from "./executive-dashboard-integration-boundary-design";
import {
  EXECUTIVE_DASHBOARD_ALLOWED_RENDER_STATES,
  EXECUTIVE_DASHBOARD_RENDER_CONTRACT_DESIGN_VERSION,
  assertExecutiveDashboardRenderContractDesign,
  createExecutiveDashboardRenderContractDesign,
} from "./executive-dashboard-render-contract-design";

const renderContractSource = readFileSync(
  fileURLToPath(new URL("./executive-dashboard-render-contract-design.ts", import.meta.url)),
  "utf8",
);

describe("17.3-G executive dashboard render contract design", () => {
  it("creates an approved metric-only render contract design for future view model design", () => {
    const integrationBoundaryDesign = createExecutiveDashboardIntegrationBoundaryDesign(
      undefined,
      "2026-01-01T00:00:00.000Z",
    );
    const design = createExecutiveDashboardRenderContractDesign(
      integrationBoundaryDesign,
      "2026-01-01T00:00:00.000Z",
    );

    expect(design).toMatchObject({
      version: EXECUTIVE_DASHBOARD_RENDER_CONTRACT_DESIGN_VERSION,
      phase: "17.3-G",
      status: "approved-for-future-view-model-design",
      generatedAt: "2026-01-01T00:00:00.000Z",
      integrationBoundaryDesignVersion: integrationBoundaryDesign.version,
      apiContractVersion: integrationBoundaryDesign.apiContractVersion,
      mode: "metric-only-render-contract",
      nextPhase: "17.3-H Dashboard View Model Design",
    });
    expect(() => assertExecutiveDashboardRenderContractDesign(design)).not.toThrow();
  });

  it("defines only the approved render states for every dashboard surface", () => {
    const design = createExecutiveDashboardRenderContractDesign();

    expect(EXECUTIVE_DASHBOARD_ALLOWED_RENDER_STATES).toEqual([
      "loading",
      "ready",
      "empty",
      "error",
      "forbidden",
    ]);
    expect(design.renderContracts.map((contract) => contract.surface)).toEqual([
      "executive",
      "operational",
      "governance",
    ]);
    expect(
      design.renderContracts.every(
        (contract) => contract.allowedStates === EXECUTIVE_DASHBOARD_ALLOWED_RENDER_STATES,
      ),
    ).toBe(true);
    expect(
      design.renderContracts.every(
        (contract) =>
          contract.statePolicies.map((policy) => policy.state).join("|") ===
          "loading|ready|empty|error|forbidden",
      ),
    ).toBe(true);
  });

  it("binds render contracts to integration boundary routes without implementing route, fetch, or transport behavior", () => {
    const design = createExecutiveDashboardRenderContractDesign();

    expect(design.renderContracts).toMatchObject([
      {
        surface: "executive",
        route: "/api/internal/executive-observability/executive",
        method: "GET",
        renderOwnership: "presentation-render-only",
        runtimeStatus: "design-contract-only",
        allowedContract: "ExecutiveDashboardApiContracts",
        requiredPermission: "executive-observability:read",
        exposure: "metric-only",
      },
      {
        surface: "operational",
        route: "/api/internal/executive-observability/operational",
        method: "GET",
        renderOwnership: "presentation-render-only",
        runtimeStatus: "design-contract-only",
        allowedContract: "ExecutiveDashboardApiContracts",
        requiredPermission: "executive-observability:read",
        exposure: "metric-only",
      },
      {
        surface: "governance",
        route: "/api/internal/executive-observability/governance",
        method: "GET",
        renderOwnership: "presentation-render-only",
        runtimeStatus: "design-contract-only",
        allowedContract: "ExecutiveDashboardApiContracts",
        requiredPermission: "executive-observability:read",
        exposure: "metric-only",
      },
    ]);
  });

  it("keeps render state policies metric-only and sanitized", () => {
    const design = createExecutiveDashboardRenderContractDesign();
    const policies = design.renderContracts.flatMap((contract) => contract.statePolicies);

    expect(policies.every((policy) => policy.allowedDataExposure === "metric-only")).toBe(true);
    expect(
      policies.every((policy) => policy.allowedContract === "ExecutiveDashboardApiContracts"),
    ).toBe(true);
    expect(
      policies.every((policy) => policy.requiredPermission === "executive-observability:read"),
    ).toBe(true);
    expect(policies.every((policy) => policy.mayDisplayRawTelemetry === false)).toBe(true);
    expect(policies.every((policy) => policy.mayDisplayAggregateState === false)).toBe(true);
    expect(policies.every((policy) => policy.mayDisplayAdapterState === false)).toBe(true);
    expect(policies.every((policy) => policy.mayTriggerFallback === false)).toBe(true);
    expect(policies.every((policy) => policy.mayPersistData === false)).toBe(true);
    expect(
      policies
        .filter((policy) => policy.state === "ready")
        .every((policy) => policy.mayDisplayMetricValues),
    ).toBe(true);
    expect(
      policies
        .filter((policy) => policy.state !== "ready")
        .every((policy) => !policy.mayDisplayMetricValues),
    ).toBe(true);
  });

  it("preserves governance guardrails and excludes UI implementation, computed health, fallback, persistence, aggregation, and raw telemetry", () => {
    const design = createExecutiveDashboardRenderContractDesign();

    expect(design.guardrails).toMatchObject({
      uiImplementationIncluded: false,
      visualComponentsIncluded: false,
      routeImplementationIncluded: false,
      apiImplementationIncluded: false,
      transportImplementationIncluded: false,
      fetchImplementationIncluded: false,
      browserStorageIncluded: false,
      credentialStorageIncluded: false,
      persistenceIncluded: false,
      domainLogicIncluded: false,
      fallbackLogicIncluded: false,
      clientSideFallbackIncluded: false,
      clientSideAggregationIncluded: false,
      computedHealthIncluded: false,
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

  it("keeps the render contract isolated from forbidden dependencies", () => {
    const design = createExecutiveDashboardRenderContractDesign();

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
      "computed-health",
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
    expect(renderContractSource).toContain("./executive-dashboard-integration-boundary-design");
    expect(renderContractSource).not.toMatch(/from\s+["'].+components\//);
    expect(renderContractSource).not.toMatch(/from\s+["'].+routes\//);
    expect(renderContractSource).not.toMatch(/from\s+["'].+aggregate-read-service["']/);
    expect(renderContractSource).not.toMatch(/from\s+["'].+read-adapter["']/);
    expect(renderContractSource).not.toMatch(/from\s+["'].+read-source["']/);
    expect(renderContractSource).not.toMatch(/from\s+["'].+read-model-source-provider["']/);
    expect(renderContractSource).not.toMatch(
      /ReadTelemetryEvent|FallbackTelemetryEvent|AggregateTelemetryEvent|DomainTelemetryEvent/,
    );
    expect(renderContractSource).not.toMatch(
      /fetch\(|axios|localStorage|sessionStorage|indexedDB|document\.cookie/,
    );
    expect(renderContractSource).not.toMatch(/createFileRoute|createServerFileRoute|route\(/);
    expect(renderContractSource).not.toMatch(/admin-auth|login\.tsx|api\/admin\/login/);
    expect(renderContractSource).not.toMatch(
      /processDentalLead|\/api\/leads\/create|BookingDialog|Calendar|Gmail|FloatingDentalAIChat|Home|siteServices/,
    );
  });
});

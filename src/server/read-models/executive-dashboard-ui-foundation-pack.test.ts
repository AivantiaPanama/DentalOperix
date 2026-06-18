import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  EXECUTIVE_DASHBOARD_UI_FOUNDATION_PACK_VERSION,
  EXECUTIVE_DASHBOARD_UI_FOUNDATION_SCOPES,
  assertExecutiveDashboardUiFoundationPack,
  createExecutiveDashboardUiFoundationPack,
} from "./executive-dashboard-ui-foundation-pack";

const foundationSource = readFileSync(
  fileURLToPath(new URL("./executive-dashboard-ui-foundation-pack.ts", import.meta.url)),
  "utf8",
);

describe("17.4 executive dashboard UI foundation pack", () => {
  it("creates one approved foundation pack covering 17.4-A through 17.4-J", () => {
    const pack = createExecutiveDashboardUiFoundationPack(undefined, undefined, undefined, undefined, "2026-01-01T00:00:00.000Z");

    expect(pack).toMatchObject({
      version: EXECUTIVE_DASHBOARD_UI_FOUNDATION_PACK_VERSION,
      phase: "17.4",
      status: "approved-foundation-pack-contracts-only",
      generatedAt: "2026-01-01T00:00:00.000Z",
      nextPhase: "17.5 Executive Dashboard UI Implementation Pack",
    });
    expect(pack.coveredScopes).toEqual(EXECUTIVE_DASHBOARD_UI_FOUNDATION_SCOPES);
    expect(pack.coveredScopes).toHaveLength(10);
    expect(() => assertExecutiveDashboardUiFoundationPack(pack)).not.toThrow();
  });

  it("defines layout shells, navigation, and composition for exactly the approved dashboard surfaces", () => {
    const pack = createExecutiveDashboardUiFoundationPack();

    expect(pack.layoutShells.map((layout) => layout.surface)).toEqual(["executive", "operational", "governance"]);
    expect(pack.navigation.map((item) => item.path)).toEqual([
      "/admin/dashboard/executive",
      "/admin/dashboard/operational",
      "/admin/dashboard/governance",
    ]);
    expect(pack.compositionRuntime.map((composition) => composition.surface)).toEqual(["executive", "operational", "governance"]);
    expect(pack.layoutShells.every((layout) => layout.regions.join("|") === "header|navigation|content|status")).toBe(true);
    expect(pack.layoutShells.every((layout) => layout.runtimeStatus === "foundation-contract-only")).toBe(true);
    expect(pack.layoutShells.every((layout) => layout.implementationIncluded === false)).toBe(true);
  });

  it("registers all approved metric-only widgets without visual implementation or domain logic", () => {
    const pack = createExecutiveDashboardUiFoundationPack();

    expect(pack.widgetRegistry.map((entry) => entry.widgetId)).toEqual([
      "platform-health-widget",
      "aggregate-health-summary-widget",
      "domain-health-overview-widget",
      "executive-governance-summary-widget",
      "domain-health-matrix-widget",
      "operational-status-widget",
      "domain-trend-summary-widget",
      "governance-health-widget",
      "adr-compliance-widget",
      "isolation-status-widget",
      "read-model-freeze-status-widget",
    ]);
    expect(pack.widgetRegistry.every((entry) => entry.allowedContract === "ExecutiveDashboardApiContracts")).toBe(true);
    expect(pack.widgetRegistry.every((entry) => entry.requiredPermission === "executive-observability:read")).toBe(true);
    expect(pack.widgetRegistry.every((entry) => entry.exposure === "metric-only")).toBe(true);
    expect(pack.widgetRegistry.every((entry) => !entry.visualImplementationIncluded)).toBe(true);
    expect(pack.widgetRegistry.every((entry) => !entry.domainLogicIncluded)).toBe(true);
    expect(pack.widgetRegistry.every((entry) => !entry.fallbackLogicIncluded)).toBe(true);
  });

  it("binds access guards and data clients without credential storage, fetch, transport, or client fallback", () => {
    const pack = createExecutiveDashboardUiFoundationPack();

    expect(pack.accessGuardBindings.every((binding) => binding.requiredPermission === "executive-observability:read")).toBe(true);
    expect(pack.accessGuardBindings.every((binding) => binding.accessLevel === "metric-only-read")).toBe(true);
    expect(pack.accessGuardBindings.every((binding) => binding.guardSource === "executive-dashboard-access-model/v1")).toBe(true);
    expect(pack.accessGuardBindings.every((binding) => binding.credentialStorageIncluded === false)).toBe(true);

    expect(pack.dataClientBindings.every((binding) => binding.method === "GET")).toBe(true);
    expect(pack.dataClientBindings.every((binding) => binding.bindingSource === "executive-dashboard-data-client-design/v1")).toBe(true);
    expect(pack.dataClientBindings.every((binding) => binding.transportImplementationIncluded === false)).toBe(true);
    expect(pack.dataClientBindings.every((binding) => binding.fetchImplementationIncluded === false)).toBe(true);
    expect(pack.dataClientBindings.every((binding) => binding.clientSideFallbackIncluded === false)).toBe(true);
    expect(pack.dataClientBindings.every((binding) => binding.responseExposure === "metric-only")).toBe(true);
  });

  it("keeps empty, error, and forbidden UX state contracts sanitized and metric-only", () => {
    const pack = createExecutiveDashboardUiFoundationPack();

    expect(pack.uxStateContracts.map((state) => state.state)).toEqual(["empty", "error", "forbidden"]);
    expect(pack.uxStateContracts.every((state) => state.sanitized)).toBe(true);
    expect(pack.uxStateContracts.every((state) => state.mayDisplayRawTelemetry === false)).toBe(true);
    expect(pack.uxStateContracts.every((state) => state.mayDisplayAggregateState === false)).toBe(true);
    expect(pack.uxStateContracts.every((state) => state.mayDisplayAdapterState === false)).toBe(true);
    expect(pack.uxStateContracts.every((state) => state.mayTriggerFallback === false)).toBe(true);
    expect(pack.uxStateContracts.every((state) => state.exposure === "metric-only")).toBe(true);
  });

  it("preserves DentalOperix governance guardrails for the full foundation pack", () => {
    const pack = createExecutiveDashboardUiFoundationPack();

    expect(pack.guardrails).toMatchObject({
      uiProductImplementationIncluded: false,
      visualComponentsIncluded: false,
      routeImplementationIncluded: false,
      apiImplementationIncluded: false,
      transportImplementationIncluded: false,
      fetchImplementationIncluded: false,
      browserStorageIncluded: false,
      credentialStorageIncluded: false,
      persistenceIncluded: false,
      writePathIncluded: false,
      domainLogicIncluded: false,
      fallbackLogicIncluded: false,
      clientSideFallbackIncluded: false,
      clientSideAggregationIncluded: false,
      computedHealthIncluded: false,
      aggregateAccess: false,
      adapterAccess: false,
      readModelDirectAccess: false,
      readSourceAccess: false,
      rawTelemetryExposure: false,
      publicApiExpansionIncluded: false,
      adminLoginModificationIncluded: false,
      leadWriteIncluded: false,
      aggregateIsolationPreserved: true,
      domainOwnershipPreserved: true,
      leadsSourceOfTruthPreserved: true,
      readModelPlatformV2ClosedFrozenPreserved: true,
    });
  });

  it("keeps foundation source isolated from forbidden dependencies and restricted files", () => {
    expect(foundationSource).toContain("./executive-dashboard-component-design");
    expect(foundationSource).toContain("./executive-dashboard-access-model");
    expect(foundationSource).toContain("./executive-dashboard-data-client-design");
    expect(foundationSource).toContain("./executive-dashboard-render-contract-design");
    expect(foundationSource).not.toMatch(/from\s+["'].+components\//);
    expect(foundationSource).not.toMatch(/from\s+["'].+routes\//);
    expect(foundationSource).not.toMatch(/from\s+["'].+aggregate-read-service["']/);
    expect(foundationSource).not.toMatch(/from\s+["'].+read-adapter["']/);
    expect(foundationSource).not.toMatch(/from\s+["'].+read-source["']/);
    expect(foundationSource).not.toMatch(/from\s+["'].+read-model-source-provider["']/);
    expect(foundationSource).not.toMatch(
      /ReadTelemetryEvent|FallbackTelemetryEvent|AggregateTelemetryEvent|DomainTelemetryEvent/,
    );
    expect(foundationSource).not.toMatch(/fetch\(|axios|localStorage|sessionStorage|indexedDB|document\.cookie/);
    expect(foundationSource).not.toMatch(/createFileRoute|createServerFileRoute|route\(/);
    expect(foundationSource).not.toMatch(/admin-auth|login\.tsx|api\/admin\/login/);
    expect(foundationSource).not.toMatch(
      /processDentalLead|\/api\/leads\/create|BookingDialog|Calendar|Gmail|FloatingDentalAIChat|Home|siteServices/,
    );
  });
});

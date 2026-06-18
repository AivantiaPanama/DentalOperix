import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import type { Permission } from "../../lib/rbac/permissions";
import { createExecutiveDashboardApiContracts } from "./executive-dashboard-api-contracts";
import { createExecutiveDashboardComponentDesign } from "./executive-dashboard-component-design";
import {
  EXECUTIVE_DASHBOARD_ACCESS_MODEL_VERSION,
  assertExecutiveDashboardAccessModel,
  createExecutiveDashboardAccessModel,
  evaluateExecutiveDashboardAccess,
} from "./executive-dashboard-access-model";

const accessModelSource = readFileSync(
  fileURLToPath(new URL("./executive-dashboard-access-model.ts", import.meta.url)),
  "utf8",
);

describe("17.3-D executive dashboard permission and access model", () => {
  it("creates a permissioned access gate approved for future UI access", () => {
    const contracts = createExecutiveDashboardApiContracts(undefined, "2026-01-01T00:00:00.000Z");
    const componentDesign = createExecutiveDashboardComponentDesign(
      contracts,
      undefined,
      "2026-01-01T00:00:00.000Z",
    );
    const model = createExecutiveDashboardAccessModel(contracts, componentDesign, "2026-01-01T00:00:00.000Z");

    expect(model).toMatchObject({
      version: EXECUTIVE_DASHBOARD_ACCESS_MODEL_VERSION,
      phase: "17.3-D",
      status: "approved-for-future-ui-access-gate",
      generatedAt: "2026-01-01T00:00:00.000Z",
      componentDesignVersion: componentDesign.version,
      nextPhase: "17.3-E Dashboard UI Implementation Gate",
    });
    expect(() => assertExecutiveDashboardAccessModel(model)).not.toThrow();
  });

  it("defines exactly three dashboard policies with executive-observability read permission", () => {
    const model = createExecutiveDashboardAccessModel();

    expect(model.policies).toEqual([
      {
        surface: "executive",
        route: "/api/internal/executive-observability/executive",
        requiredPermission: "executive-observability:read",
        accessLevel: "metric-only-read",
        allowedContract: "ExecutiveDashboardApiContracts",
        allowedWidgetIds: [
          "platform-health-widget",
          "aggregate-health-summary-widget",
          "domain-health-overview-widget",
          "executive-governance-summary-widget",
        ],
        metricOnly: true,
        uiAccessGateOnly: true,
      },
      {
        surface: "operational",
        route: "/api/internal/executive-observability/operational",
        requiredPermission: "executive-observability:read",
        accessLevel: "metric-only-read",
        allowedContract: "ExecutiveDashboardApiContracts",
        allowedWidgetIds: ["domain-health-matrix-widget", "operational-status-widget", "domain-trend-summary-widget"],
        metricOnly: true,
        uiAccessGateOnly: true,
      },
      {
        surface: "governance",
        route: "/api/internal/executive-observability/governance",
        requiredPermission: "executive-observability:read",
        accessLevel: "metric-only-read",
        allowedContract: "ExecutiveDashboardApiContracts",
        allowedWidgetIds: [
          "governance-health-widget",
          "adr-compliance-widget",
          "isolation-status-widget",
          "read-model-freeze-status-widget",
        ],
        metricOnly: true,
        uiAccessGateOnly: true,
      },
    ]);
  });

  it("allows principals only when executive-observability read permission is present", () => {
    const model = createExecutiveDashboardAccessModel();
    const allowedPermissions: Permission[] = ["executive-observability:read"];
    const deniedPermissions: Permission[] = ["reports:read", "kpis:read"];

    expect(
      evaluateExecutiveDashboardAccess(model, { id: "admin-user", permissions: allowedPermissions }, "executive"),
    ).toMatchObject({
      decision: "allow",
      reason: "permission-present",
      route: "/api/internal/executive-observability/executive",
      requiredPermission: "executive-observability:read",
      accessLevel: "metric-only-read",
    });

    expect(
      evaluateExecutiveDashboardAccess(model, { id: "assistant-user", permissions: deniedPermissions }, "governance"),
    ).toMatchObject({
      decision: "deny",
      reason: "missing-executive-observability-read",
      route: "/api/internal/executive-observability/governance",
      requiredPermission: "executive-observability:read",
      accessLevel: "metric-only-read",
    });
  });

  it("preserves aggregate isolation, domain ownership, Leads source of truth, and frozen read platform", () => {
    const model = createExecutiveDashboardAccessModel();

    expect(model.guardrails).toMatchObject({
      uiImplementationIncluded: false,
      visualComponentsIncluded: false,
      routeImplementationIncluded: false,
      apiImplementationIncluded: false,
      loginImplementationIncluded: false,
      credentialStorageIncluded: false,
      persistenceIncluded: false,
      domainLogicIncluded: false,
      fallbackLogicIncluded: false,
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

  it("keeps access model isolated from aggregates, adapters, raw telemetry, read sources, writes, and credential storage", () => {
    const model = createExecutiveDashboardAccessModel();

    expect(model.forbiddenDependencies).toEqual([
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
    ]);
  });

  it("does not import UI components, routes, aggregates, adapters, raw telemetry, admin login, or lead write paths", () => {
    expect(accessModelSource).toContain("./executive-dashboard-api-contracts");
    expect(accessModelSource).toContain("./executive-dashboard-component-design");
    expect(accessModelSource).not.toMatch(/from\s+["'].+components\//);
    expect(accessModelSource).not.toMatch(/from\s+["'].+routes\//);
    expect(accessModelSource).not.toMatch(/from\s+["'].+aggregate-read-service["']/);
    expect(accessModelSource).not.toMatch(/from\s+["'].+read-adapter["']/);
    expect(accessModelSource).not.toMatch(/from\s+["'].+read-source["']/);
    expect(accessModelSource).not.toMatch(/from\s+["'].+read-model-source-provider["']/);
    expect(accessModelSource).not.toMatch(/ReadTelemetryEvent|FallbackTelemetryEvent|AggregateTelemetryEvent|DomainTelemetryEvent/);
    expect(accessModelSource).not.toMatch(/createFileRoute|createServerFileRoute|route\(/);
    expect(accessModelSource).not.toMatch(/admin-auth|login\.tsx|api\/admin\/login/);
    expect(accessModelSource).not.toMatch(
      /processDentalLead|\/api\/leads\/create|BookingDialog|Calendar|Gmail|FloatingDentalAIChat|Home|siteServices/,
    );
  });
});

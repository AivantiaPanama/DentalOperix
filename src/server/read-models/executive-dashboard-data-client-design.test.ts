import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import type { Permission } from "../../lib/rbac/permissions";
import { createExecutiveDashboardAccessModel } from "./executive-dashboard-access-model";
import { createExecutiveDashboardApiContracts } from "./executive-dashboard-api-contracts";
import {
  EXECUTIVE_DASHBOARD_DATA_CLIENT_DESIGN_VERSION,
  assertExecutiveDashboardDataClientDesign,
  createExecutiveDashboardDataClientDesign,
  createExecutiveDashboardDataClientRequestDescriptor,
} from "./executive-dashboard-data-client-design";

const dataClientSource = readFileSync(
  fileURLToPath(new URL("./executive-dashboard-data-client-design.ts", import.meta.url)),
  "utf8",
);

describe("17.3-E executive dashboard data client design", () => {
  it("creates a contract-bound data client design approved for future implementation", () => {
    const contracts = createExecutiveDashboardApiContracts(undefined, "2026-01-01T00:00:00.000Z");
    const accessModel = createExecutiveDashboardAccessModel(contracts, undefined, "2026-01-01T00:00:00.000Z");
    const design = createExecutiveDashboardDataClientDesign(contracts, accessModel, "2026-01-01T00:00:00.000Z");

    expect(design).toMatchObject({
      version: EXECUTIVE_DASHBOARD_DATA_CLIENT_DESIGN_VERSION,
      phase: "17.3-E",
      status: "approved-for-future-dashboard-client-implementation",
      generatedAt: "2026-01-01T00:00:00.000Z",
      mode: "contract-bound-metric-read",
      accessModelVersion: accessModel.version,
      apiContractVersion: contracts.responses.snapshot.version,
      nextPhase: "17.3-F Dashboard View Model Design",
    });
    expect(() => assertExecutiveDashboardDataClientDesign(design)).not.toThrow();
  });

  it("defines exactly three metric-only endpoint bindings through ExecutiveDashboardApiContracts", () => {
    const design = createExecutiveDashboardDataClientDesign();

    expect(design.endpointBindings).toEqual([
      {
        surface: "executive",
        route: "/api/internal/executive-observability/executive",
        method: "GET",
        requiredPermission: "executive-observability:read",
        allowedContract: "ExecutiveDashboardApiContracts",
        accessModelVersion: "executive-dashboard-access-model/v1",
        responseExposure: "metric-only",
        transportStatus: "transport-contract-only",
        clientComputation: "projection-free-display-mapping-only",
      },
      {
        surface: "operational",
        route: "/api/internal/executive-observability/operational",
        method: "GET",
        requiredPermission: "executive-observability:read",
        allowedContract: "ExecutiveDashboardApiContracts",
        accessModelVersion: "executive-dashboard-access-model/v1",
        responseExposure: "metric-only",
        transportStatus: "transport-contract-only",
        clientComputation: "projection-free-display-mapping-only",
      },
      {
        surface: "governance",
        route: "/api/internal/executive-observability/governance",
        method: "GET",
        requiredPermission: "executive-observability:read",
        allowedContract: "ExecutiveDashboardApiContracts",
        accessModelVersion: "executive-dashboard-access-model/v1",
        responseExposure: "metric-only",
        transportStatus: "transport-contract-only",
        clientComputation: "projection-free-display-mapping-only",
      },
    ]);
  });

  it("creates approved request descriptors only when access model allows the principal", () => {
    const contracts = createExecutiveDashboardApiContracts(undefined, "2026-01-01T00:00:00.000Z");
    const accessModel = createExecutiveDashboardAccessModel(contracts, undefined, "2026-01-01T00:00:00.000Z");
    const design = createExecutiveDashboardDataClientDesign(contracts, accessModel, "2026-01-01T00:00:00.000Z");
    const allowedPermissions: Permission[] = ["executive-observability:read"];
    const deniedPermissions: Permission[] = ["reports:read", "kpis:read"];

    expect(
      createExecutiveDashboardDataClientRequestDescriptor(
        design,
        accessModel,
        { id: "admin-user", permissions: allowedPermissions },
        "executive",
      ),
    ).toMatchObject({
      status: "approved-request-descriptor",
      surface: "executive",
      route: "/api/internal/executive-observability/executive",
      method: "GET",
      allowedContract: "ExecutiveDashboardApiContracts",
      responseExposure: "metric-only",
      transportStatus: "transport-contract-only",
      access: {
        decision: "allow",
        reason: "permission-present",
        requiredPermission: "executive-observability:read",
        accessLevel: "metric-only-read",
      },
    });

    expect(
      createExecutiveDashboardDataClientRequestDescriptor(
        design,
        accessModel,
        { id: "assistant-user", permissions: deniedPermissions },
        "governance",
      ),
    ).toMatchObject({
      status: "denied-request-descriptor",
      surface: "governance",
      route: "/api/internal/executive-observability/governance",
      method: "GET",
      allowedContract: "ExecutiveDashboardApiContracts",
      responseExposure: "metric-only",
      transportStatus: "transport-contract-only",
      access: {
        decision: "deny",
        reason: "missing-executive-observability-read",
        requiredPermission: "executive-observability:read",
        accessLevel: "metric-only-read",
      },
    });
  });

  it("preserves governance guardrails and does not implement transport, fetch, storage, UI, routes, or API", () => {
    const design = createExecutiveDashboardDataClientDesign();

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

  it("keeps the data client isolated from forbidden dependencies and client-side computation", () => {
    const design = createExecutiveDashboardDataClientDesign();

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
    ]);

    expect(design.endpointBindings.every((binding) => binding.clientComputation === "projection-free-display-mapping-only"))
      .toBe(true);
  });

  it("does not import UI components, routes, aggregates, adapters, raw telemetry, admin login, browser storage, or lead write paths", () => {
    expect(dataClientSource).toContain("./executive-dashboard-api-contracts");
    expect(dataClientSource).toContain("./executive-dashboard-access-model");
    expect(dataClientSource).not.toMatch(/from\s+["'].+components\//);
    expect(dataClientSource).not.toMatch(/from\s+["'].+routes\//);
    expect(dataClientSource).not.toMatch(/from\s+["'].+aggregate-read-service["']/);
    expect(dataClientSource).not.toMatch(/from\s+["'].+read-adapter["']/);
    expect(dataClientSource).not.toMatch(/from\s+["'].+read-source["']/);
    expect(dataClientSource).not.toMatch(/from\s+["'].+read-model-source-provider["']/);
    expect(dataClientSource).not.toMatch(/ReadTelemetryEvent|FallbackTelemetryEvent|AggregateTelemetryEvent|DomainTelemetryEvent/);
    expect(dataClientSource).not.toMatch(/fetch\(|axios|localStorage|sessionStorage|indexedDB|document\.cookie/);
    expect(dataClientSource).not.toMatch(/createFileRoute|createServerFileRoute|route\(/);
    expect(dataClientSource).not.toMatch(/admin-auth|login\.tsx|api\/admin\/login/);
    expect(dataClientSource).not.toMatch(
      /processDentalLead|\/api\/leads\/create|BookingDialog|Calendar|Gmail|FloatingDentalAIChat|Home|siteServices/,
    );
  });
});

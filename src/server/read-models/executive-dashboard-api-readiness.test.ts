import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { beforeEach, describe, expect, it } from "vitest";
import { readObservabilityProvider } from "./read-observability-provider";
import { createExecutiveDashboardApiContracts } from "./executive-dashboard-api-contracts";
import {
  EXECUTIVE_DASHBOARD_API_READINESS_VERSION,
  assertExecutiveDashboardApiReadiness,
  createExecutiveDashboardApiReadinessReport,
} from "./executive-dashboard-api-readiness";

const readinessSource = readFileSync(
  fileURLToPath(new URL("./executive-dashboard-api-readiness.ts", import.meta.url)),
  "utf8",
);


describe("executive dashboard API implementation readiness", () => {
  beforeEach(() => {
    readObservabilityProvider.clearBufferedEvents();
    readObservabilityProvider.setSink(undefined);
  });

  it("marks planned internal endpoints as ready without creating routes or UI", () => {
    const report = createExecutiveDashboardApiReadinessReport(
      createExecutiveDashboardApiContracts(undefined, "2026-01-01T00:00:00.000Z"),
      "2026-01-01T00:00:00.000Z",
    );

    expect(report).toMatchObject({
      version: EXECUTIVE_DASHBOARD_API_READINESS_VERSION,
      status: "ready-for-implementation",
      guarantees: {
        routeImplementationIncluded: false,
        uiImplementationIncluded: false,
        aggregateAccess: false,
        adapterAccess: false,
      },
      validation: {
        apiContractsMetricOnly: true,
        endpointCount: 4,
      },
    });
    expect(() => assertExecutiveDashboardApiReadiness(report)).not.toThrow();
    expect(report.endpoints.every((endpoint) => endpoint.implementationStatus === "planned")).toBe(true);
  });

  it("requires internal authentication and authorization for every candidate endpoint", () => {
    const report = createExecutiveDashboardApiReadinessReport();

    expect(report.endpoints).toHaveLength(4);
    expect(report.endpoints).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ route: "/api/internal/executive-observability/executive" }),
        expect.objectContaining({ route: "/api/internal/executive-observability/operational" }),
        expect.objectContaining({ route: "/api/internal/executive-observability/governance" }),
        expect.objectContaining({ route: "/api/internal/executive-observability/snapshot" }),
      ]),
    );
    for (const endpoint of report.endpoints) {
      expect(endpoint.security).toEqual({
        authenticationRequired: true,
        authorizationRequired: true,
        requiredCapability: "executive-observability:read",
        internalOnly: true,
        exposesRawTelemetry: false,
        exposesFunctionalPayloads: false,
      });
    }
  });

  it("keeps readiness metric-only and rejects raw telemetry or functional payload exposure", () => {
    readObservabilityProvider.trackAggregate({
      consumerName: "Executive API Readiness Guard",
      domain: "Support",
      aggregate: "SupportAggregateReadService",
      success: true,
      recordCount: 3,
      diagnostics: {
        telemetry: "must-not-leak",
        supportTickets: [{ id: "TCK-1" }],
        patientRecords: [{ id: "PAT-1" }],
      },
    });
    readObservabilityProvider.trackRead({
      consumerName: "Executive API Readiness Guard",
      domain: "Support",
      aggregate: "SupportAggregateReadService",
      source: "ReadModel",
      recordCount: 3,
    });

    const report = createExecutiveDashboardApiReadinessReport();
    const serialized = JSON.stringify(report);

    expect(() => assertExecutiveDashboardApiReadiness(report)).not.toThrow();
    expect(serialized).not.toContain("diagnostics");
    expect(serialized).not.toContain("telemetry");
    expect(serialized).not.toContain("supportTickets");
    expect(serialized).not.toContain("patientRecords");
    expect(serialized).not.toContain("resolvedIdentity");
  });

  it("does not import aggregates, adapters, read model source provider, routes, or UI", () => {
    expect(readinessSource).toContain("./executive-dashboard-api-contracts");
    expect(readinessSource).not.toMatch(/from\s+["'].+aggregate-read-service["']/);
    expect(readinessSource).not.toMatch(/from\s+["'].+read-adapter["']/);
    expect(readinessSource).not.toMatch(/from\s+["'].+read-model-source-provider["']/);
    expect(readinessSource).not.toMatch(/from\s+["'].+components\//);
    expect(readinessSource).not.toMatch(/createFileRoute|createServerFileRoute|route\(/);
  });

  it("keeps readiness reporting independent from concrete route files", () => {
    const report = createExecutiveDashboardApiReadinessReport();

    expect(report.guarantees.routeImplementationIncluded).toBe(false);
    expect(report.endpoints.every((endpoint) => endpoint.implementationStatus === "planned")).toBe(true);
    expect(readinessSource).not.toMatch(/from\s+["'].+routes\//);
    expect(readinessSource).not.toMatch(/fileURLToPath\(new URL\("\.\.\/\.\.\/routes/);
  });
});

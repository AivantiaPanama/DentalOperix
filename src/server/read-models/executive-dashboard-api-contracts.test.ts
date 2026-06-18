import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { beforeEach, describe, expect, it } from "vitest";
import { readObservabilityProvider } from "./read-observability-provider";
import {
  EXECUTIVE_DASHBOARD_API_CONTRACT_VERSION,
  EXECUTIVE_DASHBOARD_API_ENDPOINTS,
  assertExecutiveDashboardApiContractsAreMetricOnly,
  createExecutiveDashboardApiContracts,
  serializeExecutiveDashboardApiContracts,
} from "./executive-dashboard-api-contracts";
import { EXECUTIVE_DASHBOARD_CONTRACT_VERSION } from "./executive-dashboard-contracts";

const apiContractSource = readFileSync(
  fileURLToPath(new URL("./executive-dashboard-api-contracts.ts", import.meta.url)),
  "utf8",
);

describe("executive dashboard API contract plan", () => {
  beforeEach(() => {
    readObservabilityProvider.clearBufferedEvents();
    readObservabilityProvider.setSink(undefined);
  });

  it("defines internal GET endpoint contracts without implementing routes or UI", () => {
    expect(EXECUTIVE_DASHBOARD_API_ENDPOINTS).toEqual([
      expect.objectContaining({
        method: "GET",
        route: "/api/internal/executive-observability/executive",
        audience: "executive",
        exposesRawTelemetry: false,
        exposesFunctionalPayloads: false,
      }),
      expect.objectContaining({
        method: "GET",
        route: "/api/internal/executive-observability/operational",
        audience: "operational",
        exposesRawTelemetry: false,
        exposesFunctionalPayloads: false,
      }),
      expect.objectContaining({
        method: "GET",
        route: "/api/internal/executive-observability/governance",
        audience: "governance",
        exposesRawTelemetry: false,
        exposesFunctionalPayloads: false,
      }),
      expect.objectContaining({
        method: "GET",
        route: "/api/internal/executive-observability/snapshot",
        audience: "snapshot",
        exposesRawTelemetry: false,
        exposesFunctionalPayloads: false,
      }),
    ]);
    expect(apiContractSource).not.toMatch(/createFileRoute|createServerFileRoute|route\(/);
    expect(apiContractSource).not.toMatch(/from\s+["']react["']/);
  });

  it("wraps dashboard contracts in a versioned API response envelope", () => {
    readObservabilityProvider.trackRead({
      consumerName: "Executive API Contract Validation",
      domain: "Operations",
      aggregate: "OperationsAggregateReadService",
      source: "ReadModel",
      recordCount: 4,
      durationMs: 20,
    });
    readObservabilityProvider.trackAggregate({
      consumerName: "Executive API Contract Validation",
      domain: "Operations",
      aggregate: "OperationsAggregateReadService",
      success: true,
      recordCount: 4,
    });

    const contracts = createExecutiveDashboardApiContracts(undefined, "2026-01-01T00:00:00.000Z");

    expect(contracts.responses.executive).toMatchObject({
      version: EXECUTIVE_DASHBOARD_API_CONTRACT_VERSION,
      dashboardContractVersion: EXECUTIVE_DASHBOARD_CONTRACT_VERSION,
      generatedAt: "2026-01-01T00:00:00.000Z",
    });
    expect(contracts.responses.executive.payload.dashboard.platform.totalReads).toBe(1);
    expect(contracts.responses.operational.payload.dashboard.aggregates[0]).toMatchObject({
      aggregate: "OperationsAggregateReadService",
      requestVolume: 2,
    });
    expect(contracts.responses.snapshot.payload.executive.audience).toBe("executive");
    expect(contracts.responses.snapshot.payload.governance.audience).toBe("governance");
  });

  it("keeps API payloads metric-only and never exposes raw telemetry or functional records", () => {
    readObservabilityProvider.trackAggregate({
      consumerName: "Executive API Payload Guard",
      domain: "Inventory",
      aggregate: "InventoryAggregateReadService",
      success: true,
      recordCount: 2,
      diagnostics: {
        events: [{ id: "raw-event" }],
        patientRecords: [{ id: "PAT-1" }],
        invoiceRecords: [{ id: "INV-1" }],
        ticketRecords: [{ id: "TCK-1" }],
        telemetry: "must-not-leak",
      },
    });
    readObservabilityProvider.trackRead({
      consumerName: "Executive API Payload Guard",
      domain: "Inventory",
      aggregate: "InventoryAggregateReadService",
      source: "ReadModel",
      recordCount: 2,
    });

    const contracts = createExecutiveDashboardApiContracts(undefined, "2026-01-01T00:00:00.000Z");
    const serialized = serializeExecutiveDashboardApiContracts(contracts);

    expect(() => assertExecutiveDashboardApiContractsAreMetricOnly(contracts)).not.toThrow();
    expect(serialized).not.toContain("diagnostics");
    expect(serialized).not.toContain("rawTelemetry");
    expect(serialized).not.toContain("events");
    expect(serialized).not.toContain("patientRecords");
    expect(serialized).not.toContain("invoiceRecords");
    expect(serialized).not.toContain("ticketRecords");
    expect(serialized).not.toContain("resolvedIdentity");
  });

  it("depends only on dashboard contracts and not on aggregates, adapters, read model source provider, or UI", () => {
    expect(apiContractSource).toContain("./executive-dashboard-contracts");
    expect(apiContractSource).not.toMatch(/from\s+["'].+aggregate-read-service["']/);
    expect(apiContractSource).not.toMatch(/from\s+["'].+read-adapter["']/);
    expect(apiContractSource).not.toMatch(/from\s+["'].+read-model-source-provider["']/);
    expect(apiContractSource).not.toMatch(/from\s+["'].+components\//);
  });
});

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { beforeEach, describe, expect, it } from "vitest";
import { readObservabilityProvider } from "./read-observability-provider";
import {
  EXECUTIVE_DASHBOARD_CONTRACT_VERSION,
  EXECUTIVE_DASHBOARD_METRIC_CATALOG,
  assertExecutiveDashboardContractsAreMetricOnly,
  createExecutiveDashboardContracts,
  serializeExecutiveDashboardContracts,
} from "./executive-dashboard-contracts";

const contractSource = readFileSync(
  fileURLToPath(new URL("./executive-dashboard-contracts.ts", import.meta.url)),
  "utf8",
);

describe("executive dashboard contracts assessment", () => {
  beforeEach(() => {
    readObservabilityProvider.clearBufferedEvents();
    readObservabilityProvider.setSink(undefined);
  });

  it("creates versioned dashboard contracts for executive, operational, and governance audiences", () => {
    readObservabilityProvider.trackRead({
      consumerName: "Executive Dashboard Contract Validation",
      domain: "Finance",
      aggregate: "FinanceAggregateReadService",
      source: "ReadModel",
      recordCount: 10,
      durationMs: 12,
    });
    readObservabilityProvider.trackAggregate({
      consumerName: "Executive Dashboard Contract Validation",
      domain: "Finance",
      aggregate: "FinanceAggregateReadService",
      success: true,
      recordCount: 10,
    });

    const contracts = createExecutiveDashboardContracts(undefined, "2026-01-01T00:00:00.000Z");

    expect(contracts.executive).toMatchObject({
      version: EXECUTIVE_DASHBOARD_CONTRACT_VERSION,
      audience: "executive",
      generatedAt: "2026-01-01T00:00:00.000Z",
    });
    expect(contracts.operational).toMatchObject({ audience: "operational" });
    expect(contracts.governance).toMatchObject({ audience: "governance" });
    expect(contracts.executive.dashboard.platform.totalReads).toBe(1);
    expect(contracts.operational.dashboard.aggregates[0]).toMatchObject({
      aggregate: "FinanceAggregateReadService",
      requestVolume: 2,
    });
    expect(contracts.governance.dashboard.governance.registryCompliance).toBe(1);
  });

  it("publishes a metric catalog that contains only metric fields", () => {
    expect(EXECUTIVE_DASHBOARD_METRIC_CATALOG.platform).toEqual([
      "readSuccessRate",
      "fallbackRate",
      "errorRate",
      "domainCoverage",
      "totalReads",
      "totalFallbacks",
      "totalErrors",
    ]);
    expect(EXECUTIVE_DASHBOARD_METRIC_CATALOG.domain).toEqual([
      "domain",
      "readVolume",
      "fallbackVolume",
      "errorVolume",
      "adoptionScore",
    ]);
    expect(EXECUTIVE_DASHBOARD_METRIC_CATALOG.aggregate).toEqual([
      "aggregate",
      "requestVolume",
      "latency",
      "fallbackRate",
      "reliability",
    ]);
    expect(EXECUTIVE_DASHBOARD_METRIC_CATALOG.governance).toEqual([
      "observabilityCoverage",
      "fallbackCompliance",
      "adrCompliance",
      "registryCompliance",
    ]);
  });

  it("rejects raw telemetry, diagnostics, and functional payload fields", () => {
    readObservabilityProvider.trackAggregate({
      consumerName: "Dashboard Contract Payload Guard",
      domain: "Support",
      aggregate: "SupportAggregateReadService",
      success: true,
      recordCount: 3,
      diagnostics: {
        supportTickets: [{ id: "TCK-1" }],
        telemetry: "must-not-leak",
      },
    });
    readObservabilityProvider.trackRead({
      consumerName: "Dashboard Contract Payload Guard",
      domain: "Support",
      aggregate: "SupportAggregateReadService",
      source: "ReadModel",
      recordCount: 3,
    });

    const contracts = createExecutiveDashboardContracts(undefined, "2026-01-01T00:00:00.000Z");
    const serialized = serializeExecutiveDashboardContracts(contracts);

    expect(() => assertExecutiveDashboardContractsAreMetricOnly(contracts)).not.toThrow();
    expect(serialized).not.toContain("supportTickets");
    expect(serialized).not.toContain("telemetry");
    expect(serialized).not.toContain("diagnostics");
    expect(serialized).not.toContain("resolvedIdentity");
  });

  it("keeps dashboard contracts independent from aggregates, adapters, read model source provider, and UI", () => {
    expect(contractSource).toContain("./executive-observability-provider");
    expect(contractSource).not.toMatch(/from\s+["'].+aggregate-read-service["']/);
    expect(contractSource).not.toMatch(/from\s+["'].+read-adapter["']/);
    expect(contractSource).not.toMatch(/from\s+["'].+read-model-source-provider["']/);
    expect(contractSource).not.toMatch(/from\s+["']react["']/);
  });
});

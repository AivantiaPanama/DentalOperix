import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { beforeEach, describe, expect, it } from "vitest";
import { readObservabilityProvider } from "./read-observability-provider";
import {
  EXECUTIVE_OBSERVABILITY_DOMAINS,
  executiveObservabilityProvider,
} from "./executive-observability-provider";

const providerSource = readFileSync(fileURLToPath(new URL("./executive-observability-provider.ts", import.meta.url)), "utf8");

describe("executive observability hardening and closure", () => {
  beforeEach(() => {
    readObservabilityProvider.clearBufferedEvents();
    readObservabilityProvider.setSink(undefined);
  });

  it("keeps Executive Observability as infrastructure and not as a ninth read domain", () => {
    expect(EXECUTIVE_OBSERVABILITY_DOMAINS).toEqual([
      "Patient",
      "CRM",
      "Billing",
      "Clinical",
      "Operations",
      "Finance",
      "Inventory",
      "Support",
    ]);
    expect(EXECUTIVE_OBSERVABILITY_DOMAINS).not.toContain("Executive" as never);
  });

  it("reuses read telemetry exclusively and does not import aggregate services or adapters", () => {
    expect(providerSource).toContain("./read-observability-provider");
    expect(providerSource).not.toMatch(/from\s+["'].+aggregate-read-service["']/);
    expect(providerSource).not.toMatch(/from\s+["'].+read-adapter["']/);
    expect(providerSource).not.toMatch(/from\s+["'].+read-model-source-provider["']/);
  });

  it("does not expose raw telemetry, diagnostics, or functional domain payloads through dashboard contracts", () => {
    readObservabilityProvider.trackAggregate({
      consumerName: "Executive Closure Validation",
      domain: "Finance",
      aggregate: "FinanceAggregateReadService",
      success: true,
      recordCount: 2,
      diagnostics: {
        internalTraceId: "trace-should-not-leak",
        invoices: [{ id: "INV-1" }],
      },
    });
    readObservabilityProvider.trackRead({
      consumerName: "Executive Closure Validation",
      domain: "Finance",
      aggregate: "FinanceAggregateReadService",
      source: "ReadModel",
      recordCount: 2,
      durationMs: 15,
    });

    const snapshot = executiveObservabilityProvider.getSnapshot();
    const serialized = JSON.stringify(snapshot);

    expect(snapshot.executive.platform.totalReads).toBe(1);
    expect(snapshot.operational.aggregates).toHaveLength(1);
    expect(serialized).not.toContain("diagnostics");
    expect(serialized).not.toContain("internalTraceId");
    expect(serialized).not.toContain("invoices");
    expect(serialized).not.toContain("telemetry");
  });

  it("preserves platform freeze boundaries with metric-only dashboard contracts", () => {
    readObservabilityProvider.trackRead({
      consumerName: "Support Executive Metrics",
      domain: "Support",
      aggregate: "SupportAggregateReadService",
      source: "ReadModel",
      recordCount: 5,
    });
    readObservabilityProvider.trackFallback({
      consumerName: "Inventory Executive Metrics",
      domain: "Inventory",
      aggregate: "InventoryAggregateReadService",
      reason: "read-model-unavailable",
    });

    const executiveDashboard = executiveObservabilityProvider.getExecutiveDashboard();
    const operationalDashboard = executiveObservabilityProvider.getOperationalDashboard();
    const governanceDashboard = executiveObservabilityProvider.getGovernanceDashboard();

    expect(Object.keys(executiveDashboard).sort()).toEqual(["domains", "platform"]);
    expect(Object.keys(operationalDashboard).sort()).toEqual(["aggregates"]);
    expect(Object.keys(governanceDashboard).sort()).toEqual(["governance"]);
    expect(executiveDashboard.domains.find((metric) => metric.domain === "Support")).toMatchObject({ readVolume: 1 });
    expect(governanceDashboard.governance.adrCompliance).toBe(1);
    expect(governanceDashboard.governance.registryCompliance).toBe(1);
  });
});

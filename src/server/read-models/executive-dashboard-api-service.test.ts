import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { beforeEach, describe, expect, it } from "vitest";
import { readObservabilityProvider } from "./read-observability-provider";
import { EXECUTIVE_DASHBOARD_API_CONTRACT_VERSION } from "./executive-dashboard-api-contracts";
import {
  createExecutiveDashboardApiPayload,
  createExecutiveDashboardApiSnapshot,
  serializeExecutiveDashboardApiPayload,
} from "./executive-dashboard-api-service";

const serviceSource = readFileSync(
  fileURLToPath(new URL("./executive-dashboard-api-service.ts", import.meta.url)),
  "utf8",
);

describe("executive dashboard API service", () => {
  beforeEach(() => {
    readObservabilityProvider.clearBufferedEvents();
    readObservabilityProvider.setSink(undefined);
  });

  it("returns metric-only payloads for every internal dashboard audience", () => {
    readObservabilityProvider.trackRead({
      consumerName: "Executive Dashboard API Service Test",
      domain: "Finance",
      aggregate: "FinanceAggregateReadService",
      source: "ReadModel",
      recordCount: 4,
      durationMs: 16,
    });
    readObservabilityProvider.trackAggregate({
      consumerName: "Executive Dashboard API Service Test",
      domain: "Finance",
      aggregate: "FinanceAggregateReadService",
      success: true,
      recordCount: 4,
    });

    const generatedAt = "2026-01-01T00:00:00.000Z";
    const executive = createExecutiveDashboardApiPayload("executive", generatedAt);
    const operational = createExecutiveDashboardApiPayload("operational", generatedAt);
    const governance = createExecutiveDashboardApiPayload("governance", generatedAt);
    const snapshot = createExecutiveDashboardApiPayload("snapshot", generatedAt);

    expect(executive).toMatchObject({
      version: EXECUTIVE_DASHBOARD_API_CONTRACT_VERSION,
      generatedAt,
    });
    expect(executive.payload.dashboard.platform.totalReads).toBe(1);
    expect(operational.payload.dashboard.aggregates[0]).toMatchObject({
      aggregate: "FinanceAggregateReadService",
      requestVolume: 2,
    });
    expect(governance.payload.dashboard.governance.registryCompliance).toBe(1);
    expect(snapshot.payload.executive.audience).toBe("executive");
  });

  it("does not serialize raw telemetry, diagnostics, or functional records", () => {
    readObservabilityProvider.trackAggregate({
      consumerName: "Executive Dashboard API Service Guard",
      domain: "Support",
      aggregate: "SupportAggregateReadService",
      success: true,
      recordCount: 1,
      diagnostics: {
        telemetry: "must-not-leak",
        events: [{ id: "evt-1" }],
        patientRecords: [{ id: "PAT-1" }],
        ticketRecords: [{ id: "TCK-1" }],
      },
    });

    const payload = createExecutiveDashboardApiPayload("snapshot", "2026-01-01T00:00:00.000Z");
    const serialized = serializeExecutiveDashboardApiPayload(payload);

    expect(serialized).not.toContain("diagnostics");
    expect(serialized).not.toContain("telemetry");
    expect(serialized).not.toContain("events");
    expect(serialized).not.toContain("patientRecords");
    expect(serialized).not.toContain("ticketRecords");
    expect(serialized).not.toContain("resolvedIdentity");
  });

  it("provides the full internal API snapshot without exposing implementation details", () => {
    const snapshot = createExecutiveDashboardApiSnapshot("2026-01-01T00:00:00.000Z");

    expect(snapshot.endpoints).toHaveLength(4);
    expect(snapshot.responses.executive.payload.audience).toBe("executive");
    expect(JSON.stringify(snapshot)).not.toContain("rawTelemetry");
    expect(JSON.stringify(snapshot)).not.toContain("readModels");
  });

  it("depends only on executive dashboard API contracts and not aggregates, adapters, routes, or UI", () => {
    expect(serviceSource).toContain("./executive-dashboard-api-contracts");
    expect(serviceSource).not.toMatch(/from\s+["'].+aggregate-read-service["']/);
    expect(serviceSource).not.toMatch(/from\s+["'].+read-adapter["']/);
    expect(serviceSource).not.toMatch(/from\s+["'].+read-model-source-provider["']/);
    expect(serviceSource).not.toMatch(/from\s+["'].+components\//);
    expect(serviceSource).not.toMatch(/createFileRoute|createServerFileRoute/);
  });
});

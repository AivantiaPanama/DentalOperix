import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  EXECUTIVE_DASHBOARD_API_ENDPOINTS,
  createExecutiveDashboardApiContracts,
  serializeExecutiveDashboardApiContracts,
} from "./executive-dashboard-api-contracts";
import { createExecutiveDashboardApiSnapshot } from "./executive-dashboard-api-service";

const serviceSource = readFileSync(
  fileURLToPath(new URL("./executive-dashboard-api-service.ts", import.meta.url)),
  "utf8",
);

const handlerSource = readFileSync(
  fileURLToPath(
    new URL("../../routes/api/internal/executive-observability/-handler.ts", import.meta.url),
  ),
  "utf8",
);

const endpointSources = ["executive.ts", "operational.ts", "governance.ts", "snapshot.ts"].map(
  (fileName) =>
    readFileSync(
      fileURLToPath(
        new URL(`../../routes/api/internal/executive-observability/${fileName}`, import.meta.url),
      ),
      "utf8",
    ),
);

describe("17.2-E executive dashboard internal API validation and closure", () => {
  it("keeps every internal endpoint metric-only and permission scoped", () => {
    expect(EXECUTIVE_DASHBOARD_API_ENDPOINTS).toHaveLength(4);
    expect(EXECUTIVE_DASHBOARD_API_ENDPOINTS.map((endpoint) => endpoint.route).sort()).toEqual([
      "/api/internal/executive-observability/executive",
      "/api/internal/executive-observability/governance",
      "/api/internal/executive-observability/operational",
      "/api/internal/executive-observability/snapshot",
    ]);

    for (const endpoint of EXECUTIVE_DASHBOARD_API_ENDPOINTS) {
      expect(endpoint.method).toBe("GET");
      expect(endpoint.exposesRawTelemetry).toBe(false);
      expect(endpoint.exposesFunctionalPayloads).toBe(false);
    }

    expect(handlerSource).toContain("executive-observability:read");
  });

  it("does not expose raw telemetry, diagnostics, or functional records through API snapshots", () => {
    const contracts = createExecutiveDashboardApiContracts(undefined, "2026-01-01T00:00:00.000Z");
    const snapshot = createExecutiveDashboardApiSnapshot("2026-01-01T00:00:00.000Z");
    const serialized = `${serializeExecutiveDashboardApiContracts(contracts)}${JSON.stringify(snapshot)}`;

    expect(serialized).not.toContain("rawTelemetry");
    expect(serialized).not.toContain("diagnostics");
    expect(serialized).not.toContain("resolvedIdentity");
    expect(serialized).not.toContain("patientRecords");
    expect(serialized).not.toContain("invoiceRecords");
    expect(serialized).not.toContain("ticketRecords");
    expect(serialized).not.toContain("eventBuffer");
  });

  it("keeps the API service and route handlers isolated from aggregates, adapters, UI, and lead writes", () => {
    const combinedSource = [serviceSource, handlerSource, ...endpointSources].join("\n");

    expect(combinedSource).toContain("executive-dashboard-api-service");
    expect(combinedSource).not.toMatch(/aggregate-read-service/);
    expect(combinedSource).not.toMatch(/read-adapter/);
    expect(combinedSource).not.toMatch(/read-model-source-provider/);
    expect(combinedSource).not.toMatch(/processDentalLead/);
    expect(combinedSource).not.toMatch(/api\/leads\/create/);
    expect(combinedSource).not.toMatch(/components\//);
  });
});

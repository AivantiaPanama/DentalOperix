import { describe, expect, it } from "vitest";
import type { CrmLeadRow } from "./crm-metrics";
import { createExecutiveAnalyticsSnapshot, EXECUTIVE_ANALYTICS_VERSION } from "./executive-analytics";
import { createRevenueForecastSnapshot } from "./revenue-forecast";
import { createRevenueSnapshotV1 } from "./revenue-intelligence";

const generatedAt = "2026-06-19T12:00:00.000Z";

function createRows(): CrmLeadRow[] {
  return [
    {
      id: "1",
      date: "2026-06-01",
      name: "Ana",
      phone: "",
      email: "ana@example.com",
      treatment: "Ortodoncia",
      message: "Consulta",
      status: "agendada",
      source: "google",
    },
    {
      id: "2",
      date: "2026-06-02",
      name: "Bruno",
      phone: "",
      email: "bruno@example.com",
      treatment: "Ortodoncia",
      message: "Consulta",
      status: "completada",
      source: "google",
    },
    {
      id: "3",
      date: "2026-06-03",
      name: "Carla",
      phone: "",
      email: "carla@example.com",
      treatment: "Implantes Dentales",
      message: "Consulta",
      status: "completada",
      source: "facebook",
    },
    {
      id: "4",
      date: "2026-06-04",
      name: "Diego",
      phone: "",
      email: "diego@example.com",
      treatment: "Blanqueamiento Dental",
      message: "Consulta",
      status: "no asistió",
      source: "instagram",
    },
  ];
}

describe("executive analytics", () => {
  it("creates a read-only executive analytics snapshot from revenue snapshots", () => {
    const revenue = createRevenueSnapshotV1(createRows());
    const forecast = createRevenueForecastSnapshot(revenue, generatedAt);
    const executive = createExecutiveAnalyticsSnapshot(revenue, forecast, generatedAt);

    expect(executive.version).toBe(EXECUTIVE_ANALYTICS_VERSION);
    expect(executive.generatedAt).toBe(generatedAt);
    expect(executive.sourceSnapshotVersion).toBe("58.2-v1");
    expect(executive.sourceForecastVersion).toBe("58.5-v1");
    expect(executive.summary.revenueScore.value).toBeGreaterThan(0);
    expect(executive.summary.growthScore.value).toBeGreaterThanOrEqual(0);
    expect(executive.summary.opportunityIndex.value).toBeGreaterThan(0);
    expect(executive.rankings.sources.length).toBeGreaterThan(0);
    expect(executive.rankings.services.length).toBeGreaterThan(0);
    expect(executive.opportunities.length).toBeGreaterThan(0);
    expect(executive.governance.readOnly).toBe(true);
    expect(executive.governance.sourceOfTruth).toBe("Leads");
    expect(executive.governance.revenueType).toBe("estimated");
  });

  it("handles empty revenue snapshots without introducing persistence assumptions", () => {
    const revenue = createRevenueSnapshotV1([]);
    const forecast = createRevenueForecastSnapshot(revenue, generatedAt);
    const executive = createExecutiveAnalyticsSnapshot(revenue, forecast, generatedAt);

    expect(executive.summary.revenueScore.value).toBeGreaterThanOrEqual(0);
    expect(executive.rankings.sources).toEqual([]);
    expect(executive.rankings.services).toEqual([]);
    expect(executive.governance.limitations[0]).toContain("no escribe datos maestros");
  });
});

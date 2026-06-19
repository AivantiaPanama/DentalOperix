import { describe, expect, it } from "vitest";
import { createRevenueSnapshotV1 } from "./revenue-intelligence";
import { createRevenueForecastSnapshot, REVENUE_FORECAST_VERSION } from "./revenue-forecast";
import type { CrmLeadRow } from "./crm-metrics";

const generatedAt = "2026-06-19T12:00:00.000Z";

describe("revenue forecast", () => {
  it("creates a deterministic read-only forecast from RevenueSnapshotV1", () => {
    const rows: CrmLeadRow[] = [
      {
        id: "1",
        date: "2026-06-01",
        name: "Ana",
        phone: "",
        email: "ana@example.com",
        treatment: "Ortodoncia",
        message: "Consulta",
        status: "nuevo",
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
        status: "agendada",
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
        status: "cancelada",
        source: "instagram",
      },
    ];

    const snapshot = createRevenueSnapshotV1(rows);
    const forecast = createRevenueForecastSnapshot(snapshot, generatedAt);

    expect(forecast.version).toBe(REVENUE_FORECAST_VERSION);
    expect(forecast.generatedAt).toBe(generatedAt);
    expect(forecast.sourceSnapshotVersion).toBe("58.2-v1");
    expect(forecast.revenue.currentExpectedRevenue).toBe(snapshot.pipeline.expectedRevenue);
    expect(forecast.revenue.expectedRevenue30Days).toBeGreaterThan(0);
    expect(forecast.appointments.expectedAppointments30Days).toBeGreaterThan(0);
    expect(forecast.quality.limitations).toContain(
      "Forecast basado en revenue estimado; no representa ingresos reales cobrados.",
    );
  });

  it("flags low-confidence forecasts when history is insufficient", () => {
    const snapshot = createRevenueSnapshotV1([]);
    const forecast = createRevenueForecastSnapshot(snapshot, generatedAt);

    expect(forecast.revenue.confidence).toBe("low");
    expect(forecast.appointments.confidence).toBe("low");
    expect(forecast.quality.dataPoints).toBe(0);
    expect(forecast.risks.some((risk) => risk.code === "INSUFFICIENT_HISTORY")).toBe(true);
    expect(forecast.revenue.expectedRevenue30Days).toBe(0);
  });
});

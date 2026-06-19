import { describe, expect, it } from "vitest";
import { createRevenueSnapshotV1, REVENUE_INTELLIGENCE_VERSION } from "./revenue-intelligence";
import type { CrmLeadRow } from "./crm-metrics";

describe("revenue intelligence", () => {
  it("creates an empty read-only revenue snapshot", () => {
    expect(createRevenueSnapshotV1([])).toEqual({
      version: REVENUE_INTELLIGENCE_VERSION,
      totals: {
        leads: 0,
        scheduled: 0,
        completed: 0,
        cancelled: 0,
        noShow: 0,
      },
      conversion: {
        leadToAppointmentRate: 0,
        appointmentToAttendanceRate: 0,
        leadToAttendanceRate: 0,
      },
      pipeline: {
        estimatedPipelineValue: 0,
        expectedRevenue: 0,
        averageLeadValue: 0,
        revenueType: "estimated",
      },
      performance: {
        bySource: [],
        byService: [],
        byStatus: [],
      },
      trends: {
        daily: [],
        weekly: [],
        monthly: [],
      },
      quality: {
        missingSource: 0,
        missingService: 0,
        missingStatus: 0,
        unknownStatus: 0,
      },
    });
  });

  it("centralizes revenue KPIs using existing CRM formulas", () => {
    const rows: CrmLeadRow[] = [
      {
        id: "1",
        date: "2026-06-14",
        name: "Ana",
        phone: "+507 60000000",
        email: "ana@example.com",
        treatment: "Ortodoncia",
        message: "Consulta ortodoncia",
        status: "agendada",
        source: "chat-widget",
      },
      {
        id: "2",
        date: "2026-06-15",
        name: "Bruno",
        phone: "+507 60000001",
        email: "bruno@example.com",
        treatment: "Implantes Dentales",
        message: "Necesito un implante",
        status: "completada",
        source: "hero-button",
      },
      {
        id: "3",
        date: "2026-06-15",
        name: "Carla",
        phone: "+507 60000002",
        email: "carla@example.com",
        treatment: "Diseño de Sonrisa",
        message: "Quiero carillas",
        status: "no asistio",
        source: "services-page",
      },
      {
        id: "4",
        date: "2026-06-16",
        name: "Diego",
        phone: "+507 60000003",
        email: "diego@example.com",
        treatment: "Blanqueamiento Dental",
        message: "Blanqueamiento",
        status: "cancelada",
        source: "whatsapp",
      },
    ];

    const snapshot = createRevenueSnapshotV1(rows);

    expect(snapshot.version).toBe("58.2-v1");
    expect(snapshot.totals).toEqual({
      leads: 4,
      scheduled: 2,
      completed: 1,
      cancelled: 1,
      noShow: 1,
    });
    expect(snapshot.conversion).toEqual({
      leadToAppointmentRate: 50,
      appointmentToAttendanceRate: 50,
      leadToAttendanceRate: 25,
    });
    expect(snapshot.pipeline).toEqual({
      estimatedPipelineValue: 4300,
      expectedRevenue: 2150,
      averageLeadValue: 1075,
      revenueType: "estimated",
    });
  });

  it("reports data quality issues without mutating source rows", () => {
    const rows: CrmLeadRow[] = [
      {
        id: "1",
        date: "2026-06-14",
        name: "Ana",
        phone: "+507 60000000",
        email: "ana@example.com",
        treatment: "",
        message: "Consulta",
        status: "Scheduled",
        source: "",
      },
      {
        id: "2",
        date: "2026-06-14",
        name: "Bruno",
        phone: "+507 60000001",
        email: "bruno@example.com",
        treatment: "Ortodoncia",
        message: "Consulta",
        status: "",
        source: "chat-widget",
      },
    ];

    const snapshot = createRevenueSnapshotV1(rows);

    expect(snapshot.quality).toEqual({
      missingSource: 1,
      missingService: 1,
      missingStatus: 1,
      unknownStatus: 1,
    });
    expect(rows[0].source).toBe("");
    expect(rows[0].treatment).toBe("");
    expect(rows[0].status).toBe("Scheduled");
  });

  it("normalizes mojibake service names in revenue service rankings", () => {
    const rows: CrmLeadRow[] = [
      {
        id: "1",
        date: "2026-06-14",
        name: "Ana",
        phone: "+507 60000000",
        email: "ana@example.com",
        treatment: "RevisiÃ³n Dental",
        message: "Consulta",
        status: "agendada",
        source: "web-form",
      },
    ];

    const snapshot = createRevenueSnapshotV1(rows);

    expect(snapshot.performance.byService).toEqual([
      {
        service: "Revisión Dental",
        leads: 1,
        scheduled: 1,
        completed: 0,
        conversionRate: 100,
        estimatedPipelineValue: 50,
      },
    ]);
    expect(snapshot.pipeline.estimatedPipelineValue).toBe(50);
  });

});

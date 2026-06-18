import { describe, expect, it, vi, beforeEach } from "vitest";
import type { CrmLeadRow } from "@/lib/crm-metrics";

const readLeadsFromSheet = vi.fn();
const getServerConfig = vi.fn();

vi.mock("@/server/google/sheets", () => ({
  readLeadsFromSheet,
}));

vi.mock("@/lib/config.server", () => ({
  getServerConfig,
}));

const { GET } = await import("./metrics");

describe("/api/crm/metrics endpoint", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    getServerConfig.mockReturnValue({ nodeEnv: "development", googleRefreshToken: "token" });
  });

  it("returns emptyCRM response with trend, comparison, and lead score fields", async () => {
    readLeadsFromSheet.mockResolvedValue([]);

    const response = await GET(new Request("http://localhost/api/crm/metrics"));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.emptyCRM).toBe(true);
    expect(payload.averageLeadScore).toBe(0);
    expect(payload.leadScoreDistribution).toEqual({ hot: 0, warm: 0, cold: 0 });
    expect(payload.trend).toEqual({ daily: [], weekly: [], monthly: [] });
    expect(payload.comparison).toEqual({
      leads: { current: 0, previous: 0, changePercent: 0 },
      agendadas: { current: 0, previous: 0, changePercent: 0 },
      completadas: { current: 0, previous: 0, changePercent: 0 },
      canceladas: { current: 0, previous: 0, changePercent: 0 },
      conversionRate: { current: 0, previous: 0, changePercent: 0 },
    });
  });

  it("returns average lead score and distribution when leads are scored", async () => {
    const leads: CrmLeadRow[] = [
      {
        id: "1",
        createdAt: "2026-06-14",
        name: "Paciente",
        phone: "",
        email: "",
        treatment: "Ortodoncia",
        message: "",
        urgency: "alta",
        status: "nuevo",
        source: "chat-widget",
      },
    ];

    readLeadsFromSheet.mockResolvedValue(leads);

    const response = await GET(new Request("http://localhost/api/crm/metrics"));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.averageLeadScore).toBe(76);
    expect(payload.leadScoreDistribution).toEqual({ hot: 1, warm: 0, cold: 0 });
  });

  it("returns trend and period comparison for last7days", async () => {
    const leads: CrmLeadRow[] = [
      {
        id: "current",
        createdAt: "2026-06-14",
        name: "Current",
        phone: "",
        email: "",
        treatment: "Checkup",
        message: "",
        status: "agendada",
      },
      {
        id: "previous",
        createdAt: "2026-06-07",
        name: "Previous",
        phone: "",
        email: "",
        treatment: "Cleaning",
        message: "",
        status: "agendada",
      },
    ];

    readLeadsFromSheet.mockResolvedValue(leads);

    const response = await GET(new Request("http://localhost/api/crm/metrics?period=last7days"));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.trend.daily).toEqual([
      {
        label: "2026-06-14",
        leads: 1,
        agendadas: 1,
        completadas: 0,
        canceladas: 0,
        noAsistio: 0,
      },
    ]);
    expect(payload.comparison.leads).toEqual({ current: 1, previous: 1, changePercent: 0 });
    expect(payload.comparison.agendadas.changePercent).toBe(0);
    expect(payload.comparison.completadas.changePercent).toBe(0);
  });
});

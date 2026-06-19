import { describe, expect, it, vi, beforeEach } from "vitest";
import type { CrmLeadRow } from "@/lib/crm-metrics";

const listLeads = vi.fn();
const getServerConfig = vi.fn();

vi.mock("@/server/leads/persistence", () => ({
  leadPersistenceProvider: {
    getActiveLeadPersistenceAdapter: vi.fn(() => ({
      listLeads,
      getHealth: vi.fn(() => ({ active: true })),
    })),
  },
}));

vi.mock("@/lib/config.server", () => ({
  getServerConfig,
}));

const { GET } = await import("./revenue-forecast");

describe("/api/analytics/revenue-forecast endpoint", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    getServerConfig.mockReturnValue({ nodeEnv: "development", googleRefreshToken: "token" });
  });

  it("returns a read-only RevenueForecastSnapshot", async () => {
    const leads: CrmLeadRow[] = [
      {
        id: "1",
        date: "2026-06-14",
        name: "Ana",
        phone: "",
        email: "ana@example.com",
        treatment: "Ortodoncia",
        message: "Consulta",
        status: "agendada",
        source: "chat-widget",
      },
      {
        id: "2",
        date: "2026-06-15",
        name: "Bruno",
        phone: "",
        email: "bruno@example.com",
        treatment: "Implantes Dentales",
        message: "Consulta",
        status: "completada",
        source: "hero-button",
      },
    ];

    listLeads.mockResolvedValue(leads);

    const response = await GET(new Request("http://localhost/api/analytics/revenue-forecast"));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.success).toBe(true);
    expect(payload.period).toBe("all");
    expect(payload.forecast.version).toBe("58.5-v1");
    expect(payload.forecast.sourceSnapshotVersion).toBe("58.2-v1");
    expect(payload.forecast.forecastHorizonDays).toBe(30);
  });

  it("filters the forecast by dashboard period", async () => {
    const leads: CrmLeadRow[] = [
      {
        id: "current",
        createdAt: "2026-06-14",
        name: "Current",
        phone: "",
        email: "current@example.com",
        treatment: "Ortodoncia",
        message: "Consulta",
        status: "agendada",
        source: "chat-widget",
      },
      {
        id: "previous",
        createdAt: "2026-06-07",
        name: "Previous",
        phone: "",
        email: "previous@example.com",
        treatment: "Ortodoncia",
        message: "Consulta",
        status: "agendada",
        source: "chat-widget",
      },
    ];

    listLeads.mockResolvedValue(leads);

    const response = await GET(
      new Request("http://localhost/api/analytics/revenue-forecast?period=last7days"),
    );
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.period).toBe("last7days");
    expect(payload.forecast.version).toBe("58.5-v1");
  });
});

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

const { GET } = await import("./revenue");

describe("/api/analytics/revenue endpoint", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    getServerConfig.mockReturnValue({ nodeEnv: "development", googleRefreshToken: "token" });
  });

  it("returns a read-only RevenueSnapshotV1", async () => {
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

    readLeadsFromSheet.mockResolvedValue(leads);

    const response = await GET(new Request("http://localhost/api/analytics/revenue"));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.success).toBe(true);
    expect(payload.period).toBe("all");
    expect(payload.snapshot.version).toBe("58.2-v1");
    expect(payload.snapshot.totals).toEqual({
      leads: 2,
      scheduled: 2,
      completed: 1,
      cancelled: 0,
      noShow: 0,
    });
    expect(payload.snapshot.pipeline.revenueType).toBe("estimated");
  });

  it("filters the snapshot by dashboard period", async () => {
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

    readLeadsFromSheet.mockResolvedValue(leads);

    const response = await GET(new Request("http://localhost/api/analytics/revenue?period=last7days"));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.period).toBe("last7days");
    expect(payload.snapshot.totals.leads).toBe(1);
  });

  it("returns an empty snapshot when there are no leads", async () => {
    readLeadsFromSheet.mockResolvedValue([]);

    const response = await GET(new Request("http://localhost/api/analytics/revenue"));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.snapshot.totals.leads).toBe(0);
    expect(payload.snapshot.performance.bySource).toEqual([]);
    expect(payload.snapshot.quality).toEqual({
      missingSource: 0,
      missingService: 0,
      missingStatus: 0,
      unknownStatus: 0,
    });
  });
});

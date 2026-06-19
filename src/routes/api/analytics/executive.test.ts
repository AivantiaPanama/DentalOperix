import { beforeEach, describe, expect, it, vi } from "vitest";
import type { CrmLeadRow } from "@/lib/crm-metrics";

const readLeadsFromSheet = vi.fn();
const getServerConfig = vi.fn();

vi.mock("@/server/google/sheets", () => ({
  readLeadsFromSheet,
}));

vi.mock("@/lib/config.server", () => ({
  getServerConfig,
}));

const { GET } = await import("./executive");

describe("/api/analytics/executive endpoint", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    getServerConfig.mockReturnValue({ nodeEnv: "development", googleRefreshToken: "token" });
  });

  it("returns a read-only ExecutiveAnalyticsSnapshot", async () => {
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

    const response = await GET(new Request("http://localhost/api/analytics/executive"));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.success).toBe(true);
    expect(payload.degraded).toBe(false);
    expect(payload.source).toBe("google-sheets");
    expect(payload.period).toBe("all");
    expect(payload.executive.version).toBe("59.3-v1");
    expect(payload.executive.sourceSnapshotVersion).toBe("58.2-v1");
    expect(payload.executive.sourceForecastVersion).toBe("58.5-v1");
    expect(payload.executive.interpretation.healthStatus).toBeDefined();
    expect(Array.isArray(payload.executive.priorityActions)).toBe(true);
    expect(payload.executive.governance.readOnly).toBe(true);
    expect(payload.executive.governance.sourceOfTruth).toBe("Leads");
  });

  it("filters executive analytics by dashboard period", async () => {
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

    const response = await GET(new Request("http://localhost/api/analytics/executive?period=last7days"));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.period).toBe("last7days");
    expect(payload.executive.version).toBe("59.3-v1");
  });

  it("returns a degraded empty executive snapshot instead of 500 when the analytics source fails", async () => {
    readLeadsFromSheet.mockRejectedValue(new Error("Google Sheets unavailable"));

    const response = await GET(new Request("http://localhost/api/analytics/executive?period=all"));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.success).toBe(true);
    expect(payload.degraded).toBe(true);
    expect(payload.source).toBe("empty-fallback");
    expect(payload.period).toBe("all");
    expect(payload.executive.version).toBe("59.3-v1");
    expect(payload.executive.governance.readOnly).toBe(true);
    expect(payload.executive.priorityActions.length).toBeGreaterThanOrEqual(1);
    expect(payload.warning).toContain("source unavailable");
  });
});

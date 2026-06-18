import { beforeEach, describe, expect, it, vi } from "vitest";

const readAutomationRunRecords = vi.fn();
vi.mock("@/server/google/automation", () => ({
  readAutomationRunRecords,
}));

vi.mock("@/lib/config.server", () => ({
  getServerConfig: vi.fn(() => ({ internalApiKey: "test-key" })),
  isProduction: vi.fn(() => false),
}));

let GET: (request: Request) => Promise<Response>;

describe("/api/followups/history", () => {
  beforeEach(async () => {
    vi.resetAllMocks();
    process.env.INTERNAL_API_KEY = "test-key";

    const routeModule = await import("./history");
    GET = routeModule.GET;
  });

  it("returns 401 when x-api-key is missing", async () => {
    const response = await GET(new Request("http://localhost/api/followups/history"));
    expect(response.status).toBe(401);

    const body = await response.json();
    expect(body).toEqual({ success: false, error: "Unauthorized" });
    expect(readAutomationRunRecords).not.toHaveBeenCalled();
  });

  it("returns automation records when x-api-key is valid", async () => {
    const record = {
      id: "run-1",
      timestamp: "2026-06-10T10:00:00.000Z",
      flow: "followups",
      dryRun: true,
      generated: 1,
      sent: 0,
      skipped: 1,
      failed: 0,
      actionCount: 1,
      errors: "[]",
      status: "success",
    };
    readAutomationRunRecords.mockResolvedValue([record]);

    const response = await GET(
      new Request("http://localhost/api/followups/history", {
        headers: { "x-api-key": "test-key" },
      }),
    );

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body).toEqual({ success: true, records: [record] });
    expect(readAutomationRunRecords).toHaveBeenCalledOnce();
  });
});

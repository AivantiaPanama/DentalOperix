import { describe, expect, it, vi, beforeEach } from "vitest";

let runPatientFollowups: ReturnType<typeof vi.fn>;
let appendAutomationRunRecord: ReturnType<typeof vi.fn>;
let readAutomationRunRecords: ReturnType<typeof vi.fn>;
let POST: (request: Request) => Promise<Response>;
let GET: (request: Request) => Promise<Response>;

vi.mock("@/lib/patient-followup-engine", () => ({
  runPatientFollowups: vi.fn(),
}));

vi.mock("@/server/google/automation", async () => {
  const actual = await vi.importActual<typeof import("@/server/google/automation")>(
    "@/server/google/automation",
  );
  return {
    ...actual,
    appendAutomationRunRecord: vi.fn(),
    readAutomationRunRecords: vi.fn(),
  };
});

vi.mock("@/lib/config.server", () => ({
  getServerConfig: vi.fn(() => ({ internalApiKey: "test-key" })),
  isProduction: vi.fn(() => false),
}));

describe("/api/followups/run", () => {
  beforeEach(async () => {
    vi.resetAllMocks();
    process.env.INTERNAL_API_KEY = "test-key";
    const followupModule = await import("@/lib/patient-followup-engine");
    runPatientFollowups = vi.mocked(followupModule.runPatientFollowups);
    const automationModule = await import("@/server/google/automation");
    appendAutomationRunRecord = vi.mocked(automationModule.appendAutomationRunRecord);
    readAutomationRunRecords = vi.mocked(automationModule.readAutomationRunRecords);
    const routeModule = await import("./run");
    POST = routeModule.POST;
    GET = routeModule.GET;
  });

  it("returns summary and actions in dryRun mode by default", async () => {
    runPatientFollowups.mockResolvedValue({
      dryRun: true,
      generated: 1,
      sent: 0,
      skipped: 1,
      failed: 0,
      errors: [],
      actions: [
        {
          leadId: "lead-1",
          type: "appointment_reminder",
          channel: "email",
          recipient: "ana@example.com",
          name: "Ana",
          subject: "Subject",
          message: "Message",
          scheduledAt: "2026-06-10T10:00:00.000Z",
        },
      ],
    });

    const request = new Request("http://localhost/api/followups/run", {
      method: "POST",
      headers: { "x-api-key": "test-key" },
      body: JSON.stringify({}),
    });
    const response = await POST(request);
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.dryRun).toBe(true);
    expect(payload.generated).toBe(1);
    expect(payload.skipped).toBe(1);
    expect(appendAutomationRunRecord).toHaveBeenCalledOnce();
  });

  it("blocks real runs without explicit confirmation", async () => {
    const request = new Request("http://localhost/api/followups/run", {
      method: "POST",
      headers: { "x-api-key": "test-key" },
      body: JSON.stringify({ dryRun: false }),
    });
    const response = await POST(request);
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.success).toBe(false);
    expect(runPatientFollowups).not.toHaveBeenCalled();
    expect(appendAutomationRunRecord).not.toHaveBeenCalled();
  });

  it("allows real runs with explicit confirmation", async () => {
    runPatientFollowups.mockResolvedValue({
      dryRun: false,
      generated: 1,
      sent: 1,
      skipped: 0,
      failed: 0,
      errors: [],
      actions: [],
    });

    const request = new Request("http://localhost/api/followups/run", {
      method: "POST",
      headers: { "x-api-key": "test-key" },
      body: JSON.stringify({ dryRun: false, confirmExecution: true }),
    });
    const response = await POST(request);
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.dryRun).toBe(false);
    expect(runPatientFollowups).toHaveBeenCalledWith({ dryRun: false, confirmExecution: true });
  });

  it("returns history and metrics on GET", async () => {
    readAutomationRunRecords.mockResolvedValue([
      {
        id: "run_1",
        timestamp: "2026-06-14T00:00:00.000Z",
        flow: "followups",
        dryRun: true,
        generated: 2,
        sent: 0,
        skipped: 2,
        failed: 0,
        actionCount: 2,
        errors: "[]",
        status: "success",
      },
    ]);

    const response = await GET(
      new Request("http://localhost/api/followups/run", { headers: { "x-api-key": "test-key" } }),
    );
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.runs).toHaveLength(1);
    expect(payload.metrics.totalRuns).toBe(1);
    expect(payload.metrics.dryRuns).toBe(1);
  });

  it("returns error when followup execution throws", async () => {
    runPatientFollowups.mockRejectedValue(new Error("fail"));

    const request = new Request("http://localhost/api/followups/run", {
      method: "POST",
      headers: { "x-api-key": "test-key" },
      body: JSON.stringify({ dryRun: false, confirmExecution: true }),
    });
    const response = await POST(request);
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload.success).toBe(false);
    expect(payload.error).toBe("fail");
    expect(appendAutomationRunRecord).toHaveBeenCalledOnce();
  });

  it("returns 401 when x-api-key is invalid", async () => {
    const request = new Request("http://localhost/api/followups/run", {
      method: "POST",
      headers: { "x-api-key": "wrong-key" },
      body: JSON.stringify({}),
    });
    const response = await POST(request);
    const payload = await response.json();

    expect(response.status).toBe(401);
    expect(payload).toEqual({ success: false, error: "Unauthorized" });
    expect(appendAutomationRunRecord).not.toHaveBeenCalled();
  });
});

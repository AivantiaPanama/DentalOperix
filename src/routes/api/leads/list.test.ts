/* eslint-disable @typescript-eslint/no-explicit-any */
import { beforeEach, describe, expect, it, vi } from "vitest";

const listLeads = vi.fn();
const getServerConfig = vi.fn();
vi.mock("@/server/leads/persistence", () => ({
  LeadPersistenceNotConfiguredError: class LeadPersistenceNotConfiguredError extends Error {},
  leadPersistenceProvider: {
    getActiveLeadPersistenceAdapter: vi.fn(() => ({
      listLeads,
      getHealth: vi.fn(() => ({ active: true })),
    })),
  },
}));
vi.mock("@/lib/config.server", () => ({
  getServerConfig,
  isProduction: vi.fn(() => false),
}));

let GET: (request: Request) => Promise<Response>;

describe("/api/leads/list", () => {
  beforeEach(async () => {
    vi.resetAllMocks();
    process.env.INTERNAL_API_KEY = "test-key";
    getServerConfig.mockReturnValue({
      nodeEnv: "development",
      googleRefreshToken: "token",
      internalApiKey: "test-key",
    } as any);

    const routeModule = await import("./list");
    GET = routeModule.GET;
  });

  it("returns 401 when x-api-key is missing", async () => {
    const response = await GET(new Request("http://localhost/api/leads/list"));
    expect(response.status).toBe(401);

    const body = await response.json();
    expect(body).toEqual({ success: false, error: "Unauthorized" });
    expect(listLeads).not.toHaveBeenCalled();
  });

  it("returns leads when x-api-key is valid", async () => {
    const leads = [{ id: "lead-1", name: "Ana" }];
    listLeads.mockResolvedValue(leads);

    const response = await GET(
      new Request("http://localhost/api/leads/list", {
        headers: { "x-api-key": "test-key" },
      }),
    );

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body).toEqual({ leads });
    expect(listLeads).toHaveBeenCalledOnce();
  });
});

import { beforeEach, describe, expect, it, vi } from "vitest";

const requirePermissionOrInternalApiKey = vi.fn();
const createExecutiveDashboardApiPayload = vi.fn();

class UnauthorizedError extends Error {}
class ForbiddenError extends Error {}

vi.mock("@/lib/rbac/guards.server", () => ({
  requirePermissionOrInternalApiKey,
  UnauthorizedError,
  ForbiddenError,
  createUnauthorizedResponse: () =>
    new Response(JSON.stringify({ success: false, error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    }),
  createForbiddenResponse: () =>
    new Response(JSON.stringify({ success: false, error: "Forbidden" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    }),
}));

vi.mock("@/server/read-models/executive-dashboard-api-service", () => ({
  createExecutiveDashboardApiPayload,
}));

let getExecutiveDashboardApiResponse: typeof import("./-handler").getExecutiveDashboardApiResponse;

describe("executive observability internal API handler", () => {
  beforeEach(async () => {
    vi.resetAllMocks();
    vi.resetModules();
    const module = await import("./-handler");
    getExecutiveDashboardApiResponse = module.getExecutiveDashboardApiResponse;
  });

  it("requires the executive observability read capability before returning metrics", async () => {
    createExecutiveDashboardApiPayload.mockReturnValue({
      version: "executive-dashboard-api-contracts/v1",
      dashboardContractVersion: "executive-dashboard-contracts/v1",
      generatedAt: "2026-01-01T00:00:00.000Z",
      payload: { audience: "executive" },
    });

    const request = new Request("http://localhost/api/internal/executive-observability/executive");
    const response = await getExecutiveDashboardApiResponse(request, "executive");

    expect(response.status).toBe(200);
    expect(requirePermissionOrInternalApiKey).toHaveBeenCalledWith(
      request,
      "executive-observability:read",
    );
    expect(createExecutiveDashboardApiPayload).toHaveBeenCalledWith("executive");
    expect(await response.json()).toMatchObject({ payload: { audience: "executive" } });
  });

  it("returns unauthorized and forbidden responses from the shared guard", async () => {
    requirePermissionOrInternalApiKey.mockImplementationOnce(() => {
      throw new UnauthorizedError("Unauthorized");
    });
    const unauthorized = await getExecutiveDashboardApiResponse(
      new Request("http://localhost/api/internal/executive-observability/executive"),
      "executive",
    );

    requirePermissionOrInternalApiKey.mockImplementationOnce(() => {
      throw new ForbiddenError("Forbidden");
    });
    const forbidden = await getExecutiveDashboardApiResponse(
      new Request("http://localhost/api/internal/executive-observability/executive"),
      "executive",
    );

    expect(unauthorized.status).toBe(401);
    expect(forbidden.status).toBe(403);
  });
});

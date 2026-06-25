import { beforeEach, describe, expect, it, vi } from "vitest";

const requirePermission = vi.fn();
const searchPatients = vi.fn();
const createPatientReadService = vi.fn(() => ({ searchPatients }));

class UnauthorizedError extends Error {}
class ForbiddenError extends Error {}

vi.mock("@/lib/rbac/guards.server", () => ({
  requirePermission,
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

vi.mock("@/server/patients/read", () => ({
  createPatientReadService,
}));

let GET: (request: Request) => Promise<Response>;

describe("GET /api/patients/search", () => {
  beforeEach(async () => {
    vi.resetAllMocks();
    vi.resetModules();
    searchPatients.mockResolvedValue([{ id: "PAT-001", displayName: "Ana Perez" }]);
    const routeModule = await import("./search");
    GET = routeModule.GET;
  });

  it("searches patients through Patient Read Service", async () => {
    const response = await GET(new Request("http://localhost/api/patients/search?email=ana@example.com"));

    expect(response.status).toBe(200);
    expect(requirePermission).toHaveBeenCalledWith(expect.any(Request), "patients:read");
    expect(searchPatients).toHaveBeenCalledWith({ email: "ana@example.com" }, "Patient Management Search");
    expect(await response.json()).toEqual({ success: true, patients: [{ id: "PAT-001", displayName: "Ana Perez" }] });
  });

  it("supports identifier search without automated merge behavior", async () => {
    const response = await GET(new Request("http://localhost/api/patients/search?identifierValue=CID-1"));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(searchPatients).toHaveBeenCalledWith({ identifierValue: "CID-1" }, "Patient Management Search");
    expect(JSON.stringify(body)).not.toContain("mergePatients");
  });

  it("rejects searches without identity criteria", async () => {
    const response = await GET(new Request("http://localhost/api/patients/search"));

    expect(response.status).toBe(400);
    expect(searchPatients).not.toHaveBeenCalled();
  });
});

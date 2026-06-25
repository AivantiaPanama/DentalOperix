import { beforeEach, describe, expect, it, vi } from "vitest";

const requirePermission = vi.fn();
const createPatientPersistencePort = vi.fn();
const searchPatientsByIdentityUseCase = vi.fn();

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

vi.mock("@/server/patients/persistence", () => ({
  createPatientPersistencePort,
}));

vi.mock("@/server/patients/application", async () => {
  const actual = await vi.importActual<typeof import("@/server/patients/application")>("@/server/patients/application");
  return { ...actual, searchPatientsByIdentityUseCase };
});

let GET: (request: Request) => Promise<Response>;

describe("GET /api/patients/search", () => {
  beforeEach(async () => {
    vi.resetAllMocks();
    vi.resetModules();
    createPatientPersistencePort.mockReturnValue({ port: "patient" });
    searchPatientsByIdentityUseCase.mockResolvedValue({ ok: true, patients: [{ id: "PAT-001" }], duplicateReviewRequired: false });
    const routeModule = await import("./search");
    GET = routeModule.GET;
  });

  it("searches patients through the certified Patient Application Layer", async () => {
    const response = await GET(new Request("http://localhost/api/patients/search?email=ana@example.com"));

    expect(response.status).toBe(200);
    expect(requirePermission).toHaveBeenCalledWith(expect.any(Request), "patients:read");
    expect(searchPatientsByIdentityUseCase).toHaveBeenCalledWith({ port: "patient" }, { email: "ana@example.com" });
    expect(await response.json()).toEqual({ success: true, patients: [{ id: "PAT-001" }] });
  });

  it("returns 409 when duplicate review is required and does not automate merge", async () => {
    searchPatientsByIdentityUseCase.mockResolvedValue({
      ok: true,
      patients: [{ id: "PAT-001" }, { id: "PAT-002" }],
      duplicateReviewRequired: true,
    });

    const response = await GET(new Request("http://localhost/api/patients/search?phone=%2B50760000000"));
    const body = await response.json();

    expect(response.status).toBe(409);
    expect(body.duplicateReviewRequired).toBe(true);
    expect(JSON.stringify(body)).not.toContain("mergePatients");
  });

  it("rejects searches without identity criteria", async () => {
    const response = await GET(new Request("http://localhost/api/patients/search"));

    expect(response.status).toBe(400);
    expect(searchPatientsByIdentityUseCase).not.toHaveBeenCalled();
  });
});

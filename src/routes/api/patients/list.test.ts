import { beforeEach, describe, expect, it, vi } from "vitest";

const requirePermission = vi.fn();
const listPatients = vi.fn();
const createPatientReadService = vi.fn(() => ({ listPatients }));

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

const patientSummary = {
  id: "PAT-001",
  displayName: "Ana Perez",
  email: "ana@example.com",
  phone: "+507 6000 0000",
  latestStatus: "active",
  source: "read-model",
  completionPercentage: 100,
  administrativeStatus: "pending-verification",
};

describe("/api/patients/list", () => {
  beforeEach(async () => {
    vi.resetAllMocks();
    vi.resetModules();
    listPatients.mockResolvedValue([patientSummary]);
    const routeModule = await import("./list");
    GET = routeModule.GET;
  });

  it("returns patient summaries through Patient Read Service", async () => {
    const response = await GET(new Request("http://localhost/api/patients/list"));

    expect(response.status).toBe(200);
    expect(requirePermission).toHaveBeenCalledWith(expect.any(Request), "patients:read");
    expect(createPatientReadService).toHaveBeenCalled();
    expect(listPatients).toHaveBeenCalledWith("Patient Management");
    expect(await response.json()).toEqual({ success: true, patients: [patientSummary] });
  });

  it("does not leak diagnostics in the list response", async () => {
    const response = await GET(new Request("http://localhost/api/patients/list"));
    const body = await response.json();

    expect(JSON.stringify(body)).not.toContain("resolvedIdentity");
    expect(JSON.stringify(body)).not.toContain("patientAggregateDiagnostics");
  });
});

import { beforeEach, describe, expect, it, vi } from "vitest";

const requirePermission = vi.fn();
const getPatientById = vi.fn();
const createPatientReadService = vi.fn(() => ({ getPatientById }));

class UnauthorizedError extends Error {}
class ForbiddenError extends Error {}
class PatientReadServiceNotFoundError extends Error {}

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
  PatientReadServiceNotFoundError,
}));

let GET: (request: Request) => Promise<Response>;

const patientDetail = {
  id: "PAT-001",
  displayName: "Ana Perez",
  email: "ana@example.com",
};

describe("/api/patients/:id", () => {
  beforeEach(async () => {
    vi.resetAllMocks();
    vi.resetModules();
    getPatientById.mockResolvedValue(patientDetail);
    const routeModule = await import("./$id");
    GET = routeModule.GET;
  });

  it("returns patient detail through Patient Read Service", async () => {
    const response = await GET(new Request("http://localhost/api/patients/PAT-001"));

    expect(response.status).toBe(200);
    expect(requirePermission).toHaveBeenCalledWith(expect.any(Request), "patients:read");
    expect(getPatientById).toHaveBeenCalledWith("PAT-001", "Patient Management Detail");
    expect(await response.json()).toEqual({ success: true, patient: patientDetail });
  });

  it("does not leak read-model diagnostics or resolved identity in the detail response", async () => {
    const response = await GET(new Request("http://localhost/api/patients/PAT-001"));
    const serializedBody = JSON.stringify(await response.json());

    expect(serializedBody).not.toContain("resolvedIdentity");
    expect(serializedBody).not.toContain("patientAggregateDiagnostics");
  });

  it("returns 404 when Patient Read Service cannot find the patient", async () => {
    getPatientById.mockRejectedValue(new PatientReadServiceNotFoundError("Paciente PAT-404 no encontrado."));

    const response = await GET(new Request("http://localhost/api/patients/PAT-404"));

    expect(response.status).toBe(404);
    expect(await response.json()).toEqual({
      success: false,
      error: "Paciente PAT-404 no encontrado.",
    });
  });
});

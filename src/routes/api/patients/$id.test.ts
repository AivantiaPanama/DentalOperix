import { beforeEach, describe, expect, it, vi } from "vitest";

const requirePermission = vi.fn();
const getReadModelSource = vi.fn();
const getPatientAdministrativeProfile = vi.fn();

class UnauthorizedError extends Error {}
class ForbiddenError extends Error {}
class PatientNotFoundError extends Error {}

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

vi.mock("@/server/patients/admin-repository", () => ({
  getPatientAdministrativeProfile,
  PatientNotFoundError,
}));

vi.mock("@/server/read-models/read-model-source-provider", () => ({
  getReadModelSource,
}));

let GET: (request: Request) => Promise<Response>;

const readModelPatient = {
  id: "PAT-001",
  displayName: "Ana Perez",
  email: "ana@example.com",
};
const legacyPatient = {
  id: "PAT-LEGACY",
  displayName: "Legacy Patient",
  email: "legacy@example.com",
};

describe("/api/patients/:id", () => {
  beforeEach(async () => {
    vi.resetAllMocks();
    vi.resetModules();
    const routeModule = await import("./$id");
    GET = routeModule.GET;
  });

  it("returns the stable public detail contract from the read source", async () => {
    getReadModelSource.mockResolvedValue({
      mode: "read-model",
      patients: [readModelPatient],
      leadOperations: [],
      diagnostics: { usedReadModel: true },
    });

    const response = await GET(new Request("http://localhost/api/patients/PAT-001"));

    expect(response.status).toBe(200);
    expect(requirePermission).toHaveBeenCalledWith(expect.any(Request), "patients:read");
    expect(getReadModelSource).toHaveBeenCalledWith({ consumerName: "Patient Management Detail" });
    expect(getPatientAdministrativeProfile).not.toHaveBeenCalled();
    expect(await response.json()).toEqual({ success: true, patient: readModelPatient });
  });

  it("falls back to legacy Leads detail when the read-model source misses the patient", async () => {
    getReadModelSource.mockResolvedValue({
      mode: "read-model",
      patients: [readModelPatient],
      leadOperations: [],
      diagnostics: { usedReadModel: true },
    });
    getPatientAdministrativeProfile.mockResolvedValue(legacyPatient);

    const response = await GET(new Request("http://localhost/api/patients/PAT-LEGACY"));

    expect(response.status).toBe(200);
    expect(getPatientAdministrativeProfile).toHaveBeenCalledWith("PAT-LEGACY");
    expect(await response.json()).toEqual({ success: true, patient: legacyPatient });
  });



  it("keeps list/detail compatible by returning the exact public patient object from the read source", async () => {
    const publicPatient = {
      id: "PAT-001",
      displayName: "Ana Perez",
      firstName: "Ana",
      lastName: "Perez",
      phone: "+507 6000 0000",
      email: "ana@example.com",
      sourceLeadIds: ["LEAD-001"],
      missingFields: [],
      completionPercentage: 100,
      administrativeStatus: "pending-verification",
    };
    getReadModelSource.mockResolvedValue({
      mode: "read-model",
      patients: [publicPatient],
      leadOperations: [],
      diagnostics: { usedReadModel: true },
    });

    const response = await GET(new Request("http://localhost/api/patients/PAT-001"));

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ success: true, patient: publicPatient });
  });

  it("does not leak read-model diagnostics or resolved identity in the detail response", async () => {
    getReadModelSource.mockResolvedValue({
      mode: "read-model",
      patients: [readModelPatient],
      leadOperations: [],
      diagnostics: {
        usedReadModel: true,
        patientAggregateDiagnostics: {
          duplicateResolvedIdentities: ["CID:8-888-888"],
        },
      },
    });

    const response = await GET(new Request("http://localhost/api/patients/PAT-001"));
    const serializedBody = JSON.stringify(await response.json());

    expect(serializedBody).not.toContain("resolvedIdentity");
    expect(serializedBody).not.toContain("patientAggregateDiagnostics");
  });

  it("returns 404 when the legacy fallback cannot find the patient", async () => {
    getReadModelSource.mockResolvedValue({
      mode: "read-model",
      patients: [],
      leadOperations: [],
      diagnostics: { usedReadModel: true },
    });
    getPatientAdministrativeProfile.mockRejectedValue(new PatientNotFoundError("Paciente PAT-404 no encontrado."));

    const response = await GET(new Request("http://localhost/api/patients/PAT-404"));

    expect(response.status).toBe(404);
    expect(await response.json()).toEqual({
      success: false,
      error: "Paciente PAT-404 no encontrado.",
    });
  });
});

import { beforeEach, describe, expect, it, vi } from "vitest";

const requirePermission = vi.fn();
const createPatientPersistencePort = vi.fn();
const updatePatientUseCase = vi.fn();

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
  return { ...actual, updatePatientUseCase };
});

let PATCH: (request: Request) => Promise<Response>;

describe("PATCH /api/patients/update", () => {
  beforeEach(async () => {
    vi.resetAllMocks();
    vi.resetModules();
    createPatientPersistencePort.mockReturnValue({ port: "patient" });
    updatePatientUseCase.mockResolvedValue({ ok: true, patient: { id: "PAT-001", displayName: "Ana P." } });
    const routeModule = await import("./update");
    PATCH = routeModule.PATCH;
  });

  it("updates a patient through the certified Patient Application Layer", async () => {
    const response = await PATCH(
      new Request("http://localhost/api/patients/update", {
        method: "PATCH",
        body: JSON.stringify({ patientId: "PAT-001", displayName: "Ana P." }),
      }),
    );

    expect(response.status).toBe(200);
    expect(requirePermission).toHaveBeenCalledWith(expect.any(Request), "patients:update");
    expect(updatePatientUseCase).toHaveBeenCalledWith({ port: "patient" }, "PAT-001", { displayName: "Ana P." });
    expect(await response.json()).toEqual({ success: true, patient: { id: "PAT-001", displayName: "Ana P." } });
  });

  it("rejects empty updates", async () => {
    const response = await PATCH(
      new Request("http://localhost/api/patients/update", {
        method: "PATCH",
        body: JSON.stringify({ patientId: "PAT-001" }),
      }),
    );

    expect(response.status).toBe(400);
    expect(updatePatientUseCase).not.toHaveBeenCalled();
  });

  it("maps application not-found errors to 404", async () => {
    const { PatientApplicationLayerNotFoundError } = await import("@/server/patients/application");
    updatePatientUseCase.mockRejectedValue(new PatientApplicationLayerNotFoundError("PAT-404"));

    const response = await PATCH(
      new Request("http://localhost/api/patients/update", {
        method: "PATCH",
        body: JSON.stringify({ patientId: "PAT-404", displayName: "Missing" }),
      }),
    );

    expect(response.status).toBe(404);
  });
});

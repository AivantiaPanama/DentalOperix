import { beforeEach, describe, expect, it, vi } from "vitest";

const requirePermission = vi.fn();
const createPatientPersistencePort = vi.fn();
const createPatientUseCase = vi.fn();

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
  return { ...actual, createPatientUseCase };
});

let POST: (request: Request) => Promise<Response>;

const patient = {
  id: "PAT-001",
  displayName: "Ana Perez",
  normalizedName: "ana perez",
  status: "active",
  source: "admin",
  requiresInvoice: false,
  isRetired: false,
  hasInsurance: false,
  createdVia: "admin",
  createdAt: "2026-06-24T00:00:00.000Z",
  updatedAt: "2026-06-24T00:00:00.000Z",
  phones: [],
  emails: [],
  addresses: [],
  identifiers: [],
};

describe("POST /api/patients/create", () => {
  beforeEach(async () => {
    vi.resetAllMocks();
    vi.resetModules();
    createPatientPersistencePort.mockReturnValue({ port: "patient" });
    createPatientUseCase.mockResolvedValue({ ok: true, patient });
    const routeModule = await import("./create");
    POST = routeModule.POST;
  });

  it("creates a patient through the certified Patient Application Layer", async () => {
    const response = await POST(
      new Request("http://localhost/api/patients/create", {
        method: "POST",
        body: JSON.stringify({ displayName: "Ana Perez", source: "admin" }),
      }),
    );

    expect(response.status).toBe(201);
    expect(requirePermission).toHaveBeenCalledWith(expect.any(Request), "patients:write");
    expect(createPatientPersistencePort).toHaveBeenCalledTimes(1);
    expect(createPatientUseCase).toHaveBeenCalledWith({ port: "patient" }, { displayName: "Ana Perez", source: "admin" });
    expect(await response.json()).toEqual({ success: true, patient });
  });

  it("rejects invalid payloads without invoking persistence", async () => {
    const response = await POST(
      new Request("http://localhost/api/patients/create", {
        method: "POST",
        body: JSON.stringify({ source: "admin" }),
      }),
    );

    expect(response.status).toBe(400);
    expect(createPatientPersistencePort).not.toHaveBeenCalled();
    expect(createPatientUseCase).not.toHaveBeenCalled();
  });

  it("maps RBAC unauthorized errors to 401", async () => {
    requirePermission.mockImplementation(() => {
      throw new UnauthorizedError();
    });

    const response = await POST(
      new Request("http://localhost/api/patients/create", {
        method: "POST",
        body: JSON.stringify({ displayName: "Ana Perez", source: "admin" }),
      }),
    );

    expect(response.status).toBe(401);
    expect(createPatientUseCase).not.toHaveBeenCalled();
  });
});

import { beforeEach, describe, expect, it, vi } from "vitest";

const requirePermission = vi.fn();
const getReadModelSource = vi.fn();

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

vi.mock("@/server/read-models/read-model-source-provider", () => ({
  getReadModelSource,
}));

let GET: (request: Request) => Promise<Response>;

const readModelPatient = {
  id: "PAT-001",
  displayName: "Ana Perez",
  email: "ana@example.com",
};

describe("/api/patients/list", () => {
  beforeEach(async () => {
    vi.resetAllMocks();
    vi.resetModules();
    const routeModule = await import("./list");
    GET = routeModule.GET;
  });

  it("returns the stable public list contract without internal diagnostics", async () => {
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

    const response = await GET(new Request("http://localhost/api/patients/list"));

    expect(response.status).toBe(200);
    expect(requirePermission).toHaveBeenCalledWith(expect.any(Request), "patients:read");
    expect(getReadModelSource).toHaveBeenCalledWith({ consumerName: "Patient Management" });
    expect(await response.json()).toEqual({ success: true, patients: [readModelPatient] });
  });

  it("does not leak resolvedIdentity when the read source keeps the public DTO clean", async () => {
    getReadModelSource.mockResolvedValue({
      mode: "read-model",
      patients: [readModelPatient],
      leadOperations: [],
      diagnostics: { usedReadModel: true },
    });

    const response = await GET(new Request("http://localhost/api/patients/list"));
    const body = await response.json();

    expect(JSON.stringify(body)).not.toContain("resolvedIdentity");
    expect(JSON.stringify(body)).not.toContain("patientAggregateDiagnostics");
  });
});

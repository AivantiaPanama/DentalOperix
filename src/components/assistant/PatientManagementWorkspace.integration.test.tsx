// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { PatientManagementWorkspace } from "./PatientManagementWorkspace";
import type { PatientAdministrativeProfile } from "@/lib/patients/admin-profile";

const createPatient = (
  overrides: Partial<PatientAdministrativeProfile>,
): PatientAdministrativeProfile => ({
  id: "PAT-001",
  displayName: "Ana Perez",
  firstName: "Ana",
  lastName: "Perez",
  phone: "+507 6000-1111",
  email: "ana@example.com",
  birthDate: "1990-01-01",
  address: "Calle 1",
  emergencyContact: "Mario Perez",
  preferredContactMethod: "WhatsApp",
  treatmentInterest: "Implantes Dentales",
  preferredDate: "2026-01-15",
  latestStatus: "Nuevo",
  source: "Read Model",
  createdAt: "2026-01-01T10:00:00.000Z",
  notes: "",
  sourceLeadIds: ["LEAD-001"],
  missingFields: [],
  completionPercentage: 100,
  administrativeStatus: "verified",
  verifiedAt: "2026-01-02T10:00:00.000Z",
  verifiedBy: "admin@dentaloperix.test",
  updatedAt: "2026-01-02T10:00:00.000Z",
  updatedBy: "admin@dentaloperix.test",
  ...overrides,
});

const patients = [
  createPatient({ id: "PAT-001", displayName: "Ana Perez", administrativeStatus: "verified" }),
  createPatient({
    id: "PAT-002",
    displayName: "Bruno Rios",
    firstName: "Bruno",
    lastName: "Rios",
    phone: "+507 6000-2222",
    email: "bruno@example.com",
    treatmentInterest: "Ortodoncia",
    latestStatus: "Seguimiento",
    sourceLeadIds: ["LEAD-002"],
    administrativeStatus: "pending-verification",
    verifiedAt: undefined,
    verifiedBy: undefined,
  }),
  createPatient({
    id: "PAT-003",
    displayName: "Carla Soto",
    firstName: "Carla",
    lastName: "Soto",
    phone: "",
    email: "",
    treatmentInterest: "Blanqueamiento",
    latestStatus: "Pendiente",
    sourceLeadIds: ["LEAD-003"],
    missingFields: ["phone", "email"],
    completionPercentage: 75,
    administrativeStatus: "incomplete",
    verifiedAt: undefined,
    verifiedBy: undefined,
  }),
];

describe("PatientManagementWorkspace runtime reconciliation", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it("consumes the stable patients list contract and renders the management workspace without read-model diagnostics", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ success: true, patients }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    render(<PatientManagementWorkspace />);

    expect(await screen.findAllByText("Ana Perez")).toHaveLength(2);
    expect(fetchMock).toHaveBeenCalledWith("/api/patients/list", { credentials: "same-origin" });

    expect(screen.getByText("Verificados").parentElement?.textContent).toContain("1");
    expect(screen.getByText("Pendientes").parentElement?.textContent).toContain("1");
    expect(screen.getByText("Incompletos").parentElement?.textContent).toContain("1");
    expect(screen.getByDisplayValue("Ana Perez")).toBeDefined();
    expect(screen.getByDisplayValue("+507 6000-1111")).toBeDefined();
    expect(screen.queryByText(/resolvedIdentity/i)).toBeNull();
    expect(screen.queryByText(/patientAggregateDiagnostics/i)).toBeNull();
  });

  it("keeps search and patient selection compatible with the migrated list endpoint", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ success: true, patients }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }),
      ),
    );

    render(<PatientManagementWorkspace />);

    expect(await screen.findAllByText("Ana Perez")).toHaveLength(2);
    fireEvent.change(
      screen.getByPlaceholderText("Buscar por nombre, teléfono, correo o servicio"),
      {
        target: { value: "ortodoncia" },
      },
    );

    expect(screen.queryAllByText("Ana Perez")).toHaveLength(1);
    expect(screen.getAllByText("Bruno Rios").length).toBeGreaterThan(0);

    fireEvent.click(screen.getAllByText("Bruno Rios")[0]);

    await waitFor(() => {
      expect(screen.getByDisplayValue("Bruno Rios")).toBeDefined();
      expect(screen.getByDisplayValue("bruno@example.com")).toBeDefined();
    });

    const detailPanel = screen.getByText("Perfil seleccionado").closest("section");
    expect(detailPanel).not.toBeNull();
    expect(within(detailPanel as HTMLElement).getByText("Pendiente de verificación")).toBeDefined();
  });

  it("shows the existing empty-state path when the stable list contract returns no patients", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ success: true, patients: [] }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }),
      ),
    );

    render(<PatientManagementWorkspace />);

    expect(
      await screen.findByText("No hay perfiles administrativos con los filtros actuales."),
    ).toBeDefined();
    expect(
      screen.getByText("Selecciona un perfil para gestionar sus datos administrativos."),
    ).toBeDefined();
  });
});

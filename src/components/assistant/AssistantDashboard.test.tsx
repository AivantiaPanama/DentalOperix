// @vitest-environment jsdom
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AssistantDashboard } from "./AssistantDashboard";

describe("AssistantDashboard 61.2 shell", () => {
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it("renders the Front Desk Workspace shell without patient management or clinical records", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ leads: [] }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }),
      ),
    );

    render(<AssistantDashboard />);

    expect(screen.getAllByText("Front Desk Workspace").length).toBeGreaterThan(0);
    expect(screen.getByText("Agenda de hoy")).toBeDefined();
    expect(screen.queryByText("Patient Management")).toBeNull();
    expect(screen.queryByText("Clinical Records")).toBeNull();
    expect(screen.queryByText("Pacientes")).toBeNull();

    await waitFor(() => {
      expect(screen.getByText("No hay citas programadas para hoy.")).toBeDefined();
    });
  });

  it("shows today appointments read-only from the certified leads source", async () => {
    const today = new Date().toISOString().slice(0, 10);
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            leads: [
              {
                id: "LEAD-001",
                name: "Ana Perez",
                treatment: "Ortodoncia",
                preferredDate: `${today}T09:30:00.000Z`,
                status: "agendada",
              },
              {
                id: "LEAD-002",
                name: "Bruno Rios",
                treatment: "Implantes",
                preferredDate: `${today}T11:00:00.000Z`,
                status: "cancelada",
              },
            ],
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          },
        ),
      ),
    );

    render(<AssistantDashboard />);

    expect(await screen.findByText("Ana Perez")).toBeDefined();
    expect(screen.getByText("Ortodoncia")).toBeDefined();
    expect(screen.queryByText("Bruno Rios")).toBeNull();
    expect(screen.queryByRole("button", { name: /cancelar|editar|eliminar/i })).toBeNull();
  });
});

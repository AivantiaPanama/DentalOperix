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
    expect(screen.getAllByText("Agenda diaria").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Cola de leads").length).toBeGreaterThan(0);
    expect(screen.queryByText("Patient Management")).toBeNull();
    expect(screen.queryByText("Clinical Records")).toBeNull();
    expect(screen.queryByText("Pacientes")).toBeNull();

    await waitFor(() => {
      expect(screen.getByText("No hay citas programadas para hoy.")).toBeDefined();
      expect(screen.getByText("No hay leads disponibles en la cola.")).toBeDefined();
    });
  });

  it("keeps Today's Schedule on appointments-store and Lead Queue on /api/leads/list", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          leads: [
            {
              id: "LEAD-001",
              name: "Ana Perez",
              treatment: "Ortodoncia",
              preferredDate: "2026-06-22T09:30:00.000Z",
              status: "nuevo",
              source: "web",
              email: "ana@example.com",
              phone: "+52 55 1111 2222",
            },
          ],
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        },
      ),
    );
    vi.stubGlobal("fetch", fetchMock);

    render(<AssistantDashboard />);

    expect(await screen.findByText("Ana Perez")).toBeDefined();
    expect(screen.getByText("Ortodoncia")).toBeDefined();
    expect(fetchMock).toHaveBeenCalledWith("/api/leads/list", { credentials: "same-origin" });
    expect(screen.queryByRole("button", { name: /cancelar|editar|eliminar|agendar|asignar/i })).toBeNull();
  });
});

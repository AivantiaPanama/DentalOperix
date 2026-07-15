// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
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
    expect(
      screen.queryByRole("button", { name: /cancelar|editar|eliminar|agendar|asignar/i }),
    ).toBeNull();
  });

  it("opens PR-61.2-04B Lead Detail and updates status without changing Today's Schedule", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            leads: [
              {
                id: "LEAD-004",
                name: "Lucia Suarez",
                treatment: "Carillas",
                preferredDate: "2026-06-24",
                status: "nuevo",
                source: "web",
                email: "lucia@example.com",
                phone: "+52 55 5555 6666",
                message: "Quiere conocer opciones de carillas.",
                aiSummary: "Lead interesado en carillas.",
                emailSent: false,
              },
            ],
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          },
        ),
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ success: true, leadId: "LEAD-004", status: "seguimiento" }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }),
      );
    vi.stubGlobal("fetch", fetchMock);

    render(<AssistantDashboard />);

    expect(await screen.findByText("Lucia Suarez")).toBeDefined();
    expect(screen.getByText("No hay citas programadas para hoy.")).toBeDefined();

    fireEvent.click(screen.getByRole("button", { name: "Ver detalle de Lucia Suarez" }));

    expect(screen.getByText("Quiere conocer opciones de carillas.")).toBeDefined();
    expect(screen.getByText("Lead interesado en carillas.")).toBeDefined();

    fireEvent.change(screen.getByLabelText("Estado del lead"), {
      target: { value: "seguimiento" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Actualizar estado" }));

    expect(await screen.findByText("Estado del lead actualizado correctamente.")).toBeDefined();
    expect(screen.getByText("No hay citas programadas para hoy.")).toBeDefined();
    expect(fetchMock).toHaveBeenCalledWith("/api/leads/list", { credentials: "same-origin" });
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/leads/update-status",
      expect.objectContaining({ method: "POST" }),
    );
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock).not.toHaveBeenCalledWith("/api/leads/create", expect.anything());

    expect(screen.getByRole("button", { name: /crear solicitud de cita/i })).toBeDefined();
  });
});

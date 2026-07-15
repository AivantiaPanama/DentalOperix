// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AssistantAppointmentWorkflowCard } from "./AssistantAppointmentWorkflowCard";
import type { LeadQueueItem } from "./LeadQueueWidget";

const lead: LeadQueueItem = {
  id: "LEAD-001",
  name: "Ana Perez",
  email: "ana@example.com",
  phone: "+52 55 1111 2222",
  treatment: "Ortodoncia",
  preferredDate: "2026-06-25T14:30:00.000Z",
};

describe("61.2-06C AssistantAppointmentWorkflowCard", () => {
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it("creates an appointment request, checks provider availability, and confirms when available", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({ success: true, appointment: { id: "appt_001", status: "requested" } }),
          {
            status: 201,
            headers: { "Content-Type": "application/json" },
          },
        ),
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ success: true, available: true, conflicts: [] }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }),
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            success: true,
            appointment: { id: "appt_001", status: "confirmed", providerId: "provider_a" },
          }),
          { status: 200, headers: { "Content-Type": "application/json" } },
        ),
      );
    vi.stubGlobal("fetch", fetchMock);

    render(<AssistantAppointmentWorkflowCard lead={lead} />);

    fireEvent.change(screen.getByLabelText("Proveedor de la cita"), {
      target: { value: "provider_a" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Crear solicitud de cita" }));

    expect(
      await screen.findByText("Solicitud de cita creada para revisión de disponibilidad."),
    ).toBeDefined();
    fireEvent.click(screen.getByRole("button", { name: "Verificar disponibilidad" }));

    expect(await screen.findByText("Proveedor disponible para confirmar la cita.")).toBeDefined();
    fireEvent.click(screen.getByRole("button", { name: "Confirmar cita" }));

    expect(
      await screen.findByText("Cita confirmada con disponibilidad por proveedor."),
    ).toBeDefined();
    expect(screen.getByText("confirmed")).toBeDefined();
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/appointments/request",
      expect.objectContaining({ method: "POST" }),
    );
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/appointments/check-availability",
      expect.objectContaining({ method: "POST" }),
    );
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/appointments/confirm",
      expect.objectContaining({ method: "POST" }),
    );
    expect(fetchMock).not.toHaveBeenCalledWith("/api/leads/create", expect.anything());
  });

  it("routes unavailable requests to assistant review instead of hard failing", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({ success: true, appointment: { id: "appt_002", status: "requested" } }),
          {
            status: 201,
            headers: { "Content-Type": "application/json" },
          },
        ),
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({ success: true, available: false, conflicts: [{ id: "appt_existing" }] }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          },
        ),
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            success: true,
            appointment: { id: "appt_002", status: "needs_assistant_review" },
          }),
          { status: 200, headers: { "Content-Type": "application/json" } },
        ),
      );
    vi.stubGlobal("fetch", fetchMock);

    render(<AssistantAppointmentWorkflowCard lead={lead} />);

    fireEvent.change(screen.getByLabelText("Proveedor de la cita"), {
      target: { value: "provider_a" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Crear solicitud de cita" }));
    await screen.findByText("Solicitud de cita creada para revisión de disponibilidad.");

    fireEvent.click(screen.getByRole("button", { name: "Verificar disponibilidad" }));
    expect(
      await screen.findByText("Proveedor no disponible; envía la solicitud a revisión."),
    ).toBeDefined();

    fireEvent.click(screen.getByRole("button", { name: "Enviar a revisión" }));
    expect(await screen.findByText("Solicitud enviada a revisión de Front Desk.")).toBeDefined();
    expect(screen.getByText("needs_assistant_review")).toBeDefined();

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(3));
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/appointments/mark-review",
      expect.objectContaining({ method: "POST" }),
    );
  });
});

// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { LeadQueueWidget, filterLeadQueue, type LeadQueueItem } from "./LeadQueueWidget";

const queueLeads: LeadQueueItem[] = [
  {
    id: "LEAD-001",
    name: "Ana Perez",
    email: "ana@example.com",
    phone: "+52 55 1111 2222",
    treatment: "Ortodoncia",
    preferredDate: "2026-06-22T09:30:00.000Z",
    status: "nuevo",
    source: "web",
    createdAt: "2026-06-20T10:00:00.000Z",
    message: "Quiere evaluación inicial.",
    urgency: "media",
    aiSummary: "Lead interesado en ortodoncia.",
    calendarEventId: "evt-001",
    emailSent: true,
    notes: "Prefiere WhatsApp.",
  },
  {
    id: "LEAD-002",
    name: "Bruno Rios",
    email: "bruno@example.com",
    phone: "+52 55 3333 4444",
    treatment: "Implantes",
    preferredDate: "2026-06-23",
    status: "agendada",
    source: "chat-widget",
  },
];

describe("LeadQueueWidget PR-61.2-05", () => {
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it("loads and renders Leads from /api/leads/list as a read-only queue", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ leads: queueLeads }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    render(<LeadQueueWidget />);

    expect(screen.getByText("Cargando cola de leads...")).toBeDefined();
    expect(await screen.findByText("Ana Perez")).toBeDefined();
    expect(screen.getByText("Bruno Rios")).toBeDefined();
    expect(screen.getByText("Ortodoncia")).toBeDefined();
    expect(screen.getByText("2026-06-22")).toBeDefined();
    expect(fetchMock).toHaveBeenCalledWith("/api/leads/list", { credentials: "same-origin" });
    expect(screen.queryByRole("button", { name: /crear|editar|eliminar|agendar|asignar/i })).toBeNull();
  });

  it("supports local read-only filtering without additional writes", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ leads: queueLeads }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    render(<LeadQueueWidget />);

    await screen.findByText("Ana Perez");
    fireEvent.change(screen.getByLabelText("Buscar en cola de leads"), { target: { value: "implantes" } });

    expect(screen.queryByText("Ana Perez")).toBeNull();
    expect(screen.getByText("Bruno Rios")).toBeDefined();
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });


  it("opens a Lead Detail panel with controlled status and notes update writes", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ leads: queueLeads }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    render(<LeadQueueWidget />);

    await screen.findByText("Ana Perez");
    fireEvent.click(screen.getByRole("button", { name: "Ver detalle de Ana Perez" }));

    expect(screen.getByRole("button", { name: "Volver a la cola de leads" })).toBeDefined();
    expect(screen.getByText("Vista del lead seleccionado con actualización controlada de estado y notas internas. No edita asignaciones ni datos clínicos.")).toBeDefined();
    expect(screen.getByText("Quiere evaluación inicial.")).toBeDefined();
    expect(screen.getByText("Lead interesado en ortodoncia.")).toBeDefined();
    expect(screen.getByDisplayValue("Prefiere WhatsApp.")).toBeDefined();
    expect(screen.getByText("evt-001")).toBeDefined();
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("button", { name: "Actualizar estado" })).toBeDefined();
    expect(screen.getByRole("button", { name: "Guardar notas" })).toBeDefined();
    expect(screen.queryByRole("button", { name: /crear|editar|eliminar|agendar|asignar|reasignar/i })).toBeNull();
  });


  it("updates Lead status through /api/leads/update-status and updates local state", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ leads: queueLeads }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }),
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ success: true, leadId: "LEAD-001", status: "contactado" }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }),
      );
    vi.stubGlobal("fetch", fetchMock);

    render(<LeadQueueWidget />);

    await screen.findByText("Ana Perez");
    fireEvent.click(screen.getByRole("button", { name: "Ver detalle de Ana Perez" }));
    fireEvent.change(screen.getByLabelText("Estado del lead"), { target: { value: "contactado" } });
    fireEvent.click(screen.getByRole("button", { name: "Actualizar estado" }));

    await screen.findByText("Estado del lead actualizado correctamente.");

    expect(fetchMock).toHaveBeenCalledWith("/api/leads/update-status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({ leadId: "LEAD-001", status: "contactado" }),
    });
    expect(fetchMock).toHaveBeenCalledTimes(2);

    fireEvent.click(screen.getByRole("button", { name: "Volver a la cola de leads" }));
    expect(screen.getByText("contactado")).toBeDefined();
    expect(fetchMock).not.toHaveBeenCalledWith("/api/leads/create", expect.anything());
  });


  it("updates Lead notes through /api/leads/update-notes and updates local state", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ leads: queueLeads }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }),
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ success: true, leadId: "LEAD-001", notes: "Enviar recordatorio por WhatsApp" }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }),
      );
    vi.stubGlobal("fetch", fetchMock);

    render(<LeadQueueWidget />);

    await screen.findByText("Ana Perez");
    fireEvent.click(screen.getByRole("button", { name: "Ver detalle de Ana Perez" }));
    fireEvent.change(screen.getByLabelText("Notas internas del lead"), {
      target: { value: "Enviar recordatorio por WhatsApp" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Guardar notas" }));

    await screen.findByText("Notas del lead actualizadas correctamente.");

    expect(fetchMock).toHaveBeenCalledWith("/api/leads/update-notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({ leadId: "LEAD-001", notes: "Enviar recordatorio por WhatsApp" }),
    });
    expect(fetchMock).toHaveBeenCalledTimes(2);

    fireEvent.click(screen.getByRole("button", { name: "Volver a la cola de leads" }));
    fireEvent.click(screen.getByRole("button", { name: "Ver detalle de Ana Perez" }));
    expect(screen.getByDisplayValue("Enviar recordatorio por WhatsApp")).toBeDefined();
    expect(fetchMock).not.toHaveBeenCalledWith("/api/leads/create", expect.anything());
  });

  it("shows API errors without changing local Lead status", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ leads: queueLeads }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }),
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ success: false, error: "Status inválido" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }),
      );
    vi.stubGlobal("fetch", fetchMock);

    render(<LeadQueueWidget />);

    await screen.findByText("Ana Perez");
    fireEvent.click(screen.getByRole("button", { name: "Ver detalle de Ana Perez" }));
    fireEvent.change(screen.getByLabelText("Estado del lead"), { target: { value: "seguimiento" } });
    fireEvent.click(screen.getByRole("button", { name: "Actualizar estado" }));

    expect(await screen.findByText("Status inválido")).toBeDefined();

    fireEvent.click(screen.getByRole("button", { name: "Volver a la cola de leads" }));
    expect(screen.getAllByText("nuevo").length).toBeGreaterThan(0);
  });

  it("returns from Lead Detail to the queue preserving the list", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ leads: queueLeads }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    render(<LeadQueueWidget />);

    await screen.findByText("Ana Perez");
    fireEvent.click(screen.getByRole("button", { name: "Ver detalle de Ana Perez" }));
    fireEvent.click(screen.getByRole("button", { name: "Volver a la cola de leads" }));

    expect(screen.getByText("Bruno Rios")).toBeDefined();
    expect(screen.getByRole("button", { name: "Ver detalle de Bruno Rios" })).toBeDefined();
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("renders empty state when Leads returns no records", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ leads: [] }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }),
      ),
    );

    render(<LeadQueueWidget />);

    expect(await screen.findByText("No hay leads disponibles en la cola.")).toBeDefined();
  });

  it("renders fallback demo notice without changing the read-only contract", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            leads: queueLeads,
            fallback: true,
            message: "No se pudo leer la persistencia certificada de Leads, usando demo.",
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          },
        ),
      ),
    );

    render(<LeadQueueWidget />);

    expect(await screen.findByText("Modo demo de Leads")).toBeDefined();
    expect(screen.getByText("No se pudo leer la persistencia certificada de Leads, usando demo.")).toBeDefined();
    expect(screen.queryByRole("button", { name: /crear|editar|eliminar|agendar|asignar/i })).toBeNull();
  });

  it("renders API errors without bypassing RBAC", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ error: "Forbidden" }), {
          status: 403,
          headers: { "Content-Type": "application/json" },
        }),
      ),
    );

    render(<LeadQueueWidget />);

    expect(await screen.findByText("No se pudo cargar Leads")).toBeDefined();
    expect(screen.getByText("Forbidden")).toBeDefined();
  });

  it("filters Leads by certified read fields only", () => {
    expect(filterLeadQueue(queueLeads, "chat-widget")).toEqual([queueLeads[1]]);
    expect(filterLeadQueue(queueLeads, "ana@example.com")).toEqual([queueLeads[0]]);
    expect(filterLeadQueue(queueLeads, "no-match")).toEqual([]);
  });
});

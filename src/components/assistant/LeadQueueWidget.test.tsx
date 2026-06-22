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

describe("LeadQueueWidget PR-61.2-03", () => {
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

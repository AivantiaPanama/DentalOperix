/* eslint-disable @typescript-eslint/no-explicit-any */
import { beforeEach, describe, expect, it, vi } from "vitest";

const updateLead = vi.fn();
const appendLead = vi.fn();

vi.mock("@/server/leads/persistence/lead-persistence-provider", () => ({
  leadPersistenceProvider: {
    getActiveLeadPersistenceAdapter: vi.fn(() => ({
      updateLead,
      appendLead,
      listLeads: vi.fn(),
      getHealth: vi.fn(() => ({ active: true })),
    })),
  },
}));

let POST: (request: Request) => Promise<Response>;

function request(body: unknown, headers: Record<string, string> = { "x-api-key": "test-key" }) {
  return new Request("http://localhost/api/leads/update-notes", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify(body),
  });
}

describe("/api/leads/update-notes", () => {
  beforeEach(async () => {
    vi.resetAllMocks();
    process.env.INTERNAL_API_KEY = "test-key";
    process.env.GOOGLE_CLIENT_ID = "client-id";
    process.env.GOOGLE_CLIENT_SECRET = "client-secret";
    process.env.GOOGLE_REDIRECT_URI = "https://example.com/oauth";
    process.env.GOOGLE_SCOPES = "scope";
    process.env.GOOGLE_SHEET_ID = "sheet-id";
    process.env.GMAIL_SENDER = "clinic@example.com";
    const routeModule = await import("./update-notes");
    POST = routeModule.POST;
  });

  it("returns 401 when neither session nor internal key is present", async () => {
    const response = await POST(request({ leadId: "lead-1", notes: "Llamar por WhatsApp" }, {}));

    expect(response.status).toBe(401);
    expect(updateLead).not.toHaveBeenCalled();
  });

  it("updates only Lead notes through the certified persistence adapter", async () => {
    updateLead.mockResolvedValue(undefined);

    const response = await POST(request({ leadId: "lead-1", notes: "Llamar por WhatsApp" }));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      success: true,
      leadId: "lead-1",
      notes: "Llamar por WhatsApp",
    });
    expect(updateLead).toHaveBeenCalledWith("lead-1", { notes: "Llamar por WhatsApp" });
    expect(appendLead).not.toHaveBeenCalled();
  });

  it("allows clearing Lead notes with an empty string", async () => {
    updateLead.mockResolvedValue(undefined);

    const response = await POST(request({ leadId: "lead-1", notes: "" }));

    expect(response.status).toBe(200);
    expect(updateLead).toHaveBeenCalledWith("lead-1", { notes: "" });
  });

  it("rejects missing leadId", async () => {
    const response = await POST(request({ notes: "Nota" }));

    expect(response.status).toBe(400);
    expect(updateLead).not.toHaveBeenCalled();
  });

  it("rejects extra fields to avoid widening the write contract", async () => {
    const response = await POST(
      request({ leadId: "lead-1", notes: "Nota", status: "seguimiento" }),
    );

    expect(response.status).toBe(400);
    expect(updateLead).not.toHaveBeenCalled();
  });

  it("rejects notes over the approved operational limit", async () => {
    const response = await POST(request({ leadId: "lead-1", notes: "x".repeat(5001) }));

    expect(response.status).toBe(400);
    expect(updateLead).not.toHaveBeenCalled();
  });

  it("returns 500 when the certified adapter fails", async () => {
    updateLead.mockRejectedValue(new Error("Lead not found"));

    const response = await POST(request({ leadId: "missing", notes: "Nota" }));

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({ success: false, error: "Lead not found" });
  });
});

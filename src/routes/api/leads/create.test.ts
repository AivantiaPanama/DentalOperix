import { describe, expect, it, vi, beforeEach } from "vitest";
import { processDentalLead } from "@/lib/api/dental.server";
import { POST } from "./create";

vi.mock("@/lib/api/dental.server", () => ({
  processDentalLead: vi.fn(),
}));

describe("/api/leads/create", () => {
  const mockedProcessDentalLead = vi.mocked(processDentalLead, true);

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("returns 400 when service is missing", async () => {
    const request = new Request("http://localhost/api/leads/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Ana",
        email: "ana@example.com",
        phone: "+507 60000000",
        service: "",
        date: "2026-06-20",
        time: "10:00",
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);

    const body = JSON.parse(await response.text());
    expect(body).toEqual({
      success: false,
      error: "Para continuar necesito saber qué tratamiento o servicio necesitas.",
    });

    expect(mockedProcessDentalLead).not.toHaveBeenCalled();
  });

  it("returns 201 and calls processDentalLead when service is valid", async () => {
    mockedProcessDentalLead.mockResolvedValue({
      appointmentId: "lead_123",
      status: "pending",
      eventLink: null,
      calendarCreated: false,
      emailSent: false,
      crmSaved: true,
      message: "Recibimos tu solicitud. Nuestro equipo confirmará la disponibilidad contigo.",
    });

    const request = new Request("http://localhost/api/leads/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Ana",
        email: "ana@example.com",
        phone: "+507 60000000",
        service: "limpieza",
        date: "2026-06-20",
        time: "10:00",
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(201);

    const body = JSON.parse(await response.text());
    expect(body).toEqual({
      success: true,
      appointmentId: "lead_123",
      status: "pending",
      eventLink: null,
      calendarCreated: false,
      emailSent: false,
      crmSaved: true,
      message: "Recibimos tu solicitud. Nuestro equipo confirmará la disponibilidad contigo.",
    });

    expect(mockedProcessDentalLead).toHaveBeenCalledOnce();
  });
});

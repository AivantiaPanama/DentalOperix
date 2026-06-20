import { beforeEach, describe, expect, it, vi } from "vitest";
import { processDentalLead } from "./dental.server";
import type { DentalLeadPayload } from "./dental.server";

vi.mock("../google/google.server", () => ({
  createGoogleCalendarEvent: vi.fn(),
  sendConfirmationEmail: vi.fn(),
}));

const appendLead = vi.fn();
const updateLead = vi.fn();

vi.mock("@/server/leads/persistence", () => ({
  leadPersistenceProvider: {
    getActiveLeadPersistenceAdapter: vi.fn(() => ({
      appendLead,
      updateLead,
    })),
  },
}));

const googleServer = await import("../google/google.server");
const mockedCreateGoogleCalendarEvent = vi.mocked(googleServer.createGoogleCalendarEvent);
const mockedSendConfirmationEmail = vi.mocked(googleServer.sendConfirmationEmail);
const mockedAppendLead = vi.mocked(appendLead);
const mockedUpdateLead = vi.mocked(updateLead);

describe("processDentalLead", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("uses service as treatment when treatment is missing and processes calendar/email flow", async () => {
    mockedCreateGoogleCalendarEvent.mockResolvedValue({
      id: "evt_123",
      htmlLink: "https://calendar.example/evt_123",
    });
    mockedSendConfirmationEmail.mockResolvedValue({
      patientEmailSent: true,
      clinicEmailSent: true,
    });

    const payload: DentalLeadPayload = {
      name: "Lucía",
      email: "lucia@example.com",
      phone: "+507 60000000",
      service: "limpieza",
      date: "2026-06-25",
      time: "14:30",
      source: "chat-widget",
    };

    const result = await processDentalLead(payload);

    expect(mockedAppendLead).toHaveBeenCalledOnce();
    expect(mockedAppendLead.mock.calls[0][0]).toMatchObject({
      treatment: "limpieza",
      name: "Lucía",
      email: "lucia@example.com",
      phone: "+507 60000000",
      status: "nuevo",
    });

    expect(mockedCreateGoogleCalendarEvent).toHaveBeenCalledOnce();
    expect(mockedUpdateLead).toHaveBeenCalledTimes(2);
    expect(mockedSendConfirmationEmail).toHaveBeenCalledOnce();

    expect(result).toMatchObject({
      appointmentId: expect.stringContaining("dental_"),
      status: "confirmed",
      eventLink: "https://calendar.example/evt_123",
      calendarCreated: true,
      emailSent: true,
    });
  });

  it("logs LEAD RECORD with treatment when treatment is ortodoncia", async () => {
    const consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => undefined);
    mockedCreateGoogleCalendarEvent.mockResolvedValue({
      id: "evt_123",
      htmlLink: "https://calendar.example/evt_123",
    });
    mockedSendConfirmationEmail.mockResolvedValue({
      patientEmailSent: true,
      clinicEmailSent: true,
    });

    const payload: DentalLeadPayload = {
      name: "María",
      email: "maria@example.com",
      phone: "+507 62222222",
      service: "ortodoncia",
      date: "2026-06-27",
      time: "16:00",
      source: "chat-widget",
    };

    await processDentalLead(payload);

    expect(mockedAppendLead).toHaveBeenCalledOnce();
    expect(consoleLogSpy).toHaveBeenCalledWith(
      "LEAD RECORD:",
      expect.objectContaining({
        treatment: "ortodoncia",
      }),
    );

    consoleLogSpy.mockRestore();
  });

  it("prefers payload.treatment over payload.service when treatment exists", async () => {
    mockedCreateGoogleCalendarEvent.mockResolvedValue({
      id: "evt_456",
      htmlLink: "https://calendar.example/evt_456",
    });
    mockedSendConfirmationEmail.mockResolvedValue({
      patientEmailSent: true,
      clinicEmailSent: true,
    });

    const payload: DentalLeadPayload = {
      name: "Javier",
      email: "javier@example.com",
      phone: "+507 61111111",
      service: "implante",
      treatment: "implante dental",
      date: "2026-06-26",
      time: "11:00",
      source: "chat-widget",
    };

    await processDentalLead(payload);

    expect(mockedAppendLead).toHaveBeenCalledOnce();
    expect(mockedAppendLead.mock.calls[0][0]).toMatchObject({
      treatment: "implante dental",
    });
  });

  it("keeps lead/calendar success but marks email delivery incomplete when patient notification fails", async () => {
    mockedCreateGoogleCalendarEvent.mockResolvedValue({
      id: "evt_789",
      htmlLink: "https://calendar.example/evt_789",
    });
    mockedSendConfirmationEmail.mockRejectedValue(
      Object.assign(new Error("One or more booking notification emails failed."), {
        delivery: { patientEmailSent: false, clinicEmailSent: true },
      }),
    );

    const payload: DentalLeadPayload = {
      name: "Paciente Externo",
      email: "paciente@external.example",
      phone: "+507 65555555",
      service: "limpieza",
      date: "2026-06-29",
      time: "09:00",
      source: "web-form",
    };

    const result = await processDentalLead(payload);

    expect(mockedAppendLead).toHaveBeenCalledOnce();
    expect(mockedCreateGoogleCalendarEvent).toHaveBeenCalledOnce();
    expect(mockedUpdateLead).toHaveBeenCalledWith(
      expect.stringContaining("dental_"),
      expect.objectContaining({ emailSent: false }),
    );
    expect(result).toMatchObject({
      calendarCreated: true,
      emailSent: false,
      patientEmailSent: false,
      clinicEmailSent: true,
      crmSaved: true,
    });
  });
});

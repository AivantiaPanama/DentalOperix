/* eslint-disable @typescript-eslint/no-explicit-any */
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockSend = vi.fn();
const mockModify = vi.fn();

vi.mock("googleapis", () => {
  function MockOAuth2(this: any) {
    this.setCredentials = vi.fn();
  }

  return {
    google: {
      auth: {
        OAuth2: MockOAuth2,
      },
      gmail: vi.fn(() => ({
        users: {
          messages: {
            send: mockSend,
            modify: mockModify,
          },
        },
      })),
    },
  };
});

import { sendConfirmationEmail } from "./google.server";

const requiredEnv = {
  GOOGLE_CLIENT_ID: "test-client-id",
  GOOGLE_CLIENT_SECRET: "test-client-secret",
  GOOGLE_REDIRECT_URI: "https://example.com/oauth2callback",
  GOOGLE_SCOPES: "https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/gmail.modify",
  GOOGLE_REFRESH_TOKEN: "test-refresh-token",
  GOOGLE_SHEET_ID: "sheet-id",
  GOOGLE_SHEET_NAME: "Leads",
  GOOGLE_CALENDAR_TIMEZONE: "America/Panama",
  GMAIL_SENDER: "clinica@example.com",
};

function withDefaultEnv() {
  Object.assign(process.env, requiredEnv);
  delete process.env.CLINIC_NOTIFICATION_EMAIL;
  delete process.env.GOOGLE_CALENDAR_ID;
}

const payload = {
  appointmentId: "apt_123",
  name: "Paciente Test",
  email: "paciente@example.com",
  phone: "+507 60000000",
  service: "Diseño de sonrisa",
  date: "2026-06-20",
  time: "10:00",
  notes: "Prueba",
};

function decodeRaw(raw: string) {
  return Buffer.from(raw.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf8");
}

describe("sendConfirmationEmail", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    withDefaultEnv();
  });

  it("sends an explicit clinic email and marks self-notifications as inbox/unread when clinic equals sender", async () => {
    mockSend.mockResolvedValueOnce({ data: { id: "patient-message" } });
    mockSend.mockResolvedValueOnce({ data: { id: "clinic-message" } });
    mockModify.mockResolvedValue({});

    const result = await sendConfirmationEmail(payload, "https://calendar.example/event/1");

    expect(result).toMatchObject({
      patientEmailSent: true,
      clinicEmailSent: true,
    });
    expect(mockSend).toHaveBeenCalledTimes(2);

    const patientMessage = decodeRaw(mockSend.mock.calls[0][0].requestBody.raw);
    const clinicMessage = decodeRaw(mockSend.mock.calls[1][0].requestBody.raw);

    expect(patientMessage).toContain("To: paciente@example.com");
    expect(patientMessage).toContain("X-DentalOperix-Notification-Audience: patient");
    expect(clinicMessage).toContain("To: clinica@example.com");
    expect(clinicMessage).toContain("X-DentalOperix-Notification-Audience: clinic");
    expect(mockModify).toHaveBeenCalledWith({
      userId: "me",
      id: "clinic-message",
      requestBody: {
        addLabelIds: ["INBOX", "UNREAD"],
      },
    });
  });

  it("does not fail clinic delivery when Gmail cannot mark a self-notification as inbox/unread", async () => {
    mockSend.mockResolvedValueOnce({ data: { id: "patient-message" } });
    mockSend.mockResolvedValueOnce({ data: { id: "clinic-message" } });
    mockModify.mockRejectedValue(new Error("Insufficient Permission"));

    const result = await sendConfirmationEmail(payload, "https://calendar.example/event/1");

    expect(result).toMatchObject({
      patientEmailSent: true,
      clinicEmailSent: true,
    });
    expect(mockModify).toHaveBeenCalledTimes(1);
  });
});

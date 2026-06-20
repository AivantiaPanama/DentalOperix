/* eslint-disable @typescript-eslint/no-explicit-any */
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockSend = vi.fn();

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
          },
        },
      })),
    },
  };
});

import { sendDentalConfirmationEmail } from "./gmail";

const requiredEnv = {
  GOOGLE_CLIENT_ID: "test-client-id",
  GOOGLE_CLIENT_SECRET: "test-client-secret",
  GOOGLE_REDIRECT_URI: "https://example.com/oauth2callback",
  GOOGLE_SCOPES: "https://www.googleapis.com/auth/gmail.send",
  GOOGLE_REFRESH_TOKEN: "test-refresh-token",
  GOOGLE_SHEET_ID: "sheet-id",
  GOOGLE_SHEET_NAME: "Leads",
  GOOGLE_CALENDAR_TIMEZONE: "America/Panama",
  GMAIL_SENDER: "no-reply@example.com",
};

function withDefaultEnv() {
  Object.assign(process.env, requiredEnv);
  delete process.env.GOOGLE_CALENDAR_ID;
}

describe("sendDentalConfirmationEmail", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    withDefaultEnv();
  });

  it("encodes the subject as UTF-8 MIME encoded-word and sets UTF-8 content type", async () => {
    mockSend.mockResolvedValue({});

    await sendDentalConfirmationEmail({
      name: "Ana",
      email: "ana@example.com",
      phone: "+507 64444444",
      service: "limpieza",
      date: "2026-06-20",
      time: "10:00",
      eventLink: "https://calendar.example/event/1",
      notes: "Prueba",
    });

    expect(mockSend).toHaveBeenCalledTimes(2);

    const raw = mockSend.mock.calls[0][0].requestBody.raw as string;
    const decoded = Buffer.from(raw.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString(
      "utf8",
    );
    const htmlStart = decoded.indexOf("\r\n\r\n") + 4;
    const encodedHtmlBody = decoded.slice(htmlStart).trim();
    const htmlBody = Buffer.from(encodedHtmlBody, "base64").toString("utf8");

    expect(decoded).toContain("To: ana@example.com");
    expect(decoded).toContain("Subject: =?UTF-8?B?");
    expect(decoded).toContain("Content-Type: text/html; charset=UTF-8");
    expect(decoded).toContain("Content-Transfer-Encoding: base64");
    expect(htmlBody).toContain("<p>Hola Ana,</p>");

    const clinicRaw = mockSend.mock.calls[1][0].requestBody.raw as string;
    const clinicDecoded = Buffer.from(
      clinicRaw.replace(/-/g, "+").replace(/_/g, "/"),
      "base64",
    ).toString("utf8");
    expect(clinicDecoded).toContain("To: no-reply@example.com");
  });
});

/* eslint-disable @typescript-eslint/no-explicit-any */
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockInsert = vi.fn();

vi.mock("googleapis", () => {
  function MockOAuth2(this: any) {
    this.setCredentials = vi.fn();
  }

  return {
    google: {
      auth: {
        OAuth2: MockOAuth2,
      },
      calendar: vi.fn(() => ({
        events: {
          insert: mockInsert,
        },
      })),
    },
  };
});

import { createDentalAppointment } from "./calendar";

const requiredEnv = {
  GOOGLE_CLIENT_ID: "test-client-id",
  GOOGLE_CLIENT_SECRET: "test-client-secret",
  GOOGLE_REDIRECT_URI: "https://example.com/oauth2callback",
  GOOGLE_SCOPES: "https://www.googleapis.com/auth/calendar.events",
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

describe("createDentalAppointment", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    withDefaultEnv();
  });

  it("uses primary when GOOGLE_CALENDAR_ID is missing and logs event metadata in development", async () => {
    const mockedEvent = {
      data: {
        id: "evt_999",
        htmlLink: "https://calendar.example/evt_999",
        start: { dateTime: "2026-06-25T10:00:00" },
        end: { dateTime: "2026-06-25T10:45:00" },
      },
    };
    mockInsert.mockResolvedValue(mockedEvent);
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => undefined);

    const result = await createDentalAppointment({
      name: "Carlos",
      email: "carlos@example.com",
      phone: "+507 63333333",
      service: "implante",
      date: "2026-06-25",
      time: "10:00",
    });

    expect(mockInsert).toHaveBeenCalledOnce();
    expect(mockInsert.mock.calls[0][0].calendarId).toBe("primary");
    expect(consoleSpy).toHaveBeenCalledWith(
      "CALENDAR EVENT:",
      expect.objectContaining({
        id: "evt_999",
        htmlLink: "https://calendar.example/evt_999",
        calendarId: "primary",
      }),
    );
    expect(result).toMatchObject({ id: "evt_999", htmlLink: "https://calendar.example/evt_999" });

    consoleSpy.mockRestore();
  });
});

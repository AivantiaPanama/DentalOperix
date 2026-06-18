import { beforeEach, describe, expect, it, vi } from "vitest";

const sendConfirmationEmail = vi.fn();
vi.mock("@/server/google/gmail", () => ({
  sendConfirmationEmail,
}));

vi.mock("@/lib/config.server", () => ({
  getServerConfig: vi.fn(() => ({ internalApiKey: "test-key" })),
  isProduction: vi.fn(() => false),
}));

let POST: (request: Request) => Promise<Response>;

describe("/api/gmail/send-confirmation", () => {
  beforeEach(async () => {
    vi.resetAllMocks();
    const routeModule = await import("./send-confirmation");
    POST = routeModule.POST;
  });

  it("returns 401 when x-api-key is missing", async () => {
    const request = new Request("http://localhost/api/gmail/send-confirmation", {
      method: "POST",
      body: JSON.stringify({}),
    });

    const response = await POST(request);
    expect(response.status).toBe(401);
    expect(await response.json()).toEqual({ success: false, error: "Unauthorized" });
    expect(sendConfirmationEmail).not.toHaveBeenCalled();
  });

  it("returns 201 when x-api-key is valid and payload is valid", async () => {
    sendConfirmationEmail.mockResolvedValue(undefined);

    const request = new Request("http://localhost/api/gmail/send-confirmation", {
      method: "POST",
      headers: { "x-api-key": "test-key", "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Ana",
        email: "ana@example.com",
        phone: "+50760000000",
        service: "Limpieza",
        date: "2026-06-20",
        time: "10:00",
        eventLink: "https://calendar.google.com/event",
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(201);
    expect(await response.json()).toEqual({ success: true });
    expect(sendConfirmationEmail).toHaveBeenCalledOnce();
  });
});

import { beforeEach, describe, expect, it, vi } from "vitest";

const { getServerConfig } = vi.hoisted(() => ({
  getServerConfig: vi.fn(),
}));

vi.mock("@/lib/config.server", () => ({
  getServerConfig,
}));

const { ADMIN_SESSION_COOKIE, verifyAdminSessionToken } = await import("@/lib/admin-auth.server");
const { POST } = await import("./login");

const TEST_SECRET = "test-admin-session-secret-32chars-min";

describe("/api/admin/login", () => {
  beforeEach(() => {
    getServerConfig.mockReturnValue({
      adminPassword: "admin-pass",
      adminSessionSecret: TEST_SECRET,
    });
  });

  it("returns 401 when password is missing", async () => {
    const response = await POST(
      new Request("http://localhost/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      }),
    );

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({
      success: false,
      error: "Credenciales inválidas.",
    });
  });

  it("returns 401 when password is invalid", async () => {
    const response = await POST(
      new Request("http://localhost/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: "wrong-pass" }),
      }),
    );

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({
      success: false,
      error: "Credenciales inválidas.",
    });
  });

  it("returns 200 and sets the admin session cookie for valid credentials", async () => {
    const response = await POST(
      new Request("http://localhost/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: "admin-pass" }),
      }),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ success: true });

    const setCookie = response.headers.get("Set-Cookie");
    expect(setCookie).toContain(`${ADMIN_SESSION_COOKIE}=`);
    expect(setCookie).toContain("HttpOnly");
    expect(setCookie).toContain("Max-Age=28800");

    const token = decodeURIComponent(setCookie?.split(";")[0].split("=")[1] ?? "");
    expect(verifyAdminSessionToken(token)).toMatchObject({ role: "administrator" });
  });

  it("returns 500 when session secret is not configured", async () => {
    getServerConfig.mockReturnValue({
      adminPassword: "admin-pass",
      adminSessionSecret: undefined,
    });

    const response = await POST(
      new Request("http://localhost/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: "admin-pass" }),
      }),
    );

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      success: false,
      error: "ADMIN_SESSION_SECRET is not configured.",
    });
  });
});

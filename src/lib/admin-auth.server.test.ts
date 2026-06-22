import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { getServerConfig } = vi.hoisted(() => ({
  getServerConfig: vi.fn(),
}));

vi.mock("./config.server", () => ({
  getServerConfig,
}));

const {
  ADMIN_SESSION_COOKIE,
  createAdminLogoutCookie,
  createAdminSessionCookie,
  createAdminSessionToken,
  verifyAdminSessionToken,
} = await import("./admin-auth.server");

const TEST_SECRET = "test-admin-session-secret-32chars-min";

describe("admin-auth.server", () => {
  beforeEach(() => {
    getServerConfig.mockReturnValue({
      adminSessionSecret: TEST_SECRET,
      adminPassword: "admin-pass",
    });
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  describe("createAdminSessionToken", () => {
    it("creates a signed token with admin role and expiry", () => {
      const now = Math.floor(Date.now() / 1000);
      const token = createAdminSessionToken(now);
      const payload = verifyAdminSessionToken(token);

      expect(payload).toEqual({
        role: "administrator",
        iat: now,
        exp: now + 60 * 60 * 8,
      });
    });

    it("creates a signed token for assistant role without changing RBAC semantics", () => {
      const now = Math.floor(Date.now() / 1000);
      const token = createAdminSessionToken(now, "assistant");

      expect(verifyAdminSessionToken(token)).toEqual({
        role: "assistant",
        iat: now,
        exp: now + 60 * 60 * 8,
      });
    });

    it("throws when ADMIN_SESSION_SECRET is not configured", () => {
      getServerConfig.mockReturnValue({ adminSessionSecret: undefined });

      expect(() => createAdminSessionToken()).toThrow("ADMIN_SESSION_SECRET is not configured.");
    });
  });

  describe("verifyAdminSessionToken", () => {
    it("returns null for missing tokens", () => {
      expect(verifyAdminSessionToken()).toBeNull();
      expect(verifyAdminSessionToken("")).toBeNull();
    });

    it("returns null for malformed tokens", () => {
      expect(verifyAdminSessionToken("not-a-valid-token")).toBeNull();
    });

    it("returns null for tampered signatures", () => {
      const token = createAdminSessionToken();
      const tampered = `${token.slice(0, -1)}x`;

      expect(verifyAdminSessionToken(tampered)).toBeNull();
    });

    it("returns null for expired tokens", () => {
      const expiredToken = createAdminSessionToken(Math.floor(Date.now() / 1000) - 60 * 60 * 9);

      expect(verifyAdminSessionToken(expiredToken)).toBeNull();
    });

    it("returns null when ADMIN_SESSION_SECRET is not configured", () => {
      const token = createAdminSessionToken();
      getServerConfig.mockReturnValue({ adminSessionSecret: undefined });

      expect(verifyAdminSessionToken(token)).toBeNull();
    });
  });

  describe("createAdminSessionCookie", () => {
    it("sets a secure session cookie with the expected attributes", () => {
      const token = createAdminSessionToken(1_700_000_000);
      const cookie = createAdminSessionCookie(token);

      expect(cookie).toContain(`${ADMIN_SESSION_COOKIE}=${encodeURIComponent(token)}`);
      expect(cookie).toContain("Path=/");
      expect(cookie).toContain("HttpOnly");
      expect(cookie).toContain("SameSite=Lax");
      expect(cookie).toContain("Max-Age=28800");
      expect(cookie).not.toContain("Secure");
    });

    it("adds Secure in production", () => {
      vi.stubEnv("NODE_ENV", "production");

      const cookie = createAdminSessionCookie("session-token");

      expect(cookie).toContain("Secure");
    });
  });

  describe("createAdminLogoutCookie", () => {
    it("clears the session cookie", () => {
      const cookie = createAdminLogoutCookie();

      expect(cookie).toContain(`${ADMIN_SESSION_COOKIE}=`);
      expect(cookie).toContain("Path=/");
      expect(cookie).toContain("HttpOnly");
      expect(cookie).toContain("SameSite=Lax");
      expect(cookie).toContain("Max-Age=0");
      expect(cookie).not.toContain("Secure");
    });

    it("adds Secure in production", () => {
      vi.stubEnv("NODE_ENV", "production");

      const cookie = createAdminLogoutCookie();

      expect(cookie).toContain("Secure");
    });
  });
});

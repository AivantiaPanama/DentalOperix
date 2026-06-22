import { createHmac, timingSafeEqual } from "node:crypto";
import process from "node:process";
import { getServerConfig } from "./config.server";
import { requireInternalApiKey } from "./internal-api-key.server";
import type { Role } from "./rbac/roles";

export const ADMIN_SESSION_COOKIE = "dentaloperix_admin_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 8;

export type AdminSessionPayload = {
  role: Extract<Role, "administrator">;
  iat: number;
  exp: number;
};

export class UnauthorizedAdminError extends Error {}

function base64UrlEncode(value: string) {
  return Buffer.from(value, "utf8").toString("base64url");
}

function base64UrlDecode(value: string) {
  return Buffer.from(value, "base64url").toString("utf8");
}

function sign(value: string, secret: string) {
  return createHmac("sha256", secret).update(value).digest("base64url");
}

function safeEqual(a: string, b: string) {
  const aBuffer = Buffer.from(a);
  const bBuffer = Buffer.from(b);
  if (aBuffer.length !== bBuffer.length) return false;
  return timingSafeEqual(aBuffer, bBuffer);
}

export function verifyAdminPassword(password: string) {
  const { adminPassword } = getServerConfig();
  if (!adminPassword) return false;
  return safeEqual(password, adminPassword);
}

export function createAdminSessionToken(now = Math.floor(Date.now() / 1000)) {
  const { adminSessionSecret } = getServerConfig();
  if (!adminSessionSecret) {
    throw new Error("ADMIN_SESSION_SECRET is not configured.");
  }

  const payload: AdminSessionPayload = {
    role: "administrator",
    iat: now,
    exp: now + SESSION_MAX_AGE_SECONDS,
  };
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  return `${encodedPayload}.${sign(encodedPayload, adminSessionSecret)}`;
}

export function verifyAdminSessionToken(token?: string | null) {
  if (!token) return null;
  const { adminSessionSecret } = getServerConfig();
  if (!adminSessionSecret) return null;

  const [encodedPayload, signature] = token.split(".");
  if (!encodedPayload || !signature) return null;

  const expectedSignature = sign(encodedPayload, adminSessionSecret);
  if (!safeEqual(signature, expectedSignature)) return null;

  try {
    const payload = JSON.parse(base64UrlDecode(encodedPayload)) as AdminSessionPayload;
    if (payload.role !== "administrator") return null;
    if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

export function parseCookies(cookieHeader: string | null) {
  const cookies = new Map<string, string>();
  if (!cookieHeader) return cookies;

  for (const part of cookieHeader.split(";")) {
    const [rawName, ...rawValue] = part.trim().split("=");
    if (!rawName) continue;
    cookies.set(rawName, decodeURIComponent(rawValue.join("=")));
  }

  return cookies;
}

export function getAdminSessionFromRequest(request: Request) {
  const cookies = parseCookies(request.headers.get("cookie"));
  return verifyAdminSessionToken(cookies.get(ADMIN_SESSION_COOKIE));
}

function isTestRuntime() {
  return (
    process.env.NODE_ENV === "test" || process.env.VITEST === "true" || process.env.VITEST === "1"
  );
}

function canBypassAdminAuthInDevelopment() {
  return isTestRuntime();
}

export function requireAdminSession(request?: Request) {
  if (canBypassAdminAuthInDevelopment()) {
    return { role: "administrator", iat: 0, exp: Number.MAX_SAFE_INTEGER } as const;
  }

  if (!request) {
    throw new UnauthorizedAdminError("Unauthorized");
  }

  const session = getAdminSessionFromRequest(request);
  if (!session) {
    throw new UnauthorizedAdminError("Unauthorized");
  }
  return session;
}

export function requireAdminSessionOrInternalApiKey(request: Request) {
  const session = getAdminSessionFromRequest(request);
  if (session) return session;

  requireInternalApiKey(request);
  return null;
}

export function createAdminSessionCookie(token: string) {
  const attributes = [
    `${ADMIN_SESSION_COOKIE}=${encodeURIComponent(token)}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${SESSION_MAX_AGE_SECONDS}`,
  ];
  if (process.env.NODE_ENV === "production") attributes.push("Secure");
  return attributes.join("; ");
}

export function createAdminLogoutCookie() {
  const attributes = [
    `${ADMIN_SESSION_COOKIE}=`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    "Max-Age=0",
  ];
  if (process.env.NODE_ENV === "production") attributes.push("Secure");
  return attributes.join("; ");
}

export function createUnauthorizedAdminResponse() {
  return new Response(JSON.stringify({ success: false, error: "Unauthorized" }), {
    status: 401,
    headers: { "Content-Type": "application/json" },
  });
}

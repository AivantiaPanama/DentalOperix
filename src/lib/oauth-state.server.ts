import { randomUUID } from "node:crypto";

const STATE_COOKIE_NAME = "GOOGLE_OAUTH_STATE";
const STATE_COOKIE_MAX_AGE = 10 * 60; // 10 minutes
export const secureOAuthCookie = process.env.NODE_ENV === "production";

export function generateOAuthState(): string {
  return randomUUID();
}

export function parseCookies(cookieHeader?: string | null): Record<string, string> {
  if (!cookieHeader) return {};

  return Object.fromEntries(
    cookieHeader.split(";").map((cookie) => {
      const [key, ...valueParts] = cookie.trim().split("=");
      return [key, decodeURIComponent(valueParts.join("="))];
    }),
  );
}

export function getOAuthStateFromCookies(request: Request): string | undefined {
  const cookies = parseCookies(request.headers.get("cookie"));
  return cookies[STATE_COOKIE_NAME];
}

export function createOAuthStateCookie(state: string, secure = secureOAuthCookie): string {
  const parts = [
    `${STATE_COOKIE_NAME}=${encodeURIComponent(state)}`,
    `Path=/`,
    `Max-Age=${STATE_COOKIE_MAX_AGE}`,
    `SameSite=Lax`,
    `HttpOnly`,
  ];

  if (secure) {
    parts.push("Secure");
  }

  return parts.join("; ");
}

export function clearOAuthStateCookie(secure = secureOAuthCookie): string {
  const parts = [`${STATE_COOKIE_NAME}=; Path=/`, `Max-Age=0`, `SameSite=Lax`, `HttpOnly`];

  if (secure) {
    parts.push("Secure");
  }

  return parts.join("; ");
}

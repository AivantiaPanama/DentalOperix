import { getServerConfig, isProduction } from "./config.server";

export class UnauthorizedApiKeyError extends Error {}

export function requireInternalApiKey(request: Request) {
  const config = getServerConfig();
  const apiKey = request.headers.get("x-api-key")?.trim();

  if (config.internalApiKey) {
    if (!apiKey || apiKey !== config.internalApiKey) {
      throw new UnauthorizedApiKeyError("Unauthorized");
    }
    return;
  }

  if (isProduction()) {
    throw new UnauthorizedApiKeyError("Unauthorized");
  }
}

export function createUnauthorizedResponse() {
  return new Response(JSON.stringify({ success: false, error: "Unauthorized" }), {
    status: 401,
    headers: { "Content-Type": "application/json" },
  });
}

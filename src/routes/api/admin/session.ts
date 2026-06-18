import { getAuthSessionFromRequest } from "@/lib/rbac/guards.server";

export async function GET(request: Request) {
  const session = getAuthSessionFromRequest(request);
  return new Response(
    JSON.stringify({
      authenticated: Boolean(session),
      role: session?.role,
      permissions: session?.permissions ?? [],
    }),
    {
      status: session ? 200 : 401,
      headers: { "Content-Type": "application/json" },
    },
  );
}

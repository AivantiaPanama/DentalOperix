import {
  createAdminSessionCookie,
  createAdminSessionToken,
  verifyAdminPassword,
} from "@/lib/admin-auth.server";
import { isRole, type Role } from "@/lib/rbac/roles";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { password?: string; role?: unknown };
    const requestedRole: Role = isRole(body.role) ? body.role : "administrator";
    if (!body.password || !verifyAdminPassword(body.password)) {
      return new Response(JSON.stringify({ success: false, error: "Credenciales inválidas." }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const token = createAdminSessionToken(Math.floor(Date.now() / 1000), requestedRole);
    return new Response(JSON.stringify({ success: true, role: requestedRole }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Set-Cookie": createAdminSessionCookie(token),
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Error de autenticación.",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}

import { createAdminLogoutCookie } from "@/lib/admin-auth.server";

export async function POST() {
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Set-Cookie": createAdminLogoutCookie(),
    },
  });
}

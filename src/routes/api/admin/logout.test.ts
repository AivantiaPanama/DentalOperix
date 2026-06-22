import { describe, expect, it } from "vitest";
import { ADMIN_SESSION_COOKIE } from "@/lib/admin-auth.server";
import { POST } from "./logout";

describe("/api/admin/logout", () => {
  it("returns 200 and clears the admin session cookie", async () => {
    const response = await POST();

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ success: true });

    const setCookie = response.headers.get("Set-Cookie");
    expect(setCookie).toContain(`${ADMIN_SESSION_COOKIE}=`);
    expect(setCookie).toContain("HttpOnly");
    expect(setCookie).toContain("SameSite=Lax");
    expect(setCookie).toContain("Max-Age=0");
  });
});

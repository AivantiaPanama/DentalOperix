import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const read = (path: string) => readFileSync(join(root, path), "utf8");
const exists = (path: string) => existsSync(join(root, path));

describe("DentalOperix architecture guards", () => {
  it("keeps BookingDialog as the only public UI component invoking appointment creation", () => {
    const bookingDialog = read("src/components/site/BookingDialog.tsx");
    const dentalHook = read("src/lib/api/dental-hook.ts");

    expect(bookingDialog).toContain("useCreateDentalAppointment");
    expect(dentalHook).toContain("createDentalAppointment");
    expect(dentalHook).not.toContain("/api/leads/create");
  });

  it("keeps public appointment navigation route-free and dialog-driven", () => {
    const navbar = read("src/components/site/Navbar.tsx");
    const routeTree = read("src/routeTree.gen.ts");

    expect(navbar).toContain("Solicitar Atención");
    expect(navbar).toContain("onBook");
    expect(navbar).toContain("onClick={onBook}");
    expect(navbar).not.toContain('to="/agendar"');
    expect(navbar).not.toContain("to='/agendar'");
    expect(routeTree).not.toContain("/agendar");
  });

  it("does not use browser storage for admin authentication", () => {
    const adminGuard = read("src/components/admin/AdminRouteGuard.tsx");

    expect(adminGuard).not.toContain("localStorage");
    expect(adminGuard).not.toContain("sessionStorage");

    const possibleSessionFiles = [
      "src/lib/admin-session.ts",
      "src/server/admin-session.ts",
      "src/server/auth/admin-session.ts",
      "src/lib/auth/admin-session.ts",
      "src/routes/api/admin/login.ts",
      "src/routes/api/admin/logout.ts",
      "src/routes/api/admin/session.ts",
    ];

    const existingSessionFiles = possibleSessionFiles.filter(exists);

    expect(existingSessionFiles.length).toBeGreaterThan(0);

    for (const file of existingSessionFiles) {
      const content = read(file);
      expect(content).not.toContain("localStorage");
      expect(content).not.toContain("sessionStorage");
    }
  });
});

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
  it("keeps 71.5.1 Patient Domain Foundation isolated from protected runtime boundaries", () => {
    const patientFoundationIndex = read("src/server/patients/domain/index.ts");
    const patientFoundationPort = read("src/server/patients/domain/patient-persistence-port.ts");

    expect(patientFoundationIndex).not.toContain("supabase");
    expect(patientFoundationIndex).not.toContain("RelationalPatientPersistenceAdapter");
    expect(patientFoundationIndex).not.toContain("LeadPersistencePort");
    expect(patientFoundationPort).not.toContain("supabase");
    expect(patientFoundationPort).not.toContain("RelationalPatientPersistenceAdapter");
    expect(patientFoundationPort).not.toContain("LeadPersistencePort");
  });

  it("keeps 71.5.2 Patient Application Layer isolated from infrastructure and protected boundaries", () => {
    const applicationFiles = [
      "src/server/patients/application/patient-application.types.ts",
      "src/server/patients/application/patient-application.errors.ts",
      "src/server/patients/application/patient-application-mappers.ts",
      "src/server/patients/application/patient-application-service.ts",
      "src/server/patients/application/patient-use-cases.ts",
      "src/server/patients/application/index.ts",
    ];

    for (const file of applicationFiles) {
      const content = read(file);
      expect(content).not.toContain("supabase");
      expect(content).not.toContain("RelationalPatientPersistenceAdapter");
      expect(content).not.toContain("PatientPersistenceProvider");
      expect(content).not.toContain("LeadPersistencePort");
      expect(content).not.toContain("server/leads");
      expect(content).not.toContain("routes/api");
      expect(content).not.toContain("components/");
      expect(content).not.toContain("BookingDialog");
      expect(content).not.toContain("processDentalLead");
      expect(content).not.toContain("mergePatients");
    }
  });

});

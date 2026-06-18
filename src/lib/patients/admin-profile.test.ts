import { describe, expect, it } from "vitest";
import {
  applyAdministrativeProfileUpdate,
  derivePatientAdministrativeProfiles,
} from "./admin-profile";

const baseLead = {
  id: "LD-100",
  createdAt: "2026-06-10",
  name: "Ana Torres",
  email: "ana@example.com",
  phone: "+507 6000-1111",
  treatment: "Ortodoncia",
  status: "agendada",
  source: "web",
  preferredDate: "2026-06-18",
  notes: "Prefiere contacto por WhatsApp.",
};

const administrativeMissingFields = [
  "birthDate",
  "address",
  "emergencyContact",
  "preferredContactMethod",
];

describe("patient administrative profile adapter", () => {
  it("derives administrative profiles from lead data and keeps full administrative completeness pending", () => {
    const [profile] = derivePatientAdministrativeProfiles([baseLead]);

    expect(profile.displayName).toBe("Ana Torres");
    expect(profile.phone).toBe("+507 6000-1111");
    expect(profile.email).toBe("ana@example.com");
    expect(profile.completionPercentage).toBe(50);
    expect(profile.administrativeStatus).toBe("incomplete");
    expect(profile.missingFields).toEqual(administrativeMissingFields);
  });

  it("marks missing administrative identity and contact fields without exposing clinical fields", () => {
    const [profile] = derivePatientAdministrativeProfiles([
      {
        ...baseLead,
        name: "Ana",
        email: "",
      },
    ]);

    expect(profile.missingFields).toEqual(["lastName", "email", ...administrativeMissingFields]);
    expect(profile.completionPercentage).toBe(25);
    expect(profile.administrativeStatus).toBe("incomplete");
    expect(profile).not.toHaveProperty("diagnosis");
    expect(profile).not.toHaveProperty("clinicalNotes");
  });

  it("groups multiple leads into one administrative profile only when email and phone match", () => {
    const profiles = derivePatientAdministrativeProfiles([
      baseLead,
      {
        ...baseLead,
        id: "LD-101",
        createdAt: "2026-06-12",
        treatment: "Implantes Dentales",
      },
    ]);

    expect(profiles).toHaveLength(1);
    expect(profiles[0].sourceLeadIds).toEqual(["LD-100", "LD-101"]);
    expect(profiles[0].treatmentInterest).toBe("Implantes Dentales");
  });

  it("does not merge new patients automatically when they only share email", () => {
    const profiles = derivePatientAdministrativeProfiles([
      baseLead,
      {
        ...baseLead,
        id: "LD-102",
        createdAt: "2026-06-12",
        name: "Bruno Vega",
        phone: "+507 6000-2222",
        treatment: "Implantes Dentales",
      },
    ]);

    expect(profiles).toHaveLength(2);
    expect(profiles.flatMap((profile) => profile.sourceLeadIds)).toEqual(["LD-100", "LD-102"]);
  });

  it("does not treat misplaced email-like or service values as administrative contact data", () => {
    const [profile] = derivePatientAdministrativeProfiles([
      {
        ...baseLead,
        name: "dentaloperix@gmail.com",
        email: "Blanqueamiento",
        treatment: "",
      },
    ]);

    expect(profile.displayName).toBe("Paciente sin nombre");
    expect(profile.email).toBe("Correo no registrado");
    expect(profile.missingFields).toContain("email");
    expect(profile.administrativeStatus).toBe("incomplete");
  });

  it("only becomes pending verification when all administrative profile fields are present", () => {
    const [profile] = derivePatientAdministrativeProfiles([baseLead]);
    const updated = applyAdministrativeProfileUpdate(profile, {
      birthDate: "1990-01-01",
      address: "Calle 1",
      emergencyContact: "Contacto 6000-2222",
      preferredContactMethod: "WhatsApp",
    });

    expect(updated.missingFields).toEqual([]);
    expect(updated.completionPercentage).toBe(100);
    expect(updated.administrativeStatus).toBe("pending-verification");

    const verified = applyAdministrativeProfileUpdate(updated, {
      verificationStatus: "verified",
      verifiedAt: "2026-06-16T00:00:00.000Z",
      verifiedBy: "admin",
    });

    expect(verified.administrativeStatus).toBe("verified");
  });
});

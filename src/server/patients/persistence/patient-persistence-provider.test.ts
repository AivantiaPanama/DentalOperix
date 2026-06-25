import { describe, expect, it } from "vitest";
import type { PatientPersistencePort } from "../domain/patient-persistence-port";
import {
  createPatientPersistencePort,
  createPatientPersistenceProvider,
  PatientPersistenceProvider,
  PATIENT_PERSISTENCE_PROVIDER_VERSION,
} from "./patient-persistence-provider";
import { RelationalPatientPersistenceAdapter } from "./relational-patient-persistence-adapter";

describe("71.5.3 Patient Persistence Provider", () => {
  it("declares the certified provider version", () => {
    expect(PATIENT_PERSISTENCE_PROVIDER_VERSION).toBe("71.5.3-PATIENT-PERSISTENCE-PROVIDER");
  });

  it("resolves the relational adapter through the PatientPersistencePort contract", () => {
    const provider = new PatientPersistenceProvider({
      clientFactory: async () => ({
        async query<T>() {
          return { rows: [] as T[], rowCount: null };
        },
      }),
    });

    const port: PatientPersistencePort = provider.getPatientPersistencePort();

    expect(port).toBeInstanceOf(RelationalPatientPersistenceAdapter);
    expect(typeof port.createPatient).toBe("function");
    expect(typeof port.findPatientById).toBe("function");
    expect(typeof port.updatePatient).toBe("function");
    expect(typeof port.searchPatientsByIdentity).toBe("function");
  });

  it("exposes factory helpers without binding to API or UI runtime", () => {
    const provider = createPatientPersistenceProvider();
    const port = createPatientPersistencePort();

    expect(provider).toBeInstanceOf(PatientPersistenceProvider);
    expect(port).toBeInstanceOf(RelationalPatientPersistenceAdapter);
  });
});

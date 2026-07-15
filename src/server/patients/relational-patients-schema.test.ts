import { describe, expect, it } from "vitest";
import {
  RELATIONAL_PATIENTS_SCHEMA_GOVERNANCE,
  RELATIONAL_PATIENTS_SCHEMA_VERSION,
  RELATIONAL_PATIENT_COLUMNS,
  RELATIONAL_PATIENT_STATUS_VALUES,
} from "./relational-patients-schema";

describe("Relational Patient schema metadata", () => {
  it("preserves governance boundaries", () => {
    expect(RELATIONAL_PATIENTS_SCHEMA_VERSION).toBe("61.3-01-FND-001");
    expect(RELATIONAL_PATIENTS_SCHEMA_GOVERNANCE.leadsSourceOfTruthPreserved).toBe(true);
    expect(RELATIONAL_PATIENTS_SCHEMA_GOVERNANCE.patientReplacesLead).toBe(false);
    expect(RELATIONAL_PATIENTS_SCHEMA_GOVERNANCE.automatedMergeAllowed).toBe(false);
    expect(RELATIONAL_PATIENTS_SCHEMA_GOVERNANCE.uiImplemented).toBe(false);
  });

  it("uses approved lifecycle states", () => {
    expect(RELATIONAL_PATIENT_STATUS_VALUES).toEqual([
      "active",
      "inactive",
      "lost_contact",
      "archived",
    ]);
  });

  it("documents normalized foundational tables", () => {
    expect(RELATIONAL_PATIENT_COLUMNS.map((column) => column.table)).toEqual(
      expect.arrayContaining([
        "patients",
        "patient_phones",
        "patient_emails",
        "patient_identifiers",
      ]),
    );
  });
});

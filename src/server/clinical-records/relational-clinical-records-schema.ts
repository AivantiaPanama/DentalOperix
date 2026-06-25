export const RELATIONAL_CLINICAL_RECORDS_SCHEMA_VERSION = "75.0-WP-01-CLINICAL-RECORD-FOUNDATION" as const;

export const RELATIONAL_CLINICAL_RECORDS_TABLE_NAME = "clinical_records" as const;
export const RELATIONAL_CLINICAL_RECORD_EVENTS_TABLE_NAME = "clinical_record_domain_events" as const;

export const RELATIONAL_CLINICAL_RECORD_STATUS_VALUES = ["draft", "active"] as const;

export type RelationalClinicalRecordColumn = {
  table: string;
  name: string;
  source: "clinical-record" | "patient-reference" | "technical";
  required: boolean;
  description: string;
};

export const RELATIONAL_CLINICAL_RECORD_COLUMNS: RelationalClinicalRecordColumn[] = [
  { table: "clinical_records", name: "id", source: "clinical-record", required: true, description: "Stable Clinical Record identifier." },
  { table: "clinical_records", name: "patient_id", source: "patient-reference", required: true, description: "Reference to Patients identity only; not a patient copy." },
  { table: "clinical_records", name: "status", source: "clinical-record", required: true, description: "Clinical Record lifecycle state for WP-01." },
  { table: "clinical_records", name: "created_via", source: "technical", required: true, description: "Creation source for auditability." },
  { table: "clinical_records", name: "created_at", source: "technical", required: true, description: "Creation timestamp." },
  { table: "clinical_records", name: "updated_at", source: "technical", required: true, description: "Last update timestamp." },
] as const;

export const RELATIONAL_CLINICAL_RECORDS_SCHEMA_GOVERNANCE = {
  program: "75.x Clinical Records Controlled Implementation",
  workPackage: "WP-01 Clinical Record Foundation",
  baseline: "DENTALOPERIX_BASELINE_71_5_RELEASE_CANDIDATE",
  sourceOfTruth: "Clinical Records = clinical information only",
  patientsIdentityPreserved: true,
  leadsSourceOfTruthPreserved: true,
  appointmentsSourceOfTruthPreserved: true,
  dualWriteIntroduced: false,
  persistenceReArchitectureIntroduced: false,
  protectedComponentsModified: false,
} as const;

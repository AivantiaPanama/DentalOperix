export const RELATIONAL_CLINICAL_RECORDS_SCHEMA_VERSION = "75.0-WP-02-I1-M4-CLINICAL-NOTE-PERSISTENCE" as const;

export const RELATIONAL_CLINICAL_RECORDS_TABLE_NAME = "clinical_records" as const;
export const RELATIONAL_CLINICAL_RECORD_EVENTS_TABLE_NAME = "clinical_record_domain_events" as const;
export const RELATIONAL_CLINICAL_NOTES_TABLE_NAME = "clinical_notes" as const;

export const RELATIONAL_CLINICAL_RECORD_STATUS_VALUES = ["draft", "active"] as const;
export const RELATIONAL_CLINICAL_NOTE_STATUS_VALUES = ["draft", "completed", "amended", "archived"] as const;

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


export const RELATIONAL_CLINICAL_NOTE_COLUMNS: RelationalClinicalRecordColumn[] = [
  { table: "clinical_notes", name: "id", source: "clinical-record", required: true, description: "Stable Clinical Note identifier." },
  { table: "clinical_notes", name: "clinical_record_id", source: "clinical-record", required: true, description: "Reference to the owning Clinical Record." },
  { table: "clinical_notes", name: "patient_id", source: "patient-reference", required: true, description: "Patient identity reference only; not a patient copy." },
  { table: "clinical_notes", name: "appointment_id", source: "technical", required: false, description: "Optional operational Appointment reference." },
  { table: "clinical_notes", name: "title", source: "clinical-record", required: false, description: "Optional clinical note title." },
  { table: "clinical_notes", name: "narrative", source: "clinical-record", required: true, description: "Clinical narrative authored by the healthcare professional." },
  { table: "clinical_notes", name: "status", source: "clinical-record", required: true, description: "Clinical Note lifecycle state." },
  { table: "clinical_notes", name: "created_by_healthcare_professional_id", source: "clinical-record", required: true, description: "Healthcare professional who registered the note." },
  { table: "clinical_notes", name: "created_at", source: "technical", required: true, description: "Registration timestamp." },
  { table: "clinical_notes", name: "updated_at", source: "technical", required: true, description: "Last transition or amendment timestamp." },
] as const;

export const RELATIONAL_CLINICAL_RECORDS_SCHEMA_GOVERNANCE = {
  program: "75.x Clinical Records Controlled Implementation",
  workPackage: "WP-02 Clinical Notes Foundation",
  baseline: "DENTALOPERIX_BASELINE_71_5_RELEASE_CANDIDATE",
  sourceOfTruth: "Clinical Records = clinical information only",
  patientsIdentityPreserved: true,
  leadsSourceOfTruthPreserved: true,
  appointmentsSourceOfTruthPreserved: true,
  dualWriteIntroduced: false,
  persistenceReArchitectureIntroduced: false,
  protectedComponentsModified: false,
} as const;

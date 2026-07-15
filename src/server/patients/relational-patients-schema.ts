import {
  PATIENT_CONTACT_POINT_STATUSES,
  PATIENT_CREATION_SOURCES,
  PATIENT_IDENTIFIER_TYPES,
  PATIENT_STATUSES,
} from "./patient-domain";

export const RELATIONAL_PATIENTS_SCHEMA_VERSION = "61.3-01-FND-001" as const;

export const RELATIONAL_PATIENTS_TABLE_NAME = "patients" as const;
export const RELATIONAL_PATIENT_PHONES_TABLE_NAME = "patient_phones" as const;
export const RELATIONAL_PATIENT_EMAILS_TABLE_NAME = "patient_emails" as const;
export const RELATIONAL_PATIENT_ADDRESSES_TABLE_NAME = "patient_addresses" as const;
export const RELATIONAL_PATIENT_IDENTIFIERS_TABLE_NAME = "patient_identifiers" as const;

export const RELATIONAL_PATIENT_STATUS_VALUES = PATIENT_STATUSES;
export const RELATIONAL_PATIENT_CREATION_SOURCE_VALUES = PATIENT_CREATION_SOURCES;
export const RELATIONAL_PATIENT_CONTACT_POINT_STATUS_VALUES = PATIENT_CONTACT_POINT_STATUSES;
export const RELATIONAL_PATIENT_IDENTIFIER_TYPE_VALUES = PATIENT_IDENTIFIER_TYPES;

export type RelationalPatientColumn = {
  table: string;
  name: string;
  source: "identity" | "contact-point" | "identifier" | "administrative" | "technical";
  required: boolean;
  description: string;
};

export const RELATIONAL_PATIENT_COLUMNS: RelationalPatientColumn[] = [
  {
    table: "patients",
    name: "id",
    source: "identity",
    required: true,
    description: "Stable Patient identity identifier.",
  },
  {
    table: "patients",
    name: "display_name",
    source: "identity",
    required: true,
    description: "Human-readable Patient name.",
  },
  {
    table: "patients",
    name: "normalized_name",
    source: "identity",
    required: true,
    description: "Normalized name for identity resolution.",
  },
  {
    table: "patients",
    name: "status",
    source: "identity",
    required: true,
    description: "Patient lifecycle state.",
  },
  {
    table: "patient_phones",
    name: "normalized_phone",
    source: "contact-point",
    required: true,
    description: "Normalized phone for duplicate detection.",
  },
  {
    table: "patient_emails",
    name: "normalized_email",
    source: "contact-point",
    required: true,
    description: "Normalized email for duplicate detection.",
  },
  {
    table: "patient_identifiers",
    name: "normalized_value",
    source: "identifier",
    required: true,
    description: "Normalized external/CID identifier.",
  },
  {
    table: "patients",
    name: "requires_invoice",
    source: "administrative",
    required: true,
    description: "Administrative invoice flag; not billing automation.",
  },
  {
    table: "patients",
    name: "is_retired",
    source: "administrative",
    required: true,
    description: "Administrative retired flag; not discount automation.",
  },
  {
    table: "patients",
    name: "has_insurance",
    source: "administrative",
    required: true,
    description: "Administrative insurance flag; not coverage calculation.",
  },
] as const;

export const RELATIONAL_PATIENTS_SCHEMA_GOVERNANCE = {
  program: "61.3-01 Patient Identity Foundation",
  status: "authorized-for-implementation",
  sourceOfTruth: "Patients = person identity only",
  leadsSourceOfTruthPreserved: true,
  appointmentsSourceOfTruthPreserved: true,
  patientReplacesLead: false,
  automatedMergeAllowed: false,
  uiImplemented: false,
  notes: [
    "Patient identity is permanent; attributes and contact points change.",
    "Leads remain Source of Truth for acquisition, marketing and commercial follow-up.",
    "Appointments remain Source of Truth for scheduled operational events.",
    "Insurance flags are administrative only and do not implement benefits or billing rules.",
  ],
} as const;

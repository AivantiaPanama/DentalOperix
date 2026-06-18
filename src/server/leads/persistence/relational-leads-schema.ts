import { CRM_STATUS_VALUES } from "@/server/google/types";

export const RELATIONAL_LEADS_SCHEMA_VERSION = "57.1-B" as const;

export const RELATIONAL_LEADS_TABLE_NAME = "leads" as const;
export const RELATIONAL_LEADS_MIGRATION_AUDIT_TABLE_NAME = "lead_persistence_migration_audit" as const;

export type RelationalLeadColumn = {
  name: string;
  source: "google-sheet-crm" | "technical";
  required: boolean;
  description: string;
};

export const RELATIONAL_LEAD_COLUMNS: RelationalLeadColumn[] = [
  {
    name: "id",
    source: "google-sheet-crm",
    required: true,
    description: "Stable Lead identifier. Preserves the current Google Sheet CRM ID value.",
  },
  {
    name: "created_at",
    source: "google-sheet-crm",
    required: true,
    description: "Lead creation timestamp from the current Fecha column.",
  },
  {
    name: "name",
    source: "google-sheet-crm",
    required: true,
    description: "Patient or prospect name from the current Nombre column.",
  },
  {
    name: "phone",
    source: "google-sheet-crm",
    required: true,
    description: "Phone number from the current Telefono column.",
  },
  {
    name: "email",
    source: "google-sheet-crm",
    required: true,
    description: "Email address from the current Email column.",
  },
  {
    name: "treatment",
    source: "google-sheet-crm",
    required: true,
    description: "Requested treatment or service from the current Tratamiento column.",
  },
  {
    name: "message",
    source: "google-sheet-crm",
    required: false,
    description: "Lead message or notes from the current Mensaje column.",
  },
  {
    name: "urgency",
    source: "google-sheet-crm",
    required: false,
    description: "Lead urgency from the current Urgencia column.",
  },
  {
    name: "preferred_date",
    source: "google-sheet-crm",
    required: false,
    description: "Preferred appointment date/time from the current Fecha Preferida column.",
  },
  {
    name: "status",
    source: "google-sheet-crm",
    required: true,
    description: "CRM status. Uses the existing CRM status vocabulary.",
  },
  {
    name: "source",
    source: "google-sheet-crm",
    required: false,
    description: "Lead acquisition source from the current Fuente column.",
  },
  {
    name: "ai_summary",
    source: "google-sheet-crm",
    required: false,
    description: "AI summary from the current Resumen IA column.",
  },
  {
    name: "calendar_event_id",
    source: "google-sheet-crm",
    required: false,
    description: "Calendar event ID from the current Evento Calendar ID column.",
  },
  {
    name: "email_sent",
    source: "google-sheet-crm",
    required: true,
    description: "Confirmation email state from the current Email Enviado column.",
  },
  {
    name: "physical_source",
    source: "technical",
    required: true,
    description: "Migration lineage. Initial backfill value should be google-sheet.",
  },
  {
    name: "source_record_hash",
    source: "technical",
    required: false,
    description: "Optional hash for migration reconciliation and duplicate detection.",
  },
  {
    name: "schema_version",
    source: "technical",
    required: true,
    description: "Relational schema version used for the stored record.",
  },
  {
    name: "inserted_at",
    source: "technical",
    required: true,
    description: "Database insertion timestamp.",
  },
  {
    name: "updated_at",
    source: "technical",
    required: true,
    description: "Database update timestamp.",
  },
] as const;

export const RELATIONAL_LEAD_STATUS_VALUES = CRM_STATUS_VALUES;

export const RELATIONAL_LEADS_SCHEMA_GOVERNANCE = {
  program: "57.1-B Relational Leads Schema Design",
  status: "completed-accepted-not-active",
  sourceOfTruth: "Leads",
  currentPhysicalPersistence: "Google Sheet",
  futurePhysicalPersistence: "Relational Database",
  runtimeActivation: false,
  dualWriteAllowed: false,
  operationalFlowChanged: false,
  notes: [
    "This schema metadata is a completed and accepted non-active design artifact.",
    "Google Sheet remains the active physical persistence until explicit cutover approval.",
    "The relational database must replace the physical persistence layer without creating a new Source of Truth.",
  ],
} as const;

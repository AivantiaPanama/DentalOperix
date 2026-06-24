/**
 * 71.5.1 Patient Domain Foundation enums.
 * Governance boundary: pure Patient domain only; no API, UI, adapter, Supabase, Lead replacement, or automated merge behavior.
 */
export const PATIENT_DOMAIN_FOUNDATION_VERSION = "71.5.1-PATIENT-DOMAIN-FOUNDATION" as const;

export const PATIENT_STATUSES = ["active", "inactive", "lost_contact", "archived"] as const;
export type PatientStatus = (typeof PATIENT_STATUSES)[number];

export const PATIENT_CREATION_SOURCES = [
  "web",
  "chat",
  "whatsapp",
  "phone",
  "walk_in",
  "lead",
  "appointment",
  "assistant",
  "admin",
  "doctor",
] as const;
export type PatientCreationSource = (typeof PATIENT_CREATION_SOURCES)[number];

export const PATIENT_ACTOR_ROLES = ["administrator", "doctor", "assistant", "system"] as const;
export type PatientActorRole = (typeof PATIENT_ACTOR_ROLES)[number];

export const PATIENT_CONTACT_POINT_STATUSES = ["active", "inactive"] as const;
export type PatientContactPointStatus = (typeof PATIENT_CONTACT_POINT_STATUSES)[number];

export const PATIENT_IDENTIFIER_TYPES = ["cid", "tax_id", "external", "other"] as const;
export type PatientIdentifierType = (typeof PATIENT_IDENTIFIER_TYPES)[number];

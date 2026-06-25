import type {
  Patient,
  PatientAddress,
  PatientEmail,
  PatientIdentifier,
  PatientPhone,
} from "../domain/patient.types";

export type RelationalPatientRow = {
  id: string;
  display_name: string;
  first_name: string | null;
  last_name: string | null;
  second_last_name: string | null;
  normalized_name: string;
  status: Patient["status"];
  source: Patient["source"];
  linked_lead_id: string | null;
  linked_appointment_id: string | null;
  requires_invoice: boolean;
  is_retired: boolean;
  has_insurance: boolean;
  created_by_user_id: string | null;
  created_by_role: Patient["createdByRole"] | null;
  created_via: Patient["createdVia"];
  updated_by_user_id: string | null;
  updated_by_role: Patient["updatedByRole"] | null;
  updated_via: Patient["updatedVia"] | null;
  created_at: string | Date;
  updated_at: string | Date;
};

export type RelationalPatientPhoneRow = {
  id: string;
  patient_id: string;
  phone: string;
  normalized_phone: string;
  label: string | null;
  is_primary: boolean;
  status: PatientPhone["status"];
  created_at: string | Date;
  updated_at: string | Date;
};

export type RelationalPatientEmailRow = {
  id: string;
  patient_id: string;
  email: string;
  normalized_email: string;
  label: string | null;
  is_primary: boolean;
  status: PatientEmail["status"];
  created_at: string | Date;
  updated_at: string | Date;
};

export type RelationalPatientAddressRow = {
  id: string;
  patient_id: string;
  line1: string;
  line2: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  country: string | null;
  label: string | null;
  is_primary: boolean;
  status: PatientAddress["status"];
  created_at: string | Date;
  updated_at: string | Date;
};

export type RelationalPatientIdentifierRow = {
  id: string;
  patient_id: string;
  type: PatientIdentifier["type"];
  value: string;
  normalized_value: string;
  issuing_authority: string | null;
  is_primary: boolean;
  status: PatientIdentifier["status"];
  created_at: string | Date;
  updated_at: string | Date;
};

export type RelationalPatientGraphRows = {
  patient: RelationalPatientRow;
  phones: RelationalPatientPhoneRow[];
  emails: RelationalPatientEmailRow[];
  addresses: RelationalPatientAddressRow[];
  identifiers: RelationalPatientIdentifierRow[];
};

export const RELATIONAL_PATIENT_PERSISTENCE_MAPPER_VERSION = "71.5.3-PATIENT-PERSISTENCE-MAPPERS" as const;

function toIsoString(value: string | Date): string {
  return value instanceof Date ? value.toISOString() : value.toString();
}

function optional<T>(value: T | null | undefined): T | undefined {
  return value ?? undefined;
}

export function mapRelationalPatientGraphToDomain(graph: RelationalPatientGraphRows): Patient {
  const row = graph.patient;
  return {
    id: row.id,
    displayName: row.display_name,
    firstName: optional(row.first_name),
    lastName: optional(row.last_name),
    secondLastName: optional(row.second_last_name),
    normalizedName: row.normalized_name,
    status: row.status,
    source: row.source,
    linkedLeadId: optional(row.linked_lead_id),
    linkedAppointmentId: optional(row.linked_appointment_id),
    requiresInvoice: row.requires_invoice,
    isRetired: row.is_retired,
    hasInsurance: row.has_insurance,
    createdByUserId: optional(row.created_by_user_id),
    createdByRole: optional(row.created_by_role),
    createdVia: row.created_via,
    updatedByUserId: optional(row.updated_by_user_id),
    updatedByRole: optional(row.updated_by_role),
    updatedVia: optional(row.updated_via),
    createdAt: toIsoString(row.created_at),
    updatedAt: toIsoString(row.updated_at),
    phones: graph.phones.map((phone) => ({
      id: phone.id,
      patientId: phone.patient_id,
      phone: phone.phone,
      normalizedPhone: phone.normalized_phone,
      label: optional(phone.label),
      isPrimary: phone.is_primary,
      status: phone.status,
      createdAt: toIsoString(phone.created_at),
      updatedAt: toIsoString(phone.updated_at),
    })),
    emails: graph.emails.map((email) => ({
      id: email.id,
      patientId: email.patient_id,
      email: email.email,
      normalizedEmail: email.normalized_email,
      label: optional(email.label),
      isPrimary: email.is_primary,
      status: email.status,
      createdAt: toIsoString(email.created_at),
      updatedAt: toIsoString(email.updated_at),
    })),
    addresses: graph.addresses.map((address) => ({
      id: address.id,
      patientId: address.patient_id,
      line1: address.line1,
      line2: optional(address.line2),
      city: optional(address.city),
      state: optional(address.state),
      postalCode: optional(address.postal_code),
      country: optional(address.country),
      label: optional(address.label),
      isPrimary: address.is_primary,
      status: address.status,
      createdAt: toIsoString(address.created_at),
      updatedAt: toIsoString(address.updated_at),
    })),
    identifiers: graph.identifiers.map((identifier) => ({
      id: identifier.id,
      patientId: identifier.patient_id,
      type: identifier.type,
      value: identifier.value,
      normalizedValue: identifier.normalized_value,
      issuingAuthority: optional(identifier.issuing_authority),
      isPrimary: identifier.is_primary,
      status: identifier.status,
      createdAt: toIsoString(identifier.created_at),
      updatedAt: toIsoString(identifier.updated_at),
    })),
  };
}

export function mapPatientToRelationalPatientValues(patient: Patient): unknown[] {
  return [
    patient.id,
    patient.displayName,
    patient.firstName ?? null,
    patient.lastName ?? null,
    patient.secondLastName ?? null,
    patient.normalizedName,
    patient.status,
    patient.source,
    patient.linkedLeadId ?? null,
    patient.linkedAppointmentId ?? null,
    patient.requiresInvoice,
    patient.isRetired,
    patient.hasInsurance,
    patient.createdByUserId ?? null,
    patient.createdByRole ?? null,
    patient.createdVia,
    patient.updatedByUserId ?? null,
    patient.updatedByRole ?? null,
    patient.updatedVia ?? null,
    patient.createdAt,
    patient.updatedAt,
  ];
}

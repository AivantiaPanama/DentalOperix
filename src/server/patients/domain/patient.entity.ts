import type { CreatePatientInput, Patient, PatientId, UpdatePatientInput } from "./patient.types";
import { buildDisplayName, normalizeEmail, normalizeIdentifier, normalizeName, normalizePhone, normalizePrimaryFlags } from "./patient.value-objects";
import { validateCreatePatientInput, validateUpdatePatientInput } from "./patient.validation";

export function createPatientEntity(input: CreatePatientInput, options: { id?: PatientId; now?: string } = {}): Patient {
  const validated = validateCreatePatientInput(input);
  const now = options.now ?? new Date().toISOString();
  const id = validated.id ?? options.id ?? `patient_${Date.now()}`;
  const displayName = buildDisplayName(validated);
  const actor = validated.actor;

  const phones = normalizePrimaryFlags(
    validated.phones.map((phone, index) => ({
      id: phone.id ?? `${id}_phone_${index + 1}`,
      patientId: id,
      phone: phone.phone,
      normalizedPhone: normalizePhone(phone.phone),
      label: phone.label,
      isPrimary: phone.isPrimary,
      status: phone.status,
      createdAt: now,
      updatedAt: now,
    })),
  );

  const emails = normalizePrimaryFlags(
    validated.emails.map((email, index) => ({
      id: email.id ?? `${id}_email_${index + 1}`,
      patientId: id,
      email: email.email,
      normalizedEmail: normalizeEmail(email.email),
      label: email.label,
      isPrimary: email.isPrimary,
      status: email.status,
      createdAt: now,
      updatedAt: now,
    })),
  );

  const addresses = normalizePrimaryFlags(
    validated.addresses.map((address, index) => ({
      id: address.id ?? `${id}_address_${index + 1}`,
      patientId: id,
      line1: address.line1,
      line2: address.line2,
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country,
      label: address.label,
      isPrimary: address.isPrimary,
      status: address.status,
      createdAt: now,
      updatedAt: now,
    })),
  );

  const identifiers = normalizePrimaryFlags(
    validated.identifiers.map((identifier, index) => ({
      id: identifier.id ?? `${id}_identifier_${index + 1}`,
      patientId: id,
      type: identifier.type,
      value: identifier.value,
      normalizedValue: normalizeIdentifier(identifier.value),
      issuingAuthority: identifier.issuingAuthority,
      isPrimary: identifier.isPrimary,
      status: identifier.status,
      createdAt: now,
      updatedAt: now,
    })),
  );

  return {
    id,
    displayName,
    firstName: validated.firstName,
    lastName: validated.lastName,
    secondLastName: validated.secondLastName,
    normalizedName: normalizeName(displayName),
    status: validated.status,
    source: validated.source,
    linkedLeadId: validated.linkedLeadId,
    linkedAppointmentId: validated.linkedAppointmentId,
    requiresInvoice: validated.requiresInvoice,
    isRetired: validated.isRetired,
    hasInsurance: validated.hasInsurance,
    createdByUserId: actor?.userId,
    createdByRole: actor?.role,
    createdVia: actor?.via ?? validated.source,
    createdAt: now,
    updatedAt: now,
    phones,
    emails,
    addresses,
    identifiers,
  };
}

export function applyPatientUpdate(patient: Patient, input: UpdatePatientInput, now = new Date().toISOString()): Patient {
  const validated = validateUpdatePatientInput(input);
  const actor = validated.actor;
  const nextDisplayName = validated.displayName ?? patient.displayName;

  return {
    ...patient,
    ...validated,
    displayName: nextDisplayName,
    normalizedName: normalizeName(nextDisplayName),
    updatedByUserId: actor?.userId ?? patient.updatedByUserId,
    updatedByRole: actor?.role ?? patient.updatedByRole,
    updatedVia: actor?.via ?? patient.updatedVia,
    updatedAt: now,
  };
}

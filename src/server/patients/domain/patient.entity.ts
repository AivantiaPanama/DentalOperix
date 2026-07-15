import type {
  ArchivePatientInput,
  CreatePatientAggregateOptions,
  CreatePatientInput,
  Patient,
  PatientAggregateRoot,
  PatientId,
  UpdatePatientAggregateOptions,
  UpdatePatientInput,
} from "./patient.types";
import {
  createPatientEmailValue,
  createPatientIdentifierValue,
  createPatientNameValue,
  createPatientPhoneValue,
  normalizePrimaryFlags,
} from "./patient.value-objects";
import { validateCreatePatientInput, validateUpdatePatientInput } from "./patient.validation";

function resolveOperationTimestamp(now?: string): string {
  return now ?? new Date().toISOString();
}

function resolvePatientId(
  inputId: PatientId | undefined,
  optionId: PatientId | undefined,
): PatientId {
  return inputId ?? optionId ?? `patient_${Date.now()}`;
}

/**
 * 73.1-B Aggregate Factory.
 *
 * Creates the existing Patient aggregate root without introducing a parallel
 * Patients domain. This function remains the backward-compatible factory used
 * by application and persistence layers.
 */
export function createPatientEntity(
  input: CreatePatientInput,
  options: CreatePatientAggregateOptions = {},
): PatientAggregateRoot {
  const validated = validateCreatePatientInput(input);
  const now = resolveOperationTimestamp(options.now);
  const id = resolvePatientId(validated.id, options.id);
  const patientName = createPatientNameValue(validated);
  const actor = validated.actor;

  const phones = normalizePrimaryFlags(
    validated.phones.map((phone, index) => ({
      id: phone.id ?? `${id}_phone_${index + 1}`,
      patientId: id,
      phone: phone.phone,
      normalizedPhone: createPatientPhoneValue(phone.phone).normalizedPhone,
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
      normalizedEmail: createPatientEmailValue(email.email).normalizedEmail,
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
      normalizedValue: createPatientIdentifierValue(identifier.value).normalizedValue,
      issuingAuthority: identifier.issuingAuthority,
      isPrimary: identifier.isPrimary,
      status: identifier.status,
      createdAt: now,
      updatedAt: now,
    })),
  );

  return {
    id,
    displayName: patientName.displayName,
    firstName: validated.firstName,
    lastName: validated.lastName,
    secondLastName: validated.secondLastName,
    normalizedName: patientName.normalizedName,
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

/**
 * Semantic alias for the official aggregate factory. Kept separate from the
 * legacy name so new domain code can express aggregate intent while existing
 * callers remain unchanged.
 */
export const createPatientAggregate = createPatientEntity;

/**
 * 73.1-B Aggregate Update Operation.
 *
 * Applies state changes inside the Patient aggregate boundary. Boundary input
 * validation and domain invariant collection are delegated to patient.validation
 * so the aggregate operation only performs domain state transition assembly.
 */
export function applyPatientAggregateUpdate(
  patient: PatientAggregateRoot,
  input: UpdatePatientInput,
  options: UpdatePatientAggregateOptions = {},
): PatientAggregateRoot {
  const validated = validateUpdatePatientInput(input);
  const actor = validated.actor ?? options.actor;
  const now = resolveOperationTimestamp(options.now);
  const patientUpdates = Object.fromEntries(
    Object.entries(validated).filter(([key, value]) => key !== "actor" && value !== undefined),
  ) as Omit<UpdatePatientInput, "actor">;
  const nextPatientName = createPatientNameValue({
    displayName: patientUpdates.displayName ?? patient.displayName,
  });

  return {
    ...patient,
    ...patientUpdates,
    displayName: nextPatientName.displayName,
    normalizedName: nextPatientName.normalizedName,
    updatedByUserId: actor?.userId ?? patient.updatedByUserId,
    updatedByRole: actor?.role ?? patient.updatedByRole,
    updatedVia: actor?.via ?? patient.updatedVia,
    updatedAt: now,
  };
}

export function applyPatientUpdate(
  patient: Patient,
  input: UpdatePatientInput,
  now = new Date().toISOString(),
): Patient {
  return applyPatientAggregateUpdate(patient, input, { now });
}

/**
 * 73.1-B Aggregate Archive Operation.
 *
 * Archives the existing Patient aggregate by using the certified status model.
 * This does not introduce domain events, persistence writes, repository changes,
 * API changes, or UI behavior.
 */
export function archivePatientAggregate(
  patient: PatientAggregateRoot,
  input: ArchivePatientInput = {},
  options: UpdatePatientAggregateOptions = {},
): PatientAggregateRoot {
  return applyPatientAggregateUpdate(
    patient,
    {
      status: "archived",
      actor: input.actor ?? options.actor,
    },
    options,
  );
}

export const archivePatientEntity = archivePatientAggregate;

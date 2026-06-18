import type { PatientContactReadModel } from "@/server/read-models/worksheet-read-models";

export type PatientResolvedContact = {
  patientId: string;
  email: string;
  phone: string;
  sourceContactIds: string[];
  hasExplicitEmail: boolean;
  hasExplicitPhone: boolean;
};

function normalizeContactValue(value: string | undefined | null) {
  return (value ?? "").trim();
}

function contactTypeMatches(value: string | undefined | null, type: "email" | "phone") {
  return normalizeContactValue(value).toLowerCase() === type;
}

function sortContactsByPriority(left: PatientContactReadModel, right: PatientContactReadModel) {
  if (left.isPrimary !== right.isPrimary) return left.isPrimary ? -1 : 1;

  const leftTime = Date.parse(left.updatedAt || left.createdAt || "");
  const rightTime = Date.parse(right.updatedAt || right.createdAt || "");
  return (Number.isNaN(rightTime) ? 0 : rightTime) - (Number.isNaN(leftTime) ? 0 : leftTime);
}

function findContact(
  contacts: PatientContactReadModel[],
  patientId: string,
  type: "email" | "phone",
) {
  return [...contacts]
    .filter(
      (contact) =>
        contact.patientId === patientId &&
        contactTypeMatches(contact.contactType, type) &&
        normalizeContactValue(contact.contactValue),
    )
    .sort(sortContactsByPriority)[0];
}

export function resolvePatientContacts(
  patientId: string,
  contacts: PatientContactReadModel[],
): PatientResolvedContact {
  const emailContact = findContact(contacts, patientId, "email");
  const phoneContact = findContact(contacts, patientId, "phone");
  const sourceContactIds = [emailContact?.contactId, phoneContact?.contactId]
    .map(normalizeContactValue)
    .filter(Boolean);

  return {
    patientId,
    email: normalizeContactValue(emailContact?.contactValue),
    phone: normalizeContactValue(phoneContact?.contactValue),
    sourceContactIds,
    hasExplicitEmail: Boolean(emailContact),
    hasExplicitPhone: Boolean(phoneContact),
  };
}

import type {
  CrmFolioReadModel,
  PatientAdministrativeProfileReadModel,
  PatientContactReadModel,
  PatientReadModel,
  TreatmentInterestReadModel,
  WorksheetReadModels,
} from "./worksheet-read-models";
import type {
  PatientAdministrativeField,
  PatientAdministrativeProfile,
  PatientAdministrativeStatus,
} from "@/lib/patients/admin-profile";

function normalizeValue(value: string | undefined | null) {
  return (value ?? "").trim();
}

function normalizePhoneDigits(value: string | undefined | null) {
  return normalizeValue(value).replace(/\D+/g, "");
}

function isValidAdministrativeEmail(value: string | undefined | null) {
  const normalized = normalizeValue(value);
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized);
}

function isValidAdministrativePhone(value: string | undefined | null) {
  return normalizePhoneDigits(value).length >= 7;
}

function getMissingFields(values: {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  birthDate: string;
  address: string;
  emergencyContact: string;
  preferredContactMethod: string;
}): PatientAdministrativeField[] {
  const missing: PatientAdministrativeField[] = [];
  if (!values.firstName) missing.push("name");
  if (!values.lastName) missing.push("lastName");
  if (!isValidAdministrativePhone(values.phone)) missing.push("phone");
  if (!isValidAdministrativeEmail(values.email)) missing.push("email");
  if (!values.birthDate) missing.push("birthDate");
  if (!values.address) missing.push("address");
  if (!values.emergencyContact) missing.push("emergencyContact");
  if (!values.preferredContactMethod) missing.push("preferredContactMethod");
  return missing;
}

function getCompletionPercentage(missingFields: PatientAdministrativeField[]) {
  return Math.round(((8 - missingFields.length) / 8) * 100);
}

function normalizeAdministrativeStatus(
  value: string | undefined,
  missingFields: PatientAdministrativeField[],
): PatientAdministrativeStatus {
  const normalized = normalizeValue(value).toLowerCase();
  if (missingFields.length > 0) return "incomplete";
  if (normalized === "verified" || normalized === "verificado") return "verified";
  return "pending-verification";
}

function findPrimaryContact(
  contacts: PatientContactReadModel[],
  patientId: string,
  type: "email" | "phone",
) {
  const matching = contacts.filter(
    (contact) =>
      contact.patientId === patientId && contact.contactType.trim().toLowerCase() === type,
  );
  return (
    matching.find((contact) => contact.isPrimary)?.contactValue ?? matching[0]?.contactValue ?? ""
  );
}

function findProfile(profiles: PatientAdministrativeProfileReadModel[], patientId: string) {
  return profiles.find((profile) => profile.patientId === patientId);
}

function findLatestTreatment(treatmentInterests: TreatmentInterestReadModel[], patientId: string) {
  const interests = treatmentInterests.filter((interest) => interest.patientId === patientId);
  return [...interests].sort((a, b) => {
    const aTime = Date.parse(a.updatedAt || a.createdAt || "");
    const bTime = Date.parse(b.updatedAt || b.createdAt || "");
    return (Number.isNaN(bTime) ? 0 : bTime) - (Number.isNaN(aTime) ? 0 : aTime);
  })[0];
}

function sourceLeadIdsForPatient(crmFolios: CrmFolioReadModel[], patientId: string) {
  const ids = crmFolios
    .filter((folio) => folio.patientId === patientId)
    .map((folio) => normalizeValue(folio.leadId) || normalizeValue(folio.folio))
    .filter(Boolean);
  return ids.length ? ids : [patientId];
}

function getEmergencyContact(profile: PatientAdministrativeProfileReadModel | undefined) {
  const name = normalizeValue(profile?.emergencyContactName);
  const phone = normalizeValue(profile?.emergencyContactPhone);
  return [name, phone].filter(Boolean).join(" · ");
}

function mapReadModelPatient(
  patient: PatientReadModel,
  models: WorksheetReadModels,
): PatientAdministrativeProfile {
  const profile = findProfile(models.administrativeProfiles, patient.patientId);
  const treatment = findLatestTreatment(models.treatmentInterests, patient.patientId);
  const phone = findPrimaryContact(models.contacts, patient.patientId, "phone");
  const email = findPrimaryContact(models.contacts, patient.patientId, "email");
  const birthDate = normalizeValue(patient.dateOfBirth);
  const address = normalizeValue(profile?.address);
  const emergencyContact = getEmergencyContact(profile);
  const preferredContactMethod = normalizeValue(profile?.preferredContactMethod);
  const missingFields = getMissingFields({
    firstName: normalizeValue(patient.firstName),
    lastName: normalizeValue(patient.lastName),
    phone,
    email,
    birthDate,
    address,
    emergencyContact,
    preferredContactMethod,
  });
  const administrativeStatus = normalizeAdministrativeStatus(
    profile?.verificationStatus || patient.administrativeStatus,
    missingFields,
  );

  return {
    id: patient.patientId,
    displayName: normalizeValue(patient.displayName) || "Paciente sin nombre",
    firstName: normalizeValue(patient.firstName),
    lastName: normalizeValue(patient.lastName),
    phone: normalizeValue(phone) || "Teléfono no registrado",
    email: normalizeValue(email) || "Correo no registrado",
    birthDate,
    address,
    emergencyContact,
    preferredContactMethod,
    treatmentInterest: normalizeValue(treatment?.serviceName) || "Servicio por definir",
    preferredDate: "",
    latestStatus: normalizeValue(treatment?.status) || "nuevo",
    source: normalizeValue(patient.source) || "read-model",
    createdAt: normalizeValue(patient.createdAt),
    notes:
      normalizeValue(profile?.notes) ||
      normalizeValue(patient.notes) ||
      "Perfil administrativo construido desde read model.",
    sourceLeadIds: sourceLeadIdsForPatient(models.crmFolios, patient.patientId),
    missingFields,
    completionPercentage: getCompletionPercentage(missingFields),
    administrativeStatus,
    verifiedAt:
      administrativeStatus === "verified" ? normalizeValue(profile?.verifiedAt) : undefined,
    verifiedBy:
      administrativeStatus === "verified" ? normalizeValue(profile?.verifiedBy) : undefined,
    updatedAt: normalizeValue(profile?.updatedAt) || normalizeValue(patient.updatedAt) || undefined,
  };
}

export function buildPatientAdministrativeProfilesFromReadModels(
  models: WorksheetReadModels,
): PatientAdministrativeProfile[] {
  return models.patients
    .map((patient) => mapReadModelPatient(patient, models))
    .sort((a, b) => a.displayName.localeCompare(b.displayName, "es"));
}

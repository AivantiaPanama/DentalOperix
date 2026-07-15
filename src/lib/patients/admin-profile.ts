export const PATIENT_ADMINISTRATIVE_FIELDS = [
  "name",
  "lastName",
  "phone",
  "email",
  "birthDate",
  "address",
  "emergencyContact",
  "preferredContactMethod",
] as const;

export const PATIENT_ADMINISTRATIVE_UPDATE_FIELDS = [
  "displayName",
  "firstName",
  "lastName",
  "phone",
  "email",
  "birthDate",
  "address",
  "emergencyContact",
  "preferredContactMethod",
] as const;

export const CLINICAL_PROFILE_FIELDS = [
  "diagnosis",
  "diagnóstico",
  "treatments",
  "tratamientos",
  "clinicalNotes",
  "notasClinicas",
  "notasClinicas",
  "notas clínicas",
  "odontogram",
  "odontograma",
  "radiographs",
  "radiografias",
  "radiografías",
  "medicalDocuments",
  "documentosMedicos",
  "documentos médicos",
  "treatmentPlan",
  "planTratamiento",
] as const;

export type PatientAdministrativeField = (typeof PATIENT_ADMINISTRATIVE_FIELDS)[number];
export type PatientAdministrativeUpdateField =
  (typeof PATIENT_ADMINISTRATIVE_UPDATE_FIELDS)[number];

export type PatientAdministrativeStatus = "incomplete" | "pending-verification" | "verified";

export type PatientLeadLike = {
  id?: string;
  createdAt?: string;
  name?: string;
  email?: string;
  phone?: string;
  treatment?: string;
  status?: string;
  source?: string;
  preferredDate?: string;
  notes?: string;
  message?: string;
  aiSummary?: string;
};

export type PatientAdministrativeProfileUpdate = Partial<
  Record<PatientAdministrativeUpdateField, string>
>;

export type PatientAdministrativeVerification = {
  verificationStatus?: PatientAdministrativeStatus;
  verifiedAt?: string;
  verifiedBy?: string;
};

export type PatientAdministrativeProfile = {
  id: string;
  displayName: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  birthDate: string;
  address: string;
  emergencyContact: string;
  preferredContactMethod: string;
  treatmentInterest: string;
  preferredDate: string;
  latestStatus: string;
  source: string;
  createdAt: string;
  notes: string;
  sourceLeadIds: string[];
  missingFields: PatientAdministrativeField[];
  completionPercentage: number;
  administrativeStatus: PatientAdministrativeStatus;
  verifiedAt?: string;
  verifiedBy?: string;
  updatedAt?: string;
  updatedBy?: string;
};

function normalizeValue(value: string | undefined | null): string {
  return (value ?? "").trim();
}

function normalizeKey(value: string): string {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

function normalizePhoneDigits(value: string | undefined | null): string {
  return normalizeValue(value).replace(/\D+/g, "");
}

function isValidAdministrativeEmail(value: string | undefined | null): boolean {
  const normalized = normalizeValue(value);
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized);
}

function isValidAdministrativePhone(value: string | undefined | null): boolean {
  return normalizePhoneDigits(value).length >= 7;
}

function isUsableAdministrativeName(value: string | undefined | null): boolean {
  const normalized = normalizeValue(value);
  if (!normalized) return false;
  if (normalized.includes("@")) return false;
  if (/^\d+$/.test(normalized.replace(/\D+/g, ""))) return false;
  return true;
}

function sanitizeAdministrativeEmail(value: string | undefined | null): string {
  const normalized = normalizeValue(value);
  return isValidAdministrativeEmail(normalized) ? normalized : "";
}

function sanitizeAdministrativePhone(value: string | undefined | null): string {
  const normalized = normalizeValue(value);
  return isValidAdministrativePhone(normalized) ? normalized : "";
}

function sanitizeAdministrativeName(value: string | undefined | null): string {
  const normalized = normalizeValue(value);
  return isUsableAdministrativeName(normalized) ? normalized : "";
}

function splitDisplayName(displayName: string): { firstName: string; lastName: string } {
  const normalized = normalizeValue(displayName);
  if (!normalized) return { firstName: "", lastName: "" };

  const parts = normalized.split(/\s+/);
  if (parts.length === 1) return { firstName: parts[0], lastName: "" };

  return {
    firstName: parts.slice(0, -1).join(" "),
    lastName: parts.at(-1) ?? "",
  };
}

function createPatientKey(lead: PatientLeadLike): string {
  const email = sanitizeAdministrativeEmail(lead.email);
  const phone = sanitizeAdministrativePhone(lead.phone);
  const phoneKey = normalizePhoneDigits(phone) || normalizeKey(phone);

  if (email && phoneKey) return `contact:${normalizeKey(email)}:${phoneKey}`;
  if (phoneKey) return `phone:${phoneKey}`;

  const name = sanitizeAdministrativeName(lead.name);
  if (email) {
    const fallback =
      normalizeValue(lead.id) ||
      normalizeValue(lead.createdAt) ||
      normalizeKey(name) ||
      "sin-identificador";
    return `email-review:${normalizeKey(email)}:${fallback}`;
  }
  if (name) return `name:${normalizeKey(name)}`;

  return `lead:${normalizeValue(lead.id) || "sin-identificador"}`;
}

function getMissingFieldsFromAdministrativeValues(values: {
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  birthDate?: string;
  address?: string;
  emergencyContact?: string;
  preferredContactMethod?: string;
}): PatientAdministrativeField[] {
  const fieldMap: Record<PatientAdministrativeField, string | undefined> = {
    name: sanitizeAdministrativeName(values.firstName),
    lastName: sanitizeAdministrativeName(values.lastName),
    phone: sanitizeAdministrativePhone(values.phone),
    email: sanitizeAdministrativeEmail(values.email),
    birthDate: normalizeValue(values.birthDate),
    address: normalizeValue(values.address),
    emergencyContact: normalizeValue(values.emergencyContact),
    preferredContactMethod: normalizeValue(values.preferredContactMethod),
  };

  return PATIENT_ADMINISTRATIVE_FIELDS.filter((field) => !normalizeValue(fieldMap[field]));
}

function getCompletionPercentage(missingFields: PatientAdministrativeField[]): number {
  const completed = PATIENT_ADMINISTRATIVE_FIELDS.length - missingFields.length;
  return Math.round((completed / PATIENT_ADMINISTRATIVE_FIELDS.length) * 100);
}

function getAdministrativeStatus(
  missingFields: PatientAdministrativeField[],
): PatientAdministrativeStatus {
  return missingFields.length > 0 ? "incomplete" : "pending-verification";
}

function pickLatestLead(leads: PatientLeadLike[]): PatientLeadLike {
  return [...leads].sort((a, b) => {
    const aTime = Date.parse(a.createdAt ?? a.preferredDate ?? "");
    const bTime = Date.parse(b.createdAt ?? b.preferredDate ?? "");
    return (Number.isNaN(bTime) ? 0 : bTime) - (Number.isNaN(aTime) ? 0 : aTime);
  })[0];
}

export function applyAdministrativeProfileUpdate(
  profile: PatientAdministrativeProfile,
  update: PatientAdministrativeProfileUpdate &
    PatientAdministrativeVerification & {
      updatedAt?: string;
      updatedBy?: string;
    },
): PatientAdministrativeProfile {
  const nextDisplayName = normalizeValue(update.displayName) || profile.displayName;
  const splitName = splitDisplayName(nextDisplayName);
  const firstName = normalizeValue(update.firstName) || profile.firstName || splitName.firstName;
  const lastName = normalizeValue(update.lastName) || profile.lastName || splitName.lastName;
  const displayName =
    normalizeValue(update.displayName) ||
    normalizeValue(`${firstName} ${lastName}`) ||
    profile.displayName;

  const phone = normalizeValue(update.phone) || profile.phone;
  const email = normalizeValue(update.email) || profile.email;
  const birthDate = normalizeValue(update.birthDate) || profile.birthDate;
  const address = normalizeValue(update.address) || profile.address;
  const emergencyContact = normalizeValue(update.emergencyContact) || profile.emergencyContact;
  const preferredContactMethod =
    normalizeValue(update.preferredContactMethod) || profile.preferredContactMethod;
  const missingFields = getMissingFieldsFromAdministrativeValues({
    firstName,
    lastName,
    phone,
    email,
    birthDate,
    address,
    emergencyContact,
    preferredContactMethod,
  });
  const nextStatus =
    missingFields.length > 0
      ? "incomplete"
      : (update.verificationStatus ??
        (profile.administrativeStatus === "verified" ? "verified" : "pending-verification"));

  return {
    ...profile,
    displayName,
    firstName,
    lastName,
    phone,
    email,
    birthDate,
    address,
    emergencyContact,
    preferredContactMethod,
    missingFields,
    completionPercentage: getCompletionPercentage(missingFields),
    administrativeStatus: nextStatus,
    verifiedAt: nextStatus === "verified" ? (update.verifiedAt ?? profile.verifiedAt) : undefined,
    verifiedBy: nextStatus === "verified" ? (update.verifiedBy ?? profile.verifiedBy) : undefined,
    updatedAt: update.updatedAt ?? profile.updatedAt,
    updatedBy: update.updatedBy ?? profile.updatedBy,
  };
}

export function derivePatientAdministrativeProfiles(
  leads: PatientLeadLike[],
): PatientAdministrativeProfile[] {
  const grouped = new Map<string, PatientLeadLike[]>();

  for (const lead of leads) {
    const key = createPatientKey(lead);
    grouped.set(key, [...(grouped.get(key) ?? []), lead]);
  }

  return [...grouped.entries()]
    .map(([key, patientLeads]) => {
      const latestLead = pickLatestLead(patientLeads);
      const notes =
        normalizeValue(latestLead.notes) ||
        normalizeValue(latestLead.message) ||
        normalizeValue(latestLead.aiSummary) ||
        "Perfil administrativo pendiente de validación amable.";
      const displayName = sanitizeAdministrativeName(latestLead.name) || "Paciente sin nombre";
      const { firstName, lastName } = splitDisplayName(displayName);
      const phone = sanitizeAdministrativePhone(latestLead.phone) || "Teléfono no registrado";
      const email = sanitizeAdministrativeEmail(latestLead.email) || "Correo no registrado";
      const birthDate = "";
      const address = "";
      const emergencyContact = "";
      const preferredContactMethod = "";
      const missingFields = getMissingFieldsFromAdministrativeValues({
        firstName,
        lastName,
        phone,
        email,
        birthDate,
        address,
        emergencyContact,
        preferredContactMethod,
      });

      return {
        id: key,
        displayName,
        firstName,
        lastName,
        phone,
        email,
        birthDate,
        address,
        emergencyContact,
        preferredContactMethod,
        treatmentInterest: normalizeValue(latestLead.treatment) || "Servicio por definir",
        preferredDate: normalizeValue(latestLead.preferredDate),
        latestStatus: normalizeValue(latestLead.status) || "nuevo",
        source: normalizeValue(latestLead.source) || "Sin canal",
        createdAt: normalizeValue(latestLead.createdAt),
        notes,
        sourceLeadIds: patientLeads.map((lead) => normalizeValue(lead.id) || "Sin folio"),
        missingFields,
        completionPercentage: getCompletionPercentage(missingFields),
        administrativeStatus: getAdministrativeStatus(missingFields),
      } satisfies PatientAdministrativeProfile;
    })
    .sort((a, b) => a.displayName.localeCompare(b.displayName, "es"));
}

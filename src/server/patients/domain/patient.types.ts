import type {
  PatientActorRole,
  PatientContactPointStatus,
  PatientCreationSource,
  PatientIdentifierType,
  PatientStatus,
} from "./patient.enums";

export type PatientId = string;

export type PatientAuditActor = {
  userId?: string;
  role?: PatientActorRole;
  via: PatientCreationSource;
};

export type PatientPhone = {
  id: string;
  patientId: PatientId;
  phone: string;
  normalizedPhone: string;
  label?: string;
  isPrimary: boolean;
  status: PatientContactPointStatus;
  createdAt: string;
  updatedAt: string;
};

export type PatientEmail = {
  id: string;
  patientId: PatientId;
  email: string;
  normalizedEmail: string;
  label?: string;
  isPrimary: boolean;
  status: PatientContactPointStatus;
  createdAt: string;
  updatedAt: string;
};

export type PatientAddress = {
  id: string;
  patientId: PatientId;
  line1: string;
  line2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  label?: string;
  isPrimary: boolean;
  status: PatientContactPointStatus;
  createdAt: string;
  updatedAt: string;
};

export type PatientIdentifier = {
  id: string;
  patientId: PatientId;
  type: PatientIdentifierType;
  value: string;
  normalizedValue: string;
  issuingAuthority?: string;
  isPrimary: boolean;
  status: PatientContactPointStatus;
  createdAt: string;
  updatedAt: string;
};

export type Patient = {
  id: PatientId;
  displayName: string;
  firstName?: string;
  lastName?: string;
  secondLastName?: string;
  normalizedName: string;
  status: PatientStatus;
  source: PatientCreationSource;
  linkedLeadId?: string;
  linkedAppointmentId?: string;
  requiresInvoice: boolean;
  isRetired: boolean;
  hasInsurance: boolean;
  createdByUserId?: string;
  createdByRole?: PatientActorRole;
  createdVia: PatientCreationSource;
  updatedByUserId?: string;
  updatedByRole?: PatientActorRole;
  updatedVia?: PatientCreationSource;
  createdAt: string;
  updatedAt: string;
  phones: PatientPhone[];
  emails: PatientEmail[];
  addresses: PatientAddress[];
  identifiers: PatientIdentifier[];
};

/**
 * Official Patients aggregate root type for 73.1-B Aggregate Alignment.
 * This is an alias to the existing Patient model to preserve all certified
 * application, persistence, and API contracts. Do not introduce a parallel
 * Patients aggregate/domain model.
 */
export type PatientAggregateRoot = Patient;

export type PatientAggregateLifecycleOperation = "create" | "update" | "archive";

export type PatientAggregateOperationContext = {
  now?: string;
  actor?: PatientAuditActor;
};

export type CreatePatientAggregateOptions = {
  id?: PatientId;
  now?: string;
};

export type UpdatePatientAggregateOptions = PatientAggregateOperationContext;

export type ArchivePatientInput = {
  actor?: PatientAuditActor;
};

export type CreatePatientPhoneInput = {
  id?: string;
  phone: string;
  label?: string;
  isPrimary?: boolean;
  status?: PatientContactPointStatus;
};

export type CreatePatientEmailInput = {
  id?: string;
  email: string;
  label?: string;
  isPrimary?: boolean;
  status?: PatientContactPointStatus;
};

export type CreatePatientAddressInput = {
  id?: string;
  line1: string;
  line2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  label?: string;
  isPrimary?: boolean;
  status?: PatientContactPointStatus;
};

export type CreatePatientIdentifierInput = {
  id?: string;
  type: PatientIdentifierType;
  value: string;
  issuingAuthority?: string;
  isPrimary?: boolean;
  status?: PatientContactPointStatus;
};

export type CreatePatientInput = {
  id?: PatientId;
  displayName?: string;
  firstName?: string;
  lastName?: string;
  secondLastName?: string;
  status?: PatientStatus;
  source: PatientCreationSource;
  linkedLeadId?: string;
  linkedAppointmentId?: string;
  requiresInvoice?: boolean;
  isRetired?: boolean;
  hasInsurance?: boolean;
  phones?: CreatePatientPhoneInput[];
  emails?: CreatePatientEmailInput[];
  addresses?: CreatePatientAddressInput[];
  identifiers?: CreatePatientIdentifierInput[];
  actor?: PatientAuditActor;
};

export type UpdatePatientInput = Partial<
  Pick<
    Patient,
    | "displayName"
    | "firstName"
    | "lastName"
    | "secondLastName"
    | "status"
    | "requiresInvoice"
    | "isRetired"
    | "hasInsurance"
  >
> & {
  actor?: PatientAuditActor;
};

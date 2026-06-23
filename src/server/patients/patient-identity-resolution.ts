import { normalizeIdentifier, normalizeName, normalizePhone, type CreatePatientInput, type Patient } from "./patient-domain";
import type { PatientIdentitySearch, PatientRepository } from "./patient-repository";

export type PatientIdentityResolutionStatus = "strong_match" | "ambiguous_match" | "no_match";

export type PatientIdentityResolutionResult = {
  status: PatientIdentityResolutionStatus;
  matches: Patient[];
  requiredDifferentiators: string[];
  reason: string;
};

function getPrimaryEmail(input: CreatePatientInput): string | undefined {
  return input.emails?.find((email) => email.isPrimary)?.email ?? input.emails?.[0]?.email;
}

function getPrimaryPhone(input: CreatePatientInput): string | undefined {
  return input.phones?.find((phone) => phone.isPrimary)?.phone ?? input.phones?.[0]?.phone;
}

function getPrimaryIdentifier(input: CreatePatientInput) {
  return input.identifiers?.find((identifier) => identifier.isPrimary) ?? input.identifiers?.[0];
}

function buildSearch(input: CreatePatientInput): PatientIdentitySearch {
  const displayName = input.displayName ?? [input.firstName, input.lastName, input.secondLastName].filter(Boolean).join(" ");
  const identifier = getPrimaryIdentifier(input);
  return {
    normalizedName: displayName ? normalizeName(displayName) : undefined,
    email: getPrimaryEmail(input)?.trim().toLowerCase(),
    phone: getPrimaryPhone(input) ? normalizePhone(getPrimaryPhone(input) as string) : undefined,
    identifierType: identifier?.type,
    identifierValue: identifier ? normalizeIdentifier(identifier.value) : undefined,
  };
}

export class PatientIdentityResolutionService {
  constructor(private readonly repository: PatientRepository) {}

  async resolveBeforeCreate(input: CreatePatientInput): Promise<PatientIdentityResolutionResult> {
    const search = buildSearch(input);
    const matches = await this.repository.searchPatientsByIdentity(search);

    if (!matches.length) {
      return {
        status: "no_match",
        matches: [],
        requiredDifferentiators: [],
        reason: "No existing patient matched the supplied identity data.",
      };
    }

    const normalizedEmail = search.email;
    const strongMatches = matches.filter(
      (patient) =>
        patient.normalizedName === search.normalizedName &&
        Boolean(normalizedEmail) &&
        patient.emails.some((email) => email.normalizedEmail === normalizedEmail),
    );

    if (strongMatches.length === 1) {
      return {
        status: "strong_match",
        matches: strongMatches,
        requiredDifferentiators: [],
        reason: "Strong match found by normalized name and email.",
      };
    }

    return {
      status: "ambiguous_match",
      matches,
      requiredDifferentiators: ["second_last_name", "cid", "phone", "additional_identifier"],
      reason: "Potential patient match requires manual differentiation. Automatic merge is not allowed.",
    };
  }
}

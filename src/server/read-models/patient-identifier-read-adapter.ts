import type { PatientIdentifierReadModel } from "@/server/read-models/worksheet-read-models";

export type PatientIdentityDocumentType = "CID" | "PASSPORT" | "FOREIGN_ID" | "TMP-PAT";

export type PatientResolvedIdentity = {
  patientId: string;
  documentType: PatientIdentityDocumentType;
  documentValue: string;
  sourceIdentifierId?: string;
  priority: number;
  isTemporary: boolean;
};

export const DOCUMENT_PRIORITY: Record<PatientIdentityDocumentType, number> = {
  CID: 1,
  PASSPORT: 2,
  FOREIGN_ID: 3,
  "TMP-PAT": 4,
};

export function normalizeIdentifierValue(value: string | undefined | null) {
  return (value ?? "").trim();
}

export function normalizeIdentityType(
  value: string | undefined | null,
): PatientIdentityDocumentType | null {
  const normalized = normalizeIdentifierValue(value)
    .toUpperCase()
    .replace(/[\s_-]+/g, "_");

  if (["CID", "CEDULA", "CÉDULA", "CEDULA_PANAMA", "PANAMA_CID"].includes(normalized)) {
    return "CID";
  }

  if (["PASSPORT", "PASAPORTE"].includes(normalized)) return "PASSPORT";
  if (["FOREIGN_ID", "FOREIGNID", "EXTRANJERO", "ID_EXTRANJERO"].includes(normalized)) {
    return "FOREIGN_ID";
  }
  if (["TMP_PAT", "TMP-PAT", "TEMPORARY", "TEMPORAL"].includes(normalized)) return "TMP-PAT";

  return null;
}

function createTemporaryIdentity(patientId: string): PatientResolvedIdentity {
  return {
    patientId,
    documentType: "TMP-PAT",
    documentValue: `TMP-PAT-${patientId}`,
    priority: DOCUMENT_PRIORITY["TMP-PAT"],
    isTemporary: true,
  };
}

function sortIdentifiersByPriority(
  left: PatientIdentifierReadModel,
  right: PatientIdentifierReadModel,
) {
  const leftType = normalizeIdentityType(left.identifierType) ?? "TMP-PAT";
  const rightType = normalizeIdentityType(right.identifierType) ?? "TMP-PAT";
  const priorityDelta = DOCUMENT_PRIORITY[leftType] - DOCUMENT_PRIORITY[rightType];
  if (priorityDelta !== 0) return priorityDelta;
  if (left.isPrimary !== right.isPrimary) return left.isPrimary ? -1 : 1;

  const leftTime = Date.parse(left.updatedAt || left.createdAt || "");
  const rightTime = Date.parse(right.updatedAt || right.createdAt || "");
  return (Number.isNaN(rightTime) ? 0 : rightTime) - (Number.isNaN(leftTime) ? 0 : leftTime);
}

export function resolvePatientIdentity(
  patientId: string,
  identifiers: PatientIdentifierReadModel[],
): PatientResolvedIdentity {
  const matchingIdentifiers = identifiers.filter(
    (identifier) =>
      identifier.patientId === patientId &&
      normalizeIdentifierValue(identifier.identifierValue) &&
      normalizeIdentityType(identifier.identifierType),
  );

  const selectedIdentifier = [...matchingIdentifiers].sort(sortIdentifiersByPriority)[0];
  const documentType = normalizeIdentityType(selectedIdentifier?.identifierType);

  if (!selectedIdentifier || !documentType) return createTemporaryIdentity(patientId);

  return {
    patientId,
    documentType,
    documentValue: normalizeIdentifierValue(selectedIdentifier.identifierValue),
    sourceIdentifierId: normalizeIdentifierValue(selectedIdentifier.identifierId) || undefined,
    priority: DOCUMENT_PRIORITY[documentType],
    isTemporary: documentType === "TMP-PAT",
  };
}

export function findDuplicateResolvedIdentities(identities: PatientResolvedIdentity[]) {
  const explicitIdentities = identities.filter((identity) => !identity.isTemporary);
  const identityKeys = new Map<string, number>();

  for (const identity of explicitIdentities) {
    const key = `${identity.documentType}:${identity.documentValue.toUpperCase()}`;
    identityKeys.set(key, (identityKeys.get(key) ?? 0) + 1);
  }

  return [...identityKeys.entries()]
    .filter(([, count]) => count > 1)
    .map(([key]) => key)
    .sort();
}

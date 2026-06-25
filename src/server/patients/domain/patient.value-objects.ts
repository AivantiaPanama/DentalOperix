export type PatientNameValue = Readonly<{
  displayName: string;
  normalizedName: string;
}>;

export type PatientEmailValue = Readonly<{
  email: string;
  normalizedEmail: string;
}>;

export type PatientPhoneValue = Readonly<{
  phone: string;
  normalizedPhone: string;
}>;

export type PatientIdentifierValue = Readonly<{
  value: string;
  normalizedValue: string;
}>;

export type PatientAddressValue = Readonly<{
  line1: string;
  line2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}>;

export type PatientValueObjectValidationResult = Readonly<{
  valid: boolean;
  message?: string;
}>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizeWhitespace(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}

function rejectBlank(value: string, message: string): PatientValueObjectValidationResult {
  return normalizeWhitespace(value) ? { valid: true } : { valid: false, message };
}

export function normalizeName(value: string): string {
  return value
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .toLowerCase();
}

export function normalizePhone(value: string): string {
  return value.replace(/\D/g, "");
}

export function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

export function normalizeIdentifier(value: string): string {
  return value.trim().replace(/\s+/g, "").toUpperCase();
}

export function buildDisplayName(input: {
  displayName?: string;
  firstName?: string;
  lastName?: string;
  secondLastName?: string;
}): string {
  return (input.displayName ?? [input.firstName, input.lastName, input.secondLastName].filter(Boolean).join(" ")).trim();
}

export function validatePatientNameValue(input: {
  displayName?: string;
  firstName?: string;
  lastName?: string;
  secondLastName?: string;
}): PatientValueObjectValidationResult {
  return rejectBlank(buildDisplayName(input), "Patient name is required.");
}

export function createPatientNameValue(input: {
  displayName?: string;
  firstName?: string;
  lastName?: string;
  secondLastName?: string;
}): PatientNameValue {
  const displayName = buildDisplayName(input);
  return Object.freeze({ displayName, normalizedName: normalizeName(displayName) });
}

export function validatePatientEmailValue(value: string): PatientValueObjectValidationResult {
  const normalizedEmail = normalizeEmail(value);
  if (!normalizedEmail) return { valid: false, message: "Patient email is required." };
  if (!EMAIL_PATTERN.test(normalizedEmail)) return { valid: false, message: "Patient email must be valid." };
  return { valid: true };
}

export function createPatientEmailValue(value: string): PatientEmailValue {
  const email = normalizeEmail(value);
  return Object.freeze({ email, normalizedEmail: email });
}

export function validatePatientPhoneValue(value: string): PatientValueObjectValidationResult {
  const normalizedPhone = normalizePhone(value);
  if (!normalizedPhone) return { valid: false, message: "Patient phone is required." };
  return { valid: true };
}

export function createPatientPhoneValue(value: string): PatientPhoneValue {
  return Object.freeze({ phone: value, normalizedPhone: normalizePhone(value) });
}

export function validatePatientIdentifierValue(value: string): PatientValueObjectValidationResult {
  const normalizedValue = normalizeIdentifier(value);
  if (!normalizedValue) return { valid: false, message: "Patient identifier value is required." };
  return { valid: true };
}

export function createPatientIdentifierValue(value: string): PatientIdentifierValue {
  return Object.freeze({ value, normalizedValue: normalizeIdentifier(value) });
}

export function validatePatientAddressValue(input: { line1?: string }): PatientValueObjectValidationResult {
  return rejectBlank(input.line1 ?? "", "Patient address line1 is required.");
}

export function createPatientAddressValue(input: {
  line1: string;
  line2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}): PatientAddressValue {
  return Object.freeze({
    line1: normalizeWhitespace(input.line1),
    line2: input.line2 ? normalizeWhitespace(input.line2) : undefined,
    city: input.city ? normalizeWhitespace(input.city) : undefined,
    state: input.state ? normalizeWhitespace(input.state) : undefined,
    postalCode: input.postalCode ? normalizeWhitespace(input.postalCode) : undefined,
    country: input.country ? normalizeWhitespace(input.country) : undefined,
  });
}

export function normalizePrimaryFlags<T extends { isPrimary: boolean }>(items: T[]): T[] {
  if (!items.length || items.some((item) => item.isPrimary)) return items;
  return items.map((item, index) => ({ ...item, isPrimary: index === 0 }));
}

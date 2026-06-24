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

export function normalizePrimaryFlags<T extends { isPrimary: boolean }>(items: T[]): T[] {
  if (!items.length || items.some((item) => item.isPrimary)) return items;
  return items.map((item, index) => ({ ...item, isPrimary: index === 0 }));
}

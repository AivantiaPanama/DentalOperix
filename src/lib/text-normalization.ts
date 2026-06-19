const CONTEXTUAL_MOJIBAKE_REPLACEMENTS: ReadonlyArray<[RegExp, string]> = [
  // Some legacy CRM rows lost the byte after `Ã`, leaving incomplete mojibake.
  // Keep these replacements contextual so valid Spanish text is not rewritten broadly.
  [/ologÃa/g, "ología"],
  [/MartÃnes/g, "Martínes"],
  [/AlimaÃ±a/g, "Alimaña"],
  [/RevisiÃn/g, "Revisión"],
];

const MOJIBAKE_REPLACEMENTS: ReadonlyArray<[RegExp, string]> = [
  [/Ã¡/g, "á"],
  [/Ã©/g, "é"],
  [/Ã­/g, "í"],
  [/Ã³/g, "ó"],
  [/Ãº/g, "ú"],
  [/ÃÁ/g, "Á"],
  [/Ã‰/g, "É"],
  [/ÃÍ/g, "Í"],
  [/Ã“/g, "Ó"],
  [/Ãš/g, "Ú"],
  [/Ã±/g, "ñ"],
  [/Ã‘/g, "Ñ"],
  [/Â¿/g, "¿"],
  [/Â¡/g, "¡"],
  [/Âº/g, "º"],
  [/Âª/g, "ª"],
  [/Â·/g, "·"],
  [/Â/g, ""],
];

export function normalizeMojibakeText(value: string): string {
  const contextuallyNormalized = CONTEXTUAL_MOJIBAKE_REPLACEMENTS.reduce(
    (current, [pattern, replacement]) => current.replace(pattern, replacement),
    value,
  );

  return MOJIBAKE_REPLACEMENTS.reduce(
    (current, [pattern, replacement]) => current.replace(pattern, replacement),
    contextuallyNormalized,
  );
}

export function normalizeDisplayText(value?: unknown): string {
  if (value === null || value === undefined) return "";
  return normalizeMojibakeText(value.toString()).trim();
}

export function normalizeServiceName(value?: unknown): string {
  return normalizeDisplayText(value) || "unknown";
}

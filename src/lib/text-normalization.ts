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
  return MOJIBAKE_REPLACEMENTS.reduce(
    (current, [pattern, replacement]) => current.replace(pattern, replacement),
    value,
  );
}

export function normalizeDisplayText(value?: unknown): string {
  if (value === null || value === undefined) return "";
  return normalizeMojibakeText(value.toString()).trim();
}

export function normalizeServiceName(value?: unknown): string {
  return normalizeDisplayText(value) || "unknown";
}

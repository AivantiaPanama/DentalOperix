type LogLevel = "info" | "warn" | "error";

type LogMetadata = Record<string, unknown>;

const SECRET_KEY_PATTERN = /(secret|token|api[-_]?key|refresh|credential|password|authorization)/i;

function sanitizeValue(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, nestedValue]) => [
        key,
        SECRET_KEY_PATTERN.test(key) ? "[REDACTED]" : sanitizeValue(nestedValue),
      ]),
    );
  }

  return value;
}

export function sanitizeLogMetadata(metadata: LogMetadata = {}) {
  return sanitizeValue(metadata) as LogMetadata;
}

function writeLog(level: LogLevel, scope: string, message: string, metadata: LogMetadata = {}) {
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    scope,
    message,
    metadata: sanitizeLogMetadata(metadata),
  };

  const serialized = JSON.stringify(entry);
  if (level === "error") console.error(serialized);
  else if (level === "warn") console.warn(serialized);
  else console.info(serialized);
}

export const logger = {
  info: (scope: string, message: string, metadata?: LogMetadata) =>
    writeLog("info", scope, message, metadata),
  warn: (scope: string, message: string, metadata?: LogMetadata) =>
    writeLog("warn", scope, message, metadata),
  error: (scope: string, message: string, metadata?: LogMetadata) =>
    writeLog("error", scope, message, metadata),
};

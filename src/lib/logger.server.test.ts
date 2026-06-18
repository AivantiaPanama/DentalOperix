import { describe, expect, it } from "vitest";
import { sanitizeLogMetadata } from "./logger.server";

describe("logger.server", () => {
  it("redacts secrets from structured metadata", () => {
    const sanitized = sanitizeLogMetadata({
      ok: true,
      apiKey: "secret",
      nested: { refreshToken: "refresh", value: "visible" },
    });

    expect(sanitized).toEqual({
      ok: true,
      apiKey: "[REDACTED]",
      nested: { refreshToken: "[REDACTED]", value: "visible" },
    });
  });
});

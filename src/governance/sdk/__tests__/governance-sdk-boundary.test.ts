import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, sep } from "node:path";

const root = process.cwd();
const sdkRoot = join(root, "src/governance/sdk");

const protectedRuntimeTerms = [
  "BookingDialog",
  "processDentalLead",
  "/api/leads/create",
  "FloatingDentalAIChat",
  "siteServices",
  "server/leads",
  "server/patients",
  "routes/api/calendar",
  "routes/api/gmail",
];

const collectFiles = (dir: string): string[] => {
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    return statSync(path).isDirectory() ? collectFiles(path) : [path];
  });
};

const normalizePath = (file: string): string => file.split(sep).join("/");

describe("Governance SDK Core boundary", () => {
  it("stays isolated from certified functional runtime boundaries", () => {
    const files = collectFiles(sdkRoot).filter((file) => {
      const normalized = normalizePath(file);

      return (
        normalized.endsWith(".ts") &&
        !normalized.includes("/__tests__/") &&
        !normalized.endsWith(".test.ts") &&
        !normalized.endsWith(".spec.ts")
      );
    });

    for (const file of files) {
      const content = readFileSync(file, "utf8");

      for (const term of protectedRuntimeTerms) {
        expect(content, `${file} must not reference ${term}`).not.toContain(term);
      }
    }
  });
});
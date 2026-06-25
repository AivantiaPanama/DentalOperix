import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

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

describe("Governance SDK Core boundary", () => {
  it("stays isolated from certified functional runtime boundaries", () => {
    const files = collectFiles(sdkRoot).filter((file) => file.endsWith(".ts") && !file.includes("/__tests__/"));

    for (const file of files) {
      const content = readFileSync(file, "utf8");

      for (const term of protectedRuntimeTerms) {
        expect(content, `${file} must not reference ${term}`).not.toContain(term);
      }
    }
  });
});

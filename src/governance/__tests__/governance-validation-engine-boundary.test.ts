import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, sep } from "node:path";

const root = process.cwd();
const governanceRoot = join(root, "src/governance");

const blockedImportSegments = [
  "../server/",
  "../routes/",
  "../components/",
  "../lib/api/",
  "@/server/",
  "@/routes/",
  "@/components/",
  "@/lib/api/",
  "src/server/",
  "src/routes/",
  "src/components/",
  "src/lib/api/",
];

const collectFiles = (dir: string): string[] => {
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    return statSync(path).isDirectory() ? collectFiles(path) : [path];
  });
};

const normalizePath = (file: string): string => file.split(sep).join("/");

describe("Governance Validation Engine boundary", () => {
  it("stays isolated from certified functional runtime modules", () => {
    const files = collectFiles(governanceRoot).filter((file) => {
      const normalizedFile = normalizePath(file);

      return (
        file.endsWith(".ts") &&
        !normalizedFile.includes("/__tests__/") &&
        !normalizedFile.endsWith(".test.ts") &&
        !normalizedFile.endsWith(".spec.ts")
      );
    });

    for (const file of files) {
      const content = readFileSync(file, "utf8");

      for (const segment of blockedImportSegments) {
        expect(content, `${file} must not import ${segment}`).not.toContain(segment);
      }
    }
  });
});

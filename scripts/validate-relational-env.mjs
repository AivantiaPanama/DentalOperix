import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const envFile = process.argv[2] || ".env.relational.local";
const envPath = path.resolve(process.cwd(), envFile);

function parseEnv(content) {
  const result = {};
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const index = line.indexOf("=");
    if (index < 0) continue;
    const key = line.slice(0, index).trim();
    let value = line.slice(index + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    result[key] = value;
  }
  return result;
}

if (!fs.existsSync(envPath)) {
  console.error(`Missing env file: ${envFile}`);
  console.error("Create it from .env.relational.example and fill approved values.");
  process.exit(1);
}

const env = { ...process.env, ...parseEnv(fs.readFileSync(envPath, "utf8")) };

const errors = [];
const warnings = [];
const mode = env.LEADS_PERSISTENCE_MODE || "google-sheet";
const cutoverApproved = env.RELATIONAL_CUTOVER_APPROVED === "true";
const connectivityEnabled = env.RELATIONAL_CONNECTIVITY_TEST_ENABLED === "true";
const databaseUrl = env.DATABASE_URL || env.POSTGRES_URL || "";

if (!["google-sheet", "relational-db"].includes(mode)) {
  errors.push("LEADS_PERSISTENCE_MODE must be google-sheet or relational-db.");
}

for (const key of ["GOOGLE_SHEET_ID", "GOOGLE_SHEET_NAME"]) {
  if (!env[key])
    warnings.push(`${key} is missing; rollback/current-persistence validation will be incomplete.`);
}

if (mode === "relational-db") {
  if (!databaseUrl) errors.push("Relational mode requires DATABASE_URL or POSTGRES_URL.");
  if (!cutoverApproved) {
    errors.push(
      "LEADS_PERSISTENCE_MODE=relational-db requires RELATIONAL_CUTOVER_APPROVED=true for governance validation.",
    );
  }
}

if (connectivityEnabled && !databaseUrl) {
  errors.push("RELATIONAL_CONNECTIVITY_TEST_ENABLED=true requires DATABASE_URL or POSTGRES_URL.");
}

if (!connectivityEnabled) {
  warnings.push(
    "Relational connectivity test disabled. This validates configuration shape only, not database reachability.",
  );
}

console.log("DentalOperix 57.7 relational environment validation");
console.log(`Env file: ${envFile}`);
console.log(`Persistence mode: ${mode}`);
console.log(`Cutover approved flag: ${cutoverApproved ? "true" : "false"}`);
console.log(`Connectivity test enabled: ${connectivityEnabled ? "true" : "false"}`);
console.log(`Database URL configured: ${databaseUrl ? "yes" : "no"}`);

if (warnings.length) {
  console.log("\nWarnings:");
  for (const warning of warnings) console.log(`- ${warning}`);
}

if (errors.length) {
  console.error("\nErrors:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("\nResult: PASS");

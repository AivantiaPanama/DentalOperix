import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { Client } from "pg";
import dotenv from "dotenv";

const envPath = process.argv[2] ?? ".env.relational.local";
const sqlPath =
  process.argv[3] ?? "docs/architecture/sql/57_7_C_supabase_leads_schema_deployment.sql";

function maskConnectionString(value) {
  if (!value) return "";
  return value.replace(/:([^:@/]+)@/, ":***@");
}

function fail(message) {
  console.error(message);
  process.exit(1);
}

if (!fs.existsSync(envPath)) {
  fail(`Missing env file: ${envPath}`);
}

if (!fs.existsSync(sqlPath)) {
  fail(`Missing SQL file: ${sqlPath}`);
}

dotenv.config({ path: envPath, override: true });

const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;
const persistenceMode = process.env.LEADS_PERSISTENCE_MODE ?? "google-sheet";
const cutoverApproved = process.env.RELATIONAL_CUTOVER_APPROVED === "true";
const schemaDeploymentApproved = process.env.RELATIONAL_SCHEMA_DEPLOYMENT_APPROVED === "true";
const schemaDeploymentEnabled = process.env.RELATIONAL_SCHEMA_DEPLOYMENT_ENABLED === "true";

console.log("DentalOperix 57.7-C relational schema deployment");
console.log(`Env file: ${envPath}`);
console.log(`SQL file: ${sqlPath}`);
console.log(`Persistence mode: ${persistenceMode}`);
console.log(`Cutover approved flag: ${cutoverApproved}`);
console.log(`Schema deployment approved: ${schemaDeploymentApproved}`);
console.log(`Schema deployment enabled: ${schemaDeploymentEnabled}`);
console.log(`Database URL configured: ${databaseUrl ? "yes" : "no"}`);

if (!databaseUrl) {
  fail("DATABASE_URL or POSTGRES_URL is required.");
}

if (persistenceMode !== "google-sheet") {
  fail(
    "Refusing schema deployment unless LEADS_PERSISTENCE_MODE=google-sheet. Schema deployment is not cutover.",
  );
}

if (cutoverApproved) {
  fail(
    "Refusing schema deployment when RELATIONAL_CUTOVER_APPROVED=true. Use cutover runbook for activation steps.",
  );
}

if (!schemaDeploymentApproved || !schemaDeploymentEnabled) {
  fail(
    "Schema deployment requires RELATIONAL_SCHEMA_DEPLOYMENT_APPROVED=true and RELATIONAL_SCHEMA_DEPLOYMENT_ENABLED=true.",
  );
}

const sql = fs.readFileSync(sqlPath, "utf8");
const client = new Client({ connectionString: databaseUrl, ssl: { rejectUnauthorized: false } });

try {
  console.log(`Connecting to: ${maskConnectionString(databaseUrl)}`);
  await client.connect();
  await client.query(sql);
  console.log("Schema deployment executed.");
  console.log("Result: PASS");
} catch (error) {
  console.error("Result: FAIL");
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
} finally {
  await client.end().catch(() => undefined);
}

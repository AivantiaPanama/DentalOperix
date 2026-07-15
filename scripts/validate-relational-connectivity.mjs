#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import dotenv from "dotenv";

const envFile = process.argv[2] || ".env.relational.local";
const envPath = path.resolve(process.cwd(), envFile);

function fail(message) {
  console.error(message);
  process.exitCode = 1;
}

function redact(value) {
  if (!value) return "";
  return value.replace(/:([^:@/]+)@/u, ":***@");
}

console.log("DentalOperix 57.7-B relational connectivity validation");
console.log(`Env file: ${envFile}`);

if (!fs.existsSync(envPath)) {
  fail(`Missing env file: ${envFile}`);
  process.exit();
}

dotenv.config({ path: envPath, override: true });

const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL || "";
const persistenceMode = process.env.LEADS_PERSISTENCE_MODE || "";
const cutoverApproved =
  process.env.RELATIONAL_CUTOVER_APPROVED || process.env.CUTOVER_APPROVED || "";
const connectivityEnabled = process.env.RELATIONAL_CONNECTIVITY_TEST_ENABLED || "";

console.log(`Persistence mode: ${persistenceMode || "(not set)"}`);
console.log(`Cutover approved flag: ${cutoverApproved || "(not set)"}`);
console.log(`Connectivity test enabled: ${connectivityEnabled || "(not set)"}`);
console.log(`Database URL configured: ${databaseUrl ? "yes" : "no"}`);

const errors = [];
if (!databaseUrl) errors.push("DATABASE_URL or POSTGRES_URL is required.");
if (persistenceMode !== "google-sheet")
  errors.push(
    "LEADS_PERSISTENCE_MODE must remain google-sheet for 57.7-B connectivity validation.",
  );
if (cutoverApproved !== "false")
  errors.push("RELATIONAL_CUTOVER_APPROVED must remain false for 57.7-B connectivity validation.");
if (connectivityEnabled !== "true")
  errors.push(
    "RELATIONAL_CONNECTIVITY_TEST_ENABLED must be true to run this connectivity validation.",
  );

if (errors.length > 0) {
  console.error("\nErrors:");
  for (const error of errors) console.error(`- ${error}`);
  fail("\nResult: FAIL");
  process.exit();
}

let Client;
try {
  ({ Client } = await import("pg"));
} catch (error) {
  console.error("\nMissing dependency: pg");
  console.error("Install it before running this validation: npm install pg");
  console.error("This script does not activate relational persistence or perform cutover.");
  fail("\nResult: FAIL");
  process.exit();
}

const client = new Client({
  connectionString: databaseUrl,
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 15000,
});

try {
  console.log(`Connecting to: ${redact(databaseUrl)}`);
  await client.connect();
  const result = await client.query("select 1 as connectivity_check");
  const value = result?.rows?.[0]?.connectivity_check;
  if (value !== 1) {
    throw new Error(`Unexpected SELECT 1 result: ${value}`);
  }
  console.log("Query executed: SELECT 1");
  console.log("Result: PASS");
} catch (error) {
  console.error("\nConnectivity error:");
  console.error(error?.message || error);
  fail("\nResult: FAIL");
} finally {
  try {
    await client.end();
  } catch {}
}

import fs from "node:fs";
import process from "node:process";
import { Client } from "pg";
import dotenv from "dotenv";

const envPath = process.argv[2] ?? ".env.relational.prod";

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

dotenv.config({ path: envPath, override: true });

const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;
const persistenceMode = process.env.LEADS_PERSISTENCE_MODE ?? "google-sheet";
const cutoverApproved = process.env.RELATIONAL_CUTOVER_APPROVED === "true";
const runtimeActivationApproved = process.env.RELATIONAL_RUNTIME_ACTIVATION_APPROVED === "true";
const readinessApproved = process.env.RELATIONAL_PRODUCTION_CUTOVER_READINESS_APPROVED === "true";
const googleSheetId = process.env.GOOGLE_SHEET_ID;
const googleSheetName = process.env.GOOGLE_SHEET_NAME;

const requiredTables = ["leads", "lead_persistence_migration_audit"];
const requiredLeadColumns = [
  "id",
  "created_at",
  "name",
  "phone",
  "email",
  "treatment",
  "message",
  "urgency",
  "preferred_date",
  "status",
  "source",
  "ai_summary",
  "calendar_event_id",
  "email_sent",
  "physical_source",
  "source_record_hash",
  "schema_version",
  "inserted_at",
  "updated_at",
];

console.log("DentalOperix 57.8-C production cutover readiness validation");
console.log(`Env file: ${envPath}`);
console.log(`Persistence mode: ${persistenceMode}`);
console.log(`Cutover approved flag: ${cutoverApproved}`);
console.log(`Runtime activation approved flag: ${runtimeActivationApproved}`);
console.log(`Production readiness approved flag: ${readinessApproved}`);
console.log(`Database URL configured: ${databaseUrl ? "yes" : "no"}`);
console.log(
  `Google Sheet rollback reference configured: ${googleSheetId && googleSheetName ? "yes" : "no"}`,
);

if (!databaseUrl) {
  fail("DATABASE_URL or POSTGRES_URL is required.");
}

if (persistenceMode !== "relational-db") {
  fail("LEADS_PERSISTENCE_MODE must be relational-db for production cutover readiness validation.");
}

if (!cutoverApproved) {
  fail("RELATIONAL_CUTOVER_APPROVED=true is required for production cutover readiness validation.");
}

if (!runtimeActivationApproved) {
  fail(
    "RELATIONAL_RUNTIME_ACTIVATION_APPROVED=true is required for production cutover readiness validation.",
  );
}

if (!readinessApproved) {
  fail(
    "RELATIONAL_PRODUCTION_CUTOVER_READINESS_APPROVED=true is required to run this controlled production readiness validation.",
  );
}

if (!googleSheetId || !googleSheetName) {
  fail(
    "GOOGLE_SHEET_ID and GOOGLE_SHEET_NAME are required as rollback/current-persistence references before production cutover.",
  );
}

const client = new Client({ connectionString: databaseUrl, ssl: { rejectUnauthorized: false } });

try {
  console.log(`Connecting to: ${maskConnectionString(databaseUrl)}`);
  await client.connect();

  const tableResult = await client.query(
    `SELECT table_name
       FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_name = ANY($1)
      ORDER BY table_name`,
    [requiredTables],
  );

  const foundTables = tableResult.rows.map((row) => row.table_name);
  const missingTables = requiredTables.filter((table) => !foundTables.includes(table));

  if (missingTables.length > 0) {
    fail(`Missing required tables: ${missingTables.join(", ")}`);
  }

  const columnResult = await client.query(
    `SELECT column_name
       FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = 'leads'
      ORDER BY ordinal_position`,
  );

  const foundLeadColumns = columnResult.rows.map((row) => row.column_name);
  const missingLeadColumns = requiredLeadColumns.filter(
    (column) => !foundLeadColumns.includes(column),
  );

  if (missingLeadColumns.length > 0) {
    fail(`Missing required leads columns: ${missingLeadColumns.join(", ")}`);
  }

  const leadsCount = await client.query("SELECT COUNT(*)::int AS count FROM leads");
  const auditCount = await client.query(
    "SELECT COUNT(*)::int AS count FROM lead_persistence_migration_audit",
  );
  const dbIdentity = await client.query(
    "SELECT current_database() AS database_name, current_user AS database_user",
  );

  console.log(`Tables found: ${foundTables.join(", ")}`);
  console.log(`Leads columns validated: ${requiredLeadColumns.length}`);
  console.log(`Current leads rows: ${leadsCount.rows[0]?.count ?? "unknown"}`);
  console.log(`Current audit rows: ${auditCount.rows[0]?.count ?? "unknown"}`);
  console.log(
    `Database identity: ${dbIdentity.rows[0]?.database_name ?? "unknown"} / ${dbIdentity.rows[0]?.database_user ?? "unknown"}`,
  );
  console.log("Result: PASS");
} catch (error) {
  console.error("Result: FAIL");
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
} finally {
  await client.end().catch(() => undefined);
}

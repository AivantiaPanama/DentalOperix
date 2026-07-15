import fs from "node:fs";
import process from "node:process";
import crypto from "node:crypto";
import { Client } from "pg";
import dotenv from "dotenv";

const envPath = process.argv[2] ?? ".env.relational.local";

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
const dryRunApproved = process.env.RELATIONAL_DRY_RUN_APPROVED === "true";
const dryRunEnabled = process.env.RELATIONAL_DRY_RUN_ENABLED === "true";
const schemaDeploymentApproved = process.env.RELATIONAL_SCHEMA_DEPLOYMENT_APPROVED === "true";
const schemaDeploymentEnabled = process.env.RELATIONAL_SCHEMA_DEPLOYMENT_ENABLED === "true";

console.log("DentalOperix 57.7-D relational dry-run validation");
console.log(`Env file: ${envPath}`);
console.log(`Persistence mode: ${persistenceMode}`);
console.log(`Cutover approved flag: ${cutoverApproved}`);
console.log(`Dry-run approved: ${dryRunApproved}`);
console.log(`Dry-run enabled: ${dryRunEnabled}`);
console.log(`Database URL configured: ${databaseUrl ? "yes" : "no"}`);

if (!databaseUrl) {
  fail("DATABASE_URL or POSTGRES_URL is required.");
}

if (persistenceMode !== "google-sheet") {
  fail(
    "Refusing dry-run unless LEADS_PERSISTENCE_MODE=google-sheet. Dry-run must not activate cutover.",
  );
}

if (cutoverApproved) {
  fail(
    "Refusing dry-run when RELATIONAL_CUTOVER_APPROVED=true. This validation is pre-cutover only.",
  );
}

if (!dryRunApproved || !dryRunEnabled) {
  fail(
    "RELATIONAL_DRY_RUN_APPROVED=true and RELATIONAL_DRY_RUN_ENABLED=true are required for this explicit dry-run.",
  );
}

if (!schemaDeploymentApproved || !schemaDeploymentEnabled) {
  fail(
    "Schema deployment flags must remain true after 57.7-C so the schema validation context is explicit.",
  );
}

const client = new Client({ connectionString: databaseUrl, ssl: { rejectUnauthorized: false } });
const now = new Date().toISOString();
const id = `dryrun_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`;
const auditId = `dryrun_audit_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`;
const batchId = `57.7-D_${Date.now()}`;

try {
  console.log(`Connecting to: ${maskConnectionString(databaseUrl)}`);
  await client.connect();
  await client.query("BEGIN");

  await client.query(
    `INSERT INTO leads (
       id, created_at, name, phone, email, treatment, message, urgency,
       preferred_date, status, source, ai_summary, calendar_event_id, email_sent,
       physical_source, source_record_hash, schema_version
     ) VALUES (
       $1, $2, $3, $4, $5, $6, $7, $8,
       $9, $10, $11, $12, $13, $14,
       $15, $16, $17
     )`,
    [
      id,
      now,
      "DentalOperix Dry Run Patient",
      "+50700000000",
      "dry-run@example.invalid",
      "Odontología Preventiva",
      "Synthetic relational dry-run record. Not production data.",
      "media",
      "2026-01-01 09:00",
      "new",
      "57.7-D-dry-run",
      "Synthetic validation record. Transaction will be rolled back.",
      null,
      false,
      "relational-db",
      "dry-run-hash",
      "57.7-D",
    ],
  );

  const readResult = await client.query("SELECT id, status, email_sent FROM leads WHERE id = $1", [
    id,
  ]);
  if (readResult.rowCount !== 1) {
    throw new Error("Dry-run inserted lead was not readable inside the transaction.");
  }

  await client.query("UPDATE leads SET status = $2, email_sent = $3 WHERE id = $1", [
    id,
    "agendada",
    true,
  ]);

  const updateResult = await client.query(
    "SELECT id, status, email_sent FROM leads WHERE id = $1",
    [id],
  );
  if (updateResult.rows[0]?.status !== "agendada" || updateResult.rows[0]?.email_sent !== true) {
    throw new Error("Dry-run update validation failed.");
  }

  await client.query(
    `INSERT INTO lead_persistence_migration_audit (
       id, migration_batch_id, source_system, target_system, source_record_id,
       target_record_id, source_record_hash, migration_status
     ) VALUES ($1, $2, 'google-sheet', 'relational-db', $3, $4, $5, 'pending')`,
    [auditId, batchId, id, id, "dry-run-hash"],
  );

  const auditResult = await client.query(
    "SELECT id, migration_status FROM lead_persistence_migration_audit WHERE id = $1",
    [auditId],
  );
  if (auditResult.rowCount !== 1 || auditResult.rows[0]?.migration_status !== "pending") {
    throw new Error("Dry-run audit validation failed.");
  }

  await client.query("ROLLBACK");

  const cleanupCheck = await client.query("SELECT id FROM leads WHERE id = $1", [id]);
  if (cleanupCheck.rowCount !== 0) {
    throw new Error("Dry-run rollback cleanup check failed. Synthetic lead still exists.");
  }

  console.log(
    "Operations validated: INSERT lead, SELECT lead, UPDATE lead, INSERT audit, ROLLBACK cleanup",
  );
  console.log(`Synthetic lead id: ${id}`);
  console.log("Persisted rows after rollback: 0");
  console.log("Result: PASS");
} catch (error) {
  try {
    await client.query("ROLLBACK");
  } catch {
    // ignore rollback errors after connection/setup failure
  }
  console.error("Result: FAIL");
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
} finally {
  await client.end().catch(() => undefined);
}

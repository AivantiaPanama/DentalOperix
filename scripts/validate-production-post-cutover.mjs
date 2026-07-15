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
const postCutoverApproved = process.env.RELATIONAL_POST_CUTOVER_VALIDATION_APPROVED === "true";

console.log("DentalOperix 57.8-C production post-cutover validation");
console.log(`Env file: ${envPath}`);
console.log(`Persistence mode: ${persistenceMode}`);
console.log(`Cutover approved flag: ${cutoverApproved}`);
console.log(`Runtime activation approved flag: ${runtimeActivationApproved}`);
console.log(`Post-cutover validation approved flag: ${postCutoverApproved}`);
console.log(`Database URL configured: ${databaseUrl ? "yes" : "no"}`);

if (!databaseUrl) {
  fail("DATABASE_URL or POSTGRES_URL is required.");
}

if (persistenceMode !== "relational-db") {
  fail("LEADS_PERSISTENCE_MODE must be relational-db for post-cutover validation.");
}

if (!cutoverApproved) {
  fail("RELATIONAL_CUTOVER_APPROVED=true is required for post-cutover validation.");
}

if (!runtimeActivationApproved) {
  fail("RELATIONAL_RUNTIME_ACTIVATION_APPROVED=true is required for post-cutover validation.");
}

if (!postCutoverApproved) {
  fail(
    "RELATIONAL_POST_CUTOVER_VALIDATION_APPROVED=true is required to run this controlled post-cutover validation.",
  );
}

const syntheticLeadId = `postcutover_${Date.now()}_${Math.random().toString(16).slice(2, 10)}`;
const now = new Date().toISOString();
const client = new Client({ connectionString: databaseUrl, ssl: { rejectUnauthorized: false } });

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
      syntheticLeadId,
      now,
      "DentalOperix Post Cutover Test",
      "00000000",
      "postcutover@example.invalid",
      "Validacion Controlada",
      "Synthetic post-cutover validation row. Transaction will roll back.",
      "media",
      now,
      "nuevo",
      "57.8-C-post-cutover-validation",
      "Synthetic validation only",
      "",
      false,
      "relational-db",
      null,
      "57.8-C",
    ],
  );

  const inserted = await client.query("SELECT id, status, email_sent FROM leads WHERE id = $1", [
    syntheticLeadId,
  ]);
  if (inserted.rowCount !== 1) {
    fail("Synthetic post-cutover lead was not readable after insert.");
  }

  await client.query("UPDATE leads SET status = $1, email_sent = $2 WHERE id = $3", [
    "agendada",
    true,
    syntheticLeadId,
  ]);

  const updated = await client.query("SELECT id, status, email_sent FROM leads WHERE id = $1", [
    syntheticLeadId,
  ]);
  if (updated.rows[0]?.status !== "agendada" || updated.rows[0]?.email_sent !== true) {
    fail("Synthetic post-cutover lead was not readable after update.");
  }

  await client.query(
    `INSERT INTO lead_persistence_migration_audit (
      id,
      migration_batch_id,
      source_system,
      target_system,
      source_record_id,
      target_record_id,
      source_record_hash,
      migration_status,
      failure_reason
      )
      VALUES (
        $1,
        $2,
        'runtime',
        'supabase',
        $3,
        $3,
        NULL,
        'reconciled',
        NULL
      )`,
    [`audit_${syntheticLeadId}`, `post_cutover_validation_${Date.now()}`, syntheticLeadId],
  );

  await client.query("ROLLBACK");

  const residual = await client.query("SELECT COUNT(*)::int AS count FROM leads WHERE id = $1", [
    syntheticLeadId,
  ]);
  const persistedRows = residual.rows[0]?.count ?? 0;

  console.log(
    "Operations validated: INSERT lead, SELECT lead, UPDATE lead, INSERT audit, ROLLBACK cleanup",
  );
  console.log(`Synthetic lead id: ${syntheticLeadId}`);
  console.log(`Persisted rows after rollback: ${persistedRows}`);

  if (persistedRows !== 0) {
    fail("Synthetic post-cutover validation row persisted after rollback.");
  }

  console.log("Result: PASS");
} catch (error) {
  await client.query("ROLLBACK").catch(() => undefined);
  console.error("Result: FAIL");
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
} finally {
  await client.end().catch(() => undefined);
}

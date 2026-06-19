import fs from 'node:fs';
import process from 'node:process';
import dotenv from 'dotenv';

const envPath = process.argv[2] ?? '.env.relational.local';

function fail(message) {
  console.error(message);
  process.exit(1);
}

if (!fs.existsSync(envPath)) {
  fail(`Missing env file: ${envPath}`);
}

dotenv.config({ path: envPath, override: true });

const persistenceMode = process.env.LEADS_PERSISTENCE_MODE ?? 'google-sheet';
const cutoverApproved = process.env.RELATIONAL_CUTOVER_APPROVED === 'true';
const runtimeActivationApproved = process.env.RELATIONAL_RUNTIME_ACTIVATION_APPROVED === 'true';
const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;

console.log('DentalOperix 57.8 relational runtime flag validation');
console.log(`Env file: ${envPath}`);
console.log(`Persistence mode: ${persistenceMode}`);
console.log(`Cutover approved flag: ${cutoverApproved}`);
console.log(`Runtime activation approved flag: ${runtimeActivationApproved}`);
console.log(`Database URL configured: ${databaseUrl ? 'yes' : 'no'}`);

if (persistenceMode !== 'relational-db') {
  fail('LEADS_PERSISTENCE_MODE must be relational-db for controlled runtime activation validation.');
}

if (!cutoverApproved) {
  fail('RELATIONAL_CUTOVER_APPROVED=true is required for controlled runtime activation validation.');
}

if (!runtimeActivationApproved) {
  fail('RELATIONAL_RUNTIME_ACTIVATION_APPROVED=true is required for controlled runtime activation validation.');
}

if (!databaseUrl) {
  fail('DATABASE_URL or POSTGRES_URL is required.');
}

console.log('Result: PASS');

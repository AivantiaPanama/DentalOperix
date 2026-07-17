import dotenv from "dotenv";
import pg from "pg";

const { Client } = pg;

dotenv.config({
  path: ".env.relational.local",
});

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is not configured.");
  process.exit(1);
}

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

const expectedColumns = [
  "id",
  "email",
  "display_name",
  "role",
  "status",
  "created_at",
  "updated_at",
  "deactivated_at",
];

const expectedEnums = {
  user_role: ["administrator", "doctor", "assistant", "patient"],
  user_status: [
    "pending_activation",
    "active",
    "inactive",
    "suspended",
  ],
};

function validateColumns(rows) {
  const actualColumns = rows.map((row) => row.column_name);

  const missingColumns = expectedColumns.filter(
    (column) => !actualColumns.includes(column),
  );

  const unexpectedColumns = actualColumns.filter(
    (column) => !expectedColumns.includes(column),
  );

  if (missingColumns.length > 0) {
    throw new Error(`Missing users columns: ${missingColumns.join(", ")}`);
  }

  if (unexpectedColumns.length > 0) {
    console.warn(
      `Unexpected users columns detected: ${unexpectedColumns.join(", ")}`,
    );
  }
}

function validateEnums(rows) {
  for (const [enumName, expectedValues] of Object.entries(expectedEnums)) {
    const actualValues = rows
      .filter((row) => row.enum_name === enumName)
      .map((row) => row.enum_value);

    if (actualValues.length === 0) {
      throw new Error(`Enum ${enumName} was not found.`);
    }

    const missingValues = expectedValues.filter(
      (value) => !actualValues.includes(value),
    );

    const unexpectedValues = actualValues.filter(
      (value) => !expectedValues.includes(value),
    );

    if (missingValues.length > 0) {
      throw new Error(
        `Missing values in ${enumName}: ${missingValues.join(", ")}`,
      );
    }

    if (unexpectedValues.length > 0) {
      throw new Error(
        `Unexpected values in ${enumName}: ${unexpectedValues.join(", ")}`,
      );
    }

    if (actualValues.length !== expectedValues.length) {
      throw new Error(
        `Enum ${enumName} has ${actualValues.length} values; expected ${expectedValues.length}.`,
      );
    }
  }
}

async function main() {
  await client.connect();

  const tableResult = await client.query(`
    select
      table_schema,
      table_name
    from information_schema.tables
    where table_schema = 'public'
      and table_name = 'users';
  `);

  const columnsResult = await client.query(`
    select
      column_name,
      data_type,
      udt_name,
      is_nullable,
      column_default
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'users'
    order by ordinal_position;
  `);

  const enumsResult = await client.query(`
    select
      namespace.nspname as schema_name,
      type.typname as enum_name,
      enum.enumlabel as enum_value,
      enum.enumsortorder
    from pg_type type
    join pg_enum enum
      on type.oid = enum.enumtypid
    join pg_namespace namespace
      on namespace.oid = type.typnamespace
    where namespace.nspname = 'public'
      and type.typname in ('user_role', 'user_status')
    order by type.typname, enum.enumsortorder;
  `);

  console.log("\nUSERS TABLE");
  console.table(tableResult.rows);

  console.log("\nUSERS COLUMNS");
  console.table(columnsResult.rows);

  console.log("\nUSERS ENUMS");
  console.table(enumsResult.rows);

  if (tableResult.rowCount !== 1) {
    throw new Error("Expected public.users table was not found.");
  }

  validateColumns(columnsResult.rows);
  validateEnums(enumsResult.rows);

  console.log("\nResult: PASS");
}

main()
  .catch((error) => {
    console.error("\nResult: FAIL");
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await client.end().catch(() => undefined);
  });
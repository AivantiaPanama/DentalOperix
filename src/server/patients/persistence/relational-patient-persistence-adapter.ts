import { createPatientEntity } from "../domain/patient.entity";
import type { PatientIdentitySearch, PatientPersistencePort } from "../domain/patient-persistence-port";
import type { CreatePatientInput, Patient, PatientId, UpdatePatientInput } from "../domain/patient.types";
import { validateUpdatePatientInput } from "../domain/patient.validation";
import { normalizeIdentifier, normalizeName, normalizePhone } from "../domain/patient.value-objects";
import {
  RELATIONAL_PATIENT_ADDRESSES_TABLE_NAME,
  RELATIONAL_PATIENT_EMAILS_TABLE_NAME,
  RELATIONAL_PATIENT_IDENTIFIERS_TABLE_NAME,
  RELATIONAL_PATIENT_PHONES_TABLE_NAME,
  RELATIONAL_PATIENTS_TABLE_NAME,
} from "../relational-patients-schema";
import {
  mapPatientToRelationalPatientValues,
  mapRelationalPatientGraphToDomain,
  type RelationalPatientAddressRow,
  type RelationalPatientEmailRow,
  type RelationalPatientIdentifierRow,
  type RelationalPatientPhoneRow,
  type RelationalPatientRow,
} from "./patient-persistence-mappers";

export const RELATIONAL_PATIENT_PERSISTENCE_ADAPTER_VERSION = "71.5.3-RELATIONAL-PATIENT-PERSISTENCE-ADAPTER" as const;

export type PatientPersistenceQueryClient = {
  query<T = Record<string, unknown>>(text: string, values?: unknown[]): Promise<{ rows: T[]; rowCount: number | null }>;
};

type PgClient = PatientPersistenceQueryClient & { connect(): Promise<void>; end(): Promise<void> };
type PgClientConstructor = new (config: { connectionString: string; ssl?: { rejectUnauthorized: boolean } }) => PgClient;
export type PatientPersistenceClientFactory = () => Promise<PatientPersistenceQueryClient>;

export class PatientPersistenceNotFoundError extends Error {
  constructor(patientId: PatientId) {
    super(`Patient not found: ${patientId}`);
    this.name = "PatientPersistenceNotFoundError";
  }
}

function getDatabaseUrl(): string | undefined {
  return process.env.DATABASE_URL || process.env.POSTGRES_URL;
}

export async function createDefaultPatientPersistenceClient(): Promise<PgClient> {
  const databaseUrl = getDatabaseUrl();
  if (!databaseUrl) throw new Error("Patient persistence requires DATABASE_URL or POSTGRES_URL.");
  const pgModule = (await import("pg")) as unknown as { Client: PgClientConstructor };
  const client = new pgModule.Client({ connectionString: databaseUrl, ssl: { rejectUnauthorized: false } });
  await client.connect();
  return client;
}

const PATIENT_COLUMNS = `id, display_name, first_name, last_name, second_last_name, normalized_name, status, source,
  linked_lead_id, linked_appointment_id, requires_invoice, is_retired, has_insurance,
  created_by_user_id, created_by_role, created_via, updated_by_user_id, updated_by_role, updated_via, created_at, updated_at`;

function contactStatus(status: string): string {
  return status;
}

export class RelationalPatientPersistenceAdapter implements PatientPersistencePort {
  constructor(private readonly clientFactory: PatientPersistenceClientFactory = createDefaultPatientPersistenceClient) {}

  async createPatient(input: CreatePatientInput): Promise<Patient> {
    const patient = createPatientEntity(input);
    const client = await this.clientFactory();
    await client.query("BEGIN");
    try {
      await client.query(
        `INSERT INTO ${RELATIONAL_PATIENTS_TABLE_NAME}
          (id, display_name, first_name, last_name, second_last_name, normalized_name, status, source,
           linked_lead_id, linked_appointment_id, requires_invoice, is_retired, has_insurance,
           created_by_user_id, created_by_role, created_via, updated_by_user_id, updated_by_role, updated_via, created_at, updated_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21)`,
        mapPatientToRelationalPatientValues(patient),
      );

      for (const phone of patient.phones) {
        await client.query(
          `INSERT INTO ${RELATIONAL_PATIENT_PHONES_TABLE_NAME} (id, patient_id, phone, normalized_phone, label, is_primary, status, created_at, updated_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
          [phone.id, phone.patientId, phone.phone, phone.normalizedPhone, phone.label ?? null, phone.isPrimary, contactStatus(phone.status), phone.createdAt, phone.updatedAt],
        );
      }
      for (const email of patient.emails) {
        await client.query(
          `INSERT INTO ${RELATIONAL_PATIENT_EMAILS_TABLE_NAME} (id, patient_id, email, normalized_email, label, is_primary, status, created_at, updated_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
          [email.id, email.patientId, email.email, email.normalizedEmail, email.label ?? null, email.isPrimary, contactStatus(email.status), email.createdAt, email.updatedAt],
        );
      }
      for (const address of patient.addresses) {
        await client.query(
          `INSERT INTO ${RELATIONAL_PATIENT_ADDRESSES_TABLE_NAME} (id, patient_id, line1, line2, city, state, postal_code, country, label, is_primary, status, created_at, updated_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)`,
          [address.id, address.patientId, address.line1, address.line2 ?? null, address.city ?? null, address.state ?? null, address.postalCode ?? null, address.country ?? null, address.label ?? null, address.isPrimary, contactStatus(address.status), address.createdAt, address.updatedAt],
        );
      }
      for (const identifier of patient.identifiers) {
        await client.query(
          `INSERT INTO ${RELATIONAL_PATIENT_IDENTIFIERS_TABLE_NAME} (id, patient_id, type, value, normalized_value, issuing_authority, is_primary, status, created_at, updated_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
          [identifier.id, identifier.patientId, identifier.type, identifier.value, identifier.normalizedValue, identifier.issuingAuthority ?? null, identifier.isPrimary, contactStatus(identifier.status), identifier.createdAt, identifier.updatedAt],
        );
      }
      await client.query("COMMIT");
      return patient;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    }
  }

  async findPatientById(id: PatientId): Promise<Patient | null> {
    const client = await this.clientFactory();
    return this.loadPatientGraph(client, id);
  }

  async updatePatient(id: PatientId, input: UpdatePatientInput): Promise<Patient> {
    const update = validateUpdatePatientInput(input);
    const assignments: string[] = [];
    const values: unknown[] = [];
    const addAssignment = (column: string, value: unknown) => {
      values.push(value);
      assignments.push(`${column} = $${values.length}`);
    };

    if (update.displayName !== undefined) {
      addAssignment("display_name", update.displayName);
      addAssignment("normalized_name", normalizeName(update.displayName));
    }
    if (update.firstName !== undefined) addAssignment("first_name", update.firstName);
    if (update.lastName !== undefined) addAssignment("last_name", update.lastName);
    if (update.secondLastName !== undefined) addAssignment("second_last_name", update.secondLastName);
    if (update.status !== undefined) addAssignment("status", update.status);
    if (update.requiresInvoice !== undefined) addAssignment("requires_invoice", update.requiresInvoice);
    if (update.isRetired !== undefined) addAssignment("is_retired", update.isRetired);
    if (update.hasInsurance !== undefined) addAssignment("has_insurance", update.hasInsurance);
    if (update.actor) {
      addAssignment("updated_by_user_id", update.actor.userId ?? null);
      addAssignment("updated_by_role", update.actor.role ?? null);
      addAssignment("updated_via", update.actor.via);
    }

    assignments.push("updated_at = now()");
    values.push(id);
    const client = await this.clientFactory();
    const result = await client.query<RelationalPatientRow>(
      `UPDATE ${RELATIONAL_PATIENTS_TABLE_NAME} SET ${assignments.join(", ")} WHERE id = $${values.length} RETURNING ${PATIENT_COLUMNS}`,
      values,
    );
    if (!result.rows[0]) throw new PatientPersistenceNotFoundError(id);
    const patient = await this.loadPatientGraph(client, id);
    if (!patient) throw new PatientPersistenceNotFoundError(id);
    return patient;
  }

  async searchPatientsByIdentity(search: PatientIdentitySearch): Promise<Patient[]> {
    const clauses: string[] = [];
    const values: unknown[] = [];
    const addClause = (sql: string, value: unknown) => {
      values.push(value);
      clauses.push(sql.replace("?", `$${values.length}`));
    };

    if (search.normalizedName) addClause("p.normalized_name = ?", normalizeName(search.normalizedName));
    if (search.email) addClause("e.normalized_email = ?", search.email.trim().toLowerCase());
    if (search.phone) addClause("ph.normalized_phone = ?", normalizePhone(search.phone));
    if (search.identifierType && search.identifierValue) {
      addClause("i.type = ?", search.identifierType);
      addClause("i.normalized_value = ?", normalizeIdentifier(search.identifierValue));
    }
    if (!clauses.length) return [];

    const identityWhere = `(${clauses.join(" OR ")})`;
    let exclusionWhere = "";
    if (search.excludePatientId) {
      values.push(search.excludePatientId);
      exclusionWhere = ` AND p.id <> $${values.length}`;
    }

    const client = await this.clientFactory();
    const result = await client.query<{ id: string }>(
      `SELECT DISTINCT p.id
       FROM ${RELATIONAL_PATIENTS_TABLE_NAME} p
       LEFT JOIN ${RELATIONAL_PATIENT_EMAILS_TABLE_NAME} e ON e.patient_id = p.id AND e.status = 'active'
       LEFT JOIN ${RELATIONAL_PATIENT_PHONES_TABLE_NAME} ph ON ph.patient_id = p.id AND ph.status = 'active'
       LEFT JOIN ${RELATIONAL_PATIENT_IDENTIFIERS_TABLE_NAME} i ON i.patient_id = p.id AND i.status = 'active'
       WHERE ${identityWhere}${exclusionWhere}
       LIMIT 10`,
      values,
    );

    const patients = await Promise.all(result.rows.map((row) => this.loadPatientGraph(client, row.id)));
    return patients.filter((patient): patient is Patient => Boolean(patient));
  }

  private async loadPatientGraph(client: PatientPersistenceQueryClient, id: PatientId): Promise<Patient | null> {
    const patientResult = await client.query<RelationalPatientRow>(`SELECT ${PATIENT_COLUMNS} FROM ${RELATIONAL_PATIENTS_TABLE_NAME} WHERE id = $1 LIMIT 1`, [id]);
    const patient = patientResult.rows[0];
    if (!patient) return null;
    const [phones, emails, addresses, identifiers] = await Promise.all([
      client.query<RelationalPatientPhoneRow>(`SELECT * FROM ${RELATIONAL_PATIENT_PHONES_TABLE_NAME} WHERE patient_id = $1 ORDER BY is_primary DESC, created_at ASC`, [id]),
      client.query<RelationalPatientEmailRow>(`SELECT * FROM ${RELATIONAL_PATIENT_EMAILS_TABLE_NAME} WHERE patient_id = $1 ORDER BY is_primary DESC, created_at ASC`, [id]),
      client.query<RelationalPatientAddressRow>(`SELECT * FROM ${RELATIONAL_PATIENT_ADDRESSES_TABLE_NAME} WHERE patient_id = $1 ORDER BY is_primary DESC, created_at ASC`, [id]),
      client.query<RelationalPatientIdentifierRow>(`SELECT * FROM ${RELATIONAL_PATIENT_IDENTIFIERS_TABLE_NAME} WHERE patient_id = $1 ORDER BY is_primary DESC, created_at ASC`, [id]),
    ]);
    return mapRelationalPatientGraphToDomain({ patient, phones: phones.rows, emails: emails.rows, addresses: addresses.rows, identifiers: identifiers.rows });
  }
}

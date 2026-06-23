import {
  createPatientEntity,
  normalizeIdentifier,
  normalizeName,
  normalizePhone,
  validateUpdatePatientInput,
  type CreatePatientInput,
  type Patient,
  type PatientContactPointStatus,
  type PatientCreationSource,
  type PatientIdentifierType,
  type PatientStatus,
  type UpdatePatientInput,
} from "./patient-domain";
import {
  RELATIONAL_PATIENT_ADDRESSES_TABLE_NAME,
  RELATIONAL_PATIENT_EMAILS_TABLE_NAME,
  RELATIONAL_PATIENT_IDENTIFIERS_TABLE_NAME,
  RELATIONAL_PATIENT_PHONES_TABLE_NAME,
  RELATIONAL_PATIENTS_TABLE_NAME,
} from "./relational-patients-schema";
import { PatientNotFoundError, type PatientIdentitySearch, type PatientRepository } from "./patient-repository";

export type PatientPersistenceClient = {
  query<T = Record<string, unknown>>(text: string, values?: unknown[]): Promise<{ rows: T[]; rowCount: number | null }>;
};

type PgClient = PatientPersistenceClient & { connect(): Promise<void>; end(): Promise<void> };
type PgClientConstructor = new (config: { connectionString: string; ssl?: { rejectUnauthorized: boolean } }) => PgClient;

type PatientRow = {
  id: string;
  display_name: string;
  first_name: string | null;
  last_name: string | null;
  second_last_name: string | null;
  normalized_name: string;
  status: PatientStatus;
  source: PatientCreationSource;
  linked_lead_id: string | null;
  linked_appointment_id: string | null;
  requires_invoice: boolean;
  is_retired: boolean;
  has_insurance: boolean;
  created_by_user_id: string | null;
  created_by_role: Patient["createdByRole"] | null;
  created_via: PatientCreationSource;
  updated_by_user_id: string | null;
  updated_by_role: Patient["updatedByRole"] | null;
  updated_via: PatientCreationSource | null;
  created_at: string | Date;
  updated_at: string | Date;
};

type PhoneRow = {
  id: string; patient_id: string; phone: string; normalized_phone: string; label: string | null; is_primary: boolean; status: PatientContactPointStatus; created_at: string | Date; updated_at: string | Date;
};
type EmailRow = {
  id: string; patient_id: string; email: string; normalized_email: string; label: string | null; is_primary: boolean; status: PatientContactPointStatus; created_at: string | Date; updated_at: string | Date;
};
type AddressRow = {
  id: string; patient_id: string; line1: string; line2: string | null; city: string | null; state: string | null; postal_code: string | null; country: string | null; label: string | null; is_primary: boolean; status: PatientContactPointStatus; created_at: string | Date; updated_at: string | Date;
};
type IdentifierRow = {
  id: string; patient_id: string; type: PatientIdentifierType; value: string; normalized_value: string; issuing_authority: string | null; is_primary: boolean; status: PatientContactPointStatus; created_at: string | Date; updated_at: string | Date;
};

type PatientGraphRows = {
  patient: PatientRow;
  phones: PhoneRow[];
  emails: EmailRow[];
  addresses: AddressRow[];
  identifiers: IdentifierRow[];
};

function getDatabaseUrl() {
  return process.env.DATABASE_URL || process.env.POSTGRES_URL;
}

async function createPgClient(): Promise<PgClient> {
  const databaseUrl = getDatabaseUrl();
  if (!databaseUrl) throw new Error("Patient persistence requires DATABASE_URL or POSTGRES_URL.");
  const pgModule = (await import("pg")) as unknown as { Client: PgClientConstructor };
  return new pgModule.Client({ connectionString: databaseUrl, ssl: { rejectUnauthorized: false } });
}

function toIsoString(value: string | Date): string {
  return value instanceof Date ? value.toISOString() : value.toString();
}

function graphToPatient(graph: PatientGraphRows): Patient {
  const row = graph.patient;
  return {
    id: row.id,
    displayName: row.display_name,
    firstName: row.first_name ?? undefined,
    lastName: row.last_name ?? undefined,
    secondLastName: row.second_last_name ?? undefined,
    normalizedName: row.normalized_name,
    status: row.status,
    source: row.source,
    linkedLeadId: row.linked_lead_id ?? undefined,
    linkedAppointmentId: row.linked_appointment_id ?? undefined,
    requiresInvoice: row.requires_invoice,
    isRetired: row.is_retired,
    hasInsurance: row.has_insurance,
    createdByUserId: row.created_by_user_id ?? undefined,
    createdByRole: row.created_by_role ?? undefined,
    createdVia: row.created_via,
    updatedByUserId: row.updated_by_user_id ?? undefined,
    updatedByRole: row.updated_by_role ?? undefined,
    updatedVia: row.updated_via ?? undefined,
    createdAt: toIsoString(row.created_at),
    updatedAt: toIsoString(row.updated_at),
    phones: graph.phones.map((phone) => ({
      id: phone.id, patientId: phone.patient_id, phone: phone.phone, normalizedPhone: phone.normalized_phone,
      label: phone.label ?? undefined, isPrimary: phone.is_primary, status: phone.status,
      createdAt: toIsoString(phone.created_at), updatedAt: toIsoString(phone.updated_at),
    })),
    emails: graph.emails.map((email) => ({
      id: email.id, patientId: email.patient_id, email: email.email, normalizedEmail: email.normalized_email,
      label: email.label ?? undefined, isPrimary: email.is_primary, status: email.status,
      createdAt: toIsoString(email.created_at), updatedAt: toIsoString(email.updated_at),
    })),
    addresses: graph.addresses.map((address) => ({
      id: address.id, patientId: address.patient_id, line1: address.line1, line2: address.line2 ?? undefined,
      city: address.city ?? undefined, state: address.state ?? undefined, postalCode: address.postal_code ?? undefined,
      country: address.country ?? undefined, label: address.label ?? undefined, isPrimary: address.is_primary, status: address.status,
      createdAt: toIsoString(address.created_at), updatedAt: toIsoString(address.updated_at),
    })),
    identifiers: graph.identifiers.map((identifier) => ({
      id: identifier.id, patientId: identifier.patient_id, type: identifier.type, value: identifier.value,
      normalizedValue: identifier.normalized_value, issuingAuthority: identifier.issuing_authority ?? undefined,
      isPrimary: identifier.is_primary, status: identifier.status,
      createdAt: toIsoString(identifier.created_at), updatedAt: toIsoString(identifier.updated_at),
    })),
  };
}

const PATIENT_COLUMNS = `id, display_name, first_name, last_name, second_last_name, normalized_name, status, source,
  linked_lead_id, linked_appointment_id, requires_invoice, is_retired, has_insurance,
  created_by_user_id, created_by_role, created_via, updated_by_user_id, updated_by_role, updated_via, created_at, updated_at`;

export class RelationalPatientRepository implements PatientRepository {
  constructor(private readonly clientFactory: () => Promise<PatientPersistenceClient> = createPgClient) {}

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
        [patient.id, patient.displayName, patient.firstName, patient.lastName, patient.secondLastName, patient.normalizedName,
          patient.status, patient.source, patient.linkedLeadId, patient.linkedAppointmentId, patient.requiresInvoice,
          patient.isRetired, patient.hasInsurance, patient.createdByUserId, patient.createdByRole, patient.createdVia,
          patient.updatedByUserId, patient.updatedByRole, patient.updatedVia, patient.createdAt, patient.updatedAt],
      );

      for (const phone of patient.phones) {
        await client.query(
          `INSERT INTO ${RELATIONAL_PATIENT_PHONES_TABLE_NAME} (id, patient_id, phone, normalized_phone, label, is_primary, status, created_at, updated_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
          [phone.id, phone.patientId, phone.phone, phone.normalizedPhone, phone.label, phone.isPrimary, phone.status, phone.createdAt, phone.updatedAt],
        );
      }
      for (const email of patient.emails) {
        await client.query(
          `INSERT INTO ${RELATIONAL_PATIENT_EMAILS_TABLE_NAME} (id, patient_id, email, normalized_email, label, is_primary, status, created_at, updated_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
          [email.id, email.patientId, email.email, email.normalizedEmail, email.label, email.isPrimary, email.status, email.createdAt, email.updatedAt],
        );
      }
      for (const address of patient.addresses) {
        await client.query(
          `INSERT INTO ${RELATIONAL_PATIENT_ADDRESSES_TABLE_NAME} (id, patient_id, line1, line2, city, state, postal_code, country, label, is_primary, status, created_at, updated_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)`,
          [address.id, address.patientId, address.line1, address.line2, address.city, address.state, address.postalCode, address.country, address.label, address.isPrimary, address.status, address.createdAt, address.updatedAt],
        );
      }
      for (const identifier of patient.identifiers) {
        await client.query(
          `INSERT INTO ${RELATIONAL_PATIENT_IDENTIFIERS_TABLE_NAME} (id, patient_id, type, value, normalized_value, issuing_authority, is_primary, status, created_at, updated_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
          [identifier.id, identifier.patientId, identifier.type, identifier.value, identifier.normalizedValue, identifier.issuingAuthority, identifier.isPrimary, identifier.status, identifier.createdAt, identifier.updatedAt],
        );
      }
      await client.query("COMMIT");
      return patient;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    }
  }

  async findPatientById(id: string): Promise<Patient | null> {
    const client = await this.clientFactory();
    return this.loadPatientGraph(client, id);
  }

  async updatePatient(id: string, input: UpdatePatientInput): Promise<Patient> {
    const update = validateUpdatePatientInput(input);
    const assignments: string[] = [];
    const values: unknown[] = [];
    const addAssignment = (column: string, value: unknown) => { values.push(value); assignments.push(`${column} = $${values.length}`); };

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
      addAssignment("updated_by_user_id", update.actor.userId);
      addAssignment("updated_by_role", update.actor.role);
      addAssignment("updated_via", update.actor.via);
    }

    assignments.push("updated_at = now()");
    values.push(id);
    const client = await this.clientFactory();
    const result = await client.query<PatientRow>(
      `UPDATE ${RELATIONAL_PATIENTS_TABLE_NAME} SET ${assignments.join(", ")} WHERE id = $${values.length} RETURNING ${PATIENT_COLUMNS}`,
      values,
    );
    if (!result.rows[0]) throw new PatientNotFoundError(id);
    const patient = await this.loadPatientGraph(client, id);
    if (!patient) throw new PatientNotFoundError(id);
    return patient;
  }

  async searchPatientsByIdentity(search: PatientIdentitySearch): Promise<Patient[]> {
    const clauses: string[] = [];
    const values: unknown[] = [];
    const addClause = (sql: string, value: unknown) => { values.push(value); clauses.push(sql.replace("?", `$${values.length}`)); };

    if (search.normalizedName) addClause("p.normalized_name = ?", search.normalizedName);
    if (search.email) addClause("e.normalized_email = ?", search.email.trim().toLowerCase());
    if (search.phone) addClause("ph.normalized_phone = ?", normalizePhone(search.phone));
    if (search.identifierType && search.identifierValue) {
      addClause("i.type = ?", search.identifierType);
      addClause("i.normalized_value = ?", normalizeIdentifier(search.identifierValue));
    }
    if (!clauses.length) return [];
    const identityWhere = `(${clauses.join(" OR ")})`;
    if (search.excludePatientId) {
      values.push(search.excludePatientId);
      clauses.push(`p.id <> $${values.length}`);
    }

    const client = await this.clientFactory();
    const result = await client.query<{ id: string }>(
      `SELECT DISTINCT p.id
       FROM ${RELATIONAL_PATIENTS_TABLE_NAME} p
       LEFT JOIN ${RELATIONAL_PATIENT_EMAILS_TABLE_NAME} e ON e.patient_id = p.id AND e.status = 'active'
       LEFT JOIN ${RELATIONAL_PATIENT_PHONES_TABLE_NAME} ph ON ph.patient_id = p.id AND ph.status = 'active'
       LEFT JOIN ${RELATIONAL_PATIENT_IDENTIFIERS_TABLE_NAME} i ON i.patient_id = p.id AND i.status = 'active'
       WHERE ${search.excludePatientId ? `${identityWhere} AND p.id <> $${values.length}` : identityWhere}
       LIMIT 10`,
      values,
    );

    const patients = await Promise.all(result.rows.map((row) => this.loadPatientGraph(client, row.id)));
    return patients.filter((patient): patient is Patient => Boolean(patient));
  }

  private async loadPatientGraph(client: PatientPersistenceClient, id: string): Promise<Patient | null> {
    const patientResult = await client.query<PatientRow>(`SELECT ${PATIENT_COLUMNS} FROM ${RELATIONAL_PATIENTS_TABLE_NAME} WHERE id = $1 LIMIT 1`, [id]);
    const patient = patientResult.rows[0];
    if (!patient) return null;
    const [phones, emails, addresses, identifiers] = await Promise.all([
      client.query<PhoneRow>(`SELECT * FROM ${RELATIONAL_PATIENT_PHONES_TABLE_NAME} WHERE patient_id = $1 ORDER BY is_primary DESC, created_at ASC`, [id]),
      client.query<EmailRow>(`SELECT * FROM ${RELATIONAL_PATIENT_EMAILS_TABLE_NAME} WHERE patient_id = $1 ORDER BY is_primary DESC, created_at ASC`, [id]),
      client.query<AddressRow>(`SELECT * FROM ${RELATIONAL_PATIENT_ADDRESSES_TABLE_NAME} WHERE patient_id = $1 ORDER BY is_primary DESC, created_at ASC`, [id]),
      client.query<IdentifierRow>(`SELECT * FROM ${RELATIONAL_PATIENT_IDENTIFIERS_TABLE_NAME} WHERE patient_id = $1 ORDER BY is_primary DESC, created_at ASC`, [id]),
    ]);
    return graphToPatient({ patient, phones: phones.rows, emails: emails.rows, addresses: addresses.rows, identifiers: identifiers.rows });
  }
}

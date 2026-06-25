import { createClinicalRecordAggregate } from "../domain/clinical-record.entity";
import type { ClinicalRecordPersistencePort } from "../domain/clinical-record-persistence-port";
import type { ClinicalRecord, ClinicalRecordId, ClinicalRecordPatientId, CreateClinicalRecordInput } from "../domain/clinical-record.types";
import {
  RELATIONAL_CLINICAL_RECORD_EVENTS_TABLE_NAME,
  RELATIONAL_CLINICAL_RECORDS_TABLE_NAME,
} from "../relational-clinical-records-schema";
import {
  mapClinicalRecordEventToRelationalValues,
  mapClinicalRecordToRelationalValues,
  mapRelationalClinicalRecordGraphToDomain,
  type RelationalClinicalRecordDomainEventRow,
  type RelationalClinicalRecordRow,
} from "./clinical-record-persistence-mappers";

export const RELATIONAL_CLINICAL_RECORD_PERSISTENCE_ADAPTER_VERSION = "75.0-WP-01-RELATIONAL-CLINICAL-RECORD-PERSISTENCE-ADAPTER" as const;

export type ClinicalRecordPersistenceQueryClient = {
  query<T = Record<string, unknown>>(text: string, values?: unknown[]): Promise<{ rows: T[]; rowCount: number | null }>;
};

type PgClient = ClinicalRecordPersistenceQueryClient & { connect(): Promise<void>; end(): Promise<void> };
type PgClientConstructor = new (config: { connectionString: string; ssl?: { rejectUnauthorized: boolean } }) => PgClient;
export type ClinicalRecordPersistenceClientFactory = () => Promise<ClinicalRecordPersistenceQueryClient>;

export class ClinicalRecordPersistenceNotFoundError extends Error {
  constructor(clinicalRecordId: ClinicalRecordId) {
    super(`Clinical record not found: ${clinicalRecordId}`);
    this.name = "ClinicalRecordPersistenceNotFoundError";
  }
}

function getDatabaseUrl(): string | undefined {
  return process.env.DATABASE_URL || process.env.POSTGRES_URL;
}

export async function createDefaultClinicalRecordPersistenceClient(): Promise<PgClient> {
  const databaseUrl = getDatabaseUrl();
  if (!databaseUrl) throw new Error("Clinical record persistence requires DATABASE_URL or POSTGRES_URL.");
  const pgModule = (await import("pg")) as unknown as { Client: PgClientConstructor };
  const client = new pgModule.Client({ connectionString: databaseUrl, ssl: { rejectUnauthorized: false } });
  await client.connect();
  return client;
}

const CLINICAL_RECORD_COLUMNS = "id, patient_id, status, created_by_user_id, created_by_role, created_via, created_at, updated_at";

export class RelationalClinicalRecordPersistenceAdapter implements ClinicalRecordPersistencePort {
  constructor(private readonly clientFactory: ClinicalRecordPersistenceClientFactory = createDefaultClinicalRecordPersistenceClient) {}

  async createClinicalRecord(input: CreateClinicalRecordInput): Promise<ClinicalRecord> {
    const record = createClinicalRecordAggregate(input);
    const client = await this.clientFactory();
    await client.query("BEGIN");
    try {
      await client.query(
        `INSERT INTO ${RELATIONAL_CLINICAL_RECORDS_TABLE_NAME}
          (id, patient_id, status, created_by_user_id, created_by_role, created_via, created_at, updated_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
        mapClinicalRecordToRelationalValues(record),
      );
      for (const event of record.domainEvents) {
        await client.query(
          `INSERT INTO ${RELATIONAL_CLINICAL_RECORD_EVENTS_TABLE_NAME}
            (id, clinical_record_id, patient_id, type, occurred_at)
           VALUES ($1,$2,$3,$4,$5)`,
          mapClinicalRecordEventToRelationalValues(event),
        );
      }
      await client.query("COMMIT");
      return record;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    }
  }

  async findClinicalRecordById(id: ClinicalRecordId): Promise<ClinicalRecord | null> {
    const client = await this.clientFactory();
    return this.loadClinicalRecordGraph(client, "id", id);
  }

  async findClinicalRecordByPatientId(patientId: ClinicalRecordPatientId): Promise<ClinicalRecord | null> {
    const client = await this.clientFactory();
    return this.loadClinicalRecordGraph(client, "patient_id", patientId);
  }

  private async loadClinicalRecordGraph(
    client: ClinicalRecordPersistenceQueryClient,
    column: "id" | "patient_id",
    value: string,
  ): Promise<ClinicalRecord | null> {
    const recordResult = await client.query<RelationalClinicalRecordRow>(
      `SELECT ${CLINICAL_RECORD_COLUMNS} FROM ${RELATIONAL_CLINICAL_RECORDS_TABLE_NAME} WHERE ${column} = $1 ORDER BY created_at DESC LIMIT 1`,
      [value],
    );
    const record = recordResult.rows[0];
    if (!record) return null;
    const events = await client.query<RelationalClinicalRecordDomainEventRow>(
      `SELECT * FROM ${RELATIONAL_CLINICAL_RECORD_EVENTS_TABLE_NAME} WHERE clinical_record_id = $1 ORDER BY occurred_at ASC`,
      [record.id],
    );
    return mapRelationalClinicalRecordGraphToDomain({ record, events: events.rows });
  }
}

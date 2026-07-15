import type { ClinicalNote, ClinicalNoteId } from "../domain/clinical-note.types";
import type { ClinicalRecordId, ClinicalRecordPatientId } from "../domain/clinical-record.types";
import type { ClinicalNoteRepositoryPort } from "../application/ports/clinical-note-repository-port";
import { RELATIONAL_CLINICAL_NOTES_TABLE_NAME } from "../relational-clinical-records-schema";
import {
  mapClinicalNoteToRelationalValues,
  mapRelationalClinicalNoteToDomain,
  type RelationalClinicalNoteRow,
} from "./clinical-note-persistence-mappers";
import {
  createDefaultClinicalRecordPersistenceClient,
  type ClinicalRecordPersistenceClientFactory,
  type ClinicalRecordPersistenceQueryClient,
} from "./relational-clinical-record-persistence-adapter";

export const RELATIONAL_CLINICAL_NOTE_REPOSITORY_ADAPTER_VERSION =
  "75.0-WP-02-I1-M4-RELATIONAL-CLINICAL-NOTE-REPOSITORY-ADAPTER" as const;

const CLINICAL_NOTE_COLUMNS = [
  "id",
  "clinical_record_id",
  "patient_id",
  "appointment_id",
  "title",
  "narrative",
  "status",
  "created_at",
  "updated_at",
  "created_by_healthcare_professional_id",
  "updated_by_healthcare_professional_id",
  "completed_at",
  "completed_by_healthcare_professional_id",
  "reopened_at",
  "reopened_by_healthcare_professional_id",
  "archived_at",
  "archived_by_healthcare_professional_id",
  "source",
].join(", ");

export class RelationalClinicalNoteRepositoryAdapter implements ClinicalNoteRepositoryPort {
  constructor(
    private readonly clientFactory: ClinicalRecordPersistenceClientFactory = createDefaultClinicalRecordPersistenceClient,
  ) {}

  async saveClinicalNote(note: ClinicalNote): Promise<ClinicalNote> {
    const client = await this.clientFactory();
    await client.query(
      `INSERT INTO ${RELATIONAL_CLINICAL_NOTES_TABLE_NAME}
        (id, clinical_record_id, patient_id, appointment_id, title, narrative, status, created_at, updated_at,
         created_by_healthcare_professional_id, updated_by_healthcare_professional_id, completed_at,
         completed_by_healthcare_professional_id, reopened_at, reopened_by_healthcare_professional_id,
         archived_at, archived_by_healthcare_professional_id, source)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)`,
      mapClinicalNoteToRelationalValues(note),
    );
    return note;
  }

  async findClinicalNoteById(id: ClinicalNoteId): Promise<ClinicalNote | null> {
    const client = await this.clientFactory();
    return this.loadClinicalNote(client, id);
  }

  async findClinicalNotesByClinicalRecordId(
    clinicalRecordId: ClinicalRecordId,
  ): Promise<ClinicalNote[]> {
    const client = await this.clientFactory();
    return this.loadClinicalNotesByColumn(client, "clinical_record_id", clinicalRecordId);
  }

  async findClinicalNotesByPatientId(patientId: ClinicalRecordPatientId): Promise<ClinicalNote[]> {
    const client = await this.clientFactory();
    return this.loadClinicalNotesByColumn(client, "patient_id", patientId);
  }

  async updateClinicalNote(note: ClinicalNote): Promise<ClinicalNote> {
    const client = await this.clientFactory();
    await client.query(
      `UPDATE ${RELATIONAL_CLINICAL_NOTES_TABLE_NAME}
          SET appointment_id = $4,
              title = $5,
              narrative = $6,
              status = $7,
              created_at = $8,
              updated_at = $9,
              created_by_healthcare_professional_id = $10,
              updated_by_healthcare_professional_id = $11,
              completed_at = $12,
              completed_by_healthcare_professional_id = $13,
              reopened_at = $14,
              reopened_by_healthcare_professional_id = $15,
              archived_at = $16,
              archived_by_healthcare_professional_id = $17,
              source = $18
        WHERE id = $1 AND clinical_record_id = $2 AND patient_id = $3`,
      mapClinicalNoteToRelationalValues(note),
    );
    return note;
  }

  private async loadClinicalNotesByColumn(
    client: ClinicalRecordPersistenceQueryClient,
    column: "clinical_record_id" | "patient_id",
    value: string,
  ): Promise<ClinicalNote[]> {
    const result = await client.query<RelationalClinicalNoteRow>(
      `SELECT ${CLINICAL_NOTE_COLUMNS}
         FROM ${RELATIONAL_CLINICAL_NOTES_TABLE_NAME}
        WHERE ${column} = $1
        ORDER BY created_at DESC`,
      [value],
    );
    return result.rows.map(mapRelationalClinicalNoteToDomain);
  }

  private async loadClinicalNote(
    client: ClinicalRecordPersistenceQueryClient,
    id: ClinicalNoteId,
  ): Promise<ClinicalNote | null> {
    const result = await client.query<RelationalClinicalNoteRow>(
      `SELECT ${CLINICAL_NOTE_COLUMNS}
         FROM ${RELATIONAL_CLINICAL_NOTES_TABLE_NAME}
        WHERE id = $1
        LIMIT 1`,
      [id],
    );
    const row = result.rows[0];
    return row ? mapRelationalClinicalNoteToDomain(row) : null;
  }
}

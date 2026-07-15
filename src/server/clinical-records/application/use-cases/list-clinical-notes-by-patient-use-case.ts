import type { ListClinicalNotesByPatientCommand } from "../commands/list-clinical-notes-by-patient-command";
import { toClinicalNoteApplicationDto } from "../dto/clinical-note-application-dto";
import type { ListClinicalNotesByPatientResult } from "../dto/clinical-note-application-results";
import type { ClinicalNoteRepositoryPort } from "../ports/clinical-note-repository-port";

export type ListClinicalNotesByPatientUseCaseDependencies = {
  clinicalNoteRepositoryPort: ClinicalNoteRepositoryPort;
};

export class ListClinicalNotesByPatientUseCase {
  constructor(private readonly dependencies: ListClinicalNotesByPatientUseCaseDependencies) {}

  async execute(
    command: ListClinicalNotesByPatientCommand,
  ): Promise<ListClinicalNotesByPatientResult> {
    const clinicalNotes =
      await this.dependencies.clinicalNoteRepositoryPort.findClinicalNotesByPatientId(
        command.patientId,
      );

    return { clinicalNotes: clinicalNotes.map(toClinicalNoteApplicationDto) };
  }
}

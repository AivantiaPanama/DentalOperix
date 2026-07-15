import { ClinicalNoteNotFoundError } from "../../domain/clinical-record.errors";
import type { GetClinicalNoteCommand } from "../commands/get-clinical-note-command";
import { toClinicalNoteApplicationDto } from "../dto/clinical-note-application-dto";
import type { GetClinicalNoteResult } from "../dto/clinical-note-application-results";
import type { ClinicalNoteRepositoryPort } from "../ports/clinical-note-repository-port";

export type GetClinicalNoteUseCaseDependencies = {
  clinicalNoteRepositoryPort: ClinicalNoteRepositoryPort;
};

export class GetClinicalNoteUseCase {
  constructor(private readonly dependencies: GetClinicalNoteUseCaseDependencies) {}

  async execute(command: GetClinicalNoteCommand): Promise<GetClinicalNoteResult> {
    const clinicalNote = await this.dependencies.clinicalNoteRepositoryPort.findClinicalNoteById(
      command.clinicalNoteId,
    );
    if (!clinicalNote || (command.patientId && clinicalNote.patientId !== command.patientId)) {
      throw new ClinicalNoteNotFoundError(command.clinicalNoteId);
    }

    return { clinicalNote: toClinicalNoteApplicationDto(clinicalNote) };
  }
}

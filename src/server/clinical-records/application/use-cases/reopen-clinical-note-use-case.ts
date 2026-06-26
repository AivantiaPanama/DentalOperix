import { ClinicalNoteNotFoundError } from "../../domain/clinical-record.errors";
import { ClinicalNoteDomainService } from "../../domain/clinical-note-domain-service";
import type { ReopenClinicalNoteCommand } from "../commands/reopen-clinical-note-command";
import { toClinicalNoteApplicationDto } from "../dto/clinical-note-application-dto";
import type { ReopenClinicalNoteResult } from "../dto/clinical-note-application-results";
import type { ClinicalNoteRepositoryPort } from "../ports/clinical-note-repository-port";

export type ReopenClinicalNoteUseCaseDependencies = {
  clinicalNoteRepositoryPort: ClinicalNoteRepositoryPort;
};

export class ReopenClinicalNoteUseCase {
  constructor(private readonly dependencies: ReopenClinicalNoteUseCaseDependencies) {}

  async execute(command: ReopenClinicalNoteCommand): Promise<ReopenClinicalNoteResult> {
    const clinicalNote = await this.dependencies.clinicalNoteRepositoryPort.findClinicalNoteById(command.clinicalNoteId);
    if (!clinicalNote || (command.patientId && clinicalNote.patientId !== command.patientId)) {
      throw new ClinicalNoteNotFoundError(command.clinicalNoteId);
    }

    const reopenedClinicalNote = ClinicalNoteDomainService.reopenClinicalNote(
      clinicalNote,
      { healthcareProfessionalId: command.healthcareProfessionalId, reason: command.reason },
      { now: command.now },
    );
    const savedClinicalNote = await this.dependencies.clinicalNoteRepositoryPort.updateClinicalNote(reopenedClinicalNote);

    return { clinicalNote: toClinicalNoteApplicationDto(savedClinicalNote) };
  }
}

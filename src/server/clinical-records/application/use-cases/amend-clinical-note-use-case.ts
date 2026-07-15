import { ClinicalNoteNotFoundError } from "../../domain/clinical-record.errors";
import { ClinicalNoteDomainService } from "../../domain/clinical-note-domain-service";
import type { AmendClinicalNoteCommand } from "../commands/amend-clinical-note-command";
import { toClinicalNoteApplicationDto } from "../dto/clinical-note-application-dto";
import type { AmendClinicalNoteResult } from "../dto/clinical-note-application-results";
import type { ClinicalNoteRepositoryPort } from "../ports/clinical-note-repository-port";

export type AmendClinicalNoteUseCaseDependencies = {
  clinicalNoteRepositoryPort: ClinicalNoteRepositoryPort;
};

export class AmendClinicalNoteUseCase {
  constructor(private readonly dependencies: AmendClinicalNoteUseCaseDependencies) {}

  async execute(command: AmendClinicalNoteCommand): Promise<AmendClinicalNoteResult> {
    const clinicalNote = await this.dependencies.clinicalNoteRepositoryPort.findClinicalNoteById(
      command.clinicalNoteId,
    );
    if (!clinicalNote || (command.patientId && clinicalNote.patientId !== command.patientId)) {
      throw new ClinicalNoteNotFoundError(command.clinicalNoteId);
    }

    const amendedClinicalNote = ClinicalNoteDomainService.amendClinicalNote(
      clinicalNote,
      {
        healthcareProfessionalId: command.healthcareProfessionalId,
        title: command.title,
        narrative: command.narrative,
      },
      { now: command.now },
    );
    const savedClinicalNote =
      await this.dependencies.clinicalNoteRepositoryPort.updateClinicalNote(amendedClinicalNote);

    return { clinicalNote: toClinicalNoteApplicationDto(savedClinicalNote) };
  }
}

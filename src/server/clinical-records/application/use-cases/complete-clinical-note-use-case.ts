import { ClinicalNoteNotFoundError } from "../../domain/clinical-record.errors";
import { ClinicalNoteDomainService } from "../../domain/clinical-note-domain-service";
import type { CompleteClinicalNoteCommand } from "../commands/complete-clinical-note-command";
import { toClinicalNoteApplicationDto } from "../dto/clinical-note-application-dto";
import type { CompleteClinicalNoteResult } from "../dto/clinical-note-application-results";
import type { ClinicalNoteRepositoryPort } from "../ports/clinical-note-repository-port";

export type CompleteClinicalNoteUseCaseDependencies = {
  clinicalNoteRepositoryPort: ClinicalNoteRepositoryPort;
};

export class CompleteClinicalNoteUseCase {
  constructor(private readonly dependencies: CompleteClinicalNoteUseCaseDependencies) {}

  async execute(command: CompleteClinicalNoteCommand): Promise<CompleteClinicalNoteResult> {
    const clinicalNote = await this.dependencies.clinicalNoteRepositoryPort.findClinicalNoteById(
      command.clinicalNoteId,
    );
    if (!clinicalNote || (command.patientId && clinicalNote.patientId !== command.patientId)) {
      throw new ClinicalNoteNotFoundError(command.clinicalNoteId);
    }

    const completedClinicalNote = ClinicalNoteDomainService.completeClinicalNote(
      clinicalNote,
      { healthcareProfessionalId: command.healthcareProfessionalId, reason: command.reason },
      { now: command.now },
    );
    const savedClinicalNote =
      await this.dependencies.clinicalNoteRepositoryPort.updateClinicalNote(completedClinicalNote);

    return { clinicalNote: toClinicalNoteApplicationDto(savedClinicalNote) };
  }
}

import { ClinicalNoteNotFoundError } from "../../domain/clinical-record.errors";
import { ClinicalNoteDomainService } from "../../domain/clinical-note-domain-service";
import type { ArchiveClinicalNoteCommand } from "../commands/archive-clinical-note-command";
import { toClinicalNoteApplicationDto } from "../dto/clinical-note-application-dto";
import type { ArchiveClinicalNoteResult } from "../dto/clinical-note-application-results";
import type { ClinicalNoteRepositoryPort } from "../ports/clinical-note-repository-port";

export type ArchiveClinicalNoteUseCaseDependencies = {
  clinicalNoteRepositoryPort: ClinicalNoteRepositoryPort;
};

export class ArchiveClinicalNoteUseCase {
  constructor(private readonly dependencies: ArchiveClinicalNoteUseCaseDependencies) {}

  async execute(command: ArchiveClinicalNoteCommand): Promise<ArchiveClinicalNoteResult> {
    const clinicalNote = await this.dependencies.clinicalNoteRepositoryPort.findClinicalNoteById(command.clinicalNoteId);
    if (!clinicalNote || (command.patientId && clinicalNote.patientId !== command.patientId)) {
      throw new ClinicalNoteNotFoundError(command.clinicalNoteId);
    }

    const archivedClinicalNote = ClinicalNoteDomainService.archiveClinicalNote(
      clinicalNote,
      { healthcareProfessionalId: command.healthcareProfessionalId, reason: command.reason },
      { now: command.now },
    );
    const savedClinicalNote = await this.dependencies.clinicalNoteRepositoryPort.updateClinicalNote(archivedClinicalNote);

    return { clinicalNote: toClinicalNoteApplicationDto(savedClinicalNote) };
  }
}

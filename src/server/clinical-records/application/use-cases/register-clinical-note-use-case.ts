import { ClinicalNoteDomainService } from "../../domain/clinical-note-domain-service";
import type { RegisterClinicalNoteCommand } from "../commands/register-clinical-note-command";
import { toClinicalNoteApplicationDto } from "../dto/clinical-note-application-dto";
import type { RegisterClinicalNoteResult } from "../dto/clinical-note-application-results";
import type { ClinicalNoteRepositoryPort } from "../ports/clinical-note-repository-port";

export type RegisterClinicalNoteUseCaseDependencies = {
  clinicalNoteRepositoryPort: ClinicalNoteRepositoryPort;
};

export class RegisterClinicalNoteUseCase {
  constructor(private readonly dependencies: RegisterClinicalNoteUseCaseDependencies) {}

  async execute(command: RegisterClinicalNoteCommand): Promise<RegisterClinicalNoteResult> {
    const { now, ...input } = command;
    const clinicalNote = ClinicalNoteDomainService.registerClinicalNote(input, { now });
    const savedClinicalNote = await this.dependencies.clinicalNoteRepositoryPort.saveClinicalNote(clinicalNote);

    return { clinicalNote: toClinicalNoteApplicationDto(savedClinicalNote) };
  }
}

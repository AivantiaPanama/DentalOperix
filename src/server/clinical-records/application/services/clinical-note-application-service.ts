import type {
  AmendClinicalNoteCommand,
  ArchiveClinicalNoteCommand,
  CompleteClinicalNoteCommand,
  GetClinicalNoteCommand,
  ListClinicalNotesByPatientCommand,
  RegisterClinicalNoteCommand,
  ReopenClinicalNoteCommand,
} from "../commands";
import type {
  AmendClinicalNoteResult,
  ArchiveClinicalNoteResult,
  CompleteClinicalNoteResult,
  GetClinicalNoteResult,
  ListClinicalNotesByPatientResult,
  RegisterClinicalNoteResult,
  ReopenClinicalNoteResult,
} from "../dto";
import type { ClinicalNoteRepositoryPort } from "../ports/clinical-note-repository-port";
import { AmendClinicalNoteUseCase } from "../use-cases/amend-clinical-note-use-case";
import { ArchiveClinicalNoteUseCase } from "../use-cases/archive-clinical-note-use-case";
import { CompleteClinicalNoteUseCase } from "../use-cases/complete-clinical-note-use-case";
import { GetClinicalNoteUseCase } from "../use-cases/get-clinical-note-use-case";
import { ListClinicalNotesByPatientUseCase } from "../use-cases/list-clinical-notes-by-patient-use-case";
import { RegisterClinicalNoteUseCase } from "../use-cases/register-clinical-note-use-case";
import { ReopenClinicalNoteUseCase } from "../use-cases/reopen-clinical-note-use-case";

export type ClinicalNoteApplicationServiceDependencies = {
  clinicalNoteRepositoryPort: ClinicalNoteRepositoryPort;
};

export class ClinicalNoteApplicationService {
  private readonly registerUseCase: RegisterClinicalNoteUseCase;
  private readonly completeUseCase: CompleteClinicalNoteUseCase;
  private readonly reopenUseCase: ReopenClinicalNoteUseCase;
  private readonly amendUseCase: AmendClinicalNoteUseCase;
  private readonly archiveUseCase: ArchiveClinicalNoteUseCase;
  private readonly getUseCase: GetClinicalNoteUseCase;
  private readonly listByPatientUseCase: ListClinicalNotesByPatientUseCase;

  constructor(dependencies: ClinicalNoteApplicationServiceDependencies) {
    this.registerUseCase = new RegisterClinicalNoteUseCase(dependencies);
    this.completeUseCase = new CompleteClinicalNoteUseCase(dependencies);
    this.reopenUseCase = new ReopenClinicalNoteUseCase(dependencies);
    this.amendUseCase = new AmendClinicalNoteUseCase(dependencies);
    this.archiveUseCase = new ArchiveClinicalNoteUseCase(dependencies);
    this.getUseCase = new GetClinicalNoteUseCase(dependencies);
    this.listByPatientUseCase = new ListClinicalNotesByPatientUseCase(dependencies);
  }

  registerClinicalNote(command: RegisterClinicalNoteCommand): Promise<RegisterClinicalNoteResult> {
    return this.registerUseCase.execute(command);
  }

  completeClinicalNote(command: CompleteClinicalNoteCommand): Promise<CompleteClinicalNoteResult> {
    return this.completeUseCase.execute(command);
  }

  reopenClinicalNote(command: ReopenClinicalNoteCommand): Promise<ReopenClinicalNoteResult> {
    return this.reopenUseCase.execute(command);
  }

  amendClinicalNote(command: AmendClinicalNoteCommand): Promise<AmendClinicalNoteResult> {
    return this.amendUseCase.execute(command);
  }

  archiveClinicalNote(command: ArchiveClinicalNoteCommand): Promise<ArchiveClinicalNoteResult> {
    return this.archiveUseCase.execute(command);
  }

  getClinicalNote(command: GetClinicalNoteCommand): Promise<GetClinicalNoteResult> {
    return this.getUseCase.execute(command);
  }

  listClinicalNotesByPatient(command: ListClinicalNotesByPatientCommand): Promise<ListClinicalNotesByPatientResult> {
    return this.listByPatientUseCase.execute(command);
  }
}

export function createClinicalNoteApplicationService(
  dependencies: ClinicalNoteApplicationServiceDependencies,
): ClinicalNoteApplicationService {
  return new ClinicalNoteApplicationService(dependencies);
}

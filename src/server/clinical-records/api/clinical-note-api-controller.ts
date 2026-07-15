import {
  createClinicalNoteApplicationService,
  type ClinicalNoteApplicationService,
} from "../application";
import { ClinicalNoteNotFoundError } from "../domain/clinical-record.errors";
import { createClinicalNoteRepositoryPort } from "../persistence";
import {
  clinicalNoteJsonResponse,
  parseClinicalNoteApiError,
  readClinicalNoteJsonPayload,
  registerClinicalNoteApiSchema,
  updateClinicalNoteApiSchema,
} from "./clinical-note-api-contracts";

export const CLINICAL_NOTE_API_CONTROLLER_VERSION =
  "75.0-WP-02-I1-M5-CLINICAL-NOTE-API-CONTROLLER" as const;

export type ClinicalNoteApiControllerDependencies = {
  clinicalNoteApplicationService: ClinicalNoteApplicationService;
};

export class ClinicalNoteApiController {
  constructor(private readonly dependencies: ClinicalNoteApiControllerDependencies) {}

  async registerClinicalNote(request: Request, patientId: string): Promise<Response> {
    try {
      const payload = registerClinicalNoteApiSchema.parse(
        await readClinicalNoteJsonPayload(request),
      );
      const result = await this.dependencies.clinicalNoteApplicationService.registerClinicalNote({
        ...payload,
        patientId,
        narrative: payload.narrative,
      });

      return clinicalNoteJsonResponse({ success: true, clinicalNote: result.clinicalNote }, 201);
    } catch (error) {
      return this.toErrorResponse(
        "Failed to register clinical note through Clinical Records Application Layer.",
        error,
      );
    }
  }

  async listClinicalNotesByPatient(_request: Request, patientId: string): Promise<Response> {
    try {
      const result =
        await this.dependencies.clinicalNoteApplicationService.listClinicalNotesByPatient({
          patientId,
        });
      return clinicalNoteJsonResponse({ success: true, clinicalNotes: result.clinicalNotes });
    } catch (error) {
      return this.toErrorResponse(
        "Failed to list clinical notes through Clinical Records Application Layer.",
        error,
      );
    }
  }

  async getClinicalNote(
    _request: Request,
    patientId: string,
    clinicalNoteId: string,
  ): Promise<Response> {
    try {
      const result = await this.dependencies.clinicalNoteApplicationService.getClinicalNote({
        clinicalNoteId,
        patientId,
      });
      return clinicalNoteJsonResponse({ success: true, clinicalNote: result.clinicalNote });
    } catch (error) {
      return this.toErrorResponse(
        "Failed to get clinical note through Clinical Records Application Layer.",
        error,
      );
    }
  }

  async updateClinicalNote(
    request: Request,
    patientId: string,
    clinicalNoteId: string,
  ): Promise<Response> {
    try {
      const payload = updateClinicalNoteApiSchema.parse(await readClinicalNoteJsonPayload(request));

      if (payload.operation === "complete") {
        const result = await this.dependencies.clinicalNoteApplicationService.completeClinicalNote({
          clinicalNoteId,
          patientId,
          healthcareProfessionalId: payload.healthcareProfessionalId,
          reason: payload.reason,
          now: payload.now,
        });
        return clinicalNoteJsonResponse({ success: true, clinicalNote: result.clinicalNote });
      }

      if (payload.operation === "reopen") {
        const result = await this.dependencies.clinicalNoteApplicationService.reopenClinicalNote({
          clinicalNoteId,
          patientId,
          healthcareProfessionalId: payload.healthcareProfessionalId,
          reason: payload.reason,
          now: payload.now,
        });
        return clinicalNoteJsonResponse({ success: true, clinicalNote: result.clinicalNote });
      }

      if (payload.operation === "amend") {
        const result = await this.dependencies.clinicalNoteApplicationService.amendClinicalNote({
          clinicalNoteId,
          patientId,
          healthcareProfessionalId: payload.healthcareProfessionalId,
          title: payload.title,
          narrative: payload.narrative,
          now: payload.now,
        });
        return clinicalNoteJsonResponse({ success: true, clinicalNote: result.clinicalNote });
      }

      const result = await this.dependencies.clinicalNoteApplicationService.archiveClinicalNote({
        clinicalNoteId,
        patientId,
        healthcareProfessionalId: payload.healthcareProfessionalId,
        reason: payload.reason,
        now: payload.now,
      });
      return clinicalNoteJsonResponse({ success: true, clinicalNote: result.clinicalNote });
    } catch (error) {
      return this.toErrorResponse(
        "Failed to update clinical note through Clinical Records Application Layer.",
        error,
      );
    }
  }

  private toErrorResponse(logMessage: string, error: unknown): Response {
    if (error instanceof ClinicalNoteNotFoundError) {
      return clinicalNoteJsonResponse({ success: false, error: error.message }, 404);
    }

    const parsed = parseClinicalNoteApiError(error);
    if (parsed.status >= 500) {
      console.error(logMessage, error);
    }
    return clinicalNoteJsonResponse({ success: false, error: parsed.message }, parsed.status);
  }
}

export function createClinicalNoteApiController(
  dependencies: ClinicalNoteApiControllerDependencies = {
    clinicalNoteApplicationService: createClinicalNoteApplicationService({
      clinicalNoteRepositoryPort: createClinicalNoteRepositoryPort(),
    }),
  },
): ClinicalNoteApiController {
  return new ClinicalNoteApiController(dependencies);
}

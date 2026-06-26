import { useMemo, useState } from "react";
import { Archive, CheckCircle2, FileText, Loader2, RefreshCcw, Save, Search, ShieldCheck } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export type ClinicalNoteUiStatus = "draft" | "completed" | "amended" | "archived";

export type ClinicalNoteUiDto = {
  id: string;
  clinicalRecordId: string;
  patientId: string;
  appointmentId?: string;
  title?: string;
  narrative: string;
  status: ClinicalNoteUiStatus;
  createdAt: string;
  updatedAt: string;
  createdByHealthcareProfessionalId: string;
  updatedByHealthcareProfessionalId?: string;
  completedAt?: string;
  completedByHealthcareProfessionalId?: string;
  reopenedAt?: string;
  reopenedByHealthcareProfessionalId?: string;
  archivedAt?: string;
  archivedByHealthcareProfessionalId?: string;
};

type ClinicalNotesListResponse = {
  success?: boolean;
  clinicalNotes?: ClinicalNoteUiDto[];
  error?: string;
};

type ClinicalNoteMutationResponse = {
  success?: boolean;
  clinicalNote?: ClinicalNoteUiDto;
  error?: string;
};

type RegisterClinicalNoteForm = {
  patientId: string;
  clinicalRecordId: string;
  appointmentId: string;
  healthcareProfessionalId: string;
  title: string;
  narrative: string;
};

const emptyForm: RegisterClinicalNoteForm = {
  patientId: "",
  clinicalRecordId: "",
  appointmentId: "",
  healthcareProfessionalId: "",
  title: "",
  narrative: "",
};

function statusLabel(status: ClinicalNoteUiStatus): string {
  if (status === "draft") return "Borrador";
  if (status === "completed") return "Completada";
  if (status === "amended") return "Enmendada";
  return "Archivada";
}

function statusClass(status: ClinicalNoteUiStatus): string {
  if (status === "draft") return "border-blue-200 bg-blue-50 text-blue-700";
  if (status === "completed") return "border-emerald-200 bg-emerald-50 text-emerald-700";
  if (status === "amended") return "border-amber-200 bg-amber-50 text-amber-700";
  return "border-slate-200 bg-slate-50 text-slate-700";
}

function formatDate(value: string | undefined): string {
  if (!value) return "Sin fecha";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("es-PA", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function getClinicalRecordIdForPatient(patientId: string): string {
  const normalizedPatientId = patientId.trim();
  return normalizedPatientId ? `clinical_record_${normalizedPatientId}` : "";
}

export function ClinicalNotesWorkspace() {
  const [form, setForm] = useState<RegisterClinicalNoteForm>(emptyForm);
  const [notes, setNotes] = useState<ClinicalNoteUiDto[]>([]);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [transitioningId, setTransitioningId] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const selectedNote = useMemo(
    () => notes.find((note) => note.id === selectedNoteId) ?? notes[0] ?? null,
    [notes, selectedNoteId],
  );

  const patientId = form.patientId.trim();
  const healthcareProfessionalId = form.healthcareProfessionalId.trim();

  const updateForm = (field: keyof RegisterClinicalNoteForm, value: string) => {
    setForm((current) => {
      if (field === "patientId") {
        const nextPatientId = value.trim();
        const currentClinicalRecordId = current.clinicalRecordId.trim();
        const shouldAutoSyncClinicalRecord =
          !currentClinicalRecordId || currentClinicalRecordId === getClinicalRecordIdForPatient(current.patientId);

        return {
          ...current,
          patientId: value,
          clinicalRecordId: shouldAutoSyncClinicalRecord
            ? getClinicalRecordIdForPatient(nextPatientId)
            : current.clinicalRecordId,
        };
      }

      return { ...current, [field]: value };
    });
  };

  const loadClinicalNotes = async () => {
    if (!patientId) {
      setError("Indica un Patient ID para consultar notas clínicas.");
      return;
    }

    setLoading(true);
    setError(null);
    setNotice(null);

    try {
      const response = await fetch(`/api/clinical-records/${encodeURIComponent(patientId)}/notes`, {
        credentials: "same-origin",
      });
      const payload = (await response.json()) as ClinicalNotesListResponse;

      if (!response.ok || !payload.success) {
        throw new Error(payload.error ?? "No se pudieron cargar las notas clínicas.");
      }

      const nextNotes = payload.clinicalNotes ?? [];
      setNotes(nextNotes);
      setSelectedNoteId(nextNotes[0]?.id ?? null);
      setNotice(nextNotes.length ? "Notas clínicas cargadas." : "No hay notas clínicas registradas para este paciente.");
    } catch (loadError) {
      setNotes([]);
      setSelectedNoteId(null);
      setError(loadError instanceof Error ? loadError.message : "No se pudieron cargar las notas clínicas.");
    } finally {
      setLoading(false);
    }
  };

  const registerClinicalNote = async () => {
    const clinicalRecordId = form.clinicalRecordId.trim();
    const narrative = form.narrative.trim();

    if (!patientId || !clinicalRecordId || !healthcareProfessionalId || !narrative) {
      setError("Patient ID, Clinical Record ID, Professional ID y narrativa son obligatorios.");
      return;
    }

    setSaving(true);
    setError(null);
    setNotice(null);

    try {
      const response = await fetch(`/api/clinical-records/${encodeURIComponent(patientId)}/notes`, {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clinicalRecordId,
          appointmentId: form.appointmentId.trim() || undefined,
          title: form.title.trim() || undefined,
          narrative,
          healthcareProfessionalId,
        }),
      });
      const payload = (await response.json()) as ClinicalNoteMutationResponse;

      if (!response.ok || !payload.success || !payload.clinicalNote) {
        throw new Error(payload.error ?? "No se pudo registrar la nota clínica.");
      }

      setNotes((current) => [payload.clinicalNote as ClinicalNoteUiDto, ...current]);
      setSelectedNoteId(payload.clinicalNote.id);
      setForm((current) => ({ ...current, title: "", narrative: "", appointmentId: "" }));
      setNotice("Nota clínica registrada correctamente.");
    } catch (registerError) {
      setError(registerError instanceof Error ? registerError.message : "No se pudo registrar la nota clínica.");
    } finally {
      setSaving(false);
    }
  };

  const runClinicalNoteTransition = async (
    note: ClinicalNoteUiDto,
    operation: "complete" | "reopen" | "archive",
    successMessage: string,
  ) => {
    if (!healthcareProfessionalId) {
      setError("Indica el Professional ID para ejecutar esta acción clínica.");
      return;
    }

    setTransitioningId(`${note.id}:${operation}`);
    setError(null);
    setNotice(null);

    try {
      const response = await fetch(
        `/api/clinical-records/${encodeURIComponent(note.patientId)}/notes/${encodeURIComponent(note.id)}`,
        {
          method: "PUT",
          credentials: "same-origin",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ operation, healthcareProfessionalId }),
        },
      );
      const payload = (await response.json()) as ClinicalNoteMutationResponse;

      if (!response.ok || !payload.success || !payload.clinicalNote) {
        throw new Error(payload.error ?? "No se pudo actualizar la nota clínica.");
      }

      setNotes((current) => current.map((currentNote) => (currentNote.id === payload.clinicalNote?.id ? payload.clinicalNote : currentNote)));
      setSelectedNoteId(payload.clinicalNote.id);
      setNotice(successMessage);
    } catch (transitionError) {
      setError(transitionError instanceof Error ? transitionError.message : "No se pudo actualizar la nota clínica.");
    } finally {
      setTransitioningId(null);
    }
  };

  const canSubmit = Boolean(patientId && form.clinicalRecordId.trim() && healthcareProfessionalId && form.narrative.trim());

  return (
    <div className="space-y-6">
      <Card className="border-primary/20 bg-primary/5 shadow-none">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-deep">
            <ShieldCheck className="h-5 w-5 text-primary" />
            Clinical Notes
          </CardTitle>
          <CardDescription>
            Registro clínico gobernado por Clinical Records. La interfaz consume contratos API y no contiene reglas de negocio clínicas.
          </CardDescription>
        </CardHeader>
      </Card>

      {error ? (
        <Alert variant="destructive">
          <AlertTitle>No se pudo completar la operación clínica</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      {notice ? (
        <Alert>
          <CheckCircle2 className="h-4 w-4" />
          <AlertTitle>Clinical Records</AlertTitle>
          <AlertDescription>{notice}</AlertDescription>
        </Alert>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
        <Card>
          <CardHeader>
            <CardTitle>Registrar nota clínica</CardTitle>
            <CardDescription>Capture la narrativa clínica usando los identificadores certificados del dominio.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="clinical-note-patient-id">Patient ID</Label>
              <Input
                id="clinical-note-patient-id"
                value={form.patientId}
                onChange={(event) => updateForm("patientId", event.target.value)}
                placeholder="patient_001"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="clinical-record-id">Clinical Record ID</Label>
              <Input
                id="clinical-record-id"
                value={form.clinicalRecordId}
                onChange={(event) => updateForm("clinicalRecordId", event.target.value)}
                placeholder="clinical_record_patient_001"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="healthcare-professional-id">Professional ID</Label>
              <Input
                id="healthcare-professional-id"
                value={form.healthcareProfessionalId}
                onChange={(event) => updateForm("healthcareProfessionalId", event.target.value)}
                placeholder="doctor_001"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="appointment-id">Appointment ID opcional</Label>
              <Input
                id="appointment-id"
                value={form.appointmentId}
                onChange={(event) => updateForm("appointmentId", event.target.value)}
                placeholder="appointment_001"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="clinical-note-title">Título opcional</Label>
              <Input
                id="clinical-note-title"
                value={form.title}
                onChange={(event) => updateForm("title", event.target.value)}
                placeholder="Evolución de consulta"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="clinical-note-narrative">Narrativa clínica</Label>
              <Textarea
                id="clinical-note-narrative"
                value={form.narrative}
                onChange={(event) => updateForm("narrative", event.target.value)}
                placeholder="Registrar observaciones clínicas relevantes..."
                rows={7}
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <Button type="button" onClick={registerClinicalNote} disabled={!canSubmit || saving}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Registrar nota
              </Button>
              <Button type="button" variant="outline" onClick={loadClinicalNotes} disabled={!patientId || loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                Consultar historial
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Historial clínico</CardTitle>
            <CardDescription>Notas clínicas del paciente seleccionado, ordenadas por carga de la API.</CardDescription>
          </CardHeader>
          <CardContent>
            {notes.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
                No hay notas cargadas. Indica un Patient ID y consulta el historial clínico.
              </div>
            ) : (
              <div className="grid gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
                <div className="space-y-3">
                  {notes.map((note) => (
                    <button
                      key={note.id}
                      type="button"
                      onClick={() => setSelectedNoteId(note.id)}
                      className={`w-full rounded-2xl border p-4 text-left transition hover:border-primary ${
                        selectedNote?.id === note.id ? "border-primary bg-primary/5" : "border-border bg-white"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-deep">{note.title || "Nota clínica"}</p>
                          <p className="mt-1 text-xs text-muted-foreground">{formatDate(note.updatedAt)}</p>
                        </div>
                        <Badge variant="outline" className={statusClass(note.status)}>
                          {statusLabel(note.status)}
                        </Badge>
                      </div>
                      <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">{note.narrative}</p>
                    </button>
                  ))}
                </div>

                <div className="rounded-2xl border border-border bg-background/50 p-5">
                  {selectedNote ? (
                    <div className="space-y-5">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="text-sm uppercase tracking-[0.18em] text-muted-foreground">Clinical Note</p>
                          <h3 className="mt-2 text-2xl font-bold text-deep">{selectedNote.title || "Nota clínica"}</h3>
                          <p className="mt-1 text-sm text-muted-foreground">ID: {selectedNote.id}</p>
                        </div>
                        <Badge variant="outline" className={statusClass(selectedNote.status)}>
                          {statusLabel(selectedNote.status)}
                        </Badge>
                      </div>

                      <div className="grid gap-3 text-sm text-muted-foreground md:grid-cols-2">
                        <div>
                          <span className="font-semibold text-deep">Paciente:</span> {selectedNote.patientId}
                        </div>
                        <div>
                          <span className="font-semibold text-deep">Expediente:</span> {selectedNote.clinicalRecordId}
                        </div>
                        <div>
                          <span className="font-semibold text-deep">Creada:</span> {formatDate(selectedNote.createdAt)}
                        </div>
                        <div>
                          <span className="font-semibold text-deep">Actualizada:</span> {formatDate(selectedNote.updatedAt)}
                        </div>
                        <div>
                          <span className="font-semibold text-deep">Autor:</span> {selectedNote.createdByHealthcareProfessionalId}
                        </div>
                        <div>
                          <span className="font-semibold text-deep">Cita:</span> {selectedNote.appointmentId ?? "No asociada"}
                        </div>
                      </div>

                      <div className="rounded-2xl bg-white p-5 text-sm leading-7 text-deep shadow-sm">
                        <div className="mb-3 flex items-center gap-2 font-semibold">
                          <FileText className="h-4 w-4 text-primary" />
                          Narrativa clínica
                        </div>
                        <p className="whitespace-pre-wrap">{selectedNote.narrative}</p>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => runClinicalNoteTransition(selectedNote, "complete", "Nota clínica completada.")}
                          disabled={selectedNote.status === "completed" || selectedNote.status === "archived" || Boolean(transitioningId)}
                        >
                          {transitioningId === `${selectedNote.id}:complete` ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <CheckCircle2 className="h-4 w-4" />
                          )}
                          Completar
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => runClinicalNoteTransition(selectedNote, "reopen", "Nota clínica reabierta.")}
                          disabled={selectedNote.status === "draft" || selectedNote.status === "archived" || Boolean(transitioningId)}
                        >
                          {transitioningId === `${selectedNote.id}:reopen` ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <RefreshCcw className="h-4 w-4" />
                          )}
                          Reabrir
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => runClinicalNoteTransition(selectedNote, "archive", "Nota clínica archivada.")}
                          disabled={selectedNote.status === "archived" || Boolean(transitioningId)}
                        >
                          {transitioningId === `${selectedNote.id}:archive` ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Archive className="h-4 w-4" />
                          )}
                          Archivar
                        </Button>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

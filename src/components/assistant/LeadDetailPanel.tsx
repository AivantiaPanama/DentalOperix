import { useEffect, useState } from "react";
import { ArrowLeft, Mail, Phone, UserRound } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import type { LeadQueueItem } from "./LeadQueueWidget";
import { AssistantAppointmentWorkflowCard } from "./AssistantAppointmentWorkflowCard";

const LEAD_STATUS_OPTIONS = [
  { value: "nuevo", label: "Nuevo" },
  { value: "contactado", label: "Contactado" },
  { value: "seguimiento", label: "Seguimiento" },
  { value: "agendada", label: "Agendada" },
  { value: "completada", label: "Completada" },
  { value: "cancelada", label: "Cancelada" },
  { value: "no interesado", label: "No interesado" },
  { value: "no asistió", label: "No asistió" },
] as const;

export type LeadStatusOption = (typeof LEAD_STATUS_OPTIONS)[number]["value"];

function isLeadStatusOption(value: string | null | undefined): value is LeadStatusOption {
  return LEAD_STATUS_OPTIONS.some((option) => option.value === value);
}

function normalize(value: string | boolean | null | undefined) {
  if (typeof value === "boolean") {
    return value ? "Sí" : "No";
  }

  return value?.trim() || "Por confirmar";
}

function formatDate(value: string | null | undefined) {
  const normalized = normalize(value);
  if (normalized === "Por confirmar") {
    return normalized;
  }

  return normalized.slice(0, 10);
}

type DetailFieldProps = {
  label: string;
  value: string | boolean | null | undefined;
};

function DetailField({ label, value }: DetailFieldProps) {
  return (
    <div className="rounded-2xl border border-border bg-background/70 p-4">
      <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="mt-2 text-sm font-medium text-deep">{normalize(value)}</dd>
    </div>
  );
}

type LeadDetailPanelProps = {
  lead: LeadQueueItem;
  onBack: () => void;
  onStatusUpdated?: (leadId: string, status: LeadStatusOption) => void;
  onNotesUpdated?: (leadId: string, notes: string) => void;
};

export function LeadDetailPanel({
  lead,
  onBack,
  onStatusUpdated,
  onNotesUpdated,
}: LeadDetailPanelProps) {
  const initialStatus = isLeadStatusOption(lead.status) ? lead.status : "nuevo";
  const [selectedStatus, setSelectedStatus] = useState<LeadStatusOption>(initialStatus);
  const [savingStatus, setSavingStatus] = useState(false);
  const [notesDraft, setNotesDraft] = useState(lead.notes ?? "");
  const [savingNotes, setSavingNotes] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setSelectedStatus(isLeadStatusOption(lead.status) ? lead.status : "nuevo");
    setNotesDraft(lead.notes ?? "");
    setMessage(null);
    setError(null);
  }, [lead.id, lead.status, lead.notes]);

  async function handleStatusSubmit() {
    setSavingStatus(true);
    setMessage(null);
    setError(null);

    try {
      const response = await fetch("/api/leads/update-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ leadId: lead.id, status: selectedStatus }),
      });
      const payload = (await response.json().catch(() => ({}))) as { error?: string };

      if (!response.ok) {
        throw new Error(payload.error || "No se pudo actualizar el estado del lead.");
      }

      onStatusUpdated?.(lead.id, selectedStatus);
      setMessage("Estado del lead actualizado correctamente.");
    } catch (statusError) {
      setError(
        statusError instanceof Error
          ? statusError.message
          : "No se pudo actualizar el estado del lead.",
      );
    } finally {
      setSavingStatus(false);
    }
  }

  async function handleNotesSubmit() {
    setSavingNotes(true);
    setMessage(null);
    setError(null);

    try {
      const response = await fetch("/api/leads/update-notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ leadId: lead.id, notes: notesDraft }),
      });
      const payload = (await response.json().catch(() => ({}))) as {
        error?: string;
        notes?: string;
      };

      if (!response.ok) {
        throw new Error(payload.error || "No se pudieron actualizar las notas del lead.");
      }

      onNotesUpdated?.(lead.id, payload.notes ?? notesDraft);
      setMessage("Notas del lead actualizadas correctamente.");
    } catch (notesError) {
      setError(
        notesError instanceof Error
          ? notesError.message
          : "No se pudieron actualizar las notas del lead.",
      );
    } finally {
      setSavingNotes(false);
    }
  }

  return (
    <section aria-label={`Detalle de lead ${normalize(lead.name)}`} className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Button
            aria-label="Volver a la cola de leads"
            onClick={onBack}
            size="sm"
            type="button"
            variant="ghost"
          >
            <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
            Volver a la cola
          </Button>
          <div className="mt-3 flex items-center gap-2">
            <UserRound className="h-5 w-5 text-primary" aria-hidden="true" />
            <h3 className="text-lg font-semibold text-deep">{normalize(lead.name)}</h3>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Vista del lead seleccionado con actualización controlada de estado y notas internas. No
            edita asignaciones ni datos clínicos.
          </p>
        </div>
        <Badge variant="outline">{normalize(lead.status)}</Badge>
      </div>

      <Card className="shadow-none">
        <CardHeader>
          <CardTitle className="text-base text-deep">Estado del lead</CardTitle>
          <CardDescription>
            Actualización controlada del status del Lead certificado. No crea ni reemplaza Leads.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
            <label className="space-y-2 text-sm font-medium text-deep">
              Estado operativo
              <select
                aria-label="Estado del lead"
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm"
                disabled={savingStatus}
                value={selectedStatus}
                onChange={(event) => setSelectedStatus(event.target.value as LeadStatusOption)}
              >
                {LEAD_STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <Button
              disabled={savingStatus || selectedStatus === lead.status}
              onClick={handleStatusSubmit}
              type="button"
            >
              {savingStatus ? "Actualizando..." : "Actualizar estado"}
            </Button>
          </div>

          {message ? (
            <Alert>
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          ) : null}
          {error ? (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}
        </CardContent>
      </Card>

      <Card className="shadow-none">
        <CardHeader>
          <CardTitle className="text-base text-deep">Notas internas del lead</CardTitle>
          <CardDescription>
            Notas operativas de Front Desk guardadas en Leads. No crea historial, pacientes ni
            fuentes paralelas.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <label className="space-y-2 text-sm font-medium text-deep">
            Notas operativas
            <Textarea
              aria-label="Notas internas del lead"
              disabled={savingNotes}
              maxLength={5000}
              placeholder="Agrega contexto operativo para seguimiento del lead"
              value={notesDraft}
              onChange={(event) => setNotesDraft(event.target.value)}
            />
          </label>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-muted-foreground">{notesDraft.length}/5000 caracteres</p>
            <Button
              disabled={savingNotes || notesDraft === (lead.notes ?? "")}
              onClick={handleNotesSubmit}
              type="button"
            >
              {savingNotes ? "Guardando..." : "Guardar notas"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <AssistantAppointmentWorkflowCard lead={lead} />

      <Card className="shadow-none">
        <CardHeader>
          <CardTitle className="text-base text-deep">Identificación</CardTitle>
          <CardDescription>
            Información certificada de Leads expuesta en modo lectura.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-3 md:grid-cols-3">
            <DetailField label="ID" value={lead.id} />
            <DetailField label="Creado" value={formatDate(lead.createdAt)} />
            <DetailField label="Estado" value={lead.status} />
          </dl>
        </CardContent>
      </Card>

      <Card className="shadow-none">
        <CardHeader>
          <CardTitle className="text-base text-deep">Contacto</CardTitle>
          <CardDescription>Datos de contacto capturados en Leads.</CardDescription>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-3 md:grid-cols-2">
            <div className="rounded-2xl border border-border bg-background/70 p-4">
              <dt className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                <Phone className="h-3.5 w-3.5" aria-hidden="true" /> Teléfono
              </dt>
              <dd className="mt-2 text-sm font-medium text-deep">{normalize(lead.phone)}</dd>
            </div>
            <div className="rounded-2xl border border-border bg-background/70 p-4">
              <dt className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                <Mail className="h-3.5 w-3.5" aria-hidden="true" /> Email
              </dt>
              <dd className="mt-2 text-sm font-medium text-deep">{normalize(lead.email)}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <Card className="shadow-none">
        <CardHeader>
          <CardTitle className="text-base text-deep">Solicitud</CardTitle>
          <CardDescription>
            Contexto operativo del lead sin edición de pacientes ni asignaciones.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <dl className="grid gap-3 md:grid-cols-3">
            <DetailField label="Tratamiento" value={lead.treatment} />
            <DetailField label="Fuente" value={lead.source} />
            <DetailField label="Fecha preferida" value={formatDate(lead.preferredDate)} />
            <DetailField label="Urgencia" value={lead.urgency} />
            <DetailField label="Evento calendario" value={lead.calendarEventId} />
            <DetailField label="Email enviado" value={lead.emailSent} />
          </dl>

          <dl className="grid gap-3">
            <DetailField label="Mensaje" value={lead.message} />
            <DetailField label="Notas guardadas" value={lead.notes} />
            <DetailField label="Resumen IA" value={lead.aiSummary} />
          </dl>
        </CardContent>
      </Card>
    </section>
  );
}

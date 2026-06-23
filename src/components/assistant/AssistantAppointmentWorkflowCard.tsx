import { useMemo, useState } from "react";
import { CalendarCheck2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { LeadQueueItem } from "./LeadQueueWidget";

type AppointmentStatus =
  | "requested"
  | "suggested_alternative"
  | "pending_patient_confirmation"
  | "confirmed"
  | "needs_assistant_review"
  | "rescheduled"
  | "cancelled"
  | "expired";

type AppointmentApiModel = {
  id: string;
  status: AppointmentStatus;
  providerId?: string;
  scheduledStartAt?: string;
  scheduledEndAt?: string;
};

type AvailabilityResponse = {
  success?: boolean;
  available?: boolean;
  error?: string;
};

type AppointmentResponse = {
  success?: boolean;
  appointment?: AppointmentApiModel;
  error?: string;
};

function normalize(value: string | null | undefined) {
  return value?.trim() || "";
}

function deriveDate(value: string | null | undefined) {
  const normalized = normalize(value);
  return /^\d{4}-\d{2}-\d{2}/.test(normalized) ? normalized.slice(0, 10) : "";
}

function deriveTime(value: string | null | undefined) {
  const normalized = normalize(value);
  const match = normalized.match(/(?:T|\s)(\d{2}:\d{2})/);
  return match?.[1] ?? "";
}

function getIsoInterval(date: string, time: string, durationMinutes: number) {
  const start = new Date(`${date}T${time}:00`);
  const end = new Date(start.getTime() + durationMinutes * 60 * 1000);

  return {
    startAt: start.toISOString(),
    endAt: end.toISOString(),
  };
}

async function readJson<T>(response: Response): Promise<T> {
  return (await response.json().catch(() => ({}))) as T;
}

export function AssistantAppointmentWorkflowCard({ lead }: { lead: LeadQueueItem }) {
  const [providerId, setProviderId] = useState("");
  const [requestedDate, setRequestedDate] = useState(() => deriveDate(lead.preferredDate));
  const [requestedTime, setRequestedTime] = useState(() => deriveTime(lead.preferredDate));
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [service, setService] = useState(() => normalize(lead.treatment) || "Consulta inicial");
  const [notes, setNotes] = useState("");
  const [appointment, setAppointment] = useState<AppointmentApiModel | null>(null);
  const [availability, setAvailability] = useState<AvailabilityResponse | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const canBuildInterval = Boolean(providerId.trim() && requestedDate && requestedTime && durationMinutes > 0);
  const interval = useMemo(() => {
    if (!canBuildInterval) return null;
    try {
      return getIsoInterval(requestedDate, requestedTime, durationMinutes);
    } catch {
      return null;
    }
  }, [canBuildInterval, requestedDate, requestedTime, durationMinutes]);

  async function createRequest() {
    setBusy(true);
    setError(null);
    setMessage(null);
    setAvailability(null);

    try {
      const response = await fetch("/api/appointments/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          leadId: lead.id,
          requestedDate: requestedDate || undefined,
          requestedTime: requestedTime || undefined,
          durationMinutes,
          service,
          patientName: normalize(lead.name) || "Paciente por confirmar",
          patientEmail: normalize(lead.email) || undefined,
          patientPhone: normalize(lead.phone) || undefined,
          notes: notes || undefined,
        }),
      });
      const payload = await readJson<AppointmentResponse>(response);
      if (!response.ok || !payload.appointment) {
        throw new Error(payload.error || "No se pudo crear la solicitud de cita.");
      }

      setAppointment(payload.appointment);
      setMessage("Solicitud de cita creada para revisión de disponibilidad.");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "No se pudo crear la solicitud de cita.");
    } finally {
      setBusy(false);
    }
  }

  async function checkAvailability() {
    if (!interval) {
      setError("Selecciona proveedor, fecha, hora y duración para verificar disponibilidad.");
      return;
    }

    setBusy(true);
    setError(null);
    setMessage(null);

    try {
      const response = await fetch("/api/appointments/check-availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          providerId,
          startAt: interval.startAt,
          endAt: interval.endAt,
          excludeAppointmentId: appointment?.id,
        }),
      });
      const payload = await readJson<AvailabilityResponse>(response);
      if (!response.ok) {
        throw new Error(payload.error || "No se pudo verificar disponibilidad.");
      }

      setAvailability(payload);
      setMessage(payload.available ? "Proveedor disponible para confirmar la cita." : "Proveedor no disponible; envía la solicitud a revisión.");
    } catch (availabilityError) {
      setError(availabilityError instanceof Error ? availabilityError.message : "No se pudo verificar disponibilidad.");
    } finally {
      setBusy(false);
    }
  }

  async function confirmAppointment() {
    if (!appointment || !interval) return;

    setBusy(true);
    setError(null);
    setMessage(null);

    try {
      const response = await fetch("/api/appointments/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          appointmentId: appointment.id,
          providerId,
          scheduledStartAt: interval.startAt,
          scheduledEndAt: interval.endAt,
        }),
      });
      const payload = await readJson<AppointmentResponse>(response);
      if (!response.ok || !payload.appointment) {
        throw new Error(payload.error || "No se pudo confirmar la cita.");
      }

      setAppointment(payload.appointment);
      setMessage("Cita confirmada con disponibilidad por proveedor.");
    } catch (confirmError) {
      setError(confirmError instanceof Error ? confirmError.message : "No se pudo confirmar la cita.");
    } finally {
      setBusy(false);
    }
  }

  async function markNeedsReview() {
    if (!appointment) return;

    setBusy(true);
    setError(null);
    setMessage(null);

    try {
      const response = await fetch("/api/appointments/mark-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          appointmentId: appointment.id,
          notes: notes || "Solicitud pendiente de revisión por disponibilidad.",
        }),
      });
      const payload = await readJson<AppointmentResponse>(response);
      if (!response.ok || !payload.appointment) {
        throw new Error(payload.error || "No se pudo enviar la solicitud a revisión.");
      }

      setAppointment(payload.appointment);
      setMessage("Solicitud enviada a revisión de Front Desk.");
    } catch (reviewError) {
      setError(reviewError instanceof Error ? reviewError.message : "No se pudo enviar la solicitud a revisión.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base text-deep">
          <CalendarCheck2 className="h-4 w-4 text-primary" aria-hidden="true" />
          Flujo de cita asistida
        </CardTitle>
        <CardDescription>
          Crea una solicitud de cita desde Front Desk, valida disponibilidad por proveedor y confirma sólo si hay capacidad.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 md:grid-cols-2">
          <label className="space-y-2 text-sm font-medium text-deep">
            Proveedor / doctor
            <Input
              aria-label="Proveedor de la cita"
              disabled={busy || appointment?.status === "confirmed"}
              placeholder="provider_001"
              value={providerId}
              onChange={(event) => setProviderId(event.target.value)}
            />
          </label>
          <label className="space-y-2 text-sm font-medium text-deep">
            Servicio
            <Input
              aria-label="Servicio de la cita"
              disabled={busy || Boolean(appointment)}
              value={service}
              onChange={(event) => setService(event.target.value)}
            />
          </label>
          <label className="space-y-2 text-sm font-medium text-deep">
            Fecha solicitada
            <Input
              aria-label="Fecha solicitada de la cita"
              disabled={busy || appointment?.status === "confirmed"}
              type="date"
              value={requestedDate}
              onChange={(event) => setRequestedDate(event.target.value)}
            />
          </label>
          <label className="space-y-2 text-sm font-medium text-deep">
            Hora solicitada
            <Input
              aria-label="Hora solicitada de la cita"
              disabled={busy || appointment?.status === "confirmed"}
              type="time"
              value={requestedTime}
              onChange={(event) => setRequestedTime(event.target.value)}
            />
          </label>
          <label className="space-y-2 text-sm font-medium text-deep">
            Duración en minutos
            <Input
              aria-label="Duración de la cita en minutos"
              disabled={busy || appointment?.status === "confirmed"}
              min={15}
              step={15}
              type="number"
              value={durationMinutes}
              onChange={(event) => setDurationMinutes(Number(event.target.value))}
            />
          </label>
        </div>

        <label className="space-y-2 text-sm font-medium text-deep">
          Notas de solicitud
          <Textarea
            aria-label="Notas de solicitud de cita"
            disabled={busy || appointment?.status === "confirmed"}
            placeholder="Contexto operativo para disponibilidad o revisión"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
          />
        </label>

        <div className="flex flex-wrap gap-2">
          <Button disabled={busy || Boolean(appointment) || !service.trim()} onClick={createRequest} type="button">
            {busy && !appointment ? "Creando..." : "Crear solicitud de cita"}
          </Button>
          <Button disabled={busy || !appointment || !interval} onClick={checkAvailability} type="button" variant="outline">
            Verificar disponibilidad
          </Button>
          <Button
            disabled={busy || !appointment || !interval || availability?.available !== true || appointment.status === "confirmed"}
            onClick={confirmAppointment}
            type="button"
          >
            Confirmar cita
          </Button>
          <Button
            disabled={busy || !appointment || appointment.status === "confirmed" || appointment.status === "needs_assistant_review"}
            onClick={markNeedsReview}
            type="button"
            variant="secondary"
          >
            Enviar a revisión
          </Button>
        </div>

        {appointment ? (
          <div className="rounded-2xl border border-border bg-background/70 p-4 text-sm text-muted-foreground">
            <p>
              <span className="font-medium text-deep">Solicitud:</span> {appointment.id}
            </p>
            <p>
              <span className="font-medium text-deep">Estado:</span> {appointment.status}
            </p>
          </div>
        ) : null}

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
  );
}

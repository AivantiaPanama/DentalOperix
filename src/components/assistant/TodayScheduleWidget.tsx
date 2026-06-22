import { CalendarClock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppointments } from "@/lib/appointments-store";
import type { Appointment } from "@/lib/clinic-data";

const providerByService: Record<string, string> = {
  "Diseño de Sonrisa": "Dra. Camila Ríos",
  Ortodoncia: "Dr. Felipe Soto",
  "Odontología Preventiva": "Dra. Camila Ríos",
  "Limpieza Dental": "Dra. Camila Ríos",
  "Implantes Dentales": "Dr. Felipe Soto",
  Odontopediatría: "Dra. Valeria Soto",
};

function getTodayDate() {
  return new Date().toISOString().slice(0, 10);
}

function resolveProvider(appointment: Appointment) {
  return providerByService[appointment.service] ?? "Proveedor por confirmar";
}

function formatTime(time: string) {
  return time;
}

export function getTodayScheduleAppointments(appointments: Appointment[], today = getTodayDate()) {
  return appointments
    .filter((appointment) => appointment.date === today && appointment.status !== "cancelled")
    .toSorted((a, b) => a.time.localeCompare(b.time));
}

export function TodayScheduleWidget({
  appointments,
  today = getTodayDate(),
}: {
  appointments?: Appointment[];
  today?: string;
}) {
  const appointmentStore = useAppointments();
  const sourceAppointments = appointments ?? appointmentStore.appointments;
  const todayAppointments = getTodayScheduleAppointments(sourceAppointments, today);

  return (
    <Card aria-label={`Agenda diaria, ${todayAppointments.length} citas`} className="shadow-soft">
      <CardHeader className="space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg text-deep">
              <CalendarClock className="h-5 w-5 text-primary" />
              Agenda diaria
            </CardTitle>
            <CardDescription className="mt-2 leading-6">
              Citas de hoy ordenadas por hora de inicio, visibles para recepción con permiso appointment.read.
            </CardDescription>
          </div>
          <Badge variant="secondary" className="w-fit">
            {todayAppointments.length} {todayAppointments.length === 1 ? "cita" : "citas"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {todayAppointments.length === 0 ? (
          <div
            className="rounded-2xl border border-dashed border-border bg-background/70 px-4 py-5 text-sm text-muted-foreground"
            role="status"
          >
            No hay citas programadas para hoy.
          </div>
        ) : (
          <ol className="space-y-3" aria-label="Citas programadas para hoy">
            {todayAppointments.map((appointment) => (
              <li
                key={appointment.id}
                className="grid gap-3 rounded-2xl border border-border bg-background/70 p-4 sm:grid-cols-[90px_minmax(0,1fr)_minmax(140px,auto)] sm:items-center"
              >
                <time className="text-sm font-semibold text-primary" dateTime={`${appointment.date}T${appointment.time}`}>
                  {formatTime(appointment.time)}
                </time>
                <div>
                  <p className="font-semibold text-deep">{appointment.name}</p>
                  <p className="text-sm text-muted-foreground">{appointment.service}</p>
                </div>
                <p className="text-sm font-medium text-muted-foreground">{resolveProvider(appointment)}</p>
              </li>
            ))}
          </ol>
        )}
      </CardContent>
    </Card>
  );
}

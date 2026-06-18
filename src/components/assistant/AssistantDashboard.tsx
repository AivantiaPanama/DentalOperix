import { useEffect, useMemo, useState } from "react";
import { CalendarClock, CheckCircle2, Clock3, LogIn, LogOut, PhoneCall, RefreshCcw, Search, ShieldCheck, UserRound } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { LeadOperationsWorkspace } from "@/components/assistant/LeadOperationsWorkspace";
import { PatientManagementWorkspace } from "@/components/assistant/PatientManagementWorkspace";
import { OperationalConsolidationWorkspace } from "@/components/assistant/OperationalConsolidationWorkspace";
import { OperationalAnalyticsWorkspace } from "@/components/assistant/OperationalAnalyticsWorkspace";
import { OperationalNotificationsPanel } from "@/components/operations/OperationalNotificationsPanel";
import { OperationalKpisPanel } from "@/components/operations/OperationalKpisPanel";
import { OperationalDataQualityPanel } from "@/components/operations/OperationalDataQualityPanel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { MockLead } from "@/lib/mock/leads";
import { derivePatientAdministrativeProfiles, type PatientAdministrativeProfile } from "@/lib/patients/admin-profile";

type AssistantLead = MockLead & {
  urgency?: string;
  aiSummary?: string;
  message?: string;
  calendarEventId?: string;
  emailSent?: boolean;
};

type LeadsResponse = {
  leads?: AssistantLead[];
  fallback?: boolean;
  message?: string;
  error?: string;
};

type AppointmentStatus = "Pendiente" | "Agendada" | "Confirmada" | "Cancelada" | "Completada" | "No asistió";

type AppointmentSummary = {
  id: string;
  time: string;
  date: string;
  patient: string;
  treatment: string;
  phone: string;
  email: string;
  status: AppointmentStatus;
  source: string;
  note: string;
};

type DashboardState = {
  appointments: AppointmentSummary[];
  patientProfiles: PatientAdministrativeProfile[];
  fallback: boolean;
  message: string | null;
};

const emptyState: DashboardState = {
  appointments: [],
  patientProfiles: [],
  fallback: false,
  message: null,
};

function formatDate(value: string) {
  if (!value) return "Fecha por coordinar";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("es-PA", { dateStyle: "medium" }).format(date);
}

function formatTime(value: string) {
  if (!value || /^\d{4}-\d{2}-\d{2}$/.test(value.trim())) return "Por definir";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Por definir";
  return new Intl.DateTimeFormat("es-PA", { hour: "2-digit", minute: "2-digit" }).format(date);
}

function normalizeStatus(status: string | undefined): AppointmentStatus {
  const normalized = (status ?? "").toLowerCase().trim();

  if (normalized === "agendada") return "Agendada";
  if (normalized === "confirmada") return "Confirmada";
  if (normalized === "completada") return "Completada";
  if (normalized === "cancelada") return "Cancelada";
  if (normalized === "no asistió" || normalized === "no asistio") return "No asistió";

  return "Pendiente";
}

function mapLeadToAppointment(lead: AssistantLead): AppointmentSummary {
  const rawDate = lead.preferredDate || lead.createdAt || "";
  const status = normalizeStatus(lead.status);
  const note = lead.notes || lead.message || lead.aiSummary || "Contacto operativo pendiente de seguimiento amable.";

  return {
    id: lead.id || "Sin folio",
    time: formatTime(rawDate),
    date: formatDate(rawDate),
    patient: lead.name || "Paciente sin nombre",
    treatment: lead.treatment || "Servicio por definir",
    phone: lead.phone || "Teléfono no registrado",
    email: lead.email || "Correo no registrado",
    status,
    source: lead.source || "Sin canal",
    note,
  };
}

function statusClass(status: AppointmentStatus) {
  if (status === "Agendada" || status === "Confirmada" || status === "Completada") {
    return "bg-emerald-50 text-emerald-700";
  }
  if (status === "Cancelada" || status === "No asistió") return "bg-red-50 text-red-700";
  return "bg-amber-50 text-amber-700";
}

function compareAppointments(a: AppointmentSummary, b: AppointmentSummary) {
  return `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`);
}

export function AssistantDashboard() {
  const [state, setState] = useState<DashboardState>(emptyState);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const loadAssistantData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/leads/list", { credentials: "same-origin" });
      const payload = (await response.json()) as LeadsResponse;

      if (!response.ok) {
        throw new Error(payload.error ?? "No se pudo cargar la agenda operativa.");
      }

      const leads = payload.leads ?? [];
      const appointments = leads.map(mapLeadToAppointment).sort(compareAppointments);
      const patientProfiles = derivePatientAdministrativeProfiles(leads);

      setState({
        appointments,
        patientProfiles,
        fallback: Boolean(payload.fallback),
        message: payload.message ?? null,
      });
    } catch (loadError) {
      setState(emptyState);
      setError(loadError instanceof Error ? loadError.message : "No se pudo cargar la agenda operativa.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadAssistantData();
  }, []);

  const filteredAppointments = useMemo(() => {
    const normalizedQuery = query.toLowerCase().trim();
    if (!normalizedQuery) return state.appointments;

    return state.appointments.filter((appointment) =>
      [appointment.patient, appointment.phone, appointment.email, appointment.treatment, appointment.status, appointment.id]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery),
    );
  }, [query, state.appointments]);


  const filteredPatientProfiles = useMemo(() => {
    const normalizedQuery = query.toLowerCase().trim();
    if (!normalizedQuery) return state.patientProfiles;

    return state.patientProfiles.filter((profile) =>
      [
        profile.displayName,
        profile.phone,
        profile.email,
        profile.treatmentInterest,
        profile.latestStatus,
        profile.source,
        ...profile.sourceLeadIds,
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery),
    );
  }, [query, state.patientProfiles]);

  const incompleteProfiles = state.patientProfiles.filter((profile) => profile.missingFields.length > 0).length;

  const pending = state.appointments.filter((appointment) => appointment.status === "Pendiente").length;
  const scheduled = state.appointments.filter(
    (appointment) => appointment.status === "Agendada" || appointment.status === "Confirmada",
  ).length;
  const inactive = state.appointments.filter(
    (appointment) => appointment.status === "Cancelada" || appointment.status === "No asistió",
  ).length;

  const operationalTasks = [
    {
      title: "Confirmaciones",
      value: String(pending),
      description: "contactos requieren seguimiento amable antes de su cita.",
      icon: PhoneCall,
    },
    {
      title: "Check-in",
      value: "Preparado",
      description: "acción visual reservada para una fase operativa posterior.",
      icon: LogIn,
    },
    {
      title: "Check-out",
      value: "Preparado",
      description: "cierre operativo pendiente de implementación segura.",
      icon: LogOut,
    },
  ] as const;

  return (
    <div className="space-y-6">
      {state.fallback ? (
        <Alert className="border-amber-200 bg-amber-50 text-amber-900">
          <AlertTitle>Datos demostrativos</AlertTitle>
          <AlertDescription>
            {state.message ?? "No se pudo leer Google Sheets, por eso se muestran datos de demostración."}
          </AlertDescription>
        </Alert>
      ) : null}

      {error ? (
        <Alert variant="destructive">
          <AlertTitle>No se pudo cargar la agenda</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      <OperationalNotificationsPanel />
      <OperationalKpisPanel />
      <OperationalDataQualityPanel />

      <section className="grid gap-4 md:grid-cols-3">
        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Agenda operativa</CardTitle>
            <CalendarClock className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-deep">{loading ? "..." : state.appointments.length}</p>
            <p className="mt-1 text-xs text-muted-foreground">Lectura de leads/citas sin métricas financieras.</p>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Agendadas</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-deep">{loading ? "..." : scheduled}</p>
            <p className="mt-1 text-xs text-muted-foreground">{pending} pendiente de confirmación o contacto.</p>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">No activas</CardTitle>
            <Clock3 className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-deep">{loading ? "..." : inactive}</p>
            <p className="mt-1 text-xs text-muted-foreground">Canceladas o no asistidas para revisión operativa.</p>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <Card className="shadow-soft">
          <CardHeader className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <CardTitle>Agenda y confirmaciones</CardTitle>
              <CardDescription>
                Vista de solo lectura para recepción, confirmaciones y acompañamiento del paciente.
              </CardDescription>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={() => void loadAssistantData()} disabled={loading}>
              <RefreshCcw className="mr-2 h-4 w-4" />
              Actualizar
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <div className="rounded-2xl border border-dashed border-border bg-background/70 p-6 text-sm text-muted-foreground">
                Cargando agenda operativa...
              </div>
            ) : null}

            {!loading && filteredAppointments.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border bg-background/70 p-6 text-sm text-muted-foreground">
                No hay registros operativos para mostrar con los filtros actuales.
              </div>
            ) : null}

            {filteredAppointments.map((appointment) => (
              <article
                key={appointment.id}
                className="rounded-2xl border border-border bg-background/70 p-4 transition hover:border-primary/40"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
                        {appointment.date}
                      </span>
                      <span className="rounded-full bg-muted px-3 py-1 text-sm font-semibold text-muted-foreground">
                        {appointment.time}
                      </span>
                      <Badge className={statusClass(appointment.status)}>{appointment.status}</Badge>
                    </div>
                    <h3 className="mt-3 text-lg font-semibold text-deep">{appointment.patient}</h3>
                    <p className="text-sm text-muted-foreground">{appointment.treatment}</p>
                  </div>
                  <div className="text-sm text-muted-foreground md:text-right">
                    <p>{appointment.phone}</p>
                    <p>{appointment.email}</p>
                    <p className="mt-1 font-medium text-deep">{appointment.id}</p>
                  </div>
                </div>
                <p className="mt-3 rounded-2xl bg-white px-4 py-3 text-sm leading-6 text-muted-foreground">
                  {appointment.note}
                </p>
                <p className="mt-2 text-xs text-muted-foreground">Canal: {appointment.source}</p>
              </article>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Operación</CardTitle>
              <CardDescription>Indicadores de lectura. Las acciones reales quedan para una fase posterior.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {operationalTasks.map((task) => {
                const Icon = task.icon;
                return (
                  <div key={task.title} className="rounded-2xl border border-border bg-background/70 p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-primary/10 text-primary">
                          <Icon className="h-4 w-4" />
                        </span>
                        <p className="font-semibold text-deep">{task.title}</p>
                      </div>
                      <span className="text-right text-xl font-bold text-deep">{task.value}</span>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">{task.description}</p>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Pacientes</CardTitle>
              <CardDescription>Búsqueda operativa sin historia clínica ni datos financieros.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  className="pl-9"
                  placeholder="Buscar paciente, teléfono, correo o servicio"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
              </div>
              <div className="mt-4 rounded-2xl border border-dashed border-border bg-background/70 p-4 text-sm leading-6 text-muted-foreground">
                <div className="flex items-center gap-3 font-medium text-deep">
                  <UserRound className="h-4 w-4" />
                  {filteredPatientProfiles.length} perfil(es) administrativo(s) visibles
                </div>
                <p className="mt-2">
                  Esta vista deriva de leads/citas existentes y no expone historia clínica, métricas financieras ni CRM
                  estratégico.
                </p>
              </div>

              <div className="mt-4 space-y-3">
                {filteredPatientProfiles.slice(0, 6).map((profile) => (
                  <article key={profile.id} className="rounded-2xl border border-border bg-background/70 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-deep">{profile.displayName}</p>
                        <p className="text-sm text-muted-foreground">{profile.phone}</p>
                        <p className="text-sm text-muted-foreground">{profile.email}</p>
                      </div>
                      <Badge
                        variant="outline"
                        className={
                          profile.missingFields.length > 0
                            ? "border-amber-200 bg-amber-50 text-amber-700"
                            : "border-emerald-200 bg-emerald-50 text-emerald-700"
                        }
                      >
                        {profile.completionPercentage}%
                      </Badge>
                    </div>
                    <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      {profile.missingFields.length > 0
                        ? `Faltan: ${profile.missingFields.join(", ")}`
                        : "Listo para validación administrativa"}
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">Interés: {profile.treatmentInterest}</p>
                  </article>
                ))}
              </div>

              <div className="mt-4 rounded-2xl border border-primary/20 bg-primary/5 p-4 text-sm leading-6 text-muted-foreground">
                <p className="font-medium text-deep">Validación de perfiles en preparación</p>
                <p className="mt-1">
                  {incompleteProfiles} perfil(es) requieren datos administrativos antes de habilitar edición segura en la
                  siguiente etapa.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <OperationalAnalyticsWorkspace />

      <OperationalConsolidationWorkspace />

      <LeadOperationsWorkspace />

      <PatientManagementWorkspace />

    </div>
  );
}

import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ClipboardCheck,
  Layers3,
  RefreshCcw,
  Search,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { PatientAdministrativeProfile } from "@/lib/patients/admin-profile";
import type { LeadOperationsProfile } from "@/server/leads/operations-repository";

type PatientsListResponse = {
  success?: boolean;
  patients?: PatientAdministrativeProfile[];
  error?: string;
};

type LeadOperationsResponse = {
  success?: boolean;
  leadOperations?: LeadOperationsProfile[];
  error?: string;
};

type ConsolidatedRecord = {
  id: string;
  displayName: string;
  phone: string;
  email: string;
  treatmentInterest: string;
  operationalStatus: string;
  priority: string;
  administrativeStatus: PatientAdministrativeProfile["administrativeStatus"] | "sin-perfil";
  completionPercentage: number;
  nextFollowUpAt: string;
  internalNote: string;
  sourceLeadId: string;
};

function normalize(value: string | undefined) {
  return (value ?? "").toLowerCase().trim();
}

function patientMatchesLead(
  patient: PatientAdministrativeProfile,
  leadOperations: LeadOperationsProfile,
) {
  const lead = leadOperations.lead;
  const sourceIds = patient.sourceLeadIds ?? [];

  return (
    sourceIds.includes(leadOperations.leadId) ||
    (!!patient.email && normalize(patient.email) === normalize(lead.email)) ||
    (!!patient.phone && normalize(patient.phone) === normalize(lead.phone))
  );
}

function formatDate(value: string) {
  if (!value) return "Sin seguimiento";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("es-PA", { dateStyle: "medium" }).format(date);
}

function operationalStatusLabel(status: string) {
  if (status === "contactado") return "Contactado";
  if (status === "seguimiento") return "Seguimiento";
  if (status === "descartado") return "Descartado";
  return "Nuevo";
}

function administrativeStatusLabel(status: ConsolidatedRecord["administrativeStatus"]) {
  if (status === "verified") return "Verificado";
  if (status === "pending-verification") return "Pendiente de verificación";
  if (status === "incomplete") return "Incompleto";
  return "Sin perfil";
}

function statusClass(status: string) {
  if (status === "verified" || status === "contactado")
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  if (status === "pending-verification" || status === "seguimiento")
    return "border-blue-200 bg-blue-50 text-blue-700";
  if (status === "descartado") return "border-slate-200 bg-slate-50 text-slate-700";
  return "border-amber-200 bg-amber-50 text-amber-700";
}

function priorityClass(priority: string) {
  if (priority === "alta") return "border-red-200 bg-red-50 text-red-700";
  if (priority === "baja") return "border-slate-200 bg-slate-50 text-slate-700";
  return "border-primary/20 bg-primary/5 text-primary";
}

function buildConsolidatedRecords(
  leadOperations: LeadOperationsProfile[],
  patients: PatientAdministrativeProfile[],
): ConsolidatedRecord[] {
  return leadOperations.map((item) => {
    const patient = patients.find((profile) => patientMatchesLead(profile, item));
    const lead = item.lead;

    return {
      id: `${item.leadId}-${patient?.id ?? "sin-perfil"}`,
      displayName: patient?.displayName || lead.name || "Lead sin nombre",
      phone: patient?.phone || lead.phone || "Teléfono no registrado",
      email: patient?.email || lead.email || "Correo no registrado",
      treatmentInterest: patient?.treatmentInterest || lead.treatment || "Servicio por definir",
      operationalStatus: item.operationalStatus,
      priority: item.priority,
      administrativeStatus: patient?.administrativeStatus ?? "sin-perfil",
      completionPercentage: patient?.completionPercentage ?? 0,
      nextFollowUpAt: item.nextFollowUpAt,
      internalNote: item.internalNote,
      sourceLeadId: item.leadId,
    };
  });
}

export function OperationalConsolidationWorkspace() {
  const [leadOperations, setLeadOperations] = useState<LeadOperationsProfile[]>([]);
  const [patients, setPatients] = useState<PatientAdministrativeProfile[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadConsolidatedData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [leadOperationsResponse, patientsResponse] = await Promise.all([
        fetch("/api/leads/operations", { credentials: "same-origin" }),
        fetch("/api/patients/list", { credentials: "same-origin" }),
      ]);

      const [leadOperationsPayload, patientsPayload] = (await Promise.all([
        leadOperationsResponse.json(),
        patientsResponse.json(),
      ])) as [LeadOperationsResponse, PatientsListResponse];

      if (!leadOperationsResponse.ok || !leadOperationsPayload.success) {
        throw new Error(leadOperationsPayload.error ?? "No se pudo cargar la operación de leads.");
      }

      if (!patientsResponse.ok || !patientsPayload.success) {
        throw new Error(
          patientsPayload.error ?? "No se pudo cargar la gestión administrativa de pacientes.",
        );
      }

      setLeadOperations(leadOperationsPayload.leadOperations ?? []);
      setPatients(patientsPayload.patients ?? []);
    } catch (loadError) {
      setLeadOperations([]);
      setPatients([]);
      setError(
        loadError instanceof Error
          ? loadError.message
          : "No se pudo cargar la consolidación operativa.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadConsolidatedData();
  }, []);

  const records = useMemo(
    () => buildConsolidatedRecords(leadOperations, patients),
    [leadOperations, patients],
  );

  const filteredRecords = useMemo(() => {
    const normalizedQuery = normalize(query);
    if (!normalizedQuery) return records;

    return records.filter((record) =>
      [
        record.displayName,
        record.phone,
        record.email,
        record.treatmentInterest,
        record.operationalStatus,
        record.priority,
        record.administrativeStatus,
        record.sourceLeadId,
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery),
    );
  }, [records, query]);

  const pendingFollowUps = records.filter(
    (record) => record.operationalStatus === "seguimiento",
  ).length;
  const highPriority = records.filter((record) => record.priority === "alta").length;
  const pendingVerification = records.filter(
    (record) =>
      record.administrativeStatus === "incomplete" ||
      record.administrativeStatus === "pending-verification",
  ).length;

  return (
    <Card className="shadow-soft">
      <CardHeader className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Layers3 className="h-5 w-5 text-primary" />
            Consolidación operativa
          </CardTitle>
          <CardDescription>
            Une leads, seguimiento y perfil administrativo sin crear citas ni exponer información
            clínica.
          </CardDescription>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => void loadConsolidatedData()}
          disabled={loading}
        >
          <RefreshCcw className="mr-2 h-4 w-4" />
          Actualizar
        </Button>
      </CardHeader>

      <CardContent className="space-y-5">
        {error ? (
          <Alert variant="destructive">
            <AlertTitle>No se pudo cargar la consolidación</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}

        <section className="grid gap-3 md:grid-cols-3">
          <div className="rounded-2xl border border-border bg-background/70 p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-muted-foreground">Seguimientos</p>
              <ClipboardCheck className="h-4 w-4 text-primary" />
            </div>
            <p className="mt-2 text-2xl font-bold text-deep">
              {loading ? "..." : pendingFollowUps}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              requieren acompañamiento administrativo.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-background/70 p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-muted-foreground">Prioridad alta</p>
              <AlertTriangle className="h-4 w-4 text-primary" />
            </div>
            <p className="mt-2 text-2xl font-bold text-deep">{loading ? "..." : highPriority}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              sin crear urgencia artificial ni presión comercial.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-background/70 p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-muted-foreground">Perfiles por validar</p>
              <ShieldCheck className="h-4 w-4 text-primary" />
            </div>
            <p className="mt-2 text-2xl font-bold text-deep">
              {loading ? "..." : pendingVerification}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              solo datos administrativos, no clínicos.
            </p>
          </div>
        </section>

        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Buscar por paciente, lead, teléfono, correo, servicio o estado"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>

        {loading ? (
          <div className="rounded-2xl border border-dashed border-border bg-background/70 p-6 text-sm text-muted-foreground">
            Cargando vista consolidada...
          </div>
        ) : null}

        {!loading && filteredRecords.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-background/70 p-6 text-sm text-muted-foreground">
            No hay registros consolidados para mostrar con los filtros actuales.
          </div>
        ) : null}

        <div className="space-y-3">
          {filteredRecords.map((record) => (
            <article
              key={record.id}
              className="rounded-2xl border border-border bg-background/70 p-4"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className={statusClass(record.operationalStatus)}>
                      {operationalStatusLabel(record.operationalStatus)}
                    </Badge>
                    <Badge variant="outline" className={priorityClass(record.priority)}>
                      Prioridad {record.priority}
                    </Badge>
                    <Badge variant="outline" className={statusClass(record.administrativeStatus)}>
                      {administrativeStatusLabel(record.administrativeStatus)}
                    </Badge>
                  </div>
                  <h3 className="mt-3 flex items-center gap-2 text-lg font-semibold text-deep">
                    <UserRound className="h-4 w-4 text-primary" />
                    {record.displayName}
                  </h3>
                  <p className="text-sm text-muted-foreground">{record.treatmentInterest}</p>
                </div>
                <div className="text-sm text-muted-foreground lg:text-right">
                  <p>{record.phone}</p>
                  <p>{record.email}</p>
                  <p className="mt-1 font-medium text-deep">Lead: {record.sourceLeadId}</p>
                </div>
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-3">
                <div className="rounded-2xl bg-white px-4 py-3 text-sm text-muted-foreground">
                  <p className="font-medium text-deep">Perfil administrativo</p>
                  <p>{record.completionPercentage}% completo</p>
                </div>
                <div className="rounded-2xl bg-white px-4 py-3 text-sm text-muted-foreground">
                  <p className="font-medium text-deep">Próximo seguimiento</p>
                  <p>{formatDate(record.nextFollowUpAt)}</p>
                </div>
                <div className="rounded-2xl bg-white px-4 py-3 text-sm text-muted-foreground">
                  <p className="font-medium text-deep">Nota operativa</p>
                  <p>{record.internalNote || "Sin nota interna registrada"}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

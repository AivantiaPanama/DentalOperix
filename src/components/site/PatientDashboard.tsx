import { useEffect, useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis } from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { Calendar, Briefcase, ClipboardList, CheckCircle2, Users, Sparkles } from "lucide-react";
import { mockLeads, type MockLead } from "@/lib/mock/leads";
import { SmallDashboard } from "@/components/site/SmallDashboard";
import { formatDateMX } from "@/lib/utils/date-format";

const defaultLeadData = mockLeads;

function useLeadData() {
  const [leads, setLeads] = useState<MockLead[]>(defaultLeadData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    let mounted = true;

    async function fetchLeads() {
      try {
        const response = await fetch("/api/leads/list");
        if (!response.ok) {
          throw new Error("Fallo al cargar leads");
        }

        const json = await response.json();
        if (mounted && Array.isArray(json.leads)) {
          setLeads(json.leads);
          if (json.fallback) {
            setError(json.message ?? "Mostrando datos demo.");
          }
        }
      } catch (error) {
        console.warn("Usando datos mock para leads:", error);
        if (mounted) {
          setError("No se pudo cargar los leads reales. Usando datos demo.");
          setLeads(defaultLeadData);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchLeads();

    return () => {
      mounted = false;
    };
  }, []);

  return { leads, loading, error };
}

function computeSummary(leads: MockLead[]) {
  const totalLeads = leads.length;
  const scheduledAppointments = leads.filter((lead) => lead.status === "agendada").length;
  const treatmentCounts = leads.reduce(
    (acc, lead) => {
      acc[lead.treatment] = (acc[lead.treatment] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );
  const leadsByTreatment = treatmentCounts;
  const treatmentChartData = Object.entries(treatmentCounts).map(([treatment, value]) => ({
    treatment,
    value,
  }));
  const topTreatments = Object.entries(treatmentCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 4)
    .map(([treatment, value]) => ({ treatment, value }));

  return { totalLeads, scheduledAppointments, leadsByTreatment, treatmentChartData, topTreatments };
}

const COMPACT_DASHBOARD_STORAGE_KEY = "dentaloperix.showCompactDashboard";

export function PatientDashboard() {
  const { leads, loading, error } = useLeadData();
  const [showCompactDashboard, setShowCompactDashboard] = useState(() => {
    if (typeof window === "undefined") return true;
    const stored = window.localStorage.getItem(COMPACT_DASHBOARD_STORAGE_KEY);
    return stored === null ? true : stored === "true";
  });

  useEffect(() => {
    window.localStorage.setItem(
      COMPACT_DASHBOARD_STORAGE_KEY,
      showCompactDashboard ? "true" : "false",
    );
  }, [showCompactDashboard]);

  const { totalLeads, scheduledAppointments, leadsByTreatment, treatmentChartData, topTreatments } =
    useMemo(() => computeSummary(leads), [leads]);

  const downloadReport = () => {
    const headers = ["Fecha", "Nombre", "Tratamiento", "Estado", "Email", "Origen"];
    const rows = leads.map((lead) => [
      formatDateMX(lead.createdAt),
      lead.name,
      lead.treatment,
      lead.status,
      lead.email,
      lead.source,
    ]);
    const csv = [headers, ...rows]
      .map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(","))
      .join("\r\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `reporte-leads-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <span className="chip">CRM demo</span>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-deep sm:text-4xl">
            Panel CRM de DentalOperix
          </h1>
          <p className="mt-1 text-muted-foreground">
            Resumen de leads, tratamientos y citas agendadas con datos de ejemplo.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            disabled={loading}
            onClick={() => setShowCompactDashboard((current) => !current)}
            variant="outline"
            className="rounded-full"
          >
            {showCompactDashboard ? "Ocultar resumen rápido" : "Mostrar resumen rápido"}
          </Button>
          <Button
            disabled={loading}
            onClick={downloadReport}
            className="shrink-0 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Exportar reporte
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="mb-6 rounded-3xl border border-dashed border-border bg-slate-50 px-4 py-3 text-sm text-slate-600">
          Cargando leads desde el endpoint... Usando datos mock mientras se resuelve.
        </div>
      ) : null}

      <div
        className={`mb-6 overflow-hidden rounded-3xl transition-all duration-300 ease-out ${
          showCompactDashboard
            ? "max-h-[2000px] opacity-100 pointer-events-auto"
            : "max-h-0 opacity-0 pointer-events-none"
        }`}
        aria-hidden={!showCompactDashboard}
      >
        <SmallDashboard
          totalLeads={totalLeads}
          scheduledAppointments={scheduledAppointments}
          uniqueTreatments={Object.keys(leadsByTreatment).length}
          topTreatments={topTreatments}
          loading={loading}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="rounded-3xl border border-border bg-white shadow-soft">
          <CardHeader>
            <div className="flex items-center gap-3 text-primary">
              <Sparkles className="h-5 w-5" />
              <CardTitle>Total de leads</CardTitle>
            </div>
            <CardDescription>Leads registrados en el CRM demo.</CardDescription>
          </CardHeader>
          <CardContent className="pt-0 text-4xl font-semibold text-deep">{totalLeads}</CardContent>
        </Card>

        <Card className="rounded-3xl border border-border bg-white shadow-soft">
          <CardHeader>
            <div className="flex items-center gap-3 text-emerald-600">
              <CheckCircle2 className="h-5 w-5" />
              <CardTitle>Citas agendadas</CardTitle>
            </div>
            <CardDescription>Leads que ya tienen cita programada.</CardDescription>
          </CardHeader>
          <CardContent className="pt-0 text-4xl font-semibold text-deep">
            {scheduledAppointments}
          </CardContent>
        </Card>

        <Card className="rounded-3xl border border-border bg-white shadow-soft">
          <CardHeader>
            <div className="flex items-center gap-3 text-sky-600">
              <Calendar className="h-5 w-5" />
              <CardTitle>Tratamientos únicos</CardTitle>
            </div>
            <CardDescription>Tipos de tratamientos en el CRM.</CardDescription>
          </CardHeader>
          <CardContent className="pt-0 text-4xl font-semibold text-deep">
            {Object.keys(leadsByTreatment).length}
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 grid gap-4 xl:grid-cols-[minmax(0,1fr)_420px]">
        <Card className="rounded-3xl border border-border bg-white shadow-soft">
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 text-deep">
                <Briefcase className="h-5 w-5" />
                <CardTitle>Leads por tratamiento</CardTitle>
              </div>
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-primary">
                Modelo mock
              </span>
            </div>
            <CardDescription>Gráfico que muestra los tratamientos más solicitados.</CardDescription>
            {error ? <p className="mt-2 text-sm text-amber-700">{error}</p> : null}
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-[320px]">
              <ChartContainer config={{ treatment: { label: "Leads", color: "#22c55e" } }}>
                <BarChart
                  data={treatmentChartData}
                  margin={{ top: 20, right: 8, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="treatment" stroke="#64748b" tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" tickLine={false} axisLine={false} />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Legend verticalAlign="top" height={36} />
                  <Bar dataKey="value" name="Leads" fill="#22c55e" radius={[12, 12, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border border-border bg-white shadow-soft">
          <CardHeader>
            <div className="flex items-center gap-3 text-deep">
              <Users className="h-5 w-5" />
              <CardTitle>Visión general</CardTitle>
            </div>
            <CardDescription>Datos de leads y estado del pipeline.</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              {Object.entries(leadsByTreatment).map(([treatment, count]) => (
                <div
                  key={treatment}
                  className="flex items-center justify-between gap-4 rounded-3xl border border-border/80 bg-slate-50 px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-semibold text-deep">{treatment}</p>
                    <p className="text-xs text-muted-foreground">Leads registrados</p>
                  </div>
                  <span className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-deep shadow-sm">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 grid gap-4">
        <Card className="rounded-3xl border border-border bg-white shadow-soft">
          <CardHeader>
            <div className="flex items-center gap-3 text-deep">
              <ClipboardList className="h-5 w-5" />
              <CardTitle>Leads recientes</CardTitle>
            </div>
            <CardDescription>Últimos leads registrados en el demo.</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Tratamiento</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Origen</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="py-8 text-center text-sm text-slate-500">
                        Cargando leads desde el endpoint... usando datos demo mientras se obtiene la
                        información.
                      </TableCell>
                    </TableRow>
                  ) : (
                    leads.map((lead) => (
                      <TableRow key={lead.id}>
                        <TableCell>{formatDateMX(lead.createdAt)}</TableCell>
                        <TableCell>{lead.name}</TableCell>
                        <TableCell>{lead.treatment}</TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusBadgeColor(lead.status)}`}
                          >
                            {lead.status}
                          </span>
                        </TableCell>
                        <TableCell>{lead.email}</TableCell>
                        <TableCell>{lead.source}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function statusBadgeColor(status: string) {
  switch (status) {
    case "agendada":
      return "bg-emerald-50 text-emerald-700";
    case "completada":
      return "bg-slate-100 text-slate-900";
    case "cancelada":
      return "bg-rose-50 text-rose-700";
    case "no asistió":
      return "bg-orange-50 text-orange-700";
    case "nuevo":
      return "bg-sky-50 text-sky-700";
    default:
      return "bg-slate-50 text-slate-700";
  }
}

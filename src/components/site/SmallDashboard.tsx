import { Calendar, CheckCircle2, Sparkles, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { MockLead } from "@/lib/mock/leads";

type Props = {
  totalLeads: number;
  scheduledAppointments: number;
  uniqueTreatments: number;
  topTreatments: Array<{ treatment: string; value: number }>;
  loading: boolean;
};

export function SmallDashboard({
  totalLeads,
  scheduledAppointments,
  uniqueTreatments,
  topTreatments,
  loading,
}: Props) {
  return (
    <div className="mb-6 rounded-3xl border border-border bg-white p-5 shadow-soft">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-muted-foreground">
            Dashboard compacto
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-deep">Resumen rápido</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Una vista condensada de leads, citas y tratamientos.
          </p>
        </div>
        <span className="rounded-full border border-border bg-slate-100 px-3 py-1 text-sm font-semibold text-muted-foreground">
          {loading ? "Actualizando..." : "Actualizado"}
        </span>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="rounded-3xl border border-border bg-slate-50 p-4">
          <CardHeader>
            <div className="flex items-center gap-2 text-slate-900">
              <Sparkles className="h-4 w-4" />
              <CardTitle className="text-sm">Leads</CardTitle>
            </div>
            <CardDescription className="mt-2 text-3xl font-semibold text-deep">
              {totalLeads}
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="rounded-3xl border border-border bg-slate-50 p-4">
          <CardHeader>
            <div className="flex items-center gap-2 text-emerald-600">
              <CheckCircle2 className="h-4 w-4" />
              <CardTitle className="text-sm">Citas agendadas</CardTitle>
            </div>
            <CardDescription className="mt-2 text-3xl font-semibold text-deep">
              {scheduledAppointments}
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="rounded-3xl border border-border bg-slate-50 p-4">
          <CardHeader>
            <div className="flex items-center gap-2 text-sky-600">
              <Calendar className="h-4 w-4" />
              <CardTitle className="text-sm">Tratamientos</CardTitle>
            </div>
            <CardDescription className="mt-2 text-3xl font-semibold text-deep">
              {uniqueTreatments}
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="rounded-3xl border border-border bg-slate-50 p-4">
          <CardHeader>
            <div className="flex items-center gap-2 text-deep">
              <Users className="h-4 w-4" />
              <CardTitle className="text-sm">Top servicios</CardTitle>
            </div>
            <CardDescription className="mt-2 text-3xl font-semibold text-deep">
              {topTreatments.length}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {topTreatments.length > 0 ? (
          topTreatments.map((item) => (
            <div key={item.treatment} className="rounded-3xl border border-border/80 bg-white p-4">
              <p className="text-sm font-semibold text-deep">{item.treatment}</p>
              <p className="mt-2 text-2xl font-bold text-deep">{item.value}</p>
              <p className="text-xs text-muted-foreground">Leads registrados</p>
            </div>
          ))
        ) : (
          <div className="rounded-3xl border border-border/80 bg-white p-4 text-sm text-muted-foreground">
            No hay suficientes datos para mostrar los tratamientos principales.
          </div>
        )}
      </div>
    </div>
  );
}

import { CalendarClock, ClipboardList, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TodayScheduleWidget } from "@/components/assistant/TodayScheduleWidget";
import { LeadQueueWidget } from "@/components/assistant/LeadQueueWidget";
import { CommercialDemoJourneyCard } from "@/components/assistant/CommercialDemoJourneyCard";

const shellCards = [
  {
    title: "Front Desk Workspace",
    description: "Espacio operativo del asistente para iniciar el turno sin acceder a vistas administrativas.",
    icon: ShieldCheck,
  },
  {
    title: "Agenda diaria",
    description: "Vista read-only de citas del día preparada para la operación del front desk.",
    icon: CalendarClock,
  },
  {
    title: "Cola de leads",
    description: "Activo desde PR-61.2-03 como vista read-only. Leads permanecen como Source of Truth.",
    icon: ClipboardList,
  },
] as const;

export function AssistantDashboard() {
  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-primary/20 bg-primary/5 p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">61.2 Assistant Workspace</p>
        <h2 className="mt-3 text-2xl font-bold text-deep">Front Desk Workspace</h2>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
          Shell operativo para asistentes. Este PR habilita navegación y agenda de hoy sin introducir Patient
          Management, Clinical Records, asignaciones, nuevas fuentes de verdad ni cambios de persistencia.
        </p>
      </section>

      <TodayScheduleWidget />

      <CommercialDemoJourneyCard />

      <LeadQueueWidget />

      <section className="grid gap-4 md:grid-cols-3" aria-label="Módulos del workspace asistente">
        {shellCards.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.title} className="shadow-soft">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{item.title}</CardTitle>
                <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </section>
    </div>
  );
}

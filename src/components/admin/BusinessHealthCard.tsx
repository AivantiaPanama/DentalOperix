import type { BusinessHealthScore } from "@/lib/business-health";

type Props = {
  health: BusinessHealthScore;
};

const statusLabels: Record<BusinessHealthScore["status"], string> = {
  excellent: "Excelente",
  good: "Bueno",
  warning: "Advertencia",
  critical: "Crítico",
};

export function BusinessHealthCard({ health }: Props) {
  return (
    <div className="rounded-3xl border border-border bg-white p-6 shadow-soft">
      <p className="text-sm uppercase tracking-[0.18em] text-muted-foreground">
        Health score comercial
      </p>
      <div className="mt-5 flex items-end gap-4">
        <p className="text-5xl font-bold tracking-tight text-deep">{health.score}</p>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-deep">
          {statusLabels[health.status]}
        </span>
      </div>
      <p className="mt-4 text-sm text-muted-foreground">
        El estado actual es {statusLabels[health.status].toLowerCase()} según conversión,
        asistencia, cancelaciones y crecimiento.
      </p>
    </div>
  );
}

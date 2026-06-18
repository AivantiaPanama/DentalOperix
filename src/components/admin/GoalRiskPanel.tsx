import type { GoalRisk } from "@/lib/goal-engine";

type Props = {
  risk: GoalRisk;
};

const riskLabels: Record<keyof GoalRisk, { title: string; detail: string }> = {
  leads: {
    title: "Leads",
    detail: "La proyección de leads no alcanza la meta mensual y puede requerir más captación.",
  },
  conversion: {
    title: "Conversión",
    detail: "La tasa de conversión actual está por debajo de la meta y limita el volumen de citas.",
  },
  attendance: {
    title: "Asistencia",
    detail: "La asistencia está por debajo del objetivo y puede reducir el cierre de tratamientos.",
  },
  pipelineValue: {
    title: "Valor potencial",
    detail:
      "El pipeline proyectado no alcanza el objetivo mensual y necesita mejorar la calidad de leads.",
  },
};

export function GoalRiskPanel({ risk }: Props) {
  const riskEntries = (Object.keys(risk) as Array<keyof GoalRisk>).filter((key) => risk[key]);

  return (
    <div className="rounded-3xl border border-border bg-white p-6 shadow-soft">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-muted-foreground">
            Riesgos de objetivo
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-deep">Visibilidad de riesgo</h2>
        </div>
        <span className="rounded-full bg-rose-500 px-3 py-1 text-xs font-semibold text-rose-50">
          {riskEntries.length === 0
            ? "0 riesgos"
            : `${riskEntries.length} riesgo${riskEntries.length > 1 ? "s" : ""}`}
        </span>
      </div>

      <div className="mt-5 space-y-4 text-sm leading-6 text-muted-foreground">
        {riskEntries.length === 0 ? (
          <div className="rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-900">
            ✅ Todos los objetivos están en buen camino según la proyección y las tasas actuales.
          </div>
        ) : (
          riskEntries.map((key) => (
            <div key={key} className="rounded-2xl border border-rose-100 bg-rose-50 p-4">
              <p className="text-sm font-semibold text-rose-900">🔴 {riskLabels[key].title}</p>
              <p className="mt-2 text-sm text-rose-800">{riskLabels[key].detail}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

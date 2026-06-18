import type { BusinessRecommendation } from "@/lib/recommendation-engine";

type Props = {
  recommendations: BusinessRecommendation[];
};

function getPriorityBadge(priority: BusinessRecommendation["priority"]) {
  switch (priority) {
    case "high":
      return "🔴 Alta";
    case "medium":
      return "🟡 Media";
    case "low":
      return "🔵 Baja";
    default:
      return "🔵 Baja";
  }
}

export function RecommendationsPanel({ recommendations }: Props) {
  if (recommendations.length === 0) {
    return (
      <div className="rounded-3xl border border-border bg-white p-6 shadow-soft">
        <h2 className="text-2xl font-semibold text-deep">Recomendaciones operativas</h2>
        <p className="mt-4 text-sm text-muted-foreground">
          No hay recomendaciones disponibles con los datos actuales.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-border bg-white p-6 shadow-soft">
      <div className="mb-6">
        <p className="text-sm uppercase tracking-[0.18em] text-muted-foreground">
          Recomendaciones operativas
        </p>
        <h2 className="text-2xl font-semibold text-deep">Acciones recomendadas</h2>
      </div>
      <div className="space-y-4">
        {recommendations.map((recommendation) => (
          <div
            key={recommendation.id}
            className="rounded-3xl border border-border/80 bg-slate-50 p-5"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-deep">{recommendation.title}</p>
              <span className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-muted-foreground">
                {getPriorityBadge(recommendation.priority)}
              </span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">{recommendation.description}</p>
            <p className="mt-3 text-sm font-medium text-deep">Acción: {recommendation.action}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

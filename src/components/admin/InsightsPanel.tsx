import type { BusinessInsight } from "@/lib/business-insights";

type Props = {
  insights: BusinessInsight[];
};

function getInsightIcon(type: BusinessInsight["type"]) {
  switch (type) {
    case "success":
      return "✅";
    case "warning":
      return "⚠️";
    case "info":
      return "ℹ️";
    default:
      return "💡";
  }
}

export function InsightsPanel({ insights }: Props) {
  return (
    <div className="rounded-3xl border border-border bg-white p-6 shadow-soft">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-muted-foreground">
            Insights ejecutivos
          </p>
          <h2 className="text-2xl font-semibold text-deep">Observaciones automáticas</h2>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {insights.map((insight, index) => (
          <div
            key={`${insight.title}-${index}`}
            className="rounded-3xl border border-border/80 bg-slate-50 p-5"
          >
            <div className="flex items-start gap-3">
              <span className="text-3xl leading-none">{getInsightIcon(insight.type)}</span>
              <div>
                <p className="text-sm font-semibold text-deep">{insight.title}</p>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{insight.message}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

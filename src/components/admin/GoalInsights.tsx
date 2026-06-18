type Props = {
  insights: string[];
};

export function GoalInsights({ insights }: Props) {
  return (
    <div className="rounded-3xl border border-border bg-white p-6 shadow-soft">
      <p className="text-sm uppercase tracking-[0.18em] text-muted-foreground">
        Insight de objetivos
      </p>
      <div className="mt-5 space-y-3 text-sm leading-6 text-muted-foreground">
        {insights.length > 0 ? (
          insights.map((insight, index) => <p key={`${index}-${insight}`}>{insight}</p>)
        ) : (
          <p>No hay insights disponibles para los objetivos actualmente.</p>
        )}
      </div>
    </div>
  );
}

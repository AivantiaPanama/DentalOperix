type ExecutiveSummaryProps = {
  summary: string[];
};

export function ExecutiveSummary({ summary }: ExecutiveSummaryProps) {
  return (
    <div className="rounded-3xl border border-border bg-white p-6 shadow-soft">
      <p className="text-sm uppercase tracking-[0.18em] text-muted-foreground">Resumen ejecutivo</p>
      <div className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
        {summary.length > 0 ? (
          summary.map((line, index) => <p key={`${index}-${line}`}>{line}</p>)
        ) : (
          <p>Sin resumen disponible todavía.</p>
        )}
      </div>
    </div>
  );
}

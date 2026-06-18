type SourceChartProps = {
  data: Array<{ source: string; value: number }>;
};

export function SourceChart({ data }: SourceChartProps) {
  return (
    <div className="mt-6 space-y-4">
      {data.map((item) => (
        <div key={item.source} className="space-y-2">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{item.source}</span>
            <span>{item.value}%</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-primary" style={{ width: `${item.value}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

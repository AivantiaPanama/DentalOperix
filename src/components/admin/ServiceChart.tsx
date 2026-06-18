type ServiceChartProps = {
  data: Array<{ service: string; value: number }>;
};

export function ServiceChart({ data }: ServiceChartProps) {
  return (
    <div className="mt-6 space-y-4">
      {data.map((item) => (
        <div key={item.service} className="space-y-2">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{item.service}</span>
            <span>{item.value}</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-emerald-500"
              style={{ width: `${Math.min(item.value, 100)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

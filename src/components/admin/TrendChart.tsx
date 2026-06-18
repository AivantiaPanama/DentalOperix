import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";
import type { TrendPoint } from "@/lib/crm-metrics";

type TrendChartProps = {
  data: TrendPoint[];
  title?: string;
};

export function TrendChart({ data, title }: TrendChartProps) {
  return (
    <div className="rounded-3xl border border-border bg-white p-6 shadow-soft">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-deep">{title ?? "Tendencia"}</h2>
          <p className="text-sm text-muted-foreground">Leads, agendadas y completadas</p>
        </div>
      </div>
      {data.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border/80 bg-slate-50 p-8 text-center text-sm text-muted-foreground">
          No hay datos disponibles para esta tendencia.
        </div>
      ) : (
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 24, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="label" stroke="#64748b" tickLine={false} axisLine={false} />
              <YAxis stroke="#64748b" tickLine={false} axisLine={false} />
              <Tooltip formatter={(value) => [value, ""]} />
              <Legend verticalAlign="top" height={36} />
              <Line type="monotone" dataKey="leads" stroke="#2563eb" strokeWidth={2} dot={false} />
              <Line
                type="monotone"
                dataKey="agendadas"
                stroke="#14b8a6"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="completadas"
                stroke="#059669"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ServiceTrendPoint } from "@/lib/crm-metrics";

type ServiceTrendChartProps = {
  data: ServiceTrendPoint[];
};

export function ServiceTrendChart({ data }: ServiceTrendChartProps) {
  const sorted = [...data].sort((a, b) => b.leads - a.leads).slice(0, 5);

  if (sorted.length === 0) {
    return (
      <div className="rounded-3xl border border-border bg-white p-6 text-center text-sm text-muted-foreground shadow-soft">
        Sin datos disponibles todavía.
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-border bg-white p-6 shadow-soft">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-deep">Tendencia de servicios</h3>
        <p className="text-sm text-muted-foreground">Top 5 servicios con mayor volumen de leads.</p>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={sorted} margin={{ top: 10, right: 24, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis dataKey="service" stroke="#64748b" tickLine={false} axisLine={false} />
            <YAxis stroke="#64748b" tickLine={false} axisLine={false} />
            <Tooltip formatter={(value) => [value, "Leads"]} />
            <Legend verticalAlign="top" height={36} />
            <Bar dataKey="leads" fill="#2563eb" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

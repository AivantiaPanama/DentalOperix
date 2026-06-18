import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { SourceConversionItem } from "@/lib/crm-metrics";

type SourceConversionTableProps = {
  items: SourceConversionItem[];
};

function formatPercent(value: number) {
  return `${Number(value.toFixed(1)).toLocaleString("es-PA")} %`;
}

export function SourceConversionTable({ items }: SourceConversionTableProps) {
  const sorted = [...items].sort((a, b) => b.conversionRate - a.conversionRate);

  if (sorted.length === 0) {
    return (
      <div className="rounded-3xl border border-border bg-white p-6 text-center text-sm text-muted-foreground shadow-soft">
        Sin datos disponibles todavía.
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-border bg-white p-6 shadow-soft">
      <h3 className="mb-4 text-lg font-semibold text-deep">Conversión por fuente</h3>
      <Table>
        <TableCaption>Fuentes ordenadas por mayor conversión.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Fuente</TableHead>
            <TableHead>Leads</TableHead>
            <TableHead>Convertidos</TableHead>
            <TableHead>Conversión %</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.map((item) => (
            <TableRow key={item.source}>
              <TableCell>{item.source}</TableCell>
              <TableCell>{item.leads}</TableCell>
              <TableCell>{item.completed}</TableCell>
              <TableCell>{formatPercent(item.conversionRate)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

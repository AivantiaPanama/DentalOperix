import { Card, CardContent, CardHeader } from "@/components/ui/card";

type PipelineValueCardProps = {
  totalValue: number;
};

const currencyFormatter = new Intl.NumberFormat("es-PA", {
  style: "currency",
  currency: "USD",
});

export function PipelineValueCard({ totalValue }: PipelineValueCardProps) {
  return (
    <Card className="rounded-3xl border border-border bg-white shadow-soft">
      <CardHeader className="p-6">
        <p className="text-sm uppercase tracking-[0.18em] text-muted-foreground">
          Valor potencial estimado
        </p>
        <p className="mt-4 text-3xl font-semibold tracking-tight text-deep">
          {currencyFormatter.format(totalValue)}
        </p>
      </CardHeader>
      <CardContent className="border-t border-border/80 p-6 pt-4 text-sm text-muted-foreground">
        Este valor representa el pipeline estimado de servicios activos, sin incluir cancelados o no
        asistidos.
      </CardContent>
    </Card>
  );
}

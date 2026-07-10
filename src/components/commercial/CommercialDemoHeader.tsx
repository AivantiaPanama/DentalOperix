import { Badge } from "@/components/ui/badge";
import { commercialDemoFoundation } from "@/data/commercialDemoFoundation";

export function CommercialDemoHeader() {
  const { scenario } = commercialDemoFoundation;

  return (
    <section className="rounded-3xl border border-primary/20 bg-primary/5 p-6 sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Commercial Presentation Layer
          </p>
          <h1 className="mt-3 text-3xl font-bold text-deep sm:text-4xl">
            {scenario.name}
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground">
            {scenario.description}
          </p>
        </div>
        <Badge variant="secondary" className="text-sm">
          {scenario.id}
        </Badge>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <Badge variant="outline">Audiencia: {scenario.audience}</Badge>
        <Badge variant="outline">Objetivo: {scenario.commercialGoal}</Badge>
      </div>
    </section>
  );
}

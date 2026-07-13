import { Badge } from "@/components/ui/badge";
import type { CommercialPresentationModel } from "@/features/commercial-demo/presentation/commercialPresentation.types";

type CommercialDemoHeaderProps = {
  header: CommercialPresentationModel["header"];
};

export function CommercialDemoHeader({ header }: CommercialDemoHeaderProps) {
  return (
    <section className="rounded-3xl border border-primary/20 bg-primary/5 p-6 sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            {header.eyebrow}
          </p>
          <h1 className="mt-3 text-3xl font-bold text-deep sm:text-4xl">{header.title}</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground">
            {header.description}
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {header.badges.map((badge) => (
          <Badge key={badge} variant="outline">
            {badge}
          </Badge>
        ))}
      </div>
    </section>
  );
}

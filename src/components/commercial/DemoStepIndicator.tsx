import type { CommercialPresentationModel } from "@/features/commercial-demo/presentation/commercialPresentation.types";

type DemoStepIndicatorProps = {
  steps: CommercialPresentationModel["steps"];
};

export function DemoStepIndicator({ steps }: DemoStepIndicatorProps) {
  return (
    <section className="grid gap-3 md:grid-cols-4" aria-label="Indicador de pasos de la demo comercial">
      {steps.map((step, index) => (
        <div key={`${step.title}-${index}`} className="rounded-2xl border border-border bg-background/70 p-4">
          <p className="text-sm font-semibold text-primary">{index + 1}</p>
          <h3 className="mt-2 text-base font-semibold text-deep">{step.title}</h3>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{step.description}</p>
        </div>
      ))}
    </section>
  );
}

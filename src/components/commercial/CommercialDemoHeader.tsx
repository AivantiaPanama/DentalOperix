import { Badge } from "@/components/ui/badge";
import type { CommercialPresentationModel } from "@/features/commercial-demo/presentation/commercialPresentation.types";

type CommercialDemoHeaderProps = {
  header: CommercialPresentationModel["header"];
};

export function CommercialDemoHeader({ header }: CommercialDemoHeaderProps) {
  return (
    <section className="rounded-3xl border border-primary/20 bg-primary/5 p-6 sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            {header.eyebrow}
          </p>
          <h1 className="mt-3 text-3xl font-bold text-deep sm:text-4xl">
            Experiencia guiada de DentalOperix
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground">
            {header.description}
          </p>
          <p className="mt-5 rounded-2xl border border-primary/20 bg-background/70 p-4 text-sm leading-7 text-foreground shadow-sm">
            Esta demostración inicia una historia operativa completa para la clínica: desde el
            primer contacto de un paciente potencial hasta la síntesis final de lo que DentalOperix
            hace visible.
          </p>

          <div className="mt-5 grid gap-3 md:grid-cols-2">
            <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
              <p className="text-sm font-semibold text-deep">Qué vivirá la clínica</p>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li>• Un recorrido guiado que parte de una oportunidad real.</li>
                <li>• Varios actores operativos que participan en la misma historia.</li>
                <li>• Evidencia que se acumula a lo largo del día clínico.</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
              <p className="text-sm font-semibold text-deep">Por qué importa</p>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li>• El recorrido conecta llegada, coordinación, clínica y administración.</li>
                <li>• El cierre ofrece una conclusión útil para la toma de decisiones.</li>
                <li>
                  • La experiencia se presenta como una historia coherente, no como pantallas
                  aisladas.
                </li>
              </ul>
            </div>
          </div>
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

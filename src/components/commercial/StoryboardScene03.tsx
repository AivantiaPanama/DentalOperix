import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  Mail,
  Sparkles,
  UserRound,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { CommercialPresentationModel } from "@/features/commercial-demo/presentation/commercialPresentation.types";

type StoryboardScene03Props = {
  presentation: CommercialPresentationModel;
};

const transformationSteps = [
  {
    icon: UserRound,
    title: "1. Solicitud de cita",
    description: "El paciente solicita atención y su intención queda visible desde el inicio.",
  },
  {
    icon: ClipboardCheck,
    title: "2. Información recibida",
    description: "DentalOperix recibe la información y la vuelve parte de un contexto útil.",
  },
  {
    icon: Sparkles,
    title: "3. Lead registrado",
    description:
      "El lead queda registrado como parte de una secuencia que ya no depende de memoria.",
  },
  {
    icon: CalendarDays,
    title: "4. Agenda preparada",
    description: "La información se organiza y la agenda queda lista para avanzar con claridad.",
  },
  {
    icon: Mail,
    title: "5. Confirmación enviada",
    description: "Se envía la confirmación y la clínica recibe el proceso listo para continuar.",
  },
  {
    icon: CheckCircle2,
    title: "6. Cambio operativo",
    description: "La clínica comprende que ahora puede trabajar de otra manera.",
  },
] as const;

export function StoryboardScene03({ presentation }: StoryboardScene03Props) {
  return (
    <section className="rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-background to-background p-6 sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            S03 · La clínica descubre que puede trabajar de otra manera
          </p>
          <h2 className="mt-3 text-3xl font-bold text-deep sm:text-4xl">
            La información deja de ser dispersa y empieza a convertirse en una operación más clara.
          </h2>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            La secuencia ya no depende únicamente de notas, llamadas y relecturas. La clínica
            empieza a ver una forma de trabajar más ordenada, con menos fricción y con mayor
            continuidad. {presentation.header.title} funciona aquí como la referencia narrativa de
            esta transformación.
          </p>
        </div>
        <Badge variant="secondary">Paso 3</Badge>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card className="border-border/70 bg-background/70">
          <CardHeader>
            <CardTitle className="text-lg text-deep">La secuencia del cambio</CardTitle>
            <CardDescription>
              Una progresión sencilla que muestra la transformación operativa sin entrar en detalle
              técnico.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {transformationSteps.map((step) => {
                const Icon = step.icon;
                return (
                  <div
                    key={step.title}
                    className="rounded-xl border border-border/60 bg-background/80 p-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 rounded-full bg-primary/10 p-2 text-primary">
                        <Icon className="h-4 w-4" aria-hidden="true" />
                      </div>
                      <div>
                        <p className="font-semibold text-deep">{step.title}</p>
                        <p className="mt-1 text-sm leading-6 text-muted-foreground">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/70 bg-background/70">
          <CardHeader>
            <CardTitle className="text-lg text-deep">Evidencia narrativa</CardTitle>
            <CardDescription>
              La clínica comprende que el cambio ya está ocurriendo.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                <span>La información se organiza de forma más clara y consistente.</span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                <span>La agenda queda preparada sin depender de relecturas manuales.</span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                <span>
                  La clínica recibe todo listo y entiende que ahora puede trabajar de otra manera.
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

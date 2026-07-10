import { ArrowRight, Sparkles } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { commercialDemoFoundation } from "@/data/commercialDemoFoundation";

export function CommercialEvidencePanel() {
  const { commercialEvidence } = commercialDemoFoundation;

  return (
    <Card className="shadow-soft" aria-label="Panel de evidencia comercial">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg text-deep">
          <Sparkles className="h-5 w-5 text-primary" aria-hidden="true" />
          Evidencia comercial
        </CardTitle>
        <CardDescription>
          Narrativa de valor para mostrar cómo la experiencia comercial se transforma en oportunidades organizadas.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-2xl border border-border bg-background/70 p-4">
          <p className="text-sm font-semibold text-deep">Antes</p>
          <p className="mt-2 text-sm text-muted-foreground">Contactos dispersos y seguimiento poco claro.</p>
          <div className="mt-4 flex items-center gap-2 text-sm text-primary">
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
            <span>Después</span>
          </div>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            {commercialEvidence.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

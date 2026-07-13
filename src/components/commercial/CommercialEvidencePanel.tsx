import { ArrowRight, Sparkles } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { CommercialPresentationModel } from "@/features/commercial-demo/presentation/commercialPresentation.types";

type CommercialEvidencePanelProps = {
  evidence: CommercialPresentationModel["evidence"];
};

export function CommercialEvidencePanel({ evidence }: CommercialEvidencePanelProps) {
  return (
    <Card className="shadow-soft" aria-label="Panel de evidencia comercial">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg text-deep">
          <Sparkles className="h-5 w-5 text-primary" aria-hidden="true" />
          {evidence.title}
        </CardTitle>
        <CardDescription>{evidence.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-2xl border border-border bg-background/70 p-4">
          <p className="text-sm font-semibold text-deep">Antes</p>
          <p className="mt-2 text-sm text-muted-foreground">{evidence.beforeMessage}</p>
          <div className="mt-4 flex items-center gap-2 text-sm text-primary">
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
            <span>Después</span>
          </div>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            {evidence.items.map((item) => (
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

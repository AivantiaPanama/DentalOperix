import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { CommercialLandingPage } from "@/components/commercial-engagement/CommercialLandingPage";

export const Route = createFileRoute("/clinicas")({
  head: () => ({ meta: [
    { title: "Diagnóstico para clínicas dentales — DentalOperix" },
    { name: "description", content: "Identifique oportunidades de mejora en captación, agenda y operación con un diagnóstico inicial para clínicas dentales." },
  ] }),
  component: ClinicsLandingRoute,
});

function ClinicsLandingRoute() {
  return <SiteLayout><CommercialLandingPage /></SiteLayout>;
}

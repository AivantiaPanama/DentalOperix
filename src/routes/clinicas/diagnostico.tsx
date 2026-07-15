import { createFileRoute } from "@tanstack/react-router";
import { QuickAssessmentPage } from "@/components/commercial-engagement/QuickAssessmentPage";

export const Route = createFileRoute("/clinicas/diagnostico")({
  head: () => ({
    meta: [
      { title: "Diagnóstico rápido — DentalOperix" },
      {
        name: "description",
        content: "Evaluación inicial de preparación para el crecimiento de clínicas dentales.",
      },
    ],
  }),
  component: QuickAssessmentPage,
});

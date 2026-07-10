const steps = [
  { title: "Paciente", description: "Interés inicial y comprensión del valor dental." },
  { title: "Oportunidad", description: "La interacción se convierte en una oportunidad clara." },
  { title: "Clínica", description: "La clínica acompaña el recorrido con seguimiento ordenado." },
  { title: "Resultado", description: "Se materializa valor comercial y narración de seguimiento." },
];

export function DemoStepIndicator() {
  return (
    <section className="grid gap-3 md:grid-cols-4" aria-label="Indicador de pasos de la demo comercial">
      {steps.map((step, index) => (
        <div key={step.title} className="rounded-2xl border border-border bg-background/70 p-4">
          <p className="text-sm font-semibold text-primary">{index + 1}</p>
          <h3 className="mt-2 text-base font-semibold text-deep">{step.title}</h3>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{step.description}</p>
        </div>
      ))}
    </section>
  );
}

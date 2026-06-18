import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function BookingCTA({ onBook }: { onBook: () => void }) {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <div className="relative overflow-hidden rounded-3xl border border-border bg-white p-8 shadow-soft sm:p-12">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-10 h-72 w-72 rounded-full bg-deep/10 blur-3xl" />
        <div className="relative grid items-center gap-6 md:grid-cols-[1fr_auto]">
          <div>
            <span className="chip">Atención</span>
            <h3 className="mt-3 text-2xl font-bold tracking-tight text-deep sm:text-3xl">
              Solicita atención dental
            </h3>
            <p className="mt-2 max-w-xl text-muted-foreground">
              Tomaremos tus datos para coordinar la cita y confirmar la información necesaria.
            </p>
          </div>
          <Button
            onClick={onBook}
            size="lg"
            className="rounded-full bg-primary px-7 text-primary-foreground shadow-glow hover:bg-primary/90"
          >
            Solicitar Atención <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}

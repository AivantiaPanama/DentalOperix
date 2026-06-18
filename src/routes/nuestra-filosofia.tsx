import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/nuestra-filosofia")({
  head: () => ({
    meta: [
      { title: "Nuestra Filosofía — DentalOperix" },
      { name: "description", content: "Conoce la filosofía de atención de DentalOperix." },
      { property: "og:title", content: "Nuestra Filosofía — DentalOperix" },
      {
        property: "og:description",
        content: "Atención dental profesional, respetuosa y organizada.",
      },
    ],
  }),
  component: NuestraFilosofiaPage,
});

function NuestraFilosofiaPage() {
  return (
    <SiteLayout>
      {(openBooking: () => void) => (
        <>
          <section className="gradient-hero">
            <div className="mx-auto max-w-4xl px-6 py-16 text-center sm:py-20">
              <span className="chip">Nuestra Filosofía</span>
              <h1 className="mt-4 text-4xl font-bold tracking-tight text-deep sm:text-5xl">
                Atención dental profesional
              </h1>
              <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
                Creemos que la atención dental debe ofrecer información clara, trato respetuoso y
                una comunicación organizada con cada paciente.
              </p>
            </div>
          </section>

          <section className="mx-auto max-w-5xl px-6 py-14">
            <div className="grid gap-6 md:grid-cols-2">
              <article className="rounded-3xl border border-border bg-white p-6 shadow-soft">
                <h2 className="text-xl font-bold text-deep">Nuestra forma de atender</h2>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  Sabemos que muchas personas llegan a la consulta con dudas, nervios o experiencias
                  previas poco agradables. Por eso buscamos que cada paso sea comprensible y que el
                  paciente pueda avanzar con tranquilidad.
                </p>
              </article>

              <article className="rounded-3xl border border-border bg-white p-6 shadow-soft">
                <h2 className="text-xl font-bold text-deep">Tecnología con propósito</h2>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  Utilizamos herramientas digitales para coordinar citas, mejorar la comunicación y
                  dar seguimiento. La tecnología apoya la atención; no reemplaza el trato humano.
                </p>
              </article>
            </div>

            <div className="mt-8 rounded-3xl border border-border bg-white p-6 shadow-soft sm:p-8">
              <h2 className="text-2xl font-bold text-deep">Principios de atención</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  ["Escuchar", "Cada paciente merece ser atendido con respeto."],
                  ["Explicar", "La información debe ser sencilla y comprensible."],
                  ["Acompañar", "La atención continúa antes y después de la consulta."],
                  ["Organizar", "La coordinación forma parte de una buena atención."],
                  ["Respetar", "Cada persona puede hacer preguntas y tomar decisiones con calma."],
                  ["Cuidar", "El objetivo es atender necesidades dentales y cuidar personas."],
                ].map(([title, text]) => (
                  <div key={title} className="rounded-2xl bg-secondary/60 p-4">
                    <h3 className="font-semibold text-deep">{title}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 rounded-3xl border border-border bg-deep p-6 text-white shadow-soft sm:p-8">
              <h2 className="text-2xl font-bold">Nuestro compromiso</h2>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-white/80">
                Nos comprometemos a construir una experiencia donde el paciente se sienta informado,
                respetado y acompañado durante el proceso de atención.
              </p>
              <Button
                onClick={openBooking}
                className="mt-6 rounded-full bg-white text-deep hover:bg-white/90"
              >
                Solicitar Atención
              </Button>
            </div>
          </section>
        </>
      )}
    </SiteLayout>
  );
}

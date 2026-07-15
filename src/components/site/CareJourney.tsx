import { careJourneyStories } from "@/data/careJourneyStories";

export function CareJourney() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16 sm:py-20">
      <div className="mx-auto max-w-3xl text-center">
        <span className="chip">Nuestra atención</span>
        <h2 className="mt-4 text-3xl font-bold tracking-tight text-deep sm:text-4xl md:text-5xl">
          Historias de atención pensadas con calma y claridad.
        </h2>
        <p className="mt-5 text-base leading-7 text-muted-foreground sm:text-lg">
          Cada visita comienza con una conversación respetuosa, una explicación clara y el
          acompañamiento necesario para tomar decisiones informadas.
        </p>
      </div>

      <div className="mt-14 space-y-14 sm:mt-20 sm:space-y-20">
        {careJourneyStories.map((story, index) => {
          const isReversed = index % 2 === 1;

          return (
            <article key={story.title} className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
              <div className={isReversed ? "lg:order-2" : undefined}>
                <div className="overflow-hidden rounded-[2rem] border border-border bg-white shadow-soft">
                  <img
                    src={story.image}
                    alt={story.alt}
                    className="aspect-[16/10] h-full w-full object-cover"
                    loading={index === 0 ? "eager" : "lazy"}
                  />
                </div>
              </div>

              <div className="mx-auto max-w-xl lg:mx-0">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
                  {story.title}
                </p>
                <h3 className="mt-4 text-2xl font-bold leading-tight text-deep sm:text-3xl">
                  {story.message}
                </h3>
              </div>
            </article>
          );
        })}
      </div>

      <div className="mt-16 rounded-[2rem] border border-border bg-white p-8 text-center shadow-soft sm:mt-24 sm:p-12">
        <span className="chip">Nuestra filosofía</span>
        <h3 className="mx-auto mt-4 max-w-3xl text-2xl font-bold leading-tight text-deep sm:text-3xl">
          Creemos que una atención adecuada comienza por escuchar, explicar con claridad y acompañar
          cada decisión de manera respetuosa.
        </h3>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
          Sin presión comercial, sin urgencia artificial y sin lenguaje exagerado: solo una
          experiencia profesional, paciente y humana.
        </p>
      </div>
    </section>
  );
}

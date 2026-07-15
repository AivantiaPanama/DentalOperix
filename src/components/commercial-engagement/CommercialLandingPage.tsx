import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BarChart3,
  CalendarCheck,
  CheckCircle2,
  ClipboardCheck,
  HeartHandshake,
  MessageCircleMore,
  Sparkles,
  UsersRound,
} from "lucide-react";

const challenges = [
  "Pacientes potenciales que solicitan información y no reciben seguimiento oportuno.",
  "Cancelaciones, reprogramaciones y espacios difíciles de recuperar en la agenda.",
  "Mucho tiempo invertido en tareas administrativas repetitivas.",
  "Información distribuida entre WhatsApp, agendas, hojas de cálculo y notas.",
  "Poca visibilidad sobre pacientes nuevos, citas y oportunidades pendientes.",
];

const steps = [
  {
    icon: ClipboardCheck,
    title: "Diagnóstico",
    text: "Un cuestionario móvil de aproximadamente cuatro minutos.",
  },
  {
    icon: BarChart3,
    title: "Informe inicial",
    text: "Observaciones y oportunidades priorizadas para su clínica.",
  },
  {
    icon: Sparkles,
    title: "Demostración",
    text: "Un recorrido de DentalOperix adaptado a sus prioridades.",
  },
  {
    icon: HeartHandshake,
    title: "Piloto",
    text: "Una validación gradual, controlada y de bajo riesgo.",
  },
];

const benefits = [
  "Una visión organizada de sus principales oportunidades operativas.",
  "Recomendaciones iniciales enfocadas en acciones concretas.",
  "Una demostración relevante para la realidad de su equipo.",
  "La posibilidad de validar mejoras mediante un piloto controlado.",
];

export function CommercialLandingPage() {
  return (
    <main className="overflow-hidden bg-slate-50 text-slate-950">
      <section className="relative isolate border-b border-slate-200 bg-white">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,rgba(14,165,233,0.12),transparent_38%),radial-gradient(circle_at_bottom_left,rgba(20,184,166,0.10),transparent_34%)]" />
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-[1.15fr_.85fr] lg:px-8 lg:py-28">
          <div className="flex flex-col justify-center">
            <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-4 py-2 text-sm font-semibold text-cyan-800">
              <Sparkles className="h-4 w-4" />
              Diagnóstico inicial para clínicas dentales
            </div>
            <h1 className="max-w-4xl text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Crezca con procesos más organizados y una mejor experiencia para sus pacientes.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
              Identifique oportunidades en la captación de pacientes, la gestión de citas y la
              operación diaria antes de decidir qué tecnología necesita su clínica.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/clinicas/diagnostico"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-700 px-6 py-3.5 text-base font-semibold text-white shadow-sm transition hover:bg-cyan-800 focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:ring-offset-2"
              >
                Realizar diagnóstico gratuito
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                to="/commercial-demo"
                className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-base font-semibold text-slate-800 transition hover:border-slate-400 hover:bg-slate-50"
              >
                Conocer la demostración
              </Link>
            </div>
            <p className="mt-4 text-sm text-slate-500">
              Toma aproximadamente cuatro minutos. No solicitamos información de pacientes.
            </p>
          </div>

          <div className="relative">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60 sm:p-8">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-5">
                <div className="rounded-2xl bg-cyan-100 p-3 text-cyan-800">
                  <BarChart3 className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-cyan-700">Growth Readiness</p>
                  <h2 className="text-xl font-bold">Una primera lectura de su operación</h2>
                </div>
              </div>
              <div className="mt-6 space-y-4">
                {[
                  ["Captación y seguimiento", "Identifique dónde pueden perderse oportunidades."],
                  [
                    "Agenda y comunicación",
                    "Observe fricciones en citas, recordatorios y reprogramaciones.",
                  ],
                  ["Control operativo", "Evalúe qué tan accesible es la información para decidir."],
                ].map(([title, text]) => (
                  <div key={title} className="rounded-2xl bg-slate-50 p-4">
                    <div className="flex gap-3">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-teal-600" />
                      <div>
                        <p className="font-semibold">{title}</p>
                        <p className="mt-1 text-sm leading-6 text-slate-600">{text}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-cyan-700">
              ¿Le resulta familiar?
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Muchas clínicas crecen antes de que sus procesos estén preparados.
            </h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              El diagnóstico ayuda a reconocer dónde conviene concentrar primero el esfuerzo, sin
              comenzar por una venta o una implementación completa.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {challenges.map((challenge) => (
              <div
                key={challenge}
                className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-cyan-700" />
                <p className="leading-7 text-slate-700">{challenge}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-cyan-700">
              Cómo trabajamos
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Primero comprendemos. Después demostramos.
            </h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              Cada clínica tiene prioridades diferentes. Nuestro recorrido comienza con conocimiento
              y avanza de manera gradual.
            </p>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {steps.map(({ icon: Icon, title, text }, index) => (
              <article
                key={title}
                className="relative rounded-2xl border border-slate-200 bg-slate-50 p-6"
              >
                <span className="absolute right-5 top-5 text-sm font-bold text-slate-300">
                  0{index + 1}
                </span>
                <div className="mb-5 inline-flex rounded-xl bg-white p-3 text-cyan-700 shadow-sm">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold">{title}</h3>
                <p className="mt-2 leading-7 text-slate-600">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-10 rounded-3xl bg-slate-900 px-6 py-10 text-white sm:px-10 lg:grid-cols-2 lg:p-14">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-cyan-300">
              Lo que recibe
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight">
              Valor desde la primera conversación.
            </h2>
            <p className="mt-5 text-lg leading-8 text-slate-300">
              No necesita comprometerse con una implementación para comenzar a comprender
              oportunidades concretas de mejora.
            </p>
          </div>
          <div className="space-y-4">
            {benefits.map((benefit) => (
              <div
                key={benefit}
                className="flex gap-3 rounded-2xl bg-white/5 p-4 ring-1 ring-white/10"
              >
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-cyan-300" />
                <p className="leading-7 text-slate-100">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-3 lg:px-8 lg:py-20">
          {[
            [
              UsersRound,
              "Pensado para su equipo",
              "El diagnóstico considera la perspectiva de propietarios, odontólogos y personal administrativo.",
            ],
            [
              CalendarCheck,
              "Enfoque operativo",
              "Las recomendaciones se concentran en procesos que afectan la experiencia diaria de la clínica.",
            ],
            [
              MessageCircleMore,
              "Conversación sin presión",
              "El objetivo inicial es comprender y aportar claridad, no forzar una decisión de compra.",
            ],
          ].map(([Icon, title, text]) => {
            const FeatureIcon = Icon as typeof UsersRound;
            return (
              <article key={String(title)} className="rounded-2xl border border-slate-200 p-6">
                <FeatureIcon className="h-7 w-7 text-cyan-700" />
                <h3 className="mt-5 text-xl font-bold">{String(title)}</h3>
                <p className="mt-3 leading-7 text-slate-600">{String(text)}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="bg-cyan-50">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:py-20">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Descubra oportunidades de mejora para su clínica.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            Complete el diagnóstico inicial y prepare una conversación basada en las prioridades
            reales de su operación.
          </p>
          <Link
            to="/clinicas/diagnostico"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-cyan-700 px-6 py-3.5 font-semibold text-white transition hover:bg-cyan-800"
          >
            Iniciar diagnóstico
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </main>
  );
}

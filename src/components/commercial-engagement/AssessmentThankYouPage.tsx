import { Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, Home, ShieldCheck } from "lucide-react";

export function AssessmentThankYouPage() {
  return (
    <main className="flex min-h-[75vh] items-center bg-slate-50 px-4 py-16 sm:px-6">
      <section className="mx-auto w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-teal-100 text-teal-700"><CheckCircle2 className="h-9 w-9" /></div>
        <p className="mt-6 text-sm font-bold uppercase tracking-widest text-cyan-700">Diagnóstico completado</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Gracias por compartir información sobre su clínica.</h1>
        <p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-slate-600">Sus respuestas permiten preparar una lectura inicial sobre captación, agenda, seguimiento y operación. Ninguna respuesta incluyó información clínica de pacientes.</p>
        <div className="mt-8 rounded-2xl bg-slate-50 p-5 text-left">
          <div className="flex gap-3"><ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-cyan-700" /><p className="leading-7 text-slate-700">Esta versión conserva temporalmente las respuestas únicamente durante la sesión del navegador. La entrega y persistencia institucional se habilitarán cuando se apruebe el repositorio comercial correspondiente.</p></div>
        </div>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link to="/commercial-demo" className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-700 px-5 py-3 font-semibold text-white transition hover:bg-cyan-800">Conocer DentalOperix<ArrowRight className="h-4 w-4" /></Link>
          <Link to="/clinicas" className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"><Home className="h-4 w-4" />Volver al inicio</Link>
        </div>
      </section>
    </main>
  );
}

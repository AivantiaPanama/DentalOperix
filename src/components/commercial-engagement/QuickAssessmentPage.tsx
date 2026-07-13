import { useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Check, ClipboardCheck, ShieldCheck } from "lucide-react";

type FormState = {
  clinicName: string;
  respondent: string;
  role: string;
  dentists: string;
  adminStaff: string;
  acquisitionChannels: string[];
  leadTracking: string;
  lostOpportunities: string;
  schedulingTool: string;
  appointmentChallenges: string[];
  reminders: string;
  timeConsumers: string[];
  managementInformation: string;
  mainPriority: string;
  mainChallenge: string;
  wantsSummary: string;
  contactMethod: string;
  contactValue: string;
};

const initialState: FormState = {
  clinicName: "", respondent: "", role: "", dentists: "", adminStaff: "", acquisitionChannels: [], leadTracking: "",
  lostOpportunities: "", schedulingTool: "", appointmentChallenges: [], reminders: "", timeConsumers: [],
  managementInformation: "", mainPriority: "", mainChallenge: "", wantsSummary: "", contactMethod: "", contactValue: "",
};

const steps = ["Clínica", "Pacientes", "Agenda", "Operación", "Prioridad", "Contacto"];

const options = {
  roles: ["Propietario o director", "Odontólogo", "Administrador", "Recepcionista", "Otro"],
  dentists: ["1 odontólogo", "2 a 3 odontólogos", "4 a 6 odontólogos", "Más de 6 odontólogos"],
  adminStaff: ["Ninguna persona dedicada exclusivamente", "1 persona", "2 a 3 personas", "Más de 3 personas"],
  channels: ["Recomendaciones", "WhatsApp", "Llamadas telefónicas", "Redes sociales", "Página web", "Google", "Publicidad", "Alianzas o referidos", "Otro"],
  tracking: ["Sistema especializado", "Hoja de cálculo", "WhatsApp, libreta o notas", "Cada persona lo maneja de forma diferente", "No existe un registro organizado", "No estoy seguro"],
  frequency: ["Casi nunca", "Algunas veces", "Con frecuencia", "Muy frecuentemente", "No contamos con información para saberlo"],
  scheduling: ["Software especializado", "Google Calendar u otro calendario digital", "Hoja de cálculo", "Agenda física o libreta", "WhatsApp", "Combinación de varias herramientas", "Otro"],
  challenges: ["Pacientes que olvidan sus citas", "Cancelaciones de último momento", "Reprogramaciones frecuentes", "Espacios vacíos difíciles de ocupar", "Confusión de horarios o consultorios", "Dificultad para localizar información", "Doble registro", "Ninguna de las anteriores"],
  reminders: ["Automáticamente", "Manualmente", "Solo en algunos casos", "Generalmente no se envían", "No estoy seguro"],
  tasks: ["Responder solicitudes", "Registrar pacientes", "Agendar y reprogramar", "Confirmar citas", "Buscar información", "Dar seguimiento", "Preparar informes", "Coordinar al equipo", "Corregir errores o duplicaciones", "Otro"],
  information: ["Muy fácil", "Relativamente fácil", "Difícil", "Muy difícil", "No contamos con esta información"],
  priorities: ["Conseguir más pacientes", "Mejorar el seguimiento", "Organizar mejor la agenda", "Reducir cancelaciones y ausencias", "Ahorrar tiempo administrativo", "Mejorar la experiencia del paciente", "Tener mayor control e información", "Coordinar mejor al equipo", "Otra prioridad"],
};

function SingleChoice({ value, items, onChange }: { value: string; items: string[]; onChange: (value: string) => void }) {
  return <div className="grid gap-3 sm:grid-cols-2">{items.map((item) => <button key={item} type="button" onClick={() => onChange(item)} className={`rounded-xl border p-4 text-left text-sm font-medium transition ${value === item ? "border-cyan-700 bg-cyan-50 text-cyan-900 ring-1 ring-cyan-700" : "border-slate-200 bg-white text-slate-700 hover:border-cyan-300"}`}>{item}</button>)}</div>;
}

function MultiChoice({ values, items, limit, onChange }: { values: string[]; items: string[]; limit?: number; onChange: (values: string[]) => void }) {
  const toggle = (item: string) => {
    if (values.includes(item)) return onChange(values.filter((value) => value !== item));
    if (limit && values.length >= limit) return;
    onChange([...values, item]);
  };
  return <div className="grid gap-3 sm:grid-cols-2">{items.map((item) => <button key={item} type="button" onClick={() => toggle(item)} className={`flex items-start gap-3 rounded-xl border p-4 text-left text-sm font-medium transition ${values.includes(item) ? "border-cyan-700 bg-cyan-50 text-cyan-900 ring-1 ring-cyan-700" : "border-slate-200 bg-white text-slate-700 hover:border-cyan-300"}`}><span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border ${values.includes(item) ? "border-cyan-700 bg-cyan-700 text-white" : "border-slate-300"}`}>{values.includes(item) && <Check className="h-3.5 w-3.5" />}</span>{item}</button>)}</div>;
}

export function QuickAssessmentPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(initialState);
  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => setForm((current) => ({ ...current, [key]: value }));

  const canContinue = useMemo(() => {
    if (step === 0) return Boolean(form.clinicName && form.respondent && form.role && form.dentists);
    if (step === 1) return Boolean(form.acquisitionChannels.length && form.leadTracking && form.lostOpportunities);
    if (step === 2) return Boolean(form.schedulingTool && form.appointmentChallenges.length && form.reminders);
    if (step === 3) return Boolean(form.timeConsumers.length && form.managementInformation);
    if (step === 4) return Boolean(form.mainPriority && form.mainChallenge.trim().length >= 10);
    if (step === 5) return Boolean(form.wantsSummary && (form.wantsSummary === "No por el momento" || (form.contactMethod && form.contactValue)));
    return false;
  }, [form, step]);

  const submit = () => {
    const payload = { ...form, submittedAt: new Date().toISOString(), version: "GRA-01-v1.0" };
    sessionStorage.setItem("dentaloperix-growth-assessment", JSON.stringify(payload));
    navigate({ to: "/clinicas/gracias" });
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-950 sm:px-6 lg:py-12">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3"><div className="rounded-xl bg-cyan-100 p-2.5 text-cyan-800"><ClipboardCheck className="h-6 w-6" /></div><div><p className="text-sm font-semibold text-cyan-700">DentalOperix</p><h1 className="font-bold">Diagnóstico rápido</h1></div></div>
          <div className="hidden items-center gap-2 text-sm text-slate-500 sm:flex"><ShieldCheck className="h-4 w-4" />Sin datos de pacientes</div>
        </div>

        <div className="mb-6">
          <div className="flex justify-between text-xs font-semibold uppercase tracking-wider text-slate-500"><span>{steps[step]}</span><span>{step + 1} de {steps.length}</span></div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200"><div className="h-full rounded-full bg-cyan-700 transition-all" style={{ width: `${((step + 1) / steps.length) * 100}%` }} /></div>
        </div>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-9">
          {step === 0 && <div className="space-y-7"><header><h2 className="text-2xl font-bold">Conozcamos su clínica</h2><p className="mt-2 text-slate-600">Información general para contextualizar las recomendaciones.</p></header><label className="block"><span className="text-sm font-semibold">Nombre de la clínica *</span><input value={form.clinicName} onChange={(e) => set("clinicName", e.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-cyan-700 focus:ring-2 focus:ring-cyan-100" /></label><label className="block"><span className="text-sm font-semibold">Su nombre *</span><input value={form.respondent} onChange={(e) => set("respondent", e.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-cyan-700 focus:ring-2 focus:ring-cyan-100" /></label><div><p className="mb-3 text-sm font-semibold">Su función *</p><SingleChoice value={form.role} items={options.roles} onChange={(v) => set("role", v)} /></div><div><p className="mb-3 text-sm font-semibold">¿Cuántos odontólogos trabajan regularmente? *</p><SingleChoice value={form.dentists} items={options.dentists} onChange={(v) => set("dentists", v)} /></div><div><p className="mb-3 text-sm font-semibold">Personal administrativo o de recepción</p><SingleChoice value={form.adminStaff} items={options.adminStaff} onChange={(v) => set("adminStaff", v)} /></div></div>}
          {step === 1 && <div className="space-y-8"><header><h2 className="text-2xl font-bold">Nuevos pacientes</h2><p className="mt-2 text-slate-600">Cómo llegan y cómo se les da seguimiento.</p></header><div><p className="mb-3 text-sm font-semibold">¿Por cuáles medios llegan principalmente? *</p><MultiChoice values={form.acquisitionChannels} items={options.channels} onChange={(v) => set("acquisitionChannels", v)} /></div><div><p className="mb-3 text-sm font-semibold">¿Cómo registran y siguen cada solicitud? *</p><SingleChoice value={form.leadTracking} items={options.tracking} onChange={(v) => set("leadTracking", v)} /></div><div><p className="mb-3 text-sm font-semibold">¿Con qué frecuencia se pierden oportunidades por falta de seguimiento? *</p><SingleChoice value={form.lostOpportunities} items={options.frequency} onChange={(v) => set("lostOpportunities", v)} /></div></div>}
          {step === 2 && <div className="space-y-8"><header><h2 className="text-2xl font-bold">Agenda y citas</h2><p className="mt-2 text-slate-600">Identifiquemos las principales fricciones del flujo diario.</p></header><div><p className="mb-3 text-sm font-semibold">¿Cómo gestionan la agenda? *</p><SingleChoice value={form.schedulingTool} items={options.scheduling} onChange={(v) => set("schedulingTool", v)} /></div><div><p className="mb-1 text-sm font-semibold">¿Qué situaciones afectan más la organización? *</p><p className="mb-3 text-xs text-slate-500">Seleccione hasta dos.</p><MultiChoice values={form.appointmentChallenges} items={options.challenges} limit={2} onChange={(v) => set("appointmentChallenges", v)} /></div><div><p className="mb-3 text-sm font-semibold">¿Cómo se envían recordatorios? *</p><SingleChoice value={form.reminders} items={options.reminders} onChange={(v) => set("reminders", v)} /></div></div>}
          {step === 3 && <div className="space-y-8"><header><h2 className="text-2xl font-bold">Operación y control</h2><p className="mt-2 text-slate-600">Dónde se consume tiempo y qué tan visible es la información.</p></header><div><p className="mb-1 text-sm font-semibold">¿Qué tareas consumen más tiempo? *</p><p className="mb-3 text-xs text-slate-500">Seleccione hasta tres.</p><MultiChoice values={form.timeConsumers} items={options.tasks} limit={3} onChange={(v) => set("timeConsumers", v)} /></div><div><p className="mb-3 text-sm font-semibold">¿Qué tan fácil es obtener información para tomar decisiones? *</p><SingleChoice value={form.managementInformation} items={options.information} onChange={(v) => set("managementInformation", v)} /></div></div>}
          {step === 4 && <div className="space-y-8"><header><h2 className="text-2xl font-bold">Prioridad principal</h2><p className="mt-2 text-slate-600">Concentremos el diagnóstico en aquello que más valor podría generar.</p></header><div><p className="mb-3 text-sm font-semibold">Si pudiera mejorar una sola área en los próximos seis meses, ¿cuál elegiría? *</p><SingleChoice value={form.mainPriority} items={options.priorities} onChange={(v) => set("mainPriority", v)} /></div><label className="block"><span className="text-sm font-semibold">Describa brevemente el principal reto de la clínica. *</span><textarea value={form.mainChallenge} onChange={(e) => set("mainChallenge", e.target.value)} rows={5} placeholder="Puede responder en una o dos frases. No incluya información confidencial." className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-cyan-700 focus:ring-2 focus:ring-cyan-100" /><span className="mt-1 block text-xs text-slate-500">Mínimo 10 caracteres.</span></label></div>}
          {step === 5 && <div className="space-y-8"><header><h2 className="text-2xl font-bold">Siguiente paso</h2><p className="mt-2 text-slate-600">Indíquenos si desea recibir un resumen inicial.</p></header><div><p className="mb-3 text-sm font-semibold">¿Le gustaría recibir un resumen con oportunidades identificadas? *</p><SingleChoice value={form.wantsSummary} items={["Sí, deseo recibirlo", "Tal vez, me gustaría conocer más primero", "No por el momento"]} onChange={(v) => set("wantsSummary", v)} /></div>{form.wantsSummary && form.wantsSummary !== "No por el momento" && <><div><p className="mb-3 text-sm font-semibold">Medio preferido *</p><SingleChoice value={form.contactMethod} items={["Correo electrónico", "WhatsApp"]} onChange={(v) => set("contactMethod", v)} /></div><label className="block"><span className="text-sm font-semibold">{form.contactMethod === "WhatsApp" ? "Número de WhatsApp" : "Correo electrónico"} *</span><input value={form.contactValue} onChange={(e) => set("contactValue", e.target.value)} type={form.contactMethod === "Correo electrónico" ? "email" : "tel"} className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-cyan-700 focus:ring-2 focus:ring-cyan-100" /><span className="mt-2 block text-xs leading-5 text-slate-500">Utilizaremos este dato únicamente para dar continuidad al diagnóstico solicitado.</span></label></>}</div>}

          <div className="mt-10 flex items-center justify-between border-t border-slate-100 pt-6">
            <button type="button" onClick={() => step === 0 ? navigate({ to: "/clinicas" }) : setStep((value) => value - 1)} className="inline-flex items-center gap-2 rounded-xl px-4 py-3 font-semibold text-slate-600 transition hover:bg-slate-100"><ArrowLeft className="h-4 w-4" />Atrás</button>
            {step < steps.length - 1 ? <button type="button" disabled={!canContinue} onClick={() => setStep((value) => value + 1)} className="inline-flex items-center gap-2 rounded-xl bg-cyan-700 px-5 py-3 font-semibold text-white transition hover:bg-cyan-800 disabled:cursor-not-allowed disabled:opacity-40">Continuar<ArrowRight className="h-4 w-4" /></button> : <button type="button" disabled={!canContinue} onClick={submit} className="inline-flex items-center gap-2 rounded-xl bg-cyan-700 px-5 py-3 font-semibold text-white transition hover:bg-cyan-800 disabled:cursor-not-allowed disabled:opacity-40">Finalizar diagnóstico<Check className="h-4 w-4" /></button>}
          </div>
        </section>
      </div>
    </main>
  );
}

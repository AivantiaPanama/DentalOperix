import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { CalendarDays, FileText, HeartHandshake, Home, LogIn, ShieldCheck, UserRound } from "lucide-react";
import type { Role } from "@/lib/rbac/roles";

const roleLabels: Record<Role, string> = {
  administrator: "Administración",
  doctor: "Doctor",
  assistant: "Asistente",
  patient: "Paciente",
};

const roleDescriptions: Record<Role, string> = {
  administrator: "Vista administrativa protegida para operación, métricas y configuración.",
  doctor: "Espacio clínico preparado para agenda, pacientes, tratamientos y notas clínicas.",
  assistant: "Espacio operativo preparado para agenda, confirmaciones, check-in y check-out.",
  patient: "Portal preparado para próximas citas, indicaciones, documentos y solicitudes propias.",
};

const roleNavigation: Record<Role, Array<{ label: string; icon: typeof Home }>> = {
  administrator: [
    { label: "Resumen", icon: Home },
    { label: "Métricas", icon: FileText },
    { label: "Configuración", icon: ShieldCheck },
  ],
  doctor: [
    { label: "Agenda", icon: CalendarDays },
    { label: "Pacientes", icon: UserRound },
    { label: "Notas clínicas", icon: FileText },
  ],
  assistant: [
    { label: "Agenda diaria", icon: CalendarDays },
    { label: "Confirmaciones", icon: HeartHandshake },
    { label: "Check-in / Check-out", icon: LogIn },
  ],
  patient: [
    { label: "Mis citas", icon: CalendarDays },
    { label: "Indicaciones", icon: FileText },
    { label: "Solicitudes", icon: HeartHandshake },
  ],
};

export function RoleWorkspaceLayout({
  role,
  title,
  children,
}: {
  role: Role;
  title?: string;
  children: ReactNode;
}) {
  const label = title ?? roleLabels[role];
  const navigation = roleNavigation[role];

  return (
    <main className="min-h-screen bg-secondary/30 px-6 py-10">
      <section className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="rounded-3xl border border-border bg-white p-5 shadow-soft">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-primary/10 text-primary">
              <ShieldCheck className="h-4 w-4" />
            </span>
            <div>
              <p className="font-semibold text-deep">DentalOperix</p>
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
            </div>
          </div>
          <nav className="mt-6 space-y-2" aria-label={`Navegación ${label}`}>
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="flex items-center gap-3 rounded-2xl bg-secondary/60 px-4 py-3 text-sm font-medium text-muted-foreground"
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </div>
              );
            })}
          </nav>
        </aside>

        <section className="rounded-3xl border border-border bg-white p-8 shadow-soft">
          <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Dashboard protegido</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-deep">{label}</h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">{roleDescriptions[role]}</p>
          <div className="mt-8">{children}</div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/"
              className="rounded-full border border-border bg-white px-4 py-2 text-sm font-medium text-muted-foreground transition hover:border-primary hover:text-deep"
            >
              Volver al sitio público
            </Link>
            {role === "administrator" ? (
              <Link
                to="/admin/dashboard"
                className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
              >
                Ir a métricas
              </Link>
            ) : null}
          </div>
        </section>
      </section>
    </main>
  );
}

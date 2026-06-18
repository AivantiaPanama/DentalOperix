export type UserPortalRole = "admin" | "doctor" | "assistant" | "patient";

export type UserPortal = {
  id: UserPortalRole;
  title: string;
  footerLabel: string;
  path: string;
  audience: string;
  description: string;
  available: boolean;
  visibleNotes: string[];
};

export const userPortals: UserPortal[] = [
  {
    id: "patient",
    title: "Portal del Paciente",
    footerLabel: "Paciente",
    path: "/portal/paciente",
    audience: "Pacientes DentalOperix",
    description:
      "Espacio pensado para consultar próximas citas, indicaciones compartidas e información personal de atención cuando el portal esté disponible.",
    available: false,
    visibleNotes: [
      "Acceso limitado exclusivamente a la información propia del paciente.",
      "No mostrará datos de otros pacientes, agenda global ni información administrativa.",
    ],
  },
  {
    id: "doctor",
    title: "Portal Doctor",
    footerLabel: "Doctor",
    path: "/portal/doctor",
    audience: "Odontólogos y especialistas",
    description:
      "Dashboard clínico proyectado para revisar agenda profesional, pacientes asignados, tratamientos e indicaciones clínicas.",
    available: false,
    visibleNotes: [
      "No incluirá ingresos, métricas comerciales ni estrategia de negocio.",
      "El acceso requerirá autenticación y rol clínico autorizado.",
    ],
  },
  {
    id: "assistant",
    title: "Portal Asistente",
    footerLabel: "Asistente / Secretaria",
    path: "/portal/asistente",
    audience: "Asistentes y equipo de recepción",
    description:
      "Espacio operativo proyectado para apoyo de agenda, confirmaciones, seguimiento de pacientes y tareas administrativas no financieras.",
    available: false,
    visibleNotes: [
      "No incluirá ingresos, reportes comerciales ni configuración estratégica.",
      "El acceso requerirá autenticación y rol operativo autorizado.",
    ],
  },
  {
    id: "admin",
    title: "Portal Administración",
    footerLabel: "Administración",
    path: "/portal/administracion",
    audience: "Administración de la clínica",
    description:
      "Acceso reservado para dirección y administración. Este perfil concentra métricas internas, configuración, CRM y reportes de negocio.",
    available: false,
    visibleNotes: [
      "El enlace operativo de administración no se expone en el encabezado público.",
      "El acceso real permanecerá protegido por sesión, cookies seguras y permisos internos.",
    ],
  },
];

export function getUserPortalByPublicSlug(slug: string) {
  const normalized = slug.toLowerCase();

  if (normalized === "administracion") return userPortals.find((portal) => portal.id === "admin");
  if (normalized === "asistente" || normalized === "secretaria") {
    return userPortals.find((portal) => portal.id === "assistant");
  }

  return userPortals.find((portal) => portal.id === normalized);
}

export type LeadStatus = "nuevo" | "contactado" | "seguimiento" | "agendada" | "completada" | "cancelada" | "no interesado" | "no asistió";

export type MockLead = {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  phone: string;
  treatment: string;
  status: LeadStatus;
  source: string;
  preferredDate: string;
  notes?: string;
};

export const mockLeads: MockLead[] = [
  {
    id: "LD-001",
    createdAt: "2026-06-10",
    name: "Camila Ríos",
    email: "camila.rios@mail.cl",
    phone: "+56 9 8123 4567",
    treatment: "Ortodoncia",
    status: "nuevo",
    source: "web",
    preferredDate: "2026-06-18",
    notes: "Busca financiamiento para brackets invisibles.",
  },
  {
    id: "LD-002",
    createdAt: "2026-06-09",
    name: "Javier Soto",
    email: "javier.soto@mail.cl",
    phone: "+56 9 7654 3210",
    treatment: "Implante dental",
    status: "agendada",
    source: "chat-widget",
    preferredDate: "2026-06-20",
    notes: "Prefiere cita por la tarde.",
  },
  {
    id: "LD-003",
    createdAt: "2026-06-08",
    name: "María Pérez",
    email: "maria.perez@mail.cl",
    phone: "+56 9 9988 7766",
    treatment: "Blanqueamiento",
    status: "completada",
    source: "web",
    preferredDate: "2026-06-17",
    notes: "Quiere opciones de blanqueamiento rápido.",
  },
  {
    id: "LD-004",
    createdAt: "2026-06-07",
    name: "Lucía Suárez",
    email: "lucia.suarez@mail.cl",
    phone: "+56 9 3245 7812",
    treatment: "Carillas",
    status: "nuevo",
    source: "landing",
    preferredDate: "2026-06-22",
    notes: "Interesada en carillas de porcelana.",
  },
  {
    id: "LD-005",
    createdAt: "2026-06-06",
    name: "Pedro Fernández",
    email: "pedro.fernandez@mail.cl",
    phone: "+56 9 2334 5566",
    treatment: "Limpieza dental",
    status: "agendada",
    source: "web",
    preferredDate: "2026-06-15",
    notes: "Cita de control anual.",
  },
];

export const treatmentChartData = [
  { treatment: "Ortodoncia", value: 12 },
  { treatment: "Implante dental", value: 8 },
  { treatment: "Blanqueamiento", value: 6 },
  { treatment: "Carillas", value: 5 },
  { treatment: "Limpieza dental", value: 4 },
];

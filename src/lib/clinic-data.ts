export type Service = {
  id: string;
  name: string;
  description: string;
  duration: string;
  price: string;
  icon: string; // lucide name
  highlights: string[];
};

export const services: Service[] = [
  {
    id: "preventiva",
    name: "Odontología Preventiva",
    description:
      "Limpiezas profesionales, fluorización y diagnóstico temprano para mantener tu sonrisa sana.",
    duration: "45 min",
    price: "Desde $60",
    icon: "ShieldCheck",
    highlights: ["Limpieza ultrasónica", "Detección de caries", "Plan preventivo personalizado"],
  },
  {
    id: "ortodoncia",
    name: "Ortodoncia",
    description: "Brackets estéticos y alineadores invisibles con seguimiento digital 3D.",
    duration: "12-24 meses",
    price: "Desde $2,200",
    icon: "Smile",
    highlights: ["Brackets convencionales", "Alineadores invisibles", "Escaneo 3D"],
  },
  {
    id: "diseno",
    name: "Diseño de Sonrisa",
    description: "Carillas, blanqueamiento y reconstrucción estética para una sonrisa armónica.",
    duration: "2-4 sesiones",
    price: "Desde $1,300",
    icon: "Sparkles",
    highlights: ["Simulación digital", "Carillas porcelana", "Blanqueamiento LED"],
  },
  {
    id: "implantes",
    name: "Implantes Dentales",
    description:
      "Implantes de titanio con tecnología guiada por computador y cirugía mínimamente invasiva.",
    duration: "60-90 min",
    price: "Desde $1,900",
    icon: "Anchor",
    highlights: ["Cirugía guiada 3D", "Implantes dentales de alta calidad", "Corona en zirconio"],
  },
  {
    id: "odontopediatria",
    name: "Odontopediatría",
    description:
      "Atención dental amorosa y especializada para niños en un ambiente cálido y divertido.",
    duration: "30 min",
    price: "Desde $45",
    icon: "Baby",
    highlights: ["Especialistas infantiles", "Sala lúdica", "Educación dental"],
  },
];

export type Appointment = {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  status: "pending" | "confirmed" | "cancelled";
  notes?: string;
};

export const timeSlots = ["09:00", "10:00", "11:00", "12:00", "15:00", "16:00", "17:00", "18:00"];

// Mock initial appointments (some already booked)
const today = new Date();
const fmt = (d: Date) => d.toISOString().slice(0, 10);
const plus = (n: number) => {
  const d = new Date(today);
  d.setDate(d.getDate() + n);
  return fmt(d);
};

export const initialAppointments: Appointment[] = [
  {
    id: "a1",
    name: "María González",
    email: "maria@example.com",
    phone: "987654321",
    service: "Diseño de Sonrisa",
    date: plus(2),
    time: "10:00",
    status: "confirmed",
  },
  {
    id: "a2",
    name: "Carlos Pérez",
    email: "carlos@example.com",
    phone: "912345678",
    service: "Ortodoncia",
    date: plus(2),
    time: "15:00",
    status: "confirmed",
  },
  {
    id: "a3",
    name: "Ana Silva",
    email: "ana@example.com",
    phone: "956781234",
    service: "Odontología Preventiva",
    date: plus(5),
    time: "11:00",
    status: "confirmed",
  },
  {
    id: "a4",
    name: "Tú",
    email: "paciente@demo.cl",
    phone: "987000111",
    service: "Limpieza Dental",
    date: plus(7),
    time: "09:00",
    status: "confirmed",
    notes: "Control semestral",
  },
];

export const patientHistory = [
  {
    id: "h1",
    date: plus(-90),
    treatment: "Limpieza profunda + fluorización",
    professional: "Dra. Camila Ríos",
    status: "Completado",
  },
  {
    id: "h2",
    date: plus(-180),
    treatment: "Restauración composite molar 36",
    professional: "Dr. Felipe Soto",
    status: "Completado",
  },
  {
    id: "h3",
    date: plus(-365),
    treatment: "Blanqueamiento LED en consulta",
    professional: "Dra. Camila Ríos",
    status: "Completado",
  },
];

export const patientMessages = [
  {
    id: "m1",
    from: "Dra. Camila Ríos",
    subject: "Resultados de tu última revisión",
    preview: "Todo se ve excelente. Te recomiendo agendar tu control en 6 meses…",
    date: plus(-3),
    unread: true,
  },
  {
    id: "m2",
    from: "Recepción DentalOperix",
    subject: "Recordatorio de cita",
    preview: "Te esperamos el próximo martes a las 09:00 hrs.",
    date: plus(-1),
    unread: true,
  },
  {
    id: "m3",
    from: "Dr. Felipe Soto",
    subject: "Indicaciones post-tratamiento",
    preview: "Recuerda mantener una higiene cuidadosa los próximos días…",
    date: plus(-30),
    unread: false,
  },
];

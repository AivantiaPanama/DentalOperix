export type DentalService = {
  id: string;
  label: string;
  aliases: string[];
  shortDescription: string;
  patientExplanation: string;
  benefits: string[];
  idealFor: string[];
  cta: string;
};

export const DENTAL_SERVICES: DentalService[] = [
  {
    id: "odontologia-preventiva",
    label: "Odontología Preventiva",
    aliases: [
      "odontologia preventiva",
      "preventiva",
      "limpieza",
      "control",
      "revisión preventiva",
      "revisión dental",
    ],
    shortDescription:
      "Revisamos tu salud bucal, detectamos problemas tempranos y te orientamos para mantener una sonrisa sana.",
    patientExplanation:
      "Durante la consulta hacemos un examen completo de dientes y encías, evaluamos hábitos de higiene y te recomendamos los cuidados preventivos más adecuados.",
    benefits: [
      "Detecta caries y problemas a tiempo",
      "Reduce el riesgo de enfermedad periodontal",
      "Recibes una guía personalizada de cuidado dental",
    ],
    idealFor: [
      "Pacientes que desean prevenir problemas dentales",
      "Quienes quieren un chequeo regular",
      "Personas que buscan mantener su salud oral en buen estado",
    ],
    cta: "¿Te gustaría agendar una revisión preventiva para tu sonrisa?",
  },
  {
    id: "ortodoncia",
    label: "Ortodoncia",
    aliases: [
      "ortodoncia",
      "brackets",
      "alineadores",
      "alineadores invisibles",
      "dientes chuecos",
      "mordida",
    ],
    shortDescription:
      "Ajustamos la posición de tus dientes mediante tratamientos que pueden ser estéticos y personalizados según tu caso.",
    patientExplanation:
      "Evaluamos la alineación dental, la mordida y el movimiento necesario para diseñar un plan con brackets o alineadores que mejore tu función y apariencia.",
    benefits: [
      "Mejora la posición dental y la mordida",
      "Reduce el desgaste irregular de los dientes",
      "Ofrece opciones discretas según tu estilo",
    ],
    idealFor: [
      "Personas con dientes desalineados",
      "Pacientes con mordida cruzada o apiñamiento",
      "Adolescentes y adultos que buscan una sonrisa más armónica",
    ],
    cta: "¿Quieres saber si tu caso puede mejorar con ortodoncia?",
  },
  {
    id: "diseno-de-sonrisa",
    label: "Diseño de Sonrisa",
    aliases: ["diseño de sonrisa", "sonrisa", "estética dental", "carillas", "bonding"],
    shortDescription:
      "Trabajamos la estética dental para lograr una sonrisa más armónica con tratamientos adaptados a tu perfil.",
    patientExplanation:
      "Analizamos forma, color y proporciones dentales, revisamos tu sonrisa completa y te proponemos un plan estético acorde a tus expectativas.",
    benefits: [
      "Mejora la apariencia de tu sonrisa",
      "Combina estética y función dental",
      "Ofrece opciones personalizadas según tu caso",
    ],
    idealFor: [
      "Pacientes que desean una sonrisa más equilibrada",
      "Quienes quieren corregir forma o color dental",
      "Personas interesadas en carillas o estética integral",
    ],
    cta: "¿Te gustaría una valoración para conocer opciones de diseño de sonrisa?",
  },
  {
    id: "implantes-dentales",
    label: "Implantes Dentales",
    aliases: [
      "implantes dentales",
      "implante",
      "implantes",
      "me falta un diente",
      "falta un diente",
    ],
    shortDescription:
      "Reemplazamos piezas dentales faltantes con soluciones fijas que se planifican según tu caso y salud oral.",
    patientExplanation:
      "Verificamos tu estructura ósea, salud gingival y el espacio disponible para determinar si un implante es la opción adecuada.",
    benefits: [
      "Recupera función masticatoria",
      "No altera dientes vecinos sanos",
      "Planificación con tecnología digital",
    ],
    idealFor: [
      "Personas que han perdido uno o varios dientes",
      "Quienes buscan una solución fija y estable",
      "Pacientes que desean evitar prótesis removibles",
    ],
    cta: "¿Quieres evaluar si un implante es adecuado para ti?",
  },
  {
    id: "odontopediatria",
    label: "Odontopediatría",
    aliases: [
      "odontopediatria",
      "odontopediatría",
      "niños",
      "pediatría dental",
      "dentista infantil",
    ],
    shortDescription:
      "Atendemos a niños con un enfoque amable y adaptado para que su primera experiencia dental sea positiva.",
    patientExplanation:
      "Revisamos el crecimiento dental, hábitos de higiene y factores que pueden afectar la salud bucal de los más pequeños.",
    benefits: [
      "Ambiente cómodo para niños",
      "Prevención temprana de caries",
      "Educación y guía para toda la familia",
    ],
    idealFor: [
      "Niños en su primera consulta dental",
      "Familias que buscan seguimiento infantil",
      "Pacientes infantiles con miedo o ansiedad al dentista",
    ],
    cta: "¿Deseas agendar una consulta infantil para tu hijo?",
  },
  {
    id: "blanqueamiento-dental",
    label: "Blanqueamiento Dental",
    aliases: ["blanqueamiento dental", "blanqueamiento", "dientes blancos", "aclaramiento dental"],
    shortDescription:
      "Ayudamos a mejorar el tono de tus dientes con un tratamiento supervisado por profesionales.",
    patientExplanation:
      "Revisamos tu estado dental y de encías, evaluamos sensibilidad y determinamos qué método es más seguro para ti.",
    benefits: [
      "Mejora estética visible",
      "Procedimiento supervisado por profesionales",
      "Puede ayudar a reducir manchas externas",
    ],
    idealFor: [
      "Pacientes que desean una sonrisa más clara",
      "Personas con manchas por café, té o tabaco",
      "Quienes buscan un tono dental más uniforme",
    ],
    cta: "¿Te gustaría agendar una valoración para saber si eres candidato?",
  },
  {
    id: "endodoncia",
    label: "Endodoncia",
    aliases: [
      "endodoncia",
      "tratamiento de conducto",
      "muelas",
      "dolor de muelas",
      "sensibilidad dental",
    ],
    shortDescription:
      "Atendemos problemas de nervio dental para aliviar el dolor y conservar la pieza natural cuando es posible.",
    patientExplanation:
      "Evaluamos el origen de la molestia, realizamos el tratamiento del conducto y cuidamos la estructura dental para evitar extracciones.",
    benefits: [
      "Alivia dolor intenso",
      "Conserva el diente natural",
      "Reduce el riesgo de infección profunda",
    ],
    idealFor: [
      "Pacientes con dolor persistente en una pieza dental",
      "Quienes presentan sensibilidad prolongada",
      "Casos con caries profundas o inflamación pulpar",
    ],
    cta: "¿Quieres evaluar si necesitas un tratamiento de conducto?",
  },
  {
    id: "urgencias-dentales",
    label: "Urgencias Dentales",
    aliases: [
      "urgencias dentales",
      "urgencia",
      "dolor dental",
      "dolor de muelas",
      "me duele una muela",
      "sangrado",
      "trauma",
      "inflamación",
      "me sangran las encías",
    ],
    shortDescription:
      "Atendemos problemas dentales que requieren respuesta pronta y orientación para reducir complicaciones.",
    patientExplanation:
      "Evaluamos el origen del dolor, sangrado o trauma y te orientamos sobre el siguiente paso con prioridad.",
    benefits: [
      "Respuesta más oportuna",
      "Reduce riesgo de complicaciones",
      "Orientación inmediata sobre el manejo del caso",
    ],
    idealFor: [
      "Pacientes con dolor agudo",
      "Quienes presentan sangrado, inflamación o trauma",
      "Casos que requieren atención pronta",
    ],
    cta: "¿Te gustaría agendar una atención pronta para revisar tu caso?",
  },
  {
    id: "revision-dental",
    label: "Revisión Dental",
    aliases: [
      "revisión dental",
      "revision dental",
      "revisión",
      "revision",
      "control dental",
      "chequeo",
      "me sangran las encías",
    ],
    shortDescription:
      "Revisamos cambios recientes en tu salud bucal y te orientamos sobre el cuidado que necesitas.",
    patientExplanation:
      "Evaluamos tu estado actual, buscamos signos de caries o inflamación y te recomendamos los pasos a seguir.",
    benefits: [
      "Actualiza tu estado dental",
      "Detecta cambios recientes",
      "Refuerza tu plan de cuidado",
    ],
    idealFor: [
      "Pacientes con chequeos periódicos pendientes",
      "Quienes notaron cambios en sus dientes o encías",
      "Personas que quieren confirmar su salud bucal",
    ],
    cta: "¿Te gustaría una revisión rápida para detectar cualquier cambio reciente?",
  },
];

const normalize = (value: string) => value.trim().toLowerCase();

export function getDentalServiceById(id?: string) {
  if (!id) return undefined;
  return DENTAL_SERVICES.find((service) => service.id === id);
}

export function findDentalService(input: string) {
  const normalizedInput = normalize(input);
  if (!normalizedInput) return null;

  const exactMatch = DENTAL_SERVICES.find(
    (service) =>
      normalize(service.label) === normalizedInput ||
      normalize(service.id) === normalizedInput ||
      service.aliases.some((alias) => normalize(alias) === normalizedInput),
  );
  if (exactMatch) return exactMatch;

  const containsMatch = DENTAL_SERVICES.find(
    (service) =>
      normalize(service.label).includes(normalizedInput) ||
      service.aliases.some((alias) => normalize(alias).includes(normalizedInput)),
  );
  if (containsMatch) return containsMatch;

  const aliasPhraseMatch = DENTAL_SERVICES.find((service) =>
    service.aliases.some((alias) => normalizedInput.includes(normalize(alias))),
  );
  if (aliasPhraseMatch) return aliasPhraseMatch;

  const patterns: Array<[RegExp, string]> = [
    [
      /\bme duele una muela\b|\bdolor de muelas?\b|\bdolor dental\b|\burgencia\b|\btrauma\b|\binflamaci[oó]n\b|\bsangrado\b|\bme sangran las enc[ií]as\b/,
      "urgencias-dentales",
    ],
    [
      /\bquiero dientes blancos\b|\bdientes blancos\b|\bblanqueamiento\b|\baclaramiento\b/,
      "blanqueamiento-dental",
    ],
    [/\bdientes chuecos\b|\bbrackets?\b|\balineadores?\b|\bortodoncia\b/, "ortodoncia"],
    [/\bme falta un diente\b|\bfalta un diente\b|\bimplante(s)?\b/, "implantes-dentales"],
    [/\blimpieza\b|\bcontrol\b|\brevisión preventiva\b|\bchequeo\b/, "odontologia-preventiva"],
    [/\bcaries?\b|\brevisión\b|\bchequeo\b|\benc[ií]as\b/, "revision-dental"],
  ];

  for (const [pattern, serviceId] of patterns) {
    if (pattern.test(normalizedInput)) {
      return getDentalServiceById(serviceId) ?? null;
    }
  }

  const tokens = normalizedInput.split(/\s+/);
  const keywordMatch = DENTAL_SERVICES.find((service) =>
    service.aliases.some((alias) =>
      tokens.every((token) => token && normalize(alias).includes(token)),
    ),
  );

  return keywordMatch ?? null;
}

export function normalizeDentalService(input: string) {
  const service = findDentalService(input);
  return service?.label ?? input.trim();
}

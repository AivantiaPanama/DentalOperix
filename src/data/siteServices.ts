import preventiveImage from "@/assets/care-journey/preventiva.png";
import orthodonticsImage from "@/assets/care-journey/ortodoncia.png";
import smileDesignImage from "@/assets/care-journey/diseno-sonrisa.png";
import implantsImage from "@/assets/care-journey/implantes.png";
import pediatricImage from "@/assets/care-journey/odontopediatria.png";

export type SiteService = {
  id: string;
  slug: string;
  legacySlugs?: string[];
  title: string;
  message: string;
  shortDescription: string;
  image: string;
  alt: string;
  overview: string;
  includes: string[];
  process: string[];
  benefits: string[];
  modalDescription: string;
  suggestedPrice: string;
  priceNote: string;
};

export const siteServices: SiteService[] = [
  {
    id: "odontologia-preventiva",
    slug: "odontologia-preventiva",
    title: "Odontología Preventiva",
    message: "La prevención ayuda a mantener la salud oral a lo largo del tiempo.",
    shortDescription:
      "Revisiones, limpieza y orientación personalizada para cuidar la salud oral antes de que aparezcan molestias.",
    image: preventiveImage,
    alt: "Atención preventiva en DentalOperix",
    overview:
      "La odontología preventiva se enfoca en revisar el estado de dientes y encías, identificar señales tempranas y acompañarte con recomendaciones claras para mantener una boca saludable.",
    includes: [
      "Evaluación general de dientes, encías y hábitos de higiene.",
      "Limpieza dental profesional cuando el caso lo requiere.",
      "Orientación sobre prevención de caries, inflamación y sensibilidad.",
    ],
    process: [
      "Escuchamos tus antecedentes y cualquier molestia reciente.",
      "Realizamos una revisión clínica cuidadosa.",
      "Te explicamos hallazgos y próximos pasos de manera sencilla.",
    ],
    benefits: [
      "Ayuda a detectar problemas antes de que avancen.",
      "Favorece hábitos de cuidado sostenibles.",
      "Reduce la necesidad de tratamientos más complejos en el futuro.",
    ],
    modalDescription:
      "Consulta preventiva orientada a revisar dientes y encías, identificar señales tempranas y definir recomendaciones de cuidado o limpieza profesional según el caso.",
    suggestedPrice: "B/.40 – B/.80",
    priceNote: "Rango referencial para evaluación y limpieza preventiva básica en Panamá.",
  },
  {
    id: "ortodoncia",
    slug: "ortodoncia",
    title: "Ortodoncia",
    message: "Cada tratamiento comienza con una explicación clara y una planificación cuidadosa.",
    shortDescription:
      "Evaluación y planificación para mejorar la posición dental, la mordida y la armonía de la sonrisa.",
    image: orthodonticsImage,
    alt: "Planificación de ortodoncia en DentalOperix",
    overview:
      "La ortodoncia ayuda a alinear dientes y mordida mediante un plan progresivo. Antes de iniciar, se revisan tus necesidades, expectativas y las opciones disponibles para tu caso.",
    includes: [
      "Valoración de alineación dental, mordida y espacio disponible.",
      "Explicación de alternativas como brackets o alineadores, según disponibilidad clínica.",
      "Plan de seguimiento para acompañar la evolución del tratamiento.",
    ],
    process: [
      "Analizamos tu situación actual y tus objetivos.",
      "Definimos una ruta de tratamiento comprensible.",
      "Damos seguimiento a los cambios con controles periódicos.",
    ],
    benefits: [
      "Mejora la función de la mordida.",
      "Puede facilitar la higiene diaria.",
      "Contribuye a una sonrisa más equilibrada.",
    ],
    modalDescription:
      "Valoración para revisar alineación dental, mordida y alternativas de tratamiento. El plan puede variar según estudios, aparatología y controles necesarios.",
    suggestedPrice: "Evaluación desde B/.40 · tratamiento desde B/.1,500",
    priceNote: "Referencia para consulta inicial y tratamientos de ortodoncia con brackets o alternativas similares.",
  },
  {
    id: "diseno-de-sonrisa",
    slug: "diseno-sonrisa",
    legacySlugs: ["diseno-de-sonrisa"],
    title: "Diseño de Sonrisa",
    message: "Escuchamos tus expectativas y te ayudamos a comprender las opciones disponibles.",
    shortDescription:
      "Un enfoque estético y funcional para valorar forma, color, proporción y armonía de la sonrisa.",
    image: smileDesignImage,
    alt: "Conversación sobre diseño de sonrisa en DentalOperix",
    overview:
      "El diseño de sonrisa parte de una conversación honesta sobre tus expectativas. Evaluamos la estética dental en conjunto con la salud oral para proponer opciones realistas y cuidadosas.",
    includes: [
      "Evaluación de forma, color, proporciones y línea de sonrisa.",
      "Revisión de salud dental antes de cualquier mejora estética.",
      "Orientación sobre alternativas como restauraciones estéticas, blanqueamiento o carillas, cuando aplique.",
    ],
    process: [
      "Conversamos sobre lo que deseas mejorar.",
      "Revisamos si tu salud oral permite avanzar con seguridad.",
      "Te presentamos opciones con ventajas, límites y cuidados necesarios.",
    ],
    benefits: [
      "Ayuda a alinear expectativas con posibilidades reales.",
      "Integra estética, función y salud oral.",
      "Permite tomar decisiones informadas antes de iniciar.",
    ],
    modalDescription:
      "Evaluación estética y funcional para valorar forma, color, proporción y armonía de la sonrisa antes de proponer alternativas como blanqueamiento, restauraciones o carillas.",
    suggestedPrice: "B/.1,000 – B/.5,000",
    priceNote: "Rango referencial para planes de diseño de sonrisa en Panamá, según procedimientos incluidos.",
  },
  {
    id: "implantes-dentales",
    slug: "implantes-dentales",
    title: "Implantes Dentales",
    message: "Recuperar función y comodidad comienza con una conversación informada.",
    shortDescription:
      "Evaluación para reemplazar piezas dentales ausentes con una alternativa fija y planificada.",
    image: implantsImage,
    alt: "Orientación sobre implantes dentales en DentalOperix",
    overview:
      "Los implantes dentales pueden ayudar a recuperar función, estabilidad y comodidad cuando falta una o más piezas. El proceso requiere diagnóstico, planificación y seguimiento cuidadoso.",
    includes: [
      "Valoración de encías, hueso disponible y piezas vecinas.",
      "Explicación de etapas, tiempos aproximados y cuidados posteriores.",
      "Planificación de la restauración final según la necesidad del paciente.",
    ],
    process: [
      "Evaluamos si eres candidato para implantes.",
      "Definimos una planificación clínica clara.",
      "Acompañamos la recuperación y la rehabilitación final.",
    ],
    benefits: [
      "Puede recuperar estabilidad al masticar.",
      "Ayuda a conservar dientes vecinos sanos.",
      "Ofrece una solución fija cuando el caso lo permite.",
    ],
    modalDescription:
      "Valoración para reemplazar piezas ausentes mediante una solución fija planificada. Requiere revisar encías, hueso disponible, estudios y restauración final.",
    suggestedPrice: "B/.1,500 – B/.3,000 por implante",
    priceNote: "Referencia de mercado por implante unitario; puede variar por corona, injertos, estudios o complejidad clínica.",
  },
  {
    id: "odontopediatria",
    slug: "odontopediatria",
    title: "Odontopediatría",
    message: "Las experiencias positivas construyen confianza desde la infancia.",
    shortDescription:
      "Atención dental infantil con paciencia, lenguaje claro y acompañamiento para la familia.",
    image: pediatricImage,
    alt: "Atención odontopediátrica amable en DentalOperix",
    overview:
      "La odontopediatría busca que niñas y niños vivan la consulta dental con tranquilidad. El objetivo es prevenir, educar y crear confianza desde las primeras visitas.",
    includes: [
      "Primera revisión dental infantil y orientación familiar.",
      "Prevención de caries y seguimiento del crecimiento dental.",
      "Educación sobre higiene oral adaptada a cada edad.",
    ],
    process: [
      "Recibimos al niño con calma y explicaciones simples.",
      "Revisamos su salud oral respetando su ritmo.",
      "Guiamos a la familia con recomendaciones prácticas.",
    ],
    benefits: [
      "Favorece una relación positiva con el dentista.",
      "Permite detectar riesgos desde temprano.",
      "Apoya hábitos saludables en casa.",
    ],
    modalDescription:
      "Consulta infantil enfocada en revisar la salud oral con calma, orientar a la familia y prevenir caries o molestias desde una experiencia respetuosa.",
    suggestedPrice: "Evaluación desde B/.50",
    priceNote: "Referencia para valoración odontopediátrica inicial en Panamá.",
  },
];

export function getSiteServiceBySlug(slug?: string) {
  if (!slug) return undefined;
  return siteServices.find(
    (service) => service.slug === slug || service.legacySlugs?.includes(slug),
  );
}

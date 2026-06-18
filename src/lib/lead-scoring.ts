export type LeadScoreCategory = "hot" | "warm" | "cold";

export type LeadScoringInput = {
  urgency?: string;
  treatment?: string;
  status?: string;
  source?: string;
  preferredDate?: string;
  createdAt?: string;
};

export type LeadScoreResult = {
  score: number;
  category: LeadScoreCategory;
  reasons: string[];
};

const PRIORITY_SERVICES = ["Implantes Dentales", "Diseño de Sonrisa", "Ortodoncia"];

function normalizeText(value?: string) {
  return value?.toString().trim().toLowerCase() ?? "";
}

function clampScore(value: number) {
  return Math.min(100, Math.max(0, Math.round(value)));
}

export function calculateLeadScore(lead: LeadScoringInput): LeadScoreResult {
  const reasons: string[] = [];
  const urgency = normalizeText(lead.urgency);
  const treatment = (lead.treatment ?? "").toString().trim();
  const status = normalizeText(lead.status);
  const source = normalizeText(lead.source);

  let score = 0;

  switch (urgency) {
    case "alta":
      score += 25;
      reasons.push("Alta urgencia");
      break;
    case "media":
      score += 15;
      reasons.push("Urgencia media");
      break;
    case "baja":
      score += 5;
      reasons.push("Urgencia baja");
      break;
    default:
      reasons.push("Urgencia no definida");
      break;
  }

  const servicePriority = PRIORITY_SERVICES.findIndex(
    (service) => service.toLowerCase() === treatment.toLowerCase(),
  );
  if (servicePriority >= 0) {
    score += 20;
    reasons.push(`Servicio prioritario: ${PRIORITY_SERVICES[servicePriority]}`);
  } else if (treatment) {
    score += 10;
    reasons.push("Servicio detectado");
  } else {
    reasons.push("Servicio no definido");
  }

  switch (status) {
    case "nuevo":
      score += 20;
      reasons.push("Lead nuevo");
      break;
    case "agendada":
      score += 20;
      reasons.push("Cita agendada");
      break;
    case "completada":
      score += 10;
      reasons.push("Cita completada");
      break;
    case "cancelada":
      score -= 10;
      reasons.push("Cita cancelada");
      break;
    case "no asistió":
    case "no asistio":
    case "no-show":
    case "no_show":
      score -= 20;
      reasons.push("No asistió");
      break;
    default:
      reasons.push("Estado indefinido");
      break;
  }

  if (source) {
    score += 10;
    reasons.push("Fuente identificada");
  }

  const normalizedSourceValue = source ? Math.min(10, source.length % 10) : 0;
  score += normalizedSourceValue;
  if (normalizedSourceValue > 0) {
    reasons.push("Historial de fuente disponible");
  }

  const finalScore = clampScore(score);
  const category: LeadScoreCategory = finalScore >= 75 ? "hot" : finalScore >= 40 ? "warm" : "cold";

  return {
    score: finalScore,
    category,
    reasons,
  };
}

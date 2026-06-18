import type { LeadOperationsProfile } from "@/server/leads/operations-repository";
import { getDataQualityReadSource, type DataQualityReadSourceMode } from "./read-source";
import type { PatientAdministrativeProfile } from "@/lib/patients/admin-profile";

export type OperationalDataQualitySeverity = "critical" | "warning" | "info";
export type OperationalDataQualityResourceType = "patient" | "lead" | "consistency";
export type OperationalDataQualityIssueType =
  | "patient.email.missing"
  | "patient.email.invalid"
  | "patient.phone.missing"
  | "patient.name.incomplete"
  | "patient.birth_date.missing"
  | "patient.address.missing"
  | "patient.emergency_contact.missing"
  | "patient.preferred_contact_method.missing"
  | "patient.verification.pending"
  | "lead.followup.missing"
  | "lead.phone.missing"
  | "lead.email.missing"
  | "lead.email.invalid"
  | "lead.operational_status.missing"
  | "consistency.email.duplicate"
  | "consistency.phone.duplicate"
  | "consistency.patient.duplicate_candidate"
  | "consistency.source_mapping.suspect";

export type OperationalDataQualityIssue = {
  id: string;
  type: OperationalDataQualityIssueType;
  severity: OperationalDataQualitySeverity;
  resourceType: OperationalDataQualityResourceType;
  resourceId?: string;
  title: string;
  description: string;
  recommendation: string;
  metadata?: Record<string, string | number | boolean>;
};

export type OperationalDataQualitySummary = {
  generatedAt: string;
  scope: "administrative-operational";
  limits: string[];
  score: number;
  status: "healthy" | "attention" | "risk";
  totals: {
    issues: number;
    critical: number;
    warnings: number;
    info: number;
    checkedPatients: number;
    checkedLeads: number;
    duplicateGroups: number;
  };
  issues: OperationalDataQualityIssue[];
  recommendations: string[];
  readSource: {
    mode: DataQualityReadSourceMode;
    usedReadModel: boolean;
    fallbackReason?: string;
    checkedReadModelPatients: number;
  };
};

const PLACEHOLDER_VALUES = new Set([
  "correo no registrado",
  "telefono no registrado",
  "teléfono no registrado",
  "paciente sin nombre",
  "servicio por definir",
  "sin canal",
  "sin folio",
]);

function normalizeComparable(value: string | undefined | null) {
  return (value ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ");
}

function isPlaceholderValue(value: string | undefined | null) {
  return PLACEHOLDER_VALUES.has(normalizeComparable(value));
}

function hasValue(value: string | undefined | null) {
  const normalized = (value ?? "").trim();
  return Boolean(normalized) && !isPlaceholderValue(normalized);
}

function isValidEmail(value: string | undefined | null) {
  const normalized = (value ?? "").trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized);
}

function hasValidEmail(value: string | undefined | null) {
  return hasValue(value) && isValidEmail(value);
}

function looksLikeMisplacedService(value: string | undefined | null) {
  const normalized = normalizeComparable(value);
  return /odontologia|ortodoncia|diseno|diseño|sonrisa|implante|odontopediatria|blanqueamiento|limpieza|consulta|servicio|tratamiento/.test(
    normalized,
  );
}

function normalizeEmail(value: string | undefined) {
  const normalized = (value ?? "").trim().toLowerCase();
  return isValidEmail(normalized) ? normalized : "";
}

function normalizePhone(value: string | undefined) {
  const digits = (value ?? "").replace(/\D+/g, "");
  return digits.length >= 7 ? digits : "";
}

function normalizeName(value: string | undefined) {
  const normalized = (value ?? "").toLowerCase().replace(/\s+/g, " ").trim();
  if (!hasValue(normalized) || normalized.includes("@")) return "";
  return normalized;
}

function createIssue(input: Omit<OperationalDataQualityIssue, "id">): OperationalDataQualityIssue {
  const resourceId = input.resourceId ? `-${input.resourceId}` : "";
  return {
    id: `${input.type}-${input.resourceType}${resourceId}`,
    ...input,
  };
}

function buildPatientIssues(patients: PatientAdministrativeProfile[]) {
  const issues: OperationalDataQualityIssue[] = [];

  for (const patient of patients) {
    if (!hasValue(patient.email)) {
      issues.push(
        createIssue({
          type: "patient.email.missing",
          severity: "warning",
          resourceType: "patient",
          resourceId: patient.id,
          title: "Paciente sin email administrativo",
          description: `${patient.displayName} no tiene email administrativo registrado.`,
          recommendation:
            "Solicitar y registrar el correo en el perfil administrativo cuando el paciente lo comparta.",
        }),
      );
    } else if (!hasValidEmail(patient.email)) {
      issues.push(
        createIssue({
          type: "patient.email.invalid",
          severity: "warning",
          resourceType: "patient",
          resourceId: patient.id,
          title: "Email administrativo inválido",
          description: `${patient.displayName} tiene un valor que no parece correo válido en el campo email.`,
          recommendation:
            "Revisar el origen del dato antes de usarlo para seguimiento o deduplicación.",
        }),
      );
    }

    if (!hasValue(patient.phone)) {
      issues.push(
        createIssue({
          type: "patient.phone.missing",
          severity: "critical",
          resourceType: "patient",
          resourceId: patient.id,
          title: "Paciente sin teléfono administrativo",
          description: `${patient.displayName} no tiene teléfono registrado para seguimiento operativo.`,
          recommendation:
            "Completar el teléfono administrativo antes de coordinar nuevos pasos operativos.",
        }),
      );
    }

    if (!hasValue(patient.firstName) || !hasValue(patient.lastName)) {
      issues.push(
        createIssue({
          type: "patient.name.incomplete",
          severity: "info",
          resourceType: "patient",
          resourceId: patient.id,
          title: "Nombre administrativo incompleto",
          description: `${patient.displayName} requiere separación de nombre y apellidos.`,
          recommendation:
            "Completar nombre y apellidos con claridad para evitar duplicados administrativos.",
        }),
      );
    }

    if (!hasValue(patient.birthDate)) {
      issues.push(
        createIssue({
          type: "patient.birth_date.missing",
          severity: "info",
          resourceType: "patient",
          resourceId: patient.id,
          title: "Fecha de nacimiento faltante",
          description: `${patient.displayName} no tiene fecha de nacimiento administrativa registrada.`,
          recommendation:
            "Completar la fecha de nacimiento únicamente cuando el paciente la proporcione en un contexto administrativo apropiado.",
        }),
      );
    }

    if (!hasValue(patient.address)) {
      issues.push(
        createIssue({
          type: "patient.address.missing",
          severity: "info",
          resourceType: "patient",
          resourceId: patient.id,
          title: "Dirección administrativa faltante",
          description: `${patient.displayName} no tiene dirección administrativa registrada.`,
          recommendation:
            "Registrar la dirección solo cuando sea necesaria para la operación y el paciente la comparta voluntariamente.",
        }),
      );
    }

    if (!hasValue(patient.emergencyContact)) {
      issues.push(
        createIssue({
          type: "patient.emergency_contact.missing",
          severity: "info",
          resourceType: "patient",
          resourceId: patient.id,
          title: "Contacto de emergencia faltante",
          description: `${patient.displayName} no tiene contacto de emergencia administrativo.`,
          recommendation:
            "Solicitar el contacto de emergencia en un momento apropiado y sin presionar al paciente.",
        }),
      );
    }

    if (!hasValue(patient.preferredContactMethod)) {
      issues.push(
        createIssue({
          type: "patient.preferred_contact_method.missing",
          severity: "info",
          resourceType: "patient",
          resourceId: patient.id,
          title: "Método de contacto preferido faltante",
          description: `${patient.displayName} no tiene método de contacto preferido registrado.`,
          recommendation:
            "Definir el método preferido de contacto para mejorar el seguimiento operativo sin generar presión comercial.",
        }),
      );
    }

    if (patient.administrativeStatus !== "verified") {
      issues.push(
        createIssue({
          type: "patient.verification.pending",
          severity: patient.administrativeStatus === "incomplete" ? "warning" : "info",
          resourceType: "patient",
          resourceId: patient.id,
          title: "Perfil pendiente de verificación",
          description: `${patient.displayName} aún no está verificado administrativamente.`,
          recommendation:
            "Revisar los campos administrativos faltantes y verificar el perfil cuando esté completo.",
          metadata: { completionPercentage: patient.completionPercentage },
        }),
      );
    }
  }

  return issues;
}

function buildLeadIssues(leadOperations: LeadOperationsProfile[]) {
  const issues: OperationalDataQualityIssue[] = [];

  for (const profile of leadOperations) {
    const name = profile.lead.name || "Lead sin nombre";

    if (profile.operationalStatus === "seguimiento" && !hasValue(profile.nextFollowUpAt)) {
      issues.push(
        createIssue({
          type: "lead.followup.missing",
          severity: "warning",
          resourceType: "lead",
          resourceId: profile.leadId,
          title: "Lead en seguimiento sin próxima fecha",
          description: `${name} está en seguimiento pero no tiene próxima fecha definida.`,
          recommendation:
            "Definir una próxima fecha de contacto clara, respetuosa y sin presión comercial.",
        }),
      );
    }

    if (!hasValue(profile.lead.phone)) {
      issues.push(
        createIssue({
          type: "lead.phone.missing",
          severity: "critical",
          resourceType: "lead",
          resourceId: profile.leadId,
          title: "Lead sin teléfono",
          description: `${name} no tiene teléfono para seguimiento operativo.`,
          recommendation:
            "Completar el teléfono desde una fuente administrativa válida antes de intentar seguimiento.",
        }),
      );
    }

    if (!hasValue(profile.lead.email)) {
      issues.push(
        createIssue({
          type: "lead.email.missing",
          severity: "info",
          resourceType: "lead",
          resourceId: profile.leadId,
          title: "Lead sin email",
          description: `${name} no tiene email registrado.`,
          recommendation:
            "Registrar email solo si el paciente lo proporciona o si ya consta en una fuente administrativa confiable.",
        }),
      );
    } else if (!hasValidEmail(profile.lead.email)) {
      issues.push(
        createIssue({
          type: "lead.email.invalid",
          severity: "warning",
          resourceType: "lead",
          resourceId: profile.leadId,
          title: "Email de lead inválido",
          description: `${name} tiene un valor no compatible con email en el campo de correo.`,
          recommendation:
            "Revisar la fila origen; puede existir un dato desplazado desde tratamiento o interés.",
          metadata: { looksLikeService: looksLikeMisplacedService(profile.lead.email) },
        }),
      );
    }

    if (looksLikeMisplacedService(profile.lead.email) && !hasValue(profile.lead.treatment)) {
      issues.push(
        createIssue({
          type: "consistency.source_mapping.suspect",
          severity: "warning",
          resourceType: "consistency",
          resourceId: `lead-${profile.leadId}`,
          title: "Posible columna CRM desalineada",
          description: `${name} tiene un posible servicio o interés en el campo email.`,
          recommendation:
            "Revisar la fila en la fuente CRM antes de editar el perfil administrativo. Esta revisión no corrige datos automáticamente.",
        }),
      );
    }

    if (!hasValue(profile.operationalStatus)) {
      issues.push(
        createIssue({
          type: "lead.operational_status.missing",
          severity: "warning",
          resourceType: "lead",
          resourceId: profile.leadId,
          title: "Lead sin estado operativo",
          description: `${name} no tiene estado operativo interpretable.`,
          recommendation:
            "Clasificar el lead como nuevo, contactado, seguimiento o descartado según corresponda.",
        }),
      );
    }
  }

  return issues;
}

function groupByNormalizedValue<T>(items: T[], getValue: (item: T) => string) {
  const groups = new Map<string, T[]>();
  for (const item of items) {
    const value = getValue(item);
    if (!value) continue;
    groups.set(value, [...(groups.get(value) ?? []), item]);
  }
  return [...groups.entries()].filter(([, group]) => group.length > 1);
}

function buildConsistencyIssues(patients: PatientAdministrativeProfile[]) {
  const issues: OperationalDataQualityIssue[] = [];
  const emailGroups = groupByNormalizedValue(patients, (patient) => normalizeEmail(patient.email));
  const phoneGroups = groupByNormalizedValue(patients, (patient) => normalizePhone(patient.phone));
  const nameGroups = groupByNormalizedValue(patients, (patient) =>
    normalizeName(patient.displayName),
  );

  for (const [email, group] of emailGroups) {
    issues.push(
      createIssue({
        type: "consistency.email.duplicate",
        severity: "warning",
        resourceType: "consistency",
        resourceId: `email-${email}`,
        title: "Email duplicado en perfiles administrativos",
        description: `${group.length} perfiles comparten el email ${email}.`,
        recommendation:
          "Revisar si corresponden al mismo paciente antes de realizar nuevas actualizaciones administrativas.",
        metadata: { duplicateCount: group.length },
      }),
    );
  }

  for (const [phone, group] of phoneGroups) {
    issues.push(
      createIssue({
        type: "consistency.phone.duplicate",
        severity: "warning",
        resourceType: "consistency",
        resourceId: `phone-${phone}`,
        title: "Teléfono duplicado en perfiles administrativos",
        description: `${group.length} perfiles comparten el teléfono terminado en ${phone.slice(-4) || "N/D"}.`,
        recommendation:
          "Confirmar si se trata del mismo paciente o de un contacto compartido antes de fusionar información.",
        metadata: { duplicateCount: group.length },
      }),
    );
  }

  for (const [name, group] of nameGroups) {
    if (name === "paciente sin nombre") continue;
    issues.push(
      createIssue({
        type: "consistency.patient.duplicate_candidate",
        severity: "info",
        resourceType: "consistency",
        resourceId: `name-${name}`,
        title: "Posible paciente duplicado por nombre",
        description: `${group.length} perfiles comparten el nombre ${name}.`,
        recommendation:
          "Comparar email, teléfono y fuente antes de decidir si existe duplicidad administrativa.",
        metadata: { duplicateCount: group.length },
      }),
    );
  }

  return issues;
}

function summarize(
  issues: OperationalDataQualityIssue[],
  checkedPatients: number,
  checkedLeads: number,
  readSource: OperationalDataQualitySummary["readSource"] = {
    mode: "legacy-leads",
    usedReadModel: false,
    checkedReadModelPatients: 0,
  },
): OperationalDataQualitySummary {
  const critical = issues.filter((issue) => issue.severity === "critical").length;
  const warnings = issues.filter((issue) => issue.severity === "warning").length;
  const info = issues.filter((issue) => issue.severity === "info").length;
  const duplicateGroups = issues.filter((issue) => issue.resourceType === "consistency").length;
  const score = Math.max(0, Math.min(100, 100 - critical * 12 - warnings * 6 - info * 2));
  const status = score >= 85 ? "healthy" : score >= 60 ? "attention" : "risk";
  const recommendations: string[] = [];

  if (critical > 0)
    recommendations.push(
      "Resolver primero datos críticos de contacto: teléfonos faltantes en leads o pacientes.",
    );
  if (warnings > 0)
    recommendations.push(
      "Revisar seguimientos, verificación administrativa y duplicados antes de escalar nuevas operaciones.",
    );
  if (duplicateGroups > 0)
    recommendations.push(
      "Validar posibles duplicados manualmente; esta fase no fusiona ni corrige registros automáticamente.",
    );
  if (
    issues.some(
      (issue) =>
        issue.type === "consistency.source_mapping.suspect" ||
        issue.type === "lead.email.invalid" ||
        issue.type === "patient.email.invalid",
    )
  ) {
    recommendations.push(
      "Revisar filas fuente con valores no compatibles antes de confiar en deduplicación por email.",
    );
  }
  if (!recommendations.length)
    recommendations.push(
      "Mantener revisión periódica de calidad operativa antes de abrir flujos clínicos.",
    );

  return {
    generatedAt: new Date().toISOString(),
    scope: "administrative-operational",
    limits: [
      "Solo revisa datos administrativos y operativos.",
      "No modifica registros automáticamente.",
      "No incluye historia clínica, diagnóstico, tratamientos, odontograma ni radiografías.",
    ],
    score,
    status,
    totals: {
      issues: issues.length,
      critical,
      warnings,
      info,
      checkedPatients,
      checkedLeads,
      duplicateGroups,
    },
    issues: issues.slice(0, 50),
    recommendations,
    readSource,
  };
}

export function buildOperationalDataQualitySummary(params: {
  patients: PatientAdministrativeProfile[];
  leadOperations: LeadOperationsProfile[];
}): OperationalDataQualitySummary {
  const issues = [
    ...buildPatientIssues(params.patients),
    ...buildLeadIssues(params.leadOperations),
    ...buildConsistencyIssues(params.patients),
  ];

  return summarize(issues, params.patients.length, params.leadOperations.length);
}

export async function getOperationalDataQualitySummary(): Promise<OperationalDataQualitySummary> {
  const source = await getDataQualityReadSource();
  const summary = buildOperationalDataQualitySummary({
    patients: source.patients,
    leadOperations: source.leadOperations,
  });

  return {
    ...summary,
    readSource: {
      mode: source.mode,
      usedReadModel: source.diagnostics.usedReadModel,
      fallbackReason: source.diagnostics.fallbackReason,
      checkedReadModelPatients: source.diagnostics.checkedReadModelPatients,
    },
  };
}

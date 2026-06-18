import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, DatabaseZap, RefreshCcw, ShieldAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

type DataQualityIssue = {
  id: string;
  severity: "critical" | "warning" | "info";
  title: string;
  description: string;
  recommendation: string;
  resourceType: "patient" | "lead" | "consistency";
};

type DataQualitySummary = {
  generatedAt: string;
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
  issues: DataQualityIssue[];
  recommendations: string[];
  limits: string[];
};

type DataQualityResponse = {
  success: boolean;
  quality?: DataQualitySummary;
  error?: string;
};

function formatGeneratedAt(value: string | undefined) {
  if (!value) return "Pendiente";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("es-PA", { dateStyle: "medium", timeStyle: "short" }).format(date);
}

function statusTone(status: DataQualitySummary["status"]) {
  if (status === "healthy") return "border-emerald-200 bg-emerald-50 text-emerald-700";
  if (status === "attention") return "border-amber-200 bg-amber-50 text-amber-700";
  return "border-red-200 bg-red-50 text-red-700";
}

function statusLabel(status: DataQualitySummary["status"]) {
  if (status === "healthy") return "Saludable";
  if (status === "attention") return "Atención";
  return "Riesgo";
}

function severityTone(severity: DataQualityIssue["severity"]) {
  if (severity === "critical") return "border-red-200 bg-red-50 text-red-700";
  if (severity === "warning") return "border-amber-200 bg-amber-50 text-amber-700";
  return "border-blue-200 bg-blue-50 text-blue-700";
}

export function OperationalDataQualityPanel() {
  const [quality, setQuality] = useState<DataQualitySummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadQuality = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/data-quality/operational", { credentials: "same-origin" });
      const payload = (await response.json()) as DataQualityResponse;

      if (!response.ok || !payload.success || !payload.quality) {
        throw new Error(payload.error ?? "No se pudo cargar la calidad de datos operativa.");
      }

      setQuality(payload.quality);
    } catch (loadError) {
      setQuality(null);
      setError(loadError instanceof Error ? loadError.message : "No se pudo cargar la calidad de datos operativa.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadQuality();
  }, []);

  const visibleIssues = useMemo(() => quality?.issues.slice(0, 5) ?? [], [quality]);
  const recommendations = useMemo(() => quality?.recommendations.slice(0, 3) ?? [], [quality]);

  return (
    <Card className="shadow-soft">
      <CardHeader className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <CardTitle>Calidad de datos operativa</CardTitle>
            <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary">
              FASE 14.4-G
            </Badge>
          </div>
          <CardDescription>
            Verificaciones administrativas y operativas. Solo detecta inconsistencias; no corrige registros ni incluye datos clínicos.
          </CardDescription>
          <p className="mt-2 text-xs text-muted-foreground">Generado: {formatGeneratedAt(quality?.generatedAt)}</p>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={loadQuality} disabled={loading}>
          <RefreshCcw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Actualizar
        </Button>
      </CardHeader>
      <CardContent className="space-y-5">
        {error ? (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">{error}</div>
        ) : null}

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border bg-muted/30 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Quality Score</p>
                <p className="mt-1 text-3xl font-semibold text-foreground">{loading ? "..." : `${quality?.score ?? 0}/100`}</p>
              </div>
              <CheckCircle2 className="h-5 w-5 text-primary" />
            </div>
            <Progress value={quality?.score ?? 0} className="mt-4" />
          </div>
          <div className="rounded-2xl border bg-background p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Incidencias</p>
            <p className="mt-1 text-3xl font-semibold text-foreground">{loading ? "..." : (quality?.totals.issues ?? 0)}</p>
            <p className="mt-1 text-xs text-muted-foreground">{quality?.totals.critical ?? 0} críticas · {quality?.totals.warnings ?? 0} advertencias</p>
          </div>
          <div className="rounded-2xl border bg-background p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Registros revisados</p>
            <p className="mt-1 text-3xl font-semibold text-foreground">
              {loading ? "..." : (quality?.totals.checkedPatients ?? 0) + (quality?.totals.checkedLeads ?? 0)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">pacientes y leads administrativos</p>
          </div>
          <div className="rounded-2xl border bg-background p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Duplicados potenciales</p>
            <p className="mt-1 text-3xl font-semibold text-foreground">{loading ? "..." : (quality?.totals.duplicateGroups ?? 0)}</p>
            <p className="mt-1 text-xs text-muted-foreground">requieren revisión manual</p>
          </div>
        </div>

        {quality ? (
          <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
            <div className="rounded-2xl border bg-muted/30 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-foreground">Estado de calidad</p>
                  <p className="text-sm text-muted-foreground">Detección pasiva de datos incompletos, inconsistentes o duplicados.</p>
                </div>
                <Badge variant="outline" className={statusTone(quality.status)}>
                  {statusLabel(quality.status)}
                </Badge>
              </div>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                {recommendations.map((recommendation) => (
                  <li key={recommendation}>• {recommendation}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border bg-background p-4">
              <div className="mb-3 flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-primary" />
                <p className="text-sm font-semibold text-foreground">Principales hallazgos</p>
              </div>
              {visibleIssues.length ? (
                <div className="space-y-2">
                  {visibleIssues.map((issue) => (
                    <div key={issue.id} className="rounded-xl border p-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="outline" className={severityTone(issue.severity)}>{issue.severity}</Badge>
                        <Badge variant="secondary">{issue.resourceType}</Badge>
                      </div>
                      <p className="mt-2 text-sm font-medium text-foreground">{issue.title}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{issue.description}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
                  No se detectaron inconsistencias operativas relevantes.
                </div>
              )}
            </div>
          </div>
        ) : null}

        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1 rounded-full border px-3 py-1"><DatabaseZap className="h-3 w-3" /> Solo lectura</span>
          <span className="inline-flex items-center gap-1 rounded-full border px-3 py-1"><AlertTriangle className="h-3 w-3" /> Sin autocorrecciones</span>
        </div>
      </CardContent>
    </Card>
  );
}

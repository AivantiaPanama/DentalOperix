import { useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  ClipboardCheck,
  RefreshCcw,
  ShieldCheck,
  Users,
  type LucideIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

type OperationalKpis = {
  generatedAt: string;
  leads: {
    total: number;
    active: number;
    pending: number;
    closed: number;
    highPriority: number;
    dueFollowUps: number;
    conversionRate: number;
  };
  patients: {
    total: number;
    verified: number;
    pendingVerification: number;
    incomplete: number;
    verificationRate: number;
    averageCompletion: number;
  };
  audit: {
    eventsLast30Days: number;
    patientUpdates: number;
    leadUpdates: number;
    reportViews: number;
    reportExports: number;
  };
  reports: {
    generated: number;
    csvExports: number;
    jsonViews: number;
  };
  health: {
    score: number;
    status: "stable" | "attention" | "watch";
    summary: string;
    recommendations: string[];
  };
};

type OperationalKpisResponse = {
  success: boolean;
  kpis?: OperationalKpis;
  error?: string;
};

function formatGeneratedAt(value: string | undefined) {
  if (!value) return "Pendiente";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("es-PA", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function healthTone(status: OperationalKpis["health"]["status"]) {
  if (status === "stable") return "border-emerald-200 bg-emerald-50 text-emerald-700";
  if (status === "attention") return "border-amber-200 bg-amber-50 text-amber-700";
  return "border-red-200 bg-red-50 text-red-700";
}

function healthLabel(status: OperationalKpis["health"]["status"]) {
  if (status === "stable") return "Estable";
  if (status === "attention") return "Atención";
  return "Vigilar";
}

function KpiTile({
  title,
  value,
  description,
  icon: Icon,
}: {
  title: string;
  value: string | number;
  description: string;
  icon: LucideIcon;
}) {
  return (
    <Card className="border-muted bg-background/80 shadow-none">
      <CardContent className="flex gap-3 p-4">
        <span className="mt-1 rounded-full bg-primary/10 p-2 text-primary">
          <Icon className="h-4 w-4" />
        </span>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {title}
          </p>
          <p className="mt-1 text-2xl font-semibold text-foreground">{value}</p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export function OperationalKpisPanel() {
  const [kpis, setKpis] = useState<OperationalKpis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadKpis = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/kpis/operational", { credentials: "same-origin" });
      const payload = (await response.json()) as OperationalKpisResponse;

      if (!response.ok || !payload.success || !payload.kpis) {
        throw new Error(payload.error ?? "No se pudieron cargar los KPIs operativos.");
      }

      setKpis(payload.kpis);
    } catch (loadError) {
      setKpis(null);
      setError(
        loadError instanceof Error
          ? loadError.message
          : "No se pudieron cargar los KPIs operativos.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadKpis();
  }, []);

  const recommendations = useMemo(() => kpis?.health.recommendations.slice(0, 3) ?? [], [kpis]);

  return (
    <Card className="shadow-soft">
      <CardHeader className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <CardTitle>Executive Dashboard operativo</CardTitle>
            <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary">
              FASE 14.4-F
            </Badge>
          </div>
          <CardDescription>
            KPIs agregados de leads, pacientes administrativos, auditoría y reportes. No incluye
            información clínica.
          </CardDescription>
          <p className="mt-2 text-xs text-muted-foreground">
            Generado: {formatGeneratedAt(kpis?.generatedAt)}
          </p>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={loadKpis} disabled={loading}>
          <RefreshCcw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Actualizar
        </Button>
      </CardHeader>
      <CardContent className="space-y-5">
        {error ? (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            {error}
          </div>
        ) : null}

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <KpiTile
            title="Leads activos"
            value={loading ? "..." : (kpis?.leads.active ?? 0)}
            description={`${kpis?.leads.pending ?? 0} pendientes · ${kpis?.leads.conversionRate ?? 0}% conversión operativa`}
            icon={BarChart3}
          />
          <KpiTile
            title="Pacientes verificados"
            value={loading ? "..." : (kpis?.patients.verified ?? 0)}
            description={`${kpis?.patients.verificationRate ?? 0}% verificación · ${kpis?.patients.pendingVerification ?? 0} pendientes`}
            icon={Users}
          />
          <KpiTile
            title="Actividad auditada"
            value={loading ? "..." : (kpis?.audit.eventsLast30Days ?? 0)}
            description="eventos operativos registrados en los últimos 30 días"
            icon={ShieldCheck}
          />
          <KpiTile
            title="Reportes"
            value={loading ? "..." : (kpis?.reports.generated ?? 0)}
            description={`${kpis?.reports.csvExports ?? 0} CSV · ${kpis?.reports.jsonViews ?? 0} vistas JSON`}
            icon={ClipboardCheck}
          />
        </div>

        {kpis ? (
          <div className="grid gap-4 lg:grid-cols-[1.1fr_.9fr]">
            <div className="rounded-2xl border bg-muted/30 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-foreground">Salud operativa</p>
                  <p className="text-sm text-muted-foreground">{kpis.health.summary}</p>
                </div>
                <Badge variant="outline" className={healthTone(kpis.health.status)}>
                  {healthLabel(kpis.health.status)} · {kpis.health.score}/100
                </Badge>
              </div>
              <Progress value={kpis.health.score} className="mt-4" />
            </div>
            <div className="rounded-2xl border bg-background p-4">
              <p className="text-sm font-semibold text-foreground">Recomendaciones ejecutivas</p>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                {recommendations.map((recommendation) => (
                  <li key={recommendation}>• {recommendation}</li>
                ))}
              </ul>
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

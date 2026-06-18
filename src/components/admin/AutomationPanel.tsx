import { useMemo, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  History,
  PlayCircle,
  RefreshCcw,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type AutomationRun = {
  id: string;
  timestamp: string;
  flow: string;
  dryRun: boolean;
  generated: number;
  sent: number;
  skipped: number;
  failed: number;
  actionCount: number;
  errors: string;
  status: "success" | "partial" | "failure";
  durationMs?: number;
  executedBy?: string;
};

type AutomationMetrics = {
  totalRuns: number;
  dryRuns: number;
  realRuns: number;
  successfulRuns: number;
  partialRuns: number;
  failedRuns: number;
  generated: number;
  sent: number;
  skipped: number;
  failed: number;
};

type AutomationHistoryResponse = {
  success: boolean;
  runs: AutomationRun[];
  metrics: AutomationMetrics;
  error?: string;
};

type FollowupRunResponse = {
  dryRun?: boolean;
  generated?: number;
  sent?: number;
  skipped?: number;
  failed?: number;
  actions?: unknown[];
  errors?: string[];
  success?: boolean;
  error?: string;
};

const emptyMetrics: AutomationMetrics = {
  totalRuns: 0,
  dryRuns: 0,
  realRuns: 0,
  successfulRuns: 0,
  partialRuns: 0,
  failedRuns: 0,
  generated: 0,
  sent: 0,
  skipped: 0,
  failed: 0,
};

function statusLabel(status: AutomationRun["status"]) {
  if (status === "success") return "Exitosa";
  if (status === "partial") return "Parcial";
  return "Fallida";
}

function formatDate(value: string) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("es-PA", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function AutomationPanel() {
  const [executedBy, setExecutedBy] = useState("admin");
  const [runs, setRuns] = useState<AutomationRun[]>([]);
  const [metrics, setMetrics] = useState<AutomationMetrics>(emptyMetrics);
  const [loading, setLoading] = useState(false);
  const [running, setRunning] = useState<"dryRun" | "real" | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const latestRuns = useMemo(() => runs.slice(0, 10), [runs]);

  const loadHistory = async () => {
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const response = await fetch("/api/followups/run", {
        method: "GET",
        credentials: "same-origin",
      });
      const payload = (await response.json()) as AutomationHistoryResponse;
      if (!response.ok || !payload.success) {
        throw new Error(payload.error ?? "No se pudo cargar el historial de automatizaciones.");
      }
      setRuns(payload.runs ?? []);
      setMetrics(payload.metrics ?? emptyMetrics);
    } catch (historyError) {
      setError(
        historyError instanceof Error
          ? historyError.message
          : "Error inesperado al cargar historial.",
      );
    } finally {
      setLoading(false);
    }
  };

  const runFollowups = async (dryRun: boolean) => {
    if (!dryRun) {
      const confirmed = window.confirm(
        "Esta ejecución real puede enviar correos de seguimiento. Confirma que deseas continuar.",
      );
      if (!confirmed) return;
    }

    setRunning(dryRun ? "dryRun" : "real");
    setError(null);
    setMessage(null);

    try {
      const response = await fetch("/api/followups/run", {
        method: "POST",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ dryRun, confirmExecution: !dryRun, executedBy }),
      });
      const payload = (await response.json()) as FollowupRunResponse;
      if (!response.ok || payload.success === false) {
        throw new Error(payload.error ?? "No se pudo ejecutar la automatización.");
      }
      setMessage(
        dryRun
          ? `Dry run completado: ${payload.generated ?? 0} acciones generadas.`
          : `Ejecución real completada: ${payload.sent ?? 0} correos enviados, ${payload.failed ?? 0} fallidos.`,
      );
      await loadHistory();
    } catch (runError) {
      setError(
        runError instanceof Error
          ? runError.message
          : "Error inesperado al ejecutar automatización.",
      );
    } finally {
      setRunning(null);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-start gap-3">
            <span className="rounded-2xl bg-primary/10 p-3 text-primary">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <div>
              <CardTitle>Panel de Automatizaciones</CardTitle>
              <CardDescription>
                Ejecuta seguimientos en dry run o modo real sin exponer secretos en el cliente.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(220px,auto)]">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-border bg-secondary/40 p-4 text-sm text-muted-foreground">
              Sesión administrativa activa. Las automatizaciones se ejecutan sin exponer
              INTERNAL_API_KEY en el navegador.
            </div>
            <div className="space-y-2">
              <Label htmlFor="automation-executed-by">Ejecutado por</Label>
              <Input
                id="automation-executed-by"
                value={executedBy}
                onChange={(event) => setExecutedBy(event.target.value)}
                placeholder="admin"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2 md:items-end md:justify-end">
            <Button type="button" variant="outline" onClick={loadHistory} disabled={loading}>
              <RefreshCcw className="mr-2 h-4 w-4" />
              {loading ? "Cargando..." : "Actualizar historial"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => runFollowups(true)}
              disabled={!!running}
            >
              <PlayCircle className="mr-2 h-4 w-4" />
              {running === "dryRun" ? "Ejecutando..." : "Ejecutar dry run"}
            </Button>
            <Button type="button" onClick={() => runFollowups(false)} disabled={!!running}>
              <AlertTriangle className="mr-2 h-4 w-4" />
              {running === "real" ? "Ejecutando..." : "Ejecutar real"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {message ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-800">
          <CheckCircle2 className="mr-2 inline h-4 w-4" />
          {message}
        </div>
      ) : null}
      {error ? (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm font-medium text-destructive">
          <AlertTriangle className="mr-2 inline h-4 w-4" />
          {error}
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Ejecuciones</CardDescription>
            <CardTitle>{metrics.totalRuns}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Dry runs</CardDescription>
            <CardTitle>{metrics.dryRuns}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Reales</CardDescription>
            <CardTitle>{metrics.realRuns}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Correos enviados</CardDescription>
            <CardTitle>{metrics.sent}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-primary" />
            <CardTitle>Historial de ejecuciones</CardTitle>
          </div>
          <CardDescription>Últimas 10 ejecuciones registradas en AutomationRuns.</CardDescription>
        </CardHeader>
        <CardContent>
          {latestRuns.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
              No hay ejecuciones cargadas todavía.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-sm">
                <thead className="text-left text-muted-foreground">
                  <tr className="border-b border-border">
                    <th className="py-3 pr-4">Fecha</th>
                    <th className="py-3 pr-4">Tipo</th>
                    <th className="py-3 pr-4">Estado</th>
                    <th className="py-3 pr-4">Generados</th>
                    <th className="py-3 pr-4">Enviados</th>
                    <th className="py-3 pr-4">Fallidos</th>
                    <th className="py-3 pr-4">Duración</th>
                    <th className="py-3 pr-4">Usuario</th>
                  </tr>
                </thead>
                <tbody>
                  {latestRuns.map((run) => (
                    <tr key={run.id} className="border-b border-border/70">
                      <td className="py-3 pr-4">{formatDate(run.timestamp)}</td>
                      <td className="py-3 pr-4">{run.dryRun ? "Dry run" : "Real"}</td>
                      <td className="py-3 pr-4">
                        <Badge
                          variant={
                            run.status === "success"
                              ? "default"
                              : run.status === "partial"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {statusLabel(run.status)}
                        </Badge>
                      </td>
                      <td className="py-3 pr-4">{run.generated}</td>
                      <td className="py-3 pr-4">{run.sent}</td>
                      <td className="py-3 pr-4">{run.failed}</td>
                      <td className="py-3 pr-4">{run.durationMs ?? 0} ms</td>
                      <td className="py-3 pr-4">{run.executedBy ?? "system"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, Bell, ClipboardCheck, RefreshCcw, ShieldCheck } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export type OperationalNotificationSeverity = "info" | "attention" | "warning";

export type OperationalNotification = {
  id: string;
  type: string;
  severity: OperationalNotificationSeverity;
  title: string;
  description: string;
  createdAt: string;
  resourceType: "lead" | "patient" | "audit" | "report";
  resourceId?: string;
  metadata?: Record<string, string | number | boolean | null>;
};

type OperationalNotificationsSummary = {
  total: number;
  attention: number;
  warnings: number;
  generatedAt: string;
};

type OperationalNotificationsResponse = {
  success: boolean;
  notifications?: OperationalNotification[];
  summary?: OperationalNotificationsSummary;
  error?: string;
};

type OperationalNotificationsState = {
  notifications: OperationalNotification[];
  summary: OperationalNotificationsSummary | null;
};

const emptyState: OperationalNotificationsState = {
  notifications: [],
  summary: null,
};

function formatDateTime(value: string) {
  if (!value) return "Sin fecha";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("es-PA", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function severityLabel(severity: OperationalNotificationSeverity) {
  if (severity === "warning") return "Prioridad";
  if (severity === "attention") return "Atención";
  return "Informativo";
}

function severityClass(severity: OperationalNotificationSeverity) {
  if (severity === "warning") return "border-red-200 bg-red-50 text-red-700";
  if (severity === "attention") return "border-amber-200 bg-amber-50 text-amber-700";
  return "border-blue-200 bg-blue-50 text-blue-700";
}

function resourceIcon(resourceType: OperationalNotification["resourceType"]) {
  if (resourceType === "patient") return ShieldCheck;
  if (resourceType === "audit" || resourceType === "report") return ClipboardCheck;
  return AlertTriangle;
}

export function OperationalNotificationsPanel() {
  const [state, setState] = useState<OperationalNotificationsState>(emptyState);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadNotifications = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/notifications/operational", { credentials: "same-origin" });
      const payload = (await response.json()) as OperationalNotificationsResponse;

      if (!response.ok || !payload.success) {
        throw new Error(payload.error ?? "No se pudieron cargar las notificaciones operativas.");
      }

      setState({
        notifications: payload.notifications ?? [],
        summary: payload.summary ?? null,
      });
    } catch (loadError) {
      setState(emptyState);
      setError(loadError instanceof Error ? loadError.message : "No se pudieron cargar las notificaciones operativas.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadNotifications();
  }, []);

  const visibleNotifications = useMemo(() => state.notifications.slice(0, 6), [state.notifications]);

  return (
    <Card className="shadow-soft">
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Notificaciones operativas
          </CardTitle>
          <CardDescription>
            Monitoreo interno para administración y asistencia, sin correos, calendario ni automatizaciones externas.
          </CardDescription>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={() => void loadNotifications()} disabled={loading}>
          <RefreshCcw className="mr-2 h-4 w-4" />
          Actualizar
        </Button>
      </CardHeader>

      <CardContent className="space-y-4">
        {error ? (
          <Alert variant="destructive">
            <AlertTitle>No se pudo cargar el monitoreo</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}

        <section className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-border bg-background/70 p-4">
            <p className="text-xs text-muted-foreground">Total</p>
            <p className="mt-1 text-2xl font-bold text-deep">{loading ? "..." : state.summary?.total ?? 0}</p>
          </div>
          <div className="rounded-2xl border border-border bg-background/70 p-4">
            <p className="text-xs text-muted-foreground">Atención</p>
            <p className="mt-1 text-2xl font-bold text-deep">{loading ? "..." : state.summary?.attention ?? 0}</p>
          </div>
          <div className="rounded-2xl border border-border bg-background/70 p-4">
            <p className="text-xs text-muted-foreground">Prioridad</p>
            <p className="mt-1 text-2xl font-bold text-deep">{loading ? "..." : state.summary?.warnings ?? 0}</p>
          </div>
        </section>

        {loading ? (
          <div className="rounded-2xl border border-dashed border-border bg-background/70 p-5 text-sm text-muted-foreground">
            Cargando notificaciones internas...
          </div>
        ) : null}

        {!loading && !visibleNotifications.length ? (
          <div className="rounded-2xl border border-dashed border-border bg-background/70 p-5 text-sm text-muted-foreground">
            No hay notificaciones operativas pendientes con la información actual.
          </div>
        ) : null}

        {visibleNotifications.length ? (
          <div className="divide-y divide-border rounded-2xl border border-border">
            {visibleNotifications.map((notification) => {
              const Icon = resourceIcon(notification.resourceType);

              return (
                <article key={notification.id} className="grid gap-3 p-4 sm:grid-cols-[auto_1fr_auto] sm:items-start">
                  <span className="grid h-10 w-10 place-items-center rounded-2xl bg-primary/10 text-primary">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-deep">{notification.title}</h3>
                      <Badge variant="outline" className={severityClass(notification.severity)}>
                        {severityLabel(notification.severity)}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">{notification.description}</p>
                    <p className="mt-2 text-xs text-muted-foreground">{formatDateTime(notification.createdAt)}</p>
                  </div>
                  <Badge variant="secondary">{notification.resourceType}</Badge>
                </article>
              );
            })}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

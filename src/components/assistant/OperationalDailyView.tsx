import { useEffect, useState } from "react";
import { CalendarClock, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type OperationalDailyViewResponse = {
  success: boolean;
  daily?: {
    date: string;
    summary: {
      appointmentsCount: number;
      newLeadsCount: number;
    };
    appointments: Array<{
      id: string;
      patientName: string;
      scheduledStartAt?: string;
      service: string;
      status: string;
    }>;
    newLeads: Array<{
      leadId: string;
      name: string;
      treatment?: string;
      status: string;
      priority?: string;
    }>;
  };
  error?: string;
};

export function OperationalDailyView() {
  const [daily, setDaily] = useState<OperationalDailyViewResponse["daily"]>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();

  useEffect(() => {
    let cancelled = false;

    async function loadDailyView() {
      try {
        const response = await fetch("/api/operations/daily", {
          credentials: "same-origin",
        });

        const payload = (await response.json()) as OperationalDailyViewResponse;

        if (!response.ok || !payload.success) {
          throw new Error(payload.error ?? "No se pudo cargar la operación diaria.");
        }

        if (!cancelled) {
          setDaily(payload.daily);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "No se pudo cargar la operación diaria.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadDailyView();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Card className="shadow-soft" aria-label="Operación diaria">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg text-deep">
          <CalendarClock className="h-5 w-5 text-primary" />
          Operación de hoy
        </CardTitle>

        <CardDescription>
          Resumen operacional de la clínica para el asistente.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {loading && (
          <p className="text-sm text-muted-foreground">
            Cargando operación del día...
          </p>
        )}

        {error && (
          <p className="text-sm text-destructive">
            {error}
          </p>
        )}

        {!loading && !error && !daily && (
          <p className="text-sm text-muted-foreground">
            No hay información operacional disponible.
          </p>
        )}

        {!loading && !error && daily && (
          <div className="space-y-5">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-border bg-background/70 p-4">
                <p className="text-sm text-muted-foreground">
                  Citas del día
                </p>
                <p className="mt-1 text-2xl font-bold text-deep">
                  {daily.summary.appointmentsCount}
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-background/70 p-4">
                <p className="text-sm text-muted-foreground">
                  Nuevos pacientes
                </p>
                <p className="mt-1 text-2xl font-bold text-deep">
                  {daily.summary.newLeadsCount}
                </p>
              </div>
            </div>

            {daily.newLeads.length > 0 && (
              <section>
                <div className="mb-3 flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  <h3 className="font-semibold text-deep">
                    Nuevos pacientes
                  </h3>
                </div>

                <div className="space-y-2">
                  {daily.newLeads.map((lead) => (
                    <div
                      key={lead.leadId}
                      className="flex items-center justify-between rounded-xl border border-border bg-background/70 p-3"
                    >
                      <div>
                        <p className="font-medium text-deep">
                          {lead.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {lead.treatment ?? "Consulta general"}
                        </p>
                      </div>

                      <Badge variant="secondary">
                        {lead.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {daily.appointments.length > 0 && (
              <section>
                <h3 className="mb-3 font-semibold text-deep">
                  Próximas citas
                </h3>

                <div className="space-y-2">
                  {daily.appointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="rounded-xl border border-border bg-background/70 p-3"
                    >
                      <p className="font-medium text-deep">
                          {appointment.patientName}
                      </p>

                      <p className="text-sm text-muted-foreground">
                        {appointment.service}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
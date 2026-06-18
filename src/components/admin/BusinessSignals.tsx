import type { BusinessSignal } from "@/lib/business-health";

type Props = {
  signals: BusinessSignal[];
};

function getSignalLabel(status: BusinessSignal["status"]) {
  switch (status) {
    case "green":
      return "Verde";
    case "yellow":
      return "Amarillo";
    case "red":
      return "Rojo";
    default:
      return "Desconocido";
  }
}

export function BusinessSignals({ signals }: Props) {
  return (
    <div className="rounded-3xl border border-border bg-white p-6 shadow-soft">
      <p className="text-sm uppercase tracking-[0.18em] text-muted-foreground">
        Semáforo ejecutivo
      </p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {signals.map((signal) => (
          <div
            key={signal.category}
            className="rounded-3xl border border-border/80 bg-slate-50 p-4"
          >
            <p className="text-sm font-medium uppercase tracking-[0.12em] text-muted-foreground">
              {signal.category}
            </p>
            <p className="mt-3 text-2xl font-semibold text-deep">{getSignalLabel(signal.status)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

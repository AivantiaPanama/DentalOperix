import type { GoalProgress } from "@/lib/goal-engine";

type Props = {
  label: string;
  progress: GoalProgress;
  unit?: string;
  detail?: string;
};

const statusClasses: Record<GoalProgress["status"], string> = {
  "on-track": "bg-emerald-500 text-emerald-50",
  warning: "bg-amber-500 text-amber-50",
  "at-risk": "bg-rose-500 text-rose-50",
};

export function GoalCard({ label, progress, detail, unit }: Props) {
  return (
    <div className="rounded-3xl border border-border bg-white p-6 shadow-soft">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
          <p className="mt-3 text-3xl font-semibold text-deep">
            {progress.current.toLocaleString()}
            {unit ?? ""} / {progress.target.toLocaleString()}
            {unit ?? ""}
          </p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClasses[progress.status]}`}
        >
          {progress.status === "on-track"
            ? "🟢 on-track"
            : progress.status === "warning"
              ? "🟡 warning"
              : "🔴 at-risk"}
        </span>
      </div>
      <div className="mt-4 flex items-center justify-between gap-4 text-sm text-muted-foreground">
        <span>{progress.progressPercent.toFixed(0)}%</span>
        <span>{progress.remaining.toLocaleString()} restantes</span>
      </div>
      {detail ? <p className="mt-4 text-sm text-muted-foreground">{detail}</p> : null}
    </div>
  );
}

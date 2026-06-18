type ComparisonBadgeProps = {
  label: string;
  changePercent: number;
};

export function ComparisonBadge({ label, changePercent }: ComparisonBadgeProps) {
  const isPositive = changePercent >= 0;
  const display = `${isPositive ? "+" : ""}${changePercent}%`;
  const badgeClass = isPositive
    ? "text-emerald-700 bg-emerald-100"
    : "text-destructive bg-destructive/10";

  return (
    <div
      className="inline-flex items-center gap-2 rounded-2xl px-3 py-2 text-sm font-medium"
      role="status"
    >
      <span className={badgeClass}>{display}</span>
      <span className="text-muted-foreground">{label}</span>
    </div>
  );
}

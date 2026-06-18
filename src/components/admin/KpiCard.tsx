type Props = {
  label: string;
  value: string;
  footer?: React.ReactNode;
};

export function KpiCard({ label, value, footer }: Props) {
  return (
    <div className="rounded-3xl border border-border bg-white p-6 shadow-soft">
      <p className="text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-4 text-4xl font-bold tracking-tight text-deep">{value}</p>
      {footer ? <div className="mt-4">{footer}</div> : null}
    </div>
  );
}

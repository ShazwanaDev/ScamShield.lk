const toneClasses = {
  brand: "from-brand/10 to-brand-2/10 text-brand-2",
  success: "from-success/15 to-success/5 text-success",
  warning: "from-warning/15 to-warning/5 text-warning",
  danger: "from-danger/15 to-danger/5 text-danger",
  accent: "from-brand-accent/15 to-brand/10 text-brand-2",
};

export default function StatTile({ label, value, hint, tone = "brand", icon }) {
  const bg = toneClasses[tone];
  return (
    <div className="hover-lift group relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-card">
      <div
        aria-hidden
        className={`pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br ${bg} opacity-70 blur-xl`}
      />
      <div className="relative flex items-start justify-between">
        <div>
          <div className="text-xs font-medium text-muted-foreground">{label}</div>
          <div className="mt-1 text-2xl font-black tracking-tight">{value}</div>
          {hint && <div className="mt-1 text-[11px] text-muted-foreground">{hint}</div>}
        </div>
        {icon && (
          <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${bg}`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}

export default function StepCard({ number, icon, title, description }) {
  return (
    <div className="hover-lift relative rounded-2xl border border-border bg-card p-6 shadow-card">
      <div className="flex items-center gap-3">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-brand text-brand-foreground shadow-elegant">
          {icon}
        </div>
        <span className="text-4xl font-black text-border" aria-hidden="true">
          {number}
        </span>
      </div>
      <h3 className="mt-4 text-base font-bold">{title}</h3>
      <p className="mt-1.5 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

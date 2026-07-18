export default function PageHeader({ eyebrow, title, description, actions, icon }) {
  return (
    <div className="relative mb-8 overflow-hidden rounded-3xl border border-border bg-card/60 p-6 shadow-card backdrop-blur-xl md:p-8">
      <div aria-hidden className="absolute inset-0 -z-0 bg-gradient-hero opacity-60" />
      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-4">
          {icon && (
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-brand text-white shadow-elegant">
              {icon}
            </div>
          )}
          <div className="min-w-0">
            {eyebrow && (
              <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-2">
                {eyebrow}
              </div>
            )}
            <h1 className="truncate text-2xl font-black tracking-tight sm:text-3xl">{title}</h1>
            {description && (
              <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{description}</p>
            )}
          </div>
        </div>
        {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
}

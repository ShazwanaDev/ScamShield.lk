import { Breadcrumbs, Badge, cn } from "../../ui/index.js";

/**
 * Shared hero band for public content pages. `variant="navy"` for marquee
 * pages, `variant="light"` (default) for standard content.
 */
export default function ContentHero({ eyebrow, title, description, breadcrumbs, variant = "light", icon, actions, children }) {
  const dark = variant === "navy";
  return (
    <section className={cn("relative overflow-hidden", dark ? "bg-gradient-navy text-white" : "border-b border-border bg-surface")}>
      {dark && <div className="absolute inset-0 bg-grid opacity-50" aria-hidden="true" />}
      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        {breadcrumbs && (
          <div className={dark ? "[&_*]:text-white/60 [&_a:hover]:text-white" : ""}>
            <Breadcrumbs items={breadcrumbs} className="mb-5" />
          </div>
        )}
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            {eyebrow && (
              <Badge tone={dark ? "teal" : "primary"} className={dark ? "bg-white/10 text-teal-light ring-white/15" : ""} icon={icon}>
                {eyebrow}
              </Badge>
            )}
            <h1 className={cn("mt-4 text-display-sm", dark ? "text-white" : "text-foreground")}>{title}</h1>
            {description && (
              <p className={cn("mt-4 text-lg leading-relaxed", dark ? "text-white/70" : "text-foreground-secondary")}>{description}</p>
            )}
          </div>
          {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
        </div>
        {children}
      </div>
    </section>
  );
}

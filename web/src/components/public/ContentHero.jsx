import { Breadcrumbs, cn } from "../../ui/index.js";

/**
 * Shared hero band for public content pages. `variant="navy"` (name kept for
 * back-compat) adds the red horizon glow for marquee pages; the default is a
 * quiet band with a hairline.
 */
export default function ContentHero({ eyebrow, title, description, breadcrumbs, variant = "light", actions, children }) {
  const glow = variant === "navy";
  return (
    <section className={cn("relative overflow-hidden border-b border-white/[0.06]", glow ? "bg-gradient-navy" : "bg-background")}>
      {glow && (
        <>
          <div className="absolute inset-0 bg-dots opacity-60 [mask-image:linear-gradient(180deg,#000_0%,transparent_85%)]" aria-hidden="true" />
          <div
            className="pointer-events-none absolute left-1/2 top-[84%] aspect-square w-[160%] -translate-x-1/2 rounded-full bg-background shadow-[0_-1px_0_0_rgba(255,140,128,0.55),0_-30px_90px_-10px_rgba(255,59,48,0.45)] sm:top-[80%] sm:w-[120%]"
            aria-hidden="true"
          />
        </>
      )}
      <div className="relative mx-auto max-w-7xl px-4 pb-14 pt-12 sm:px-6 sm:pb-20 sm:pt-16 lg:px-8">
        {breadcrumbs && <Breadcrumbs items={breadcrumbs} className="mb-6" />}
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            {eyebrow && <p className="eyebrow-bracket">{eyebrow}</p>}
            <h1 className="mt-4 text-display-sm text-foreground sm:text-[3rem]">{title}</h1>
            {description && <p className="mt-4 max-w-xl text-[17px] leading-relaxed text-muted-foreground">{description}</p>}
          </div>
          {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
        </div>
        {children}
      </div>
    </section>
  );
}

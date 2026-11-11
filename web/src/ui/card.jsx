import { cn } from "./cn.js";
import { IconTrendingUp, IconTrendingDown } from "../components/icons.jsx";

/* ── Card family ────────────────────────────────────────────────── */

export function Card({ as: Comp = "div", className, interactive = false, children, ...props }) {
  return (
    <Comp
      className={cn(
        "rounded-xl border border-white/[0.06] bg-surface shadow-card",
        interactive && "hover-lift cursor-pointer hover:border-white/[0.12]",
        className,
      )}
      {...props}
    >
      {children}
    </Comp>
  );
}

export function CardHeader({ className, children, ...props }) {
  return (
    <div className={cn("flex flex-wrap items-center justify-between gap-3 px-5 pb-1 pt-5", className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ as: Comp = "h3", className, children, ...props }) {
  return (
    <Comp className={cn("text-card-title text-foreground", className)} {...props}>
      {children}
    </Comp>
  );
}

export function CardDescription({ className, children, ...props }) {
  return (
    <p className={cn("mt-1 text-sm text-muted-foreground", className)} {...props}>
      {children}
    </p>
  );
}

export function CardContent({ className, children, ...props }) {
  return (
    <div className={cn("px-5 py-4", className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ className, children, ...props }) {
  return (
    <div className={cn("flex flex-wrap items-center gap-3 border-t border-white/[0.06] px-5 py-4", className)} {...props}>
      {children}
    </div>
  );
}

/* ── SectionHeading ─────────────────────────────────────────────── */

export function SectionHeading({ eyebrow, title, description, align = "left", className, children }) {
  return (
    <div className={cn(align === "center" && "text-center", className)}>
      {eyebrow && <p className="eyebrow-bracket mb-3">{eyebrow}</p>}
      <div className={cn("flex flex-wrap items-end justify-between gap-4", align === "center" && "justify-center")}>
        <div className={cn(align === "center" && "mx-auto max-w-2xl")}>
          <h2 className="font-display text-[1.75rem] font-semibold leading-[1.1] tracking-[-0.03em] text-foreground sm:text-[2.25rem]">
            {title}
          </h2>
          {description && (
            <p className={cn("mt-3 max-w-xl text-[15px] leading-relaxed text-muted-foreground", align === "center" && "mx-auto")}>
              {description}
            </p>
          )}
        </div>
        {children && <div className="shrink-0">{children}</div>}
      </div>
    </div>
  );
}

/* ── Stat tile ──────────────────────────────────────────────────── */

const STAT_ICON_TONES = {
  primary: "text-primary",
  scam: "text-scam",
  spam: "text-spam",
  legit: "text-legit",
  teal: "text-primary-soft",
  navy: "text-foreground-secondary",
  info: "text-info",
};

/**
 * A single KPI: outline icon, label, display figure, caption. Use `bare` to
 * drop the card chrome when tiles sit inside a <KpiStrip>.
 */
export function Stat({ label, value, icon, tone = "primary", delta, deltaTone, hint, bare = false, className }) {
  const up = deltaTone ? deltaTone === "up" : String(delta || "").trim().startsWith("+");
  return (
    <div className={cn(!bare && "rounded-xl border border-white/[0.06] bg-surface shadow-card", "p-5", className)}>
      {icon && <span className={cn("inline-flex h-5 w-5 items-center justify-center [&_svg]:h-[18px] [&_svg]:w-[18px]", STAT_ICON_TONES[tone])}>{icon}</span>}
      <p className={cn("truncate text-[13px] text-muted-foreground", icon && "mt-4")}>{label}</p>
      <p className="figure mt-1.5 text-data-value text-foreground">{value}</p>
      {(delta || hint) && (
        <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
          {delta && (
            <span className={cn("inline-flex items-center gap-1 font-medium", up ? "text-legit" : "text-scam")}>
              {up ? <IconTrendingUp className="h-3.5 w-3.5" /> : <IconTrendingDown className="h-3.5 w-3.5" />}
              {delta}
            </span>
          )}
          {hint && <span className="text-muted-foreground">{hint}</span>}
        </div>
      )}
    </div>
  );
}

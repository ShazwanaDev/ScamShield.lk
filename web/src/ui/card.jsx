import { cn } from "./cn.js";
import { IconTrendingUp, IconTrendingDown } from "../components/icons.jsx";

/* ── Card family ────────────────────────────────────────────────── */

export function Card({ as: Comp = "div", className, interactive = false, children, ...props }) {
  return (
    <Comp
      className={cn(
        "rounded-lg border border-border bg-surface shadow-card",
        interactive && "hover-lift cursor-pointer",
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
    <div className={cn("flex flex-wrap items-start justify-between gap-3 border-b border-border px-5 py-4", className)} {...props}>
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
    <div className={cn("flex flex-wrap items-center gap-3 border-t border-border px-5 py-4", className)} {...props}>
      {children}
    </div>
  );
}

/* ── SectionHeading ─────────────────────────────────────────────── */

export function SectionHeading({ eyebrow, title, description, align = "left", className, children }) {
  return (
    <div className={cn(align === "center" && "text-center", className)}>
      {eyebrow && (
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-primary">{eyebrow}</p>
      )}
      <div className={cn("flex flex-wrap items-end justify-between gap-4", align === "center" && "justify-center")}>
        <div className={cn(align === "center" && "mx-auto max-w-2xl")}>
          <h2 className="text-section-title text-foreground sm:text-2xl">{title}</h2>
          {description && <p className="mt-2 text-[15px] leading-relaxed text-foreground-secondary">{description}</p>}
        </div>
        {children && <div className="shrink-0">{children}</div>}
      </div>
    </div>
  );
}

/* ── Stat tile ──────────────────────────────────────────────────── */

const STAT_ICON_TONES = {
  primary: "bg-primary/10 text-primary",
  scam: "bg-scam-light text-scam",
  spam: "bg-spam-light text-spam",
  legit: "bg-legit-light text-legit",
  teal: "bg-teal/10 text-teal",
  navy: "bg-navy/10 text-navy",
  info: "bg-info-light text-info",
};

export function Stat({ label, value, icon, tone = "primary", delta, deltaTone, hint, className }) {
  const up = deltaTone ? deltaTone === "up" : String(delta || "").trim().startsWith("+");
  return (
    <div className={cn("rounded-lg border border-border bg-surface p-5 shadow-card", className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-muted-foreground">{label}</p>
          <p className="mt-2 text-data-value tabular-nums text-foreground">{value}</p>
        </div>
        {icon && (
          <span className={cn("inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md", STAT_ICON_TONES[tone])}>
            {icon}
          </span>
        )}
      </div>
      {(delta || hint) && (
        <div className="mt-3 flex items-center gap-2 text-xs">
          {delta && (
            <span className={cn("inline-flex items-center gap-1 font-semibold", up ? "text-legit" : "text-scam")}>
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

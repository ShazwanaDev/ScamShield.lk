import { forwardRef } from "react";
import { cn } from "./cn.js";
import { IconLoader } from "../components/icons.jsx";

/* ── Button ─────────────────────────────────────────────────────── */

const BTN_BASE =
  "relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition duration-200 ease-out " +
  "active:translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background " +
  "disabled:pointer-events-none disabled:opacity-45 select-none";

// Filled red controls use the CTA gradient so white text keeps AA contrast.
const RED_CTA =
  "bg-gradient-cta text-white shadow-glow-sm hover:brightness-110 " +
  "after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.28)]";

const BTN_VARIANTS = {
  primary: RED_CTA,
  teal: RED_CTA,
  danger: RED_CTA,
  // Light solid button, as in "Request a demo"
  inverse: "bg-foreground text-background shadow-xs hover:bg-white",
  navy: "bg-white/[0.06] text-foreground ring-1 ring-inset ring-white/10 hover:bg-white/10",
  secondary: "bg-surface-raised text-foreground ring-1 ring-inset ring-white/[0.08] hover:bg-[#222227] hover:ring-white/[0.14]",
  outline: "bg-white/[0.02] text-foreground ring-1 ring-inset ring-white/[0.16] hover:bg-white/[0.07] hover:ring-white/25",
  ghost: "text-foreground-secondary hover:bg-white/[0.06] hover:text-foreground",
  subtle: "bg-primary/10 text-primary hover:bg-primary/15",
  "danger-outline": "text-scam ring-1 ring-inset ring-scam/40 hover:bg-scam/10",
  "warning-outline": "text-spam ring-1 ring-inset ring-spam/45 hover:bg-spam/10",
  success: "bg-legit-strong text-white hover:brightness-110",
};

const BTN_SIZES = {
  sm: "h-9 px-3 text-[13px]",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-5 text-[15px]",
  icon: "h-11 w-11",
  "icon-sm": "h-9 w-9",
};

export const Button = forwardRef(function Button(
  {
    as: Comp = "button",
    variant = "primary",
    size = "md",
    className,
    loading = false,
    disabled,
    leftIcon,
    rightIcon,
    fullWidth,
    children,
    ...props
  },
  ref,
) {
  const isBtn = Comp === "button";
  return (
    <Comp
      ref={ref}
      className={cn(
        BTN_BASE,
        BTN_VARIANTS[variant],
        BTN_SIZES[size],
        fullWidth && "w-full",
        className,
      )}
      disabled={isBtn ? disabled || loading : undefined}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? (
        <IconLoader className="h-4 w-4 animate-spin" />
      ) : (
        leftIcon && <span className="-ml-0.5 shrink-0">{leftIcon}</span>
      )}
      {children}
      {!loading && rightIcon && <span className="-mr-0.5 shrink-0">{rightIcon}</span>}
    </Comp>
  );
});

/* ── IconButton ─────────────────────────────────────────────────── */

export const IconButton = forwardRef(function IconButton(
  { variant = "ghost", size = "icon", className, label, children, ...props },
  ref,
) {
  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn("shrink-0", className)}
      aria-label={label}
      title={label}
      {...props}
    >
      {children}
    </Button>
  );
});

/* ── Badge ──────────────────────────────────────────────────────── */

const BADGE_TONES = {
  neutral: "bg-white/[0.04] text-foreground-secondary ring-white/10",
  primary: "bg-primary/10 text-primary-soft ring-primary/25",
  scam: "bg-scam-light text-scam ring-scam/25",
  spam: "bg-spam-light text-spam ring-spam/25",
  legit: "bg-legit-light text-legit ring-legit/25",
  success: "bg-legit-light text-legit ring-legit/25",
  warning: "bg-warning-light text-warning ring-warning/30",
  error: "bg-scam-light text-scam ring-scam/25",
  info: "bg-info-light text-info ring-info/20",
  teal: "bg-primary/10 text-primary-soft ring-primary/25",
  solid: "bg-warning text-warning-foreground ring-transparent",
};

export function Badge({ tone = "neutral", size = "md", className, icon, children, ...props }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md font-medium ring-1 ring-inset",
        size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs",
        BADGE_TONES[tone],
        className,
      )}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </span>
  );
}

/* ── Dot (status indicator) ─────────────────────────────────────── */

const DOT_TONES = {
  online: "bg-legit",
  offline: "bg-muted-foreground",
  busy: "bg-scam",
  idle: "bg-warning",
  primary: "bg-primary",
};

export function StatusDot({ tone = "online", pulse = false, className }) {
  return (
    <span className={cn("relative inline-flex h-2.5 w-2.5", className)}>
      {pulse && (
        <span className={cn("absolute inline-flex h-full w-full animate-ping rounded-full opacity-60", DOT_TONES[tone])} />
      )}
      <span className={cn("relative inline-flex h-2.5 w-2.5 rounded-full", DOT_TONES[tone])} />
    </span>
  );
}

/* ── Spinner ────────────────────────────────────────────────────── */

export function Spinner({ className, label = "Loading" }) {
  return (
    <span role="status" aria-label={label} className="inline-flex">
      <IconLoader className={cn("h-5 w-5 animate-spin text-primary", className)} />
    </span>
  );
}

/* ── Avatar ─────────────────────────────────────────────────────── */

export function Avatar({ name = "", src, size = "md", className }) {
  const sizes = { sm: "h-8 w-8 text-xs", md: "h-10 w-10 text-sm", lg: "h-12 w-12 text-base" };
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center overflow-hidden rounded-[30%] bg-white/[0.06] font-mono font-medium text-foreground ring-1 ring-inset ring-white/10",
        sizes[size],
        className,
      )}
    >
      {src ? <img src={src} alt="" className="h-full w-full object-cover" /> : initials || "?"}
    </span>
  );
}

/* ── ProgressBar ────────────────────────────────────────────────── */

const PROGRESS_TONES = {
  primary: "bg-primary",
  scam: "bg-scam",
  spam: "bg-spam",
  legit: "bg-legit",
  teal: "bg-primary",
  navy: "bg-foreground-secondary",
};

export function ProgressBar({ value = 0, tone = "primary", className, showLabel = false, size = "md" }) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div
        className={cn("w-full overflow-hidden rounded-full bg-cell", size === "sm" ? "h-1.5" : "h-2.5")}
        role="progressbar"
        aria-valuenow={Math.round(pct)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={cn("h-full rounded-full transition-[width] duration-500 ease-out", PROGRESS_TONES[tone])}
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel && <span className="w-10 shrink-0 text-right text-xs font-semibold tabular-nums">{Math.round(pct)}%</span>}
    </div>
  );
}

/* ── Divider ────────────────────────────────────────────────────── */

export function Divider({ className, label }) {
  if (label) {
    return (
      <div className={cn("flex items-center gap-3", className)}>
        <span className="h-px flex-1 bg-border" />
        <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">{label}</span>
        <span className="h-px flex-1 bg-border" />
      </div>
    );
  }
  return <hr className={cn("border-0 border-t border-border", className)} />;
}

/* ── Kbd ────────────────────────────────────────────────────────── */

export function Kbd({ children }) {
  return (
    <kbd className="inline-flex min-w-[1.5rem] items-center justify-center rounded border border-border bg-background-secondary px-1.5 py-0.5 font-mono text-[11px] font-semibold text-foreground-secondary shadow-xs">
      {children}
    </kbd>
  );
}

/* ── CtaArrow ───────────────────────────────────────────────────── */

/** The small square arrow chip that sits at the end of a light CTA button. */
export function CtaArrow({ small = false, className }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex items-center justify-center bg-gradient-cta text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.3)] transition-transform duration-200 group-hover:translate-x-0.5",
        small ? "h-6 w-6 rounded-[6px]" : "h-7 w-7 rounded-[7px]",
        className,
      )}
    >
      <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none">
        <path d="M3 8h9.5M8.5 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

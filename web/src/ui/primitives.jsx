import { forwardRef } from "react";
import { cn } from "./cn.js";
import { IconLoader } from "../components/icons.jsx";

/* ── Button ─────────────────────────────────────────────────────── */

const BTN_BASE =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-semibold transition " +
  "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/50 " +
  "disabled:pointer-events-none disabled:opacity-50 select-none";

const BTN_VARIANTS = {
  primary: "bg-primary text-white shadow-xs hover:bg-primary/90 active:bg-primary",
  navy: "bg-navy text-white shadow-xs hover:bg-navy/90",
  teal: "bg-teal text-white shadow-xs hover:bg-teal/90",
  secondary: "bg-white text-foreground border border-border shadow-xs hover:bg-background-secondary",
  outline: "border border-border-strong text-foreground hover:bg-background-secondary",
  ghost: "text-foreground-secondary hover:bg-background-secondary hover:text-foreground",
  subtle: "bg-primary/10 text-primary hover:bg-primary/15",
  danger: "bg-scam text-white shadow-xs hover:bg-scam/90",
  "danger-outline": "border border-scam/40 text-scam hover:bg-scam-light",
  success: "bg-legit text-white shadow-xs hover:bg-legit/90",
};

const BTN_SIZES = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-4 text-sm",
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
  neutral: "bg-background-secondary text-foreground-secondary ring-border",
  primary: "bg-primary/10 text-primary ring-primary/20",
  scam: "bg-scam-light text-scam ring-scam/20",
  spam: "bg-spam-light text-spam ring-spam/25",
  legit: "bg-legit-light text-legit ring-legit/20",
  success: "bg-legit-light text-legit ring-legit/20",
  warning: "bg-warning-light text-spam ring-warning/30",
  error: "bg-scam-light text-scam ring-scam/20",
  info: "bg-info-light text-info ring-info/20",
  teal: "bg-teal/10 text-teal ring-teal/20",
};

export function Badge({ tone = "neutral", size = "md", className, icon, children, ...props }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-semibold ring-1 ring-inset",
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
        "inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-navy font-semibold text-white",
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
  teal: "bg-teal",
  navy: "bg-navy",
};

export function ProgressBar({ value = 0, tone = "primary", className, showLabel = false, size = "md" }) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div
        className={cn("w-full overflow-hidden rounded-full bg-background-secondary", size === "sm" ? "h-1.5" : "h-2.5")}
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
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</span>
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

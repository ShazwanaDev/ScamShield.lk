import { forwardRef, useId } from "react";
import { cn } from "./cn.js";
import { IconChevronDown, IconSearch, IconAlertCircle, IconCheck } from "../components/icons.jsx";

/* ── Field wrapper (label + helper + error) ─────────────────────── */

export function Field({ label, htmlFor, hint, error, required, className, children }) {
  return (
    <div className={cn("space-y-1.5", className)}>
      {label && (
        <label htmlFor={htmlFor} className="flex items-center gap-1 text-sm font-medium text-foreground">
          {label}
          {required && <span className="text-scam" aria-hidden="true">*</span>}
        </label>
      )}
      {children}
      {error ? (
        <p className="flex items-center gap-1.5 text-sm text-scam">
          <IconAlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </p>
      ) : (
        hint && <p className="text-sm text-muted-foreground">{hint}</p>
      )}
    </div>
  );
}

const CONTROL_BASE =
  "w-full rounded-md border bg-black/30 text-foreground placeholder:text-muted-foreground/80 " +
  "transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/15 " +
  "disabled:cursor-not-allowed disabled:bg-white/[0.02] disabled:text-muted-foreground";

function controlState(error) {
  return error
    ? "border-scam focus-visible:border-scam focus-visible:ring-scam/20"
    : "border-white/[0.09] hover:border-white/[0.16] focus-visible:border-primary/70";
}

/* ── Input ──────────────────────────────────────────────────────── */

export const Input = forwardRef(function Input(
  { className, error, leftIcon, rightIcon, size = "md", ...props },
  ref,
) {
  const pad = size === "sm" ? "h-9 text-sm" : "h-11 text-[15px]";
  return (
    <div className="relative">
      {leftIcon && (
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          {leftIcon}
        </span>
      )}
      <input
        ref={ref}
        className={cn(
          CONTROL_BASE,
          controlState(error),
          pad,
          leftIcon ? "pl-10" : "px-3.5",
          rightIcon ? "pr-10" : "px-3.5",
          className,
        )}
        aria-invalid={error ? true : undefined}
        {...props}
      />
      {rightIcon && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">{rightIcon}</span>}
    </div>
  );
});

/* ── SearchInput ────────────────────────────────────────────────── */

export const SearchInput = forwardRef(function SearchInput({ className, ...props }, ref) {
  return (
    <Input
      ref={ref}
      type="search"
      leftIcon={<IconSearch className="h-4 w-4" />}
      className={className}
      placeholder="Search…"
      {...props}
    />
  );
});

/* ── Textarea ───────────────────────────────────────────────────── */

export const Textarea = forwardRef(function Textarea({ className, error, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      className={cn(CONTROL_BASE, controlState(error), "min-h-[120px] resize-y px-3.5 py-3 text-[15px] leading-relaxed", className)}
      aria-invalid={error ? true : undefined}
      {...props}
    />
  );
});

/* ── Select ─────────────────────────────────────────────────────── */

export const Select = forwardRef(function Select({ className, error, children, size = "md", ...props }, ref) {
  const pad = size === "sm" ? "h-9 text-sm" : "h-11 text-[15px]";
  return (
    <div className="relative">
      <select
        ref={ref}
        className={cn(
          CONTROL_BASE,
          controlState(error),
          pad,
          "cursor-pointer appearance-none pl-3.5 pr-10",
          className,
        )}
        aria-invalid={error ? true : undefined}
        {...props}
      >
        {children}
      </select>
      <IconChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
    </div>
  );
});

/* ── Checkbox ───────────────────────────────────────────────────── */

export function Checkbox({ label, hint, className, id, ...props }) {
  const autoId = useId();
  const inputId = id || autoId;
  return (
    <label htmlFor={inputId} className={cn("flex cursor-pointer items-start gap-3", className)}>
      <input
        id={inputId}
        type="checkbox"
        className="mt-0.5 h-5 w-5 shrink-0 rounded border-border-strong text-primary focus-visible:ring-4 focus-visible:ring-ring/40"
        {...props}
      />
      {(label || hint) && (
        <span className="text-sm">
          {label && <span className="font-medium text-foreground">{label}</span>}
          {hint && <span className="mt-0.5 block text-muted-foreground">{hint}</span>}
        </span>
      )}
    </label>
  );
}

/* ── Radio group ────────────────────────────────────────────────── */

export function RadioCard({ label, hint, checked, name, value, onChange, icon, className }) {
  return (
    <label
      className={cn(
        "flex cursor-pointer items-start gap-3 rounded-md border p-3.5 transition",
        checked ? "border-primary/60 bg-primary/[0.07] ring-1 ring-primary/30" : "border-white/[0.08] hover:border-white/[0.16] hover:bg-white/[0.03]",
        className,
      )}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="mt-0.5 h-5 w-5 shrink-0 border-border-strong text-primary focus-visible:ring-4 focus-visible:ring-ring/40"
      />
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2 text-sm font-medium text-foreground">
          {icon}
          {label}
        </span>
        {hint && <span className="mt-0.5 block text-sm text-muted-foreground">{hint}</span>}
      </span>
    </label>
  );
}

/* ── Switch ─────────────────────────────────────────────────────── */

export function Switch({ checked, onChange, label, hint, id, disabled }) {
  const autoId = useId();
  const inputId = id || autoId;
  return (
    <div className="flex items-start justify-between gap-4">
      {(label || hint) && (
        <label htmlFor={inputId} className="min-w-0 cursor-pointer">
          {label && <span className="block text-sm font-medium text-foreground">{label}</span>}
          {hint && <span className="mt-0.5 block text-sm text-muted-foreground">{hint}</span>}
        </label>
      )}
      <button
        id={inputId}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={typeof label === "string" ? label : undefined}
        disabled={disabled}
        onClick={() => onChange?.(!checked)}
        className={cn(
          "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/40 disabled:opacity-50",
          checked ? "bg-primary-strong" : "bg-white/[0.12]",
        )}
      >
        <span
          className={cn(
            "inline-block h-5 w-5 transform rounded-full bg-white shadow transition",
            checked ? "translate-x-[22px]" : "translate-x-0.5",
          )}
        />
      </button>
    </div>
  );
}

/* ── SegmentedControl (filter chips) ────────────────────────────── */

export function SegmentedControl({ options, value, onChange, className, size = "md" }) {
  return (
    <div
      role="tablist"
      className={cn("inline-flex flex-wrap items-center gap-0.5 rounded-md border border-white/[0.08] bg-black/30 p-0.5", className)}
    >
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            role="tab"
            aria-selected={active}
            onClick={() => onChange?.(opt.value)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded font-semibold transition",
              size === "sm" ? "px-2.5 py-1 text-xs" : "px-3 py-1.5 text-sm",
              active ? "bg-white/[0.08] text-foreground shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {opt.icon}
            {opt.label}
            {opt.count != null && (
              <span className={cn("rounded px-1.5 font-mono text-[11px]", active ? "bg-primary/15 text-primary-soft" : "bg-white/[0.06] text-muted-foreground")}>
                {opt.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export { IconCheck };

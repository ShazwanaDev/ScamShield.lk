import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useLenis } from "lenis/react";
import { cn } from "./cn.js";
import {
  IconInfo,
  IconCheckCircle,
  IconAlertTriangle,
  IconAlertCircle,
  IconClose,
} from "../components/icons.jsx";

/* ── Alert ──────────────────────────────────────────────────────── */

const ALERT_TONES = {
  info: { wrap: "bg-white/[0.03] border-white/[0.08] text-foreground", icon: "text-primary-soft", Icon: IconInfo },
  success: { wrap: "bg-legit-light border-legit/25 text-foreground", icon: "text-legit", Icon: IconCheckCircle },
  warning: { wrap: "bg-warning-light border-warning/25 text-foreground", icon: "text-warning", Icon: IconAlertTriangle },
  error: { wrap: "bg-scam-light border-scam/25 text-foreground", icon: "text-scam", Icon: IconAlertCircle },
  neutral: { wrap: "bg-white/[0.03] border-white/[0.08] text-foreground", icon: "text-muted-foreground", Icon: IconInfo },
};

export function Alert({ tone = "info", title, children, onClose, action, className }) {
  const t = ALERT_TONES[tone] || ALERT_TONES.info;
  const Icon = t.Icon;
  return (
    <div role="alert" className={cn("flex items-start gap-3 rounded-md border p-4", t.wrap, className)}>
      <Icon className={cn("mt-0.5 h-5 w-5 shrink-0", t.icon)} />
      <div className="min-w-0 flex-1">
        {title && <p className="text-sm font-semibold text-foreground">{title}</p>}
        {children && <div className={cn("text-sm text-foreground-secondary", title && "mt-0.5")}>{children}</div>}
        {action && <div className="mt-2.5">{action}</div>}
      </div>
      {onClose && (
        <button onClick={onClose} className="shrink-0 rounded p-1 text-muted-foreground hover:bg-white/[0.06]" aria-label="Dismiss">
          <IconClose className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

/* ── EmptyState ─────────────────────────────────────────────────── */

export function EmptyState({ icon, title, description, action, className }) {
  return (
    <div className={cn("flex flex-col items-center justify-center px-6 py-14 text-center", className)}>
      {icon && (
        <span className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-white/[0.04] text-muted-foreground ring-1 ring-inset ring-white/[0.08]">
          {icon}
        </span>
      )}
      <h3 className="text-card-title text-foreground">{title}</h3>
      {description && <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

/* ── ErrorState ─────────────────────────────────────────────────── */

export function ErrorState({ title = "Something went wrong", description, onRetry, retryLabel = "Try again", className }) {
  return (
    <div className={cn("flex flex-col items-center justify-center px-6 py-14 text-center", className)}>
      <span className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-scam-light text-scam ring-1 ring-inset ring-scam/25">
        <IconAlertCircle className="h-7 w-7" />
      </span>
      <h3 className="text-card-title text-foreground">{title}</h3>
      {description && <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">{description}</p>}
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-5 inline-flex h-10 items-center rounded-md px-4 text-sm font-medium text-foreground ring-1 ring-inset ring-white/[0.16] transition hover:bg-white/[0.07]"
        >
          {retryLabel}
        </button>
      )}
    </div>
  );
}

/* ── Skeleton ───────────────────────────────────────────────────── */

export function Skeleton({ className }) {
  return <div className={cn("skeleton", className)} />;
}

export function SkeletonText({ lines = 3, className }) {
  return (
    <div className={cn("space-y-2.5", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className={cn("h-3.5", i === lines - 1 ? "w-2/3" : "w-full")} />
      ))}
    </div>
  );
}

export function SkeletonCard({ className }) {
  return (
    <div className={cn("rounded-xl border border-white/[0.06] bg-surface p-5", className)}>
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="mt-4 h-8 w-1/2" />
      <SkeletonText lines={2} className="mt-4" />
    </div>
  );
}

/* ── Toast system ───────────────────────────────────────────────── */

const ToastCtx = createContext(null);

const TOAST_TONES = {
  success: { icon: IconCheckCircle, color: "text-legit", ring: "border-legit/25" },
  error: { icon: IconAlertCircle, color: "text-scam", ring: "border-scam/25" },
  warning: { icon: IconAlertTriangle, color: "text-warning", ring: "border-warning/30" },
  info: { icon: IconInfo, color: "text-primary-soft", ring: "border-white/[0.1]" },
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => setToasts((t) => t.filter((x) => x.id !== id)), []);

  const toast = useCallback(
    (opts) => {
      const id = Math.random().toString(36).slice(2);
      const entry = { id, tone: "info", duration: 4000, ...(typeof opts === "string" ? { title: opts } : opts) };
      setToasts((t) => [...t, entry]);
      if (entry.duration) setTimeout(() => dismiss(id), entry.duration);
      return id;
    },
    [dismiss],
  );

  return (
    <ToastCtx.Provider value={{ toast, dismiss }}>
      {children}
      <div className="pointer-events-none fixed bottom-4 right-4 z-[80] flex w-full max-w-sm flex-col gap-2.5 px-4 sm:px-0">
        {toasts.map((t) => {
          const cfg = TOAST_TONES[t.tone] || TOAST_TONES.info;
          const Icon = cfg.icon;
          return (
            <div
              key={t.id}
              className={cn(
                "pointer-events-auto flex items-start gap-3 rounded-lg border bg-surface-raised p-4 shadow-xl animate-slide-in-right",
                cfg.ring,
              )}
              role="status"
            >
              <Icon className={cn("mt-0.5 h-5 w-5 shrink-0", cfg.color)} />
              <div className="min-w-0 flex-1">
                {t.title && <p className="text-sm font-semibold text-foreground">{t.title}</p>}
                {t.description && <p className="mt-0.5 text-sm text-muted-foreground">{t.description}</p>}
              </div>
              <button onClick={() => dismiss(t.id)} className="shrink-0 rounded p-1 text-muted-foreground hover:bg-background-secondary" aria-label="Dismiss">
                <IconClose className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastCtx.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastCtx);
  if (!ctx) return { toast: () => {}, dismiss: () => {} };
  return ctx;
}

/* Small helper for pages that just want a body-scroll lock */
export function useBodyScrollLock(active) {
  const lenis = useLenis();
  useEffect(() => {
    if (!active) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    lenis?.stop();
    return () => {
      document.body.style.overflow = prev;
      lenis?.start();
    };
  }, [active, lenis]);
}

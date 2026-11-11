import { useEffect, useRef, useState, useId } from "react";
import { createPortal } from "react-dom";
import { cn } from "./cn.js";
import { useBodyScrollLock } from "./feedback.jsx";
import { Button } from "./primitives.jsx";
import { IconClose, IconAlertTriangle } from "../components/icons.jsx";

/* ── Modal ──────────────────────────────────────────────────────── */

export function Modal({ open, onClose, title, description, children, footer, size = "md", className }) {
  const ref = useRef(null);
  useBodyScrollLock(open);
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    document.addEventListener("keydown", onKey);
    ref.current?.focus();
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  const sizes = { sm: "max-w-sm", md: "max-w-lg", lg: "max-w-2xl", xl: "max-w-4xl" };

  return createPortal(
    <div className="fixed inset-0 z-[70] flex items-end justify-center p-0 sm:items-center sm:p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in" onClick={onClose} aria-hidden="true" />
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        tabIndex={-1}
        className={cn(
          "relative z-10 max-h-[92vh] w-full overflow-hidden rounded-t-xl bg-surface-raised shadow-xl ring-1 ring-white/[0.08] outline-none animate-slide-up-sheet sm:rounded-xl sm:animate-scale-in",
          sizes[size],
          className,
        )}
      >
        {(title || onClose) && (
          <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-4">
            <div>
              {title && (
                <h2 id={titleId} className="text-section-title text-foreground">
                  {title}
                </h2>
              )}
              {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
            </div>
            {onClose && (
              <button onClick={onClose} className="-mr-1 shrink-0 rounded-md p-1.5 text-muted-foreground hover:bg-white/[0.06]" aria-label="Close">
                <IconClose className="h-5 w-5" />
              </button>
            )}
          </div>
        )}
        <div className="max-h-[70vh] overflow-y-auto scrollbar-thin px-5 py-4" data-lenis-prevent>{children}</div>
        {footer && <div className="flex flex-wrap items-center justify-end gap-3 border-t border-border px-5 py-4">{footer}</div>}
      </div>
    </div>,
    document.body,
  );
}

/* ── ConfirmDialog ──────────────────────────────────────────────── */

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = "Are you sure?",
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  tone = "danger",
  loading = false,
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      size="sm"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button variant={tone === "danger" ? "danger" : "primary"} onClick={onConfirm} loading={loading}>
            {confirmLabel}
          </Button>
        </>
      }
    >
      <div className="flex gap-4">
        {tone === "danger" && (
          <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-scam-light text-scam">
            <IconAlertTriangle className="h-6 w-6" />
          </span>
        )}
        <div>
          <h2 className="text-card-title text-foreground">{title}</h2>
          {description && <p className="mt-1.5 text-sm text-muted-foreground">{description}</p>}
        </div>
      </div>
    </Modal>
  );
}

/* ── Drawer / Sheet ─────────────────────────────────────────────── */

export function Drawer({ open, onClose, title, children, footer, side = "right", className }) {
  useBodyScrollLock(open);
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  return createPortal(
    <div className="fixed inset-0 z-[70]">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in" onClick={onClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={typeof title === "string" ? title : "Panel"}
        className={cn(
          "absolute top-0 flex h-full w-full max-w-md flex-col bg-surface-raised shadow-xl ring-1 ring-white/[0.08] animate-slide-in-right",
          side === "right" ? "right-0" : "left-0",
          className,
        )}
      >
        <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-4">
          {title && <h2 className="text-section-title text-foreground">{title}</h2>}
          <button onClick={onClose} className="-mr-1 rounded-md p-1.5 text-muted-foreground hover:bg-white/[0.06]" aria-label="Close">
            <IconClose className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-thin px-5 py-4" data-lenis-prevent>{children}</div>
        {footer && <div className="border-t border-border px-5 py-4">{footer}</div>}
      </div>
    </div>,
    document.body,
  );
}

/* ── Tooltip (hover/focus, CSS-positioned) ──────────────────────── */

export function Tooltip({ content, children, side = "top", className }) {
  const [show, setShow] = useState(false);
  const pos = {
    top: "bottom-full left-1/2 mb-2 -translate-x-1/2",
    bottom: "top-full left-1/2 mt-2 -translate-x-1/2",
    left: "right-full top-1/2 mr-2 -translate-y-1/2",
    right: "left-full top-1/2 ml-2 -translate-y-1/2",
  };
  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onFocus={() => setShow(true)}
      onBlur={() => setShow(false)}
    >
      {children}
      {show && content && (
        <span
          role="tooltip"
          className={cn(
            "pointer-events-none absolute z-50 whitespace-nowrap rounded-md bg-surface-raised px-2.5 py-1.5 text-xs font-medium text-foreground shadow-lg ring-1 ring-white/10 animate-fade-in",
            pos[side],
            className,
          )}
        >
          {content}
        </span>
      )}
    </span>
  );
}

/* ── DropdownMenu (simple, click-outside) ───────────────────────── */

export function DropdownMenu({ trigger, children, align = "right", className }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const onClick = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false);
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative inline-flex">
      <span onClick={() => setOpen((o) => !o)}>{trigger}</span>
      {open && (
        <div
          className={cn(
            "absolute top-full z-50 mt-1.5 min-w-[11rem] overflow-hidden rounded-lg border border-white/[0.08] bg-surface-raised py-1 shadow-xl animate-scale-in",
            align === "right" ? "right-0" : "left-0",
            className,
          )}
          onClick={() => setOpen(false)}
        >
          {children}
        </div>
      )}
    </div>
  );
}

export function DropdownItem({ icon, danger, className, children, ...props }) {
  return (
    <button
      className={cn(
        "flex w-full items-center gap-2.5 px-3.5 py-2 text-left text-sm transition hover:bg-white/[0.06]",
        danger ? "text-scam" : "text-foreground",
        className,
      )}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </button>
  );
}

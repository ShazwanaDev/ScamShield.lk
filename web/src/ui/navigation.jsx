import { Link } from "react-router-dom";
import { cn } from "./cn.js";
import { IconChevronRight, IconChevronLeft } from "../components/icons.jsx";

/* ── Tabs (controlled) ──────────────────────────────────────────── */

export function Tabs({ tabs, value, onChange, className, variant = "underline" }) {
  return (
    <div
      role="tablist"
      className={cn(
        "flex items-center gap-1 overflow-x-auto scrollbar-thin",
        variant === "underline" && "border-b border-border",
        variant === "pills" && "rounded-md border border-white/[0.08] bg-black/30 p-0.5",
        className,
      )}
    >
      {tabs.map((t) => {
        const active = t.value === value;
        return (
          <button
            key={t.value}
            role="tab"
            aria-selected={active}
            onClick={() => onChange?.(t.value)}
            className={cn(
              "inline-flex shrink-0 items-center gap-2 whitespace-nowrap font-semibold transition",
              variant === "underline" &&
                cn(
                  "-mb-px border-b-2 px-3.5 py-2.5 text-sm",
                  active ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground",
                ),
              variant === "pills" &&
                cn("rounded-[7px] px-3.5 py-1.5 text-sm", active ? "bg-white/[0.08] text-foreground" : "text-muted-foreground hover:text-foreground"),
            )}
          >
            {t.icon}
            {t.label}
            {t.count != null && (
              <span className={cn("rounded px-1.5 font-mono text-[11px]", active ? "bg-primary/15 text-primary-soft" : "bg-white/[0.06] text-muted-foreground")}>
                {t.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

/* ── Breadcrumbs ────────────────────────────────────────────────── */

export function Breadcrumbs({ items, className }) {
  return (
    <nav aria-label="Breadcrumb" className={cn("flex items-center gap-1.5 text-sm", className)}>
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={i} className="flex items-center gap-1.5">
              {item.to && !last ? (
                <Link to={item.to} className="text-muted-foreground transition hover:text-foreground">
                  {item.label}
                </Link>
              ) : (
                <span className={cn(last ? "font-medium text-foreground" : "text-muted-foreground")} aria-current={last ? "page" : undefined}>
                  {item.label}
                </span>
              )}
              {!last && <IconChevronRight className="h-3.5 w-3.5 text-border-strong" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/* ── PageHeader ─────────────────────────────────────────────────── */

export function PageHeader({ title, description, breadcrumbs, actions, icon, tone = "primary", className }) {
  const tones = {
    primary: "bg-primary/10 text-primary ring-1 ring-inset ring-primary/20",
    scam: "bg-scam-light text-scam ring-1 ring-inset ring-scam/25",
    teal: "bg-primary/10 text-primary-soft ring-1 ring-inset ring-primary/20",
    navy: "bg-white/[0.05] text-foreground-secondary ring-1 ring-inset ring-white/10",
    info: "bg-info-light text-info ring-1 ring-inset ring-white/10",
  };
  return (
    <div className={cn("space-y-3", className)}>
      {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3.5">
          {icon && (
            <span className={cn("hidden h-11 w-11 shrink-0 items-center justify-center rounded-md sm:inline-flex", tones[tone])}>{icon}</span>
          )}
          <div>
            <h1 className="text-page-title text-foreground sm:text-[2rem]">{title}</h1>
            {description && <p className="mt-1.5 max-w-2xl text-[15px] text-muted-foreground">{description}</p>}
          </div>
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2.5">{actions}</div>}
      </div>
    </div>
  );
}

/* ── Pagination ─────────────────────────────────────────────────── */

export function Pagination({ page, pageCount, onPage, className, totalLabel }) {
  if (pageCount <= 1 && !totalLabel) return null;
  const pages = pageWindow(page, pageCount);
  return (
    <div className={cn("flex flex-wrap items-center justify-between gap-3", className)}>
      {totalLabel && <p className="text-sm text-muted-foreground">{totalLabel}</p>}
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPage(Math.max(1, page - 1))}
          disabled={page <= 1}
          className="inline-flex h-9 items-center gap-1 rounded-md border border-border px-3 text-sm font-medium text-foreground transition hover:bg-background-secondary disabled:opacity-40"
        >
          <IconChevronLeft className="h-4 w-4" /> Prev
        </button>
        <div className="hidden items-center gap-1 sm:flex">
          {pages.map((p, i) =>
            p === "…" ? (
              <span key={`e${i}`} className="px-2 text-sm text-muted-foreground">
                …
              </span>
            ) : (
              <button
                key={p}
                onClick={() => onPage(p)}
                aria-current={p === page ? "page" : undefined}
                className={cn(
                  "inline-flex h-9 min-w-9 items-center justify-center rounded-md px-2 text-sm font-semibold transition",
                  p === page ? "bg-primary text-white" : "text-foreground hover:bg-background-secondary",
                )}
              >
                {p}
              </button>
            ),
          )}
        </div>
        <span className="px-2 text-sm text-muted-foreground sm:hidden">
          {page} / {pageCount}
        </span>
        <button
          onClick={() => onPage(Math.min(pageCount, page + 1))}
          disabled={page >= pageCount}
          className="inline-flex h-9 items-center gap-1 rounded-md border border-border px-3 text-sm font-medium text-foreground transition hover:bg-background-secondary disabled:opacity-40"
        >
          Next <IconChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function pageWindow(page, count) {
  if (count <= 7) return Array.from({ length: count }, (_, i) => i + 1);
  if (page <= 4) return [1, 2, 3, 4, 5, "…", count];
  if (page >= count - 3) return [1, "…", count - 4, count - 3, count - 2, count - 1, count];
  return [1, "…", page - 1, page, page + 1, "…", count];
}

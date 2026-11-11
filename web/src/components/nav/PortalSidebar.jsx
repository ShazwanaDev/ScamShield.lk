import { NavLink } from "react-router-dom";
import Brand from "../Brand.jsx";
import { cn } from "../../ui/cn.js";
import { IconClose } from "../icons.jsx";

/**
 * Shared portal sidebar for the user (/app) and admin (/admin) shells.
 * Desktop: fixed rail. Mobile: off-canvas drawer.
 */
export default function PortalSidebar({ nav, brandTo, footer, open, onClose }) {
  const content = (
    <div className="flex h-full flex-col border-r border-white/[0.06] bg-[#0E0E10]">
      <div className="flex h-16 shrink-0 items-center justify-between px-5">
        <Brand to={brandTo} />
        {onClose && (
          <button
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:bg-white/[0.06] hover:text-foreground lg:hidden"
            aria-label="Close menu"
          >
            <IconClose className="h-5 w-5" />
          </button>
        )}
      </div>

      <nav className="flex-1 space-y-5 overflow-y-auto scrollbar-thin px-3 py-3" aria-label="Portal" data-lenis-prevent>
        {nav.map((group, gi) => (
          <div key={gi}>
            {group.label && <p className="mb-1.5 px-2.5 text-xs text-muted-foreground/80">{group.label}</p>}
            <ul className="space-y-px">
              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      end={item.end}
                      onClick={onClose}
                      className={({ isActive }) =>
                        cn(
                          "group flex items-center gap-2.5 rounded-md px-2.5 py-[7px] text-[13.5px] transition",
                          isActive
                            ? "bg-white/[0.07] text-foreground shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]"
                            : "text-foreground-secondary hover:bg-white/[0.04] hover:text-foreground",
                        )
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <Icon className={cn("h-[17px] w-[17px] shrink-0", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground-secondary")} />
                          <span className="truncate">{item.label}</span>
                          {item.badge != null && (
                            <span className="ml-auto font-mono text-[11px] tabular-nums text-muted-foreground">{item.badge}</span>
                          )}
                        </>
                      )}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {footer && <div className="shrink-0 space-y-3 p-3">{footer}</div>}
    </div>
  );

  return (
    <>
      {/* Desktop rail */}
      <aside className="hidden w-64 shrink-0 lg:block">
        <div className="fixed inset-y-0 left-0 w-64">{content}</div>
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in" onClick={onClose} aria-hidden="true" />
          <div className="absolute inset-y-0 left-0 w-72 max-w-[85vw] animate-slide-in-right">{content}</div>
        </div>
      )}
    </>
  );
}

/** Small status card for the bottom of the sidebar: eyebrow, figure, meter, action. */
export function SidebarCard({ eyebrow, figure, suffix, meter, note, action }) {
  return (
    <div className="rounded-lg border border-white/[0.07] bg-white/[0.02] p-3.5">
      <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted-foreground">{eyebrow}</p>
      <p className="mt-2 flex items-baseline gap-1.5">
        <span className="figure text-lg font-semibold text-foreground">{figure}</span>
        {suffix && <span className="text-xs text-muted-foreground">{suffix}</span>}
      </p>
      {meter && <div className="mt-2.5">{meter}</div>}
      {note && <p className="mt-2 text-[11px] text-muted-foreground">{note}</p>}
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}

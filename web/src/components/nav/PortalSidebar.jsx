import { NavLink } from "react-router-dom";
import Brand from "../Brand.jsx";
import { cn } from "../../ui/cn.js";
import { IconClose } from "../icons.jsx";

/**
 * Shared portal sidebar for the user (/app) and admin (/admin) shells.
 * Renders grouped nav on a dark navy rail. On mobile it's an off-canvas drawer.
 */
export default function PortalSidebar({ nav, brandTo, footer, open, onClose }) {
  const content = (
    <div className="flex h-full flex-col bg-navy text-white/80">
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-white/10 px-4">
        <Brand to={brandTo} tone="dark" />
        {onClose && (
          <button
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-white/70 hover:bg-white/10 lg:hidden"
            aria-label="Close menu"
          >
            <IconClose className="h-5 w-5" />
          </button>
        )}
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto scrollbar-thin px-3 py-5" aria-label="Portal">
        {nav.map((group, gi) => (
          <div key={gi}>
            {group.label && (
              <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-white/35">{group.label}</p>
            )}
            <ul className="space-y-1">
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
                          "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition",
                          isActive
                            ? "bg-white/10 text-white shadow-[inset_2px_0_0_0_#5FE9D0]"
                            : "text-white/65 hover:bg-white/5 hover:text-white",
                        )
                      }
                    >
                      <Icon className="h-5 w-5 shrink-0" />
                      <span className="truncate">{item.label}</span>
                      {item.badge != null && (
                        <span className="ml-auto rounded-full bg-primary-electric/20 px-2 py-0.5 text-[11px] font-semibold text-teal-light">
                          {item.badge}
                        </span>
                      )}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {footer && <div className="shrink-0 border-t border-white/10 p-3">{footer}</div>}
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
          <div className="absolute inset-0 bg-navy-deep/60 backdrop-blur-sm animate-fade-in" onClick={onClose} aria-hidden="true" />
          <div className="absolute inset-y-0 left-0 w-72 max-w-[85vw] animate-slide-in-right">{content}</div>
        </div>
      )}
    </>
  );
}

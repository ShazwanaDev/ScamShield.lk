import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import Brand from "../Brand.jsx";
import { Button, CtaArrow, cn } from "../../ui/index.js";
import { useAuth } from "../../hooks/useAuth.jsx";
import { IconMenu, IconClose } from "../icons.jsx";

const LINKS = [
  { to: "/how-it-works", label: "How it works" },
  { to: "/scam-types", label: "Scam types" },
  { to: "/languages", label: "Languages" },
  { to: "/alerts", label: "Alerts" },
  { to: "/awareness", label: "Awareness" },
  { to: "/research", label: "Research" },
];

/**
 * Floating header. Transparent over the landing hero, frosted once the page
 * scrolls or on any other page.
 */
export default function PublicNav({ overlay = false }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  useEffect(() => setOpen(false), [location.pathname]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const solid = !overlay || scrolled || open;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 border-b transition-[background-color,border-color,backdrop-filter] duration-300",
        solid ? "border-white/[0.06] bg-background/75 backdrop-blur-xl" : "border-transparent bg-transparent",
      )}
    >
      <div className="mx-auto grid h-16 max-w-7xl grid-cols-[1fr_auto] items-center gap-4 px-4 sm:px-6 lg:grid-cols-[1fr_auto_1fr] lg:px-8">
        <Brand />

        <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Primary">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                cn(
                  "rounded-md px-3 py-2 text-[13.5px] transition",
                  isActive ? "text-foreground" : "text-foreground-secondary hover:text-foreground",
                )
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center justify-end gap-2 lg:flex">
          <Button as={Link} to={isAuthenticated ? "/app" : "/login"} variant="ghost" size="sm">
            {isAuthenticated ? "Dashboard" : "Sign in"}
          </Button>
          <Button as={Link} to="/check" variant="inverse" size="sm" className="group pr-1.5">
            Check a message
            <CtaArrow small className="ml-0.5" />
          </Button>
        </div>

        <button
          className="inline-flex h-11 w-11 items-center justify-center justify-self-end rounded-md text-foreground hover:bg-white/[0.06] lg:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <IconClose className="h-6 w-6" /> : <IconMenu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="border-t border-white/[0.06] lg:hidden">
          <nav className="mx-auto max-w-7xl space-y-0.5 px-4 py-4 sm:px-6" aria-label="Mobile">
            {LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  cn(
                    "block rounded-md px-3 py-2.5 text-[15px]",
                    isActive ? "bg-white/[0.06] text-foreground" : "text-foreground-secondary hover:bg-white/[0.04] hover:text-foreground",
                  )
                }
              >
                {l.label}
              </NavLink>
            ))}
            <div className="grid grid-cols-2 gap-2.5 pt-3">
              <Button as={Link} to={isAuthenticated ? "/app" : "/login"} variant="outline" fullWidth>
                {isAuthenticated ? "Dashboard" : "Sign in"}
              </Button>
              <Button as={Link} to="/check" variant="inverse" fullWidth>
                Check a message
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

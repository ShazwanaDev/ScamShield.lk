import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import Brand from "../Brand.jsx";
import { Button, cn } from "../../ui/index.js";
import { useAuth } from "../../hooks/useAuth.jsx";
import { IconMenu, IconClose, IconShieldCheck } from "../icons.jsx";

const LINKS = [
  { to: "/how-it-works", label: "How it works" },
  { to: "/scam-types", label: "Scam types" },
  { to: "/languages", label: "Languages" },
  { to: "/alerts", label: "Community alerts" },
  { to: "/awareness", label: "Awareness" },
  { to: "/about", label: "About" },
];

export default function PublicNav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  useEffect(() => setOpen(false), [location.pathname]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b transition",
        scrolled ? "border-border bg-surface/90 backdrop-blur" : "border-transparent bg-surface",
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Brand />

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                cn(
                  "rounded-md px-3 py-2 text-sm font-medium transition",
                  isActive ? "text-primary" : "text-foreground-secondary hover:bg-background-secondary hover:text-foreground",
                )
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-2.5 lg:flex">
          {isAuthenticated ? (
            <Button as={Link} to="/app" variant="secondary" size="sm">
              Dashboard
            </Button>
          ) : (
            <Button as={Link} to="/login" variant="ghost" size="sm">
              Sign in
            </Button>
          )}
          <Button as={Link} to="/check" size="sm" leftIcon={<IconShieldCheck className="h-4 w-4" />}>
            Check a message
          </Button>
        </div>

        <button
          className="inline-flex h-11 w-11 items-center justify-center rounded-md text-foreground hover:bg-background-secondary lg:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <IconClose className="h-6 w-6" /> : <IconMenu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="border-t border-border bg-surface lg:hidden">
          <nav className="mx-auto max-w-7xl space-y-1 px-4 py-4 sm:px-6" aria-label="Mobile">
            {LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  cn(
                    "block rounded-md px-3 py-2.5 text-[15px] font-medium",
                    isActive ? "bg-primary/10 text-primary" : "text-foreground hover:bg-background-secondary",
                  )
                }
              >
                {l.label}
              </NavLink>
            ))}
            <div className="grid grid-cols-2 gap-2.5 pt-3">
              <Button as={Link} to={isAuthenticated ? "/app" : "/login"} variant="secondary" fullWidth>
                {isAuthenticated ? "Dashboard" : "Sign in"}
              </Button>
              <Button as={Link} to="/check" fullWidth>
                Check a message
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

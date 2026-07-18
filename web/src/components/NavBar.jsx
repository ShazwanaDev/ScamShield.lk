import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Logo from "./Logo.jsx";
import Button from "./Button.jsx";
import { useAuth } from "../hooks/useAuth.jsx";
import { IconMenu, IconClose, IconHistory, IconLogout, IconUser } from "./icons.jsx";

const links = [
  { to: "/", label: "Home", end: true },
  { to: "/check", label: "Check a message" },
  { to: "/report", label: "Report a scam" },
  { to: "/dashboard", label: "Scam trends" },
  { to: "/about", label: "About" },
];

function linkClass({ isActive }) {
  return `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
    isActive ? "bg-brand/10 text-brand" : "text-foreground/75 hover:bg-muted hover:text-foreground"
  }`;
}

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    setOpen(false);
    navigate("/");
  }

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur-lg">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6" aria-label="Primary">
        <NavLink to="/" className="flex items-center gap-2 font-black tracking-tight" onClick={() => setOpen(false)}>
          <Logo className="h-8 w-8" />
          <span>
            ScamShield <span className="text-brand">LK</span>
          </span>
        </NavLink>

        <div className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} className={linkClass}>
              {l.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden items-center gap-2 lg:flex">
          {isAuthenticated ? (
            <>
              <NavLink to="/history" className={linkClass}>
                <span className="inline-flex items-center gap-1.5">
                  <IconHistory className="h-4 w-4" /> My history
                </span>
              </NavLink>
              <span className="mx-1 hidden max-w-[9rem] truncate text-xs text-muted-foreground xl:inline">
                <IconUser className="mr-1 inline h-3.5 w-3.5 align-[-2px]" />
                {user.email}
              </span>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <IconLogout className="h-4 w-4" /> Log out
              </Button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={linkClass}>
                Log in
              </NavLink>
              <NavLink to="/register">
                <Button size="sm">Sign up</Button>
              </NavLink>
            </>
          )}
        </div>

        <button
          type="button"
          className="grid h-10 w-10 place-items-center rounded-lg text-foreground hover:bg-muted lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <IconClose className="h-5 w-5" /> : <IconMenu className="h-5 w-5" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-border px-4 pb-4 lg:hidden">
          <div className="flex flex-col gap-1 pt-2">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.end} className={linkClass} onClick={() => setOpen(false)}>
                {l.label}
              </NavLink>
            ))}
            <div className="my-1 border-t border-border" />
            {isAuthenticated ? (
              <>
                <NavLink to="/history" className={linkClass} onClick={() => setOpen(false)}>
                  My history
                </NavLink>
                <p className="truncate px-3 py-1 text-xs text-muted-foreground">{user.email}</p>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-lg px-3 py-2 text-left text-sm font-medium text-foreground/75 hover:bg-muted hover:text-foreground"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className={linkClass} onClick={() => setOpen(false)}>
                  Log in
                </NavLink>
                <NavLink to="/register" className={linkClass} onClick={() => setOpen(false)}>
                  Sign up
                </NavLink>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

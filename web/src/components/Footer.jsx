import { Link } from "react-router-dom";
import Logo from "./Logo.jsx";

const productLinks = [
  { to: "/check", label: "Check a message" },
  { to: "/report", label: "Report a scam" },
  { to: "/dashboard", label: "Scam trends" },
];

const aboutLinks = [
  { to: "/about", label: "About & research" },
  { to: "/login", label: "Log in" },
  { to: "/admin/login", label: "Moderator access" },
];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card/40">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 font-black tracking-tight">
              <Logo className="h-8 w-8" />
              <span>
                ScamShield <span className="text-brand">LK</span>
              </span>
            </Link>
            <p className="mt-3 max-w-sm text-sm text-muted-foreground">
              A free, anonymous scam-SMS checker for Sri Lanka — built for Sinhala, Tamil,
              English, and code-mixed "Singlish" messages. A final-year research project, not a
              substitute for your own judgement or your bank's official channels.
            </p>
          </div>

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Product
            </h2>
            <ul className="mt-3 space-y-2">
              {productLinks.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-sm text-foreground/80 hover:text-brand">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              About
            </h2>
            <ul className="mt-3 space-y-2">
              {aboutLinks.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-sm text-foreground/80 hover:text-brand">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} ScamShield LK — a Sri Lankan scam SMS research project.</p>
          <p>Checking a message is free and anonymous. No account required.</p>
        </div>
      </div>
    </footer>
  );
}

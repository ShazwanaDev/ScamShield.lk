import { Link } from "react-router-dom";
import Brand from "../Brand.jsx";
import { IconShieldCheck } from "../icons.jsx";

const COLS = [
  {
    title: "Product",
    links: [
      { to: "/check", label: "Check a message" },
      { to: "/how-it-works", label: "How it works" },
      { to: "/features", label: "Features" },
      { to: "/languages", label: "Supported languages" },
    ],
  },
  {
    title: "Learn",
    links: [
      { to: "/scam-types", label: "Scam types" },
      { to: "/awareness", label: "Awareness hub" },
      { to: "/quiz", label: "Scam quiz" },
      { to: "/alerts", label: "Community alerts" },
    ],
  },
  {
    title: "Company",
    links: [
      { to: "/about", label: "About" },
      { to: "/research", label: "Research & technology" },
      { to: "/contact", label: "Contact" },
      { to: "/faq", label: "FAQ" },
    ],
  },
  {
    title: "Legal",
    links: [
      { to: "/privacy", label: "Privacy & data" },
      { to: "/terms", label: "Terms of use" },
      { to: "/help", label: "Help centre" },
    ],
  },
];

export default function SiteFooter() {
  return (
    <footer className="mt-auto bg-navy text-white/80">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_repeat(4,1fr)]">
          <div className="max-w-xs">
            <Brand tone="dark" />
            <p className="mt-4 text-sm leading-relaxed text-white/60">
              A multilingual scam-awareness platform built for Sri Lanka — analyse SMS in English, Sinhala,
              Tamil, Singlish and code-mixed text.
            </p>
            <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1.5 text-xs font-medium text-teal-light ring-1 ring-inset ring-white/10">
              <IconShieldCheck className="h-4 w-4" />
              Messages are never shared or sold
            </p>
          </div>
          {COLS.map((col) => (
            <div key={col.title}>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-white/40">{col.title}</h3>
              <ul className="mt-3 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.to}>
                    <Link to={l.to} className="text-sm text-white/70 transition hover:text-white">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-white/50 sm:flex-row">
          <p>© {new Date().getFullYear()} ScamShield LK — final-year research project. For awareness use only.</p>
          <p>Not affiliated with any bank, telecom, or government agency.</p>
        </div>
      </div>
    </footer>
  );
}

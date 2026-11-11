import { Link } from "react-router-dom";
import Brand from "../Brand.jsx";
import { cn } from "../../ui/cn.js";

const COLS = [
  {
    title: "Product",
    links: [
      { to: "/check", label: "Check a message" },
      { to: "/how-it-works", label: "How it works" },
      { to: "/features", label: "Features" },
      { to: "/languages", label: "Languages" },
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
    title: "Project",
    links: [
      { to: "/about", label: "About" },
      { to: "/research", label: "Research" },
      { to: "/contact", label: "Contact" },
      { to: "/faq", label: "FAQ" },
    ],
  },
  {
    title: "Legal",
    links: [
      { to: "/privacy", label: "Privacy and data" },
      { to: "/terms", label: "Terms of use" },
      { to: "/help", label: "Help centre" },
    ],
  },
];

/** Site footer. On the landing page (`glow`) it continues the closing CTA's red glow. */
export default function SiteFooter({ glow = false }) {
  return (
    <footer
      className={cn(
        "relative mt-auto overflow-hidden",
        glow ? "bg-[linear-gradient(180deg,#2B1012_0%,#160C0D_45%,#0B0B0C_100%)]" : "border-t border-white/[0.06] bg-background",
      )}
    >
      <div className="relative mx-auto max-w-7xl px-4 pb-8 pt-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.5fr_repeat(4,1fr)]">
          <div className="max-w-xs">
            <Brand />
            <p className="mt-4 text-[13px] leading-relaxed text-muted-foreground">
              Multilingual scam awareness for Sri Lanka. Checks SMS in English, Sinhala, Tamil, Singlish and code-mixed text,
              and shows the reasons behind every result.
            </p>
          </div>
          {COLS.map((col) => (
            <div key={col.title}>
              <h3 className="font-sans text-[13px] font-medium tracking-normal text-foreground">{col.title}</h3>
              <ul className="mt-3 space-y-2">
                {col.links.map((l) => (
                  <li key={l.to}>
                    <Link to={l.to} className="text-[13px] text-muted-foreground transition hover:text-foreground">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col justify-between gap-2 border-t border-white/[0.08] pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} ScamShield LK. A final year research project, for awareness use.</p>
          <p>Not affiliated with any bank, telecom or government agency.</p>
        </div>
      </div>
    </footer>
  );
}

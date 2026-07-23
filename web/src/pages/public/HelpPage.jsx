import { Link } from "react-router-dom";
import ContentHero from "../../components/public/ContentHero.jsx";
import * as Icons from "../../components/icons.jsx";
import { Card, Button, SearchInput } from "../../ui/index.js";

const TOPICS = [
  { icon: Icons.IconShieldCheck, title: "Checking messages", text: "How to check an SMS and read the result.", to: "/how-it-works" },
  { icon: Icons.IconFlag, title: "Reporting scams", text: "How reporting works and what happens next.", to: "/report" },
  { icon: Icons.IconUser, title: "Your account", text: "Sign in, history, and managing your data.", to: "/login" },
  { icon: Icons.IconLock, title: "Privacy & security", text: "How your data is handled and kept safe.", to: "/privacy" },
  { icon: Icons.IconSmartphone, title: "Mobile app", text: "Installing and using the Android app offline.", to: "/features" },
  { icon: Icons.IconLanguages, title: "Languages", text: "Supported languages and code-mixed text.", to: "/languages" },
];

const POPULAR = [
  { q: "Is my message stored or shared?", to: "/faq" },
  { q: "A real bank SMS was flagged as scam", to: "/contact" },
  { q: "How do I delete my history?", to: "/faq" },
  { q: "Sinhala/Tamil text not showing correctly", to: "/contact" },
];

export default function HelpPage() {
  return (
    <div>
      <ContentHero
        variant="navy"
        eyebrow="Help centre"
        title="How can we help?"
        description="Find answers, learn how features work, or get in touch with the team."
        icon={<Icons.IconLifeBuoy className="h-3.5 w-3.5" />}
      >
        <div className="mt-6 max-w-xl">
          <div className="[&_input]:h-12 [&_input]:bg-white">
            <SearchInput placeholder="Search help articles…" aria-label="Search help" />
          </div>
        </div>
      </ContentHero>

      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {TOPICS.map((t) => (
            <Link key={t.title} to={t.to}>
              <Card interactive className="h-full p-6">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <t.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-card-title text-foreground">{t.title}</h3>
                <p className="mt-1.5 text-sm text-foreground-secondary">{t.text}</p>
              </Card>
            </Link>
          ))}
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          <Card className="p-6">
            <h2 className="text-section-title text-foreground">Popular questions</h2>
            <ul className="mt-3 divide-y divide-border">
              {POPULAR.map((p) => (
                <li key={p.q}>
                  <Link to={p.to} className="flex items-center justify-between gap-4 py-3.5 text-sm text-foreground transition hover:text-primary">
                    <span className="flex items-center gap-2.5">
                      <Icons.IconHelpCircle className="h-4 w-4 text-muted-foreground" />
                      {p.q}
                    </span>
                    <Icons.IconChevronRight className="h-4 w-4 shrink-0 text-border-strong" />
                  </Link>
                </li>
              ))}
            </ul>
          </Card>
          <Card className="flex flex-col justify-center bg-gradient-navy p-6 text-white">
            <Icons.IconMessageSquare className="h-8 w-8 text-teal-light" />
            <h3 className="mt-3 text-card-title text-white">Can't find an answer?</h3>
            <p className="mt-1.5 text-sm text-white/70">Send us a message and we'll help you out.</p>
            <Button as={Link} to="/contact" variant="teal" className="mt-4 self-start">
              Contact support
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}

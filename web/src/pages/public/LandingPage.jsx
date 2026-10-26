import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import MessageAnalyzer from "../../components/analyzer/MessageAnalyzer.jsx";
import ResultView from "../../components/analyzer/ResultView.jsx";
import { SCAM_CATEGORIES } from "../../data/scamCategories.js";
import { ALERTS, SEVERITY } from "../../data/alerts.js";
import { ARTICLES } from "../../data/awareness.js";
import RESULTS from "../../data/modelResults.json";
import * as Icons from "../../components/icons.jsx";
import { Button, Badge, Card, SectionHeading, VerdictBadge, cn } from "../../ui/index.js";

const LANGUAGES = ["English", "සිංහල", "தமிழ்", "Singlish", "Thanglish", "Code-mixed"];

const STEPS = [
  { icon: Icons.IconClipboard, title: "Paste the message", text: "Copy any suspicious SMS and paste it in — in any language or a mix." },
  { icon: Icons.IconCpu, title: "We analyse it", text: "A multilingual model weighs the wording, links, and urgency signals." },
  { icon: Icons.IconWand, title: "See why", text: "Get a clear verdict, a confidence score, and the exact risky phrases." },
];

const VERDICT_CARDS = [
  { key: "scam", points: ["Steals money, codes, or data", "Fake urgency and threats", "Report to warn the community"] },
  { key: "spam", points: ["Unsolicited promotions", "Bulk / marketing blasts", "Block and unsubscribe safely"] },
  { key: "legitimate", points: ["Normal transactional texts", "No strong scam signals", "Stay cautious regardless"] },
];

const FAQS = [
  { q: "Is my message stored or shared?", a: "No. Messages you check are analysed for you and not shared. Redact any personal details you don't want to type." },
  { q: "Which languages are supported?", a: "English, Sinhala, Tamil, Singlish, Thanglish, and code-mixed messages — the way people actually text in Sri Lanka." },
  { q: "Is this affiliated with a bank or the government?", a: "No. ScamShield LK is an independent research project for scam awareness. Always verify through official channels." },
  { q: "Can it be wrong?", a: "Yes — no detector is perfect. Treat the result as guidance, and when unsure, verify with the real organisation directly." },
];

export default function LandingPage() {
  const [result, setResult] = useState(null);
  const resultRef = useRef(null);

  const onResult = (r) => {
    setResult(r);
    requestAnimationFrame(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };

  return (
    <div>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-navy text-white">
        <div className="absolute inset-0 bg-grid opacity-60" aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-hero" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-8 lg:px-8 lg:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-teal-light ring-1 ring-inset ring-white/15">
              <Icons.IconShieldCheck className="h-4 w-4" />
              Multilingual scam detection for Sri Lanka
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl">
              Know before you trust the message.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/70">
              ScamShield LK analyses English, Sinhala, Tamil, Singlish, Thanglish and code-mixed SMS to identify
              scams, spam and legitimate communication — and shows you exactly why.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button as={Link} to="/check" size="lg" variant="teal" leftIcon={<Icons.IconShieldCheck className="h-5 w-5" />}>
                Check a message
              </Button>
              <Button as={Link} to="/how-it-works" size="lg" variant="outline" className="border-white/25 text-white hover:bg-white/10">
                How it works
              </Button>
            </div>
            <div className="mt-8">
              <p className="text-xs font-medium uppercase tracking-wider text-white/40">Understands</p>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {LANGUAGES.map((l) => (
                  <span key={l} className="rounded-full bg-white/5 px-3 py-1 text-sm text-white/80 ring-1 ring-inset ring-white/10">
                    {l}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Live analyser */}
          <div className="lg:pl-4">
            <div className="rounded-2xl bg-white/5 p-2 ring-1 ring-inset ring-white/10 backdrop-blur">
              <div className="[&_*]:text-foreground">
                <MessageAnalyzer onResult={onResult} />
              </div>
            </div>
            <p className="mt-3 text-center text-xs text-white/50">Try it now — no sign-up needed.</p>
          </div>
        </div>
      </section>

      {result && (
        <section ref={resultRef} className="scroll-mt-20 bg-background">
          <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
            <ResultView result={result} onReset={() => setResult(null)} />
          </div>
        </section>
      )}

      {/* ── Trust bar ────────────────────────────────────────── */}
      <section className="border-y border-border bg-surface">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-border px-4 sm:px-6 md:grid-cols-4 lg:px-8">
          {[
            { v: String(RESULTS.dataset.realTest), l: "Real SMS used for testing" },
            { v: "6", l: "Languages & scripts" },
            { v: "8", l: "Scam types tracked" },
            { v: "Free", l: "Always, no sign-up" },
          ].map((s, i) => (
            <div key={i} className="px-4 py-6 text-center">
              <p className="text-2xl font-extrabold text-foreground">{s.v}</p>
              <p className="mt-1 text-xs text-muted-foreground">{s.l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="How it works" title="From suspicious text to a clear answer in seconds" align="center" />
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <Card key={s.title} className="relative p-6">
              <span className="absolute right-5 top-5 text-4xl font-black text-background-secondary">{i + 1}</span>
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <s.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-card-title text-foreground">{s.title}</h3>
              <p className="mt-1.5 text-sm text-foreground-secondary">{s.text}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* ── Verdict comparison ───────────────────────────────── */}
      <section className="bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Three clear outcomes"
            title="Scam, spam, or legitimate — never a vague guess"
            description="Every check returns one of three plain-language verdicts, with a confidence score and the reasoning behind it."
            align="center"
          />
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {VERDICT_CARDS.map((c) => (
              <Card key={c.key} className="p-6">
                <VerdictBadge verdict={c.key} />
                <ul className="mt-4 space-y-2.5">
                  {c.points.map((p) => (
                    <li key={p} className="flex items-start gap-2.5 text-sm text-foreground-secondary">
                      <Icons.IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-legit" />
                      {p}
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── Scam categories ──────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Know the threats" title="Common scam types in Sri Lanka">
          <Button as={Link} to="/scam-types" variant="ghost" rightIcon={<Icons.IconArrowRight className="h-4 w-4" />}>
            View all
          </Button>
        </SectionHeading>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SCAM_CATEGORIES.filter((c) => c.slug !== "other")
            .slice(0, 6)
            .map((c) => {
              const Icon = Icons[c.icon] || Icons.IconTag;
              return (
                <Link key={c.slug} to={`/scam-types/${c.slug}`}>
                  <Card interactive className="h-full p-5">
                    <div className="flex items-start justify-between gap-3">
                      <span
                        className={cn(
                          "inline-flex h-11 w-11 items-center justify-center rounded-lg",
                          c.tone === "scam" ? "bg-scam-light text-scam" : c.tone === "spam" ? "bg-spam-light text-spam" : "bg-primary/10 text-primary",
                        )}
                      >
                        <Icon className="h-5 w-5" />
                      </span>
                      <Badge tone={c.stats.trendDir === "up" ? "scam" : "legit"} size="sm">
                        {c.stats.trend}
                      </Badge>
                    </div>
                    <h3 className="mt-4 text-card-title text-foreground">{c.name}</h3>
                    <p className="mt-1.5 line-clamp-2 text-sm text-foreground-secondary">{c.tagline}</p>
                  </Card>
                </Link>
              );
            })}
        </div>
      </section>

      {/* ── Alerts + Awareness ───────────────────────────────── */}
      <section className="bg-surface">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <SectionHeading eyebrow="Live" title="Community alerts">
              <Button as={Link} to="/alerts" variant="ghost" size="sm" rightIcon={<Icons.IconArrowRight className="h-4 w-4" />}>
                All
              </Button>
            </SectionHeading>
            <div className="mt-6 space-y-3">
              {ALERTS.slice(0, 3).map((a) => (
                <Link key={a.id} to={`/alerts/${a.id}`}>
                  <Card interactive className="flex items-start gap-3 p-4">
                    <Icons.IconMegaphone className="mt-0.5 h-5 w-5 shrink-0 text-scam" />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <Badge tone={SEVERITY[a.severity].tone} size="sm">
                          {SEVERITY[a.severity].label}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{a.region}</span>
                      </div>
                      <p className="mt-1.5 font-semibold text-foreground">{a.title}</p>
                      <p className="mt-0.5 line-clamp-2 text-sm text-muted-foreground">{a.summary}</p>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
          <div>
            <SectionHeading eyebrow="Learn" title="Awareness hub">
              <Button as={Link} to="/awareness" variant="ghost" size="sm" rightIcon={<Icons.IconArrowRight className="h-4 w-4" />}>
                All
              </Button>
            </SectionHeading>
            <div className="mt-6 space-y-3">
              {ARTICLES.slice(0, 3).map((a) => (
                <Link key={a.slug} to={`/awareness/${a.slug}`}>
                  <Card interactive className="flex items-start gap-3 p-4">
                    <Icons.IconBookOpen className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <Badge tone="primary" size="sm">
                          {a.category}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{a.readMins} min read</span>
                      </div>
                      <p className="mt-1.5 font-semibold text-foreground">{a.title}</p>
                      <p className="mt-0.5 line-clamp-2 text-sm text-muted-foreground">{a.excerpt}</p>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── App promo ────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-2xl bg-gradient-navy px-6 py-12 text-white sm:px-12">
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <div>
              <Badge tone="teal" size="sm">
                Mobile app
              </Badge>
              <h2 className="mt-4 text-3xl font-extrabold">Check scams on the go, even offline</h2>
              <p className="mt-3 max-w-lg text-white/70">
                The ScamShield LK Android app checks messages instantly, with a simpler on-device check that keeps
                working when you have no connection.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button variant="teal" leftIcon={<Icons.IconSmartphone className="h-5 w-5" />}>
                  Get the app
                </Button>
                <Button as={Link} to="/features" variant="outline" className="border-white/25 text-white hover:bg-white/10">
                  See features
                </Button>
              </div>
            </div>
            <ul className="grid gap-3 sm:grid-cols-2">
              {[
                { icon: Icons.IconWifiOff, t: "Works offline" },
                { icon: Icons.IconGlobe, t: "6 languages" },
                { icon: Icons.IconWand, t: "Explains results" },
                { icon: Icons.IconHistory, t: "Saves your checks" },
              ].map((f) => (
                <li key={f.t} className="flex items-center gap-3 rounded-lg bg-white/5 px-4 py-3 ring-1 ring-inset ring-white/10">
                  <f.icon className="h-5 w-5 text-teal-light" />
                  <span className="text-sm font-medium">{f.t}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────── */}
      <section className="bg-surface">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
          <SectionHeading eyebrow="FAQ" title="Questions people ask" align="center" />
          <div className="mt-8 space-y-3">
            {FAQS.map((f) => (
              <details key={f.q} className="group rounded-lg border border-border bg-surface p-4 [&_summary]:cursor-pointer">
                <summary className="flex items-center justify-between gap-3 text-sm font-semibold text-foreground marker:content-none">
                  {f.q}
                  <Icons.IconChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition group-open:rotate-180" />
                </summary>
                <p className="mt-2.5 text-sm leading-relaxed text-foreground-secondary">{f.a}</p>
              </details>
            ))}
          </div>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            More in the{" "}
            <Link to="/faq" className="font-semibold text-primary hover:underline">
              full FAQ
            </Link>{" "}
            or{" "}
            <Link to="/help" className="font-semibold text-primary hover:underline">
              help centre
            </Link>
            .
          </p>
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-border bg-surface px-6 py-12 text-center shadow-card">
          <h2 className="text-3xl font-extrabold text-foreground">Don't trust it — check it.</h2>
          <p className="mx-auto mt-3 max-w-xl text-foreground-secondary">
            Paste that suspicious message and get a clear answer in seconds. Free, private, and built for how Sri Lanka texts.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button as={Link} to="/check" size="lg" leftIcon={<Icons.IconShieldCheck className="h-5 w-5" />}>
              Check a message
            </Button>
            <Button as={Link} to="/register" size="lg" variant="secondary">
              Create free account
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import MessageAnalyzer from "../../components/analyzer/MessageAnalyzer.jsx";
import ResultView from "../../components/analyzer/ResultView.jsx";
import { useScrollIntoView } from "../../components/SmoothScroll.jsx";
import { SCAM_CATEGORIES } from "../../data/scamCategories.js";
import { SAMPLE_MESSAGES } from "../../data/samples.js";
import { classifyLocal } from "../../data/mockClassifier.js";
import RESULTS from "../../data/modelResults.json";
import * as Icons from "../../components/icons.jsx";
import { Button, CtaArrow, KpiStrip, VerdictBadge, cn } from "../../ui/index.js";

/* ── Data ───────────────────────────────────────────────────────── */

const LANGUAGES = [
  { label: "English" },
  { label: "සිංහල", lang: "si" },
  { label: "தமிழ்", lang: "ta" },
  { label: "Singlish" },
  { label: "Thanglish" },
  { label: "Code-mixed" },
];

const KEYWORD = RESULTS.models.find((m) => m.id === "keyword");
const SERVING = RESULTS.models.find((m) => m.status === "serving");
const pct = (v) => `${Math.round(v * 100)}%`;

// A real run of the on-device check, so the example panel shows genuine output.
const EXAMPLE_SAMPLE = SAMPLE_MESSAGES.find((s) => s.id === "s-otp") ?? SAMPLE_MESSAGES[0];
const EXAMPLE = classifyLocal(EXAMPLE_SAMPLE.text);

const FEATURES = [
  {
    title: "A verdict in seconds",
    text: "Scam, spam or legitimate, with a confidence score. No sign in, no waiting on a human reviewer.",
  },
  {
    title: "The reasons, highlighted",
    text: "The exact phrases that pushed the result are marked in your message, so you learn what to look for next time.",
  },
  {
    title: "Works offline on Android",
    text: "When there is no signal, the mobile app falls back to a simpler on-device check instead of failing.",
  },
];

// [x%, y%, delay s]. Kept clear of the centre column so they never sit on the copy.
const SPARKLES = [
  [6, 12, 0], [14, 30, 1.2], [20, 8, 2.4], [9, 48, 0.6], [18, 58, 1.8], [82, 10, 3], [90, 26, 0.9],
  [86, 44, 2.1], [94, 58, 3.4], [79, 32, 1.5], [30, 5, 2.7], [70, 6, 4], [4, 68, 1], [96, 70, 2.9],
];

/* ── Decorative pieces ──────────────────────────────────────────── */

function Sparkle({ x, y, delay }) {
  return (
    <svg
      viewBox="0 0 10 10"
      className="twinkle absolute h-2.5 w-2.5 text-[#FFC9C3]"
      style={{ left: `${x}%`, top: `${y}%`, animationDelay: `${delay}s` }}
      aria-hidden="true"
    >
      <path d="M5 0 5.9 4.1 10 5 5.9 5.9 5 10 4.1 5.9 0 5 4.1 4.1Z" fill="currentColor" />
    </svg>
  );
}

/** Lines enter a rule, a few get stopped, most scatter past it. */
function ArtRules() {
  const ys = [62, 72, 82, 92, 102, 112, 122];
  return (
    <svg viewBox="0 0 300 180" preserveAspectRatio="xMidYMid slice" className="h-full w-full" fill="none" aria-hidden="true">
      {ys.map((y, i) => (
        <line key={i} x1="0" y1={y} x2="118" y2={y} stroke="#FF9C94" strokeOpacity={0.35 + i * 0.06} />
      ))}
      <rect x="118" y="34" width="14" height="116" rx="4" fill="#232327" stroke="#34343A" />
      {[30, 52, 74, 92, 110, 132, 154].map((y, i) => (
        <line key={i} x1="132" y1="92" x2="300" y2={y} stroke="#FF6A60" strokeOpacity={i === 3 ? 0.9 : 0.4} />
      ))}
      <circle cx="132" cy="92" r="2.5" fill="#FF9C94" />
    </svg>
  );
}

/** Tracks of mixed-script text moving at different speeds. */
function ArtMixed() {
  const rows = [
    [18, 84, 250], [40, 118, 236], [8, 70, 290], [60, 128, 262], [30, 96, 246], [12, 52, 292],
  ];
  return (
    <svg viewBox="0 0 300 180" preserveAspectRatio="xMidYMid slice" className="h-full w-full" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="trail" x1="0" x2="1">
          <stop offset="0" stopColor="#FF6A60" stopOpacity="0" />
          <stop offset="1" stopColor="#FF9C94" stopOpacity="0.95" />
        </linearGradient>
      </defs>
      {rows.map(([a, b, c], i) => {
        const y = 32 + i * 24;
        return (
          <g key={i}>
            <line x1="0" y1={y} x2="300" y2={y} stroke="#FFFFFF" strokeOpacity="0.07" />
            <rect x={a} y={y - 1} width={b - a} height="2" rx="1" fill="url(#trail)" />
            <circle cx={b} cy={y} r="3" fill="#FF9C94" />
            <rect x={c - 40} y={y - 1} width="40" height="2" rx="1" fill="url(#trail)" opacity="0.6" />
            <rect x={c - 3} y={y - 3} width="6" height="6" rx="1.5" fill="#FFC9C3" opacity="0.85" />
          </g>
        );
      })}
    </svg>
  );
}

/** A verdict with no visible reasoning: links cross between two bars. */
function ArtReasons() {
  const left = [40, 70, 100, 130];
  const right = [36, 66, 96, 126, 150];
  return (
    <svg viewBox="0 0 300 180" preserveAspectRatio="xMidYMid slice" className="h-full w-full" fill="none" aria-hidden="true">
      <rect x="22" y="22" width="14" height="140" rx="4" fill="#232327" stroke="#34343A" />
      <rect x="262" y="18" width="14" height="148" rx="4" fill="#232327" stroke="#34343A" />
      {left.map((ly, i) =>
        right.map((ry, j) =>
          (i + j) % 2 === 0 ? (
            <line key={`${i}-${j}`} x1="36" y1={ly} x2="262" y2={ry} stroke="#FFFFFF" strokeOpacity="0.1" />
          ) : null,
        ),
      )}
      <line x1="36" y1="70" x2="262" y2="126" stroke="#FF9C94" strokeOpacity="0.85" />
      <line x1="36" y1="130" x2="262" y2="36" stroke="#FF6A60" strokeOpacity="0.5" />
      <circle cx="170" cy="103.5" r="5" fill="#FF9C94" />
      <circle cx="170" cy="103.5" r="11" stroke="#FF9C94" strokeOpacity="0.35" />
    </svg>
  );
}

function CornerSquares() {
  return (
    <>
      {["left-2 top-2", "right-2 top-2", "left-2 bottom-2", "right-2 bottom-2"].map((p) => (
        <span key={p} className={cn("absolute h-1.5 w-1.5 rounded-[1px] bg-white/50", p)} aria-hidden="true" />
      ))}
    </>
  );
}

/** Example output of the on-device check, styled as a frosted analytics card. */
function RiskPanel() {
  const score = Math.round(EXAMPLE.confidence * 100);
  const rows = (EXAMPLE.explanation ?? []).slice(0, 3);
  const isScam = EXAMPLE.verdict === "scam";
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] p-6 sm:p-12">
      <div
        className="absolute inset-0 bg-[radial-gradient(70%_60%_at_25%_0%,rgba(255,106,96,0.35),transparent_60%),radial-gradient(70%_60%_at_85%_100%,rgba(122,14,19,0.65),transparent_70%),linear-gradient(180deg,#1E1416,#120D0E)]"
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-grain opacity-60" aria-hidden="true" />
      <figure className="glass relative mx-auto max-w-md rounded-xl p-5">
        <div className="flex items-center justify-between gap-3">
          <p className="font-display text-[15px] font-semibold text-foreground">Scam risk analysis</p>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.06] px-2.5 py-1 text-[11px] text-foreground-secondary ring-1 ring-inset ring-white/10">
            <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_#FF3B30]" />
            On-device check
          </span>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2.5">
          <span className="figure text-[4rem] font-semibold leading-none text-foreground">{score}</span>
          <span className={cn("rounded-full px-2.5 py-1 text-[11px] ring-1 ring-inset", isScam ? "bg-scam/10 text-primary-soft ring-scam/30" : "bg-white/[0.06] text-foreground-secondary ring-white/10")}>
            {isScam ? "High risk" : "Low risk"}
          </span>
          <span className="rounded-full bg-white/[0.06] px-2.5 py-1 text-[11px] text-foreground-secondary ring-1 ring-inset ring-white/10">English sample</span>
        </div>
        <div className="mt-5 flex h-10 gap-1.5" role="img" aria-label={`Scam ${score}%, other ${100 - score}%`}>
          <span className="flex items-center rounded-md bg-[#5A2326] px-2.5 text-[11px] text-white/70" style={{ flexGrow: Math.max(100 - score, 8), flexBasis: 0 }}>
            {100 - score}%
          </span>
          <span className="flex items-center justify-end rounded-md bg-gradient-to-r from-[#FF6A60] to-[#FFB3AA] px-2.5 text-[11px] font-medium text-[#3A0A0A]" style={{ flexGrow: score, flexBasis: 0 }}>
            Scam {score}%
          </span>
        </div>
        <ul className="mt-4 space-y-1.5">
          {rows.map((r) => (
            <li key={r.feature} className="flex items-center justify-between gap-3 rounded-lg bg-white/[0.04] px-3 py-2.5 text-[13px] ring-1 ring-inset ring-white/[0.05]">
              <span className="flex min-w-0 items-center gap-2 text-foreground-secondary">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary-soft" />
                <span className="truncate">“{r.feature}”</span>
              </span>
              <span className="font-mono text-foreground">
                {r.contribution >= 0 ? "+" : ""}
                {r.contribution.toFixed(2)}
              </span>
            </li>
          ))}
        </ul>
        <figcaption className="mt-4 text-[11px] leading-relaxed text-muted-foreground">
          Real output of the on-device check for this sample: “{EXAMPLE_SAMPLE.text.slice(0, 64)}…”
        </figcaption>
      </figure>
    </div>
  );
}

function SampleCard({ s, hidden }) {
  return (
    <figure aria-hidden={hidden || undefined} className="mx-2 flex w-[19rem] shrink-0 flex-col justify-between rounded-xl border border-white/[0.07] bg-[#121214] p-5 sm:w-[23rem]">
      <blockquote lang={s.lang === "si" || s.lang === "ta" ? s.lang : undefined} className="line-clamp-3 text-[15px] leading-relaxed text-foreground">
        “{s.text}”
      </blockquote>
      <figcaption className="mt-5 flex items-center justify-between gap-3">
        <span className="text-xs text-muted-foreground">
          {s.langLabel} · {s.label}
        </span>
        <VerdictBadge verdict={s.expected === "legit" ? "legitimate" : s.expected} size="sm" />
      </figcaption>
    </figure>
  );
}

function Marquee({ items, reverse, duration }) {
  return (
    <div className="marquee overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
      <div className={cn("marquee-track py-1.5", reverse && "reverse")} style={{ "--marquee-duration": duration }}>
        {items.map((s) => (
          <SampleCard key={s.id} s={s} />
        ))}
        {items.map((s) => (
          <SampleCard key={`${s.id}-dup`} s={s} hidden />
        ))}
      </div>
    </div>
  );
}

/* ── Page ───────────────────────────────────────────────────────── */

export default function LandingPage() {
  const [result, setResult] = useState(null);
  const [feature, setFeature] = useState(0);
  const tryRef = useRef(null);
  const resultRef = useRef(null);
  const scrollIntoView = useScrollIntoView();

  const onResult = (r) => {
    setResult(r);
    requestAnimationFrame(() => scrollIntoView(resultRef.current));
  };

  const categories = SCAM_CATEGORIES.filter((c) => c.slug !== "other").slice(0, 7);
  const samplesA = SAMPLE_MESSAGES.slice(0, 4);
  const samplesB = SAMPLE_MESSAGES.slice(4);

  return (
    <div className="overflow-x-clip">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative isolate overflow-hidden">
        <div
          className="absolute inset-0 -z-10 bg-[radial-gradient(70%_55%_at_50%_68%,rgba(255,59,48,0.36),rgba(122,14,19,0.24)_42%,transparent_72%),linear-gradient(180deg,#0B0B0C_0%,#1C0B0D_58%,#0B0B0C_100%)]"
          aria-hidden="true"
        />
        <div
          className="rays absolute inset-x-0 top-0 -z-10 h-[80%] opacity-80 [mask-image:radial-gradient(55%_75%_at_50%_70%,#000,transparent)]"
          style={{
            background:
              "linear-gradient(90deg, transparent 8%, rgba(255,110,100,0.10) 22%, transparent 32%, rgba(255,110,100,0.07) 48%, transparent 58%, rgba(255,110,100,0.11) 72%, transparent 86%)",
            filter: "blur(14px)",
          }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 -z-10 bg-grain opacity-70" aria-hidden="true" />
        <div className="absolute inset-0 -z-10" aria-hidden="true">
          {SPARKLES.map(([x, y, d], i) => (
            <Sparkle key={i} x={x} y={y} delay={d} />
          ))}
        </div>
        {/* Planet horizon */}
        <div
          className="absolute left-1/2 top-[66%] -z-10 aspect-square w-[260%] -translate-x-1/2 rounded-full bg-background sm:top-[62%] sm:w-[180%] lg:w-[150%]"
          style={{
            boxShadow:
              "0 -1px 0 0 rgba(255,170,160,0.7), 0 -18px 60px -6px rgba(255,59,48,0.55), 0 -60px 140px -20px rgba(255,59,48,0.35), inset 0 40px 80px -40px rgba(255,59,48,0.35)",
          }}
          aria-hidden="true"
        />

        <div className="mx-auto flex min-h-[760px] max-w-5xl flex-col items-center px-4 pt-36 text-center sm:min-h-[840px] sm:pt-44">
          <p className="eyebrow-bracket animate-fade-up">Multilingual scam detection for Sri Lanka</p>
          <h1 className="mt-5 animate-reveal text-[2.75rem] font-semibold leading-[1.02] tracking-[-0.045em] text-[#F4F4F5] sm:text-[4.25rem] lg:text-[5rem]">
            Spot the scam before
            <br />
            <span className="text-fade">it costs you.</span>
          </h1>
          <p className="mt-6 max-w-lg animate-fade-up text-[15px] leading-relaxed text-foreground-secondary sm:text-base" style={{ animationDelay: "120ms" }}>
            ScamShield LK reads SMS in English, Sinhala, Tamil and Singlish. Clear verdicts, the reasons behind them, and no
            account needed.
          </p>
          <div className="mt-8 flex animate-fade-up flex-wrap justify-center gap-2.5" style={{ animationDelay: "200ms" }}>
            <Button as={Link} to="/how-it-works" variant="outline" size="lg" className="h-11 bg-white/[0.04] backdrop-blur">
              How it works
            </Button>
            <Button variant="inverse" size="lg" className="group h-11 pr-2" onClick={() => scrollIntoView(tryRef.current)}>
              Check a message
              <CtaArrow className="ml-1" />
            </Button>
          </div>

          <div className="mt-auto w-full pb-14 pt-24">
            <p className="text-[13px] text-muted-foreground">Built for the way Sri Lanka actually texts</p>
            <ul className="mt-5 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 sm:gap-x-12">
              {LANGUAGES.map((l) => (
                <li key={l.label} lang={l.lang} className="font-display text-xl font-semibold tracking-[-0.02em] text-white/40 sm:text-2xl">
                  {l.label}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Proof strip (real evaluation numbers) ───────────── */}
      <section className="border-y border-white/[0.06]">
        <div className="mx-auto max-w-7xl">
          <KpiStrip
            items={[
              { label: "Real SMS in the test set", value: RESULTS.dataset.realTest, icon: <Icons.IconMessageSquare />, caption: "Held out from training" },
              { label: "Scams caught", value: pct(SERVING.real.recall), icon: <Icons.IconShieldAlert />, caption: "Recall on real messages" },
              { label: "Keyword filter caught", value: pct(KEYWORD.real.recall), icon: <Icons.IconFilter />, tone: "navy", caption: "Same messages, rule based" },
              { label: "Languages and mixes", value: "6", icon: <Icons.IconGlobe />, tone: "navy", caption: "Including code-mixed text" },
            ]}
          />
        </div>
      </section>

      {/* ── Try it ───────────────────────────────────────────── */}
      <section ref={tryRef} id="try" className="scroll-mt-20">
        <div className="mx-auto max-w-3xl px-4 pb-10 pt-24 sm:px-6">
          <div className="text-center">
            <p className="eyebrow-bracket">Try it</p>
            <h2 className="mt-4 text-[2rem] font-semibold leading-[1.08] tracking-[-0.035em] text-foreground sm:text-[2.75rem]">
              Paste a message.
              <br />
              <span className="text-fade">Get a verdict in seconds.</span>
            </h2>
          </div>
          <div className="relative mt-10">
            <div className="pointer-events-none absolute -inset-x-10 -top-10 bottom-0 bg-[radial-gradient(50%_50%_at_50%_30%,rgba(255,59,48,0.12),transparent_70%)]" aria-hidden="true" />
            <div className="relative rounded-2xl bg-white/[0.03] p-1.5 ring-1 ring-inset ring-white/[0.07]">
              <MessageAnalyzer onResult={onResult} />
            </div>
          </div>
        </div>
        {result && (
          <div ref={resultRef} className="mx-auto max-w-3xl scroll-mt-20 px-4 pb-10 sm:px-6">
            <ResultView result={result} onReset={() => setResult(null)} />
          </div>
        )}
      </section>

      {/* ── The challenge ────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="eyebrow-bracket">The challenge</p>
          <h2 className="mx-auto mt-4 max-w-2xl text-[2rem] font-semibold leading-[1.08] tracking-[-0.035em] text-foreground sm:text-[2.75rem]">
            Scam texts change faster than the filters meant to stop them
          </h2>
          <p className="mx-auto mt-4 max-w-md text-[15px] text-muted-foreground">Blocklists react after people lose money. ScamShield reads the message itself.</p>
        </div>
        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {[
            {
              title: "Keyword rules miss most scams",
              text: `On ${RESULTS.dataset.realTest} real texts, a keyword list caught ${pct(KEYWORD.real.recall)} of the scams. New wording walks straight past it.`,
              art: <ArtRules />,
            },
            {
              title: "Mixed languages slip through",
              text: "One SMS can switch between Sinhala, Tamil and English, often in Latin letters. Filters built for one language miss the rest.",
              art: <ArtMixed />,
              featured: true,
            },
            {
              title: "Warnings without reasons",
              text: "A bare “suspicious” label teaches nothing. People need to see which words gave the scam away.",
              art: <ArtReasons />,
            },
          ].map((c) => (
            <article
              key={c.title}
              className={cn(
                "relative flex min-h-[25rem] flex-col overflow-hidden rounded-xl border p-6",
                c.featured
                  ? "border-white/[0.1] bg-[linear-gradient(180deg,#2A1517_0%,#171315_55%,#141417_100%)] shadow-[0_30px_60px_-30px_rgba(255,59,48,0.45)]"
                  : "border-white/[0.07] bg-[#111113]",
              )}
            >
              {c.featured && <CornerSquares />}
              <h3 className="text-[17px] font-semibold text-foreground">{c.title}</h3>
              <p className="mt-2 max-w-xs text-[13.5px] leading-relaxed text-muted-foreground">{c.text}</p>
              <div className="-mx-6 mt-auto h-44 pt-6">{c.art}</div>
            </article>
          ))}
        </div>
      </section>

      {/* ── Key features ─────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="eyebrow-bracket">How it reads a message</p>
            <h2 className="mt-4 text-[2rem] font-semibold leading-[1.08] tracking-[-0.035em] text-foreground sm:text-[2.75rem]">
              Real time scam scoring, with the reasons shown
            </h2>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-muted-foreground">
              A multilingual model weighs the wording, links and pressure tactics in a message, then tells you what it found
              in plain language.
            </p>
            <ul className="mt-10 space-y-2">
              {FEATURES.map((f, i) => (
                <li key={f.title}>
                  <button
                    type="button"
                    onClick={() => setFeature(i)}
                    onMouseEnter={() => setFeature(i)}
                    aria-pressed={feature === i}
                    className={cn(
                      "w-full border-l-2 py-2.5 pl-5 text-left transition-colors duration-200",
                      feature === i ? "border-primary" : "border-white/[0.08] hover:border-white/20",
                    )}
                  >
                    <span className={cn("block text-[17px] font-medium", feature === i ? "text-foreground" : "text-muted-foreground")}>{f.title}</span>
                    <span className={cn("mt-1 block max-w-md text-[13.5px] leading-relaxed", feature === i ? "text-foreground-secondary" : "text-muted-foreground/70")}>
                      {f.text}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <RiskPanel />
        </div>
      </section>

      {/* ── Coverage ─────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="eyebrow-bracket">Coverage</p>
          <h2 className="mx-auto mt-4 max-w-2xl text-[2rem] font-semibold leading-[1.08] tracking-[-0.035em] text-foreground sm:text-[2.75rem]">
            Trained on the scams Sri Lanka actually gets
          </h2>
          <p className="mx-auto mt-4 max-w-md text-[15px] text-muted-foreground">From OTP theft to fake job offers. Each type has its own guide.</p>
        </div>
        <div className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.06] sm:grid-cols-4">
          {categories.map((c) => {
            const Icon = Icons[c.icon] || Icons.IconTag;
            return (
              <Link
                key={c.slug}
                to={`/scam-types/${c.slug}`}
                className="group flex flex-col items-center gap-3 bg-background px-4 py-8 text-center transition hover:bg-[#131315]"
              >
                <Icon className="h-6 w-6 text-muted-foreground transition group-hover:text-primary" />
                <span className="text-[14px] font-medium text-foreground-secondary transition group-hover:text-foreground">{c.name}</span>
              </Link>
            );
          })}
          <Link to="/scam-types" className="group flex flex-col items-center justify-center gap-3 bg-background px-4 py-8 text-center transition hover:bg-[#131315]">
            <Icons.IconArrowRight className="h-6 w-6 text-primary transition group-hover:translate-x-0.5" />
            <span className="text-[14px] font-medium text-foreground">All scam types</span>
          </Link>
        </div>
      </section>

      {/* ── Comparison ───────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-2 lg:items-end">
          <div>
            <p className="eyebrow-bracket">Comparison</p>
            <h2 className="mt-4 text-[2rem] font-semibold leading-[1.08] tracking-[-0.035em] text-foreground sm:text-[2.75rem]">
              Scam detection without the guesswork
            </h2>
          </div>
          <p className="max-w-md text-[15px] leading-relaxed text-muted-foreground lg:justify-self-end">
            Rule based filters force a choice between catching scams and staying quiet. A trained model reads context, so it
            catches far more of them.
          </p>
        </div>

        <div className="mt-12 overflow-x-auto scrollbar-thin">
          <table className="w-full min-w-[40rem] border-separate border-spacing-0 text-[13.5px]">
            <caption className="sr-only">Keyword filter compared with ScamShield LK</caption>
            <thead>
              <tr>
                <th scope="col" className="w-1/4 pb-4" />
                <th scope="col" className="w-[37.5%] pb-4 text-center font-normal text-muted-foreground">Keyword filter</th>
                <th scope="col" className="w-[37.5%] rounded-t-xl bg-[#17171A] pb-4 pt-4 text-center font-medium text-foreground">ScamShield LK</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["How it decides", "A fixed list of risky words", "A model trained on labelled example messages"],
                ["Scams caught in real SMS", pct(KEYWORD.real.recall), pct(SERVING.real.recall)],
                ["Languages", "Usually English only", "English, Sinhala, Tamil, Singlish, code-mixed"],
                ["Explains the result", "No", "Highlights the risky phrases"],
                ["Learns over time", "Manual list updates", "Community reports reviewed for future training"],
              ].map(([label, a, b], i, arr) => (
                <tr key={label}>
                  <th scope="row" className="py-4 pr-4 text-left font-normal text-muted-foreground">{label}</th>
                  <td className="px-4 py-2 text-center text-foreground-secondary">
                    <span className="block rounded-lg bg-[#111113] px-4 py-3 ring-1 ring-inset ring-white/[0.05]">{a}</span>
                  </td>
                  <td className={cn("bg-[#17171A] px-4 py-2 text-center text-foreground", i === arr.length - 1 && "rounded-b-xl pb-4")}>
                    <span className={cn("block rounded-lg bg-white/[0.04] px-4 py-3 ring-1 ring-inset ring-white/[0.07]", i === 1 && "figure text-lg font-semibold text-primary-soft")}>{b}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          Recall measured on {RESULTS.dataset.realTest} real SMS that were never used for training ({SERVING.name}, evaluated {RESULTS.evaluatedOn}).
        </p>
      </section>

      {/* ── Seen in the wild ─────────────────────────────────── */}
      <section className="py-24">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <p className="eyebrow-bracket">Seen in the wild</p>
          <h2 className="mt-4 text-[2rem] font-semibold leading-[1.08] tracking-[-0.035em] text-foreground sm:text-[2.75rem]">
            Messages like these reach Sri Lankan phones every day
          </h2>
          <p className="mx-auto mt-4 max-w-md text-[15px] text-muted-foreground">Sample texts from the analyser, with phone numbers removed.</p>
        </div>
        <div className="mt-12 space-y-3">
          <Marquee items={samplesA} duration="70s" />
          <Marquee items={samplesB} duration="80s" reverse />
        </div>
      </section>

      {/* ── Closing CTA (flipped horizon, runs into the footer) ── */}
      <section className="relative isolate overflow-hidden">
        <div
          className="absolute inset-0 -z-10 bg-[radial-gradient(70%_60%_at_50%_45%,rgba(255,59,48,0.30),rgba(122,14,19,0.28)_45%,transparent_78%),linear-gradient(180deg,#0B0B0C_0%,#1D0C0E_45%,#2B1012_100%)]"
          aria-hidden="true"
        />
        <div className="absolute inset-0 -z-10 bg-grain opacity-70" aria-hidden="true" />
        <div
          className="absolute bottom-[78%] left-1/2 -z-10 aspect-square w-[260%] -translate-x-1/2 rounded-full bg-background sm:bottom-[70%] sm:w-[180%] lg:w-[150%]"
          style={{
            boxShadow:
              "0 1px 0 0 rgba(255,170,160,0.65), 0 18px 60px -6px rgba(255,59,48,0.5), 0 60px 140px -20px rgba(255,59,48,0.3)",
          }}
          aria-hidden="true"
        />
        <div className="mx-auto max-w-3xl px-4 pb-24 pt-64 text-center sm:px-6 sm:pt-72">
          <h2 className="text-[2.5rem] font-semibold leading-[1.04] tracking-[-0.04em] text-[#F4F4F5] sm:text-[3.75rem]">
            Don't trust it.
            <br />
            <span className="text-fade">Check it.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-md text-[15px] text-foreground-secondary">
            Paste that suspicious message and get a clear answer. Free, and built for how Sri Lanka texts.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-2.5">
            <Button as={Link} to="/report" variant="outline" size="lg" className="h-11 bg-white/[0.04] backdrop-blur">
              Report a scam
            </Button>
            <Button variant="inverse" size="lg" className="group h-11 pr-2" onClick={() => scrollIntoView(tryRef.current)}>
              Check a message
              <CtaArrow className="ml-1" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

import { Link } from "react-router-dom";
import Button from "../components/Button.jsx";
import Card from "../components/Card.jsx";
import Reveal from "../components/Reveal.jsx";
import StepCard from "../components/StepCard.jsx";
import {
  IconShield,
  IconFlag,
  IconAlertTriangle,
  IconClipboard,
  IconCpu,
  IconCheckCircle,
  IconGlobe,
  IconArrowRight,
} from "../components/icons.jsx";

const exampleScams = [
  {
    lang: "Sinhala + English",
    langCode: "si",
    text: "ඔබගේ බැංකු ගිණුම අත්හිටුවා ඇත. verify කරන්න → bit.ly/lk-verify-247",
  },
  {
    lang: "Tamil",
    langCode: "ta",
    text: "வாழ்த்துக்கள்! நீங்கள் Rs. 500,000 வெற்றி பெற்றுள்ளீர்கள். இந்த இணைப்பில் claim செய்யவும்.",
  },
  {
    lang: "Singlish",
    langCode: "en",
    text: "Ur parcel is on hold at customs. Pay Rs.850 clearance fee now: pay-lk-post.com",
  },
];

const steps = [
  {
    icon: <IconClipboard className="h-5 w-5" />,
    title: "Paste the message",
    description: "Drop in the SMS exactly as you received it — Sinhala, Tamil, English, or mixed.",
  },
  {
    icon: <IconCpu className="h-5 w-5" />,
    title: "AI analyzes it",
    description: "A model trained on real Sri Lankan scam SMS scores the message in under a second.",
  },
  {
    icon: <IconCheckCircle className="h-5 w-5" />,
    title: "Get an instant verdict",
    description: "See a scam/legitimate call, a confidence score, and exactly which words drove it.",
  },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div aria-hidden className="absolute inset-0 bg-gradient-hero" />
        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-brand backdrop-blur">
              <IconShield className="h-3.5 w-3.5" /> Free · Anonymous · Instant
            </div>
            <h1 className="text-balance mt-6 text-4xl font-black tracking-tight sm:text-5xl">
              Know in seconds if that SMS is a <span className="text-brand">scam</span>.
            </h1>
            <p className="mt-4 text-balance text-base text-muted-foreground sm:text-lg">
              ScamShield LK checks suspicious text messages in Sinhala, Tamil, English, and
              code-mixed "Singlish" — built for how Sri Lankans actually text.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link to="/check">
                <Button size="lg" className="w-full sm:w-auto">
                  Check a message <IconArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/report">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                  <IconFlag className="h-4 w-4" /> Report a scam
                </Button>
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <IconGlobe className="h-3.5 w-3.5" /> Sinhala · Tamil · English
              </span>
              <span className="inline-flex items-center gap-1.5">
                <IconCheckCircle className="h-3.5 w-3.5" /> No account required
              </span>
              <span className="inline-flex items-center gap-1.5">
                <IconShield className="h-3.5 w-3.5" /> Nothing shared publicly
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Problem statement */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-danger/10 text-danger">
            <IconAlertTriangle className="h-6 w-6" />
          </div>
          <h2 className="mt-4 text-2xl font-black tracking-tight sm:text-3xl">
            Scam SMS in Sri Lanka don't look like the ones you're warned about
          </h2>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            Fake bank alerts, "you've won" lottery texts, and courier-fee scams increasingly
            arrive in Sinhala and Tamil, or mixed with English — the exact texting style most
            scam filters were never built for.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {exampleScams.map((s, i) => (
            <Reveal key={s.lang} delay={i * 80}>
              <Card className="h-full border-danger/20 bg-danger/[0.04]">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-danger">{s.lang}</p>
                <p className="mt-2 font-sans text-sm leading-relaxed text-foreground/90" lang={s.langCode}>
                  {s.text}
                </p>
              </Card>
            </Reveal>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-border bg-card/30">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <Reveal className="mx-auto max-w-xl text-center">
            <h2 className="text-2xl font-black tracking-tight sm:text-3xl">How it works</h2>
            <p className="mt-3 text-sm text-muted-foreground sm:text-base">
              Three steps, no sign-up, results in under two seconds.
            </p>
          </Reveal>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {steps.map((s, i) => (
              <Reveal key={s.title} delay={i * 100}>
                <StepCard number={String(i + 1).padStart(2, "0")} {...s} />
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-10 text-center">
            <Link to="/check">
              <Button size="lg">
                Try it now <IconArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

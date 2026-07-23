import { Link } from "react-router-dom";
import ContentHero from "../../components/public/ContentHero.jsx";
import * as Icons from "../../components/icons.jsx";
import { Card, Button, SectionHeading, VerdictBadge } from "../../ui/index.js";

const STEPS = [
  {
    icon: Icons.IconClipboard,
    title: "1. Paste the message",
    text: "Copy any suspicious SMS and paste it into the checker — in English, Sinhala, Tamil, Singlish, or a mix. You can also try one of our examples.",
  },
  {
    icon: Icons.IconGlobe,
    title: "2. We detect the language",
    text: "The system recognises the script and language mix, so code-mixed messages that trip up English-only filters are handled properly.",
  },
  {
    icon: Icons.IconCpu,
    title: "3. The model analyses it",
    text: "A text-classification model weighs the wording, links, urgency, and known scam patterns to decide: scam, spam, or legitimate.",
  },
  {
    icon: Icons.IconWand,
    title: "4. You see why",
    text: "You get a plain verdict, a confidence score, the exact risky phrases highlighted, and clear next steps — never a black box.",
  },
];

export default function HowItWorksPage() {
  return (
    <div>
      <ContentHero
        variant="navy"
        eyebrow="How it works"
        title="Transparent scam detection, step by step"
        description="No magic and no black box — here's exactly how ScamShield LK turns a suspicious message into a clear, explainable answer."
        icon={<Icons.IconWand className="h-3.5 w-3.5" />}
        actions={
          <Button as={Link} to="/check" variant="teal" leftIcon={<Icons.IconShieldCheck className="h-5 w-5" />}>
            Try it now
          </Button>
        }
      />

      <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-5 sm:grid-cols-2">
          {STEPS.map((s) => (
            <Card key={s.title} className="p-6">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <s.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-card-title text-foreground">{s.title}</h3>
              <p className="mt-1.5 text-[15px] leading-relaxed text-foreground-secondary">{s.text}</p>
            </Card>
          ))}
        </div>

        <div className="mt-14">
          <SectionHeading eyebrow="The output" title="What the three verdicts mean" align="center" />
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {[
              { v: "scam", d: "Strong signals of fraud — designed to steal money, codes, or data. Don't engage; report it." },
              { v: "spam", d: "Unsolicited bulk or promotional messaging. Not necessarily fraud, but safe to ignore and block." },
              { v: "legitimate", d: "No strong scam signals — typical transactional or informational text. Stay cautious regardless." },
            ].map((x) => (
              <Card key={x.v} className="p-6">
                <VerdictBadge verdict={x.v} />
                <p className="mt-3 text-sm text-foreground-secondary">{x.d}</p>
              </Card>
            ))}
          </div>
        </div>

        <Card className="mt-14 grid items-center gap-6 p-8 sm:grid-cols-[1fr_auto]">
          <div>
            <h3 className="text-section-title text-foreground">Explainability by design</h3>
            <p className="mt-2 text-[15px] text-foreground-secondary">
              Every result highlights the specific words and phrases that drove it, with a simple contribution view. That's how
              you learn to spot the next scam yourself — the tool teaches, it doesn't just decide.
            </p>
          </div>
          <Button as={Link} to="/research" variant="secondary" rightIcon={<Icons.IconArrowRight className="h-4 w-4" />}>
            The research
          </Button>
        </Card>
      </div>
    </div>
  );
}

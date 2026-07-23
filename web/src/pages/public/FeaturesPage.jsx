import { Link } from "react-router-dom";
import ContentHero from "../../components/public/ContentHero.jsx";
import * as Icons from "../../components/icons.jsx";
import { Card, Button, SectionHeading } from "../../ui/index.js";

const FEATURES = [
  { icon: Icons.IconGlobe, title: "Truly multilingual", text: "English, Sinhala, Tamil, Singlish, Thanglish and code-mixed — the way Sri Lanka actually texts." },
  { icon: Icons.IconWand, title: "Explainable results", text: "Highlighted risky phrases and a transparent contribution view, not a mystery score." },
  { icon: Icons.IconShieldCheck, title: "Three clear verdicts", text: "Scam, spam, or legitimate — each with a confidence score and recommended actions." },
  { icon: Icons.IconWifiOff, title: "Works offline (mobile)", text: "The Android app checks messages with an on-device model even without a connection." },
  { icon: Icons.IconHistory, title: "Your history", text: "Signed-in users keep a private history of every check, with search and filters." },
  { icon: Icons.IconMegaphone, title: "Community alerts", text: "See verified warnings about scams circulating right now, updated by moderators." },
  { icon: Icons.IconFlag, title: "Report & warn others", text: "Flag a scam in seconds; approved reports feed public stats and detection." },
  { icon: Icons.IconBookOpen, title: "Awareness hub", text: "Practical guides and a quiz to sharpen your scam-spotting instincts." },
  { icon: Icons.IconLock, title: "Privacy-first", text: "Messages are analysed for you and not shared. Redact anything sensitive." },
];

export default function FeaturesPage() {
  return (
    <div>
      <ContentHero
        eyebrow="Features"
        title="Everything you need to check, learn, and stay protected"
        description="ScamShield LK is more than a classifier — it's a full scam-awareness toolkit for Sri Lanka."
        icon={<Icons.IconSparkle className="h-3.5 w-3.5" />}
      />
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <Card key={f.title} className="p-6">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-teal/10 text-teal">
                <f.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-card-title text-foreground">{f.title}</h3>
              <p className="mt-1.5 text-sm text-foreground-secondary">{f.text}</p>
            </Card>
          ))}
        </div>

        <div className="mt-12">
          <SectionHeading eyebrow="Web & mobile" title="One product, wherever you are" align="center" />
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <Card className="p-6">
              <Icons.IconGlobe className="h-6 w-6 text-primary" />
              <h3 className="mt-3 text-card-title text-foreground">Web app</h3>
              <p className="mt-1.5 text-sm text-foreground-secondary">Check messages instantly in any browser, explore scam types, alerts and awareness content, and manage your account.</p>
              <Button as={Link} to="/check" variant="secondary" className="mt-4" rightIcon={<Icons.IconArrowRight className="h-4 w-4" />}>
                Open the checker
              </Button>
            </Card>
            <Card className="p-6">
              <Icons.IconSmartphone className="h-6 w-6 text-teal" />
              <h3 className="mt-3 text-card-title text-foreground">Android app</h3>
              <p className="mt-1.5 text-sm text-foreground-secondary">Native, touch-friendly, and works offline with an on-device model — plus history, reports and community alerts.</p>
              <Button variant="teal" className="mt-4" leftIcon={<Icons.IconSmartphone className="h-4 w-4" />}>
                Get the app
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

import { Link } from "react-router-dom";
import ContentHero from "../../components/public/ContentHero.jsx";
import * as Icons from "../../components/icons.jsx";
import { Card, Button, Badge, SectionHeading } from "../../ui/index.js";

const LANGS = [
  { name: "English", native: "English", sample: "Your account will be suspended. Share the OTP now.", tag: "en" },
  { name: "Sinhala", native: "සිංහල", sample: "ඔබගේ ගිණුම අත්හිටුවනු ලැබේ. දැන්ම OTP එක එවන්න.", tag: "si" },
  { name: "Tamil", native: "தமிழ்", sample: "உங்கள் கணக்கு முடக்கப்படும். உடனே OTP ஐ பகிரவும்.", tag: "ta" },
  { name: "Singlish", native: "Romanised Sinhala", sample: "Oyage account eka block wenawa, OTP eka ikmanata denna.", tag: "mixed" },
  { name: "Thanglish", native: "Romanised Tamil", sample: "Ungal account block aagum, OTP-ஐ udane share pannunga.", tag: "mixed" },
  { name: "Code-mixed", native: "Mixed script", sample: "Free 10GB data! Dial *123# eka dapan dan register wenna.", tag: "mixed" },
];

export default function LanguagesPage() {
  return (
    <div>
      <ContentHero
        variant="navy"
        eyebrow="Built for how Sri Lanka texts"
        title="One checker, every language"
        description="Scam messages don't stick to one language, and neither do we. ScamShield LK understands Sinhala and Tamil scripts, English, romanised Singlish and Thanglish, and messages that mix them all."
        icon={<Icons.IconLanguages className="h-3.5 w-3.5" />}
      />
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {LANGS.map((l) => (
            <Card key={l.name} className="p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-card-title text-foreground">{l.name}</h3>
                <Badge tone="primary" size="sm">{l.native}</Badge>
              </div>
              <div className="mt-3 rounded-lg border border-border bg-background-secondary/50 p-3">
                <p lang={l.tag === "si" ? "si" : l.tag === "ta" ? "ta" : undefined} className="text-sm leading-relaxed text-foreground-secondary">
                  “{l.sample}”
                </p>
              </div>
            </Card>
          ))}
        </div>

        <Card className="mt-10 flex flex-col items-center justify-between gap-4 bg-gradient-navy p-8 text-center text-white sm:flex-row sm:text-left">
          <div>
            <h3 className="text-section-title text-white">Why this matters</h3>
            <p className="mt-2 max-w-2xl text-white/70">
              English-only spam filters miss the majority of Sri Lankan scam texts, which routinely blend scripts and
              romanised local languages. Detecting them properly is the core of this project.
            </p>
          </div>
          <Button as={Link} to="/research" variant="teal">The research</Button>
        </Card>
      </div>
    </div>
  );
}

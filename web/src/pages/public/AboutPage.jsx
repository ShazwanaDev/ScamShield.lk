import { Link } from "react-router-dom";
import ContentHero from "../../components/public/ContentHero.jsx";
import * as Icons from "../../components/icons.jsx";
import { Card, Button, SectionHeading } from "../../ui/index.js";

const VALUES = [
  { icon: Icons.IconLock, title: "Privacy-first", text: "Checked messages are kept on the ScamShield server, never shared or sold. Leave out personal details." },
  { icon: Icons.IconWand, title: "Transparent", text: "Every result is explained. We'd rather teach you to spot scams than ask for blind trust." },
  { icon: Icons.IconGlobe, title: "Inclusive", text: "Built for every language Sri Lankans text in, not just clean English." },
  { icon: Icons.IconUsers, title: "Community-driven", text: "Reports and feedback from real people make detection better for everyone." },
];

export default function AboutPage() {
  return (
    <div>
      <ContentHero
        variant="navy"
        eyebrow="About"
        title="Fewer people falling for scams in Sri Lanka"
        description="ScamShield LK helps anyone check a suspicious SMS in seconds, in their own language, and understand exactly why it's risky."
        icon={<Icons.IconShieldCheck className="h-3.5 w-3.5" />}
      />
      <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="prose-none space-y-4 text-[15px] leading-relaxed text-foreground-secondary">
          <p>
            SMS scams cost Sri Lankans money and peace of mind every day: fake bank alerts, lottery wins, parcel fees,
            job offers, and OTP traps. They spread in Sinhala, Tamil, English, and a constant mix of all three, which is
            exactly where ordinary spam filters fall short.
          </p>
          <p>
            ScamShield LK is a research project that tackles this head-on: a multilingual classifier that labels a message
            as <strong className="text-foreground">scam</strong>, <strong className="text-foreground">spam</strong>, or{" "}
            <strong className="text-foreground">legitimate</strong>, highlights the words that make it risky, and explains
            its reasoning, so people don't just get an answer. They learn.
          </p>
        </div>

        <div className="mt-12">
          <SectionHeading eyebrow="What we value" title="Principles that guide the product" />
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {VALUES.map((v) => (
              <Card key={v.title} className="flex gap-4 p-6">
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <v.icon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-card-title text-foreground">{v.title}</h3>
                  <p className="mt-1 text-sm text-foreground-secondary">{v.text}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <Card className="mt-12 p-8">
          <h3 className="text-section-title text-foreground">A final-year research project</h3>
          <p className="mt-2 text-[15px] leading-relaxed text-foreground-secondary">
            ScamShield LK is developed as a BEng (Hons) Software Engineering final-year project, focused on scam-SMS
            detection for low-resource, code-mixed languages. It is independent and not affiliated with any bank, telecom,
            or government agency. Always verify important messages through official channels.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button as={Link} to="/research" variant="secondary" rightIcon={<Icons.IconArrowRight className="h-4 w-4" />}>
              Read the research
            </Button>
            <Button as={Link} to="/contact" variant="ghost">
              Get in touch
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

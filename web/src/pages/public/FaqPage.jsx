import { Link } from "react-router-dom";
import ContentHero from "../../components/public/ContentHero.jsx";
import * as Icons from "../../components/icons.jsx";
import { Card, Button } from "../../ui/index.js";

const GROUPS = [
  {
    title: "Using the checker",
    items: [
      { q: "How do I check a message?", a: "Paste the SMS into the checker and press ‘Check message’. You'll get a verdict, a confidence score, and highlighted risky phrases in seconds." },
      { q: "Which languages are supported?", a: "English, Sinhala, Tamil, Singlish, Thanglish, and code-mixed messages, the way people actually text in Sri Lanka." },
      { q: "Can the result be wrong?", a: "Yes. No detector is perfect. Treat the result as guidance; when in doubt, verify with the real organisation through an official channel." },
      { q: "What do scam, spam and legitimate mean?", a: "Scam = likely fraud designed to steal money or data. Spam = unsolicited promotions. Legitimate = no strong scam signals. Each comes with a confidence score." },
    ],
  },
  {
    title: "Privacy & data",
    items: [
      { q: "Is my message stored or shared?", a: "Messages you check are stored on our server with the result, so the model's accuracy can be measured and improved. They are never shared or sold. Please leave out personal details (OTPs, card numbers, NIC) you don't want stored." },
      { q: "Do I need an account?", a: "No. Checking messages is free and needs no sign-up. An account simply lets you keep a private history and manage reports." },
    ],
  },
  {
    title: "Reports & community",
    items: [
      { q: "What happens when I report a scam?", a: "A moderator reviews it. Approved reports feed community stats and alerts, and verified examples help improve detection." },
      { q: "Where do community alerts come from?", a: "They're compiled from reports and verified by moderators, then published as warnings about scams circulating right now." },
    ],
  },
  {
    title: "The project",
    items: [
      { q: "Is this affiliated with a bank or the government?", a: "No. ScamShield LK is an independent final-year research project for scam awareness." },
      { q: "How does the detection work?", a: "A multilingual text-classification model weighs wording, links and urgency signals, with word-level explanations. See the Research page for details." },
    ],
  },
];

function Faq({ q, a }) {
  return (
    <details className="group border-b border-border py-4 last:border-0 [&_summary]:cursor-pointer">
      <summary className="flex items-center justify-between gap-4 text-[15px] font-semibold text-foreground marker:content-none">
        {q}
        <Icons.IconChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition group-open:rotate-180" />
      </summary>
      <p className="mt-2.5 text-sm leading-relaxed text-foreground-secondary">{a}</p>
    </details>
  );
}

export default function FaqPage() {
  return (
    <div>
      <ContentHero
        eyebrow="FAQ"
        title="Frequently asked questions"
        description="Quick answers about checking messages, privacy, reports, and the project."
        icon={<Icons.IconHelpCircle className="h-3.5 w-3.5" />}
      />
      <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
        <div className="space-y-6">
          {GROUPS.map((g) => (
            <Card key={g.title} className="p-6">
              <h2 className="text-section-title text-foreground">{g.title}</h2>
              <div className="mt-2">
                {g.items.map((it) => (
                  <Faq key={it.q} {...it} />
                ))}
              </div>
            </Card>
          ))}
        </div>

        <Card className="mt-8 flex flex-col items-center gap-4 p-6 text-center sm:flex-row sm:text-left">
          <Icons.IconLifeBuoy className="h-8 w-8 shrink-0 text-primary" />
          <div className="flex-1">
            <h3 className="text-card-title text-foreground">Still need help?</h3>
            <p className="mt-0.5 text-sm text-muted-foreground">Browse the help centre or contact us directly.</p>
          </div>
          <div className="flex gap-2">
            <Button as={Link} to="/help" variant="secondary">Help centre</Button>
            <Button as={Link} to="/contact">Contact</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

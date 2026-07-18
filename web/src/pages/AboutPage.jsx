import Card from "../components/Card.jsx";
import PageHeader from "../components/PageHeader.jsx";
import { IconInfo, IconAlertTriangle, IconShield, IconGithub, IconDatabase } from "../components/icons.jsx";

const techStack = [
  "React 18",
  "Vite",
  "Tailwind CSS",
  "React Router",
  "Flask",
  "PostgreSQL",
  "Redis",
  "scikit-learn (TF-IDF + Logistic Regression)",
  "mBERT (under evaluation)",
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-5 px-4 py-8 sm:px-6 sm:py-12">
      <PageHeader
        eyebrow="Research project"
        title="How ScamShield LK works"
        description="Built for Sri Lanka's multilingual texting reality — Sinhala, Tamil, English, and code-mixed 'Singlish'."
        icon={<IconInfo className="h-6 w-6" />}
      />

      <Card className="space-y-3">
        <h2 className="flex items-center gap-2 text-base font-bold">
          <IconShield className="h-5 w-5 text-brand" /> The model
        </h2>
        <p className="text-sm text-muted-foreground">
          Messages are classified by a TF-IDF + Logistic Regression model trained on labelled
          Sri Lankan scam SMS. Word-level "trigger words" are surfaced from the same TF-IDF
          feature weights, so a result is never a black box — you can see which words pushed the
          verdict toward scam or legitimate.
        </p>
        <p className="text-sm text-muted-foreground">
          A multilingual transformer (mBERT) is also being evaluated as part of this research to
          see whether it meaningfully outperforms the lightweight TF-IDF baseline for this
          low-resource, code-mixed setting — the TF-IDF model is the one running behind this app
          today.
        </p>
      </Card>

      <Card className="space-y-3">
        <h2 className="text-base font-bold">Research novelty</h2>
        <p className="text-sm text-muted-foreground">
          Most public scam/spam SMS datasets are English-only. This project targets the
          Sinhala/Tamil/English code-mixing that actually shows up in Sri Lankan inboxes, and
          pairs classification with word-level explainability rather than a bare label — so a
          result gives you a reason, not just a verdict.
        </p>
      </Card>

      <Card className="space-y-3 border-warning/30 bg-warning/5">
        <h2 className="flex items-center gap-2 text-base font-bold text-warning">
          <IconAlertTriangle className="h-5 w-5" /> Known limitations
        </h2>
        <ul className="list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
          <li>
            The real, human-verified dataset behind this model is still small and growing —
            false positives and false negatives are possible. Use your own judgement alongside
            any result here.
          </li>
          <li>
            Community reports strengthen the dataset over time, but only after a moderator
            approves them — pending reports never affect classification or public stats.
          </li>
          <li>
            Sinhala/Tamil/Singlish code-mixing is genuinely hard for any text classifier — the
            model is expected to be less confident on heavily mixed-script messages.
          </li>
        </ul>
      </Card>

      <Card className="space-y-2">
        <h2 className="text-base font-bold">Your data</h2>
        <p className="text-sm text-muted-foreground">
          Checking a message is anonymous — no account or phone number is required. Messages you
          check or report are stored to improve the model and are not shared outside this
          research project.
        </p>
      </Card>

      <Card className="space-y-4">
        <h2 className="text-base font-bold">Tech stack</h2>
        <div className="flex flex-wrap gap-2">
          {techStack.map((t) => (
            <span
              key={t}
              className="rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium text-foreground/85"
            >
              {t}
            </span>
          ))}
        </div>

        <div className="flex flex-col gap-2 border-t border-border pt-4 text-sm text-muted-foreground sm:flex-row sm:gap-6">
          <span className="inline-flex items-center gap-2">
            <IconGithub className="h-4 w-4" /> Source code — repository link coming soon
          </span>
          <span className="inline-flex items-center gap-2">
            <IconDatabase className="h-4 w-4" /> Dataset card — published after the research write-up
          </span>
        </div>
      </Card>
    </div>
  );
}

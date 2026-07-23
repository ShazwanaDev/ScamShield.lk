import ContentHero from "../../components/public/ContentHero.jsx";
import { MODELS } from "../../data/admin.js";
import * as Icons from "../../components/icons.jsx";
import { Card, Badge, SectionHeading } from "../../ui/index.js";

const CONTRIBUTIONS = [
  { icon: Icons.IconDatabase, title: "A real, labelled Sri Lankan dataset", text: "Scam SMS in Sinhala, Tamil, English, Singlish and code-mixed text — a resource that didn't exist before." },
  { icon: Icons.IconWand, title: "Word-level explainability", text: "LIME + TF-IDF feature importance so every prediction is transparent, not a black box." },
  { icon: Icons.IconScale, title: "Baseline vs. transformer", text: "A lightweight TF-IDF baseline compared against multilingual BERT for this low-resource, code-mixed setting." },
];

export default function ResearchPage() {
  return (
    <div>
      <ContentHero
        eyebrow="Research & technology"
        title="The science behind ScamShield LK"
        description="A final-year research project on detecting scam SMS in Sri Lanka's multilingual, code-mixed reality — and doing it explainably."
        icon={<Icons.IconBrain className="h-3.5 w-3.5" />}
      />
      <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Contributions" title="What this project set out to do" />
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {CONTRIBUTIONS.map((c) => (
            <Card key={c.title} className="p-6">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-info-light text-info">
                <c.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-card-title text-foreground">{c.title}</h3>
              <p className="mt-1.5 text-sm text-foreground-secondary">{c.text}</p>
            </Card>
          ))}
        </div>

        <div className="mt-14">
          <SectionHeading eyebrow="Evaluation" title="Model comparison" description="Reported on a held-out test set. The lightweight baseline is the current production model; the transformer is experimental." />
          <Card className="mt-6 overflow-hidden">
            <div className="overflow-x-auto scrollbar-thin">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-background-secondary/60 text-left">
                    {["Model", "Type", "Accuracy", "Precision", "Recall", "F1", "AUC"].map((h) => (
                      <th key={h} className="px-4 py-3 font-semibold text-foreground-secondary">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {MODELS.map((m) => (
                    <tr key={m.id}>
                      <td className="px-4 py-3 font-medium text-foreground">
                        {m.name} {m.status === "active" && <Badge tone="legit" size="sm" className="ml-1">Active</Badge>}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{m.type}</td>
                      <td className="px-4 py-3 tabular-nums text-foreground">{(m.accuracy * 100).toFixed(1)}%</td>
                      <td className="px-4 py-3 tabular-nums text-foreground">{m.precision.toFixed(2)}</td>
                      <td className="px-4 py-3 tabular-nums text-foreground">{m.recall.toFixed(2)}</td>
                      <td className="px-4 py-3 tabular-nums font-semibold text-foreground">{m.f1.toFixed(2)}</td>
                      <td className="px-4 py-3 tabular-nums text-foreground">{m.auc.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
          <p className="mt-3 text-xs text-muted-foreground">
            Figures shown are representative project values for demonstration. See the interim report for full methodology and
            per-language breakdowns.
          </p>
        </div>

        <Card className="mt-12 p-6">
          <h3 className="text-section-title text-foreground">Approach in brief</h3>
          <ul className="mt-4 space-y-3 text-[15px] text-foreground-secondary">
            {[
              "Text is cleaned and normalised (Unicode NFC, URL/phone masking) with a Sinhala/Tamil-aware tokenizer.",
              "A TF-IDF representation feeds Logistic Regression / SVM baselines, evaluated with stratified cross-validation.",
              "Multilingual BERT (mBERT) is fine-tuned as a stronger comparison for the code-mixed setting.",
              "LIME and TF-IDF feature importance provide word-level explanations shown live in the app.",
              "A strict data-integrity rule separates real, reconstructed, and synthetic-augmentation examples.",
            ].map((t, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <Icons.IconCheck className="mt-1 h-4 w-4 shrink-0 text-primary" />
                {t}
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}

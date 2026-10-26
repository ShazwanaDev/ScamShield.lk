import ContentHero from "../../components/public/ContentHero.jsx";
import RESULTS from "../../data/modelResults.json";
import * as Icons from "../../components/icons.jsx";
import { Card, Badge, SectionHeading } from "../../ui/index.js";

const CONTRIBUTIONS = [
  { icon: Icons.IconDatabase, title: "A real, labelled Sri Lankan dataset", text: "Scam SMS in Sinhala, Tamil, English, Singlish and code-mixed text — a resource that didn't exist before." },
  { icon: Icons.IconWand, title: "Word-level explainability", text: "LIME + TF-IDF feature importance so every prediction is transparent, not a black box." },
  { icon: Icons.IconScale, title: "Baseline vs. transformer", text: "A lightweight TF-IDF baseline compared against multilingual BERT for this low-resource, code-mixed setting." },
];

const STATUS = {
  serving: { label: "In use", tone: "legit" },
  candidate: { label: "Candidate", tone: "primary" },
  baseline: { label: "Baseline", tone: "neutral" },
  not_trained: { label: "Not trained yet", tone: "spam" },
};

const fmt = (x) => (x == null ? "—" : x.toFixed(2));

export default function ResearchPage() {
  const d = RESULTS.dataset;
  const cv = RESULTS.models.filter((m) => m.realCv).map((m) => m.realCv.f1Mean);

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
          <SectionHeading
            eyebrow="Evaluation"
            title="Model comparison"
            description={`Tested on ${d.realTest} real Sri Lankan messages (${d.realTestScam} of them scams) that the models never saw during training. Here every model only has to answer: scam or not scam?`}
          />
          <Card className="mt-6 overflow-hidden">
            <div className="overflow-x-auto scrollbar-thin">
              <table className="w-full text-sm">
                <caption className="sr-only">Scam detection results on real messages for each model</caption>
                <thead>
                  <tr className="border-b border-border bg-background-secondary/60 text-left">
                    {["Model", "Type", "Precision", "Recall", "F1 (95% range)", "AUC"].map((h) => (
                      <th key={h} scope="col" className="px-4 py-3 font-semibold text-foreground-secondary">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {RESULTS.models.map((m) => (
                    <tr key={m.id}>
                      <th scope="row" className="px-4 py-3 text-left font-medium text-foreground">
                        {m.name} <Badge tone={STATUS[m.status].tone} size="sm" className="ml-1">{STATUS[m.status].label}</Badge>
                      </th>
                      <td className="px-4 py-3 text-muted-foreground">{m.type}</td>
                      {m.real ? (
                        <>
                          <td className="px-4 py-3 tabular-nums text-foreground">{fmt(m.real.precision)}</td>
                          <td className="px-4 py-3 tabular-nums text-foreground">{fmt(m.real.recall)}</td>
                          <td className="px-4 py-3 tabular-nums text-foreground">
                            <span className="font-semibold">{fmt(m.real.f1)}</span>{" "}
                            <span className="text-xs text-muted-foreground">({fmt(m.real.f1Ci95[0])}–{fmt(m.real.f1Ci95[1])})</span>
                          </td>
                          <td className="px-4 py-3 tabular-nums text-foreground">{fmt(m.real.auc)}</td>
                        </>
                      ) : (
                        <td colSpan={4} className="px-4 py-3 text-muted-foreground">Not trained yet, so no results to report.</td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
          <p className="mt-3 text-xs text-muted-foreground">
            The models were trained on {d.syntheticTrain.toLocaleString()} AI-assisted synthetic messages built from{" "}
            {d.syntheticTemplates} templates, and no real messages. With only {d.realTest} real test messages the results
            are uncertain, so each F1 score is shown with its 95% range. When some real messages were added to training,
            F1 rose to about {cv.map(fmt).join("–")} in cross-validation. Measured on {RESULTS.evaluatedOn}.
          </p>
        </div>

        <Card className="mt-12 p-6">
          <h3 className="text-section-title text-foreground">Approach in brief</h3>
          <ul className="mt-4 space-y-3 text-[15px] text-foreground-secondary">
            {[
              "Text is cleaned and normalised (Unicode NFC, link and phone-number masking) with a tokenizer that keeps Sinhala and Tamil words whole.",
              "A TF-IDF representation feeds Logistic Regression and SVM models, cross-validated with splits grouped by message template.",
              "Multilingual BERT (mBERT) is planned as a stronger comparison for the code-mixed setting. It has not been trained yet.",
              "TF-IDF feature weights explain each live prediction in the app; LIME is used for the research analysis.",
              "A strict data-integrity rule separates real, reconstructed, and synthetic-augmentation examples. The main models never train on real messages, which are kept for testing.",
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

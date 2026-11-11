import { useState } from "react";
import RESULTS from "../../data/modelResults.json";
import { PageHeader, Card, CardHeader, CardTitle, CardContent, Stat, Badge, ProgressBar, Select, cn } from "../../ui/index.js";
import * as Icons from "../../components/icons.jsx";

const fmt = (x) => (x == null ? "n/a" : x.toFixed(2));
const LANGUAGE_NAMES = {
  english: "English", sinhala: "Sinhala", tamil: "Tamil", singlish: "Singlish",
  thanglish: "Thanglish", code_mixed: "Code-mixed",
};
const ACTUAL = ["legitimate", "scam"];
const PREDICTED = ["legitimate", "spam", "scam"];

function f1Tone(f1) {
  return f1 >= 0.8 ? "legit" : f1 >= 0.6 ? "primary" : "spam";
}

function LanguageTable({ title, rows, showMacro }) {
  return (
    <Card>
      <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-background-secondary/60 text-left">
                <th scope="col" className="px-4 py-2.5 font-semibold text-foreground-secondary">Language</th>
                <th scope="col" className="px-4 py-2.5 text-right font-semibold text-foreground-secondary">Messages</th>
                <th scope="col" className="px-4 py-2.5 text-right font-semibold text-foreground-secondary">Scams caught</th>
                <th scope="col" className="px-4 py-2.5 font-semibold text-foreground-secondary">Scam F1</th>
                {showMacro && <th scope="col" className="px-4 py-2.5 text-right font-semibold text-foreground-secondary">Macro-F1 (3 labels)</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((r) => (
                <tr key={r.language}>
                  <th scope="row" className="px-4 py-3 text-left font-medium text-foreground">{LANGUAGE_NAMES[r.language] ?? r.language}</th>
                  <td className="px-4 py-3 text-right tabular-nums">{r.n} <span className="text-xs text-muted-foreground">({r.nScam} scam)</span></td>
                  <td className="px-4 py-3 text-right tabular-nums">{Math.round(r.scamRecall * 100)}%</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <ProgressBar value={r.scamF1 * 100} tone={f1Tone(r.scamF1)} className="w-24" />
                      <span className="w-9 text-right font-semibold tabular-nums">{fmt(r.scamF1)}</span>
                    </div>
                  </td>
                  {showMacro && <td className="px-4 py-3 text-right tabular-nums">{fmt(r.macroF1)}</td>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminEvaluation() {
  const trained = RESULTS.models.filter((m) => m.realLabelVsPredicted);
  const [selectedId, setSelectedId] = useState(
    (trained.find((m) => m.status === "serving") || trained[0]).id,
  );
  const model = trained.find((m) => m.id === selectedId);
  const matrix = model.realLabelVsPredicted;
  const max = Math.max(...ACTUAL.flatMap((a) => PREDICTED.map((p) => matrix[a][p])));
  const d = RESULTS.dataset;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Evaluation"
        description={`How ${model.name} did on ${d.realTest} real messages it never saw in training (scam vs not-scam).`}
        icon={<Icons.IconTarget className="h-5 w-5" />}
        actions={
          <div className="w-60">
            <Select size="sm" value={selectedId} onChange={(e) => setSelectedId(e.target.value)} aria-label="Model to show">
              {trained.map((m) => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </Select>
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="F1 on real messages" value={fmt(model.real.f1)} hint={`95% range ${fmt(model.real.f1Ci95[0])} to ${fmt(model.real.f1Ci95[1])}`} icon={<Icons.IconTarget className="h-5 w-5" />} tone="primary" />
        <Stat label="Precision" value={fmt(model.real.precision)} icon={<Icons.IconCheckCircle className="h-5 w-5" />} tone="legit" />
        <Stat label="Recall (scams caught)" value={fmt(model.real.recall)} icon={<Icons.IconActivity className="h-5 w-5" />} tone="teal" />
        <Stat label="AUC-ROC" value={fmt(model.real.auc)} icon={<Icons.IconGauge className="h-5 w-5" />} tone="info" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>What it predicted for real messages</CardTitle><Badge tone="neutral" size="sm">actual × predicted</Badge></CardHeader>
          <CardContent>
            <div className="overflow-x-auto scrollbar-thin">
              <table className="mx-auto text-center text-sm">
                <thead>
                  <tr>
                    <th className="p-2" />
                    <th scope="colgroup" className="p-2 text-xs font-semibold text-muted-foreground" colSpan={PREDICTED.length}>Predicted</th>
                  </tr>
                  <tr>
                    <th className="p-2" />
                    {PREDICTED.map((p) => <th key={p} scope="col" className="p-2 text-xs font-medium capitalize text-foreground-secondary">{p}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {ACTUAL.map((a) => (
                    <tr key={a}>
                      <th scope="row" className="whitespace-nowrap p-2 text-right text-xs font-medium capitalize text-foreground-secondary">{a}</th>
                      {PREDICTED.map((p) => {
                        const val = matrix[a][p];
                        // Real labels have no spam class, so a genuine message called spam is still "not scam".
                        const correct = a === "scam" ? p === "scam" : p !== "scam";
                        const intensity = max ? val / max : 0;
                        return (
                          <td key={p} className="p-1.5">
                            <div
                              className={cn("flex h-14 w-14 items-center justify-center rounded-md font-bold tabular-nums", correct ? "text-legit" : "text-scam")}
                              style={{ backgroundColor: correct ? `rgba(7,148,85,${0.12 + intensity * 0.5})` : `rgba(217,45,32,${0.08 + intensity * 0.35})` }}
                            >
                              {val}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-center text-xs text-muted-foreground">
              Green = right answer for scam vs not-scam, red = wrong. Real messages are only labelled scam or legitimate, so
              a genuine promotion predicted as spam still counts as correct.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Baseline comparison</CardTitle><Badge tone="neutral" size="sm">F1 on real messages</Badge></CardHeader>
          <CardContent className="space-y-4">
            {RESULTS.models.map((m) => (
              <div key={m.id}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 font-medium text-foreground">
                    {m.name} {m.status === "serving" && <Badge tone="legit" size="sm" className="shrink-0 whitespace-nowrap">In use</Badge>}
                  </span>
                  <span className="shrink-0 whitespace-nowrap font-semibold tabular-nums">{m.real ? `${fmt(m.real.f1)} F1` : "Not trained yet"}</span>
                </div>
                <ProgressBar value={m.real ? m.real.f1 * 100 : 0} tone={m.status === "serving" ? "legit" : m.type === "Rule-based" ? "spam" : "primary"} />
              </div>
            ))}
            <p className="text-xs text-muted-foreground">
              With some real messages added to training (5-fold cross-validation, 5 repeats), F1 reached{" "}
              {RESULTS.models.filter((m) => m.realCv).map((m) => `${fmt(m.realCv.f1Mean)} (${m.name.replace("TF-IDF + ", "")})`).join(" and ")}.
            </p>
          </CardContent>
        </Card>
      </div>

      <LanguageTable
        title="Per language: real messages (Logistic Regression)"
        rows={RESULTS.perLanguage.filter((r) => r.set === "real")}
      />
      <LanguageTable
        title="Per language: synthetic test set (Logistic Regression)"
        rows={RESULTS.perLanguage.filter((r) => r.set === "synthetic")}
        showMacro
      />
      <p className="text-xs text-muted-foreground">
        Language groups with fewer than 5 messages are left out. The real messages are mostly English or romanised, and the
        language of each real message is estimated automatically. Evaluated on {RESULTS.evaluatedOn} with scikit-learn{" "}
        {RESULTS.scikitLearnVersion}.
      </p>
    </div>
  );
}

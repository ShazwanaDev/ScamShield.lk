import { MODELS, CONFUSION_MATRIX, PER_LANGUAGE, PER_CATEGORY } from "../../data/admin.js";
import { PageHeader, Card, CardHeader, CardTitle, CardContent, Stat, Badge, ProgressBar, Select, cn } from "../../ui/index.js";
import * as Icons from "../../components/icons.jsx";

function MetricTable({ title, rows, keyField }) {
  return (
    <Card>
      <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-background-secondary/60 text-left">
                <th className="px-4 py-2.5 font-semibold text-foreground-secondary">{keyField}</th>
                <th className="px-4 py-2.5 text-right font-semibold text-foreground-secondary">Precision</th>
                <th className="px-4 py-2.5 text-right font-semibold text-foreground-secondary">Recall</th>
                <th className="px-4 py-2.5 font-semibold text-foreground-secondary">F1</th>
                <th className="px-4 py-2.5 text-right font-semibold text-foreground-secondary">n</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((r) => (
                <tr key={r[keyField.toLowerCase()] ?? r.language ?? r.category}>
                  <td className="px-4 py-3 font-medium text-foreground">{r.language ?? r.category}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{r.precision.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{r.recall.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <ProgressBar value={r.f1 * 100} tone={r.f1 >= 0.9 ? "legit" : r.f1 >= 0.82 ? "primary" : "spam"} className="w-24" />
                      <span className="w-9 text-right font-semibold tabular-nums">{r.f1.toFixed(2)}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right text-xs text-muted-foreground">{r.support}</td>
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
  const active = MODELS.find((m) => m.status === "active") || MODELS[0];
  const { labels, matrix } = CONFUSION_MATRIX;
  const rowTotals = matrix.map((row) => row.reduce((a, b) => a + b, 0));
  const max = Math.max(...matrix.flat());

  return (
    <div className="space-y-6">
      <PageHeader
        title="Evaluation"
        description={`Held-out performance for the active model — ${active.name}.`}
        icon={<Icons.IconTarget className="h-5 w-5" />}
        actions={
          <div className="w-56">
            <Select size="sm" defaultValue={active.id}>
              {MODELS.map((m) => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </Select>
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Accuracy" value={`${(active.accuracy * 100).toFixed(1)}%`} icon={<Icons.IconTarget className="h-5 w-5" />} tone="primary" />
        <Stat label="Precision" value={active.precision.toFixed(2)} icon={<Icons.IconCheckCircle className="h-5 w-5" />} tone="legit" />
        <Stat label="Recall" value={active.recall.toFixed(2)} icon={<Icons.IconActivity className="h-5 w-5" />} tone="teal" />
        <Stat label="AUC-ROC" value={active.auc.toFixed(2)} icon={<Icons.IconGauge className="h-5 w-5" />} tone="info" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Confusion matrix</CardTitle><Badge tone="neutral" size="sm">actual × predicted</Badge></CardHeader>
          <CardContent>
            <div className="overflow-x-auto scrollbar-thin">
              <table className="mx-auto text-center text-sm">
                <thead>
                  <tr>
                    <th className="p-2" />
                    <th className="p-2 text-xs font-semibold text-muted-foreground" colSpan={labels.length}>Predicted</th>
                  </tr>
                  <tr>
                    <th className="p-2" />
                    {labels.map((l) => <th key={l} className="p-2 text-xs font-medium text-foreground-secondary">{l}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {matrix.map((row, i) => (
                    <tr key={labels[i]}>
                      <th className="whitespace-nowrap p-2 text-right text-xs font-medium text-foreground-secondary">{labels[i]}</th>
                      {row.map((val, j) => {
                        const isDiag = i === j;
                        const intensity = val / max;
                        return (
                          <td key={j} className="p-1.5">
                            <div
                              className={cn("flex h-14 w-14 items-center justify-center rounded-md font-bold tabular-nums", isDiag ? "text-legit" : "text-scam")}
                              style={{ backgroundColor: isDiag ? `rgba(7,148,85,${0.12 + intensity * 0.5})` : `rgba(217,45,32,${0.08 + intensity * 0.35})` }}
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
            <p className="mt-3 text-center text-xs text-muted-foreground">Diagonal (green) = correct. Off-diagonal (red) = errors. Row totals: {rowTotals.join(" / ")}.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Baseline comparison</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {MODELS.map((m) => (
              <div key={m.id}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 font-medium text-foreground">{m.name} {m.status === "active" && <Badge tone="legit" size="sm">Active</Badge>}</span>
                  <span className="font-semibold tabular-nums">{m.f1.toFixed(2)} F1</span>
                </div>
                <ProgressBar value={m.f1 * 100} tone={m.status === "active" ? "legit" : m.type === "Rule-based" ? "spam" : "primary"} />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <MetricTable title="Per-language performance" rows={PER_LANGUAGE} keyField="Language" />
      <MetricTable title="Per-category performance" rows={PER_CATEGORY} keyField="Category" />
    </div>
  );
}

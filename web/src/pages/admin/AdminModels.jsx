import RESULTS from "../../data/modelResults.json";
import { PageHeader, Card, CardHeader, CardTitle, CardContent, DataTable, Badge, Alert, CellBarRow, cn } from "../../ui/index.js";
import * as Icons from "../../components/icons.jsx";

const STATUS = {
  serving: { label: "In use", tone: "legit" },
  candidate: { label: "Candidate", tone: "warning" },
  baseline: { label: "Baseline", tone: "neutral" },
  compared: { label: "Compared, not used", tone: "info" },
  not_trained: { label: "Not trained yet", tone: "spam" },
};

const fmt = (x) => (x == null ? "n/a" : x.toFixed(2));

export default function AdminModels() {
  const d = RESULTS.dataset;
  const trained = RESULTS.models.filter((m) => m.real);

  const comparison = trained.map((m) => ({
    label: m.name.replace("TF-IDF + ", ""),
    precision: m.real.precision,
    recall: m.real.recall,
    f1: m.real.f1,
  }));

  const columns = [
    { key: "name", header: "Model", primary: true, cell: (m) => (
      <div>
        <p className="font-medium text-foreground">{m.name}</p>
        <p className="text-xs text-muted-foreground">{m.type}</p>
      </div>
    ) },
    { key: "status", header: "Status", cell: (m) => <Badge tone={STATUS[m.status].tone} size="sm">{STATUS[m.status].label}</Badge> },
    { key: "f1", header: "F1 (real)", align: "right", cell: (m) => <span className="font-semibold tabular-nums">{fmt(m.real?.f1)}</span> },
    { key: "auc", header: "AUC (real)", align: "right", cell: (m) => <span className="tabular-nums">{fmt(m.real?.auc)}</span> },
    { key: "synth", header: "Macro-F1 (synthetic, 3 labels)", align: "right", cell: (m) => <span className="tabular-nums">{fmt(m.synthetic?.macroF1)}</span> },
    { key: "cv", header: "F1 with real data in training", align: "right", cell: (m) => (
      <span className="tabular-nums">{m.realCv ? `${fmt(m.realCv.f1Mean)} ± ${fmt(m.realCv.f1Std)}` : "n/a"}</span>
    ) },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Models"
        description={`Measured results for each model, evaluated on ${RESULTS.evaluatedOn}.`}
        icon={<Icons.IconCpu className="h-5 w-5" />}
      />

      <Alert tone="info" title="Where these numbers come from">
        Real results are scam vs not-scam on {d.realTest} real messages the models never saw in training. Synthetic results
        are all three labels on {d.syntheticTest} messages from templates kept out of training. The backend serves TF-IDF +
        Logistic Regression; switching models means retraining in <code>ml/</code>. mBERT was trained on Colab with
        the same splits; its results come from <code>ml/models/mbert_results.json</code>.
      </Alert>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {RESULTS.models.map((m) => (
          <Card key={m.id} className={cn("p-5", m.status === "serving" && "ring-1 ring-legit/40")}>
            <div className="flex items-start justify-between">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-info-light text-info">
                {m.id === "mbert" ? <Icons.IconBrain className="h-5 w-5" /> : m.id === "keyword" ? <Icons.IconTag className="h-5 w-5" /> : <Icons.IconCpu className="h-5 w-5" />}
              </span>
              <Badge tone={STATUS[m.status].tone} size="sm" className="whitespace-nowrap">{STATUS[m.status].label}</Badge>
            </div>
            <h3 className="mt-3 text-sm font-bold text-foreground">{m.name}</h3>
            {m.real ? (
              <div className="mt-3 grid grid-cols-2 gap-2 text-center">
                <div className="rounded-md bg-background-secondary/60 py-2"><p className="text-lg font-bold text-foreground">{fmt(m.real.f1)}</p><p className="text-[11px] text-muted-foreground">F1 on real</p></div>
                <div className="rounded-md bg-background-secondary/60 py-2"><p className="text-lg font-bold text-foreground">{Math.round(m.real.recall * 100)}%</p><p className="text-[11px] text-muted-foreground">scams caught</p></div>
              </div>
            ) : (
              <p className="mt-3 text-sm text-muted-foreground">Fine-tuning on Colab is still to do, so there are no results yet.</p>
            )}
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle>Real-message comparison</CardTitle><Badge tone="neutral" size="sm">scam vs not-scam</Badge></CardHeader>
        <CardContent>
          <div className="grid gap-x-10 gap-y-6 lg:grid-cols-2">
            {comparison.map((m) => (
              <div key={m.label}>
                <p className="mb-2.5 text-sm font-medium text-foreground">{m.label}</p>
                <div className="space-y-1.5">
                  <CellBarRow label="Precision" value={m.precision} max={1} cells={28} tone="light" display={fmt(m.precision)} />
                  <CellBarRow label="Recall" value={m.recall} max={1} cells={28} tone="red" display={fmt(m.recall)} />
                  <CellBarRow label="F1" value={m.f1} max={1} cells={28} tone="deep" display={fmt(m.f1)} />
                </div>
              </div>
            ))}
          </div>
          <p className="mt-5 text-xs text-muted-foreground">
            Summary: both TF-IDF models catch far more real scams than the keyword list, but flag many genuine messages too
            (precision about {fmt(trained.find((m) => m.id === "logreg")?.real.precision)}). mBERT catches fewer real scams
            and flags more genuine messages than either, despite the best synthetic-test score.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>All models</CardTitle></CardHeader>
        <CardContent className="p-0">
          <DataTable columns={columns} rows={RESULTS.models} className="rounded-none border-0" />
        </CardContent>
      </Card>
    </div>
  );
}

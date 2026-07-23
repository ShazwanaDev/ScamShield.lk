import { useMemo, useState } from "react";
import { SAMPLE_MESSAGES } from "../../data/samples.js";
import { classifyLocal } from "../../data/mockClassifier.js";
import HighlightedMessage from "../../components/analyzer/HighlightedMessage.jsx";
import { PageHeader, Card, CardHeader, CardTitle, CardContent, Alert, VerdictBadge, Badge, cn } from "../../ui/index.js";
import * as Icons from "../../components/icons.jsx";

export default function AdminExplainability() {
  const [selected, setSelected] = useState(SAMPLE_MESSAGES[0].id);
  const sample = SAMPLE_MESSAGES.find((s) => s.id === selected);
  const result = useMemo(() => classifyLocal(sample.text), [sample]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Explainability review"
        description="Inspect why the model flags a message — highlighted phrases and their contribution (LIME-style)."
        icon={<Icons.IconWand className="h-5 w-5" />}
      />

      <Alert tone="info" title="Word-level explanations">
        Each prediction exposes the phrases driving it. This transparency is a core research contribution — predictions are never a black box.
      </Alert>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <Card className="p-3">
          <p className="px-2 py-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Sample messages</p>
          <ul className="space-y-1">
            {SAMPLE_MESSAGES.map((s) => (
              <li key={s.id}>
                <button
                  onClick={() => setSelected(s.id)}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-sm transition",
                    s.id === selected ? "bg-primary/10 text-primary" : "text-foreground-secondary hover:bg-background-secondary",
                  )}
                >
                  <Badge tone="neutral" size="sm" className="shrink-0">{s.langLabel}</Badge>
                  <span className="truncate">{s.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </Card>

        <div className="space-y-4">
          <Card className="p-5">
            <div className="mb-3 flex items-center justify-between">
              <CardTitle>Prediction</CardTitle>
              <VerdictBadge verdict={result.verdict} confidence={result.confidence} />
            </div>
            <div className="rounded-lg border border-border bg-background-secondary/50 p-4">
              <HighlightedMessage text={result.message} triggers={result.triggers} verdict={result.verdict} />
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5"><Icons.IconGlobe className="h-4 w-4" /> {result.language.label}</span>
              <span className="flex items-center gap-1.5"><Icons.IconTag className="h-4 w-4" /> {result.category || "—"}</span>
            </div>
          </Card>

          <Card>
            <CardHeader><CardTitle>Feature contributions</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {result.explanation.length === 0 ? (
                <p className="text-sm text-muted-foreground">No strong contributing features for this message.</p>
              ) : (
                result.explanation.map((e, i) => {
                  const pct = Math.min(100, Math.abs(e.contribution) * 90);
                  const positive = e.contribution >= 0;
                  return (
                    <div key={i} className="grid grid-cols-[1fr_auto] items-center gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-foreground">“{e.feature}”</p>
                        <p className="text-xs text-muted-foreground">{e.why}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-28 overflow-hidden rounded-full bg-background-secondary">
                          <div className={cn("h-full rounded-full", positive ? "bg-scam" : "bg-legit")} style={{ width: `${pct}%` }} />
                        </div>
                        <span className={cn("w-12 text-right text-xs font-semibold tabular-nums", positive ? "text-scam" : "text-legit")}>
                          {positive ? "+" : ""}{e.contribution.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
              <p className="pt-1 text-xs text-muted-foreground">Positive (red) pushes toward scam; negative (green) toward legitimate.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

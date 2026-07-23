import { useState } from "react";
import { DATASET_RECORDS } from "../../data/admin.js";
import { PageHeader, Card, CardContent, Stat, Button, Badge, ProgressBar, EmptyState, useToast, cn } from "../../ui/index.js";
import * as Icons from "../../components/icons.jsx";

const LABELS = [
  { value: "scam", label: "Scam", tone: "scam" },
  { value: "spam", label: "Spam", tone: "spam" },
  { value: "legitimate", label: "Legitimate", tone: "legit" },
];
const LANG = { en: "English", si: "Sinhala", ta: "Tamil", mixed: "Singlish" };

export default function AdminAnnotation() {
  const { toast } = useToast();
  const initial = DATASET_RECORDS.filter((r) => !r.annotated);
  const [queue, setQueue] = useState(initial);
  const [done, setDone] = useState(0);
  const total = initial.length;
  const current = queue[0];

  const annotate = (label) => {
    setQueue((q) => q.slice(1));
    setDone((d) => d + 1);
    toast({ tone: "success", title: `Labelled as ${label}`, description: current.id });
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Annotation workspace" description="Label unannotated records to grow the training set." icon={<Icons.IconTag className="h-5 w-5" />} />

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Annotated this session" value={done} icon={<Icons.IconCheckSquare className="h-5 w-5" />} tone="legit" />
        <Stat label="Remaining in queue" value={queue.length} icon={<Icons.IconClock className="h-5 w-5" />} tone="spam" />
        <Card className="p-5">
          <p className="text-sm text-muted-foreground">Session progress</p>
          <ProgressBar value={total ? (done / total) * 100 : 100} tone="legit" className="mt-3" showLabel />
        </Card>
      </div>

      {current ? (
        <Card className="mx-auto max-w-2xl p-6">
          <div className="mb-3 flex items-center justify-between">
            <span className="font-mono text-xs text-muted-foreground">{current.id}</span>
            <Badge tone="neutral" size="sm">{LANG[current.language] || current.language}</Badge>
          </div>
          <div className="rounded-lg border border-border bg-background-secondary/50 p-5">
            <p lang={current.language === "si" ? "si" : current.language === "ta" ? "ta" : undefined} className="text-[15px] leading-relaxed text-foreground">
              {current.message}
            </p>
          </div>
          <p className="mt-5 text-center text-sm font-medium text-foreground">How should this be labelled?</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {LABELS.map((l) => (
              <button
                key={l.value}
                onClick={() => annotate(l.value)}
                className={cn(
                  "rounded-lg border-2 border-border px-4 py-3 text-sm font-bold text-foreground transition hover:bg-background-secondary",
                  l.tone === "scam" && "hover:border-scam hover:text-scam",
                  l.tone === "spam" && "hover:border-spam hover:text-spam",
                  l.tone === "legit" && "hover:border-legit hover:text-legit",
                )}
              >
                {l.label}
              </button>
            ))}
          </div>
          <p className="mt-4 text-center text-xs text-muted-foreground">Two annotators label each record; conflicts go to review.</p>
        </Card>
      ) : (
        <Card>
          <EmptyState icon={<Icons.IconCheckCircle className="h-7 w-7" />} title="Queue cleared" description="All records in this batch are annotated. Great work!" />
        </Card>
      )}
    </div>
  );
}

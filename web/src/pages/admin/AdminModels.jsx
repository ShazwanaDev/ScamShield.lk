import { useState } from "react";
import { MODELS } from "../../data/admin.js";
import { ComparisonLineChart } from "../../ui/charts.jsx";
import { PageHeader, Card, CardHeader, CardTitle, CardContent, DataTable, Badge, Button, Modal, useToast, cn } from "../../ui/index.js";
import * as Icons from "../../components/icons.jsx";

const STATUS_TONE = { active: "legit", candidate: "primary", experimental: "info", reference: "neutral" };

export default function AdminModels() {
  const { toast } = useToast();
  const [models, setModels] = useState(MODELS);
  const [confirm, setConfirm] = useState(null); // {model, action}

  const deploy = (id) => {
    setModels((ms) => ms.map((m) => ({ ...m, status: m.id === id ? "active" : m.status === "active" ? "candidate" : m.status })));
    toast({ tone: "success", title: "Model deployed", description: `${id} is now the active production model.` });
    setConfirm(null);
  };

  const comparison = MODELS.filter((m) => m.id !== "keyword").map((m) => ({
    label: m.name.split(" ")[0] + (m.id === "mbert" ? "" : ""),
    precision: m.precision,
    recall: m.recall,
    f1: m.f1,
  }));

  const columns = [
    { key: "name", header: "Model", primary: true, cell: (m) => (
      <div>
        <p className="font-medium text-foreground">{m.name}</p>
        <p className="text-xs text-muted-foreground">{m.type} · {m.version}</p>
      </div>
    ) },
    { key: "status", header: "Status", cell: (m) => <Badge tone={STATUS_TONE[m.status]} size="sm" className="capitalize">{m.status}</Badge> },
    { key: "accuracy", header: "Acc.", align: "right", cell: (m) => <span className="tabular-nums">{(m.accuracy * 100).toFixed(1)}%</span> },
    { key: "f1", header: "F1", align: "right", cell: (m) => <span className="font-semibold tabular-nums">{m.f1.toFixed(2)}</span> },
    { key: "sizeMb", header: "Size", align: "right", cell: (m) => <span className="text-xs text-muted-foreground">{m.sizeMb < 1 ? "<1" : m.sizeMb} MB</span> },
    {
      key: "actions",
      header: "",
      align: "right",
      cell: (m) => (
        <div className="flex justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
          {m.status !== "active" && m.id !== "keyword" && (
            <Button size="sm" variant="secondary" onClick={() => setConfirm({ model: m, action: "deploy" })} leftIcon={<Icons.IconPlay className="h-4 w-4" />}>
              Deploy
            </Button>
          )}
          {m.status === "active" && <Badge tone="legit" size="sm">Production</Badge>}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Models"
        description="Trained model versions, metrics, and deployment."
        icon={<Icons.IconCpu className="h-5 w-5" />}
        actions={<Button leftIcon={<Icons.IconPlay className="h-4 w-4" />}>New training run</Button>}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {MODELS.map((m) => (
          <Card key={m.id} className={cn("p-5", m.status === "active" && "ring-1 ring-legit/40")}>
            <div className="flex items-start justify-between">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-info-light text-info">
                {m.id === "mbert" ? <Icons.IconBrain className="h-5 w-5" /> : m.id === "keyword" ? <Icons.IconTag className="h-5 w-5" /> : <Icons.IconCpu className="h-5 w-5" />}
              </span>
              <Badge tone={STATUS_TONE[m.status]} size="sm" className="capitalize">{m.status}</Badge>
            </div>
            <h3 className="mt-3 text-sm font-bold text-foreground">{m.name}</h3>
            <div className="mt-3 grid grid-cols-2 gap-2 text-center">
              <div className="rounded-md bg-background-secondary/60 py-2"><p className="text-lg font-bold text-foreground">{(m.accuracy * 100).toFixed(0)}%</p><p className="text-[11px] text-muted-foreground">accuracy</p></div>
              <div className="rounded-md bg-background-secondary/60 py-2"><p className="text-lg font-bold text-foreground">{m.f1.toFixed(2)}</p><p className="text-[11px] text-muted-foreground">F1</p></div>
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle>Metric comparison</CardTitle></CardHeader>
        <CardContent>
          <ComparisonLineChart
            data={comparison}
            keys={[
              { dataKey: "precision", name: "Precision", color: "#175CD3" },
              { dataKey: "recall", name: "Recall", color: "#0E9384" },
              { dataKey: "f1", name: "F1", color: "#6941C6" },
            ]}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>All versions</CardTitle></CardHeader>
        <CardContent className="p-0">
          <DataTable columns={columns} rows={models} className="rounded-none border-0" />
        </CardContent>
      </Card>

      <Modal
        open={!!confirm}
        onClose={() => setConfirm(null)}
        title="Deploy model?"
        footer={<><Button variant="secondary" onClick={() => setConfirm(null)}>Cancel</Button><Button onClick={() => deploy(confirm.model.id)} leftIcon={<Icons.IconPlay className="h-4 w-4" />}>Deploy</Button></>}
      >
        {confirm && (
          <p className="text-sm text-foreground-secondary">
            Make <strong className="text-foreground">{confirm.model.name}</strong> the active production model? The current active model will move to candidate status. This affects all live predictions.
          </p>
        )}
      </Modal>
    </div>
  );
}

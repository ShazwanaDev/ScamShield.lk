import { useMemo, useState } from "react";
import { DATASET_RECORDS } from "../../data/admin.js";
import RESULTS from "../../data/modelResults.json";
import { paginate } from "../../data/store.js";
import { PageHeader, Card, CardHeader, CardTitle, CardContent, DataTable, Pagination, SearchInput, Select, Badge, Button, ProgressBar, Alert, EmptyState, cn } from "../../ui/index.js";
import * as Icons from "../../components/icons.jsx";

const SOURCE_TONE = { real: "legit", reconstructed: "info", synthetic_augmentation: "spam" };
const SOURCE_LABEL = { real: "Real", reconstructed: "Reconstructed", synthetic_augmentation: "Synthetic" };
const LABEL_TONE = { scam: "scam", spam: "spam", legitimate: "legit" };

export default function AdminDataset() {
  const [query, setQuery] = useState("");
  const [source, setSource] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(
    () =>
      DATASET_RECORDS.filter((r) => {
        if (source && r.source !== source) return false;
        if (query && !r.message.toLowerCase().includes(query.toLowerCase())) return false;
        return true;
      }),
    [query, source],
  );
  const { rows, total, pageCount, page: p } = paginate(filtered, { page, pageSize: 8 });

  const d = RESULTS.dataset;
  const s = {
    real: d.realTest,
    reconstructed: d.reconstructed,
    synthetic: d.synthetic,
    total: d.realTest + d.reconstructed + d.synthetic,
    target: d.realTarget,
  };
  const realPct = Math.min(100, Math.round((s.real / s.target) * 100));

  const columns = [
    { key: "id", header: "ID", cell: (r) => <span className="font-mono text-xs text-muted-foreground">{r.id}</span> },
    { key: "message", header: "Message", primary: true, cell: (r) => <span lang={r.language === "si" ? "si" : r.language === "ta" ? "ta" : undefined} className="line-clamp-1 max-w-sm text-sm">{r.message}</span> },
    { key: "label", header: "Label", cell: (r) => <Badge tone={LABEL_TONE[r.label]} size="sm" className="capitalize">{r.label}</Badge> },
    { key: "language", header: "Lang", cell: (r) => r.language },
    { key: "source", header: "Source", cell: (r) => <Badge tone={SOURCE_TONE[r.source]} size="sm">{SOURCE_LABEL[r.source]}</Badge> },
    { key: "annotated", header: "Annotated", align: "right", cell: (r) => (r.annotated ? <Icons.IconCheckCircle className="ml-auto h-4 w-4 text-legit" /> : <Icons.IconClock className="ml-auto h-4 w-4 text-spam" />) },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dataset"
        description="Labelled Sri Lankan scam-SMS records used to train and evaluate the models."
        icon={<Icons.IconDatabase className="h-5 w-5" />}
        actions={
          <div className="flex gap-2">
            <Button variant="secondary" leftIcon={<Icons.IconUpload className="h-4 w-4" />}>Bulk upload</Button>
            <Button leftIcon={<Icons.IconPlus className="h-4 w-4" />}>Add record</Button>
          </div>
        }
      />

      <Alert tone="warning" title="Data-integrity rule">
        Only <strong>real</strong> and <strong>reconstructed</strong> rows count toward the 500 to 1,000 primary target. Synthetic-augmentation rows are clearly flagged and never treated as primary evidence.
      </Alert>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-5">
          <p className="text-sm text-muted-foreground">Primary (real) progress</p>
          <p className="mt-1 text-data-value text-foreground">{s.real}<span className="text-base font-medium text-muted-foreground"> / {s.target}</span></p>
          <ProgressBar value={realPct} tone="legit" className="mt-3" showLabel />
        </Card>
        <Card className="flex flex-col justify-center p-5"><p className="text-sm text-muted-foreground">Reconstructed</p><p className="mt-1 text-data-value text-foreground">{s.reconstructed}</p></Card>
        <Card className="flex flex-col justify-center p-5"><p className="text-sm text-muted-foreground">Synthetic (aug.)</p><p className="mt-1 text-data-value text-foreground">{s.synthetic.toLocaleString()}</p></Card>
        <Card className="flex flex-col justify-center p-5"><p className="text-sm text-muted-foreground">Total records</p><p className="mt-1 text-data-value text-foreground">{s.total.toLocaleString()}</p></Card>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="w-full sm:max-w-xs"><SearchInput value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }} placeholder="Search records…" /></div>
        <div className="sm:w-48">
          <Select value={source} onChange={(e) => { setSource(e.target.value); setPage(1); }} size="sm">
            <option value="">All sources</option>
            <option value="real">Real</option>
            <option value="reconstructed">Reconstructed</option>
            <option value="synthetic_augmentation">Synthetic</option>
          </Select>
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        The counts above are the real dataset after cleaning. The records below are sample rows for the demo: the real
        messages are private and never shipped in the web app.
      </p>
      <DataTable columns={columns} rows={rows} empty={<EmptyState icon={<Icons.IconDatabase className="h-7 w-7" />} title="No records" />} />
      <Pagination page={p} pageCount={pageCount} onPage={setPage} totalLabel={`${total} records`} />
    </div>
  );
}

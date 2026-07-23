import { useState } from "react";
import { FEEDBACK_QUEUE } from "../../data/admin.js";
import { PageHeader, DataTable, Badge, Button, Alert, EmptyState, VerdictBadge, useToast } from "../../ui/index.js";
import { resolveVerdict } from "../../ui/verdict.jsx";
import * as Icons from "../../components/icons.jsx";

const LANG = { en: "English", si: "Sinhala", ta: "Tamil", mixed: "Singlish" };

export default function AdminFeedback() {
  const { toast } = useToast();
  const [rows, setRows] = useState(FEEDBACK_QUEUE);

  const act = (id, action) => {
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, reviewed: true } : r)));
    toast({ tone: "success", title: action === "add" ? "Added to dataset" : "Dismissed", description: `${id} handled.` });
  };

  const pending = rows.filter((r) => !r.reviewed);

  const columns = [
    { key: "message", header: "Message", primary: true, cell: (r) => <span className="line-clamp-1 max-w-xs text-sm">{r.message}</span> },
    { key: "predicted", header: "Predicted", cell: (r) => <VerdictBadge verdict={resolveVerdict(r.predicted, r.confidence)} size="sm" /> },
    { key: "userSaid", header: "User says", cell: (r) => <VerdictBadge verdict={resolveVerdict(r.userSaid, 0.9)} size="sm" /> },
    { key: "confidence", header: "Conf.", cell: (r) => <span className="tabular-nums text-sm">{Math.round(r.confidence * 100)}%</span> },
    { key: "language", header: "Lang", cell: (r) => LANG[r.language] || r.language },
    {
      key: "actions",
      header: "",
      align: "right",
      cell: (r) => (
        <div className="flex justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
          <Button size="sm" variant="secondary" onClick={() => act(r.id, "add")} leftIcon={<Icons.IconPlus className="h-4 w-4" />}>
            Add to dataset
          </Button>
          <Button size="icon-sm" variant="ghost" onClick={() => act(r.id, "dismiss")} title="Dismiss">
            <Icons.IconClose className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Prediction feedback" description="Messages where users disagreed with the model — candidates for the training set." icon={<Icons.IconCheckSquare className="h-5 w-5" />} />
      <Alert tone="info" title="Human-in-the-loop">
        Confirmed corrections can be added to the dataset (labelled by the user) to improve future models. Approved additions are appended offline, not auto-retrained.
      </Alert>
      <DataTable
        columns={columns}
        rows={pending}
        empty={<EmptyState icon={<Icons.IconCheckSquare className="h-7 w-7" />} title="All caught up" description="No pending feedback to review." />}
      />
    </div>
  );
}

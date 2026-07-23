import { useMemo, useState } from "react";
import { MOD_REPORTS } from "../../data/admin.js";
import { CATEGORY_BY_SLUG } from "../../data/scamCategories.js";
import {
  PageHeader,
  Card,
  DataTable,
  Tabs,
  Badge,
  Button,
  Modal,
  EmptyState,
  useToast,
  cn,
} from "../../ui/index.js";
import * as Icons from "../../components/icons.jsx";

const STATUS = {
  pending: { label: "Pending", tone: "spam" },
  approved: { label: "Approved", tone: "legit" },
  rejected: { label: "Rejected", tone: "scam" },
};
const LANG = { en: "English", si: "Sinhala", ta: "Tamil", mixed: "Singlish" };

export default function AdminModeration() {
  const { toast } = useToast();
  const [rows, setRows] = useState(MOD_REPORTS);
  const [tab, setTab] = useState("pending");
  const [active, setActive] = useState(null);

  const counts = useMemo(
    () => ({
      pending: rows.filter((r) => r.status === "pending").length,
      approved: rows.filter((r) => r.status === "approved").length,
      rejected: rows.filter((r) => r.status === "rejected").length,
    }),
    [rows],
  );

  const shown = rows.filter((r) => r.status === tab);

  const decide = (id, status) => {
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, status } : r)));
    setActive(null);
    toast({ tone: status === "approved" ? "success" : "warning", title: `Report ${status}`, description: `${id} moved to ${status}.` });
  };

  const columns = [
    { key: "id", header: "ID", width: "110px", cell: (r) => <span className="font-mono text-xs text-muted-foreground">{r.id}</span> },
    { key: "message", header: "Message", primary: true, cell: (r) => <span className="line-clamp-2 max-w-md text-sm">{r.message}</span> },
    { key: "category", header: "Category", cell: (r) => <Badge tone="neutral" size="sm">{CATEGORY_BY_SLUG[r.category]?.name || r.category}</Badge> },
    { key: "language", header: "Lang", cell: (r) => LANG[r.language] || r.language },
    {
      key: "actions",
      header: "",
      align: "right",
      hideOnCard: false,
      cell: (r) => (
        <div className="flex justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
          {r.status === "pending" ? (
            <>
              <Button size="icon-sm" variant="success" onClick={() => decide(r.id, "approved")} title="Approve">
                <Icons.IconCheck className="h-4 w-4" />
              </Button>
              <Button size="icon-sm" variant="danger" onClick={() => decide(r.id, "rejected")} title="Reject">
                <Icons.IconClose className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <Badge tone={STATUS[r.status].tone} size="sm">{STATUS[r.status].label}</Badge>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Moderation queue"
        description="Review community-submitted scam reports before they count toward public stats."
        icon={<Icons.IconInbox className="h-5 w-5" />}
      />

      <Tabs
        value={tab}
        onChange={setTab}
        variant="pills"
        tabs={[
          { value: "pending", label: "Pending", count: counts.pending },
          { value: "approved", label: "Approved", count: counts.approved },
          { value: "rejected", label: "Rejected", count: counts.rejected },
        ]}
      />

      <DataTable
        columns={columns}
        rows={shown}
        onRowClick={(r) => setActive(r)}
        empty={<EmptyState icon={<Icons.IconInbox className="h-7 w-7" />} title="Nothing here" description={`No ${tab} reports.`} />}
      />

      <Modal
        open={!!active}
        onClose={() => setActive(null)}
        title={`Report ${active?.id || ""}`}
        footer={
          active?.status === "pending" && (
            <>
              <Button variant="danger" onClick={() => decide(active.id, "rejected")} leftIcon={<Icons.IconClose className="h-4 w-4" />}>
                Reject
              </Button>
              <Button variant="success" onClick={() => decide(active.id, "approved")} leftIcon={<Icons.IconCheck className="h-4 w-4" />}>
                Approve
              </Button>
            </>
          )
        }
      >
        {active && (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge tone={STATUS[active.status].tone}>{STATUS[active.status].label}</Badge>
              <Badge tone="neutral">{CATEGORY_BY_SLUG[active.category]?.name || active.category}</Badge>
              <Badge tone="primary">{LANG[active.language] || active.language}</Badge>
            </div>
            <div className="rounded-lg border border-border bg-background-secondary/50 p-4">
              <p lang={active.language === "si" ? "si" : active.language === "ta" ? "ta" : undefined} className="text-[15px] leading-relaxed text-foreground">
                {active.message}
              </p>
            </div>
            <dl className="grid grid-cols-2 gap-3 text-sm">
              <div><dt className="text-muted-foreground">Reporter</dt><dd className="font-medium text-foreground">{active.reporter}</dd></div>
              <div><dt className="text-muted-foreground">Submitted</dt><dd className="font-medium text-foreground">{new Date(active.submittedAt).toLocaleString()}</dd></div>
            </dl>
          </div>
        )}
      </Modal>
    </div>
  );
}

import { useState } from "react";
import { TICKETS } from "../../data/admin.js";
import { PageHeader, DataTable, Tabs, Badge, Avatar, Modal, Button, Textarea, EmptyState, useToast } from "../../ui/index.js";
import * as Icons from "../../components/icons.jsx";

const PRIORITY = { low: "neutral", medium: "spam", high: "scam" };
const STATUS = { open: "primary", pending: "spam", resolved: "legit" };

function relTime(iso) {
  const d = (Date.now() - new Date(iso)) / 1000;
  if (d < 3600) return `${Math.max(1, Math.floor(d / 60))}m ago`;
  if (d < 86400) return `${Math.floor(d / 3600)}h ago`;
  return `${Math.floor(d / 86400)}d ago`;
}

export default function AdminSupport() {
  const { toast } = useToast();
  const [tab, setTab] = useState("open");
  const [active, setActive] = useState(null);
  const shown = TICKETS.filter((t) => (tab === "all" ? true : t.status === tab));

  const columns = [
    { key: "id", header: "ID", cell: (t) => <span className="font-mono text-xs text-muted-foreground">{t.id}</span> },
    { key: "subject", header: "Subject", primary: true, cell: (t) => <span className="line-clamp-1 text-sm font-medium text-foreground">{t.subject}</span> },
    { key: "requester", header: "Requester", cell: (t) => <span className="flex items-center gap-2"><Avatar name={t.requester} size="sm" /><span className="text-sm">{t.requester}</span></span> },
    { key: "priority", header: "Priority", cell: (t) => <Badge tone={PRIORITY[t.priority]} size="sm" className="capitalize">{t.priority}</Badge> },
    { key: "status", header: "Status", cell: (t) => <Badge tone={STATUS[t.status]} size="sm" className="capitalize">{t.status}</Badge> },
    { key: "updated", header: "Updated", align: "right", cell: (t) => <span className="text-xs text-muted-foreground">{relTime(t.updated)}</span> },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Support tickets" description="Requests and issues from users." icon={<Icons.IconLifeBuoy className="h-5 w-5" />} />
      <Tabs value={tab} onChange={setTab} variant="pills" tabs={[
        { value: "open", label: "Open", count: TICKETS.filter((t) => t.status === "open").length },
        { value: "pending", label: "Pending", count: TICKETS.filter((t) => t.status === "pending").length },
        { value: "resolved", label: "Resolved", count: TICKETS.filter((t) => t.status === "resolved").length },
        { value: "all", label: "All" },
      ]} />
      <DataTable columns={columns} rows={shown} onRowClick={setActive} empty={<EmptyState icon={<Icons.IconLifeBuoy className="h-7 w-7" />} title="No tickets" />} />

      <Modal open={!!active} onClose={() => setActive(null)} title={active?.subject} description={active?.id} footer={active && (
        <>
          <Button variant="secondary" onClick={() => setActive(null)}>Close</Button>
          <Button onClick={() => { toast({ tone: "success", title: "Reply sent" }); setActive(null); }} leftIcon={<Icons.IconSend className="h-4 w-4" />}>Send reply</Button>
        </>
      )}>
        {active && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone={STATUS[active.status]} className="capitalize">{active.status}</Badge>
              <Badge tone={PRIORITY[active.priority]} className="capitalize">{active.priority} priority</Badge>
              <span className="ml-auto text-xs text-muted-foreground">Updated {relTime(active.updated)}</span>
            </div>
            <div className="flex items-center gap-2 text-sm"><Avatar name={active.requester} size="sm" /><span className="font-medium text-foreground">{active.requester}</span></div>
            <div className="rounded-lg border border-border bg-background-secondary/50 p-4 text-sm text-foreground-secondary">
              Hi, {active.subject.toLowerCase()}. Could you help me sort this out? Thanks.
            </div>
            <Textarea rows={3} placeholder="Type your reply…" />
          </div>
        )}
      </Modal>
    </div>
  );
}

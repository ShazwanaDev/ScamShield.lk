import { useCallback, useEffect, useState } from "react";
import { API_BASE, ApiError, fetchModerationQueue, moderateReport } from "../../lib/api.js";
import { useAuth } from "../../hooks/useAuth.jsx";
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
  ErrorState,
  SkeletonText,
  useToast,
} from "../../ui/index.js";
import * as Icons from "../../components/icons.jsx";

const STATUSES = ["pending", "approved", "rejected"];
const STATUS = {
  pending: { label: "Pending", tone: "spam" },
  approved: { label: "Approved", tone: "legit" },
  rejected: { label: "Rejected", tone: "scam" },
};
const EMPTY_TEXT = {
  pending: "The queue is empty. New community reports will appear here.",
  approved: "No reports have been approved yet.",
  rejected: "No reports have been rejected yet.",
};

function langOf(text) {
  if (/[඀-෿]/.test(text)) return "si";
  if (/[஀-௿]/.test(text)) return "ta";
  return undefined;
}

function when(iso) {
  return iso ? new Date(iso).toLocaleString() : "Unknown";
}

function categoryName(slug) {
  if (!slug) return "Not given";
  return CATEGORY_BY_SLUG[slug]?.name || slug;
}

export default function AdminModeration() {
  const { toast } = useToast();
  const { adminLogout } = useAuth();
  const [lists, setLists] = useState({ pending: [], approved: [], rejected: [] });
  const [state, setState] = useState("loading"); // loading | ready | error
  const [error, setError] = useState(null);
  const [tab, setTab] = useState("pending");
  const [active, setActive] = useState(null);
  const [busyId, setBusyId] = useState(null);

  // The server refused our token (expired, or the server restarted with a new
  // key). Signing out sends the admin back to the sign-in page.
  const signedOut = useCallback(() => {
    toast({ tone: "warning", title: "Signed out", description: "Your admin session has ended. Please sign in again." });
    adminLogout();
  }, [toast, adminLogout]);

  const load = useCallback(async () => {
    setState("loading");
    try {
      const [pending, approved, rejected] = await Promise.all(STATUSES.map((s) => fetchModerationQueue(s)));
      setLists({ pending, approved, rejected });
      setState("ready");
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) return signedOut();
      setError(err instanceof ApiError ? err.message : "Couldn't load the moderation queue.");
      setState("error");
    }
  }, [signedOut]);

  useEffect(() => {
    load();
  }, [load]);

  const decide = async (report, decision) => {
    setBusyId(report.id);
    try {
      const updated = await moderateReport(report.id, decision);
      setLists((l) => ({
        ...l,
        pending: l.pending.filter((r) => r.id !== report.id),
        [updated.status]: [updated, ...l[updated.status]],
      }));
      setActive(null);
      toast({
        tone: decision === "approve" ? "success" : "warning",
        title: `Report #${report.id} ${updated.status}`,
        description: decision === "approve" ? "It now counts toward the public scam stats." : "It won't appear in public stats.",
      });
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        signedOut();
      } else if (err instanceof ApiError && err.status === 409) {
        // Someone else decided it first; reload so the screen shows the real state.
        toast({ tone: "warning", title: "Already decided", description: err.message });
        setActive(null);
        load();
      } else {
        toast({ tone: "error", title: "Couldn't save the decision", description: err.message });
      }
    } finally {
      setBusyId(null);
    }
  };

  const columns = [
    { key: "id", header: "ID", width: "80px", cell: (r) => <span className="font-mono text-xs text-muted-foreground">#{r.id}</span> },
    {
      key: "message",
      header: "Message",
      primary: true,
      cell: (r) => <span lang={langOf(r.message)} className="line-clamp-2 max-w-md text-sm">{r.message}</span>,
    },
    { key: "category", header: "Category", cell: (r) => <Badge tone="neutral" size="sm">{categoryName(r.category)}</Badge> },
    {
      key: "date",
      header: tab === "pending" ? "Submitted" : "Decided",
      cell: (r) => <span className="text-xs text-muted-foreground">{when(tab === "pending" ? r.submitted_at : r.reviewed_at)}</span>,
    },
    {
      key: "actions",
      header: "",
      align: "right",
      hideOnCard: false,
      cell: (r) => (
        <div className="flex justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
          {r.status === "pending" ? (
            <>
              <Button size="icon-sm" variant="success" loading={busyId === r.id} disabled={busyId !== null} onClick={() => decide(r, "approve")} title="Approve" aria-label={`Approve report ${r.id}`}>
                <Icons.IconCheck className="h-4 w-4" />
              </Button>
              <Button size="icon-sm" variant="danger" disabled={busyId !== null} onClick={() => decide(r, "reject")} title="Reject" aria-label={`Reject report ${r.id}`}>
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
        description="Review community-submitted scam reports. Approved reports count toward the public scam stats, and a decision can't be undone."
        icon={<Icons.IconInbox className="h-5 w-5" />}
        actions={
          <Button variant="secondary" onClick={load} disabled={state === "loading"} leftIcon={<Icons.IconRefresh className="h-4 w-4" />}>
            Refresh
          </Button>
        }
      />

      <Tabs
        value={tab}
        onChange={setTab}
        variant="pills"
        tabs={STATUSES.map((s) => ({ value: s, label: STATUS[s].label, count: state === "ready" ? lists[s].length : undefined }))}
      />

      {state === "loading" && (
        <Card className="p-6" aria-busy="true">
          <SkeletonText lines={5} />
        </Card>
      )}

      {state === "error" && (
        <Card>
          <ErrorState
            title="Couldn't load the moderation queue"
            description={`${error} The page reads reports from the backend at ${API_BASE}, so check that it is running.`}
            onRetry={load}
          />
        </Card>
      )}

      {state === "ready" && (
        <DataTable
          columns={columns}
          rows={lists[tab]}
          onRowClick={(r) => setActive(r)}
          empty={<EmptyState icon={<Icons.IconInbox className="h-7 w-7" />} title="Nothing here" description={EMPTY_TEXT[tab]} />}
        />
      )}

      <Modal
        open={!!active}
        onClose={() => setActive(null)}
        title={`Report #${active?.id ?? ""}`}
        footer={
          active?.status === "pending" && (
            <>
              <Button variant="danger" disabled={busyId !== null} onClick={() => decide(active, "reject")} leftIcon={<Icons.IconClose className="h-4 w-4" />}>
                Reject
              </Button>
              <Button variant="success" loading={busyId === active.id} disabled={busyId !== null} onClick={() => decide(active, "approve")} leftIcon={<Icons.IconCheck className="h-4 w-4" />}>
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
              <Badge tone="neutral">{categoryName(active.category)}</Badge>
            </div>
            <div className="rounded-lg border border-border bg-background-secondary/50 p-4">
              <p lang={langOf(active.message)} className="whitespace-pre-wrap text-[15px] leading-relaxed text-foreground">
                {active.message}
              </p>
            </div>
            <dl className="grid grid-cols-2 gap-3 text-sm">
              <div><dt className="text-muted-foreground">Submitted</dt><dd className="font-medium text-foreground">{when(active.submitted_at)}</dd></div>
              <div><dt className="text-muted-foreground">Decided</dt><dd className="font-medium text-foreground">{when(active.reviewed_at)}</dd></div>
            </dl>
          </div>
        )}
      </Modal>
    </div>
  );
}

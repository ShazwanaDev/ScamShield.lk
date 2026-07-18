import { useEffect, useMemo, useState } from "react";
import { fetchModerationQueue, moderateReport, ApiError } from "../lib/api.js";
import { useAuth } from "../hooks/useAuth.jsx";
import PageHeader from "../components/PageHeader.jsx";
import Card from "../components/Card.jsx";
import Button from "../components/Button.jsx";
import StatTile from "../components/StatTile.jsx";
import ReportQueueRow from "../components/ReportQueueRow.jsx";
import EmptyState from "../components/EmptyState.jsx";
import LoadingSkeleton from "../components/LoadingSkeleton.jsx";
import ErrorBanner from "../components/ErrorBanner.jsx";
import { IconLock, IconCheckCircle, IconLogout } from "../components/icons.jsx";

export default function AdminModerationPage() {
  const { adminLogout } = useAuth();
  const [status, setStatus] = useState("loading"); // loading | loaded | error
  const [queue, setQueue] = useState([]);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(new Set());
  const [bulkPending, setBulkPending] = useState(false);
  // Session-only counters — the backend has no "reviewed today" aggregate endpoint yet, so
  // these reflect decisions made in this browser session rather than all-time server state.
  const [sessionStats, setSessionStats] = useState({ approved: 0, rejected: 0 });

  function load() {
    setStatus("loading");
    fetchModerationQueue()
      .then((data) => {
        setQueue(data);
        setStatus("loaded");
      })
      .catch((err) => {
        setError(err instanceof ApiError ? err.message : "Couldn't load the queue.");
        setStatus("error");
      });
  }

  useEffect(load, []);

  async function handleDecide(id, decision) {
    await moderateReport(id, decision);
    setQueue((q) => q.filter((r) => r.id !== id));
    setSelected((s) => {
      const next = new Set(s);
      next.delete(id);
      return next;
    });
    setSessionStats((s) => ({ ...s, [decision === "approve" ? "approved" : "rejected"]: s[decision === "approve" ? "approved" : "rejected"] + 1 }));
  }

  function toggleSelect(id) {
    setSelected((s) => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleSelectAll() {
    setSelected((s) => (s.size === queue.length ? new Set() : new Set(queue.map((r) => r.id))));
  }

  async function handleBulk(decision) {
    if (selected.size === 0 || bulkPending) return;
    setBulkPending(true);
    const ids = [...selected];
    for (const id of ids) {
      try {
        await moderateReport(id, decision);
        setQueue((q) => q.filter((r) => r.id !== id));
        setSessionStats((s) => ({
          ...s,
          [decision === "approve" ? "approved" : "rejected"]: s[decision === "approve" ? "approved" : "rejected"] + 1,
        }));
      } catch {
        // leave failed items in the queue/selection so the moderator can retry them
        continue;
      }
    }
    setSelected(new Set());
    setBulkPending(false);
  }

  const allSelected = useMemo(() => queue.length > 0 && selected.size === queue.length, [queue, selected]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
      <PageHeader
        eyebrow="Moderator tools"
        title="Pending reports"
        description="Approve reports that are genuine scams (they'll count toward public stats) or reject anything spurious."
        icon={<IconLock className="h-6 w-6" />}
        actions={
          <Button variant="ghost" size="sm" onClick={adminLogout}>
            <IconLogout className="h-4 w-4" /> Log out
          </Button>
        }
      />

      <div className="mb-5 grid gap-4 sm:grid-cols-3">
        <StatTile label="Pending" value={queue.length} tone="warning" />
        <StatTile label="Approved this session" value={sessionStats.approved} tone="success" />
        <StatTile label="Rejected this session" value={sessionStats.rejected} tone="danger" />
      </div>

      {status === "loading" && (
        <Card>
          <LoadingSkeleton lines={4} />
        </Card>
      )}

      {status === "error" && (
        <ErrorBanner
          action={
            <Button size="sm" variant="secondary" onClick={load}>
              Retry
            </Button>
          }
        >
          {error}
        </ErrorBanner>
      )}

      {status === "loaded" && (
        <Card>
          {queue.length === 0 ? (
            <EmptyState icon={<IconCheckCircle className="h-6 w-6" />} title="No pending reports" description="You're all caught up." />
          ) : (
            <div>
              <div className="mb-3 flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
                <label className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleSelectAll}
                    className="h-4 w-4 rounded border-border accent-brand"
                  />
                  {selected.size > 0 ? `${selected.size} selected` : "Select all"}
                </label>
                <div className="flex gap-2">
                  <Button
                    variant="success"
                    size="sm"
                    disabled={selected.size === 0 || bulkPending}
                    loading={bulkPending}
                    onClick={() => handleBulk("approve")}
                  >
                    Approve selected
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    disabled={selected.size === 0 || bulkPending}
                    loading={bulkPending}
                    onClick={() => handleBulk("reject")}
                  >
                    Reject selected
                  </Button>
                </div>
              </div>
              {queue.map((report) => (
                <ReportQueueRow
                  key={report.id}
                  report={report}
                  onDecide={handleDecide}
                  selected={selected.has(report.id)}
                  onToggleSelect={toggleSelect}
                />
              ))}
            </div>
          )}
        </Card>
      )}
    </div>
  );
}

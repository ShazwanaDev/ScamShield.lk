import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.jsx";
import { getHistory, deleteHistoryEntry } from "../../lib/history.js";
import { resolveVerdict, VerdictBadge } from "../../ui/verdict.jsx";
import { PageHeader, SearchInput, SegmentedControl, Card, EmptyState, IconButton, ConfirmDialog, useToast } from "../../ui/index.js";
import * as Icons from "../../components/icons.jsx";

const FILTERS = [
  { value: "all", label: "All" },
  { value: "scam", label: "Scam" },
  { value: "spam", label: "Spam" },
  { value: "legitimate", label: "Legit" },
];

function relTime(iso) {
  const d = (Date.now() - new Date(iso)) / 1000;
  if (d < 60) return "just now";
  if (d < 3600) return `${Math.floor(d / 60)}m ago`;
  if (d < 86400) return `${Math.floor(d / 3600)}h ago`;
  return new Date(iso).toLocaleDateString();
}

export default function AppHistory() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [version, setVersion] = useState(0);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [confirmId, setConfirmId] = useState(null);

  const all = useMemo(() => getHistory(user?.email), [user, version]);

  const entries = useMemo(() => {
    return all.filter((h) => {
      const v = resolveVerdict(h.label, h.confidence);
      if (filter !== "all" && v !== filter) return false;
      if (query && !h.message.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
  }, [all, filter, query]);

  const doDelete = () => {
    deleteHistoryEntry(user?.email, confirmId);
    setConfirmId(null);
    setVersion((v) => v + 1);
    toast({ tone: "success", title: "Deleted", description: "The check was removed from your history." });
  };

  return (
    <div className="space-y-6">
      <PageHeader title="History" description="Every message you've checked in this browser, kept on this device." icon={<Icons.IconHistory className="h-5 w-5" />} />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="w-full sm:max-w-xs">
          <SearchInput value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search your checks…" aria-label="Search history" />
        </div>
        <SegmentedControl options={FILTERS} value={filter} onChange={setFilter} />
      </div>

      {all.length === 0 ? (
        <Card>
          <EmptyState
            icon={<Icons.IconHistory className="h-7 w-7" />}
            title="No checks yet"
            description="Messages you check will appear here."
            action={
              <Link to="/app/check" className="inline-flex h-10 items-center rounded-md bg-gradient-cta px-4 text-sm font-medium text-white shadow-glow-sm transition hover:brightness-110">
                Check a message
              </Link>
            }
          />
        </Card>
      ) : entries.length === 0 ? (
        <Card>
          <EmptyState icon={<Icons.IconSearch className="h-7 w-7" />} title="No matches" description="Try a different search or filter." />
        </Card>
      ) : (
        <Card className="overflow-hidden p-0">
          <ul className="divide-y divide-border">
            {entries.map((h) => {
              const verdict = resolveVerdict(h.label, h.confidence);
              return (
                <li key={h.id} className="flex items-center gap-3 px-4 py-3.5 transition hover:bg-background-secondary/50 sm:px-5">
                  <Link to={`/app/history/${h.id}`} className="flex min-w-0 flex-1 items-center gap-3">
                    <VerdictBadge verdict={verdict} confidence={h.confidence} size="sm" />
                    <span className="min-w-0 flex-1 truncate text-sm text-foreground">{h.message}</span>
                    <span className="hidden shrink-0 text-xs text-muted-foreground sm:block">{relTime(h.checked_at)}</span>
                  </Link>
                  <IconButton label="Delete" size="icon-sm" onClick={() => setConfirmId(h.id)}>
                    <Icons.IconTrash className="h-4 w-4 text-muted-foreground" />
                  </IconButton>
                </li>
              );
            })}
          </ul>
        </Card>
      )}

      <ConfirmDialog
        open={confirmId != null}
        onClose={() => setConfirmId(null)}
        onConfirm={doDelete}
        title="Delete this check?"
        description="This removes it from your local history. This can't be undone."
        confirmLabel="Delete"
      />
    </div>
  );
}

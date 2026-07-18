import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.jsx";
import { getHistory, deleteHistoryEntry, markHistoryFeedback } from "../lib/history.js";
import { sendFeedback } from "../lib/api.js";
import { formatRelativeTime } from "../lib/format.js";
import PageHeader from "../components/PageHeader.jsx";
import Card from "../components/Card.jsx";
import Button from "../components/Button.jsx";
import VerdictBadge from "../components/VerdictBadge.jsx";
import EmptyState from "../components/EmptyState.jsx";
import { IconHistory, IconSearch, IconTrash, IconThumbsDown, IconFlag } from "../components/icons.jsx";

const FILTERS = [
  { value: "all", label: "All" },
  { value: "scam", label: "Scam" },
  { value: "legitimate", label: "Legitimate" },
];

export default function HistoryPage() {
  const { user } = useAuth();
  const [entries, setEntries] = useState(() => getHistory(user.email));
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return entries.filter((e) => {
      if (filter !== "all" && e.label !== filter) return false;
      if (search.trim() && !e.message.toLowerCase().includes(search.trim().toLowerCase())) return false;
      return true;
    });
  }, [entries, filter, search]);

  function handleDelete(id) {
    deleteHistoryEntry(user.email, id);
    setEntries(getHistory(user.email));
  }

  async function handleMarkIncorrect(entry) {
    if (typeof entry.id === "number") {
      try {
        await sendFeedback(entry.id, false);
      } catch {
        // best-effort — still record locally even if the server call fails
      }
    }
    markHistoryFeedback(user.email, entry.id, false);
    setEntries(getHistory(user.email));
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <PageHeader
        eyebrow={`Signed in as ${user.email}`}
        title="My history"
        description="Messages you've checked on this device. This history is stored locally in your browser, not shared with anyone."
        icon={<IconHistory className="h-6 w-6" />}
      />

      {entries.length === 0 ? (
        <Card>
          <EmptyState
            icon={<IconHistory className="h-6 w-6" />}
            title="No checks yet"
            description="Messages you check while signed in will show up here."
            action={
              <Link to="/check">
                <Button size="sm">
                  <IconFlag className="h-4 w-4" /> Check a message
                </Button>
              </Link>
            }
          />
        </Card>
      ) : (
        <Card className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-xs">
              <IconSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search your history…"
                aria-label="Search your history"
                className="w-full rounded-xl border border-border bg-card py-2.5 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <div className="inline-flex rounded-lg border border-border p-0.5 text-xs font-medium">
              {FILTERS.map((f) => (
                <button
                  key={f.value}
                  type="button"
                  onClick={() => setFilter(f.value)}
                  aria-pressed={filter === f.value}
                  className={`rounded-md px-3 py-1.5 transition-colors ${
                    filter === f.value ? "bg-brand text-brand-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {filtered.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">No checks match that search/filter.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
                    <th scope="col" className="py-2 pr-4 font-semibold">
                      Message
                    </th>
                    <th scope="col" className="py-2 pr-4 font-semibold">
                      Verdict
                    </th>
                    <th scope="col" className="py-2 pr-4 font-semibold">
                      Confidence
                    </th>
                    <th scope="col" className="py-2 pr-4 font-semibold">
                      Checked
                    </th>
                    <th scope="col" className="py-2 pr-0 text-right font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((entry) => (
                    <tr key={entry.id} className="border-b border-border last:border-0">
                      <td className="max-w-xs truncate py-3 pr-4 text-foreground/90">{entry.message}</td>
                      <td className="py-3 pr-4">
                        <VerdictBadge label={entry.label} />
                      </td>
                      <td className="py-3 pr-4 text-foreground/80">{Math.round(entry.confidence * 100)}%</td>
                      <td className="py-3 pr-4 whitespace-nowrap text-muted-foreground">
                        {formatRelativeTime(entry.checked_at)}
                      </td>
                      <td className="py-3 pr-0">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleMarkIncorrect(entry)}
                            disabled={entry.feedback === "incorrect"}
                            title="Mark as incorrect"
                            aria-label="Mark as incorrect"
                            className="grid h-8 w-8 place-items-center rounded-lg border border-border text-muted-foreground hover:border-danger/40 hover:text-danger disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            <IconThumbsDown className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(entry.id)}
                            title="Delete"
                            aria-label="Delete entry"
                            className="grid h-8 w-8 place-items-center rounded-lg border border-border text-muted-foreground hover:border-danger/40 hover:text-danger"
                          >
                            <IconTrash className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}

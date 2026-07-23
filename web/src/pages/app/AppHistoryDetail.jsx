import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.jsx";
import { getHistory, deleteHistoryEntry, markHistoryFeedback } from "../../lib/history.js";
import { resolveVerdict, VERDICTS, ConfidenceRing } from "../../ui/verdict.jsx";
import HighlightedMessage from "../../components/analyzer/HighlightedMessage.jsx";
import { Breadcrumbs, Card, Button, Badge, ConfirmDialog, useToast, cn } from "../../ui/index.js";
import * as Icons from "../../components/icons.jsx";
import NotFoundPage from "../public/StatusPages.jsx";

export default function AppHistoryDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [confirm, setConfirm] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const entry = useMemo(() => getHistory(user?.email).find((h) => String(h.id) === String(id)), [user, id]);
  if (!entry) return <NotFoundPage />;

  const verdict = resolveVerdict(entry.label, entry.confidence);
  const v = VERDICTS[verdict];
  const Icon = v.Icon;

  const sendFb = (correct) => {
    markHistoryFeedback(user?.email, entry.id, correct);
    setFeedback(correct ? "correct" : "incorrect");
    toast({ tone: "success", title: "Feedback saved", description: "Thanks for helping improve detection." });
  };

  const doDelete = () => {
    deleteHistoryEntry(user?.email, entry.id);
    navigate("/app/history");
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Breadcrumbs items={[{ label: "History", to: "/app/history" }, { label: "Check detail" }]} />

      <div className={cn("overflow-hidden rounded-xl border", v.ring)}>
        <div className={cn("flex items-center justify-between gap-4 p-5", v.bg)}>
          <div className="flex items-center gap-4">
            <span className={cn("inline-flex h-12 w-12 items-center justify-center rounded-xl", v.solid)}>
              <Icon className="h-6 w-6" />
            </span>
            <div>
              <h1 className={cn("text-xl font-extrabold", v.text)}>{v.label}</h1>
              <p className="mt-0.5 text-sm text-muted-foreground">
                {new Date(entry.checked_at).toLocaleString()}
              </p>
            </div>
          </div>
          <ConfidenceRing value={entry.confidence} accent={v.accent} size={84} stroke={8} />
        </div>
      </div>

      <Card className="p-5">
        <h2 className="mb-3 text-card-title text-foreground">Message</h2>
        <div className="rounded-lg border border-border bg-background-secondary/50 p-4">
          <HighlightedMessage text={entry.message} triggers={[]} verdict={verdict} />
        </div>
      </Card>

      <Card className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-foreground">Was this correct?</p>
          {entry.feedback || feedback ? (
            <p className="mt-1 flex items-center gap-1.5 text-sm text-legit">
              <Icons.IconCheckCircle className="h-4 w-4" /> Feedback recorded ({entry.feedback || feedback})
            </p>
          ) : (
            <div className="mt-2 flex gap-2">
              <Button variant="secondary" size="sm" leftIcon={<Icons.IconThumbsUp className="h-4 w-4" />} onClick={() => sendFb(true)}>
                Correct
              </Button>
              <Button variant="secondary" size="sm" leftIcon={<Icons.IconThumbsDown className="h-4 w-4" />} onClick={() => sendFb(false)}>
                Incorrect
              </Button>
            </div>
          )}
        </div>
        <div className="flex gap-2">
          {verdict !== "legitimate" && (
            <Button as={Link} to="/app/reports/new" variant="danger-outline" size="sm" leftIcon={<Icons.IconFlag className="h-4 w-4" />}>
              Report
            </Button>
          )}
          <Button variant="danger-outline" size="sm" leftIcon={<Icons.IconTrash className="h-4 w-4" />} onClick={() => setConfirm(true)}>
            Delete
          </Button>
        </div>
      </Card>

      <ConfirmDialog open={confirm} onClose={() => setConfirm(false)} onConfirm={doDelete} title="Delete this check?" description="This removes it from your history permanently." confirmLabel="Delete" />
    </div>
  );
}

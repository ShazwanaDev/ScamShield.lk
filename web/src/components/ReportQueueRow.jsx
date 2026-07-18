import { useState } from "react";
import Button from "./Button.jsx";
import { formatRelativeTime } from "../lib/format.js";

export default function ReportQueueRow({ report, onDecide, selected, onToggleSelect }) {
  const [pending, setPending] = useState(null); // "approve" | "reject" | null

  async function handle(decision) {
    setPending(decision);
    try {
      await onDecide(report.id, decision);
    } finally {
      setPending(null);
    }
  }

  return (
    <div className="flex flex-col gap-3 border-b border-border py-4 last:border-0 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-start gap-3">
        {onToggleSelect && (
          <input
            type="checkbox"
            checked={selected}
            onChange={() => onToggleSelect(report.id)}
            aria-label={`Select report ${report.id}`}
            className="mt-1 h-4 w-4 shrink-0 rounded border-border accent-brand"
          />
        )}
        <div className="min-w-0">
          <p className="break-words text-sm text-foreground">{report.message}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Submitted {formatRelativeTime(report.submitted_at)}
          </p>
        </div>
      </div>
      <div className="flex shrink-0 gap-2">
        <Button
          variant="success"
          size="sm"
          loading={pending === "approve"}
          disabled={pending !== null}
          onClick={() => handle("approve")}
        >
          Approve
        </Button>
        <Button
          variant="danger"
          size="sm"
          loading={pending === "reject"}
          disabled={pending !== null}
          onClick={() => handle("reject")}
        >
          Reject
        </Button>
      </div>
    </div>
  );
}

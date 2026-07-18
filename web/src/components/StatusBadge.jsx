const styles = {
  pending: "bg-warning/15 text-warning border-warning/30",
  approved: "bg-success/15 text-success border-success/30",
  rejected: "bg-muted text-muted-foreground border-border",
};

const labels = {
  pending: "Pending review",
  approved: "Approved",
  rejected: "Rejected",
};

export default function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${styles[status] ?? styles.pending}`}
    >
      {labels[status] ?? status}
    </span>
  );
}

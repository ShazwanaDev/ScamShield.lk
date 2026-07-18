export default function TriggerChip({ word, negative }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${
        negative
          ? "border-danger/30 bg-danger/10 text-danger"
          : "border-border bg-muted text-foreground"
      }`}
    >
      {word}
    </span>
  );
}

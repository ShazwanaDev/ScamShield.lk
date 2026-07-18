function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Renders the original message with any trigger words wrapped in a red highlight. */
export default function HighlightedMessage({ message, triggerWords = [] }) {
  const words = [...new Set(triggerWords.map((t) => t.word).filter(Boolean))].sort(
    (a, b) => b.length - a.length
  );

  if (words.length === 0) {
    return <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">{message}</p>;
  }

  const pattern = new RegExp(`(${words.map(escapeRegExp).join("|")})`, "gi");
  const parts = message.split(pattern);
  const wordsLower = words.map((w) => w.toLowerCase());

  return (
    <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">
      {parts.map((part, i) =>
        wordsLower.includes(part.toLowerCase()) ? (
          <mark key={i} className="rounded bg-danger/20 px-0.5 font-semibold text-danger">
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </p>
  );
}

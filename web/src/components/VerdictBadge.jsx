export default function VerdictBadge({ label }) {
  const isScam = label === "scam";
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${
        isScam ? "border-danger/30 bg-danger/10 text-danger" : "border-success/30 bg-success/10 text-success"
      }`}
    >
      {isScam ? "Scam" : "Legitimate"}
    </span>
  );
}

import { IconAlertTriangle, IconCheckCircle } from "./icons.jsx";
import TriggerChip from "./TriggerChip.jsx";
import HighlightedMessage from "./HighlightedMessage.jsx";
import ConfidenceRing from "./ConfidenceRing.jsx";
import FeedbackButtons from "./FeedbackButtons.jsx";

export default function ResultCard({ result, message }) {
  const isScam = result.label === "scam";
  const confidencePct = Math.round(result.confidence * 100);
  const triggerWords = result.trigger_words ?? [];

  return (
    <div
      className={`animate-fade-up rounded-2xl border p-5 shadow-card sm:p-6 ${
        isScam ? "border-danger/30 bg-danger/5" : "border-success/30 bg-success/5"
      }`}
    >
      <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
        <ConfidenceRing value={confidencePct} tone={isScam ? "danger" : "success"} />
        <div className="min-w-0 flex-1">
          <div className="inline-flex items-center gap-2">
            <span
              className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg ${
                isScam ? "bg-danger/15 text-danger" : "bg-success/15 text-success"
              }`}
            >
              {isScam ? <IconAlertTriangle className="h-4 w-4" /> : <IconCheckCircle className="h-4 w-4" />}
            </span>
            <p className={`text-lg font-black ${isScam ? "text-danger" : "text-success"}`}>
              {isScam ? "Likely SCAM" : "Looks legitimate"}
            </p>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {confidencePct}% confidence from the classification model.
          </p>
        </div>
      </div>

      {message && (
        <div className="mt-5 rounded-xl border border-border bg-card p-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            The message you checked
          </p>
          <HighlightedMessage message={message} triggerWords={triggerWords} />
        </div>
      )}

      {triggerWords.length > 0 && (
        <div className="mt-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Words that drove this result
          </p>
          <div className="flex flex-wrap gap-2">
            {triggerWords.map((t, i) => (
              <TriggerChip key={i} word={t.word} negative={isScam} />
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 border-t border-border pt-4">
        <FeedbackButtons classificationId={result.classification_id} />
      </div>
    </div>
  );
}

import { useState } from "react";
import { Link } from "react-router-dom";
import HighlightedMessage from "./HighlightedMessage.jsx";
import { CATEGORY_BY_SLUG } from "../../data/scamCategories.js";
import {
  Button,
  Badge,
  Card,
  ConfidenceRing,
  VERDICTS,
  cn,
} from "../../ui/index.js";
import {
  IconGlobe,
  IconTag,
  IconWifiOff,
  IconCpu,
  IconThumbsUp,
  IconThumbsDown,
  IconFlag,
  IconBookmark,
  IconArrowRight,
  IconWand,
  IconCheckCircle,
} from "../icons.jsx";

function Meta({ icon, label, value }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-background-secondary text-muted-foreground">{icon}</span>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="truncate text-sm font-semibold text-foreground">{value}</p>
      </div>
    </div>
  );
}

/**
 * Full classification result. Verdict-driven (scam/spam/legit/low) with
 * confidence, detected language, category, highlighted triggers, explainable
 * contributions, recommended actions, and feedback — the product's centrepiece.
 */
export default function ResultView({ result, onFeedback, onReset, compact = false }) {
  const [showExplain, setShowExplain] = useState(false);
  const [feedback, setFeedback] = useState(null);
  if (!result) return null;

  const v = VERDICTS[result.verdict] || VERDICTS.low;
  const Icon = v.Icon;
  const category = result.category ? CATEGORY_BY_SLUG[result.category] : null;

  const submitFeedback = (correct) => {
    setFeedback(correct ? "correct" : "incorrect");
    onFeedback?.(correct);
  };

  return (
    <div className={cn("space-y-4 animate-reveal", compact && "space-y-3")}>
      {/* Verdict banner */}
      <div className={cn("overflow-hidden rounded-xl border", v.ring)}>
        <div className={cn("flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6", v.bg)}>
          <div className="flex items-start gap-4">
            <span className={cn("inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl", v.solid)}>
              <Icon className="h-6 w-6" />
            </span>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className={cn("text-xl font-extrabold", v.text)}>{v.label}</h2>
                {result.source === "offline" && (
                  <Badge tone="warning" size="sm" icon={<IconWifiOff className="h-3.5 w-3.5" />}>
                    Offline check
                  </Badge>
                )}
                {result.source === "model" && (
                  <Badge tone="legit" size="sm" icon={<IconCpu className="h-3.5 w-3.5" />}>
                    Live model
                  </Badge>
                )}
              </div>
              <p className="mt-1 max-w-md text-sm text-foreground-secondary">{v.blurb}</p>
            </div>
          </div>
          <div className="shrink-0 self-center">
            <ConfidenceRing value={result.confidence} accent={v.accent} size={104} stroke={9} />
          </div>
        </div>

        {/* Meta strip */}
        <div className="grid grid-cols-1 gap-4 border-t border-border bg-surface p-5 sm:grid-cols-3">
          <Meta icon={<IconGlobe className="h-4 w-4" />} label="Detected language" value={result.language?.label || "—"} />
          <Meta
            icon={<IconTag className="h-4 w-4" />}
            label="Scam category"
            value={category ? category.name : result.verdict === "legitimate" ? "Not applicable" : "Uncategorised"}
          />
          <Meta
            icon={<IconCpu className="h-4 w-4" />}
            label="Analysed by"
            value={result.source === "model" ? "ScamShield model" : "On-device check"}
          />
        </div>
      </div>

      {/* Message with highlighted triggers */}
      <Card className="p-5">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-card-title text-foreground">The message you checked</h3>
          {result.triggers?.length > 0 && (
            <span className="text-xs text-muted-foreground">
              {result.triggers.length} risky phrase{result.triggers.length > 1 ? "s" : ""} highlighted
            </span>
          )}
        </div>
        <div className="rounded-lg border border-border bg-background-secondary/50 p-4">
          <HighlightedMessage text={result.message} triggers={result.triggers} verdict={result.verdict} />
        </div>

        {result.triggers?.length > 0 && (
          <div className="mt-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Why this was flagged</p>
            <div className="flex flex-wrap gap-2">
              {result.triggers.map((t, i) => (
                <span
                  key={i}
                  className={cn("inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset", v.bg, v.text, v.ring)}
                >
                  <span className="max-w-[12rem] truncate">“{t.phrase}”</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Explainability */}
        {result.explanation?.length > 0 && (
          <div className="mt-4">
            <button
              onClick={() => setShowExplain((s) => !s)}
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
              aria-expanded={showExplain}
            >
              <IconWand className="h-4 w-4" />
              {showExplain ? "Hide" : "Show"} detailed explanation
            </button>
            {showExplain && (
              <div className="mt-3 space-y-2.5 rounded-lg border border-border p-4 animate-fade-up">
                <p className="text-xs text-muted-foreground">
                  Each phrase pushes the result toward scam (right) or legitimate (left) — a simple, transparent view of the model's reasoning.
                </p>
                {result.explanation.map((e, i) => {
                  const pct = Math.min(100, Math.abs(e.contribution) * 90);
                  const positive = e.contribution >= 0;
                  return (
                    <div key={i} className="grid grid-cols-[1fr_auto] items-center gap-3">
                      <div>
                        <p className="truncate text-sm font-medium text-foreground">“{e.feature}”</p>
                        <p className="text-xs text-muted-foreground">{e.why}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-24 overflow-hidden rounded-full bg-background-secondary">
                          <div
                            className={cn("h-full rounded-full", positive ? "bg-scam" : "bg-legit")}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className={cn("w-10 text-right text-xs font-semibold tabular-nums", positive ? "text-scam" : "text-legit")}>
                          {positive ? "+" : ""}
                          {e.contribution.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Recommended actions */}
      <Card className="p-5">
        <h3 className="text-card-title text-foreground">What you should do</h3>
        <ul className="mt-3 space-y-2.5">
          {result.recommendedActions.map((a, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-foreground-secondary">
              <IconCheckCircle className={cn("mt-0.5 h-4 w-4 shrink-0", v.text)} />
              {a}
            </li>
          ))}
        </ul>
      </Card>

      {/* Feedback + actions */}
      <div className="flex flex-col gap-4 rounded-xl border border-border bg-surface p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-foreground">Was this result correct?</p>
          {feedback ? (
            <p className="mt-1 text-sm text-legit">Thanks — your feedback helps improve detection.</p>
          ) : (
            <div className="mt-2 flex gap-2">
              <Button variant="secondary" size="sm" leftIcon={<IconThumbsUp className="h-4 w-4" />} onClick={() => submitFeedback(true)}>
                Correct
              </Button>
              <Button variant="secondary" size="sm" leftIcon={<IconThumbsDown className="h-4 w-4" />} onClick={() => submitFeedback(false)}>
                Incorrect
              </Button>
            </div>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {result.verdict !== "legitimate" && (
            <Button as={Link} to="/report" variant="danger-outline" size="sm" leftIcon={<IconFlag className="h-4 w-4" />}>
              Report this
            </Button>
          )}
          <Button variant="outline" size="sm" leftIcon={<IconBookmark className="h-4 w-4" />}>
            Save
          </Button>
          {onReset && (
            <Button size="sm" onClick={onReset} rightIcon={<IconArrowRight className="h-4 w-4" />}>
              Check another
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

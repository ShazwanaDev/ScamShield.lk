import { useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import HighlightedMessage from "./HighlightedMessage.jsx";
import { CATEGORY_BY_SLUG } from "../../data/scamCategories.js";
import { Button, Badge, Card, VERDICTS, TickGauge, SignalTrace, CellBarRow, cn } from "../../ui/index.js";
import {
  IconGlobe,
  IconTag,
  IconWifiOff,
  IconCpu,
  IconThumbsUp,
  IconThumbsDown,
  IconFlag,
  IconMegaphone,
  IconBookmark,
  IconArrowRight,
  IconWand,
  IconCheckCircle,
} from "../icons.jsx";

/** Below this confidence the app reports "uncertain" (see resolveVerdict / normalizeApiResult). */
const CONFIDENCE_FLOOR = 60;

const PANEL = {
  scam: "border-scam/20 bg-[linear-gradient(180deg,#2A1113_0%,#1A0E0F_100%)]",
  spam: "border-spam/20 bg-[linear-gradient(180deg,#272012_0%,#18140E_100%)]",
  legitimate: "border-legit/20 bg-[linear-gradient(180deg,#10241A_0%,#0D1611_100%)]",
  low: "border-warning/20 bg-[linear-gradient(180deg,#272012_0%,#18140E_100%)]",
};

const RISK_LABEL = { scam: "High risk", spam: "Unwanted", legitimate: "Low risk", low: "Unclear" };

function Meta({ icon, label, value }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-white/[0.04] text-muted-foreground ring-1 ring-inset ring-white/[0.06]">{icon}</span>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="truncate text-sm font-medium text-foreground">{value}</p>
      </div>
    </div>
  );
}

/** Place each explained phrase at its position in the message, in reading order. */
function traceEvents(result) {
  const msg = String(result.message || "").toLowerCase();
  const len = Math.max(1, msg.length);
  const used = new Set();
  return (result.explanation || [])
    .map((e) => {
      const feature = String(e.feature || "");
      const idx = msg.indexOf(feature.toLowerCase());
      if (idx < 0 || !feature) return null;
      let x = Math.min(0.96, Math.max(0.04, (idx + feature.length / 2) / len));
      while (used.has(Math.round(x * 50))) x = Math.min(0.97, x + 0.03);
      used.add(Math.round(x * 50));
      const sign = e.contribution >= 0 ? "+" : "";
      return { x, delta: e.contribution, label: `“${feature}”`, sub: `${sign}${e.contribution.toFixed(2)}` };
    })
    .filter(Boolean)
    .sort((a, b) => a.x - b.x);
}

/**
 * Full classification result. Verdict-driven (scam/spam/legit/low) with
 * confidence, detected language, category, highlighted triggers, explainable
 * contributions, recommended actions, and feedback: the product's centrepiece.
 */
export default function ResultView({ result, onFeedback, onReset, compact = false }) {
  const [showExplain, setShowExplain] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const events = useMemo(() => (result ? traceEvents(result) : []), [result]);
  // In the user portal, reporting and the community alerts live under /app.
  const inPortal = useLocation().pathname.startsWith("/app");
  if (!result) return null;
  const reportTo = inPortal ? "/app/reports/new" : "/report";
  const alertsTo = inPortal ? "/app/alerts" : "/alerts";
  // The report form opens with this message already filled in.
  const reportState = { message: result.message };

  const v = VERDICTS[result.verdict] || VERDICTS.low;
  const Icon = v.Icon;
  const category = result.category ? CATEGORY_BY_SLUG[result.category] : null;
  const score = Math.round((result.confidence ?? 0) * 100);
  const maxContribution = Math.max(0.01, ...(result.explanation || []).map((e) => Math.abs(e.contribution)));

  const submitFeedback = (correct) => {
    setFeedback(correct ? "correct" : "incorrect");
    onFeedback?.(correct);
  };

  return (
    <div className={cn("space-y-4 animate-reveal", compact && "space-y-3")}>
      {/* Verdict panel */}
      <section aria-labelledby="verdict-title" className={cn("overflow-hidden rounded-xl border", PANEL[result.verdict] || PANEL.low)}>
        <div className="p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className={cn("inline-flex h-9 w-9 items-center justify-center rounded-lg", v.solid)}>
                <Icon className="h-[18px] w-[18px]" />
              </span>
              <h2 id="verdict-title" className={cn("text-xl font-semibold", v.text)}>
                {v.label}
              </h2>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {result.source === "offline" && (
                <Badge tone="warning" size="sm" icon={<IconWifiOff className="h-3.5 w-3.5" />}>
                  Offline check
                </Badge>
              )}
              {result.source === "model" && (
                <Badge tone="neutral" size="sm" icon={<IconCpu className="h-3.5 w-3.5" />}>
                  Live model
                </Badge>
              )}
              <span className={cn("rounded-full px-3 py-1 text-xs font-semibold", v.solid)}>{RISK_LABEL[result.verdict] ?? "Unclear"}</span>
            </div>
          </div>

          <div className={cn("mt-6 grid gap-6", events.length > 0 && "md:grid-cols-[minmax(0,1fr)_13rem] md:items-end")}>
            {events.length > 0 && (
              <div>
                <p className="mb-2 text-xs text-muted-foreground">How the flagged phrases moved the score, in reading order</p>
                <SignalTrace events={events} height={compact ? 170 : 200} baselineLabel="Neutral" />
                <div className="mt-1 flex justify-between font-mono text-[10.5px] text-muted-foreground">
                  <span>Start of message</span>
                  <span>End</span>
                </div>
              </div>
            )}
            <div className={cn(events.length === 0 && "flex flex-wrap items-end justify-between gap-4")}>
              <p className="flex items-baseline gap-1.5">
                <span className="figure text-[4.5rem] font-semibold leading-none text-foreground">{score}</span>
                <span className="figure text-2xl text-muted-foreground">/100</span>
              </p>
              <p className="mt-2 max-w-xs text-sm text-foreground-secondary">{v.blurb}</p>
            </div>
          </div>

          <TickGauge
            className="mt-6"
            value={score}
            threshold={CONFIDENCE_FLOOR}
            label="Confidence"
            thresholdLabel="Floor"
            accent={v.accent}
          />
          {/* Usability testing: reporting and the community alerts were the hardest things to find. */}
          <div className="mt-5 flex flex-wrap gap-2">
            {result.verdict !== "legitimate" && (
              <Button as={Link} to={reportTo} state={reportState} variant="danger" size="sm" leftIcon={<IconFlag className="h-4 w-4" />}>
                Report this message
              </Button>
            )}
            <Button as={Link} to={alertsTo} variant="outline" size="sm" leftIcon={<IconMegaphone className="h-4 w-4" />}>
              See community alerts
            </Button>
          </div>
        </div>

        {/* Meta strip */}
        <div className="grid grid-cols-1 gap-4 border-t border-white/[0.06] bg-black/20 p-5 sm:grid-cols-3">
          <Meta icon={<IconGlobe className="h-4 w-4" />} label="Detected language" value={result.language?.label || "Unknown"} />
          <Meta
            icon={<IconTag className="h-4 w-4" />}
            label="Scam category"
            value={category ? category.name : result.verdict === "legitimate" ? "Not applicable" : "Uncategorised"}
          />
          <Meta icon={<IconCpu className="h-4 w-4" />} label="Analysed by" value={result.source === "model" ? "ScamShield model" : "On-device check"} />
        </div>
      </section>

      {/* Message with highlighted triggers */}
      <Card className="p-5">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-card-title text-foreground">The message you checked</h3>
          {result.triggers?.length > 0 && (
            <span className="font-mono text-xs text-muted-foreground">
              {result.triggers.length} risky phrase{result.triggers.length > 1 ? "s" : ""}
            </span>
          )}
        </div>
        <div className="rounded-lg border border-white/[0.06] bg-black/30 p-4">
          <HighlightedMessage text={result.message} triggers={result.triggers} verdict={result.verdict} />
        </div>

        {result.triggers?.length > 0 && (
          <div className="mt-4">
            <p className="mb-2 text-xs text-muted-foreground">Why this was flagged</p>
            <div className="flex flex-wrap gap-2">
              {result.triggers.map((t, i) => (
                <span key={i} className={cn("inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium ring-1 ring-inset", v.bg, v.text, v.ring)}>
                  <span className="max-w-[12rem] truncate">“{t.phrase}”</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Explainability */}
        {result.explanation?.length > 0 && (
          <div className="mt-5 border-t border-white/[0.06] pt-4">
            <button
              onClick={() => setShowExplain((s) => !s)}
              className="inline-flex items-center gap-2 text-sm font-medium text-primary-soft transition hover:text-foreground"
              aria-expanded={showExplain}
            >
              <IconWand className="h-4 w-4" />
              {showExplain ? "Hide" : "Show"} detailed explanation
            </button>
            {showExplain && (
              <div className="mt-4 space-y-3 animate-fade-up">
                <p className="text-xs text-muted-foreground">
                  Each phrase pushes the result toward scam (red) or legitimate (green). A simple, transparent view of the
                  model's reasoning.
                </p>
                {result.explanation.map((e, i) => {
                  const positive = e.contribution >= 0;
                  return (
                    <CellBarRow
                      key={i}
                      label={`“${e.feature}”`}
                      sub={e.why}
                      value={Math.abs(e.contribution)}
                      max={maxContribution}
                      cells={20}
                      tone={positive ? "red" : "legit"}
                      display={`${positive ? "+" : ""}${e.contribution.toFixed(2)}`}
                    />
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
      <div className="flex flex-col gap-4 rounded-xl border border-white/[0.06] bg-surface p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-foreground">Was this result correct?</p>
          {feedback ? (
            <p className="mt-1 text-sm text-legit">Thanks. Your feedback helps improve detection.</p>
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
            <Button as={Link} to={reportTo} state={reportState} variant="danger-outline" size="sm" leftIcon={<IconFlag className="h-4 w-4" />}>
              Report this message
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

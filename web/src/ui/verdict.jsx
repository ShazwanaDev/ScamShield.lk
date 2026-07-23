import { cn } from "./cn.js";
import {
  IconShieldAlert,
  IconAlertTriangle,
  IconShieldCheck,
  IconHelpCircle,
} from "../components/icons.jsx";

/**
 * Canonical verdict config. Scam / Spam / Legitimate / Low-confidence are the
 * four result states the classifier + UI speak in. Every visual treatment
 * (badge, ring, page banner) derives from here so the states are always
 * distinct by icon + text + colour (never colour alone — a11y).
 */
export const VERDICTS = {
  scam: {
    label: "Scam detected",
    short: "Scam",
    tone: "scam",
    Icon: IconShieldAlert,
    text: "text-scam",
    bg: "bg-scam-light",
    ring: "ring-scam/25",
    solid: "bg-scam text-white",
    accent: "#D92D20",
    blurb: "This message shows strong signs of a scam. Do not click links, share codes, or send money.",
  },
  spam: {
    label: "Spam / promotional",
    short: "Spam",
    tone: "spam",
    Icon: IconAlertTriangle,
    text: "text-spam",
    bg: "bg-spam-light",
    ring: "ring-warning/30",
    solid: "bg-spam text-white",
    accent: "#DC6803",
    blurb: "This looks like unsolicited promotional or bulk messaging rather than a targeted scam.",
  },
  legitimate: {
    label: "Looks legitimate",
    short: "Legitimate",
    tone: "legit",
    Icon: IconShieldCheck,
    text: "text-legit",
    bg: "bg-legit-light",
    ring: "ring-legit/25",
    solid: "bg-legit text-white",
    accent: "#079455",
    blurb: "No strong scam signals detected. Stay cautious — always verify unexpected requests independently.",
  },
  low: {
    label: "Low confidence",
    short: "Uncertain",
    tone: "warning",
    Icon: IconHelpCircle,
    text: "text-spam",
    bg: "bg-warning-light",
    ring: "ring-warning/30",
    solid: "bg-warning text-foreground",
    accent: "#F79009",
    blurb: "The model isn't confident about this one. Treat it with caution and verify through official channels.",
  },
};

/** Map a raw label + confidence to a canonical verdict key. */
export function resolveVerdict(label, confidence) {
  const l = String(label || "").toLowerCase();
  if (confidence != null && confidence < 0.6) return "low";
  if (l.includes("scam") || l === "spam_scam") return "scam";
  if (l.includes("spam")) return "spam";
  if (l.includes("legit") || l === "ham") return "legitimate";
  return "low";
}

export function VerdictBadge({ verdict = "scam", confidence, size = "md", className }) {
  const v = VERDICTS[verdict] || VERDICTS.low;
  const Icon = v.Icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full font-bold ring-1 ring-inset",
        v.bg,
        v.text,
        v.ring,
        size === "sm" ? "px-2.5 py-1 text-xs" : "px-3.5 py-1.5 text-sm",
        className,
      )}
    >
      <Icon className={size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4"} />
      {v.short}
      {confidence != null && <span className="tabular-nums opacity-80">· {Math.round(confidence * 100)}%</span>}
    </span>
  );
}

/* ── Confidence meter (radial) ──────────────────────────────────── */

export function ConfidenceRing({ value = 0, accent = "#175CD3", size = 120, stroke = 10, label = "confidence" }) {
  const pct = Math.max(0, Math.min(100, Math.round(value * 100)));
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (pct / 100) * c;
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" role="img" aria-label={`${pct}% ${label}`}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#EEF2F6" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={accent}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.9s cubic-bezier(0.16,1,0.3,1)" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-2xl font-bold tabular-nums text-foreground">{pct}%</span>
        <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{label}</span>
      </div>
    </div>
  );
}

/* ── Confidence bar (linear, labelled) ──────────────────────────── */

export function ConfidenceBar({ value = 0, accent = "#175CD3", className }) {
  const pct = Math.max(0, Math.min(100, Math.round(value * 100)));
  return (
    <div className={className}>
      <div className="mb-1.5 flex items-center justify-between text-xs font-medium">
        <span className="text-muted-foreground">Model confidence</span>
        <span className="tabular-nums text-foreground">{pct}%</span>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-background-secondary">
        <div
          className="h-full rounded-full transition-[width] duration-700 ease-out"
          style={{ width: `${pct}%`, backgroundColor: accent }}
        />
      </div>
    </div>
  );
}

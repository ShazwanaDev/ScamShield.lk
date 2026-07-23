import { cn } from "../../ui/cn.js";
import { VERDICTS } from "../../ui/verdict.jsx";

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Detect a lang attribute so Sinhala/Tamil glyphs get the right font. */
function langOf(text) {
  if (/[඀-෿]/.test(text)) return "si";
  if (/[஀-௿]/.test(text)) return "ta";
  return undefined;
}

/**
 * Renders the original message with the model's trigger phrases highlighted.
 * Highlights read as `<mark>` (semantic), tinted by verdict tone — never colour
 * alone, since the phrase is also visibly emphasised.
 */
export default function HighlightedMessage({ text = "", triggers = [], verdict = "scam", className }) {
  const v = VERDICTS[verdict] || VERDICTS.low;
  const phrases = [...new Set(triggers.map((t) => t.phrase).filter(Boolean))].sort((a, b) => b.length - a.length);

  let parts = [text];
  if (phrases.length) {
    const re = new RegExp(`(${phrases.map(escapeRe).join("|")})`, "gi");
    parts = text.split(re);
  }

  return (
    <p lang={langOf(text)} className={cn("whitespace-pre-wrap text-[15px] leading-relaxed text-foreground", className)}>
      {parts.map((part, i) => {
        const isHit = phrases.some((p) => p.toLowerCase() === part.toLowerCase());
        return isHit ? (
          <mark key={i} className={cn("rounded px-1 py-0.5 font-semibold", v.bg, v.text)}>
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        );
      })}
    </p>
  );
}

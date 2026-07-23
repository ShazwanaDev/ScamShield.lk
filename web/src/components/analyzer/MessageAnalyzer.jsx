import { useRef, useState } from "react";
import { classifyMessage } from "../../lib/api.js";
import { classifyLocal, normalizeApiResult } from "../../data/mockClassifier.js";
import { SAMPLE_MESSAGES } from "../../data/samples.js";
import { Button, Badge, Textarea, cn } from "../../ui/index.js";
import { IconClipboard, IconShieldCheck, IconLock, IconClose } from "../icons.jsx";

const MAX = 1000;

/**
 * The message analyser input. Tries the real Flask /predict endpoint first and
 * gracefully falls back to the transparent on-device classifier when the API
 * is unreachable — so it works live-wired or fully offline. Emits a normalized
 * result via `onResult`.
 */
export default function MessageAnalyzer({ onResult, autoFocus = false }) {
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [offlineNote, setOfflineNote] = useState(false);
  const ref = useRef(null);

  const analyse = async () => {
    const message = text.trim();
    if (!message || busy) return;
    setBusy(true);
    setOfflineNote(false);

    const started = Date.now();
    let result;
    try {
      const api = await classifyMessage(message);
      result = normalizeApiResult(api, message);
    } catch {
      result = classifyLocal(message);
      setOfflineNote(true);
    }
    // Let the scan animation breathe
    const elapsed = Date.now() - started;
    if (elapsed < 900) await new Promise((r) => setTimeout(r, 900 - elapsed));

    setBusy(false);
    onResult?.(result);
  };

  const paste = async () => {
    try {
      const t = await navigator.clipboard.readText();
      if (t) setText(t.slice(0, MAX));
      ref.current?.focus();
    } catch {
      ref.current?.focus();
    }
  };

  return (
    <div className="rounded-xl border border-border bg-surface shadow-card">
      <div className="border-b border-border px-5 py-3.5">
        <div className="flex items-center justify-between gap-3">
          <label htmlFor="analyzer-input" className="text-sm font-semibold text-foreground">
            Paste a suspicious SMS
          </label>
          <button
            onClick={paste}
            className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-semibold text-primary transition hover:bg-primary/10"
          >
            <IconClipboard className="h-4 w-4" />
            Paste
          </button>
        </div>
      </div>

      <div className="relative p-5">
        {busy && (
          <div className="pointer-events-none absolute inset-x-5 top-5 z-10 h-[168px] overflow-hidden rounded-lg">
            <div className="absolute inset-x-0 h-16 bg-gradient-scan animate-scan" />
          </div>
        )}
        <Textarea
          id="analyzer-input"
          ref={ref}
          value={text}
          autoFocus={autoFocus}
          onChange={(e) => setText(e.target.value.slice(0, MAX))}
          placeholder="e.g. Your account will be suspended. Share the OTP sent to your phone to verify…"
          rows={6}
          className="min-h-[168px]"
          disabled={busy}
        />
        <div className="mt-2 flex items-center justify-between">
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <IconLock className="h-3.5 w-3.5" />
            Your message is analysed privately and not shared.
          </p>
          <span className={cn("text-xs tabular-nums", text.length > MAX * 0.9 ? "text-spam" : "text-muted-foreground")}>
            {text.length}/{MAX}
          </span>
        </div>

        {/* Sample chips */}
        <div className="mt-4">
          <p className="mb-2 text-xs font-medium text-muted-foreground">Or try an example:</p>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_MESSAGES.slice(0, 5).map((s) => (
              <button
                key={s.id}
                onClick={() => setText(s.text)}
                disabled={busy}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background-secondary px-3 py-1.5 text-xs font-medium text-foreground-secondary transition hover:border-primary/40 hover:text-foreground disabled:opacity-50"
              >
                <Badge tone="neutral" size="sm" className="ring-0 px-1.5 py-0">
                  {s.langLabel}
                </Badge>
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button
            size="lg"
            onClick={analyse}
            loading={busy}
            disabled={!text.trim()}
            leftIcon={!busy && <IconShieldCheck className="h-5 w-5" />}
            className="sm:min-w-[200px]"
          >
            {busy ? "Analysing…" : "Check message"}
          </Button>
          {text && !busy && (
            <button onClick={() => setText("")} className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground">
              <IconClose className="h-4 w-4" />
              Clear
            </button>
          )}
          {offlineNote && (
            <span className="text-xs text-spam">Checked on-device (server unavailable).</span>
          )}
        </div>
      </div>
    </div>
  );
}

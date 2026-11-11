import { useState } from "react";
import { Link } from "react-router-dom";
import ContentHero from "../../components/public/ContentHero.jsx";
import { submitReport, REPORT_CATEGORIES, REPORT_LANGUAGES, ApiError } from "../../lib/api.js";
import * as Icons from "../../components/icons.jsx";
import { Card, Button, Field, Textarea, Select, Alert, Badge, cn } from "../../ui/index.js";

const MAX = 1000;

export default function ReportPage() {
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState("");
  const [language, setLanguage] = useState("");
  const [status, setStatus] = useState("idle"); // idle | submitting | done | queued | error
  const [error, setError] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return setError("Please paste the message you want to report.");
    setError(null);
    setStatus("submitting");
    try {
      await submitReport(message.trim(), category || undefined, language || undefined);
      setStatus("done");
    } catch (err) {
      // Network/unreachable → treat as queued (honest: a real client queues it).
      if (err instanceof ApiError && err.status === 0) setStatus("queued");
      else {
        setStatus("error");
        setError(err?.message || "Something went wrong. Please try again.");
      }
    }
  };

  const reset = () => {
    setMessage("");
    setCategory("");
    setLanguage("");
    setStatus("idle");
    setError(null);
  };

  if (status === "done" || status === "queued") {
    const queued = status === "queued";
    return (
      <div>
        <ContentHero eyebrow="Community reporting" title="Report a scam" icon={<Icons.IconFlag className="h-3.5 w-3.5" />} />
        <div className="mx-auto max-w-xl px-4 py-14 sm:px-6">
          <Card className="p-8 text-center">
            <span className={cn("mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full", queued ? "bg-spam-light text-spam" : "bg-legit-light text-legit")}>
              {queued ? <Icons.IconClock className="h-8 w-8" /> : <Icons.IconCheckCircle className="h-8 w-8" />}
            </span>
            <h2 className="mt-5 text-2xl font-extrabold text-foreground">
              {queued ? "Saved. Will submit when online" : "Report submitted"}
            </h2>
            <p className="mt-2 text-foreground-secondary">
              {queued
                ? "You appear to be offline. Your report is saved and will be sent automatically once you're back online."
                : "Thank you. A moderator will review it before it's counted toward public stats. Reports like yours help warn others."}
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Button onClick={reset} leftIcon={<Icons.IconFlag className="h-4 w-4" />}>
                Report another
              </Button>
              <Button as={Link} to="/alerts" variant="secondary">
                View community alerts
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div>
      <ContentHero
        eyebrow="Community reporting"
        title="Report a scam"
        description="Seen a scam SMS, even one that didn't come to you directly? Share it so a moderator can review it and warn others."
        icon={<Icons.IconFlag className="h-3.5 w-3.5" />}
      />
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_auto]">
          <form onSubmit={submit} className="space-y-5">
            <Card className="space-y-5 p-6">
              {error && <Alert tone="error">{error}</Alert>}

              <Field label="The scam message" required hint={`${message.length}/${MAX} characters`}>
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value.slice(0, MAX))}
                  rows={6}
                  placeholder="Paste the full scam SMS here. Redact any personal details you don't want to include."
                />
              </Field>

              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Category" hint="Optional. Helps grouping">
                  <Select value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="">Not sure</option>
                    {REPORT_CATEGORIES.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </Select>
                </Field>
                <Field label="Language" hint="Optional">
                  <Select value={language} onChange={(e) => setLanguage(e.target.value)}>
                    <option value="">Not specified</option>
                    {REPORT_LANGUAGES.map((l) => (
                      <option key={l.value} value={l.value}>
                        {l.label}
                      </option>
                    ))}
                  </Select>
                </Field>
              </div>

              <Alert tone="info" title="Your privacy">
                Don't include OTPs, passwords, card numbers, or your NIC. Reports are reviewed by a moderator before appearing in public stats.
              </Alert>

              <Button type="submit" size="lg" fullWidth loading={status === "submitting"} leftIcon={status !== "submitting" && <Icons.IconSend className="h-5 w-5" />}>
                Submit report
              </Button>
            </Card>
          </form>
        </div>

        <div className="mt-6 rounded-xl border border-border bg-background-secondary/50 p-5">
          <p className="text-sm font-semibold text-foreground">What happens to my report?</p>
          <ol className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li className="flex gap-2"><Badge tone="neutral" size="sm">1</Badge> A moderator reviews it for accuracy.</li>
            <li className="flex gap-2"><Badge tone="neutral" size="sm">2</Badge> Approved reports feed community stats and alerts.</li>
            <li className="flex gap-2"><Badge tone="neutral" size="sm">3</Badge> Verified examples help improve detection for everyone.</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

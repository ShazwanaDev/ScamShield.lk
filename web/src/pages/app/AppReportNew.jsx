import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.jsx";
import { submitReport, REPORT_CATEGORIES, REPORT_LANGUAGES, ApiError } from "../../lib/api.js";
import { addMyReport } from "../../lib/myReports.js";
import { queueReport } from "../../lib/reportQueue.js";
import { Breadcrumbs, Card, Button, Field, Textarea, Select, Alert, useToast } from "../../ui/index.js";
import { IconSend } from "../../components/icons.jsx";

const MAX = 1000;

export default function AppReportNew() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState("");
  const [language, setLanguage] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return setError("Please paste the message you want to report.");
    setError(null);
    setBusy(true);
    const report = { message: message.trim(), category, language };
    try {
      await submitReport(report.message, category || undefined, language || undefined);
    } catch (err) {
      if (!(err instanceof ApiError && err.status === 0)) {
        // The server refused it (for example an invalid message): say so and keep the form.
        setBusy(false);
        setError(err?.message || "Something went wrong. Please try again.");
        return;
      }
      // Server unreachable: keep it in this browser and send it when the connection is back.
      const entry = addMyReport(user?.email, { ...report, status: "queued" });
      if (!queueReport({ ...report, email: user?.email, myReportId: entry.id })) {
        setBusy(false);
        setError("We couldn't reach the server, and this browser won't let us save the report. Please try again later.");
        return;
      }
      toast({ tone: "warning", title: "Saved on this device", description: "It will be sent automatically when you're back online." });
      navigate(`/app/reports/${entry.id}`);
      return;
    }
    const entry = addMyReport(user?.email, report);
    toast({ tone: "success", title: "Report submitted", description: "A moderator will review it shortly." });
    navigate(`/app/reports/${entry.id}`);
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Breadcrumbs items={[{ label: "My reports", to: "/app/reports" }, { label: "New report" }]} />
      <div>
        <h1 className="text-page-title text-foreground">Report a scam</h1>
        <p className="mt-1 text-[15px] text-foreground-secondary">Share a scam SMS so a moderator can review it and warn others.</p>
      </div>

      <form onSubmit={submit}>
        <Card className="space-y-5 p-6">
          {error && <Alert tone="error">{error}</Alert>}
          <Field label="The scam message" required hint={`${message.length}/${MAX} characters`}>
            <Textarea value={message} onChange={(e) => setMessage(e.target.value.slice(0, MAX))} rows={6} placeholder="Paste the full scam SMS. Redact anything personal." />
          </Field>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Category" hint="Optional">
              <Select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="">Not sure</option>
                {REPORT_CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </Select>
            </Field>
            <Field label="Language" hint="Optional">
              <Select value={language} onChange={(e) => setLanguage(e.target.value)}>
                <option value="">Not specified</option>
                {REPORT_LANGUAGES.map((l) => (
                  <option key={l.value} value={l.value}>{l.label}</option>
                ))}
              </Select>
            </Field>
          </div>
          <Alert tone="info">Don't include OTPs, passwords, card numbers, or your NIC.</Alert>
          <div className="flex gap-3">
            <Button type="submit" size="lg" loading={busy} leftIcon={!busy && <IconSend className="h-5 w-5" />}>
              Submit report
            </Button>
            <Button type="button" variant="ghost" size="lg" onClick={() => navigate("/app/reports")}>
              Cancel
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
}

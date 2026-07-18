import { useEffect, useState } from "react";
import { submitReport, fetchStats, ApiError } from "../lib/api.js";
import PageHeader from "../components/PageHeader.jsx";
import Card from "../components/Card.jsx";
import Button from "../components/Button.jsx";
import TextAreaField from "../components/TextAreaField.jsx";
import CategorySelect from "../components/CategorySelect.jsx";
import LanguageSelect from "../components/LanguageSelect.jsx";
import ErrorBanner from "../components/ErrorBanner.jsx";
import EmptyState from "../components/EmptyState.jsx";
import { IconFlag, IconCheckCircle } from "../components/icons.jsx";

const MAX_LENGTH = 1000;
const MIN_LENGTH = 4;

export default function ReportPage() {
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState("");
  const [language, setLanguage] = useState("");
  const [status, setStatus] = useState("idle"); // idle | submitting | done | error
  const [error, setError] = useState(null);
  const [validationError, setValidationError] = useState(null);
  const [communityTotal, setCommunityTotal] = useState(null);

  useEffect(() => {
    fetchStats()
      .then((data) => setCommunityTotal(data.total_community_approved_reports))
      .catch(() => setCommunityTotal(null));
  }, [status]);

  async function handleSubmit(e) {
    e.preventDefault();
    const trimmed = message.trim();

    if (!trimmed) {
      setValidationError("Enter the message you want to report.");
      return;
    }
    if (trimmed.length < MIN_LENGTH) {
      setValidationError(`Message is too short — enter at least ${MIN_LENGTH} characters.`);
      return;
    }
    if (status === "submitting") return;

    setValidationError(null);
    setStatus("submitting");
    setError(null);
    try {
      await submitReport(trimmed, category || undefined, language || undefined);
      setStatus("done");
    } catch (err) {
      setStatus("error");
      setError(err instanceof ApiError ? err.message : "Something went wrong. Try again.");
    }
  }

  function reportAnother() {
    setMessage("");
    setCategory("");
    setLanguage("");
    setStatus("idle");
    setError(null);
    setValidationError(null);
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-12">
      <PageHeader
        eyebrow="Community reporting"
        title="Report a scam message"
        description="Seen a scam SMS that didn't come to you directly? Share it here so a moderator can review it and warn others."
        icon={<IconFlag className="h-6 w-6" />}
      />

      {communityTotal !== null && (
        <p className="mb-5 text-center text-sm text-muted-foreground">
          <span className="font-bold text-brand">{communityTotal.toLocaleString()}</span> messages
          reported by the community so far.
        </p>
      )}

      <Card>
        {status === "done" ? (
          <EmptyState
            icon={<IconCheckCircle className="h-6 w-6" />}
            title="Thanks — your report is in the moderation queue"
            description="A moderator will review this before it's counted toward public stats. Your report doesn't include any personal details unless you typed them into the message."
            action={
              <Button variant="secondary" size="sm" onClick={reportAnother}>
                Report another message
              </Button>
            }
          />
        ) : (
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <TextAreaField
              id="report-message"
              label="Message text"
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                if (validationError) setValidationError(null);
              }}
              placeholder="Paste the scam message here…"
              maxLength={MAX_LENGTH}
              required
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <CategorySelect
                id="report-category"
                label="Category (optional)"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
              <LanguageSelect
                id="report-language"
                label="Language (optional)"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              />
            </div>
            <Button type="submit" loading={status === "submitting"} disabled={!message.trim()}>
              Submit report
            </Button>
            {validationError && (
              <p role="alert" className="text-sm text-danger">
                {validationError}
              </p>
            )}
            {status === "error" && <ErrorBanner>{error}</ErrorBanner>}
          </form>
        )}
      </Card>
    </div>
  );
}

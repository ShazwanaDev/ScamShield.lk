import { useState } from "react";
import { Link } from "react-router-dom";
import { classifyMessage, ApiError } from "../lib/api.js";
import { addHistoryEntry } from "../lib/history.js";
import { useAuth } from "../hooks/useAuth.jsx";
import PageHeader from "../components/PageHeader.jsx";
import Card from "../components/Card.jsx";
import Button from "../components/Button.jsx";
import TextAreaField from "../components/TextAreaField.jsx";
import ResultCard from "../components/ResultCard.jsx";
import ErrorBanner from "../components/ErrorBanner.jsx";
import { IconShield, IconFlag } from "../components/icons.jsx";

const MAX_LENGTH = 1000;
const MIN_LENGTH = 4;

export default function ClassifyPage() {
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const [checkedMessage, setCheckedMessage] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validationError, setValidationError] = useState(null);

  async function handleCheck(e) {
    e.preventDefault();
    const trimmed = message.trim();

    if (!trimmed) {
      setValidationError("Enter a message to check.");
      return;
    }
    if (trimmed.length < MIN_LENGTH) {
      setValidationError(`Message is too short — enter at least ${MIN_LENGTH} characters.`);
      return;
    }
    if (loading) return;

    setValidationError(null);
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await classifyMessage(trimmed);
      setResult(data);
      setCheckedMessage(trimmed);
      if (user) {
        addHistoryEntry(user.email, {
          message: trimmed,
          label: data.label,
          confidence: data.confidence,
          classification_id: data.classification_id,
        });
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <PageHeader
        eyebrow="Free · anonymous · instant"
        title="Check a suspicious SMS"
        description="Paste a message you're unsure about — in Sinhala, Tamil, English, or mixed — and get an instant scam/legitimate verdict with the words that drove the decision."
        icon={<IconShield className="h-6 w-6" />}
      />

      <Card as="form" onSubmit={handleCheck} noValidate className="space-y-4">
        <TextAreaField
          id="message"
          label="Message text"
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            if (validationError) setValidationError(null);
          }}
          placeholder="Paste the message here (Sinhala, Tamil, English, or mixed)…"
          maxLength={MAX_LENGTH}
          required
        />
        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Button type="submit" loading={loading} disabled={!message.trim()}>
            Analyze message
          </Button>
          <Link
            to="/report"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-brand hover:underline"
          >
            <IconFlag className="h-4 w-4" /> Report a different message
          </Link>
        </div>

        {validationError && (
          <p role="alert" className="text-sm text-danger">
            {validationError}
          </p>
        )}
        {error && <ErrorBanner>{error}</ErrorBanner>}
      </Card>

      {result && (
        <div className="mt-5">
          <ResultCard result={result} message={checkedMessage} />
        </div>
      )}
    </div>
  );
}

import { useState } from "react";
import { sendFeedback } from "../lib/api.js";
import { IconThumbsUp, IconThumbsDown } from "./icons.jsx";

export default function FeedbackButtons({ classificationId }) {
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [choice, setChoice] = useState(null);

  if (!classificationId) return null;

  async function submit(correct) {
    if (status === "sending" || status === "sent") return;
    setChoice(correct);
    setStatus("sending");
    try {
      await sendFeedback(classificationId, correct);
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return <p className="text-sm font-medium text-success">Thanks for your feedback.</p>;
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-sm font-medium text-foreground">Was this correct?</span>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => submit(true)}
          disabled={status === "sending"}
          className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium hover:bg-success/10 hover:border-success/40 hover:text-success disabled:opacity-50 ${
            choice === true ? "border-success/40 bg-success/10 text-success" : "border-border bg-card"
          }`}
        >
          <IconThumbsUp className="h-4 w-4" /> Correct
        </button>
        <button
          type="button"
          onClick={() => submit(false)}
          disabled={status === "sending"}
          className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium hover:bg-danger/10 hover:border-danger/40 hover:text-danger disabled:opacity-50 ${
            choice === false ? "border-danger/40 bg-danger/10 text-danger" : "border-border bg-card"
          }`}
        >
          <IconThumbsDown className="h-4 w-4" /> Incorrect
        </button>
      </div>
      {status === "error" && (
        <span className="text-xs text-danger">Couldn't save that — try again.</span>
      )}
    </div>
  );
}

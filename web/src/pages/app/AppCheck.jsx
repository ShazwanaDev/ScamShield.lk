import { useRef, useState } from "react";
import { useAuth } from "../../hooks/useAuth.jsx";
import { addHistoryEntry } from "../../lib/history.js";
import { sendFeedback } from "../../lib/api.js";
import MessageAnalyzer from "../../components/analyzer/MessageAnalyzer.jsx";
import ResultView from "../../components/analyzer/ResultView.jsx";
import { PageHeader, useToast } from "../../ui/index.js";
import { IconShieldCheck } from "../../components/icons.jsx";

export default function AppCheck() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [result, setResult] = useState(null);
  const resultRef = useRef(null);

  const onResult = (r) => {
    setResult(r);
    // Saved automatically to the signed-in user's history.
    addHistoryEntry(user?.email, {
      message: r.message,
      label: r.verdict === "legitimate" ? "legitimate" : r.verdict,
      confidence: r.confidence,
      classification_id: r.classificationId,
    });
    requestAnimationFrame(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };

  const onFeedback = async (correct) => {
    try {
      if (result?.classificationId != null) await sendFeedback(result.classificationId, correct);
    } catch {
      /* offline / no backend — feedback still acknowledged in UI */
    }
    toast({ tone: "success", title: "Feedback recorded", description: "Thanks — this helps improve detection." });
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader
        title="Check a message"
        description="Paste a suspicious SMS. Results are saved to your history automatically."
        icon={<IconShieldCheck className="h-5 w-5" />}
      />
      <MessageAnalyzer onResult={onResult} autoFocus />
      {result && (
        <div ref={resultRef} className="scroll-mt-24">
          <ResultView result={result} onFeedback={onFeedback} onReset={() => setResult(null)} />
        </div>
      )}
    </div>
  );
}

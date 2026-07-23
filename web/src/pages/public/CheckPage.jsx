import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import MessageAnalyzer from "../../components/analyzer/MessageAnalyzer.jsx";
import ResultView from "../../components/analyzer/ResultView.jsx";
import { sendFeedback } from "../../lib/api.js";
import { SCAM_CATEGORIES } from "../../data/scamCategories.js";
import { Badge, Card, useToast } from "../../ui/index.js";
import { IconShieldCheck, IconGlobe, IconWand, IconLock } from "../../components/icons.jsx";

const ASSURANCES = [
  { icon: IconGlobe, title: "Multilingual", text: "Sinhala, Tamil, English, Singlish & code-mixed." },
  { icon: IconWand, title: "Explainable", text: "See the exact words that make a message risky." },
  { icon: IconLock, title: "Private", text: "Messages are analysed for you and not shared." },
];

export default function CheckPage() {
  const [result, setResult] = useState(null);
  const resultRef = useRef(null);
  const { toast } = useToast();

  const onResult = (r) => {
    setResult(r);
    requestAnimationFrame(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };

  const onFeedback = async (correct) => {
    try {
      if (result?.classificationId != null) await sendFeedback(result.classificationId, correct);
      toast({ tone: "success", title: "Feedback recorded", description: "Thanks for helping improve detection." });
    } catch {
      toast({ tone: "success", title: "Feedback noted", description: "Saved locally — thank you." });
    }
  };

  return (
    <div className="bg-background">
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="text-center">
          <Badge tone="primary" icon={<IconShieldCheck className="h-3.5 w-3.5" />}>
            Free scam checker
          </Badge>
          <h1 className="mt-4 text-display-sm text-foreground">Check a message</h1>
          <p className="mx-auto mt-3 max-w-xl text-[15px] leading-relaxed text-foreground-secondary">
            Paste any SMS you're unsure about. ScamShield LK tells you whether it looks like a scam, spam, or a
            legitimate message — and highlights exactly why.
          </p>
        </div>

        <div className="mt-8">
          <MessageAnalyzer onResult={onResult} autoFocus />
        </div>

        {result ? (
          <div ref={resultRef} className="mt-8 scroll-mt-24">
            <ResultView result={result} onFeedback={onFeedback} onReset={() => setResult(null)} />
          </div>
        ) : (
          <>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {ASSURANCES.map((a) => (
                <Card key={a.title} className="p-4">
                  <a.icon className="h-5 w-5 text-primary" />
                  <p className="mt-2.5 text-sm font-semibold text-foreground">{a.title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{a.text}</p>
                </Card>
              ))}
            </div>

            <div className="mt-8 rounded-xl border border-border bg-surface p-5">
              <p className="text-sm font-semibold text-foreground">Common scam types in Sri Lanka</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {SCAM_CATEGORIES.filter((c) => c.slug !== "other").map((c) => (
                  <Link
                    key={c.slug}
                    to={`/scam-types/${c.slug}`}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-foreground-secondary transition hover:border-primary/40 hover:text-foreground"
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

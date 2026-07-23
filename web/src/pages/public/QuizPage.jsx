import { useState } from "react";
import { Link } from "react-router-dom";
import ContentHero from "../../components/public/ContentHero.jsx";
import { fetchQuiz } from "../../data/store.js";
import { useAsync } from "../../hooks/useAsync.js";
import * as Icons from "../../components/icons.jsx";
import { Card, Button, Badge, ProgressBar, VerdictBadge, SkeletonText, cn } from "../../ui/index.js";

const OPTIONS = [
  { value: "scam", label: "Scam", tone: "scam" },
  { value: "spam", label: "Spam", tone: "spam" },
  { value: "legitimate", label: "Legitimate", tone: "legit" },
];
const LANG = { en: "English", si: "Sinhala", ta: "Tamil", mixed: "Singlish" };

export default function QuizPage() {
  const { data: quiz, loading } = useAsync(fetchQuiz, []);
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  if (loading || !quiz) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <SkeletonText lines={8} />
      </div>
    );
  }

  const q = quiz[i];
  const answered = picked != null;
  const correct = picked === q?.answer;

  const choose = (val) => {
    if (answered) return;
    setPicked(val);
    if (val === q.answer) setScore((s) => s + 1);
  };
  const next = () => {
    if (i + 1 >= quiz.length) setDone(true);
    else {
      setI((n) => n + 1);
      setPicked(null);
    }
  };
  const restart = () => {
    setI(0);
    setPicked(null);
    setScore(0);
    setDone(false);
  };

  if (done) {
    const pct = Math.round((score / quiz.length) * 100);
    const verdict = pct >= 80 ? "legitimate" : pct >= 50 ? "spam" : "scam";
    const msg = pct >= 80 ? "Scam-spotting pro!" : pct >= 50 ? "Good instincts" : "Worth brushing up";
    return (
      <div>
        <ContentHero eyebrow="Result" title="Quiz complete" icon={<Icons.IconCheckSquare className="h-3.5 w-3.5" />} />
        <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
          <Card className="p-8 text-center">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 text-3xl font-extrabold text-primary">
              {pct}%
            </div>
            <h2 className="mt-5 text-2xl font-extrabold text-foreground">{msg}</h2>
            <p className="mt-2 text-foreground-secondary">
              You got <strong className="text-foreground">{score}</strong> of {quiz.length} right.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Button onClick={restart} leftIcon={<Icons.IconRefresh className="h-4 w-4" />}>
                Try again
              </Button>
              <Button as={Link} to="/awareness" variant="secondary">
                Learn more
              </Button>
              <Button as={Link} to="/check" variant="outline">
                Check a real message
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
        eyebrow="Test yourself"
        title="Spot the scam"
        description="Can you tell a scam from spam or a genuine message? Six quick questions across languages."
        icon={<Icons.IconCheckSquare className="h-3.5 w-3.5" />}
      />
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
        <div className="mb-4 flex items-center justify-between text-sm">
          <span className="font-medium text-muted-foreground">
            Question {i + 1} of {quiz.length}
          </span>
          <span className="font-semibold text-foreground">Score: {score}</span>
        </div>
        <ProgressBar value={((i + (answered ? 1 : 0)) / quiz.length) * 100} className="mb-6" />

        <Card className="p-6">
          <div className="mb-3 flex items-center gap-2">
            <Badge tone="neutral" size="sm">{LANG[q.lang] || q.lang}</Badge>
            <span className="text-xs text-muted-foreground">Is this a scam?</span>
          </div>
          <div className="rounded-lg border border-border bg-background-secondary/50 p-4">
            <p lang={q.lang === "si" ? "si" : q.lang === "ta" ? "ta" : undefined} className="text-[15px] leading-relaxed text-foreground">
              {q.text}
            </p>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {OPTIONS.map((o) => {
              const isPicked = picked === o.value;
              const isAnswer = q.answer === o.value;
              const state = !answered
                ? "idle"
                : isAnswer
                  ? "correct"
                  : isPicked
                    ? "wrong"
                    : "muted";
              return (
                <button
                  key={o.value}
                  onClick={() => choose(o.value)}
                  disabled={answered}
                  className={cn(
                    "flex items-center justify-center gap-2 rounded-lg border-2 px-4 py-3 text-sm font-bold transition",
                    state === "idle" && "border-border hover:border-primary hover:bg-primary/5",
                    state === "correct" && "border-legit bg-legit-light text-legit",
                    state === "wrong" && "border-scam bg-scam-light text-scam",
                    state === "muted" && "border-border opacity-50",
                  )}
                >
                  {answered && isAnswer && <Icons.IconCheck className="h-4 w-4" />}
                  {answered && isPicked && !isAnswer && <Icons.IconClose className="h-4 w-4" />}
                  {o.label}
                </button>
              );
            })}
          </div>

          {answered && (
            <div className={cn("mt-5 rounded-lg border p-4 animate-fade-up", correct ? "border-legit/25 bg-legit-light" : "border-scam/25 bg-scam-light")}>
              <div className="flex items-center gap-2">
                {correct ? <Icons.IconCheckCircle className="h-5 w-5 text-legit" /> : <Icons.IconAlertCircle className="h-5 w-5 text-scam" />}
                <p className="text-sm font-bold text-foreground">{correct ? "Correct!" : "Not quite."}</p>
                <VerdictBadge verdict={q.answer} size="sm" className="ml-auto" />
              </div>
              <p className="mt-2 text-sm text-foreground-secondary">{q.explanation}</p>
              <Button onClick={next} className="mt-4" rightIcon={<Icons.IconArrowRight className="h-4 w-4" />}>
                {i + 1 >= quiz.length ? "See result" : "Next question"}
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

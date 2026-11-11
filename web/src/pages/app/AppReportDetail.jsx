import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.jsx";
import { getMyReport, REPORT_STATUS } from "../../lib/myReports.js";
import { CATEGORY_BY_SLUG } from "../../data/scamCategories.js";
import HighlightedMessage from "../../components/analyzer/HighlightedMessage.jsx";
import { Breadcrumbs, Card, Badge, Button, cn } from "../../ui/index.js";
import * as Icons from "../../components/icons.jsx";
import NotFoundPage from "../public/StatusPages.jsx";

const STEPS = ["Submitted", "Under review", "Decision"];

export default function AppReportDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const report = useMemo(() => getMyReport(user?.email, id), [user, id]);
  if (!report) return <NotFoundPage />;

  const cat = report.category ? CATEGORY_BY_SLUG[report.category] : null;
  const st = REPORT_STATUS[report.status];
  const stepIndex = report.status === "pending" ? 1 : 2;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Breadcrumbs items={[{ label: "My reports", to: "/app/reports" }, { label: report.id }]} />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="font-mono text-sm text-muted-foreground">{report.id}</span>
          <Badge tone={st.tone}>{st.label}</Badge>
        </div>
        <span className="text-sm text-muted-foreground">Submitted {new Date(report.submittedAt).toLocaleString()}</span>
      </div>

      {/* Progress */}
      <Card className="p-6">
        <ol className="flex items-center">
          {STEPS.map((s, i) => {
            const done = i <= stepIndex;
            const isRejected = report.status === "rejected" && i === 2;
            return (
              <li key={s} className={cn("flex flex-1 items-center", i === STEPS.length - 1 && "flex-none")}>
                <div className="flex flex-col items-center gap-1.5">
                  <span
                    className={cn(
                      "inline-flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold",
                      isRejected ? "bg-scam-strong text-white" : done ? "bg-legit text-legit-foreground" : "bg-background-secondary text-muted-foreground",
                    )}
                  >
                    {done ? (isRejected ? <Icons.IconClose className="h-4 w-4" /> : <Icons.IconCheck className="h-4 w-4" />) : i + 1}
                  </span>
                  <span className="text-xs font-medium text-foreground-secondary">{s}</span>
                </div>
                {i < STEPS.length - 1 && <span className={cn("mx-2 h-0.5 flex-1", i < stepIndex ? "bg-legit" : "bg-border")} />}
              </li>
            );
          })}
        </ol>
      </Card>

      <Card className="p-5">
        <h2 className="mb-3 text-card-title text-foreground">Reported message</h2>
        <div className="rounded-lg border border-border bg-background-secondary/50 p-4">
          <HighlightedMessage text={report.message} triggers={[]} verdict="scam" />
        </div>
        <dl className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-muted-foreground">Category</dt>
            <dd className="mt-0.5 font-medium text-foreground">{cat ? cat.name : "Not specified"}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Status note</dt>
            <dd className="mt-0.5 font-medium text-foreground">{report.note}</dd>
          </div>
        </dl>
      </Card>

      <div className="flex justify-between">
        <Button as={Link} to="/app/reports" variant="ghost" leftIcon={<Icons.IconArrowLeft className="h-4 w-4" />}>
          Back to reports
        </Button>
        <Button as={Link} to="/app/reports/new" variant="secondary" leftIcon={<Icons.IconPlus className="h-4 w-4" />}>
          Report another
        </Button>
      </div>
    </div>
  );
}

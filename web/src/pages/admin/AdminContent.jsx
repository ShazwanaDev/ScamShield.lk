/**
 * Content management pages — Categories, Community alerts, Awareness articles,
 * and Quiz. Grouped in one module (they share the same table-manager shape) and
 * exported individually for routing.
 */
import { useState } from "react";
import { SCAM_CATEGORIES } from "../../data/scamCategories.js";
import { ALERTS, SEVERITY, ALERT_STATUS } from "../../data/alerts.js";
import { ARTICLES } from "../../data/awareness.js";
import { QUIZ } from "../../data/quiz.js";
import { PageHeader, Card, DataTable, Badge, Button, VerdictBadge, useToast, cn } from "../../ui/index.js";
import * as Icons from "../../components/icons.jsx";

const LANG = { en: "English", si: "Sinhala", ta: "Tamil", mixed: "Singlish" };

/* ── Categories ─────────────────────────────────────────────────── */
export function AdminCategories() {
  const { toast } = useToast();
  const columns = [
    { key: "name", header: "Category", primary: true, cell: (c) => (
      <div className="flex items-center gap-3">
        <span className={cn("inline-flex h-9 w-9 items-center justify-center rounded-md", c.tone === "spam" ? "bg-spam-light text-spam" : c.tone === "scam" ? "bg-scam-light text-scam" : "bg-primary/10 text-primary")}>
          {(() => { const I = Icons[c.icon] || Icons.IconTag; return <I className="h-5 w-5" />; })()}
        </span>
        <div><p className="font-medium text-foreground">{c.name}</p><p className="text-xs text-muted-foreground">{c.slug}</p></div>
      </div>
    ) },
    { key: "tagline", header: "Description", cell: (c) => <span className="line-clamp-1 max-w-xs text-sm text-muted-foreground">{c.tagline}</span> },
    { key: "reports", header: "Reports/wk", align: "right", cell: (c) => <span className="tabular-nums">{c.stats.reportsThisWeek}</span> },
    { key: "actions", header: "", align: "right", cell: () => <Button size="icon-sm" variant="ghost" onClick={(e) => { e.stopPropagation(); toast({ tone: "info", title: "Edit category (demo)" }); }}><Icons.IconEdit className="h-4 w-4" /></Button> },
  ];
  return (
    <div className="space-y-6">
      <PageHeader title="Scam categories" description="The taxonomy used across the checker, reports, and content." icon={<Icons.IconTag className="h-5 w-5" />} actions={<Button leftIcon={<Icons.IconPlus className="h-4 w-4" />}>New category</Button>} />
      <DataTable columns={columns} rows={SCAM_CATEGORIES} />
    </div>
  );
}

/* ── Community alerts ───────────────────────────────────────────── */
export function AdminAlerts() {
  const { toast } = useToast();
  const columns = [
    { key: "title", header: "Alert", primary: true, cell: (a) => <div><p className="line-clamp-1 font-medium text-foreground">{a.title}</p><p className="text-xs text-muted-foreground">{a.id} · {a.region}</p></div> },
    { key: "severity", header: "Severity", cell: (a) => <Badge tone={SEVERITY[a.severity].tone} size="sm">{SEVERITY[a.severity].label}</Badge> },
    { key: "status", header: "Status", cell: (a) => <Badge tone={ALERT_STATUS[a.status].tone} size="sm">{ALERT_STATUS[a.status].label}</Badge> },
    { key: "reports", header: "Reports", align: "right", cell: (a) => <span className="tabular-nums">{a.reports}</span> },
    { key: "date", header: "Date", align: "right", cell: (a) => <span className="text-xs text-muted-foreground">{a.date}</span> },
    { key: "actions", header: "", align: "right", cell: () => <Button size="icon-sm" variant="ghost" onClick={(e) => { e.stopPropagation(); toast({ tone: "info", title: "Edit alert (demo)" }); }}><Icons.IconEdit className="h-4 w-4" /></Button> },
  ];
  return (
    <div className="space-y-6">
      <PageHeader title="Community alerts" description="Publish and manage scam warnings shown to users." icon={<Icons.IconMegaphone className="h-5 w-5" />} actions={<Button leftIcon={<Icons.IconPlus className="h-4 w-4" />}>New alert</Button>} />
      <DataTable columns={columns} rows={ALERTS} />
    </div>
  );
}

/* ── Awareness articles ─────────────────────────────────────────── */
export function AdminArticles() {
  const { toast } = useToast();
  const columns = [
    { key: "title", header: "Article", primary: true, cell: (a) => <div><p className="line-clamp-1 font-medium text-foreground">{a.title}</p><p className="text-xs text-muted-foreground">{a.readMins} min · {a.author}</p></div> },
    { key: "category", header: "Category", cell: (a) => <Badge tone="neutral" size="sm">{a.category}</Badge> },
    { key: "published", header: "Published", cell: (a) => <Badge tone="legit" size="sm">Live</Badge> },
    { key: "date", header: "Date", align: "right", cell: (a) => <span className="text-xs text-muted-foreground">{a.published}</span> },
    { key: "actions", header: "", align: "right", cell: () => <Button size="icon-sm" variant="ghost" onClick={(e) => { e.stopPropagation(); toast({ tone: "info", title: "Edit article (demo)" }); }}><Icons.IconEdit className="h-4 w-4" /></Button> },
  ];
  return (
    <div className="space-y-6">
      <PageHeader title="Awareness articles" description="Create and edit the awareness hub content." icon={<Icons.IconBookOpen className="h-5 w-5" />} actions={<Button leftIcon={<Icons.IconPlus className="h-4 w-4" />}>New article</Button>} />
      <DataTable columns={columns} rows={ARTICLES} />
    </div>
  );
}

/* ── Quiz ───────────────────────────────────────────────────────── */
export function AdminQuiz() {
  const { toast } = useToast();
  return (
    <div className="space-y-6">
      <PageHeader title="Quiz management" description="Questions for the scam-spotting quiz." icon={<Icons.IconCheckSquare className="h-5 w-5" />} actions={<Button leftIcon={<Icons.IconPlus className="h-4 w-4" />}>New question</Button>} />
      <div className="grid gap-4">
        {QUIZ.map((q, i) => (
          <Card key={q.id} className="p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="mb-2 flex items-center gap-2">
                  <span className="text-xs font-semibold text-muted-foreground">Q{i + 1}</span>
                  <Badge tone="neutral" size="sm">{LANG[q.lang] || q.lang}</Badge>
                  <VerdictBadge verdict={q.answer} size="sm" />
                </div>
                <p lang={q.lang === "si" ? "si" : q.lang === "ta" ? "ta" : undefined} className="text-sm text-foreground">{q.text}</p>
                <p className="mt-2 text-xs text-muted-foreground">{q.explanation}</p>
              </div>
              <Button size="icon-sm" variant="ghost" onClick={() => toast({ tone: "info", title: "Edit question (demo)" })}><Icons.IconEdit className="h-4 w-4" /></Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

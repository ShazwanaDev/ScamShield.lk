import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.jsx";
import { getHistory } from "../../lib/history.js";
import { ALERTS, SEVERITY } from "../../data/alerts.js";
import { ARTICLES } from "../../data/awareness.js";
import { resolveVerdict, VerdictBadge } from "../../ui/verdict.jsx";
import { Card, CardHeader, CardTitle, CardContent, Button, Stat, Badge, EmptyState, PageHeader, cn } from "../../ui/index.js";
import * as Icons from "../../components/icons.jsx";

function relTime(iso) {
  const d = (Date.now() - new Date(iso)) / 1000;
  if (d < 60) return "just now";
  if (d < 3600) return `${Math.floor(d / 60)}m ago`;
  if (d < 86400) return `${Math.floor(d / 3600)}h ago`;
  return `${Math.floor(d / 86400)}d ago`;
}

export default function AppDashboard() {
  const { user } = useAuth();
  const history = useMemo(() => getHistory(user?.email), [user]);

  const stats = useMemo(() => {
    const total = history.length;
    const scam = history.filter((h) => resolveVerdict(h.label, h.confidence) === "scam").length;
    const spam = history.filter((h) => resolveVerdict(h.label, h.confidence) === "spam").length;
    return { total, scam, spam, safe: total - scam - spam };
  }, [history]);

  const name = user?.email?.split("@")[0] || "there";

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome back, ${name}`}
        description="Check a message, review your history, and stay ahead of the latest scams."
        actions={
          <Button as={Link} to="/app/check" leftIcon={<Icons.IconShieldCheck className="h-5 w-5" />}>
            Check a message
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Messages checked" value={stats.total} icon={<Icons.IconShieldCheck className="h-5 w-5" />} tone="primary" />
        <Stat label="Scams caught" value={stats.scam} icon={<Icons.IconShieldAlert className="h-5 w-5" />} tone="scam" />
        <Stat label="Spam flagged" value={stats.spam} icon={<Icons.IconAlertTriangle className="h-5 w-5" />} tone="spam" />
        <Stat label="Looked legitimate" value={stats.safe < 0 ? 0 : stats.safe} icon={<Icons.IconCheckCircle className="h-5 w-5" />} tone="legit" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent checks */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent checks</CardTitle>
            <Button as={Link} to="/app/history" variant="ghost" size="sm" rightIcon={<Icons.IconArrowRight className="h-4 w-4" />}>
              View all
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            {history.length === 0 ? (
              <EmptyState
                icon={<Icons.IconHistory className="h-7 w-7" />}
                title="No checks yet"
                description="Check your first suspicious message to start building your history."
                action={
                  <Button as={Link} to="/app/check" size="sm">
                    Check a message
                  </Button>
                }
              />
            ) : (
              <ul className="divide-y divide-border">
                {history.slice(0, 5).map((h) => {
                  const verdict = resolveVerdict(h.label, h.confidence);
                  return (
                    <li key={h.id}>
                      <Link to={`/app/history/${h.id}`} className="flex items-center gap-3 px-5 py-3.5 transition hover:bg-background-secondary/60">
                        <VerdictBadge verdict={verdict} size="sm" />
                        <p className="min-w-0 flex-1 truncate text-sm text-foreground">{h.message}</p>
                        <span className="shrink-0 text-xs text-muted-foreground">{relTime(h.checked_at)}</span>
                        <Icons.IconChevronRight className="h-4 w-4 shrink-0 text-border-strong" />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Quick actions */}
        <div className="space-y-4">
          <Card className="bg-gradient-navy p-5 text-white">
            <Icons.IconShieldCheck className="h-8 w-8 text-teal-light" />
            <h3 className="mt-3 text-card-title text-white">Got a suspicious SMS?</h3>
            <p className="mt-1 text-sm text-white/70">Paste it and get an instant, explained verdict.</p>
            <Button as={Link} to="/app/check" variant="teal" fullWidth className="mt-4">
              Check now
            </Button>
          </Card>
          <Card className="p-5">
            <h3 className="text-card-title text-foreground">Report a scam</h3>
            <p className="mt-1 text-sm text-muted-foreground">Warn the community about a scam you've seen.</p>
            <Button as={Link} to="/app/reports/new" variant="secondary" fullWidth className="mt-4" leftIcon={<Icons.IconFlag className="h-4 w-4" />}>
              New report
            </Button>
          </Card>
        </div>
      </div>

      {/* Alerts + awareness */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Latest community alerts</CardTitle>
            <Button as={Link} to="/app/alerts" variant="ghost" size="sm" rightIcon={<Icons.IconArrowRight className="h-4 w-4" />}>
              All
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <ul className="divide-y divide-border">
              {ALERTS.slice(0, 3).map((a) => (
                <li key={a.id}>
                  <Link to={`/app/alerts/${a.id}`} className="flex items-start gap-3 px-5 py-3.5 transition hover:bg-background-secondary/60">
                    <Icons.IconMegaphone className="mt-0.5 h-5 w-5 shrink-0 text-scam" />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <Badge tone={SEVERITY[a.severity].tone} size="sm">{SEVERITY[a.severity].label}</Badge>
                        <span className="text-xs text-muted-foreground">{a.region}</span>
                      </div>
                      <p className="mt-1 truncate text-sm font-medium text-foreground">{a.title}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Awareness for you</CardTitle>
            <Button as={Link} to="/app/awareness" variant="ghost" size="sm" rightIcon={<Icons.IconArrowRight className="h-4 w-4" />}>
              All
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <ul className="divide-y divide-border">
              {ARTICLES.slice(0, 3).map((a) => (
                <li key={a.slug}>
                  <Link to={`/app/awareness/${a.slug}`} className="flex items-start gap-3 px-5 py-3.5 transition hover:bg-background-secondary/60">
                    <Icons.IconBookOpen className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <div className="min-w-0">
                      <span className="text-xs text-muted-foreground">{a.category} · {a.readMins} min</span>
                      <p className="mt-0.5 truncate text-sm font-medium text-foreground">{a.title}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

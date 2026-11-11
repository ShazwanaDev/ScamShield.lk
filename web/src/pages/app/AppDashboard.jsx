import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.jsx";
import { getHistory } from "../../lib/history.js";
import { ALERTS, SEVERITY } from "../../data/alerts.js";
import { ARTICLES } from "../../data/awareness.js";
import { resolveVerdict, VerdictBadge } from "../../ui/verdict.jsx";
import {
  Card,
  Button,
  Badge,
  EmptyState,
  PageHeader,
  KpiStrip,
  CellBarChart,
  WaffleChart,
  PanelHeader,
  CtaArrow,
} from "../../ui/index.js";
import * as Icons from "../../components/icons.jsx";

function relTime(iso) {
  const d = (Date.now() - new Date(iso)) / 1000;
  if (d < 60) return "just now";
  if (d < 3600) return `${Math.floor(d / 60)}m ago`;
  if (d < 86400) return `${Math.floor(d / 3600)}h ago`;
  return `${Math.floor(d / 86400)}d ago`;
}

const DAYS = 14;
const dayKey = (d) => d.toISOString().slice(0, 10);

export default function AppDashboard() {
  const { user } = useAuth();
  const history = useMemo(() => getHistory(user?.email), [user]);

  const stats = useMemo(() => {
    const by = (k) => history.filter((h) => resolveVerdict(h.label, h.confidence) === k).length;
    return { total: history.length, scam: by("scam"), spam: by("spam"), legit: by("legitimate"), low: by("low") };
  }, [history]);

  // Checks per day over the last two weeks, from this account's saved history.
  const daily = useMemo(() => {
    const counts = new Map();
    const scams = new Map();
    for (const h of history) {
      const k = dayKey(new Date(h.checked_at));
      counts.set(k, (counts.get(k) || 0) + 1);
      if (resolveVerdict(h.label, h.confidence) === "scam") scams.set(k, (scams.get(k) || 0) + 1);
    }
    const rows = Array.from({ length: DAYS }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (DAYS - 1 - i));
      const k = dayKey(d);
      const n = counts.get(k) || 0;
      const s = scams.get(k) || 0;
      return {
        key: k,
        label: d.toLocaleDateString("en-GB", { day: "numeric", month: "short" }),
        fullLabel: d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" }),
        value: n,
        display: String(n),
        caption: `${s} scam${s === 1 ? "" : "s"} caught`,
        group: i < DAYS / 2 ? 0 : 1,
      };
    });
    const total = (part) => part.reduce((a, r) => a + r.value, 0);
    return {
      rows,
      any: rows.some((r) => r.value > 0),
      groups: [
        { label: "Previous week", value: total(rows.slice(0, DAYS / 2)), caption: "checks" },
        { label: "This week", value: total(rows.slice(DAYS / 2)), caption: "checks" },
      ],
    };
  }, [history]);

  const name = user?.name || user?.email?.split("@")[0] || "there";

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome back, ${name}`}
        description="Check a message, review your history, and stay ahead of the latest scams."
        actions={
          <Button as={Link} to="/app/check" leftIcon={<Icons.IconShieldCheck className="h-4 w-4" />}>
            Check a message
          </Button>
        }
      />

      <Card className="overflow-hidden">
        <KpiStrip
          items={[
            { label: "Messages checked", value: stats.total, icon: <Icons.IconMessageSquare />, tone: "navy", caption: "saved on this device" },
            { label: "Scams caught", value: stats.scam, icon: <Icons.IconShieldAlert />, tone: "scam", caption: stats.total ? `${Math.round((stats.scam / stats.total) * 100)}% of your checks` : "none yet" },
            { label: "Spam flagged", value: stats.spam, icon: <Icons.IconAlertTriangle />, tone: "spam", caption: "promotions and bulk texts" },
            { label: "Looked legitimate", value: stats.legit, icon: <Icons.IconCheckCircle />, tone: "legit", caption: stats.low ? `${stats.low} uncertain` : "no strong scam signals" },
          ]}
        />
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <Card className="p-5 sm:p-6">
          <PanelHeader title="Your checks per day" meta={`last ${DAYS} days`} />
          {daily.any ? (
            <CellBarChart className="mt-6" title="Your checks per day" data={daily.rows} rows={8} max={Math.max(4, ...daily.rows.map((r) => r.value))} unit="checks" groups={daily.groups} xLabelEvery={2} formatValue={(v) => String(Math.round(v))} yTicks={2} />
          ) : (
            <div className="mt-6 rounded-lg border border-dashed border-white/[0.08] bg-dots">
              <EmptyState
                icon={<Icons.IconChartBar className="h-6 w-6" />}
                title="Nothing to chart yet"
                description="Each message you check adds a cell here, so you can see how often scams reach you."
                action={
                  <Button as={Link} to="/app/check" size="sm">
                    Check your first message
                  </Button>
                }
              />
            </div>
          )}
        </Card>

        <div className="space-y-6">
          <section className="relative overflow-hidden rounded-xl border border-white/[0.07] bg-gradient-navy p-5">
            <div className="absolute inset-0 bg-grain opacity-60" aria-hidden="true" />
            <div className="relative">
              <Icons.IconShieldCheck className="h-7 w-7 text-primary-soft" />
              <h3 className="mt-3 text-card-title text-foreground">Got a suspicious SMS?</h3>
              <p className="mt-1 text-sm text-foreground-secondary">Paste it and get an instant, explained verdict.</p>
              <Button as={Link} to="/app/check" variant="inverse" fullWidth className="group mt-4 pr-1.5">
                Check now
                <CtaArrow small className="ml-auto" />
              </Button>
            </div>
          </section>
          <Card className="p-5">
            <h3 className="text-card-title text-foreground">Report a scam</h3>
            <p className="mt-1 text-sm text-muted-foreground">Warn the community about a scam you've seen.</p>
            <Button as={Link} to="/app/reports/new" variant="outline" fullWidth className="mt-4" leftIcon={<Icons.IconFlag className="h-4 w-4" />}>
              New report
            </Button>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <Card className="p-5 sm:p-6">
          <PanelHeader title="Your verdict mix" meta={`${stats.total} check${stats.total === 1 ? "" : "s"}`} />
          {stats.total ? (
            <WaffleChart
              className="mt-6"
              columns={10}
              unit="checks"
              legendColumns={1}
              items={[
                { label: "Scam", value: stats.scam, color: "#FF3B30" },
                { label: "Spam", value: stats.spam, color: "#F5A524" },
                { label: "Legitimate", value: stats.legit, color: "#D4D4D8" },
                { label: "Uncertain", value: stats.low, color: "#4A4A52" },
              ]}
            />
          ) : (
            <p className="mt-6 text-sm text-muted-foreground">Your scam, spam and legitimate results will appear here as a grid, one square per check.</p>
          )}
        </Card>

        <Card className="p-5 sm:p-6">
          <PanelHeader title="Recent checks">
            <Button as={Link} to="/app/history" variant="ghost" size="sm" rightIcon={<Icons.IconArrowRight className="h-4 w-4" />}>
              View all
            </Button>
          </PanelHeader>
          {history.length === 0 ? (
            <p className="mt-6 text-sm text-muted-foreground">No checks yet. Your last five will show here.</p>
          ) : (
            <ul className="-mx-2 mt-3 divide-y divide-white/[0.05]">
              {history.slice(0, 5).map((h) => (
                <li key={h.id}>
                  <Link to={`/app/history/${h.id}`} className="flex items-center gap-3 rounded-md px-2 py-3 transition hover:bg-white/[0.03]">
                    <VerdictBadge verdict={resolveVerdict(h.label, h.confidence)} size="sm" />
                    <p className="min-w-0 flex-1 truncate text-sm text-foreground-secondary">{h.message}</p>
                    <span className="shrink-0 font-mono text-xs text-muted-foreground">{relTime(h.checked_at)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="p-5 sm:p-6">
          <PanelHeader title="Latest community alerts">
            <Button as={Link} to="/app/alerts" variant="ghost" size="sm" rightIcon={<Icons.IconArrowRight className="h-4 w-4" />}>
              All
            </Button>
          </PanelHeader>
          <ul className="-mx-2 mt-3 divide-y divide-white/[0.05]">
            {ALERTS.slice(0, 3).map((a) => (
              <li key={a.id}>
                <Link to={`/app/alerts/${a.id}`} className="flex items-start gap-3 rounded-md px-2 py-3 transition hover:bg-white/[0.03]">
                  <Icons.IconMegaphone className="mt-0.5 h-[18px] w-[18px] shrink-0 text-primary" />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <Badge tone={SEVERITY[a.severity].tone} size="sm">{SEVERITY[a.severity].label}</Badge>
                      <span className="text-xs text-muted-foreground">{a.region}</span>
                    </div>
                    <p className="mt-1 truncate text-sm text-foreground">{a.title}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-5 sm:p-6">
          <PanelHeader title="Awareness for you">
            <Button as={Link} to="/app/awareness" variant="ghost" size="sm" rightIcon={<Icons.IconArrowRight className="h-4 w-4" />}>
              All
            </Button>
          </PanelHeader>
          <ul className="-mx-2 mt-3 divide-y divide-white/[0.05]">
            {ARTICLES.slice(0, 3).map((a) => (
              <li key={a.slug}>
                <Link to={`/app/awareness/${a.slug}`} className="flex items-start gap-3 rounded-md px-2 py-3 transition hover:bg-white/[0.03]">
                  <Icons.IconBookOpen className="mt-0.5 h-[18px] w-[18px] shrink-0 text-muted-foreground" />
                  <div className="min-w-0">
                    <span className="text-xs text-muted-foreground">
                      {a.category} · {a.readMins} min
                    </span>
                    <p className="mt-0.5 truncate text-sm text-foreground">{a.title}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}

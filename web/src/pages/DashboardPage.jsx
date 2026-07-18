import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { fetchStats, ApiError } from "../lib/api.js";
import { prettyCategory } from "../lib/format.js";
import PageHeader from "../components/PageHeader.jsx";
import Card from "../components/Card.jsx";
import Button from "../components/Button.jsx";
import StatTile from "../components/StatTile.jsx";
import EmptyState from "../components/EmptyState.jsx";
import LoadingSkeleton from "../components/LoadingSkeleton.jsx";
import ErrorBanner from "../components/ErrorBanner.jsx";
import { IconFlag, IconAlertTriangle, IconChartBar, IconCpu } from "../components/icons.jsx";

const CHART_COLORS = [
  "#f4b740",
  "#e0793a",
  "#5fb3b3",
  "#8f9ff5",
  "#d98cd0",
  "#f2789a",
  "#7fc8f8",
  "#a8d5a2",
];

const tooltipStyle = {
  background: "hsl(222 40% 11%)",
  border: "1px solid hsl(217 26% 22%)",
  borderRadius: 10,
  fontSize: 12,
  color: "hsl(210 34% 96%)",
};

export default function DashboardPage() {
  // status: "loading" | "loaded" | "error" — distinct from the data itself, so a failed
  // fetch never gets confused with "still loading".
  const [status, setStatus] = useState("loading");
  const [stats, setStats] = useState(null);
  const [chartType, setChartType] = useState("bar");

  function load() {
    setStatus("loading");
    fetchStats()
      .then((data) => {
        setStats(data);
        setStatus("loaded");
      })
      .catch((err) => {
        setStats(null);
        setStatus("error");
        console.error(err instanceof ApiError ? err.message : err);
      });
  }

  useEffect(load, []);

  const breakdown = useMemo(() => {
    const raw = stats?.weekly_category_breakdown ?? [];
    return raw
      .map((c) => ({ category: c.category, label: prettyCategory(c.category), count: c.count }))
      .sort((a, b) => b.count - a.count);
  }, [stats]);

  const reportedThisWeek = breakdown.reduce((sum, c) => sum + c.count, 0);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <PageHeader
        eyebrow="Public awareness"
        title="Scam pattern trends"
        description="Live counts from community-approved reports — see what kinds of scams are circulating right now."
        icon={<IconChartBar className="h-6 w-6" />}
      />

      {status === "loading" && (
        <div className="grid gap-4 sm:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <Card key={i}>
              <LoadingSkeleton lines={2} />
            </Card>
          ))}
          <Card className="sm:col-span-3">
            <LoadingSkeleton lines={5} />
          </Card>
        </div>
      )}

      {status === "error" && (
        <ErrorBanner
          action={
            <Button size="sm" variant="secondary" onClick={load}>
              Retry
            </Button>
          }
        >
          Couldn't load the latest stats. Please try again in a moment.
        </ErrorBanner>
      )}

      {status === "loaded" && (
        <div className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-3">
            <StatTile
              label="Reported this week"
              value={reportedThisWeek.toLocaleString()}
              hint="Community-approved, last 7 days"
              tone="warning"
              icon={<IconAlertTriangle className="h-4 w-4" />}
            />
            <StatTile
              label="Community-approved reports"
              value={stats.total_community_approved_reports.toLocaleString()}
              hint="All time"
              tone="brand"
              icon={<IconFlag className="h-4 w-4" />}
            />
            <StatTile
              label="Model accuracy"
              value="N/A"
              hint="No metrics endpoint yet — see About page"
              tone="accent"
              icon={<IconCpu className="h-4 w-4" />}
            />
          </div>

          <Card>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-sm font-bold uppercase tracking-wide text-muted-foreground">
                This week's categories
              </h2>
              {breakdown.length > 0 && (
                <div className="inline-flex rounded-lg border border-border p-0.5 text-xs font-medium">
                  <button
                    type="button"
                    onClick={() => setChartType("bar")}
                    aria-pressed={chartType === "bar"}
                    className={`rounded-md px-3 py-1.5 transition-colors ${
                      chartType === "bar" ? "bg-brand text-brand-foreground" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Bar
                  </button>
                  <button
                    type="button"
                    onClick={() => setChartType("pie")}
                    aria-pressed={chartType === "pie"}
                    className={`rounded-md px-3 py-1.5 transition-colors ${
                      chartType === "pie" ? "bg-brand text-brand-foreground" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Pie
                  </button>
                </div>
              )}
            </div>

            {breakdown.length === 0 ? (
              <EmptyState
                icon={<IconAlertTriangle className="h-6 w-6" />}
                title="No approved reports yet this week"
                description="This is expected while the community dataset is still growing — check back soon, or help by reporting a scam you've seen."
                action={
                  <Link to="/report">
                    <Button size="sm">Report a scam</Button>
                  </Link>
                }
              />
            ) : (
              <div className="h-72 w-full sm:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  {chartType === "bar" ? (
                    <BarChart data={breakdown} margin={{ top: 8, right: 8, left: -16, bottom: 8 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(217 26% 18%)" vertical={false} />
                      <XAxis
                        dataKey="label"
                        tick={{ fill: "hsl(215 16% 64%)", fontSize: 11 }}
                        interval={0}
                        angle={-20}
                        textAnchor="end"
                        height={60}
                      />
                      <YAxis tick={{ fill: "hsl(215 16% 64%)", fontSize: 11 }} allowDecimals={false} />
                      <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "hsl(217 26% 15%)" }} />
                      <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                        {breakdown.map((entry, i) => (
                          <Cell key={entry.category} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  ) : (
                    <PieChart>
                      <Tooltip contentStyle={tooltipStyle} />
                      <Legend wrapperStyle={{ fontSize: 12, color: "hsl(215 16% 64%)" }} />
                      <Pie
                        data={breakdown}
                        dataKey="count"
                        nameKey="label"
                        innerRadius="45%"
                        outerRadius="80%"
                        paddingAngle={2}
                      >
                        {breakdown.map((entry, i) => (
                          <Cell key={entry.category} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                        ))}
                      </Pie>
                    </PieChart>
                  )}
                </ResponsiveContainer>
              </div>
            )}
          </Card>

          <Card>
            <h2 className="text-sm font-bold uppercase tracking-wide text-muted-foreground">
              Trending this week
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              We show category trends rather than raw message text — some reports include
              personal details the reporter typed in, and we don't publish those.
            </p>
            {breakdown.length === 0 ? (
              <p className="mt-4 text-sm text-muted-foreground">Nothing to show yet this week.</p>
            ) : (
              <ol className="mt-4 space-y-2.5">
                {breakdown.map((c, i) => (
                  <li key={c.category} className="flex items-center gap-3">
                    <span className="w-5 shrink-0 text-right text-xs font-bold text-muted-foreground">
                      {i + 1}
                    </span>
                    <span
                      aria-hidden="true"
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ background: CHART_COLORS[i % CHART_COLORS.length] }}
                    />
                    <span className="flex-1 truncate text-sm text-foreground">{c.label}</span>
                    <span className="shrink-0 text-sm font-semibold text-foreground">{c.count}</span>
                  </li>
                ))}
              </ol>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}

import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ADMIN_KPIS, TREND_90D, LANGUAGE_DIST, CATEGORY_DIST, AUDIT_LOG, SYSTEM_HEALTH } from "../../data/admin.js";
import RESULTS from "../../data/modelResults.json";
import {
  PageHeader,
  Card,
  Button,
  StatusDot,
  SegmentedControl,
  KpiStrip,
  CellBarChart,
  WaffleChart,
  CellBarRow,
  InsightPanel,
  PanelHeader,
  Avatar,
  compact,
  cn,
} from "../../ui/index.js";
import * as Icons from "../../components/icons.jsx";

const HEALTH_TONE = { operational: "online", degraded: "idle", down: "busy" };
const RANGES = [
  { value: 7, label: "Last 7 days" },
  { value: 30, label: "Last 30 days" },
  { value: 90, label: "Last 90 days" },
];

function relTime(iso) {
  const d = (Date.now() - new Date(iso)) / 1000;
  if (d < 3600) return `${Math.max(1, Math.floor(d / 60))}m`;
  if (d < 86400) return `${Math.floor(d / 3600)}h`;
  return `${Math.floor(d / 86400)}d`;
}

const sum = (rows, key) => rows.reduce((a, r) => a + r[key], 0);

export default function AdminDashboard() {
  const [range, setRange] = useState(30);
  const serving = RESULTS.models.find((m) => m.status === "serving");

  const view = useMemo(() => {
    const rows = TREND_90D.slice(-range);
    const half = Math.floor(rows.length / 2);
    const first = rows.slice(0, half);
    const second = rows.slice(half);
    const total = (r) => r.scam + r.spam + r.legit;
    const chart = rows.map((r, i) => ({
      key: r.iso,
      label: r.label,
      fullLabel: new Date(r.iso).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" }),
      value: r.scam,
      display: r.scam.toLocaleString(),
      caption: `${Math.round((r.scam / total(r)) * 100)}% of ${total(r).toLocaleString()} checks`,
      group: i < half ? 0 : 1,
    }));
    const a = sum(first, "scam");
    const b = sum(second, "scam");
    const change = a ? Math.round(((b - a) / a) * 100) : 0;
    return {
      chart,
      scams: a + b,
      checks: rows.reduce((acc, r) => acc + total(r), 0),
      groups: [
        { label: `${first[0].label} to ${first[first.length - 1].label}`, value: compact(a), caption: "scams flagged" },
        { label: `${second[0].label} to ${second[second.length - 1].label}`, value: compact(b), caption: `${change >= 0 ? "up" : "down"} ${Math.abs(change)}%` },
      ],
      change,
    };
  }, [range]);

  const topCategory = [...CATEGORY_DIST].sort((x, y) => y.value - x.value)[0];
  const flagsPerTen = Math.round((1 - serving.real.precision) * 10);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Platform report"
        description={`${RANGES.find((r) => r.value === range).label} · ${view.checks.toLocaleString()} messages checked`}
        actions={
          <>
            <SegmentedControl size="sm" options={RANGES.map((r) => ({ value: r.value, label: r.label }))} value={range} onChange={setRange} />
            <Button as={Link} to="/admin/analytics" variant="outline" size="sm" rightIcon={<Icons.IconArrowRight className="h-4 w-4" />}>
              Full analytics
            </Button>
          </>
        }
      />

      <Card className="overflow-hidden">
        <KpiStrip
          items={[
            { label: "Scams flagged", value: compact(view.scams), icon: <Icons.IconShieldAlert />, tone: "scam", caption: `in ${range} days` },
            { label: "Total classifications", value: ADMIN_KPIS.totalClassifications.toLocaleString(), icon: <Icons.IconShieldCheck />, tone: "navy", caption: "all time" },
            { label: "Pending moderation", value: ADMIN_KPIS.pendingModeration, icon: <Icons.IconInbox />, tone: "spam", caption: "community reports" },
            { label: "Scam F1 on real SMS", value: serving.real.f1.toFixed(2), icon: <Icons.IconTarget />, tone: "legit", caption: `${RESULTS.dataset.realTest} held-out messages` },
          ]}
        />
      </Card>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="space-y-6">
          <Card className="p-5 sm:p-6">
            <PanelHeader title="Scams flagged per day" meta={`${view.scams.toLocaleString()} in ${range} days`} />
            <CellBarChart
              className="mt-6"
              title="Scams flagged per day"
              data={view.chart}
              rows={range > 30 ? 10 : 14}
              unit="flagged"
              groups={view.groups}
              xLabelEvery={range === 7 ? 1 : range === 30 ? 5 : 15}
            />
          </Card>

          <Card className="p-5 sm:p-6">
            <PanelHeader title="Reports by scam type" meta="share of 100 recent reports" />
            <WaffleChart className="mt-6" items={CATEGORY_DIST.map((c) => ({ label: c.name, value: c.value, color: c.color }))} columns={10} unit="reports" />
          </Card>
        </div>

        <div className="space-y-6">
          <InsightPanel
            items={[
              {
                title: `Scam volume ${view.change >= 0 ? "rose" : "fell"} ${Math.abs(view.change)}% in the second half`,
                text: `${view.groups[0].value} flagged in the first half against ${view.groups[1].value} in the second.`,
              },
              { title: `${topCategory.name} leads the reports`, text: `${topCategory.value}% of recent community reports, ahead of every other type.` },
              {
                title: `The model catches ${Math.round(serving.real.recall * 100)}% of real scams`,
                text: `Precision is ${Math.round(serving.real.precision * 100)}%, so about ${flagsPerTen} in 10 flags on real SMS are false alarms.`,
              },
            ]}
          />

          <Card className="p-5">
            <PanelHeader title="By language" meta="share of checks" />
            <div className="mt-4 space-y-3">
              {LANGUAGE_DIST.map((l) => (
                <CellBarRow key={l.name} label={l.name} value={l.value} max={50} cells={16} tone={l.color} display={`${l.value}%`} />
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <PanelHeader title="System status" />
            <ul className="mt-4 space-y-3">
              {SYSTEM_HEALTH.map((s) => (
                <li key={s.name} className="flex items-center justify-between gap-3 text-[13px]">
                  <span className="flex items-center gap-2.5 text-foreground-secondary">
                    <StatusDot tone={HEALTH_TONE[s.status]} pulse={s.status !== "operational"} />
                    {s.name}
                  </span>
                  <span className="flex items-center gap-3">
                    <span className="font-mono text-xs text-muted-foreground">{s.latencyMs}ms</span>
                    <span className={cn("text-xs capitalize", s.status === "operational" ? "text-legit" : "text-spam")}>{s.status}</span>
                  </span>
                </li>
              ))}
            </ul>
            <Button as={Link} to="/admin/system" variant="outline" size="sm" fullWidth className="mt-5">
              View details
            </Button>
          </Card>
        </div>
      </div>

      <Card className="p-5 sm:p-6">
        <PanelHeader title="Recent admin activity">
          <Button as={Link} to="/admin/system" variant="ghost" size="sm" rightIcon={<Icons.IconArrowRight className="h-4 w-4" />}>
            Audit log
          </Button>
        </PanelHeader>
        <div className="mt-4 overflow-x-auto scrollbar-thin">
          <table className="w-full min-w-[36rem] text-[13px]">
            <thead>
              <tr className="text-left text-xs text-muted-foreground">
                <th scope="col" className="pb-3 font-normal">Actor</th>
                <th scope="col" className="pb-3 font-normal">Action</th>
                <th scope="col" className="pb-3 text-right font-normal">Log ID</th>
                <th scope="col" className="pb-3 text-right font-normal">When</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05]">
              {AUDIT_LOG.slice(0, 6).map((l) => (
                <tr key={l.id}>
                  <td className="py-3 pr-4">
                    <span className="flex items-center gap-2.5 text-foreground">
                      <Avatar name={l.actor.split("@")[0]} size="sm" />
                      {l.actor.split("@")[0]}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-foreground-secondary">{l.action}</td>
                  <td className="py-3 text-right font-mono text-muted-foreground">{l.id}</td>
                  <td className="py-3 text-right font-mono tabular-nums text-foreground">{relTime(l.at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

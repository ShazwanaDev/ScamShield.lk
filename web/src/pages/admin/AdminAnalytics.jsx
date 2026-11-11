import { useMemo, useState } from "react";
import { TREND_90D, LANGUAGE_DIST, CATEGORY_DIST, CONFIDENCE_DIST, ADMIN_KPIS } from "../../data/admin.js";
import {
  PageHeader,
  Card,
  KpiStrip,
  CellBarChart,
  WaffleChart,
  CellBarRow,
  PanelHeader,
  SegmentBar,
  SegmentedControl,
  compact,
} from "../../ui/index.js";
import * as Icons from "../../components/icons.jsx";

const SERIES = [
  { value: "scam", label: "Scam" },
  { value: "spam", label: "Spam" },
  { value: "legit", label: "Legitimate" },
];

export default function AdminAnalytics() {
  const [series, setSeries] = useState("scam");
  const total = ADMIN_KPIS.scam + ADMIN_KPIS.spam + ADMIN_KPIS.legit;
  const share = (n) => `${Math.round((n / total) * 100)}%`;
  const confidenceTotal = CONFIDENCE_DIST.reduce((a, b) => a + b.count, 0);

  const chart = useMemo(() => {
    const rows = TREND_90D.slice(-30);
    return rows.map((r, i) => {
      const all = r.scam + r.spam + r.legit;
      return {
        key: r.iso,
        label: r.label,
        fullLabel: new Date(r.iso).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" }),
        value: r[series],
        display: r[series].toLocaleString(),
        caption: `${Math.round((r[series] / all) * 100)}% of ${all.toLocaleString()} checks`,
        group: i < 15 ? 0 : 1,
      };
    });
  }, [series]);

  const label = SERIES.find((s) => s.value === series).label.toLowerCase();

  return (
    <div className="space-y-6">
      <PageHeader title="Analytics" description="Trends across classifications, languages, categories and confidence." />

      <Card className="overflow-hidden">
        <KpiStrip
          items={[
            { label: "Scam share", value: share(ADMIN_KPIS.scam), icon: <Icons.IconShieldAlert />, tone: "scam", caption: `${compact(ADMIN_KPIS.scam)} messages` },
            { label: "Spam share", value: share(ADMIN_KPIS.spam), icon: <Icons.IconAlertTriangle />, tone: "spam", caption: `${compact(ADMIN_KPIS.spam)} messages` },
            { label: "Legitimate share", value: share(ADMIN_KPIS.legit), icon: <Icons.IconCheckCircle />, tone: "legit", caption: `${compact(ADMIN_KPIS.legit)} messages` },
            { label: "User feedback", value: ADMIN_KPIS.userFeedback.toLocaleString(), icon: <Icons.IconThumbsUp />, tone: "navy", caption: "results rated by users" },
          ]}
        />
        <div className="border-t border-white/[0.06] px-5 py-4 sm:px-6">
          <SegmentBar
            height="h-2"
            segments={[
              { label: "Scam", value: ADMIN_KPIS.scam, color: "#FF3B30" },
              { label: "Spam", value: ADMIN_KPIS.spam, color: "#F5A524" },
              { label: "Legitimate", value: ADMIN_KPIS.legit, color: "#D4D4D8" },
            ]}
          />
        </div>
      </Card>

      <Card className="p-5 sm:p-6">
        <PanelHeader title={`${SERIES.find((s) => s.value === series).label} messages per day`}>
          <SegmentedControl size="sm" options={SERIES} value={series} onChange={setSeries} />
        </PanelHeader>
        <CellBarChart
          className="mt-6"
          title={`${label} messages per day`}
          data={chart}
          rows={14}
          unit={label}
          groups={[
            { label: "First 15 days", value: compact(chart.slice(0, 15).reduce((a, r) => a + r.value, 0)), caption: label },
            { label: "Last 15 days", value: compact(chart.slice(15).reduce((a, r) => a + r.value, 0)), caption: label },
          ]}
        />
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="p-5 sm:p-6">
          <PanelHeader title="By scam category" meta="share of reports" />
          <WaffleChart className="mt-6" columns={10} unit="reports" legendColumns={1} items={CATEGORY_DIST.map((c) => ({ label: c.name, value: c.value, color: c.color }))} />
        </Card>
        <Card className="p-5 sm:p-6">
          <PanelHeader title="By language" meta="share of checks" />
          <div className="mt-6 space-y-3.5">
            {LANGUAGE_DIST.map((l) => (
              <CellBarRow key={l.name} label={l.name} value={l.value} max={50} cells={24} tone={l.color} display={`${l.value}%`} />
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-5 sm:p-6">
        <PanelHeader title="Confidence distribution" meta={`${confidenceTotal.toLocaleString()} classifications`} />
        <div className="mt-6 space-y-3">
          {CONFIDENCE_DIST.map((b) => (
            <CellBarRow
              key={b.band}
              label={b.band}
              value={b.count}
              max={Math.max(...CONFIDENCE_DIST.map((x) => x.count))}
              cells={32}
              tone={b.band.startsWith("5") ? "spam" : "red"}
              display={compact(b.count)}
            />
          ))}
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          Most predictions land between 80 and 100% confidence. Results under 60% are shown to users as uncertain.
        </p>
      </Card>
    </div>
  );
}

import { TREND_14D, LANGUAGE_DIST, CATEGORY_DIST, CONFIDENCE_DIST, ADMIN_KPIS } from "../../data/admin.js";
import { TrendAreaChart, DonutChart, MiniBarChart, ChartLegend } from "../../ui/charts.jsx";
import { PageHeader, Card, CardHeader, CardTitle, CardContent, Stat, Badge } from "../../ui/index.js";
import * as Icons from "../../components/icons.jsx";

export default function AdminAnalytics() {
  const total = ADMIN_KPIS.scam + ADMIN_KPIS.spam + ADMIN_KPIS.legit;
  return (
    <div className="space-y-6">
      <PageHeader title="Analytics" description="Deeper trends across classifications, languages, categories, and confidence." icon={<Icons.IconChartBar className="h-5 w-5" />} />

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Scam share" value={`${Math.round((ADMIN_KPIS.scam / total) * 100)}%`} icon={<Icons.IconShieldAlert className="h-5 w-5" />} tone="scam" />
        <Stat label="Spam share" value={`${Math.round((ADMIN_KPIS.spam / total) * 100)}%`} icon={<Icons.IconAlertTriangle className="h-5 w-5" />} tone="spam" />
        <Stat label="Legit share" value={`${Math.round((ADMIN_KPIS.legit / total) * 100)}%`} icon={<Icons.IconCheckCircle className="h-5 w-5" />} tone="legit" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Classification volume</CardTitle>
          <Badge tone="neutral" size="sm">Last 14 days</Badge>
        </CardHeader>
        <CardContent>
          <TrendAreaChart
            data={TREND_14D}
            height={300}
            keys={[
              { dataKey: "scam", name: "Scam", color: "#D92D20" },
              { dataKey: "spam", name: "Spam", color: "#DC6803" },
              { dataKey: "legit", name: "Legit", color: "#079455" },
            ]}
          />
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>By language</CardTitle></CardHeader>
          <CardContent className="grid items-center gap-4 sm:grid-cols-2">
            <DonutChart data={LANGUAGE_DIST} />
            <ChartLegend data={LANGUAGE_DIST} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>By scam category</CardTitle></CardHeader>
          <CardContent className="grid items-center gap-4 sm:grid-cols-2">
            <DonutChart data={CATEGORY_DIST} />
            <ChartLegend data={CATEGORY_DIST} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Confidence distribution</CardTitle>
          <Badge tone="neutral" size="sm">All classifications</Badge>
        </CardHeader>
        <CardContent>
          <MiniBarChart data={CONFIDENCE_DIST} dataKey="count" labelKey="band" color="#175CD3" height={240} />
          <p className="mt-2 text-xs text-muted-foreground">Summary: most predictions land in the 80–100% band, indicating the model is decisive on the current test distribution.</p>
        </CardContent>
      </Card>
    </div>
  );
}

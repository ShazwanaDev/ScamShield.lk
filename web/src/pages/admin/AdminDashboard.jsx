import { Link } from "react-router-dom";
import {
  ADMIN_KPIS,
  TREND_14D,
  LANGUAGE_DIST,
  AUDIT_LOG,
  SYSTEM_HEALTH,
} from "../../data/admin.js";
import { TrendAreaChart, DonutChart, ChartLegend } from "../../ui/charts.jsx";
import { PageHeader, Card, CardHeader, CardTitle, CardContent, Stat, Badge, Button, StatusDot, cn } from "../../ui/index.js";
import * as Icons from "../../components/icons.jsx";

const HEALTH_TONE = { operational: "online", degraded: "idle", down: "busy" };

function relTime(iso) {
  const d = (Date.now() - new Date(iso)) / 1000;
  if (d < 3600) return `${Math.max(1, Math.floor(d / 60))}m ago`;
  if (d < 86400) return `${Math.floor(d / 3600)}h ago`;
  return `${Math.floor(d / 86400)}d ago`;
}

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Admin dashboard"
        description="Platform health, classification activity, and moderation at a glance."
        actions={
          <Button as={Link} to="/admin/analytics" variant="secondary" rightIcon={<Icons.IconArrowRight className="h-4 w-4" />}>
            Full analytics
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Total classifications" value={ADMIN_KPIS.totalClassifications.toLocaleString()} icon={<Icons.IconShieldCheck className="h-5 w-5" />} tone="primary" delta="+6.2%" hint="vs last week" />
        <Stat label="Scams detected" value={ADMIN_KPIS.scam.toLocaleString()} icon={<Icons.IconShieldAlert className="h-5 w-5" />} tone="scam" delta="+9%" hint="vs last week" />
        <Stat label="Pending moderation" value={ADMIN_KPIS.pendingModeration} icon={<Icons.IconInbox className="h-5 w-5" />} tone="spam" />
        <Stat label="Model accuracy" value={`${(ADMIN_KPIS.modelAccuracy * 100).toFixed(1)}%`} icon={<Icons.IconTarget className="h-5 w-5" />} tone="legit" delta="+0.4%" hint="TF-IDF + LogReg" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Classification trend</CardTitle>
            <Badge tone="neutral" size="sm">Last 14 days</Badge>
          </CardHeader>
          <CardContent>
            <TrendAreaChart
              data={TREND_14D}
              keys={[
                { dataKey: "scam", name: "Scam", color: "#D92D20" },
                { dataKey: "spam", name: "Spam", color: "#DC6803" },
                { dataKey: "legit", name: "Legit", color: "#079455" },
              ]}
            />
            <p className="mt-2 text-xs text-muted-foreground">
              Summary: scam volume trended up ~9% this fortnight; legitimate messages remain the largest share.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>By language</CardTitle>
          </CardHeader>
          <CardContent>
            <DonutChart data={LANGUAGE_DIST} centerValue="4" centerLabel="languages" />
            <ChartLegend data={LANGUAGE_DIST} className="mt-4" />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent admin activity</CardTitle>
            <Button as={Link} to="/admin/system" variant="ghost" size="sm">Audit log</Button>
          </CardHeader>
          <CardContent className="p-0">
            <ul className="divide-y divide-border">
              {AUDIT_LOG.slice(0, 6).map((l) => (
                <li key={l.id} className="flex items-center gap-3 px-5 py-3">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-background-secondary text-muted-foreground">
                    <Icons.IconActivity className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-foreground">{l.action}</p>
                    <p className="text-xs text-muted-foreground">{l.actor}</p>
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground">{relTime(l.at)}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {SYSTEM_HEALTH.map((s) => (
              <div key={s.name} className="flex items-center justify-between">
                <span className="flex items-center gap-2.5 text-sm text-foreground">
                  <StatusDot tone={HEALTH_TONE[s.status]} pulse={s.status !== "operational"} />
                  {s.name}
                </span>
                <span className={cn("text-xs font-medium capitalize", s.status === "operational" ? "text-legit" : "text-spam")}>{s.status}</span>
              </div>
            ))}
            <Button as={Link} to="/admin/system" variant="secondary" fullWidth className="mt-2">View details</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

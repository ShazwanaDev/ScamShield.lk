import { SYSTEM_HEALTH, AUDIT_LOG } from "../../data/admin.js";
import { PageHeader, Card, CardHeader, CardTitle, CardContent, Badge, StatusDot, DataTable, Button, cn } from "../../ui/index.js";
import * as Icons from "../../components/icons.jsx";

const HEALTH = {
  operational: { tone: "online", label: "Operational", text: "text-legit" },
  degraded: { tone: "idle", label: "Degraded", text: "text-spam" },
  down: { tone: "busy", label: "Down", text: "text-scam" },
};

function relTime(iso) {
  const d = (Date.now() - new Date(iso)) / 1000;
  if (d < 3600) return `${Math.max(1, Math.floor(d / 60))}m ago`;
  if (d < 86400) return `${Math.floor(d / 3600)}h ago`;
  return `${Math.floor(d / 86400)}d ago`;
}

export default function AdminSystem() {
  const allUp = SYSTEM_HEALTH.every((s) => s.status === "operational");

  const columns = [
    { key: "action", header: "Action", primary: true, cell: (l) => <span className="text-sm text-foreground">{l.action}</span> },
    { key: "actor", header: "Actor", cell: (l) => <span className="text-sm text-muted-foreground">{l.actor}</span> },
    { key: "target", header: "Target", cell: (l) => <Badge tone="neutral" size="sm" className="capitalize">{l.target}</Badge> },
    { key: "at", header: "When", align: "right", cell: (l) => <span className="text-xs text-muted-foreground">{relTime(l.at)}</span> },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="System health"
        description="Service status, performance, and the admin audit log."
        icon={<Icons.IconServer className="h-5 w-5" />}
        actions={<Button variant="secondary" leftIcon={<Icons.IconRefresh className="h-4 w-4" />}>Refresh</Button>}
      />

      <Card className={cn("flex items-center gap-4 p-5", allUp ? "bg-legit-light" : "bg-warning-light")}>
        <span className={cn("inline-flex h-12 w-12 items-center justify-center rounded-full", allUp ? "bg-legit text-legit-foreground" : "bg-spam text-spam-foreground")}>
          {allUp ? <Icons.IconCheckCircle className="h-6 w-6" /> : <Icons.IconAlertTriangle className="h-6 w-6" />}
        </span>
        <div>
          <p className="text-lg font-bold text-foreground">{allUp ? "All systems operational" : "Partial degradation"}</p>
          <p className="text-sm text-foreground-secondary">{allUp ? "Every service is responding normally." : "One or more services are degraded. See below."}</p>
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SYSTEM_HEALTH.map((s) => {
          const h = HEALTH[s.status];
          return (
            <Card key={s.name} className="p-5">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 font-medium text-foreground"><StatusDot tone={h.tone} pulse={s.status !== "operational"} />{s.name}</span>
                <span className={cn("text-xs font-semibold", h.text)}>{h.label}</span>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2 text-center">
                <div className="rounded-md bg-background-secondary/60 py-2"><p className="text-lg font-bold text-foreground">{s.latencyMs}<span className="text-xs font-normal text-muted-foreground">ms</span></p><p className="text-[11px] text-muted-foreground">latency</p></div>
                <div className="rounded-md bg-background-secondary/60 py-2"><p className="text-lg font-bold text-foreground">{s.uptime}</p><p className="text-[11px] text-muted-foreground">uptime</p></div>
              </div>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader><CardTitle>Audit log</CardTitle><Badge tone="neutral" size="sm">Recent admin actions</Badge></CardHeader>
        <CardContent className="p-0"><DataTable columns={columns} rows={AUDIT_LOG.slice(0, 12)} className="rounded-none border-0" /></CardContent>
      </Card>
    </div>
  );
}

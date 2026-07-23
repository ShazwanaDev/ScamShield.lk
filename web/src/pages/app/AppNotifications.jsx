import { useState } from "react";
import { Link } from "react-router-dom";
import { fetchNotifications } from "../../data/store.js";
import { useAsync } from "../../hooks/useAsync.js";
import { PageHeader, Card, Button, Badge, EmptyState, SkeletonText, cn } from "../../ui/index.js";
import * as Icons from "../../components/icons.jsx";

const TYPE_ICON = {
  alert: Icons.IconMegaphone,
  report: Icons.IconFlag,
  feedback: Icons.IconThumbsUp,
  awareness: Icons.IconBookOpen,
  system: Icons.IconSettings,
};
const TYPE_TONE = {
  alert: "text-scam bg-scam-light",
  report: "text-primary bg-primary/10",
  feedback: "text-legit bg-legit-light",
  awareness: "text-info bg-info-light",
  system: "text-muted-foreground bg-background-secondary",
};

function relTime(iso) {
  const d = (Date.now() - new Date(iso)) / 1000;
  if (d < 3600) return `${Math.max(1, Math.floor(d / 60))}m ago`;
  if (d < 86400) return `${Math.floor(d / 3600)}h ago`;
  return new Date(iso).toLocaleDateString();
}

export default function AppNotifications() {
  const { data, loading } = useAsync(fetchNotifications, []);
  const [read, setRead] = useState(() => new Set());

  const markAll = () => setRead(new Set((data || []).map((n) => n.id)));

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader
        title="Notifications"
        description="Alerts, report updates, and news relevant to you."
        icon={<Icons.IconBell className="h-5 w-5" />}
        actions={
          <Button variant="secondary" size="sm" onClick={markAll} disabled={!data?.length}>
            Mark all read
          </Button>
        }
      />

      {loading ? (
        <Card className="p-5">
          <SkeletonText lines={6} />
        </Card>
      ) : !data?.length ? (
        <Card>
          <EmptyState icon={<Icons.IconBell className="h-7 w-7" />} title="You're all caught up" description="New notifications will show here." />
        </Card>
      ) : (
        <Card className="overflow-hidden p-0">
          <ul className="divide-y divide-border">
            {data.map((n) => {
              const Icon = TYPE_ICON[n.type] || Icons.IconBell;
              const isRead = n.read || read.has(n.id);
              return (
                <li key={n.id}>
                  <Link
                    to={n.to || "#"}
                    onClick={() => setRead((s) => new Set(s).add(n.id))}
                    className={cn("flex items-start gap-3 px-5 py-4 transition hover:bg-background-secondary/50", !isRead && "bg-primary/[0.03]")}
                  >
                    <span className={cn("inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg", TYPE_TONE[n.type])}>
                      <Icon className="h-5 w-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-foreground">{n.title}</p>
                        {!isRead && <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />}
                      </div>
                      <p className="mt-0.5 text-sm text-muted-foreground">{n.body}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{relTime(n.time)}</p>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </Card>
      )}
    </div>
  );
}

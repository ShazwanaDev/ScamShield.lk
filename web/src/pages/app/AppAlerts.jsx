import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { fetchAlerts } from "../../data/store.js";
import { SEVERITY, ALERT_STATUS } from "../../data/alerts.js";
import { CATEGORY_BY_SLUG } from "../../data/scamCategories.js";
import { useAsync } from "../../hooks/useAsync.js";
import { PageHeader, Card, Badge, SegmentedControl, SkeletonCard, EmptyState, ErrorState } from "../../ui/index.js";
import * as Icons from "../../components/icons.jsx";

const FILTERS = [
  { value: "all", label: "All" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];

export default function AppAlerts() {
  const { data, loading, error, reload } = useAsync(fetchAlerts, []);
  const [filter, setFilter] = useState("all");
  const alerts = useMemo(() => (!data ? [] : filter === "all" ? data : data.filter((a) => a.severity === filter)), [data, filter]);

  return (
    <div className="space-y-6">
      <PageHeader title="Community alerts" description="Verified warnings about scams circulating right now." icon={<Icons.IconMegaphone className="h-5 w-5" />} />
      <SegmentedControl options={FILTERS} value={filter} onChange={setFilter} />

      {error ? (
        <ErrorState description="Couldn't load alerts." onRetry={reload} />
      ) : loading ? (
        <div className="grid gap-4">{Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}</div>
      ) : alerts.length === 0 ? (
        <Card><EmptyState icon={<Icons.IconMegaphone className="h-7 w-7" />} title="No alerts here" description="Try another filter." /></Card>
      ) : (
        <div className="grid gap-4">
          {alerts.map((a) => {
            const cat = CATEGORY_BY_SLUG[a.category];
            return (
              <Link key={a.id} to={`/app/alerts/${a.id}`}>
                <Card interactive className="p-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone={SEVERITY[a.severity].tone} size="sm">{SEVERITY[a.severity].label}</Badge>
                    <Badge tone={ALERT_STATUS[a.status].tone} size="sm">{ALERT_STATUS[a.status].label}</Badge>
                    {cat && <Badge tone="neutral" size="sm">{cat.name}</Badge>}
                    <span className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
                      <Icons.IconMapPin className="h-3.5 w-3.5" /> {a.region}
                    </span>
                  </div>
                  <h2 className="mt-3 text-card-title text-foreground">{a.title}</h2>
                  <p className="mt-1.5 text-sm text-foreground-secondary">{a.summary}</p>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

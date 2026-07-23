import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ContentHero from "../../components/public/ContentHero.jsx";
import { fetchAlerts } from "../../data/store.js";
import { SEVERITY, ALERT_STATUS } from "../../data/alerts.js";
import { CATEGORY_BY_SLUG } from "../../data/scamCategories.js";
import { useAsync } from "../../hooks/useAsync.js";
import * as Icons from "../../components/icons.jsx";
import { Card, Badge, SegmentedControl, SkeletonCard, EmptyState, ErrorState, cn } from "../../ui/index.js";

const FILTERS = [
  { value: "all", label: "All" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];

export default function AlertsPage() {
  const { data, loading, error, reload } = useAsync(fetchAlerts, []);
  const [filter, setFilter] = useState("all");

  const alerts = useMemo(() => {
    if (!data) return [];
    return filter === "all" ? data : data.filter((a) => a.severity === filter);
  }, [data, filter]);

  return (
    <div>
      <ContentHero
        variant="navy"
        eyebrow="Live · community-sourced"
        title="Community scam alerts"
        description="Verified warnings about scams circulating right now in Sri Lanka. Moderator-reviewed and updated as new patterns spread."
        icon={<Icons.IconMegaphone className="h-3.5 w-3.5" />}
      />

      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <SegmentedControl options={FILTERS} value={filter} onChange={setFilter} />
          <p className="text-sm text-muted-foreground">{!loading && `${alerts.length} alert${alerts.length !== 1 ? "s" : ""}`}</p>
        </div>

        {error ? (
          <ErrorState description="Couldn't load alerts." onRetry={reload} />
        ) : loading ? (
          <div className="grid gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : alerts.length === 0 ? (
          <EmptyState icon={<Icons.IconMegaphone className="h-7 w-7" />} title="No alerts in this category" description="Try a different severity filter." />
        ) : (
          <div className="grid gap-4">
            {alerts.map((a) => {
              const cat = CATEGORY_BY_SLUG[a.category];
              return (
                <Link key={a.id} to={`/alerts/${a.id}`}>
                  <Card interactive className="p-5">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge tone={SEVERITY[a.severity].tone} size="sm">
                        {SEVERITY[a.severity].label} severity
                      </Badge>
                      <Badge tone={ALERT_STATUS[a.status].tone} size="sm">
                        {ALERT_STATUS[a.status].label}
                      </Badge>
                      {cat && <Badge tone="neutral" size="sm">{cat.name}</Badge>}
                      <span className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
                        <Icons.IconMapPin className="h-3.5 w-3.5" /> {a.region}
                      </span>
                    </div>
                    <h2 className="mt-3 text-card-title text-foreground">{a.title}</h2>
                    <p className="mt-1.5 text-sm text-foreground-secondary">{a.summary}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Icons.IconFlag className="h-3.5 w-3.5" /> {a.reports} reports
                        <span className="mx-1">·</span>
                        <Icons.IconCalendar className="h-3.5 w-3.5" /> {a.date}
                      </span>
                      <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
                        Details <Icons.IconArrowRight className="h-4 w-4" />
                      </span>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.jsx";
import { getMyReports, REPORT_STATUS } from "../../lib/myReports.js";
import { CATEGORY_BY_SLUG } from "../../data/scamCategories.js";
import { PageHeader, Button, Card, Badge, SegmentedControl, EmptyState, cn } from "../../ui/index.js";
import * as Icons from "../../components/icons.jsx";

const FILTERS = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

export default function AppReports() {
  const { user } = useAuth();
  const [filter, setFilter] = useState("all");
  const reports = useMemo(() => getMyReports(user?.email), [user]);
  const shown = filter === "all" ? reports : reports.filter((r) => r.status === filter);

  return (
    <div className="space-y-6">
      <PageHeader
        title="My reports"
        description="Scam messages you've submitted for moderator review."
        icon={<Icons.IconFlag className="h-5 w-5" />}
        actions={
          <Button as={Link} to="/app/reports/new" leftIcon={<Icons.IconPlus className="h-4 w-4" />}>
            New report
          </Button>
        }
      />

      <SegmentedControl options={FILTERS} value={filter} onChange={setFilter} />

      {shown.length === 0 ? (
        <Card>
          <EmptyState
            icon={<Icons.IconFlag className="h-7 w-7" />}
            title={filter === "all" ? "No reports yet" : "Nothing here"}
            description={filter === "all" ? "Report a scam to help warn the community." : "Try a different filter."}
            action={
              filter === "all" && (
                <Button as={Link} to="/app/reports/new" size="sm">
                  New report
                </Button>
              )
            }
          />
        </Card>
      ) : (
        <div className="grid gap-4">
          {shown.map((r) => {
            const cat = r.category ? CATEGORY_BY_SLUG[r.category] : null;
            const st = REPORT_STATUS[r.status];
            return (
              <Link key={r.id} to={`/app/reports/${r.id}`}>
                <Card interactive className="p-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone={st.tone} size="sm">{st.label}</Badge>
                    {cat && <Badge tone="neutral" size="sm">{cat.name}</Badge>}
                    <span className="ml-auto font-mono text-xs text-muted-foreground">{r.id}</span>
                  </div>
                  <p className="mt-3 line-clamp-2 text-sm text-foreground">{r.message}</p>
                  <p className="mt-2 text-xs text-muted-foreground">Submitted {new Date(r.submittedAt).toLocaleDateString()}</p>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

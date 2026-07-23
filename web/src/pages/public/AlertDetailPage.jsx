import { Link, useParams } from "react-router-dom";
import ContentHero from "../../components/public/ContentHero.jsx";
import { fetchAlert } from "../../data/store.js";
import { SEVERITY, ALERT_STATUS } from "../../data/alerts.js";
import { CATEGORY_BY_SLUG } from "../../data/scamCategories.js";
import { useAsync } from "../../hooks/useAsync.js";
import HighlightedMessage from "../../components/analyzer/HighlightedMessage.jsx";
import * as Icons from "../../components/icons.jsx";
import { Card, Badge, Button, Stat, SkeletonText, cn } from "../../ui/index.js";
import NotFoundPage from "./StatusPages.jsx";

export default function AlertDetailPage() {
  const { id } = useParams();
  const { data: alert, loading } = useAsync(() => fetchAlert(id), [id]);

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        <SkeletonText lines={8} />
      </div>
    );
  }
  if (!alert) return <NotFoundPage />;

  const cat = CATEGORY_BY_SLUG[alert.category];

  return (
    <div>
      <ContentHero
        variant="navy"
        breadcrumbs={[{ label: "Community alerts", to: "/alerts" }, { label: alert.id }]}
        eyebrow={`${SEVERITY[alert.severity].label} severity · ${ALERT_STATUS[alert.status].label}`}
        title={alert.title}
        description={alert.summary}
        icon={<Icons.IconMegaphone className="h-3.5 w-3.5" />}
      />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <Card className="p-6">
              <h2 className="text-section-title text-foreground">What's happening</h2>
              <ul className="mt-4 space-y-3">
                {alert.details.map((d, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-[15px] text-foreground-secondary">
                    <Icons.IconChevronRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground" />
                    {d}
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="border-l-4 border-l-scam p-6">
              <h2 className="text-section-title text-foreground">Example of the message</h2>
              <div className="mt-4 rounded-lg bg-scam-light p-4">
                <HighlightedMessage text={alert.example} triggers={[]} verdict="scam" />
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="flex items-center gap-2 text-section-title text-foreground">
                <Icons.IconShieldCheck className="h-5 w-5 text-legit" /> How to protect yourself
              </h2>
              <ul className="mt-4 space-y-3">
                {alert.advice.map((a, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-[15px] text-foreground-secondary">
                    <Icons.IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-legit" />
                    {a}
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          <aside className="space-y-6">
            <Stat label="Reports received" value={alert.reports} icon={<Icons.IconFlag className="h-5 w-5" />} tone="scam" hint={`in ${alert.region}`} />
            <Card className="p-5">
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Severity</dt>
                  <dd><Badge tone={SEVERITY[alert.severity].tone} size="sm">{SEVERITY[alert.severity].label}</Badge></dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Status</dt>
                  <dd><Badge tone={ALERT_STATUS[alert.status].tone} size="sm">{ALERT_STATUS[alert.status].label}</Badge></dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Region</dt>
                  <dd className="font-medium text-foreground">{alert.region}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">First seen</dt>
                  <dd className="font-medium text-foreground">{alert.date}</dd>
                </div>
                {cat && (
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Type</dt>
                    <dd>
                      <Link to={`/scam-types/${cat.slug}`} className="font-semibold text-primary hover:underline">
                        {cat.name}
                      </Link>
                    </dd>
                  </div>
                )}
              </dl>
            </Card>
            <Card className="p-5">
              <h3 className="text-card-title text-foreground">Received this message?</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">Report it to strengthen the warning for others.</p>
              <Button as={Link} to="/report" fullWidth variant="danger-outline" className="mt-4" leftIcon={<Icons.IconFlag className="h-4 w-4" />}>
                Report a scam
              </Button>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
}

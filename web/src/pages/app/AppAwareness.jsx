import { Link } from "react-router-dom";
import { fetchArticles } from "../../data/store.js";
import { useAsync } from "../../hooks/useAsync.js";
import { PageHeader, Card, Badge, SkeletonCard, ErrorState, cn } from "../../ui/index.js";
import * as Icons from "../../components/icons.jsx";

const TONE = { primary: "bg-primary/10 text-primary", scam: "bg-scam-light text-scam", spam: "bg-spam-light text-spam", teal: "bg-teal/10 text-teal", info: "bg-info-light text-info" };

export default function AppAwareness() {
  const { data, loading, error, reload } = useAsync(fetchArticles, []);

  return (
    <div className="space-y-6">
      <PageHeader title="Awareness hub" description="Guides to recognising scams and protecting yourself and your family." icon={<Icons.IconBookOpen className="h-5 w-5" />} />

      {error ? (
        <ErrorState description="Couldn't load articles." onRetry={reload} />
      ) : loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}</div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {(data || []).map((a) => (
            <Link key={a.slug} to={`/app/awareness/${a.slug}`}>
              <Card interactive className="flex h-full flex-col overflow-hidden">
                <div className={cn("flex h-24 items-center justify-center", TONE[a.tone] || TONE.primary)}>
                  <Icons.IconBookOpen className="h-8 w-8 opacity-80" />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-center gap-2">
                    <Badge tone="neutral" size="sm">{a.category}</Badge>
                    <span className="text-xs text-muted-foreground">{a.readMins} min</span>
                  </div>
                  <h3 className="mt-2.5 font-bold text-foreground">{a.title}</h3>
                  <p className="mt-1.5 flex-1 line-clamp-3 text-sm text-foreground-secondary">{a.excerpt}</p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

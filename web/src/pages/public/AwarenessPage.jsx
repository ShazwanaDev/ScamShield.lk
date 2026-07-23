import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ContentHero from "../../components/public/ContentHero.jsx";
import { fetchArticles } from "../../data/store.js";
import { useAsync } from "../../hooks/useAsync.js";
import * as Icons from "../../components/icons.jsx";
import { Card, Badge, SegmentedControl, SkeletonCard, EmptyState, ErrorState, cn } from "../../ui/index.js";

const TONE = { primary: "bg-primary/10 text-primary", scam: "bg-scam-light text-scam", spam: "bg-spam-light text-spam", teal: "bg-teal/10 text-teal", info: "bg-info-light text-info" };

export default function AwarenessPage() {
  const { data, loading, error, reload } = useAsync(fetchArticles, []);
  const [cat, setCat] = useState("all");

  const categories = useMemo(() => {
    const set = ["all", ...new Set((data || []).map((a) => a.category))];
    return set.map((c) => ({ value: c, label: c === "all" ? "All" : c }));
  }, [data]);

  const articles = useMemo(() => {
    if (!data) return [];
    return cat === "all" ? data : data.filter((a) => a.category === cat);
  }, [data, cat]);

  const featured = articles[0];
  const rest = articles.slice(1);

  return (
    <div>
      <ContentHero
        eyebrow="Learn & stay safe"
        title="Awareness hub"
        description="Practical guides to recognising scams, protecting your family, and knowing what to do if you're targeted."
        icon={<Icons.IconBookOpen className="h-3.5 w-3.5" />}
      />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <SegmentedControl options={categories} value={cat} onChange={setCat} className="mb-8" />

        {error ? (
          <ErrorState description="Couldn't load articles." onRetry={reload} />
        ) : loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : articles.length === 0 ? (
          <EmptyState icon={<Icons.IconBookOpen className="h-7 w-7" />} title="No articles here yet" description="Try another category." />
        ) : (
          <div className="space-y-8">
            {featured && (
              <Link to={`/awareness/${featured.slug}`}>
                <Card interactive className="grid gap-0 overflow-hidden md:grid-cols-2">
                  <div className={cn("flex min-h-[200px] items-center justify-center p-10", TONE[featured.tone] || TONE.primary)}>
                    <Icons.IconBookOpen className="h-16 w-16 opacity-80" />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2">
                      <Badge tone="primary" size="sm">{featured.category}</Badge>
                      <span className="text-xs text-muted-foreground">{featured.readMins} min read</span>
                    </div>
                    <h2 className="mt-3 text-xl font-bold text-foreground">{featured.title}</h2>
                    <p className="mt-2 text-[15px] text-foreground-secondary">{featured.excerpt}</p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                      Read article <Icons.IconArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </Card>
              </Link>
            )}

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((a) => (
                <Link key={a.slug} to={`/awareness/${a.slug}`}>
                  <Card interactive className="flex h-full flex-col overflow-hidden">
                    <div className={cn("flex h-28 items-center justify-center", TONE[a.tone] || TONE.primary)}>
                      <Icons.IconBookOpen className="h-9 w-9 opacity-80" />
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
          </div>
        )}
      </div>
    </div>
  );
}

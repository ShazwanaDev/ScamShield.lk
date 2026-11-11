import { Link, useParams } from "react-router-dom";
import ContentHero from "../../components/public/ContentHero.jsx";
import { fetchArticle, fetchArticles } from "../../data/store.js";
import { useAsync } from "../../hooks/useAsync.js";
import * as Icons from "../../components/icons.jsx";
import { Card, Badge, Button, SkeletonText } from "../../ui/index.js";
import NotFoundPage from "./StatusPages.jsx";

export default function ArticleDetailPage() {
  const { slug } = useParams();
  const { data: article, loading } = useAsync(() => fetchArticle(slug), [slug]);
  const { data: all } = useAsync(fetchArticles, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <SkeletonText lines={10} />
      </div>
    );
  }
  if (!article) return <NotFoundPage />;

  const related = (all || []).filter((a) => a.slug !== slug).slice(0, 3);

  return (
    <div>
      <ContentHero
        breadcrumbs={[{ label: "Awareness hub", to: "/awareness" }, { label: article.category }]}
        eyebrow={article.category}
        title={article.title}
        description={article.excerpt}
      >
        <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5"><Icons.IconUser className="h-4 w-4" /> {article.author}</span>
          <span className="flex items-center gap-1.5"><Icons.IconClock className="h-4 w-4" /> {article.readMins} min read</span>
          <span className="flex items-center gap-1.5"><Icons.IconCalendar className="h-4 w-4" /> {article.published}</span>
        </div>
      </ContentHero>

      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <article className="space-y-8">
          {article.sections.map((s, i) => (
            <section key={i}>
              <h2 className="text-section-title text-foreground">{s.heading}</h2>
              {s.body?.map((p, j) => (
                <p key={j} className="mt-3 text-[15px] leading-relaxed text-foreground-secondary">{p}</p>
              ))}
              {s.list && (
                <ul className="mt-4 space-y-2.5">
                  {s.list.map((li, k) => (
                    <li key={k} className="flex items-start gap-2.5 text-[15px] text-foreground-secondary">
                      <Icons.IconCheck className="mt-1 h-4 w-4 shrink-0 text-primary" />
                      {li}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </article>

        <Card className="mt-10 flex flex-col items-center gap-4 bg-gradient-navy p-6 text-center text-white sm:flex-row sm:text-left">
          <Icons.IconShieldCheck className="h-10 w-10 shrink-0 text-teal-light" />
          <div className="flex-1">
            <h3 className="text-card-title text-white">Got a message you're unsure about?</h3>
            <p className="mt-1 text-sm text-white/70">Check it in seconds. Free and private.</p>
          </div>
          <Button as={Link} to="/check" variant="teal">Check a message</Button>
        </Card>

        {related.length > 0 && (
          <div className="mt-12">
            <h2 className="text-section-title text-foreground">Keep reading</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              {related.map((a) => (
                <Link key={a.slug} to={`/awareness/${a.slug}`}>
                  <Card interactive className="h-full p-4">
                    <Badge tone="neutral" size="sm">{a.category}</Badge>
                    <h3 className="mt-2.5 text-sm font-bold text-foreground">{a.title}</h3>
                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{a.excerpt}</p>
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

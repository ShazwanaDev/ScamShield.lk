import { Link, useParams } from "react-router-dom";
import ContentHero from "../../components/public/ContentHero.jsx";
import { getCategory, SCAM_CATEGORIES } from "../../data/scamCategories.js";
import HighlightedMessage from "../../components/analyzer/HighlightedMessage.jsx";
import * as Icons from "../../components/icons.jsx";
import { Card, Badge, Button, Stat, cn } from "../../ui/index.js";
import NotFoundPage from "./StatusPages.jsx";

export default function ScamTypeDetailPage() {
  const { slug } = useParams();
  const cat = getCategory(slug);
  if (!cat) return <NotFoundPage />;

  const Icon = Icons[cat.icon] || Icons.IconTag;
  const others = SCAM_CATEGORIES.filter((c) => c.slug !== slug && c.slug !== "other").slice(0, 3);
  const toneText = cat.tone === "spam" ? "text-spam" : "text-scam";
  const toneBg = cat.tone === "spam" ? "bg-spam-light" : "bg-scam-light";

  return (
    <div>
      <ContentHero
        variant="navy"
        breadcrumbs={[{ label: "Scam types", to: "/scam-types" }, { label: cat.name }]}
        eyebrow={cat.tone === "spam" ? "Spam pattern" : "Scam pattern"}
        title={cat.name}
        description={cat.tagline}
        icon={<Icon className="h-3.5 w-3.5" />}
        actions={
          <Button as={Link} to="/check" variant="teal" leftIcon={<Icons.IconShieldCheck className="h-5 w-5" />}>
            Check a message
          </Button>
        }
      />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <Card className="p-6">
              <h2 className="text-section-title text-foreground">What it is</h2>
              <p className="mt-2 text-[15px] leading-relaxed text-foreground-secondary">{cat.summary}</p>
            </Card>

            <Card className="p-6">
              <h2 className="text-section-title text-foreground">How it works</h2>
              <ol className="mt-4 space-y-4">
                {cat.howItWorks.map((step, i) => (
                  <li key={i} className="flex gap-4">
                    <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                      {i + 1}
                    </span>
                    <p className="pt-1 text-[15px] text-foreground-secondary">{step}</p>
                  </li>
                ))}
              </ol>
            </Card>

            <Card className={cn("border-l-4 p-6", cat.tone === "spam" ? "border-l-spam" : "border-l-scam")}>
              <h2 className="text-section-title text-foreground">Example message</h2>
              <p className="mt-1 text-sm text-muted-foreground">A representative example. Contact details and links are redacted or replaced with safe placeholders.</p>
              <div className={cn("mt-4 rounded-lg p-4", toneBg)}>
                <HighlightedMessage
                  text={cat.example.text}
                  triggers={[]}
                  verdict={cat.tone === "spam" ? "spam" : "scam"}
                />
              </div>
            </Card>

            <div className="grid gap-6 sm:grid-cols-2">
              <Card className="p-6">
                <h2 className="flex items-center gap-2 text-section-title text-foreground">
                  <Icons.IconAlertTriangle className={cn("h-5 w-5", toneText)} />
                  Red flags
                </h2>
                <ul className="mt-4 space-y-3">
                  {cat.redFlags.map((f, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-foreground-secondary">
                      <Icons.IconClose className={cn("mt-0.5 h-4 w-4 shrink-0", toneText)} />
                      {f}
                    </li>
                  ))}
                </ul>
              </Card>
              <Card className="p-6">
                <h2 className="flex items-center gap-2 text-section-title text-foreground">
                  <Icons.IconShieldCheck className="h-5 w-5 text-legit" />
                  How to stay safe
                </h2>
                <ul className="mt-4 space-y-3">
                  {cat.safetyTips.map((t, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-foreground-secondary">
                      <Icons.IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-legit" />
                      {t}
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <Stat
              label="Reports this week"
              value={cat.stats.reportsThisWeek}
              icon={<Icons.IconFlag className="h-5 w-5" />}
              tone={cat.tone === "spam" ? "spam" : "scam"}
              delta={cat.stats.trend}
              deltaTone={cat.stats.trendDir}
              hint="community reports"
            />
            <Card className="p-6">
              <h3 className="text-card-title text-foreground">Seen one of these?</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">Report it so others in the community are warned.</p>
              <Button as={Link} to="/report" fullWidth variant="danger-outline" className="mt-4" leftIcon={<Icons.IconFlag className="h-4 w-4" />}>
                Report a scam
              </Button>
            </Card>
            <Card className="p-6">
              <h3 className="text-card-title text-foreground">Other scam types</h3>
              <ul className="mt-3 space-y-1">
                {others.map((o) => {
                  const OIcon = Icons[o.icon] || Icons.IconTag;
                  return (
                    <li key={o.slug}>
                      <Link
                        to={`/scam-types/${o.slug}`}
                        className="flex items-center gap-3 rounded-md px-2 py-2 text-sm text-foreground-secondary transition hover:bg-background-secondary hover:text-foreground"
                      >
                        <OIcon className="h-4 w-4 text-muted-foreground" />
                        {o.name}
                        <Icons.IconChevronRight className="ml-auto h-4 w-4 text-border-strong" />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
}

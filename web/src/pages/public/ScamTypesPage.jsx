import { Link } from "react-router-dom";
import ContentHero from "../../components/public/ContentHero.jsx";
import { SCAM_CATEGORIES } from "../../data/scamCategories.js";
import * as Icons from "../../components/icons.jsx";
import { Card, Badge, Button, cn } from "../../ui/index.js";

const toneClass = (t) =>
  t === "scam" ? "bg-scam-light text-scam" : t === "spam" ? "bg-spam-light text-spam" : "bg-primary/10 text-primary";

export default function ScamTypesPage() {
  return (
    <div>
      <ContentHero
        eyebrow="Know the threats"
        title="Scam types in Sri Lanka"
        description="The scams that circulate most by SMS: how each one works, the red flags, and how to stay safe."
        icon={<Icons.IconShieldAlert className="h-3.5 w-3.5" />}
      />
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SCAM_CATEGORIES.map((c) => {
            const Icon = Icons[c.icon] || Icons.IconTag;
            return (
              <Link key={c.slug} to={`/scam-types/${c.slug}`}>
                <Card interactive className="flex h-full flex-col p-5">
                  <div className="flex items-start justify-between gap-3">
                    <span className={cn("inline-flex h-12 w-12 items-center justify-center rounded-lg", toneClass(c.tone))}>
                      <Icon className="h-6 w-6" />
                    </span>
                    <Badge tone={c.stats.trendDir === "up" ? "scam" : "legit"} size="sm">
                      {c.stats.trend} this week
                    </Badge>
                  </div>
                  <h2 className="mt-4 text-card-title text-foreground">{c.name}</h2>
                  <p className="mt-1.5 flex-1 text-sm text-foreground-secondary">{c.summary}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                    Learn more <Icons.IconArrowRight className="h-4 w-4" />
                  </span>
                </Card>
              </Link>
            );
          })}
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 rounded-xl border border-border bg-surface p-6 text-center sm:flex-row sm:text-left">
          <div>
            <h3 className="text-card-title text-foreground">Not sure which type a message is?</h3>
            <p className="mt-1 text-sm text-muted-foreground">Paste it into the checker and we'll identify the pattern for you.</p>
          </div>
          <Button as={Link} to="/check" leftIcon={<Icons.IconShieldCheck className="h-5 w-5" />}>
            Check a message
          </Button>
        </div>
      </div>
    </div>
  );
}

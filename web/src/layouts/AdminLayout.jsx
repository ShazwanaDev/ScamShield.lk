import { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import PortalSidebar, { SidebarCard } from "../components/nav/PortalSidebar.jsx";
import PortalTopbar from "../components/nav/PortalTopbar.jsx";
import { ADMIN_NAV } from "../components/nav/navConfig.jsx";
import RESULTS from "../data/modelResults.json";
import { Button, CellMeter } from "../ui/index.js";

export default function AdminLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const serving = RESULTS.models.find((m) => m.status === "serving");

  return (
    <div className="min-h-screen bg-background">
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <PortalSidebar
        nav={ADMIN_NAV}
        brandTo="/admin"
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        footer={
          serving && (
            <SidebarCard
              eyebrow="Serving model"
              figure={serving.real.f1.toFixed(2)}
              suffix={`F1 on ${RESULTS.dataset.realTest} real SMS`}
              meter={<CellMeter value={Math.round(serving.real.f1 * 100)} max={100} cells={20} tone="red" label="Scam F1 on real messages, out of 1" />}
              note={serving.name}
              action={
                <Button as={Link} to="/admin/models" variant="outline" size="sm" fullWidth onClick={() => setMenuOpen(false)}>
                  View models
                </Button>
              }
            />
          )
        }
      />

      <div className="lg:pl-64">
        <PortalTopbar onMenu={() => setMenuOpen(true)} variant="admin" searchPlaceholder="Search records, users…" />
        <main id="main" className="mx-auto max-w-[100rem] px-4 pb-12 pt-6 sm:px-6 lg:px-8">
          <p role="note" className="mb-6 flex items-start gap-2.5 rounded-lg border border-spam/20 bg-spam/[0.05] px-3.5 py-2.5 text-xs leading-relaxed text-foreground-secondary">
            <span className="mt-0.5 h-2 w-2 shrink-0 rounded-[2px] bg-spam" aria-hidden="true" />
            <span>
              <span className="font-medium text-foreground">Demo data.</span> Most of the admin backend isn't built yet, so the figures,
              users, tickets and Scam reports page here are sample data. These parts are real: the moderation queue, the model
              results on the Models and Evaluation pages, and the dataset counts.
            </span>
          </p>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

import { useState } from "react";
import { Outlet } from "react-router-dom";
import PortalSidebar from "../components/nav/PortalSidebar.jsx";
import PortalTopbar from "../components/nav/PortalTopbar.jsx";
import { ADMIN_NAV } from "../components/nav/navConfig.jsx";
import { Badge } from "../ui/index.js";

export default function AdminLayout() {
  const [menuOpen, setMenuOpen] = useState(false);

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
          <div className="flex items-center justify-between rounded-md bg-white/5 px-3 py-2.5 text-xs text-white/60">
            <span>Admin console</span>
            <Badge tone="teal" size="sm">
              v0.1
            </Badge>
          </div>
        }
      />

      <div className="lg:pl-64">
        <PortalTopbar onMenu={() => setMenuOpen(true)} variant="admin" searchPlaceholder="Search records, users…" />
        <main id="main" className="mx-auto max-w-[100rem] px-4 pb-12 pt-6 sm:px-6 lg:px-8">
          <p role="note" className="mb-5 flex items-start gap-2 rounded-md border border-spam/30 bg-spam/10 px-3 py-2 text-xs text-foreground">
            <Badge tone="spam" size="sm" className="shrink-0">Demo data</Badge>
            <span>
              The admin backend isn't built yet, so most figures, users, reports and tickets here are sample data. The model
              results on the Models and Evaluation pages, and the dataset counts, are real.
            </span>
          </p>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

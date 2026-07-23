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
          <Outlet />
        </main>
      </div>
    </div>
  );
}

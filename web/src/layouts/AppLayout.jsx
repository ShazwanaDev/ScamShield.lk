import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import PortalSidebar from "../components/nav/PortalSidebar.jsx";
import PortalTopbar from "../components/nav/PortalTopbar.jsx";
import { APP_NAV } from "../components/nav/navConfig.jsx";
import { cn } from "../ui/cn.js";
import { IconHome, IconShieldCheck, IconHistory, IconMegaphone, IconUser } from "../components/icons.jsx";

const BOTTOM = [
  { to: "/app", label: "Home", icon: IconHome, end: true },
  { to: "/app/check", label: "Check", icon: IconShieldCheck },
  { to: "/app/history", label: "History", icon: IconHistory },
  { to: "/app/alerts", label: "Alerts", icon: IconMegaphone },
  { to: "/app/profile", label: "Profile", icon: IconUser },
];

export default function AppLayout() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <PortalSidebar nav={APP_NAV} brandTo="/app" open={menuOpen} onClose={() => setMenuOpen(false)} />

      <div className="lg:pl-64">
        <PortalTopbar onMenu={() => setMenuOpen(true)} variant="app" searchPlaceholder="Search history, reports…" />
        <main id="main" className="mx-auto max-w-6xl px-4 pb-24 pt-6 sm:px-6 lg:px-8 lg:pb-10">
          <Outlet />
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav
        className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-border bg-surface/95 backdrop-blur lg:hidden"
        aria-label="Bottom"
      >
        {BOTTOM.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition",
                  isActive ? "text-primary" : "text-muted-foreground",
                )
              }
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}

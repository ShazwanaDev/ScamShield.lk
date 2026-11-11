import { useMemo, useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import PortalSidebar, { SidebarCard } from "../components/nav/PortalSidebar.jsx";
import PortalTopbar from "../components/nav/PortalTopbar.jsx";
import { APP_NAV } from "../components/nav/navConfig.jsx";
import { useAuth } from "../hooks/useAuth.jsx";
import { getHistory } from "../lib/history.js";
import { resolveVerdict } from "../ui/verdict.jsx";
import { Button, SegmentBar, cn } from "../ui/index.js";
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
  const { user } = useAuth();

  // The user's own verdict mix, from the checks saved on this device.
  const mix = useMemo(() => {
    const history = getHistory(user?.email);
    const count = (k) => history.filter((h) => resolveVerdict(h.label, h.confidence) === k).length;
    return { total: history.length, scam: count("scam"), spam: count("spam"), legit: count("legitimate"), low: count("low") };
  }, [user]);

  return (
    <div className="min-h-screen bg-background">
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <PortalSidebar
        nav={APP_NAV}
        brandTo="/app"
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        footer={
          <SidebarCard
            eyebrow="Your checks"
            figure={mix.total}
            suffix={mix.total === 1 ? "message checked" : "messages checked"}
            meter={
              <SegmentBar
                segments={[
                  { label: "Scam", value: mix.scam, color: "#FF3B30" },
                  { label: "Spam", value: mix.spam, color: "#F5A524" },
                  { label: "Legitimate", value: mix.legit, color: "#D4D4D8" },
                  { label: "Uncertain", value: mix.low, color: "#4A4A52" },
                ]}
              />
            }
            note={mix.total ? `${mix.scam} scam${mix.scam === 1 ? "" : "s"} caught so far` : "Check a message to start your record"}
            action={
              <Button as={Link} to="/app/check" variant="outline" size="sm" fullWidth onClick={() => setMenuOpen(false)}>
                Check a message
              </Button>
            }
          />
        }
      />

      <div className="lg:pl-64">
        <PortalTopbar onMenu={() => setMenuOpen(true)} variant="app" searchPlaceholder="Search history, reports…" />
        <main id="main" className="mx-auto max-w-6xl px-4 pb-28 pt-6 sm:px-6 lg:px-8 lg:pb-12">
          <Outlet />
        </main>
      </div>

      {/* Mobile bottom nav: floating pill */}
      <nav
        className="fixed inset-x-3 bottom-3 z-30 grid grid-cols-5 rounded-2xl border border-white/[0.08] bg-[#141417]/90 p-1 shadow-xl backdrop-blur-xl lg:hidden"
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
                  "flex flex-col items-center gap-1 rounded-xl py-2 text-[11px] transition",
                  isActive ? "bg-white/[0.07] text-foreground" : "text-muted-foreground hover:text-foreground",
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={cn("h-5 w-5", isActive && "text-primary")} />
                  {item.label}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}

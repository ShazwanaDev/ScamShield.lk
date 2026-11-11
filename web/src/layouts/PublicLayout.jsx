import { Outlet, useLocation } from "react-router-dom";
import PublicNav from "../components/nav/PublicNav.jsx";
import SiteFooter from "../components/nav/SiteFooter.jsx";
import { cn } from "../ui/cn.js";

export default function PublicLayout() {
  const { pathname } = useLocation();
  // The landing hero runs underneath the floating header and its closing glow
  // runs into the footer.
  const isHome = pathname === "/";

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <PublicNav overlay={isHome} />
      <main id="main" className={cn("flex-1", !isHome && "pt-16")}>
        <Outlet />
      </main>
      <SiteFooter glow={isHome} />
    </div>
  );
}

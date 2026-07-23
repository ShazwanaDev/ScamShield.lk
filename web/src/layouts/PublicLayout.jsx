import { Outlet } from "react-router-dom";
import PublicNav from "../components/nav/PublicNav.jsx";
import SiteFooter from "../components/nav/SiteFooter.jsx";

export default function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <PublicNav />
      <main id="main" className="flex-1">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  );
}

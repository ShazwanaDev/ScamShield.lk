import { Link, useLocation, useNavigate } from "react-router-dom";
import { Avatar, DropdownMenu, DropdownItem, IconButton, SearchInput } from "../../ui/index.js";
import { useAuth } from "../../hooks/useAuth.jsx";
import { APP_NAV, ADMIN_NAV } from "./navConfig.jsx";
import { IconMenu, IconBell, IconUser, IconSettings, IconLogout, IconLifeBuoy } from "../icons.jsx";

/** Find the nav label for the current path (longest matching prefix wins). */
function currentLabel(nav, pathname) {
  let best = null;
  for (const group of nav) {
    for (const item of group.items) {
      const match = item.end ? pathname === item.to : pathname === item.to || pathname.startsWith(`${item.to}/`);
      if (match && (!best || item.to.length > best.to.length)) best = item;
    }
  }
  return best?.label;
}

/**
 * Shared portal topbar: breadcrumb on the left, search, notifications and the
 * account menu on the right. `variant` = "app" | "admin".
 */
export default function PortalTopbar({ onMenu, variant = "app", notifCount = 0, searchPlaceholder = "Search…" }) {
  const { user, logout, adminLogout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const base = variant === "admin" ? "/admin" : "/app";
  const page = currentLabel(variant === "admin" ? ADMIN_NAV : APP_NAV, pathname);

  const onSignOut = () => {
    if (variant === "admin") {
      adminLogout();
      navigate("/admin/login");
    } else {
      logout();
      navigate("/");
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-white/[0.06] bg-background/80 px-4 backdrop-blur-xl sm:px-6">
      <button
        onClick={onMenu}
        className="inline-flex h-10 w-10 items-center justify-center rounded-md text-foreground hover:bg-white/[0.06] lg:hidden"
        aria-label="Open menu"
      >
        <IconMenu className="h-6 w-6" />
      </button>

      <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-2 text-[13.5px]">
        <span className="hidden items-center gap-2 sm:inline-flex">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-[6px] bg-white/[0.06] font-mono text-[11px] text-foreground ring-1 ring-inset ring-white/10">
            {variant === "admin" ? "A" : "S"}
          </span>
          <span className="text-foreground">{variant === "admin" ? "Admin console" : "ScamShield"}</span>
          {variant === "admin" && (
            <span className="inline-flex items-center gap-1.5 rounded-[5px] px-1.5 py-0.5 font-mono text-[10.5px] text-spam ring-1 ring-inset ring-spam/30">
              <span className="h-1.5 w-1.5 rounded-[1px] bg-spam" />
              Demo data
            </span>
          )}
          <span className="text-muted-foreground/60" aria-hidden="true">/</span>
        </span>
        <span className="truncate font-medium text-foreground" aria-current="page">
          {page ?? (variant === "admin" ? "Admin" : "Dashboard")}
        </span>
      </nav>

      <div className="ml-auto hidden w-full max-w-[16rem] md:block">
        <SearchInput size="sm" placeholder={searchPlaceholder} aria-label="Search" />
      </div>

      <div className="ml-auto flex items-center gap-1 md:ml-2">
        <div className="relative">
          <IconButton as={Link} to={`${base}/notifications`} label="Notifications" variant="ghost">
            <IconBell className="h-5 w-5" />
          </IconButton>
          {notifCount > 0 && (
            <span className="absolute right-1.5 top-1.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-scam-strong px-1 text-[10px] font-bold text-white">
              {notifCount > 9 ? "9+" : notifCount}
            </span>
          )}
        </div>

        <DropdownMenu
          trigger={
            <button className="flex items-center gap-2 rounded-lg p-1 pr-2 transition hover:bg-white/[0.05]" aria-label="Account menu">
              <Avatar name={variant === "admin" ? "Admin" : user?.name || user?.email || "Guest"} size="sm" />
              <span className="hidden max-w-[12rem] truncate text-[13.5px] text-foreground sm:block">
                {variant === "admin" ? "Admin" : (user?.name || user?.email?.split("@")[0] || "Account")}
              </span>
            </button>
          }
        >
          <div className="border-b border-white/[0.06] px-3.5 py-2.5">
            <p className="truncate text-sm font-medium text-foreground">{variant === "admin" ? "Administrator" : user?.name || user?.email || "Guest user"}</p>
            {variant === "app" && user?.name && <p className="truncate text-xs text-muted-foreground">{user.email}</p>}
            <p className="text-xs text-muted-foreground">{variant === "admin" ? "Admin console" : "ScamShield LK"}</p>
          </div>
          {variant === "app" && (
            <>
              <DropdownItem as="button" icon={<IconUser className="h-4 w-4" />} onClick={() => navigate("/app/profile")}>
                Profile
              </DropdownItem>
              <DropdownItem icon={<IconSettings className="h-4 w-4" />} onClick={() => navigate("/app/settings")}>
                Settings
              </DropdownItem>
              <DropdownItem icon={<IconLifeBuoy className="h-4 w-4" />} onClick={() => navigate("/help")}>
                Help centre
              </DropdownItem>
            </>
          )}
          {variant === "admin" && (
            <DropdownItem icon={<IconSettings className="h-4 w-4" />} onClick={() => navigate("/admin/settings")}>
              Settings
            </DropdownItem>
          )}
          <div className="my-1 border-t border-white/[0.06]" />
          <DropdownItem icon={<IconLogout className="h-4 w-4" />} danger onClick={onSignOut}>
            Sign out
          </DropdownItem>
        </DropdownMenu>
      </div>
    </header>
  );
}

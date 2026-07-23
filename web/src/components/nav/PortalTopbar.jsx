import { Link, useNavigate } from "react-router-dom";
import { Avatar, DropdownMenu, DropdownItem, IconButton, SearchInput, cn } from "../../ui/index.js";
import { useAuth } from "../../hooks/useAuth.jsx";
import { IconMenu, IconBell, IconUser, IconSettings, IconLogout, IconLifeBuoy } from "../icons.jsx";

/**
 * Shared portal topbar. `variant` = "app" | "admin" changes the profile menu
 * links and the notifications target.
 */
export default function PortalTopbar({ onMenu, title, variant = "app", notifCount = 0, searchPlaceholder = "Search…" }) {
  const { user, logout, adminLogout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const base = variant === "admin" ? "/admin" : "/app";

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
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-surface/90 px-4 backdrop-blur sm:px-6">
      <button
        onClick={onMenu}
        className="inline-flex h-10 w-10 items-center justify-center rounded-md text-foreground hover:bg-background-secondary lg:hidden"
        aria-label="Open menu"
      >
        <IconMenu className="h-6 w-6" />
      </button>

      {title && <h1 className="truncate text-base font-bold text-foreground lg:hidden">{title}</h1>}

      <div className="ml-auto hidden max-w-xs flex-1 md:block">
        <SearchInput size="sm" placeholder={searchPlaceholder} aria-label="Search" />
      </div>

      <div className="ml-auto flex items-center gap-1.5 md:ml-3">
        <div className="relative">
          <IconButton as={Link} to={`${base}/notifications`} label="Notifications" variant="ghost">
            <IconBell className="h-5 w-5" />
          </IconButton>
          {notifCount > 0 && (
            <span className="absolute right-1.5 top-1.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-scam px-1 text-[10px] font-bold text-white">
              {notifCount > 9 ? "9+" : notifCount}
            </span>
          )}
        </div>

        <DropdownMenu
          trigger={
            <button className="flex items-center gap-2 rounded-full p-0.5 pr-2 transition hover:bg-background-secondary" aria-label="Account menu">
              <Avatar name={user?.email || (isAdmin ? "Admin" : "Guest")} size="sm" />
              <span className="hidden text-sm font-medium text-foreground sm:block">
                {variant === "admin" ? "Admin" : (user?.email?.split("@")[0] ?? "Account")}
              </span>
            </button>
          }
        >
          <div className="border-b border-border px-3.5 py-2.5">
            <p className="truncate text-sm font-semibold text-foreground">{user?.email || (variant === "admin" ? "Administrator" : "Guest user")}</p>
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
          <div className="my-1 border-t border-border" />
          <DropdownItem icon={<IconLogout className="h-4 w-4" />} danger onClick={onSignOut}>
            Sign out
          </DropdownItem>
        </DropdownMenu>
      </div>
    </header>
  );
}

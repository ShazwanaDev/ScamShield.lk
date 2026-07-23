import { Link } from "react-router-dom";
import { Button, cn } from "../../ui/index.js";
import * as Icons from "../../components/icons.jsx";

function StatusScreen({ code, icon, tone = "primary", title, description, actions }) {
  const tones = {
    primary: "bg-primary/10 text-primary",
    scam: "bg-scam-light text-scam",
    spam: "bg-spam-light text-spam",
    navy: "bg-navy/10 text-navy",
  };
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-16">
      <div className="mx-auto max-w-md text-center">
        <span className={cn("inline-flex h-16 w-16 items-center justify-center rounded-2xl", tones[tone])}>{icon}</span>
        {code && <p className="mt-6 text-sm font-bold uppercase tracking-widest text-muted-foreground">Error {code}</p>}
        <h1 className="mt-2 text-3xl font-extrabold text-foreground">{title}</h1>
        <p className="mt-3 text-foreground-secondary">{description}</p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">{actions}</div>
      </div>
    </div>
  );
}

/** 404 — default export so it can double as the router catch-all. */
export default function NotFoundPage() {
  return (
    <StatusScreen
      code="404"
      tone="primary"
      icon={<Icons.IconSearch className="h-8 w-8" />}
      title="Page not found"
      description="The page you're looking for doesn't exist or may have moved."
      actions={
        <>
          <Button as={Link} to="/" leftIcon={<Icons.IconHome className="h-4 w-4" />}>
            Back home
          </Button>
          <Button as={Link} to="/check" variant="secondary">
            Check a message
          </Button>
        </>
      }
    />
  );
}

export function ServerErrorPage() {
  return (
    <StatusScreen
      code="500"
      tone="scam"
      icon={<Icons.IconServer className="h-8 w-8" />}
      title="Something went wrong on our end"
      description="An unexpected error occurred. Please try again in a moment — if it keeps happening, let us know."
      actions={
        <>
          <Button onClick={() => window.location.reload()} leftIcon={<Icons.IconRefresh className="h-4 w-4" />}>
            Reload
          </Button>
          <Button as={Link} to="/contact" variant="secondary">
            Contact support
          </Button>
        </>
      }
    />
  );
}

export function MaintenancePage() {
  return (
    <StatusScreen
      tone="spam"
      icon={<Icons.IconSettings className="h-8 w-8" />}
      title="Down for maintenance"
      description="ScamShield LK is briefly offline for an upgrade. We'll be back shortly — thanks for your patience."
      actions={
        <Button onClick={() => window.location.reload()} leftIcon={<Icons.IconRefresh className="h-4 w-4" />}>
          Try again
        </Button>
      }
    />
  );
}

export function OfflinePage() {
  return (
    <StatusScreen
      tone="navy"
      icon={<Icons.IconWifiOff className="h-8 w-8" />}
      title="You're offline"
      description="We can't reach the network right now. On the mobile app, checks still work offline with the on-device model."
      actions={
        <Button onClick={() => window.location.reload()} leftIcon={<Icons.IconRefresh className="h-4 w-4" />}>
          Retry
        </Button>
      }
    />
  );
}

export function AccessDeniedPage() {
  return (
    <StatusScreen
      code="403"
      tone="scam"
      icon={<Icons.IconLock className="h-8 w-8" />}
      title="Access denied"
      description="You don't have permission to view this page. If you think this is a mistake, contact an administrator."
      actions={
        <Button as={Link} to="/" leftIcon={<Icons.IconHome className="h-4 w-4" />}>
          Back home
        </Button>
      }
    />
  );
}

export function SessionExpiredPage() {
  return (
    <StatusScreen
      tone="navy"
      icon={<Icons.IconClock className="h-8 w-8" />}
      title="Your session expired"
      description="For your security, you've been signed out after a period of inactivity. Please sign in again to continue."
      actions={
        <Button as={Link} to="/login" leftIcon={<Icons.IconLogIn className="h-4 w-4" />}>
          Sign in again
        </Button>
      }
    />
  );
}

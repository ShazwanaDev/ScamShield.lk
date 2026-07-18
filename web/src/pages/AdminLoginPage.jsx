import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.jsx";
import Card from "../components/Card.jsx";
import Button from "../components/Button.jsx";
import ErrorBanner from "../components/ErrorBanner.jsx";
import { IconLock } from "../components/icons.jsx";

export default function AdminLoginPage() {
  const { adminLogin, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname ?? "/admin/moderate";

  const [passphrase, setPassphrase] = useState("");
  const [wrong, setWrong] = useState(false);
  const notConfigured = !import.meta.env.VITE_ADMIN_PASSPHRASE;

  if (isAdmin) {
    return <Navigate to={from} replace />;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const result = adminLogin(passphrase);
    if (result.ok) {
      navigate(from, { replace: true });
    } else {
      setWrong(true);
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-4 py-12 sm:px-6">
      <Card as="form" onSubmit={handleSubmit} noValidate className="space-y-5 text-center">
        <div>
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-brand/10 text-brand">
            <IconLock className="h-6 w-6" />
          </div>
          <h1 className="mt-3 text-xl font-black">Moderator access</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            This is a lightweight demo gate only — enter the passphrase to continue.
          </p>
        </div>

        {notConfigured ? (
          <ErrorBanner>
            No admin passphrase is configured. Set{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">VITE_ADMIN_PASSPHRASE</code> in{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">web/.env</code> to enable this page.
          </ErrorBanner>
        ) : (
          <>
            <input
              type="password"
              value={passphrase}
              onChange={(e) => {
                setPassphrase(e.target.value);
                setWrong(false);
              }}
              placeholder="Passphrase"
              autoFocus
              aria-label="Moderator passphrase"
              className="w-full rounded-xl border border-border bg-card p-3 text-center text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            {wrong && (
              <p role="alert" className="text-sm text-danger">
                Incorrect passphrase.
              </p>
            )}
            <Button type="submit" className="w-full" disabled={!passphrase}>
              Unlock
            </Button>
          </>
        )}
      </Card>
    </div>
  );
}

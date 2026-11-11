import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.jsx";
import { ApiError } from "../../lib/api.js";
import Brand from "../../components/Brand.jsx";
import { Button, Field, Input, Alert } from "../../ui/index.js";
import { IconLock, IconShieldCheck, IconKey } from "../../components/icons.jsx";

function messageFor(err) {
  if (!(err instanceof ApiError)) return "Something went wrong. Please try again.";
  if (err.status === 401) return "Incorrect passphrase.";
  if (err.status === 503) return "Admin sign-in isn't set up on the server yet. Set ADMIN_PASSWORD in the backend's environment.";
  return err.message; // 429 (too many tries) and network errors already read well
}

export default function AdminLogin() {
  const { adminLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [passphrase, setPassphrase] = useState("");
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await adminLogin(passphrase);
      navigate(location.state?.from?.pathname || "/admin", { replace: true });
    } catch (err) {
      setError(messageFor(err));
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-navy px-4">
      <div className="absolute inset-0 bg-grid opacity-40" aria-hidden="true" />
      <div className="relative w-full max-w-sm">
        <div className="mb-6 flex justify-center">
          <Brand to="/" tone="dark" />
        </div>
        <div className="rounded-xl border border-white/10 bg-surface p-6 shadow-xl sm:p-8">
          <div className="mb-6 flex items-center gap-3">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-white/[0.06] text-primary ring-1 ring-inset ring-white/10">
              <IconShieldCheck className="h-6 w-6" />
            </span>
            <div>
              <h1 className="text-lg font-bold text-foreground">Admin console</h1>
              <p className="text-sm text-muted-foreground">Restricted access</p>
            </div>
          </div>

          <form onSubmit={submit} className="space-y-4">
            {error && <Alert tone="error">{error}</Alert>}
            <Field label="Admin passphrase" required>
              <Input
                type="password"
                autoComplete="current-password"
                value={passphrase}
                onChange={(e) => setPassphrase(e.target.value)}
                placeholder="Enter passphrase"
                leftIcon={<IconLock className="h-4 w-4" />}
                autoFocus
                required
                disabled={busy}
              />
            </Field>
            <Button type="submit" size="lg" fullWidth loading={busy} leftIcon={<IconKey className="h-5 w-5" />}>
              Sign in
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              The passphrase is checked by the server. Sessions end after 8 hours or when you close the tab.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

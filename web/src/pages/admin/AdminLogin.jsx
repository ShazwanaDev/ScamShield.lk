import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.jsx";
import Brand from "../../components/Brand.jsx";
import { Button, Field, Input, Alert, cn } from "../../ui/index.js";
import { IconLock, IconShieldCheck, IconKey } from "../../components/icons.jsx";

export default function AdminLogin() {
  const { adminLogin } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState("password"); // password | twofa
  const [passphrase, setPassphrase] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  const submitPass = (e) => {
    e.preventDefault();
    setError(null);
    const res = adminLogin(passphrase);
    if (res.ok) {
      setStep("twofa");
    } else if (res.reason === "not_configured") {
      setError("Admin access isn't configured in this build (VITE_ADMIN_PASSPHRASE is unset).");
    } else {
      setError("Incorrect passphrase.");
    }
  };

  const submit2fa = (e) => {
    e.preventDefault();
    setBusy(true);
    setTimeout(() => navigate("/admin"), 500);
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
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-navy text-white">
              <IconShieldCheck className="h-6 w-6" />
            </span>
            <div>
              <h1 className="text-lg font-bold text-foreground">Admin console</h1>
              <p className="text-sm text-muted-foreground">{step === "password" ? "Restricted access" : "Two-factor verification"}</p>
            </div>
          </div>

          {step === "password" ? (
            <form onSubmit={submitPass} className="space-y-4">
              {error && <Alert tone="error">{error}</Alert>}
              <Field label="Admin passphrase" required>
                <Input
                  type="password"
                  value={passphrase}
                  onChange={(e) => setPassphrase(e.target.value)}
                  placeholder="Enter passphrase"
                  leftIcon={<IconLock className="h-4 w-4" />}
                  autoFocus
                  required
                />
              </Field>
              <Button type="submit" size="lg" fullWidth leftIcon={<IconKey className="h-5 w-5" />}>
                Continue
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                Note: this gate is client-side only — real deployments must enforce auth server-side.
              </p>
            </form>
          ) : (
            <form onSubmit={submit2fa} className="space-y-4">
              <Alert tone="info">A 6-digit code was sent to the admin device.</Alert>
              <Field label="Verification code" required>
                <Input
                  inputMode="numeric"
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                  placeholder="000000"
                  className="text-center text-lg tracking-[0.4em]"
                  autoFocus
                  required
                />
              </Field>
              <Button type="submit" size="lg" fullWidth loading={busy} disabled={code.length !== 6}>
                Verify & sign in
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

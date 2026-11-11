import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.jsx";
import { Button, Field, Input, Alert, cn } from "../../ui/index.js";
import { IconMail, IconLock, IconEye, IconEyeOff, IconUser, IconCheck } from "../../components/icons.jsx";

function strength(pw) {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++;
  if (/\d/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
}
const LABELS = ["Too short", "Weak", "Fair", "Good", "Strong"];
const COLORS = ["bg-border", "bg-scam", "bg-spam", "bg-primary", "bg-legit"];

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const s = strength(password);

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await register(email, password, name);
      navigate("/account-created");
    } catch (err) {
      setError(err?.message || "Couldn't create your account. Please try again.");
      setBusy(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-foreground">Create your account</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">Sync your checks and reports across devices, free.</p>

      <form onSubmit={submit} className="mt-7 space-y-4">
        {error && <Alert tone="error">{error}</Alert>}

        <Field label="Name" htmlFor="name" hint="Optional">
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" leftIcon={<IconUser className="h-4 w-4" />} />
        </Field>

        <Field label="Email" htmlFor="email" required>
          <Input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.lk" leftIcon={<IconMail className="h-4 w-4" />} required />
        </Field>

        <Field label="Password" htmlFor="password" required>
          <Input
            id="password"
            type={show ? "text" : "password"}
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 8 characters"
            leftIcon={<IconLock className="h-4 w-4" />}
            rightIcon={
              <button type="button" onClick={() => setShow((v) => !v)} aria-label={show ? "Hide password" : "Show password"} className="text-muted-foreground hover:text-foreground">
                {show ? <IconEyeOff className="h-4 w-4" /> : <IconEye className="h-4 w-4" />}
              </button>
            }
            required
          />
          {password && (
            <div className="mt-2 flex items-center gap-2">
              <div className="flex flex-1 gap-1">
                {[0, 1, 2, 3].map((i) => (
                  <span key={i} className={cn("h-1.5 flex-1 rounded-full", i < s ? COLORS[s] : "bg-border")} />
                ))}
              </div>
              <span className="w-16 text-right text-xs font-medium text-muted-foreground">{LABELS[s]}</span>
            </div>
          )}
        </Field>

        <label className="flex items-start gap-2.5 text-sm text-foreground-secondary">
          <input type="checkbox" required className="mt-0.5 h-4 w-4 rounded border-border-strong text-primary focus-visible:ring-4 focus-visible:ring-ring/40" />
          <span>
            I agree to the{" "}
            <Link to="/terms" className="font-semibold text-primary hover:underline">Terms</Link> and{" "}
            <Link to="/privacy" className="font-semibold text-primary hover:underline">Privacy Policy</Link>.
          </span>
        </label>

        <Button type="submit" size="lg" fullWidth loading={busy} leftIcon={!busy && <IconCheck className="h-5 w-5" />}>
          Create account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link to="/login" className="font-semibold text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}

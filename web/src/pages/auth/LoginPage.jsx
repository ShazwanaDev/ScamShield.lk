import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.jsx";
import { Button, Field, Input, Alert, Divider, IconButton } from "../../ui/index.js";
import { IconMail, IconLock, IconEye, IconEyeOff, IconLogIn, IconUser } from "../../components/icons.jsx";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await login(email, password);
      navigate("/app");
    } catch (err) {
      setError(err?.message || "Couldn't sign you in. Check your details and try again.");
      setBusy(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-foreground">Welcome back</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">Sign in to sync your history and reports.</p>

      <form onSubmit={submit} className="mt-7 space-y-4">
        {error && <Alert tone="error">{error}</Alert>}

        <Field label="Email" htmlFor="email" required>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.lk"
            leftIcon={<IconMail className="h-4 w-4" />}
            required
          />
        </Field>

        <Field label="Password" htmlFor="password" required>
          <Input
            id="password"
            type={show ? "text" : "password"}
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Your password"
            leftIcon={<IconLock className="h-4 w-4" />}
            rightIcon={
              <button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? "Hide password" : "Show password"} className="text-muted-foreground hover:text-foreground">
                {show ? <IconEyeOff className="h-4 w-4" /> : <IconEye className="h-4 w-4" />}
              </button>
            }
            required
          />
        </Field>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm text-foreground-secondary">
            <input type="checkbox" className="h-4 w-4 rounded border-border-strong text-primary focus-visible:ring-4 focus-visible:ring-ring/40" />
            Remember me
          </label>
          <Link to="/forgot-password" className="text-sm font-semibold text-primary hover:underline">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" size="lg" fullWidth loading={busy} leftIcon={!busy && <IconLogIn className="h-5 w-5" />}>
          Sign in
        </Button>
      </form>

      <Divider label="or" className="my-6" />

      <Button as={Link} to="/check" variant="secondary" fullWidth leftIcon={<IconUser className="h-4 w-4" />}>
        Continue as guest
      </Button>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Don't have an account?{" "}
        <Link to="/register" className="font-semibold text-primary hover:underline">
          Create one
        </Link>
      </p>
    </div>
  );
}

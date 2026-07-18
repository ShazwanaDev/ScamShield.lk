import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.jsx";
import Card from "../components/Card.jsx";
import Button from "../components/Button.jsx";
import TextField from "../components/TextField.jsx";
import ErrorBanner from "../components/ErrorBanner.jsx";
import { IconUser } from "../components/icons.jsx";
import { ApiError } from "../lib/api.js";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname ?? "/history";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    const errors = {};
    if (!EMAIL_PATTERN.test(email)) errors.email = "Enter a valid email address.";
    if (!password) errors.password = "Enter your password.";
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setLoading(true);
    setError(null);
    try {
      await login(email.trim(), password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't log in. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-4 py-12 sm:px-6">
      <Card as="form" onSubmit={handleSubmit} noValidate className="space-y-5">
        <div className="text-center">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-brand/10 text-brand">
            <IconUser className="h-6 w-6" />
          </div>
          <h1 className="mt-3 text-xl font-black">Log in</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Sign in to save and revisit your message-check history.
          </p>
        </div>

        <TextField
          id="login-email"
          label="Email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={fieldErrors.email}
          required
        />
        <TextField
          id="login-password"
          label="Password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={fieldErrors.password}
          required
        />

        {error && <ErrorBanner>{error}</ErrorBanner>}

        <Button type="submit" loading={loading} className="w-full">
          Log in
        </Button>

        <div className="space-y-2 text-center text-sm">
          <p className="text-muted-foreground">
            No account?{" "}
            <Link to="/register" className="font-medium text-brand hover:underline">
              Sign up
            </Link>
          </p>
          <Link to="/check" className="block font-medium text-muted-foreground hover:text-foreground hover:underline">
            Continue without an account
          </Link>
        </div>
      </Card>
    </div>
  );
}

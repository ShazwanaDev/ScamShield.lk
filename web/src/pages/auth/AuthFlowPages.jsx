import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Field, Input, Alert, cn } from "../../ui/index.js";
import * as Icons from "../../components/icons.jsx";

/* ── Forgot password ────────────────────────────────────────────── */

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="text-center">
        <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Icons.IconMail className="h-7 w-7" />
        </span>
        <h1 className="mt-5 text-2xl font-extrabold text-foreground">Check your email</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          If an account exists for <strong className="text-foreground">{email}</strong>, we've sent a link to reset your password.
        </p>
        <Button as={Link} to="/login" variant="secondary" className="mt-6" fullWidth>
          Back to sign in
        </Button>
        <button onClick={() => setSent(false)} className="mt-3 text-sm text-muted-foreground hover:text-foreground">
          Use a different email
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-foreground">Forgot your password?</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">Enter your email and we'll send you a reset link.</p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSent(true);
        }}
        className="mt-7 space-y-4"
      >
        <Field label="Email" htmlFor="fp-email" required>
          <Input id="fp-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.lk" leftIcon={<Icons.IconMail className="h-4 w-4" />} required />
        </Field>
        <Button type="submit" size="lg" fullWidth leftIcon={<Icons.IconSend className="h-5 w-5" />}>
          Send reset link
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Remembered it?{" "}
        <Link to="/login" className="font-semibold text-primary hover:underline">Sign in</Link>
      </p>
    </div>
  );
}

/* ── Reset password ─────────────────────────────────────────────── */

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const [pw, setPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState(null);

  const submit = (e) => {
    e.preventDefault();
    if (pw.length < 8) return setError("Password must be at least 8 characters.");
    if (pw !== confirm) return setError("Passwords don't match.");
    navigate("/login");
  };

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-foreground">Set a new password</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">Choose a strong password you don't use elsewhere.</p>
      <form onSubmit={submit} className="mt-7 space-y-4">
        {error && <Alert tone="error">{error}</Alert>}
        <Field label="New password" htmlFor="np" required>
          <Input id="np" type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="At least 8 characters" leftIcon={<Icons.IconLock className="h-4 w-4" />} required />
        </Field>
        <Field label="Confirm password" htmlFor="cp" required>
          <Input id="cp" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Re-enter password" leftIcon={<Icons.IconLock className="h-4 w-4" />} required />
        </Field>
        <Button type="submit" size="lg" fullWidth leftIcon={<Icons.IconCheck className="h-5 w-5" />}>
          Update password
        </Button>
      </form>
    </div>
  );
}

/* ── OTP verification ───────────────────────────────────────────── */

export function OtpPage() {
  const navigate = useNavigate();
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const refs = useRef([]);

  const setDigit = (i, val) => {
    const v = val.replace(/\D/g, "").slice(-1);
    setDigits((d) => {
      const next = [...d];
      next[i] = v;
      return next;
    });
    if (v && i < 5) refs.current[i + 1]?.focus();
  };
  const onKey = (i, e) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) refs.current[i - 1]?.focus();
  };

  const complete = digits.every(Boolean);

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-foreground">Enter verification code</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">We sent a 6-digit code to your phone. Enter it below.</p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          navigate("/app");
        }}
        className="mt-7"
      >
        <div className="flex justify-between gap-2">
          {digits.map((d, i) => (
            <input
              key={i}
              ref={(el) => (refs.current[i] = el)}
              inputMode="numeric"
              maxLength={1}
              value={d}
              onChange={(e) => setDigit(i, e.target.value)}
              onKeyDown={(e) => onKey(i, e)}
              aria-label={`Digit ${i + 1}`}
              className="h-14 w-full rounded-lg border border-border bg-surface text-center text-xl font-bold text-foreground focus-visible:border-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/40"
            />
          ))}
        </div>
        <Button type="submit" size="lg" fullWidth disabled={!complete} className="mt-6" leftIcon={<Icons.IconCheck className="h-5 w-5" />}>
          Verify
        </Button>
      </form>
      <p className="mt-5 text-center text-sm text-muted-foreground">
        Didn't get it?{" "}
        <button className="font-semibold text-primary hover:underline">Resend code</button>
      </p>
    </div>
  );
}

/* ── Verify email ───────────────────────────────────────────────── */

export function VerifyEmailPage() {
  return (
    <div className="text-center">
      <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Icons.IconMail className="h-7 w-7" />
      </span>
      <h1 className="mt-5 text-2xl font-extrabold text-foreground">Verify your email</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        We've sent a verification link to your inbox. Click it to activate your account, then come back to sign in.
      </p>
      <Button as={Link} to="/login" className="mt-6" fullWidth>
        I've verified — sign in
      </Button>
      <button className="mt-3 text-sm text-muted-foreground hover:text-foreground">Resend verification email</button>
    </div>
  );
}

/* ── Account created ────────────────────────────────────────────── */

export function AccountCreatedPage() {
  return (
    <div className="text-center">
      <span className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-legit-light text-legit">
        <Icons.IconCheckCircle className="h-8 w-8" />
      </span>
      <h1 className="mt-5 text-2xl font-extrabold text-foreground">You're all set!</h1>
      <p className="mt-2 text-sm text-muted-foreground">Your account is ready. Start checking messages and building your private history.</p>
      <div className="mt-7 space-y-3">
        <Button as={Link} to="/app" size="lg" fullWidth leftIcon={<Icons.IconHome className="h-5 w-5" />}>
          Go to dashboard
        </Button>
        <Button as={Link} to="/app/check" variant="secondary" fullWidth>
          Check a message
        </Button>
      </div>
    </div>
  );
}

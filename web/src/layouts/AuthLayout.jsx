import { Link, Outlet } from "react-router-dom";
import Brand from "../components/Brand.jsx";
import { IconShieldCheck, IconGlobe, IconWand, IconLock } from "../components/icons.jsx";

const POINTS = [
  { icon: IconGlobe, text: "Understands Sinhala, Tamil, English, Singlish & code-mixed SMS" },
  { icon: IconWand, text: "Explains every result — see the exact risky phrases" },
  { icon: IconLock, text: "Privacy-first — your messages are analysed, not shared" },
];

export default function AuthLayout() {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Brand panel */}
      <div className="relative hidden w-[44%] flex-col justify-between overflow-hidden bg-gradient-navy p-10 text-white lg:flex xl:w-[48%]">
        <div className="absolute inset-0 bg-grid opacity-50" aria-hidden="true" />
        <div className="relative">
          <Brand to="/" tone="dark" />
        </div>
        <div className="relative max-w-md">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-teal-light ring-1 ring-inset ring-white/15">
            <IconShieldCheck className="h-4 w-4" />
            Scam detection for Sri Lanka
          </span>
          <h2 className="mt-5 text-3xl font-extrabold leading-tight">Know before you trust the message.</h2>
          <ul className="mt-7 space-y-4">
            {POINTS.map((p) => (
              <li key={p.text} className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10 text-teal-light">
                  <p.icon className="h-4 w-4" />
                </span>
                <span className="text-sm text-white/80">{p.text}</span>
              </li>
            ))}
          </ul>
        </div>
        <p className="relative text-xs text-white/40">© {new Date().getFullYear()} ScamShield LK — research project.</p>
      </div>

      {/* Form panel */}
      <div className="flex flex-1 flex-col">
        <div className="flex items-center justify-between px-6 py-5 lg:hidden">
          <Brand to="/" />
        </div>
        <div className="flex flex-1 items-center justify-center px-4 py-8 sm:px-6">
          <div className="w-full max-w-sm">
            <Outlet />
          </div>
        </div>
        <div className="px-6 py-5 text-center">
          <Link to="/" className="text-sm text-muted-foreground transition hover:text-foreground">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
